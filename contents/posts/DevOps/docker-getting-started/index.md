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
description: "\"내 PC에선 되는데요?\" 이 말이 사라지는 Docker의 핵심 개념과 기본 사용법을 정리합니다."
---

## 왜 Docker인가?

개발하다 보면 한 번쯤 겪는 상황이 있습니다.

> "로컬에서는 잘 되는데 서버에 올리면 안 됩니다."
> "팀원 PC에서는 실행이 안 된다고 하는데요?"

이 문제의 근본 원인은 **환경 불일치**입니다. 개발자 A는 Python 3.10, 개발자 B는 3.8, 서버는 3.9를 쓰는 식이죠.

Docker는 이 문제를 **컨테이너(Container)** 라는 개념으로 해결합니다.

---

## 핵심 개념 3가지

### 1. 이미지 (Image)

컨테이너를 만들기 위한 **설계도**입니다. OS, 런타임, 라이브러리, 코드가 모두 포함된 읽기 전용 템플릿입니다.

```
이미지 = 실행 가능한 스냅샷
```

### 2. 컨테이너 (Container)

이미지를 실행한 **인스턴스**입니다. 이미지 하나로 컨테이너를 여러 개 띄울 수 있습니다.

```
이미지 : 컨테이너 = 클래스 : 객체
```

### 3. Dockerfile

이미지를 어떻게 만들지 정의하는 **레시피 파일**입니다.

```dockerfile
FROM python:3.11-slim          # 베이스 이미지
WORKDIR /app                   # 작업 디렉토리
COPY requirements.txt .        # 의존성 목록 복사
RUN pip install -r requirements.txt  # 설치
COPY . .                       # 소스 코드 복사
CMD ["python", "app.py"]       # 실행 명령
```

---

## 설치

[docs.docker.com/get-docker](https://docs.docker.com/get-docker/) 에서 OS에 맞는 **Docker Desktop**을 설치합니다.

설치 확인:

```bash
docker --version
# Docker version 26.x.x, build ...
```

---

## 기본 명령어 치트시트

### 이미지 관련

```bash
# Docker Hub에서 이미지 내려받기
docker pull nginx

# 로컬에 있는 이미지 목록
docker images

# 이미지 삭제
docker rmi nginx
```

### 컨테이너 실행

```bash
# 기본 실행 (포어그라운드)
docker run nginx

# 백그라운드 실행 (-d), 포트 연결 (-p)
docker run -d -p 8080:80 nginx

# 이름 지정 (--name), 종료 시 자동 삭제 (--rm)
docker run --rm --name my-nginx -p 8080:80 nginx

# 컨테이너 안으로 들어가기 (-it: 대화형 터미널)
docker run -it ubuntu bash
```

### 실행 중인 컨테이너 관리

```bash
# 실행 중인 컨테이너 목록
docker ps

# 모든 컨테이너 (종료된 것 포함)
docker ps -a

# 컨테이너 중지 / 재시작 / 삭제
docker stop my-nginx
docker start my-nginx
docker rm my-nginx

# 실행 중인 컨테이너에 명령 실행
docker exec -it my-nginx bash

# 로그 확인
docker logs my-nginx
docker logs -f my-nginx   # 실시간 follow
```

---

## 실전 예시: Python 앱 컨테이너화

간단한 Flask 앱을 Docker로 실행해 봅시다.

**app.py**

```python
from flask import Flask
app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello from Docker!"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
```

**requirements.txt**

```
flask==3.0.3
```

**Dockerfile**

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000
CMD ["python", "app.py"]
```

**빌드 및 실행**

```bash
# 이미지 빌드 (현재 디렉토리의 Dockerfile 사용)
docker build -t my-flask-app .

# 컨테이너 실행
docker run -d -p 5000:5000 my-flask-app

# 확인
curl http://localhost:5000
# Hello from Docker!
```

---

## 볼륨(Volume): 데이터 유지하기

컨테이너는 종료되면 내부 데이터가 사라집니다. 데이터를 유지하려면 **볼륨**을 사용합니다.

```bash
# 호스트 디렉토리를 컨테이너에 마운트 (-v 호스트경로:컨테이너경로)
docker run -d \
  -p 5000:5000 \
  -v $(pwd)/data:/app/data \
  my-flask-app
```

이렇게 하면 컨테이너가 삭제되어도 `./data` 폴더의 내용은 남아있습니다.

---

## .dockerignore

`.gitignore`처럼, Docker 빌드 시 불필요한 파일을 제외합니다.

```
__pycache__/
*.pyc
.env
.git
node_modules/
*.log
```

빌드 컨텍스트가 작아져 빌드 속도가 빨라집니다.

---

## Docker vs 가상머신(VM)

| 구분 | Docker (컨테이너) | VM |
|------|------------------|-----|
| 크기 | MB 단위 | GB 단위 |
| 시작 시간 | 초 단위 | 분 단위 |
| OS 공유 | 호스트 OS 커널 공유 | 게스트 OS 별도 |
| 격리 수준 | 프로세스 수준 | 하드웨어 수준 |
| 용도 | 앱 배포/개발 환경 | 완전한 OS 분리 필요 시 |

---

## 마무리

이 글에서 다룬 내용:

- Docker가 필요한 이유 (환경 불일치 문제)
- 이미지, 컨테이너, Dockerfile 개념
- 기본 명령어 (pull, run, ps, exec, logs)
- Python 앱 컨테이너화 실습
- 볼륨으로 데이터 유지

다음 글에서는 **Docker Compose**를 다룹니다. 여러 컨테이너(앱 + DB + 캐시)를 하나의 파일로 관리하는 방법입니다.

---

> 실습 환경: Docker Desktop 4.x, Python 3.11
