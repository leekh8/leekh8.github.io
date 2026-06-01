---
title: "PyInstaller --collect-data를 빠뜨리면 JSON 파일이 런타임에 사라진다"
description: "개발 환경에서는 멀쩡히 동작하던 JSON 데이터 로더가 PyInstaller 바이너리에서 빈 dict를 반환했습니다. --collect-submodules와 --collect-data의 차이, sys._MEIPASS 폴백 패턴을 정리합니다."
date: 2026-06-01
update: 2026-06-01
tags:
  - Python
  - PyInstaller
  - 패키징
  - 트러블슈팅
  - CLI
category: "Code N Solve"
---

Linux 보안 점검 CLI 도구를 만들고 있었다. OS 별 End-of-Support 날짜를 관리하는 JSON 파일을 패키지 내부에 두고, 런타임에 읽어서 판정에 쓰는 구조였다.

개발 환경에서는 잘 됐다. `python run.py`로 돌리면 EoS 테이블을 정상적으로 읽고, CentOS 6 같은 지원 종료 OS를 정확히 잡아냈다.

PyInstaller로 `--onefile` 바이너리를 빌드하고 실서버에서 돌렸다. EoS 체크 항목 전부가 틀린 결과를 냈다.

---

## 증상

바이너리 실행 로그에 이런 메시지가 찍혔다.

```
[EoS 체크] EoS 테이블 0개, 기준일 unknown
```

개발 환경에서는 7개 배포판, 수십 개 버전이 잡히던 테이블이 0개다. `기준일 unknown`은 JSON 파일을 아예 못 읽었다는 뜻이다. 결과적으로 EoS 체크 항목이 모두 잘못된 판정을 냈다.

---

## 코드 구조

데이터 로더는 이렇게 생겼다.

```python
# linux/os_eos.py
import json
from pathlib import Path
from functools import lru_cache

def _data_path() -> Path:
    return Path(__file__).parent / "data" / "os_eos.json"

@lru_cache(maxsize=1)
def _load() -> dict:
    p = _data_path()
    if not p.exists():
        return {"distributions": {}, "data_as_of": "unknown"}
    return json.loads(p.read_text(encoding="utf-8"))
```

`Path(__file__).parent`로 현재 파일 기준 상대 경로를 잡는 방식이다. 개발 환경에서는 `linux/os_eos.py` 옆에 `linux/data/os_eos.json`이 있으니 잘 된다.

빌드 명령은 이랬다.

```bash
pyinstaller run.py --onefile \
  --collect-submodules=linux \
  --collect-submodules=common
```

---

## 원인: `--collect-submodules`는 Python 파일만 챙긴다

`--collect-submodules=linux`는 `linux` 패키지 안의 **Python 모듈(.py 파일)**을 재귀적으로 수집한다. `linux/os_eos.py`, `linux/evaluators/` 하위 파일들이 여기에 해당한다.

**데이터 파일은 포함되지 않는다.**

`linux/data/os_eos.json`은 `.py`가 아니라 `.json`이다. `--collect-submodules`는 이 파일을 모른다. 빌드된 바이너리 안에 `os_eos.json`이 없다.

런타임에 `_data_path()`가 반환하는 경로에 파일이 없으니 `_load()`는 폴백으로 빈 dict를 반환한다. EoS 테이블 0개.

### `--collect-submodules` vs `--collect-data`

| 옵션 | 수집 대상 |
|---|---|
| `--collect-submodules=pkg` | `.py` 파일 (Python 모듈) |
| `--collect-data=pkg` | 패키지 디렉토리 내 **모든 파일** (JSON, YAML, txt, 템플릿 등) |

데이터 파일이 패키지 안에 있다면 `--collect-data`를 써야 한다.

---

## 해결 1: `--collect-data` 추가

```bash
pyinstaller run.py --onefile \
  --collect-submodules=linux \
  --collect-submodules=common \
  --collect-data=linux          # 이 한 줄 추가
```

`--collect-data=linux`는 `linux/` 디렉토리 안의 모든 파일을 바이너리에 포함시킨다. `linux/data/os_eos.json`도 함께 번들된다.

특정 파일만 지정하고 싶다면 `--add-data`를 쓸 수 있다.

```bash
--add-data "linux/data/os_eos.json:linux/data"
# 형식: "소스경로:바이너리_내_대상경로"
# Windows는 콜론(:) 대신 세미콜론(;)
```

---

## 해결 2: `sys._MEIPASS` 폴백

`--collect-data`로 파일을 번들에 포함시켜도, 런타임에 경로를 올바르게 찾아야 한다.

PyInstaller `--onefile` 바이너리가 실행되면 임시 디렉토리에 번들 내용을 압축 해제한다. 이 임시 디렉토리 경로가 `sys._MEIPASS`에 들어간다. 일반 Python 환경에서는 `sys._MEIPASS`가 존재하지 않는다.

`Path(__file__).parent`는 PyInstaller 런타임에서 엉뚱한 경로를 반환할 수 있다. 올바른 패턴은 `sys._MEIPASS`를 우선 확인하는 것이다.

```python
import sys
from pathlib import Path

def _data_path() -> Path:
    # PyInstaller onefile 런타임: sys._MEIPASS = 압축 해제된 임시 디렉토리
    base = getattr(sys, "_MEIPASS", None)
    if base:
        return Path(base) / "linux" / "data" / "os_eos.json"
    # 일반 Python 환경: 파일 기준 상대 경로
    return Path(__file__).parent / "data" / "os_eos.json"
```

`getattr(sys, "_MEIPASS", None)`으로 속성이 없을 때 None을 반환하게 처리하면, 개발 환경과 바이너리 환경 모두에서 동작하는 단일 코드가 된다.

---

## 최종 코드

```python
# linux/os_eos.py
import json
import sys
from datetime import date
from functools import lru_cache
from pathlib import Path


def _data_path() -> Path:
    base = getattr(sys, "_MEIPASS", None)
    if base:
        return Path(base) / "linux" / "data" / "os_eos.json"
    return Path(__file__).parent / "data" / "os_eos.json"


@lru_cache(maxsize=1)
def _load() -> dict:
    p = _data_path()
    if not p.exists():
        return {"distributions": {}, "data_as_of": "unknown", "schema_version": 0}
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return {"distributions": {}, "data_as_of": "unknown", "schema_version": 0}


def lookup(os_id: str, version_id: str) -> str | None:
    data = _load()
    by_ver = data.get("distributions", {}).get(os_id.lower(), {})
    if version_id and version_id in by_ver:
        return by_ver[version_id]
    major = (version_id or "").split(".")[0]
    if major and major in by_ver:
        return by_ver[major]
    return None


def data_as_of() -> str:
    return _load().get("data_as_of", "unknown")
```

빌드 명령:

```bash
pyinstaller run.py --onefile \
  --collect-submodules=linux \
  --collect-data=linux
```

---

## 정리

- `--collect-submodules=pkg`: `.py` 모듈만 수집. JSON 같은 데이터 파일 미포함.
- `--collect-data=pkg`: 패키지 내 모든 파일 수집. 데이터 파일도 포함.
- PyInstaller `--onefile` 런타임에서 번들 파일은 `sys._MEIPASS` 하위에 압축 해제된다.
- 데이터 파일 경로를 잡을 때는 `Path(__file__).parent` 단독이 아닌 `sys._MEIPASS` 폴백을 함께 써야 개발 환경과 바이너리 환경 모두 동작한다.

증상이 "개발에서는 되는데 바이너리에서만 안 된다"이고, 파일을 읽는 코드가 있다면 `--collect-data` 누락을 먼저 의심하면 된다.
