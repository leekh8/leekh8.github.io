---
date: "2026-04-09"
title: "Docker 입문: 컨테이너로 개발 환경 통일하기"
category: "DevOps"
series: "Docker & 컨테이너 기초"
tags:
  - Docker
  - DevOps
  - Container
  - 입문
thumbnail: ""
description: "\"내 PC에선 되는데요?\" 이 말이 사라지는 Docker의 핵심 개념부터 Dockerfile 최적화, 네트워크, 볼륨, 멀티 스테이지 빌드까지 실전 중심으로 정리합니다."
---

## 왜 Docker인가?

개발하다 보면 한 번쯤 겪는 상황이 있습니다.

> "로컬에서는 잘 되는데 서버에 올리면 안 됩니다."
> "팀원 PC에서는 실행이 안 된다고 하는데요?"
> "Python 버전이 달라서 패키지 충돌이 났어요."

이 문제의 근본 원인은 **환경 불일치**입니다. 개발자 A는 Python 3.10, 개발자 B는 3.8, 서버는 3.9를 쓰는 식이죠. OS가 다르면 더 심해집니다.

Docker는 이 문제를 **컨테이너(Container)** 라는 개념으로 해결합니다. 앱 실행에 필요한 모든 것(코드, 런타임, 라이브러리, 환경변수)을 하나의 패키지로 묶어서, **어디서 실행해도 동일한 환경**을 보장합니다.

---

## Docker 아키텍처

Docker는 클라이언트-서버 구조입니다.

```
┌─────────────────────────────────────────────┐
│               Docker Host                   │
│                                             │
│  ┌──────────┐      ┌───────────────────┐   │
│  │  Docker  │ REST │   Docker Daemon   │   │
│  │  Client  │─────▶│   (dockerd)       │   │
│  │(docker)  │      │                   │   │
│  └──────────┘      │  ┌─────────────┐ │   │
│                    │  │  Container  │ │   │
│                    │  └─────────────┘ │   │
│                    │  ┌─────────────┐ │   │
│                    │  │  Container  │ │   │
│                    │  └─────────────┘ │   │
│                    └───────────────────┘   │
└─────────────────────────────────────────────┘
         ▲
         │ push/pull
         ▼
   ┌───────────┐
   │ Docker Hub│ (Registry)
   └───────────┘
```

- **Docker Client**: `docker` 명령어를 받아서 Daemon에 전달
- **Docker Daemon(dockerd)**: 이미지 빌드, 컨테이너 실행 등 실제 작업 수행
- **Docker Hub**: 이미지를 저장하고 공유하는 공개 레지스트리

---

## 핵심 개념 3가지

### 1. 이미지 (Image)

컨테이너를 만들기 위한 **읽기 전용 설계도**입니다. OS, 런타임, 라이브러리, 코드가 계층(Layer) 구조로 쌓여 있습니다.

```
이미지 = 실행 가능한 스냅샷 (읽기 전용)
```

이미지는 레이어로 구성됩니다. 예를 들어 `python:3.11-slim` 이미지를 기반으로 내 앱 이미지를 만들면:

```
┌──────────────────────────┐
│  내 앱 코드 (Layer 4)    │  ← COPY . .
├──────────────────────────┤
│  pip 패키지 (Layer 3)    │  ← RUN pip install
├──────────────────────────┤
│  requirements.txt (L2)   │  ← COPY requirements.txt
├──────────────────────────┤
│  python:3.11-slim (L1)   │  ← FROM
└──────────────────────────┘
```

레이어는 **캐시**됩니다. 변경된 레이어 아래부터만 다시 빌드합니다.

### 2. 컨테이너 (Container)

이미지를 실행한 **인스턴스**입니다. 이미지 위에 **쓰기 가능한 레이어**가 추가된 형태입니다. 이미지 하나로 컨테이너를 여러 개 띄울 수 있습니다.

```
이미지 : 컨테이너 = 클래스 : 객체
```

컨테이너를 삭제하면 쓰기 레이어의 데이터는 사라집니다. 영구 보존이 필요하면 볼륨을 사용해야 합니다.

### 3. Dockerfile

이미지를 어떻게 만들지 정의하는 **레시피 파일**입니다.

```dockerfile
FROM python:3.11-slim          # 베이스 이미지
WORKDIR /app                   # 작업 디렉토리 설정
COPY requirements.txt .        # 파일 복사
RUN pip install -r requirements.txt  # 명령 실행 (레이어 생성)
COPY . .                       # 소스코드 복사
CMD ["python", "app.py"]       # 컨테이너 시작 시 실행할 명령
```

---

## 설치

[docs.docker.com/get-docker](https://docs.docker.com/get-docker/) 에서 OS에 맞는 **Docker Desktop**을 설치합니다. (Windows/Mac은 GUI 포함, Linux는 Docker Engine만 설치해도 됨)

설치 확인:

```bash
docker --version
# Docker version 26.x.x, build ...

docker run hello-world
# Hello from Docker! 출력되면 정상
```

---

## Dockerfile 명령어 완전 정리

### FROM — 베이스 이미지

```dockerfile
FROM python:3.11-slim
FROM ubuntu:22.04
FROM scratch          # 완전히 빈 이미지 (Go 바이너리 등에 사용)
```

`-slim`: 최소한의 패키지만 포함한 경량 버전. 용량이 작아 권장됩니다.
`-alpine`: Alpine Linux 기반, 더 작지만 glibc 대신 musl libc 사용으로 호환성 이슈 있을 수 있음.

### RUN — 명령 실행 (레이어 생성)

```dockerfile
# 나쁜 예 — RUN 3개 = 레이어 3개
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get clean

# 좋은 예 — && 로 연결하면 레이어 1개
RUN apt-get update && \
    apt-get install -y curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
```

### COPY vs ADD

```dockerfile
COPY src/ /app/src/        # 로컬 파일/디렉토리 복사 (권장)
ADD archive.tar.gz /app/   # 자동 압축해제 기능 있음 (tar만)
ADD https://example.com/file /app/  # URL에서 직접 다운로드 (보안상 비권장)
```

일반적으로 **COPY를 사용**하세요. ADD는 자동 압축해제가 필요할 때만 씁니다.

### ENV vs ARG

```dockerfile
# ARG — 빌드 시에만 사용되는 변수
ARG VERSION=1.0
RUN echo "Building version $VERSION"

# ENV — 빌드 + 런타임 모두 사용 가능한 환경변수
ENV APP_ENV=production
ENV PORT=8000
```

빌드 시 ARG 값을 바꾸려면: `docker build --build-arg VERSION=2.0 .`

### CMD vs ENTRYPOINT

```dockerfile
# CMD — 기본 명령. docker run 시 오버라이드 가능
CMD ["python", "app.py"]
CMD ["python", "-m", "pytest"]  # 테스트용으로 오버라이드 가능

# ENTRYPOINT — 반드시 실행할 명령. 오버라이드하려면 --entrypoint 필요
ENTRYPOINT ["python", "app.py"]

# 함께 쓰면: ENTRYPOINT가 명령, CMD가 기본 인자
ENTRYPOINT ["python"]
CMD ["app.py"]
# docker run myapp            → python app.py
# docker run myapp test.py    → python test.py
```

### EXPOSE

```dockerfile
EXPOSE 8000     # 컨테이너가 이 포트를 사용한다는 문서화 (실제 포트 오픈은 -p 옵션)
```

### USER — 보안을 위한 비루트 실행

```dockerfile
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser
USER appuser    # 이후 모든 명령은 appuser로 실행
```

루트로 실행하면 컨테이너 탈출 취약점 발생 시 호스트까지 위험합니다.

---

## 기본 명령어 치트시트

### 이미지 관련

```bash
# Docker Hub에서 이미지 내려받기
docker pull nginx
docker pull nginx:1.25       # 태그(버전) 지정

# 로컬 이미지 목록
docker images
docker images --filter "dangling=true"  # 태그 없는 이미지만

# 이미지 삭제
docker rmi nginx
docker image prune            # 사용하지 않는 이미지 전체 삭제
```

### 컨테이너 실행

```bash
# 기본 실행
docker run nginx

# 자주 쓰는 옵션 조합
docker run -d \              # 백그라운드 실행
  -p 8080:80 \               # 호스트포트:컨테이너포트
  --name my-nginx \          # 이름 지정
  --rm \                     # 종료 시 자동 삭제
  nginx

# 환경변수 전달
docker run -e DB_HOST=localhost -e DB_PORT=5432 my-app

# .env 파일로 환경변수 전달
docker run --env-file .env my-app

# 컨테이너 안으로 들어가기
docker run -it ubuntu bash
```

### 실행 중인 컨테이너 관리

```bash
# 컨테이너 목록
docker ps           # 실행 중
docker ps -a        # 전체 (종료된 것 포함)

# 중지 / 재시작 / 삭제
docker stop my-nginx
docker start my-nginx
docker restart my-nginx
docker rm my-nginx
docker rm -f my-nginx   # 강제 삭제 (실행 중이어도)

# 실행 중인 컨테이너에 명령 실행
docker exec -it my-nginx bash
docker exec my-nginx cat /etc/nginx/nginx.conf

# 로그 확인
docker logs my-nginx
docker logs -f my-nginx          # 실시간 follow
docker logs --tail 100 my-nginx  # 마지막 100줄

# 리소스 사용량 확인
docker stats my-nginx
docker stats                     # 모든 컨테이너

# 컨테이너 상세 정보
docker inspect my-nginx
```

---

## 레이어 캐싱과 Dockerfile 최적화

Docker는 레이어를 캐시합니다. **변경된 레이어부터 아래는 캐시를 무효화**합니다.

### 나쁜 예 — 소스코드 변경 시마다 pip install 재실행

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY . .                              # 소스코드 변경 → 이 이후 캐시 무효화
RUN pip install -r requirements.txt   # 매번 재실행됨
CMD ["python", "app.py"]
```

### 좋은 예 — 의존성 먼저 설치, 소스코드는 나중에

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .               # requirements.txt만 먼저 복사
RUN pip install --no-cache-dir -r requirements.txt  # 캐시됨
COPY . .                              # 소스코드는 나중에 (자주 바뀜)
CMD ["python", "app.py"]
```

`requirements.txt`가 바뀌지 않으면 `pip install` 레이어는 캐시를 재사용합니다. 빌드 시간이 크게 줄어듭니다.

---

## 볼륨(Volume): 데이터 유지하기

컨테이너를 삭제하면 내부 데이터가 사라집니다. 데이터를 영구 보존하려면 볼륨을 사용합니다.

### 바인드 마운트 (Bind Mount)

```bash
# 호스트 디렉토리를 컨테이너에 직접 연결
docker run -d \
  -p 5000:5000 \
  -v $(pwd)/data:/app/data \    # 호스트경로:컨테이너경로
  my-flask-app
```

- 호스트의 특정 디렉토리를 그대로 사용
- 개발 중 코드 변경 사항을 즉시 반영할 때 유용

### Docker 볼륨 (Named Volume)

```bash
# 볼륨 생성
docker volume create mydata

# 볼륨 연결
docker run -d \
  -v mydata:/app/data \
  my-flask-app

# 볼륨 목록
docker volume ls

# 볼륨 삭제
docker volume rm mydata
```

- Docker가 관리하는 전용 저장소
- 컨테이너 간 데이터 공유, DB 데이터 보존에 적합

| 구분 | 바인드 마운트 | Named Volume |
|------|------------|-------------|
| 위치 | 호스트 임의 경로 | Docker 관리 경로 |
| 용도 | 개발 중 코드 공유 | DB, 영구 데이터 |
| 이식성 | 낮음 (경로 의존) | 높음 |

---

## 네트워크

컨테이너들이 서로 통신하려면 네트워크 설정이 필요합니다.

```bash
# 네트워크 목록
docker network ls

# 커스텀 네트워크 생성
docker network create my-network

# 컨테이너를 네트워크에 연결해서 실행
docker run -d --name app --network my-network my-flask-app
docker run -d --name db --network my-network postgres

# 같은 네트워크 안에서는 컨테이너 이름으로 통신 가능
# app 컨테이너에서 db 컨테이너에 접근: host = "db"
```

기본 네트워크 드라이버:

| 드라이버 | 설명 |
|---------|------|
| `bridge` | 기본값. 컨테이너 간 격리 + 통신 가능 |
| `host` | 호스트 네트워크 직접 사용 (포트 충돌 주의) |
| `none` | 네트워크 완전 차단 |

---

## 멀티 스테이지 빌드

빌드 도구와 런타임을 분리해서 **최종 이미지 크기를 크게 줄일 수 있습니다.**

### 예시: Go 애플리케이션

```dockerfile
# Stage 1: 빌드
FROM golang:1.22 AS builder
WORKDIR /app
COPY . .
RUN go build -o server .

# Stage 2: 실행 (golang 컴파일러 불필요)
FROM alpine:3.19
WORKDIR /app
COPY --from=builder /app/server .   # builder 스테이지에서 바이너리만 복사
CMD ["./server"]
```

- `golang:1.22` 이미지: ~800MB
- 최종 `alpine` 기반 이미지: ~15MB

### 예시: Node.js 프론트엔드

```dockerfile
# Stage 1: 빌드
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: 서빙 (node_modules 불필요)
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
```

---

## 실전 예시: Python Flask 앱 컨테이너화

처음부터 끝까지 실습해 봅시다.

### 프로젝트 구조

```
my-app/
├── app.py
├── requirements.txt
├── Dockerfile
└── .dockerignore
```

**app.py**

```python
from flask import Flask, jsonify
import os

app = Flask(__name__)

@app.route("/")
def hello():
    return jsonify({
        "message": "Hello from Docker!",
        "env": os.environ.get("APP_ENV", "development")
    })

@app.route("/health")
def health():
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
```

**requirements.txt**

```
flask==3.0.3
gunicorn==21.2.0
```

**Dockerfile**

```dockerfile
FROM python:3.11-slim

# 보안: 비루트 사용자
RUN addgroup --system appgroup && \
    adduser --system --ingroup appgroup appuser

WORKDIR /app

# 의존성 먼저 (캐시 최적화)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 소스코드
COPY . .

# 소유권 변경
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 5000

# 개발: flask 직접 실행, 프로덕션: gunicorn 권장
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
```

**.dockerignore**

```
__pycache__/
*.pyc
*.pyo
.env
.git
.gitignore
.venv
venv/
*.log
README.md
```

**빌드 및 실행**

```bash
# 이미지 빌드
docker build -t my-flask-app .

# 빌드된 이미지 확인
docker images my-flask-app

# 실행 (환경변수 포함)
docker run -d \
  -p 5000:5000 \
  -e APP_ENV=production \
  --name flask-app \
  my-flask-app

# 동작 확인
curl http://localhost:5000
curl http://localhost:5000/health

# 로그 확인
docker logs flask-app
```

---

## 디버깅 팁

### 컨테이너가 바로 종료될 때

```bash
# 종료된 컨테이너 로그 확인
docker logs <container-id>

# 종료 코드 확인
docker inspect <container-id> --format='{{.State.ExitCode}}'

# 셸로 직접 들어가서 확인
docker run -it my-flask-app bash   # CMD 무시하고 bash 실행
```

### 이미지 레이어 구조 확인

```bash
docker history my-flask-app
```

### 컨테이너 내부 파일 확인

```bash
# 실행 중인 컨테이너에 접속
docker exec -it flask-app bash

# 파일 복사 (컨테이너 → 호스트)
docker cp flask-app:/app/app.log ./app.log
```

### 빌드 캐시 무시하고 전체 재빌드

```bash
docker build --no-cache -t my-flask-app .
```

---

## Docker Hub에 이미지 올리기

```bash
# Docker Hub 로그인
docker login

# 이미지 태그 (username/repo:tag 형식)
docker tag my-flask-app myusername/my-flask-app:1.0.0
docker tag my-flask-app myusername/my-flask-app:latest

# 푸시
docker push myusername/my-flask-app:1.0.0
docker push myusername/my-flask-app:latest
```

다른 서버나 팀원이 `docker pull myusername/my-flask-app`으로 동일한 환경을 가져올 수 있습니다.

---

## Docker vs 가상머신(VM)

| 구분 | Docker (컨테이너) | VM |
|------|------------------|-----|
| 크기 | MB 단위 | GB 단위 |
| 시작 시간 | 초 단위 | 분 단위 |
| OS 공유 | 호스트 OS 커널 공유 | 게스트 OS 별도 |
| 격리 수준 | 프로세스 수준 | 하드웨어 수준 |
| 오버헤드 | 낮음 | 높음 |
| 용도 | 앱 배포/개발 환경 | 완전한 OS 분리 필요 시 |

컨테이너는 VM보다 가볍지만, OS 커널을 공유하기 때문에 격리 수준은 VM이 더 강합니다. 완전한 보안 격리가 필요하면 VM, 빠른 배포와 스케일링이 필요하면 컨테이너가 적합합니다.

---

## 자주 하는 실수

**1. latest 태그 고정 사용**
```dockerfile
# 나쁜 예
FROM python:latest    # 버전이 언제 바뀔지 모름

# 좋은 예
FROM python:3.11-slim  # 버전 고정
```

**2. .dockerignore 없이 COPY . .**
```bash
# node_modules, .git 등 불필요한 파일까지 컨텍스트에 포함됨
# 빌드가 느려지고 이미지가 커짐
```

**3. 루트 사용자로 실행**
```dockerfile
# 컨테이너 탈출 취약점 발생 시 호스트까지 위험
# USER 지시어로 비루트 사용자 지정 권장
```

**4. 비밀 정보를 Dockerfile에 하드코딩**
```dockerfile
# 절대 금지 — 이미지 히스토리에 남음
ENV DB_PASSWORD=mysecretpassword

# 대신 런타임에 환경변수로 전달
docker run -e DB_PASSWORD=$DB_PASSWORD my-app
# 또는 Docker Secrets, 외부 시크릿 관리 도구 사용
```

---

## 마무리

이 글에서 다룬 내용:

- Docker가 필요한 이유와 아키텍처
- 이미지, 컨테이너, Dockerfile 개념과 레이어 구조
- Dockerfile 명령어 상세 (FROM, RUN, COPY, ENV, CMD, ENTRYPOINT, USER)
- 레이어 캐싱을 활용한 빌드 최적화
- 볼륨과 네트워크
- 멀티 스테이지 빌드로 이미지 경량화
- Flask 앱 실전 컨테이너화 (비루트 실행, gunicorn 포함)
- 디버깅 팁과 자주 하는 실수

다음 글에서는 **Docker Compose**를 다룹니다. `docker-compose.yml` 파일 하나로 앱 + DB + Redis 등 여러 컨테이너를 한 번에 관리하는 방법입니다.

---

> 실습 환경: Docker Desktop 4.x, Python 3.11, Flask 3.0
