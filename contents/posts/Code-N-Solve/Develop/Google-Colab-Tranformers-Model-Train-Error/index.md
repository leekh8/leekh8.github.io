---
title: "🚀 Google Colab에서 Transformers 모델 학습 시 발생하는 오류 해결"
description: "Google Colab 환경에서 Transformers 모델을 학습하는 과정에서 발생할 수 있는 다양한 오류를 해결하는 방법에 대한 설명. 라이브러리 설치 문제, 파일 경로 설정, 데이터 전처리 및 패딩 문제 해결 등을 포함."
date: 2024-11-08
update: 2024-11-08
tags:
  - Code N Solve
  - Google Colab
  - Transformers
  - Hugging Face
  - NLP 모델
  - 데이터 전처리
  - 오류 해결
series: "Code N Solve"
---

## Code N Solve 📘: Google Colab에서 Transformers 모델 학습 시 발생하는 오류 해결 가이드

Transformer 기반 NLP 모델을 Google Colab에서 학습하는 도중 초보자가 겪을 수 있는 다양한 오류에 대해 정리해보았다.

특히 라이브러리 설치 문제, 파일 경로 설정, 데이터 전처리 문제 등 다양한 오류를 이해하고 해결하는 방법을 알아보자.

### Google Colab?

- 클라우드 기반의 Jupyter 노트북 환경으로, Python 코드를 실행하고 머신러닝 모델을 학습하는 데 유용하다.
- 특히, GPU를 무료로 제공하여 대규모 데이터셋을 다루는데 큰 장점을 가지고 있다.

### Transformers 라이브러리 [^1]

- Hugging Face[^2]에서 제공하는 자연어 처리 (NLP) 모델을 쉽게 사용할 수 있도록 도와주는 도구이다.

## 문제1: 라이브러리 설치 오류 - `sklearn`과 `datasets`

- Google Colab에서 Transformers 모델 학습을 시작하려면 `Hugging Face transformers`, `torch`, `datasets` 등의 라이브러리가 필요하다.
- 하지만 `sklearn`을 설치할 때 다음과 같은 오류가 발생할 수 있다.

  ```bash
    ValueError: metadata-generation-failed
  ```

- 이 오류는 `sklearn` 대신 `scikit-learn`을 설치해야 하기 때문에 발생한다.

### 해결 방법

- `sklearn` 대신 `scikit-learn`을 설치한다.[^3]

  ```bash
    !pip install -U scikit-learn
  ```

- 그 외 필요한 라이브러리도 한 번에 설치한다.

  ```bash
    !pip install transformers torch datasets
  ```

- 이제 라이브러리 설치 관련 오류는 해결된다.

## 문제 2: Google Drive 파일 경로 설정 문제[^4]

- 데이터셋을 Colab에서 사용하려면 Google Drive에 저장된 파일을 Colab에 연결해야 한다.
- Colab에 Drive를 마운트하지 않으면 `FileNotFoundError` 오류가 발생한다.

### 해결 방법

- Google Drive를 Colab에 마운트한다.

  ```python
    from google.colab import drive
    drive.mount('/content/drive')
  ```

- 파일 경로를 Google Drive 경로로 지정한다.

  - 예를 들어, `Dataset.json` 파일이 Google Drive의 `Dataset` 폴더에 있다면, 다음과 같이 설정한다.

  ```python
    import pandas as pd
    file_path = "/content/drive/MyDrive/Dataset/Dataset.json"
    data = pd.read_json(file_path, lines=True)
  ```

  - `/content/drive/`는 Google Drive에 마운트했을때의 기본 경로다.

## 문제 3: Transformers 모델 학습 시 데이터 패딩 오류[^2]

- 모델 학습 중 배치 데이터의 길이가 일정하지 않으면 `ValueError: expected sequence of length ...` 오류가 발생할 수 있다.
- 이는 데이터의 길이가 다르기 때문에 발생한다.

### 해결 방법

- 모든 입력 데이터의 길이를 맞추기 위해 `DataCollatorWithPadding`을 사용한다.

```python
  from transformers import DataCollatorWithPadding

  data_collator = DataCollatorWithPadding(tokenizer=tokenizer)

  trainer = Trainer(
      model=model,
      args=training_args,
      train_dataset=tokenized_dataset,
      data_collator=data_collator,  # 자동 패딩 추가
  )
```

- 이렇게 설정하면, `Trainer`가 데이터의 길이를 자동으로 맞춰 오류를 방지할 수 있다.

## 문제 4: 모델 학습 시 `wandb` 로그인 요청[^5]

- Hugging Face `Trainer`는 Weights & Biases(`wandb`)를 사용해 학습 과정을 추적할 수 있다.
- 하지만 로그인 요청이 나타날 수 있다.

### 해결 방법

- `wandb` 기능을 사용하지 않으려면 `Trainer` 설정에서 `report_to="none"`으로 지정하여 비활성화한다.

```python
  training_args = TrainingArguments(
      output_dir="./results",
      evaluation_strategy="epoch",
      per_device_train_batch_size=8,
      per_device_eval_batch_size=8,
      num_train_epochs=3,
      weight_decay=0.01,
      report_to="none"  # wandb 비활성화
  )
```

- 이렇게 설정하면 `wandb` 로그인 요청 없이 학습이 진행된다.

## 결론

Google Colab에서 Transformers 모델을 학습하면서 발생하는 주요 오류들을 해결하는 방법을 살펴보았다.

각 단계에서 발생할 수 있는 문제들을 이해하고 이를 해결해 나가면, Colab 환경에서 효율적으로 모델을 학습시킬 수 있다.

이 글을 통해 Google Colab에서 발생할 수 있는 다양한 문제를 해결하고, 보다 안정적으로 NLP 모델을 학습할 수 있기를 바랍니다.

[^1]: https://wikidocs.net/book/8056
[^2]: https://huggingface.co/learn/nlp-course/ko/chapter8/2
[^3]: https://heekangpark.github.io/ml/shorts/scikit-learn-basics
[^4]: https://wikidocs.net/226032
[^5]: https://discuss.huggingface.co/t/how-to-turn-wandb-off-in-trainer/6237
