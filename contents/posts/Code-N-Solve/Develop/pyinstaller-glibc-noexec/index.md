---
title: "PyInstaller 바이너리를 CentOS 6부터 Rocky 9까지 돌리는 법"
description: "Rocky 9에서 빌드한 바이너리가 CentOS 6에서 GLIBC_2.34 not found로 실행이 안 됐습니다. 빌드 서버를 CentOS 6.5로 낮추는 전략과, 보안 하드닝 서버에서 만나는 /tmp noexec 문제와 --runtime-tmpdir 해결법을 정리합니다."
date: 2026-06-09
update: 2026-06-09
tags:
  - Python
  - PyInstaller
  - Linux
  - 패키징
  - 트러블슈팅
  - CLI
category: "Code N Solve"
---

Python CLI 도구를 여러 Linux 배포판에 배포해야 하는 상황이 생겼다. 대상 서버가 CentOS 6부터 Rocky Linux 9까지 다양했다. Python 3이 없는 서버도 있었고, 버전이 제각각인 서버도 있었다. 가장 단순한 해결책은 PyInstaller로 `--onefile` 바이너리를 만드는 것이었다. Python과 코드를 한 파일에 묶으면 대상 서버에 아무것도 설치할 필요가 없다.

그런데 막상 배포해보니 예상치 못한 문제가 두 개 나왔다.

---

## 문제 1: GLIBC_2.34 not found

개발 서버(Rocky Linux 9)에서 빌드한 바이너리를 CentOS 6 서버에 복사해서 실행했다.

```
./run: /lib/libc.so.6: version 'GLIBC_2.34' not found (required by ./run)
```

바이너리가 실행조차 안 됐다.

### 원인: glibc 상위 호환만 보장된다

PyInstaller는 Python 인터프리터를 바이너리에 묶는다. 이때 Python 인터프리터는 **빌드 시점의 glibc에 동적 링크**된다. glibc는 상위 호환(하위 버전 glibc를 쓰는 시스템에서 상위 버전 glibc를 요구하는 바이너리 실행 불가)만 보장한다. 반대는 안 된다.

| 빌드 OS | glibc | 실행 가능 대상 |
|---|---|---|
| Rocky Linux 9 | 2.34 | glibc 2.34 이상만 |
| CentOS 7 | 2.17 | glibc 2.17 이상 |
| CentOS 6.5 | 2.12 | glibc 2.12 이상 (거의 모든 Linux) |

Rocky 9에서 빌드하면 Rocky 9에서만 돌아간다. CentOS 6에서 빌드하면 CentOS 6부터 Rocky 9까지 전부 돌아간다.

### 해결: 빌드 서버를 가장 낮은 glibc OS로 맞춘다

별도의 CentOS 6.5 빌드 서버를 구성했다. CentOS 6는 공식 지원이 끝났기 때문에 기본 yum 미러가 동작하지 않는다. `vault.centos.org`로 전환하고 버전을 고정해야 한다.

```bash
# /etc/yum.repos.d/CentOS-Base.repo
[base]
baseurl=http://vault.centos.org/6.5/os/$basearch/

[updates]
baseurl=http://vault.centos.org/6.5/updates/$basearch/

[extras]
baseurl=http://vault.centos.org/6.5/extras/$basearch/
```

CentOS 6의 기본 Python은 2.6이고, Python 3을 소스 컴파일해야 한다. CentOS 6의 OpenSSL(0.9.8)은 Python 3의 SSL 모듈을 빌드할 수 없어서 OpenSSL도 소스 컴파일이 필요하다.

```bash
# OpenSSL 1.1.1 소스 컴파일
./config --prefix=/usr/local/openssl shared
make -j$(nproc) && make install

# Python 3.9 소스 컴파일
./configure --with-openssl=/usr/local/openssl --enable-shared
make -j$(nproc) && make altinstall

# PyInstaller 설치
/usr/local/bin/python3.9 -m pip install pyinstaller
```

이 서버에서 빌드한 바이너리는 glibc 2.12 기반이 되어 CentOS 6부터 Rocky 9까지 추가 설치 없이 실행된다.

---

## 문제 2: /tmp noexec → failed to map segment

빌드 서버를 CentOS 6.5로 바꾸고 전체 배포 테스트를 했다. 대부분의 서버에서는 잘 됐는데, 보안 하드닝이 적용된 서버 한 대에서 이런 에러가 났다.

```
error while loading shared libraries: libz.so.1: failed to map segment from shared object
```

### 원인: PyInstaller onefile은 /tmp에 압축 해제한다

PyInstaller `--onefile` 바이너리의 실행 흐름은 이렇다.

1. 바이너리 실행
2. `/tmp/_MEIxxxxxx/` 임시 디렉토리 생성
3. 번들된 라이브러리들을 이 디렉토리에 압축 해제
4. `dlopen`으로 라이브러리 로드
5. Python 인터프리터 + 코드 실행

문제는 보안 하드닝된 서버에서 `/tmp`가 `noexec` 옵션으로 마운트돼 있다는 것이다.

```bash
$ findmnt /tmp
TARGET SOURCE               FSTYPE OPTIONS
/tmp   /dev/mapper/vgos-tmp xfs    rw,nosuid,nodev,noexec,...
```

`noexec` 마운트에서는 파일을 실행하거나 `dlopen`으로 로드할 수 없다. 라이브러리 압축 해제는 되지만 로드가 안 된다.

### 해결 1: TMPDIR 환경변수로 임시 디렉토리 변경

PyInstaller는 `TMPDIR` 환경변수를 읽어서 임시 디렉토리 경로를 결정한다. 실행 가능한 디렉토리로 바꿔주면 된다.

```bash
# 바이너리가 있는 디렉토리 자체를 TMPDIR로 지정
TMPDIR=. ./run
```

바이너리가 위치한 디렉토리는 이미 실행 권한이 있다. 추가 디렉토리를 만들 필요 없이 `.`으로 충분하다.

### 해결 2: 빌드 시 --runtime-tmpdir 지정

매번 `TMPDIR=.`을 붙여서 실행하기보다는 바이너리 빌드 시 기본값을 고정하는 방법이 더 깔끔하다.

```bash
pyinstaller run.py --onefile \
  --collect-submodules=linux \
  --collect-data=linux \
  --runtime-tmpdir=.
```

`--runtime-tmpdir=.`을 지정하면 실행 시 자동으로 현재 디렉토리의 `_MEIxxxxxx/`를 사용한다. `noexec`가 없는 서버에서도 동작에 문제없다.

---

## 심화: staticx로 완전 정적 바이너리

위 방법은 "빌드 서버를 낮은 glibc로 맞춰서" 호환성을 확보하는 접근이다. 조금 다른 접근으로 `staticx`가 있다. PyInstaller 바이너리에 포함된 동적 라이브러리를 정적으로 링킹해서 **glibc 의존성 자체를 없애는** 방법이다.

```bash
pip install staticx
pyinstaller run.py --onefile --collect-data=linux

# PyInstaller 결과물을 staticx로 한 번 더 처리
staticx dist/run dist/run_static
```

`run_static`은 glibc 버전에 완전히 무관하게 동작한다. 하지만 몇 가지 제약이 있다.

- `staticx` 자체가 Linux에서만 동작한다.
- 바이너리 크기가 커진다 (동적 라이브러리가 모두 포함되므로).
- C 확장 모듈이 많으면 staticx가 놓치는 의존성이 생길 수 있다.
- `--runtime-tmpdir`이 이미 설정돼 있어야 `noexec` 환경에서도 동작한다.

대상 서버 범위가 매우 넓거나, 빌드 서버를 CentOS 6처럼 구버전 OS로 유지하기 어려운 경우에 유용하다.

---

## 정리

| 문제 | 원인 | 해결 |
|---|---|---|
| `GLIBC_X.XX not found` | 빌드 OS의 glibc가 실행 OS보다 높음 | 가장 낮은 glibc OS에서 빌드 |
| `failed to map segment` | `/tmp`가 noexec 마운트 | `TMPDIR=.` 또는 `--runtime-tmpdir=.` |
| glibc 의존 완전 제거 | 동적 링크 라이브러리 존재 | `staticx`로 정적 링킹 |

배포 대상이 단일 OS 버전이라면 신경 쓸 필요 없는 문제들이다. 하지만 오래된 서버가 섞인 환경에 단일 바이너리 하나로 배포해야 한다면, 빌드 서버 선택과 임시 디렉토리 설정이 의외로 크게 영향을 준다.
