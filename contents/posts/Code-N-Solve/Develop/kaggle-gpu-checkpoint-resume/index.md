---
title: "Kaggle 무료 GPU로 LLM 파인튜닝하다 quota가 끊겼다 — checkpoint 재개 전략 총정리"
description: "Kaggle T4로 3B 모델을 파인튜닝하던 중 주간 무료 quota가 46% 지점에서 소진됐습니다. checkpoint에서 학습을 이어붙이는 과정에서 만난 세 가지 함정 — 텐서 수 불일치, 디스크 풀, OOM 메모리 잔존 — 과 해결책을 정리합니다."
date: 2026-06-23
update: 2026-06-23
tags:
  - 머신러닝
  - LLM
  - 파인튜닝
  - Kaggle
  - PyTorch
  - 트러블슈팅
category: "Code N Solve"
---

도메인 특화 데이터셋으로 Qwen2.5-3B 모델을 LoRA 파인튜닝하는 작업을 하고 있었다. GPU는 Kaggle이 무료로 주는 T4 16GB를 썼다. 1 epoch이 약 3,690 step이고, 4bit 양자화 + LoRA로도 몇 시간이 걸리는 분량이었다.

무료 GPU에는 한 가지 분명한 문제가 있다. **끊긴다.**

학습이 46% 진행된 시점(checkpoint-1700)에서 Kaggle T4의 주간 무료 quota가 0시간이 됐다. T4 x2도, P100도 전부 소진. 다음 주 월요일 리셋까지 기다려야 했다. 학습을 처음부터 다시 돌리는 건 quota 낭비다. 중간부터 이어서 돌려야 했다.

이 글은 무료 GPU 환경에서 **끊기는 학습을 checkpoint로 이어붙이는** 전체 전략과, 그 과정에서 실제로 밟은 함정들을 정리한 것이다.

---

## 무료 GPU 학습은 세 가지 방식으로 끊긴다

먼저 "끊김"이 무엇인지 구분해야 대비가 된다.

| 끊김 종류 | 원인 | 복구 시점 |
|---|---|---|
| **quota 소진** | 주간 무료 GPU 시간(예: 주 30시간) 초과 | 주간 리셋까지 대기 |
| **세션 타임아웃** | 연속 실행 시간 한도(예: 9~12시간) 초과 | 즉시 새 세션 가능 |
| **OOM / 크래시** | 메모리 부족, 런타임 에러 | 커널 재시작 후 즉시 |

이 셋은 복구 시점이 다르지만, 대응은 같다. **언제 끊겨도 잃는 진행분이 최소가 되도록 자주 저장하고, 저장된 지점에서 정확히 이어붙인다.**

---

## 1단계: 자주, 그러나 디스크를 넘기지 않게 저장한다

HuggingFace `Trainer`는 `save_steps` 간격마다 checkpoint를 저장한다. 기본값은 보통 500인데, 무료 GPU에서는 너무 크다. 끊기는 순간 최대 500 step을 날리기 때문이다.

```python
from transformers import TrainingArguments

args = TrainingArguments(
    output_dir="/kaggle/working/outputs",
    save_steps=100,          # 끊김 대비 — 100 step마다 저장
    save_total_limit=2,      # 최근 2개만 유지 (디스크 절약)
    save_only_model=True,    # optimizer state 제외 (뒤에서 설명)
    # ...
)
```

`save_steps`를 줄이면 복구 손실은 작아지지만 저장 오버헤드와 디스크 사용량이 늘어난다. 나는 100으로 시작했다가, 끊김이 잦아 50까지 내렸다. 환경에 따라 균형점을 찾으면 된다.

`save_total_limit`은 디스크가 차지 않도록 오래된 checkpoint를 자동 정리한다. 이게 왜 중요한지는 아래 디스크 풀 함정에서 다시 나온다.

---

## 2단계: checkpoint를 잃지 않는 경로에 저장한다

여기서 첫 번째로 당했다. `output_dir`을 상대경로로 줬더니, **세션이 재시작되면 checkpoint가 사라졌다.**

Kaggle 노트북은 작업 디렉토리가 세션마다 달라질 수 있고, 영속되는 위치가 따로 있다. Kaggle의 경우 `/kaggle/working/` 아래에 저장한 것만 세션 출력으로 보존된다. 상대경로로 저장하면 임시 위치에 쓰였다가 세션 종료와 함께 날아간다.

```python
# ❌ 세션 재시작 시 소실 가능
output_dir="outputs"

# ✅ 영속 경로에 명시적으로 저장
output_dir="/kaggle/working/outputs"
```

checkpoint를 외부(예: Kaggle Dataset, Google Drive, HuggingFace Hub)로 추가 백업해두면 더 안전하다. 노트북 출력 자체가 날아가는 경우까지 대비할 수 있다.

---

## 3단계: 저장된 지점에서 이어붙인다

quota가 리셋되거나 새 세션을 열면, 처음부터가 아니라 마지막 checkpoint에서 재개한다. `Trainer.train()`에 `resume_from_checkpoint`만 넘기면 된다.

```python
trainer.train(resume_from_checkpoint="/kaggle/working/outputs/checkpoint-1700")
```

이러면 optimizer state, learning rate 스케줄, step 카운터까지 복원되어 마치 끊긴 적 없던 것처럼 이어진다. 단순히 모델 가중치만 로드하는 것과는 다르다. **학습 재개는 가중치뿐 아니라 옵티마이저 상태와 스케줄러 상태가 함께 복원돼야 한다.**

문제는, 이 단순해 보이는 한 줄에서 함정이 줄줄이 나왔다는 것이다.

---

## 함정 1: resume 시 "텐서 수 불일치" 에러

재개를 시도하자 이런 에러가 났다.

```
CheckpointError: ... number of tensors mismatch ...
```

원인은 **gradient checkpointing의 재진입(reentrant) 모드**였다. PyTorch의 gradient checkpointing은 메모리를 아끼려고 forward를 두 번 계산하는데, 기본 reentrant 구현은 저장/복원 시 텐서 구조가 어긋날 수 있다.

해결은 비재진입(non-reentrant) 모드를 명시하는 것이다.

```python
model.gradient_checkpointing_enable(
    gradient_checkpointing_kwargs={"use_reentrant": False}
)
```

`use_reentrant=False`는 더 새롭고 안정적인 구현이다. checkpoint 저장/복원과 호환이 잘 되고, 대부분의 경우 이쪽이 권장된다. 재개 학습을 할 거라면 처음부터 이 옵션으로 학습을 시작하는 게 좋다.

---

## 함정 2: 첫 checkpoint 저장에서 디스크 풀

`save_steps`를 50으로 줄이고 다시 돌렸더니, 이번엔 첫 checkpoint 저장 단계에서 터졌다.

```
... unexpected pos ... (디스크 쓰기 실패)
```

Kaggle working 디렉토리는 용량 한도(예: 20GB)가 있다. checkpoint 하나에는 모델 가중치뿐 아니라 **optimizer state**가 함께 저장되는데, 이게 의외로 크다. AdamW는 파라미터마다 1차/2차 모멘트를 들고 있어서, optimizer state만 5GB에 달했다. `save_total_limit=2`로 2개를 유지하다 보면, 정리 직전 순간에는 3개가 동시에 존재해서 `5GB × 3 + 모델 = 한도 초과`가 된다.

해결책은 두 가지를 함께 썼다.

```python
args = TrainingArguments(
    output_dir="/kaggle/working/outputs",
    save_steps=50,
    save_total_limit=2,
    save_only_model=True,         # ① optimizer state를 저장 안 함
    optim="paged_adamw_8bit",     # ② 8bit optimizer로 메모리·용량 절감
    # ...
)
```

`save_only_model=True`는 checkpoint에 optimizer state를 빼고 모델만 저장한다. 디스크는 크게 절약되지만 트레이드오프가 있다 — **optimizer state 없이 재개하면 모멘텀이 초기화**되므로, 정밀한 재개가 필요하면 이 옵션은 신중히 써야 한다. 나는 LoRA 어댑터만 학습하는 구성이라 영향이 제한적이어서 채택했다.

학습 시작 전에 디스크 여유를 어서트해두면 이런 사고를 사전에 잡을 수 있다.

```python
import shutil
free_gb = shutil.disk_usage("/kaggle/working").free / 1e9
assert free_gb >= 10, f"디스크 여유 부족: {free_gb:.1f}GB"
```

---

## 함정 3: OOM 이후 GPU 메모리가 갇힌다

한 번 CUDA OOM이 난 뒤, 코드를 고치고 다시 모델 로드 셀을 실행했더니 또 OOM이 났다. 이상했다. 메모리를 줄였는데 왜?

GPU 상태를 찍어보니:

```
14.34GB 사용 중 / 1.8MB free
```

**이전 OOM에서 죽은 프로세스가 GPU 메모리를 그대로 붙들고 있었다.** Python 프로세스(노트북 커널)가 살아 있는 한, 한 번 할당된 CUDA 메모리는 셀을 다시 실행한다고 해제되지 않는다. `torch.cuda.empty_cache()`나 `gc.collect()`로도 완전히 회수되지 않는 경우가 있다.

가장 확실한 해결은 커널 자체를 재시작하는 것이다.

```
Kaggle: Run → Restart Kernel → 처음 셀부터 Run All
```

커널을 재시작하면 Python 프로세스가 죽으면서 GPU 메모리가 깨끗하게 비워진다. **OOM이 한 번 나면, 코드만 고치지 말고 커널을 재시작하는 것을 기본 절차로 삼는 게 낫다.** 메모리 잔재 위에서 디버깅하면 원인을 잘못 짚게 된다.

재시작 후에도 안전하게 가려면 학습 직전 GPU 여유를 어서트한다.

```python
import torch
free, total = torch.cuda.mem_get_info()
assert free / 1e9 >= 10, f"GPU 여유 부족: {free/1e9:.1f}GB — 커널 재시작 필요"
```

---

## 끊김에 강한 학습 셋업 체크리스트

지금까지의 교훈을 한 셋업으로 정리하면 이렇다.

```python
# 1. 영속 경로 + 자주 저장 + 디스크 보호
args = TrainingArguments(
    output_dir="/kaggle/working/outputs",  # 영속 경로
    save_steps=50,                          # 자주 저장
    save_total_limit=2,                     # 오래된 것 정리
    save_only_model=True,                   # optimizer state 제외 (트레이드오프 인지)
    optim="paged_adamw_8bit",               # optimizer 메모리 절감
)

# 2. 재개 호환 gradient checkpointing
model.gradient_checkpointing_enable(
    gradient_checkpointing_kwargs={"use_reentrant": False}
)

# 3. 학습 직전 디스크·GPU 여유 어서트
import shutil, torch
assert shutil.disk_usage("/kaggle/working").free / 1e9 >= 10
assert torch.cuda.mem_get_info()[0] / 1e9 >= 10

# 4. 재개 (첫 실행 시엔 None, 이어붙일 땐 경로 지정)
trainer.train(resume_from_checkpoint="/kaggle/working/outputs/checkpoint-1700")
```

---

## 정리

- 무료 GPU 학습은 **반드시 끊긴다고 가정**하고 시작한다. quota 소진, 세션 타임아웃, OOM 모두 동일하게 대비된다.
- **자주 저장**(`save_steps`)하되 **디스크 한도**(`save_total_limit`, `save_only_model`)를 함께 관리한다. optimizer state가 생각보다 크다.
- checkpoint는 **영속 경로**(`/kaggle/working`)에 저장하고, 가능하면 외부 백업까지.
- 재개는 `resume_from_checkpoint` 한 줄이지만, **`use_reentrant=False`로 학습을 시작**해둬야 텐서 불일치를 피한다.
- **OOM이 나면 커널을 재시작**한다. 메모리 잔재 위에서 디버깅하지 않는다.

무료 GPU는 끊긴다는 게 약점이지만, checkpoint 전략만 제대로 잡아두면 며칠에 걸쳐서라도 학습을 완주할 수 있다. 핵심은 "끊기지 않게 하는 것"이 아니라 "**언제 끊겨도 손실 없이 이어붙이는 것**"이다.
