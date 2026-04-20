---
title: "🚀 Spring Boot 프로젝트의 Render 배포 실패 사례 정리: gradlew, JAVA_HOME, Dockerfile 문제 해결"
description: "Render에 Spring Boot 프로젝트를 배포할 때 겪는 gradlew 실행 오류, JAVA_HOME 설정 문제, Dockerfile 최적화, 환경변수 관리, Health Check까지 실제 사례 정리"
date: 2025-05-13
update: 2026-04-20
tags:
  - Code N Solve
  - Spring Boot
  - Render
  - CI/CD
  - Docker
  - Gradle
  - Java
  - 배포
  - Actuator
series: "Code N Solve"
---

## Code N Solve 📘: Spring Boot 프로젝트의 Render 배포 실패 사례 정리

지난번 [Vite 배포 오류 글](https://leekh8.github.io/Vite-Develop-Error/)과는 달리, Java + Spring Boot + Gradle[^1] 환경의 백엔드 프로젝트를 Render[^2]에 Docker로 배포할 때 겪은 빌드 실패 사례와 해결 과정을 정리하였다.

각각의 오류를 분석하고 해결한 과정에 대해 알아보자.

Vite나 Node.js 환경이 아닌, Java 기반 서버를 Docker 환경에서 Render로 배포하려고 하는 다른 사람에게 도움이 되면 좋겠다.

---

## 📋 목차

1. [Render 무료 플랜 특성 이해](#render-무료-플랜-특성-이해)
2. [Render 배포 전체 흐름](#render-배포-전체-흐름)
3. [오류 1 - `./gradlew` Permission denied](#-1-gradlew-실행-오류---permission-denied)
4. [오류 2 - Gradle Wrapper 없음](#-2-gradle-wrapper-없음---gradlewrappermain-오류)
5. [오류 3 - JAVA_HOME 설정 오류](#-3-java_home-관련-오류)
6. [오류 4 - Gradle Toolchain 에러](#-4-gradle-toolchain-에러-java-17-요구)
7. [오류 5 - render.yaml 설정](#-5-render-배포-설정---renderyaml)
8. [오류 6 - DATABASE_URL 자동 제공 vs H2](#-6-database_url-자동-제공-vs-h2)
9. [추가 오류 케이스](#-추가-오류-케이스)
10. [멀티 스테이지 Dockerfile 최적화](#-멀티-스테이지-dockerfile-최적화)
11. [.dockerignore 설정](#-dockerignore-설정)
12. [환경 변수 관리](#-환경-변수-관리)
13. [Health Check 설정](#-health-check-설정)
14. [로컬 Docker 테스트 방법](#-로컬-docker-테스트-방법)
15. [결론](#결론)

---

## Render 무료 플랜 특성 이해

Spring Boot 프로젝트를 Render에 올리기 전에, 무료 플랜의 특성을 이해하는 것이 매우 중요하다. 무료 플랜의 제약을 모르고 배포하면, 배포 자체는 성공했는데 서비스가 제대로 동작하지 않는 상황을 겪게 된다.

### 콜드 스타트(Cold Start)와 슬립 모드(Sleep Mode)

Render 무료 플랜의 웹 서비스는 **15분 동안 트래픽이 없으면 슬립(sleep) 상태**로 전환된다. 이후 새로운 요청이 들어오면 다시 깨어나는데, 이 과정에서 **30초~1분 이상의 콜드 스타트 지연**이 발생한다.

Spring Boot는 JVM 기반이라 일반적인 Node.js 서버보다 기동 시간이 길다. 일반 Spring Boot 앱의 경우 JVM 웜업 포함 30~60초, 대형 앱은 그 이상이 걸릴 수 있다.

콜드 스타트를 완화하는 방법:

```yaml
# render.yaml
services:
  - type: web
    name: my-spring-app
    env: docker
    plan: free
    healthCheckPath: /actuator/health
```

`healthCheckPath`를 설정해두면 Render가 주기적으로 헬스 체크를 보내 슬립 상태를 방지하는 데 약간 도움이 된다. 하지만 완벽한 해결책은 아니며, 근본적으로는 유료 플랜으로 전환하거나 외부 업타임 모니터링 서비스(UptimeRobot 등)를 이용해 주기적으로 요청을 보내는 방법을 쓰기도 한다.

### 메모리 제한

Render 무료 플랜은 **512MB RAM** 제한이 있다. Spring Boot 애플리케이션은 기동 시부터 상당한 메모리를 사용하는데, JVM 기본 설정으로는 이 한도를 초과하기 쉽다.

| 항목 | 무료 플랜 | 스타터 플랜 ($7/월) | 스탠다드 플랜 ($25/월) |
|---|---|---|---|
| RAM | 512MB | 512MB | 2GB |
| CPU | 공유 | 0.5 CPU | 1 CPU |
| 슬립 모드 | 있음 (15분) | 없음 | 없음 |
| 빌드 시간 | 월 400분 | 월 400분 | 월 400분 |
| 대역폭 | 100GB/월 | 100GB/월 | 100GB/월 |

### 무료 플랜에서 Spring Boot를 쓸 때 주의할 점

1. **JVM 힙 메모리를 반드시 제한**해야 한다. 설정하지 않으면 JVM이 컨테이너 메모리의 25%를 자동으로 최대 힙으로 설정하지만, 컨테이너 환경에서 이 감지가 부정확할 수 있다.

2. **불필요한 Spring Boot 스타터를 제거**해 기동 시간과 메모리를 줄인다.

3. **Spring Native(GraalVM) 또는 Spring AOT**를 고려하면 기동 시간을 수 초 이하로 줄일 수 있다. 단, 빌드 복잡도가 높아진다.

4. **데이터베이스 연결 풀 크기를 줄인다**. HikariCP 기본 풀 크기(10)를 2~3으로 줄이면 메모리 절약에 도움이 된다.

```properties
# application.properties
spring.datasource.hikari.maximum-pool-size=3
spring.datasource.hikari.minimum-idle=1
```

---

## Render 배포 전체 흐름

실제 배포가 어떤 과정을 거치는지 먼저 전체 그림을 파악해두면 각 단계에서 발생하는 오류를 이해하기 훨씬 쉽다.

```mermaid
flowchart TD
    A[개발자: 코드 작성 및 커밋] --> B[GitHub에 git push]
    B --> C{Render Webhook 감지}
    C --> D[Render 빌드 서버 시작]
    D --> E[GitHub 저장소 클론]
    E --> F{render.yaml 확인}
    F --> G[env: docker 설정 확인]
    G --> H[Dockerfile 존재 여부 확인]
    H --> I[Docker 빌드 시작]
    I --> J[빌드 스테이지: JDK 이미지 사용]
    J --> K[./gradlew build 실행]
    K --> L{빌드 성공 여부}
    L -- 실패 --> M[빌드 로그 출력 및 종료]
    L -- 성공 --> N[런타임 스테이지: JRE 이미지로 복사]
    N --> O[Docker 이미지 레지스트리에 푸시]
    O --> P[기존 컨테이너 종료]
    P --> Q[새 컨테이너 기동]
    Q --> R{Health Check 통과 여부}
    R -- 실패 --> S[이전 배포로 롤백]
    R -- 성공 --> T[배포 완료 - 트래픽 전환]

    style A fill:#4CAF50,color:#fff
    style T fill:#4CAF50,color:#fff
    style M fill:#f44336,color:#fff
    style S fill:#f44336,color:#fff
```

이 흐름에서 오류가 발생할 수 있는 지점은 크게 세 군데다:

- **클론 직후**: `gradlew` 파일 누락, 권한 문제
- **Docker 빌드 중**: JAVA_HOME, Toolchain 불일치, 메모리 부족
- **컨테이너 기동 중**: 포트 설정, 환경변수, Health Check 실패

---

## 🚨 1. `./gradlew` 실행 오류 - Permission denied

### ❌ 문제 상황

```bash
./gradlew: Permission denied
```

### 🧐 원인 분석

- Git에서 파일 권한은 기본적으로 추적되지 않기 때문에, 로컬에서는 실행되던 `./gradlew` 파일이 리눅스 배포 환경(Render 등)에서는 실행 권한(x) 없이 복제되는 경우가 많음.

- 특히 `gradlew`는 `.gitignore`로 제외되지 않더라도 `chmod +x`로 부여된 실행 권한 자체가 Git 커밋에 반영되지 않는 경우가 있으며, 이는 Linux 환경에서 `Permission denied` 오류를 유발함.

- Windows나 macOS 환경에서는 실행 권한이 문제 없이 적용될 수 있으나, Render의 Docker 빌드는 Linux 기반이므로 이 권한이 엄격히 요구됨.

### ✅ 해결 방법

#### 방법 1. 로컬에서 실행 권한 부여 후 커밋

```bash
chmod +x ./gradlew
git add gradlew
git commit -m "fix: gradlew 실행 권한 부여"
git push
```

Git은 실행 비트(executable bit)를 추적한다. `chmod +x` 후 `git add`하면 Git이 파일 모드 변경을 기록하고, 이후 클론 시 Linux 환경에서도 실행 권한이 유지된다.

#### 방법 2. Dockerfile에서 권한 부여 (권장)

로컬 커밋 상태와 무관하게, Dockerfile 안에서 권한을 명시적으로 부여하면 가장 안전하다.

```dockerfile
COPY . .
RUN chmod +x ./gradlew
RUN ./gradlew build --no-daemon
```

이 방법을 사용하면 어떤 환경에서 클론하더라도 빌드가 일관되게 동작한다.

#### 방법 3. Git 설정으로 권한 추적 강제

```bash
git config core.fileMode true
```

이 설정 후 `chmod +x gradlew`를 다시 실행하고 커밋하면 파일 모드 변경이 추적된다.

---

## 🚨 2. Gradle Wrapper 없음 - GradleWrapperMain 오류

### ❌ 문제 상황

```bash
Error: Could not find or load main class org.gradle.wrapper.GradleWrapperMain
```

### 🧐 원인 분석

- Gradle 프로젝트를 Git으로 관리할 때, 종종 `.gitignore`에 의해 무심코 제외되거나 커밋 누락되는 경우가 있음.

- 특히 다음 파일들은 Gradle의 Wrapper[^3] 기능을 구성하는 핵심 파일로, Wrapper 방식의 빌드는 Gradle이 설치되지 않은 환경에서도 빌드를 수행할 수 있게 도와줌.

  - `gradlew`
  - `gradlew.bat`
  - `gradle/wrapper/gradle-wrapper.jar`
  - `gradle/wrapper/gradle-wrapper.properties`

- 따라서 위 파일들이 누락되면 `./gradlew` 실행 시 내부적으로 `org.gradle.wrapper.GradleWrapperMain` 클래스를 찾을 수 없어 오류가 발생함.

### ✅ 해결 방법

#### 1. `.gitignore`에 의해 누락된 경우 다음 파일들을 반드시 커밋

```bash
gradlew
gradlew.bat
gradle/wrapper/gradle-wrapper.jar
gradle/wrapper/gradle-wrapper.properties
```

이 파일들은 Gradle 빌드 시스템의 핵심 요소로, Gradle 설치 없이도 `./gradlew` 명령어로 빌드가 가능하게 한다.

#### 2. `.gitignore` 확인 및 수정

흔히 사용하는 `.gitignore` 템플릿에서는 `*.jar`를 전부 제외하는 경우가 있는데, 이 때 `gradle-wrapper.jar`도 함께 제외될 수 있다. 아래와 같이 예외 처리가 필요하다.

```gitignore
# Gradle
.gradle/
build/

# Gradle Wrapper는 커밋 대상 (아래 줄로 예외 처리)
!gradle/wrapper/gradle-wrapper.jar
```

#### 3. Wrapper 파일 재생성

이미 파일이 없어졌다면 Gradle이 설치된 환경에서 새로 생성할 수 있다.

```bash
gradle wrapper --gradle-version 8.5
```

---

## 🚨 3. JAVA_HOME 관련 오류

### ❌ 문제 상황

Docker 빌드 과정에서 다음과 같은 오류 발생.

```bash
ERROR: JAVA_HOME is not set and no 'java' command could be found in your PATH.
```

### 🧐 원인 분석

- Render의 기본 배포 환경은 Node.js나 Python과 같은 언어에는 친화적이지만, Java를 실행할 수 있는 환경이 기본적으로 제공되지 않음.

- 특히 `env: docker` 설정을 사용할 경우, 별도의 Docker 이미지에서 Java가 설치되지 않으면 Gradle 빌드 과정에서 `JAVA_HOME` 설정이 없다는 오류가 발생하게 됨.

- Java 기반의 빌드를 위한 환경은 직접 명시적으로 설정해주어야 하며, Gradle 빌드 시 내부적으로 Java compiler를 찾지 못하면 이 오류가 발생함.

### ✅ 해결 방법

#### 1. Dockerfile을 사용해 Java를 명시적으로 설치

```dockerfile
# Dockerfile (기본 단일 스테이지 - 빠른 시작용)
FROM eclipse-temurin:21-jdk

WORKDIR /app
COPY . .

RUN chmod +x ./gradlew
RUN ./gradlew build --no-daemon

CMD find ./build/libs -name "*.jar" ! -name "*plain*" | xargs java -jar
```

- Render에서 Java를 사용할 수 있게 하기 위해 Dockerfile에서 Java를 명시적으로 설치함.
- `eclipse-temurin`[^4]은 OpenJDK를 제공하는 공식 Docker 이미지.
- `! -name "*plain*"` 조건을 추가해 Spring Boot가 생성하는 `-plain.jar`(의존성 없는 jar)를 제외하고 실행 가능한 fat jar만 선택한다.

---

## 🚨 4. Gradle Toolchain 에러 (Java 17 요구)

### ❌ 문제 상황

```bash
Failed to calculate the value of task ':compileJava' property 'javaCompiler'.
Cannot find a Java installation matching: {languageVersion=17...}
```

### 🧐 원인 분석

- Gradle Toolchain[^5] 기능은 특정 Java 버전으로의 일관된 빌드를 위해 사용됨.

  - 예: `JavaLanguageVersion.of(17)`.

- 그러나 Render의 Docker 빌드 환경에서는 자동으로 필요한 Java 버전을 다운로드하지 않음.

- 따라서 `toolchain`에 명시된 버전과 Docker 이미지의 JDK 버전이 일치하지 않으면 빌드 시 Gradle이 해당 버전을 찾지 못해 오류를 발생시킴.

- Java toolchain 설정이 적용된 상태에서 `eclipse-temurin:21-jdk` 등 상위 버전을 사용하는 경우에도 발생할 수 있음.

### ✅ 해결 방법

#### 방법 1. `build.gradle`에서 toolchain 제거

```groovy
// toolchain 설정을 제거하고 단순화
tasks.withType(JavaCompile) {
  options.encoding = 'UTF-8'
}
```

`build.gradle`에서 toolchain 제거 또는 Java 버전 자동 매칭 제거.

#### 방법 2. Java 버전 Docker와 맞추기

```dockerfile
FROM eclipse-temurin:17-jdk
```

Dockerfile의 JDK 버전을 Gradle toolchain과 일치시킴.

- 추가로, Gradle의 toolchain 설정이 꼭 필요한 경우에는 Dockerfile에서 동일한 JDK 버전을 명시적으로 포함시켜야 함.

  ```groovy
  java {
    toolchain {
      languageVersion = JavaLanguageVersion.of(17)
    }
  }
  ```

  이 경우, 빌드 환경에서도 정확히 JDK 17이 설치되어 있어야 정상 작동함.

---

## 🚨 5. Render 배포 설정 - render.yaml

### 🧐 원인 분석

- Github 저장소 루트에 `render.yaml`이 있어야 함.

- `Dockerfile` 기준으로 빌드되도록 설정 필요함.

- `Dockerfile`이 존재하고 `CMD` 구문에서 `.jar`를 실행해야 함.

- 여러 서비스가 있을 경우 `healthCheckPath`, `buildCommand` 등 추가 설정 가능.

### ✅ 해결 방법

#### 1. `render.yaml` 기본 작성

```yaml
services:
  - type: web
    name: my-spring-app
    env: docker
    plan: free
```

#### 2. `render.yaml` 권장 작성 (전체 옵션 포함)

```yaml
services:
  - type: web
    name: my-spring-app
    env: docker
    plan: free
    region: singapore   # 지역 설정 (asia에서는 singapore 추천)
    healthCheckPath: /actuator/health
    envVars:
      - key: SPRING_PROFILES_ACTIVE
        value: prod
      - key: DATABASE_URL
        fromDatabase:
          name: my-postgres-db
          property: connectionString
      - key: JWT_SECRET
        sync: false   # Render 대시보드에서 직접 입력하는 시크릿

databases:
  - name: my-postgres-db
    plan: free
    databaseName: myapp
    user: myapp_user
```

- `fromDatabase`를 사용하면 PostgreSQL 인스턴스의 연결 문자열을 환경변수로 자동 주입할 수 있다.
- `sync: false`는 해당 환경변수를 Render 대시보드에서 직접 입력해야 하는 시크릿으로 표시한다. `render.yaml`을 Git에 올려도 값이 노출되지 않는다.

---

## 🚨 6. DATABASE_URL 자동 제공 vs H2

- Render는 PostgreSQL 사용 시 환경변수 `DATABASE_URL`을 자동 제공함.[^6]

- `postgres://<user>:<password>@<host>:<port>/<dbname>` 형식의 접속 문자열로, Spring Boot에서 외부 데이터베이스에 연결하기 위한 정보를 한 줄로 제공함.

- 기존에 `H2 (in-memory)`를 사용했다면 `application.properties`에 다음을 반영해야 함.

### 🧐 원인 분석

- 로컬 개발에서 H2 인메모리 DB를 사용하다가, Render와 같은 운영 배포 환경에서는 PostgreSQL 같은 영속적인 데이터베이스가 필요함.

- Render는 PostgreSQL 데이터베이스를 생성하면 자동으로 `DATABASE_URL` 환경변수를 생성해주지만, Spring Boot의 `application.properties`에서 이 값을 읽도록 설정하지 않으면 기본적으로 H2를 계속 사용하거나 연결 오류가 발생함.

- 또한 PostgreSQL을 사용하려면 JDBC 드라이버 의존성을 별도로 추가해야 하며, 로컬에서는 문제가 없었던 설정이 Render에서는 작동하지 않을 수 있음.

### ✅ 해결 방법

#### 1. PostgreSQL 사용 시 설정

```properties
# application.properties
spring.datasource.url=${DATABASE_URL}
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.hibernate.ddl-auto=update
```

```groovy
// build.gradle
dependencies {
  implementation 'org.postgresql:postgresql:42.7.3'
}
```

PostgreSQL 드라이버 의존성도 build.gradle에 추가 필요함.

### ⛔ H2에서 전환 시 주의

- 로컬 개발과 배포 환경에서 DB가 다를 경우, 데이터 스키마가 일치하지 않을 수 있으므로 Flyway 또는 Liquibase 등의 마이그레이션 툴을 사용하는 것이 좋음.

- Render에서 제공하는 `DATABASE_URL` 환경변수는 아래와 같은 형식.

  - `postgres://username:password@hostname:port/dbname`

- 해당 URL은 `spring.datasource.url`에 그대로 넣으면 Spring Boot에서 자동으로 분리 파싱하여 사용 가능함.

---

## 🔥 추가 오류 케이스

실제 운영에서 자주 마주치지만 앞선 절에서 다루지 않은 오류 케이스들이다. 이 부분을 놓치면 배포 성공 후에도 서비스가 제대로 동작하지 않는 경우가 많다.

### Out of Memory (OOM) 오류

#### ❌ 문제 상황

```
java.lang.OutOfMemoryError: Java heap space
```

또는 컨테이너가 OOM Killer에 의해 갑자기 종료되어 로그 없이 재시작되는 현상.

#### 🧐 원인 분석

Render 무료 플랜의 512MB 제한 안에서 JVM이 동작하려면 힙 메모리를 반드시 제한해야 한다. JVM은 기본적으로 컨테이너 전체 메모리의 상당 부분을 힙으로 잡으려 하는데, 이로 인해 OS 예약 메모리, JVM 자체 오버헤드, 스레드 스택 등과 합산하면 제한을 초과한다.

#### ✅ 해결 방법

Dockerfile의 `CMD`에서 JVM 옵션을 명시적으로 지정한다.

```dockerfile
CMD ["java", "-Xms128m", "-Xmx256m", "-jar", "/app/app.jar"]
```

| 옵션 | 의미 |
|---|---|
| `-Xms128m` | 초기 힙 크기 128MB |
| `-Xmx256m` | 최대 힙 크기 256MB |
| `-XX:+UseContainerSupport` | 컨테이너 메모리 제한 자동 인식 (Java 11+) |
| `-XX:MaxRAMPercentage=50.0` | 컨테이너 메모리의 50%를 최대 힙으로 사용 |

컨테이너 메모리 기반 자동 설정 방식(더 권장):

```dockerfile
CMD ["java", \
  "-XX:+UseContainerSupport", \
  "-XX:MaxRAMPercentage=50.0", \
  "-jar", "/app/app.jar"]
```

이 방식을 쓰면 나중에 플랜을 올려 메모리가 늘어났을 때 Dockerfile을 수정하지 않아도 자동으로 최대 힙이 조정된다.

---

### 빌드 시간 초과

#### ❌ 문제 상황

```
Build timed out after 30 minutes
```

#### 🧐 원인 분석

Render 무료 플랜은 빌드 시간이 월 **400분**으로 제한되며, 단일 빌드도 일정 시간이 지나면 강제 종료된다. Spring Boot 프로젝트는 Gradle 의존성 다운로드 + 빌드 + Docker 이미지 생성 과정을 포함하면 초기 빌드에 10~20분이 걸릴 수 있다.

#### ✅ 해결 방법

1. **Gradle 데몬 비활성화**: Docker 빌드에서는 데몬이 오히려 오버헤드가 된다.

   ```dockerfile
   RUN ./gradlew build --no-daemon
   ```

2. **캐시 활용**: Docker 레이어 캐싱을 활용해 의존성 다운로드를 재사용한다.

   ```dockerfile
   # 의존성 파일만 먼저 복사해서 레이어 캐시 활용
   COPY build.gradle settings.gradle ./
   COPY gradle/ gradle/
   RUN ./gradlew dependencies --no-daemon

   # 소스코드 변경 시 위 레이어는 캐시 재사용
   COPY src/ src/
   RUN ./gradlew build --no-daemon -x test
   ```

3. **테스트 스킵**: CI 환경에서 배포용 빌드는 테스트를 스킵하거나 별도 파이프라인에서 실행한다.

   ```dockerfile
   RUN ./gradlew build --no-daemon -x test
   ```

---

### 포트 설정 오류

#### ❌ 문제 상황

배포는 성공했지만 접속이 안 되거나, Health Check가 계속 실패하는 경우.

#### 🧐 원인 분석

Render는 컨테이너가 **`$PORT` 환경변수에 지정된 포트에서 수신 대기**할 것을 요구한다. Spring Boot는 기본적으로 8080 포트를 사용하는데, Render가 내부적으로 할당하는 포트 번호와 다를 수 있다.

#### ✅ 해결 방법

`application.properties`에서 `$PORT` 환경변수를 읽도록 설정한다.

```properties
# application.properties
server.port=${PORT:8080}
```

`${PORT:8080}`은 `PORT` 환경변수가 있으면 그 값을, 없으면(로컬 실행 시) 8080을 기본값으로 사용한다는 의미다.

---

### application.properties vs application.yml 환경별 분리

로컬과 운영 환경의 설정을 분리하는 것은 좋은 개발 습관이다. Spring Boot는 `spring.profiles.active` 값에 따라 다른 설정 파일을 로드한다.

#### 프로파일별 파일 분리 구조

```
src/main/resources/
├── application.yml          ← 공통 설정
├── application-local.yml    ← 로컬 개발 환경
└── application-prod.yml     ← 운영 환경 (Render)
```

```yaml
# application.yml (공통)
spring:
  application:
    name: my-spring-app
  jpa:
    open-in-view: false

server:
  port: ${PORT:8080}

management:
  endpoints:
    web:
      exposure:
        include: health,info
```

```yaml
# application-local.yml (로컬 개발)
spring:
  datasource:
    url: jdbc:h2:mem:testdb
    driver-class-name: org.h2.Driver
  jpa:
    hibernate:
      ddl-auto: create-drop
  h2:
    console:
      enabled: true
```

```yaml
# application-prod.yml (운영 - Render)
spring:
  datasource:
    url: ${DATABASE_URL}
    driver-class-name: org.postgresql.Driver
  jpa:
    hibernate:
      ddl-auto: validate

logging:
  level:
    root: WARN
    com.myapp: INFO
```

로컬 실행 시:

```bash
./gradlew bootRun --args='--spring.profiles.active=local'
```

Render의 환경변수 설정 (render.yaml 또는 대시보드):

```yaml
envVars:
  - key: SPRING_PROFILES_ACTIVE
    value: prod
```

---

## 🐳 멀티 스테이지 Dockerfile 최적화

앞서 소개한 단일 스테이지 Dockerfile은 동작하지만, JDK 이미지를 그대로 배포 이미지로 사용하기 때문에 이미지 크기가 불필요하게 크다. 멀티 스테이지 빌드를 사용하면 빌드 도구(JDK, Gradle)가 포함되지 않은 가벼운 이미지로 배포할 수 있다.

### 빌드 스테이지와 런타임 스테이지 분리

```
단일 스테이지: eclipse-temurin:21-jdk (~600MB) → 배포 이미지
멀티 스테이지: eclipse-temurin:21-jdk (빌드) → eclipse-temurin:21-jre (~200MB) → 배포 이미지
```

JDK에는 컴파일러(`javac`), 디버거 등 개발 도구가 포함된다. 런타임에서는 JRE(Java Runtime Environment)만 있으면 충분하다.

### 프로덕션용 Dockerfile 전체 예시

```dockerfile
# =====================
# 1단계: 빌드 스테이지
# =====================
FROM eclipse-temurin:21-jdk AS builder

WORKDIR /app

# 의존성 캐시 레이어 분리 (소스 변경 시 이 레이어 재사용)
COPY gradlew .
COPY gradle/ gradle/
COPY build.gradle .
COPY settings.gradle .

RUN chmod +x ./gradlew
# 의존성만 먼저 다운로드
RUN ./gradlew dependencies --no-daemon --quiet

# 소스 코드 복사 및 빌드
COPY src/ src/
RUN ./gradlew build --no-daemon -x test

# 실행 가능한 fat jar 위치 확인 및 이름 정규화
RUN find ./build/libs -name "*.jar" ! -name "*plain*" -exec cp {} app.jar \;

# =====================
# 2단계: 런타임 스테이지
# =====================
FROM eclipse-temurin:21-jre AS runtime

# 보안: 루트가 아닌 전용 사용자로 실행
RUN groupadd -r appgroup && useradd -r -g appgroup appuser

WORKDIR /app

# 빌드 스테이지에서 jar만 복사 (빌드 도구 제외)
COPY --from=builder /app/app.jar app.jar

# 파일 소유권 설정
RUN chown appuser:appgroup app.jar

USER appuser

# 포트 문서화 (실제 바인딩은 server.port에서 결정)
EXPOSE 8080

# 메모리 설정 포함한 실행 명령
ENTRYPOINT ["java", \
  "-XX:+UseContainerSupport", \
  "-XX:MaxRAMPercentage=50.0", \
  "-Djava.security.egd=file:/dev/./urandom", \
  "-jar", "app.jar"]
```

### 이미지 크기 비교

| 방식 | 베이스 이미지 | 예상 최종 이미지 크기 |
|---|---|---|
| 단일 스테이지 (JDK) | eclipse-temurin:21-jdk | ~600MB |
| 멀티 스테이지 (JRE) | eclipse-temurin:21-jre | ~250MB |
| 멀티 스테이지 (Alpine JRE) | eclipse-temurin:21-jre-alpine | ~150MB |

Alpine 기반 이미지는 더 작지만, glibc 대신 musl libc를 사용하기 때문에 일부 Java 라이브러리와 호환성 문제가 발생할 수 있다. 문제가 없다면 사용을 권장한다.

```dockerfile
FROM eclipse-temurin:21-jre-alpine AS runtime
```

---

## 📁 .dockerignore 설정

`.gitignore`처럼, `.dockerignore`는 Docker 빌드 컨텍스트에서 제외할 파일을 지정한다. 이를 통해 빌드 속도를 높이고 이미지에 불필요한 파일이 포함되는 것을 방지할 수 있다.

`.dockerignore`가 없으면 `docker build` 명령 시 현재 디렉토리의 **모든 파일**이 Docker 데몬으로 전송된다. `node_modules`, `build/`, `.git/` 등 대용량 디렉토리가 포함되면 빌드 시작 자체가 느려진다.

### .dockerignore 예시

```dockerignore
# Git 관련
.git/
.gitignore
.gitattributes

# Gradle 빌드 산출물 (Docker 빌드 내에서 새로 생성)
.gradle/
build/

# IDE 설정
.idea/
*.iml
.vscode/
*.code-workspace

# OS 관련
.DS_Store
Thumbs.db

# 테스트 관련 (빌드 이미지에 포함 불필요)
src/test/

# 문서
*.md
docs/

# Docker 파일 자체 (불필요)
Dockerfile*
docker-compose*.yml
.dockerignore

# 환경 변수 파일 (절대 포함하면 안 됨)
.env
.env.*
*.env

# 로그 파일
*.log
logs/
```

특히 `.env` 파일을 `.dockerignore`에 반드시 추가해야 한다. 실수로 이미지에 포함되면 Docker Hub 등 퍼블릭 레지스트리에 올릴 때 시크릿이 노출된다.

---

## 🔑 환경 변수 관리

### Render 대시보드에서 환경변수 설정

1. Render 대시보드 접속 → 서비스 선택
2. 좌측 메뉴 **Environment** 클릭
3. **Add Environment Variable** 버튼으로 키-값 추가
4. **Save Changes** 후 자동 재배포 트리거

민감한 정보(JWT_SECRET, API_KEY 등)는 `render.yaml`에 값을 직접 쓰지 않고, 대시보드에서만 입력하는 것을 권장한다.

### render.yaml에서 환경변수 선언

```yaml
services:
  - type: web
    name: my-spring-app
    env: docker
    envVars:
      # 일반 환경변수 (값 직접 지정)
      - key: SPRING_PROFILES_ACTIVE
        value: prod

      # 데이터베이스 연결 문자열 자동 주입
      - key: DATABASE_URL
        fromDatabase:
          name: my-postgres-db
          property: connectionString

      # 시크릿 (대시보드에서 별도 입력 필요)
      - key: JWT_SECRET
        sync: false

      - key: SMTP_PASSWORD
        sync: false
```

### Spring Boot에서 환경변수 읽기

**`@Value` 어노테이션 방식** (단순한 경우):

```java
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class AppConfig {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${server.port:8080}")
    private int serverPort;
}
```

**`@ConfigurationProperties` 방식** (복잡한 설정 그룹의 경우, 더 권장):

```java
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app")
public class AppProperties {

    private String jwtSecret;
    private long jwtExpirationMs;
    private Database database = new Database();

    // getter, setter 생략...

    public static class Database {
        private int maxPoolSize = 3;
        // getter, setter 생략...
    }
}
```

```yaml
# application-prod.yml
app:
  jwt-secret: ${JWT_SECRET}
  jwt-expiration-ms: 86400000
  database:
    max-pool-size: 3
```

**환경변수 이름 규칙**: Spring Boot는 환경변수의 언더스코어(`_`)를 점(`.`)과 하이픈(`-`)으로 자동 변환한다. 따라서 환경변수 `SPRING_DATASOURCE_URL`은 `spring.datasource.url`로 매핑된다.

```
SPRING_PROFILES_ACTIVE=prod
→ spring.profiles.active=prod

JWT_SECRET=mySecret
→ jwt.secret=mySecret (application.yml에서 ${jwt.secret}으로 읽기)
```

---

## 💓 Health Check 설정

배포 후 서비스가 정상인지 확인하기 위해 Health Check를 설정하면, Render가 자동으로 애플리케이션 상태를 감시하고 비정상일 때 이전 버전으로 롤백한다.

### Spring Boot Actuator 추가

```groovy
// build.gradle
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-actuator'
}
```

```yaml
# application.yml
management:
  endpoints:
    web:
      exposure:
        include: health,info
      base-path: /actuator
  endpoint:
    health:
      show-details: when-authorized   # 운영: 인증된 요청에만 상세 정보 노출
```

기본 `/actuator/health` 엔드포인트는 다음과 같은 응답을 반환한다.

```json
{
  "status": "UP"
}
```

데이터베이스 연결 상태까지 포함하려면:

```yaml
management:
  endpoint:
    health:
      show-details: always   # 또는 when-authorized
```

```json
{
  "status": "UP",
  "components": {
    "db": {
      "status": "UP",
      "details": {
        "database": "PostgreSQL",
        "validationQuery": "isValid()"
      }
    },
    "diskSpace": {
      "status": "UP"
    }
  }
}
```

### render.yaml에 healthCheckPath 설정

```yaml
services:
  - type: web
    name: my-spring-app
    env: docker
    plan: free
    healthCheckPath: /actuator/health
```

Render는 배포 후 이 경로에 HTTP GET 요청을 보내 HTTP 200 응답이 오면 배포 성공으로 판단한다. Health Check가 실패하면 배포를 취소하고 이전 정상 상태로 롤백한다.

### 커스텀 Health Indicator 작성

외부 API 연결 여부, 필수 파일 존재 여부 등 커스텀 상태를 Health Check에 포함할 수 있다.

```java
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

@Component
public class ExternalApiHealthIndicator implements HealthIndicator {

    private final ExternalApiClient apiClient;

    public ExternalApiHealthIndicator(ExternalApiClient apiClient) {
        this.apiClient = apiClient;
    }

    @Override
    public Health health() {
        try {
            boolean isAvailable = apiClient.ping();
            if (isAvailable) {
                return Health.up()
                    .withDetail("externalApi", "Available")
                    .build();
            }
            return Health.down()
                .withDetail("externalApi", "Unreachable")
                .build();
        } catch (Exception e) {
            return Health.down(e).build();
        }
    }
}
```

---

## 🧪 로컬 Docker 테스트 방법

Render에 배포하기 전에 로컬에서 Docker 빌드와 실행을 검증하면 빌드 오류를 미리 발견할 수 있다. Render의 빌드 시간(월 400분)을 아낄 수도 있다.

### Docker 빌드

```bash
# 프로젝트 루트에서 실행
docker build -t my-spring-app:local .

# 빌드 캐시 없이 처음부터 빌드 (클린 빌드 검증)
docker build --no-cache -t my-spring-app:local .
```

### 환경변수를 전달하며 컨테이너 실행

```bash
# 기본 실행
docker run -p 8080:8080 my-spring-app:local

# 환경변수 직접 전달
docker run -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=local \
  -e DATABASE_URL=jdbc:h2:mem:testdb \
  -e PORT=8080 \
  my-spring-app:local
```

### .env 파일로 환경변수 관리

로컬 테스트용 환경변수를 `.env` 파일로 관리하면 편리하다.

```bash
# .env (절대 Git에 커밋하지 말 것)
SPRING_PROFILES_ACTIVE=local
PORT=8080
DATABASE_URL=jdbc:postgresql://localhost:5432/mydb
JWT_SECRET=local-dev-secret-not-for-production
```

```bash
# --env-file로 전달
docker run -p 8080:8080 --env-file .env my-spring-app:local
```

### 로컬에서 PostgreSQL과 함께 테스트 (docker-compose)

Render 운영 환경과 동일하게 PostgreSQL을 사용하는 로컬 환경을 만들려면 `docker-compose`를 활용한다.

```yaml
# docker-compose.yml (로컬 개발용, Git에 커밋해도 됨)
version: '3.8'
services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - PORT=8080
      - DATABASE_URL=jdbc:postgresql://db:5432/mydb
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: mydb
      POSTGRES_USER: myuser
      POSTGRES_PASSWORD: mypassword
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U myuser -d mydb"]
      interval: 5s
      timeout: 5s
      retries: 5
```

```bash
# 전체 스택 실행
docker-compose up --build

# 백그라운드 실행
docker-compose up -d --build

# 로그 확인
docker-compose logs -f app

# 종료
docker-compose down
```

### 배포 전 체크리스트

```bash
# 1. 로컬 Docker 빌드 성공 여부 확인
docker build -t my-spring-app:local .

# 2. 컨테이너 정상 기동 확인
docker run -d -p 8080:8080 -e PORT=8080 my-spring-app:local
docker ps   # 컨테이너 상태 확인

# 3. Health Check 엔드포인트 응답 확인
curl http://localhost:8080/actuator/health

# 4. 이미지 크기 확인
docker images my-spring-app:local

# 5. 컨테이너 정리
docker stop $(docker ps -q --filter ancestor=my-spring-app:local)
docker rmi my-spring-app:local
```

---

## 결론

Spring Boot 프로젝트를 Render에 Docker로 배포할 때 마주치는 오류들은 대부분 세 가지 범주로 나뉜다.

**환경 불일치**: `./gradlew` 권한, Gradle Wrapper 파일 누락, Java 버전 불일치. Dockerfile에 명시적으로 환경을 선언하는 것으로 해결된다.

**플랫폼 특성 미숙지**: Render 무료 플랜의 슬립 모드, 512MB 메모리 제한, `$PORT` 환경변수 요구. 이 특성을 알고 처음부터 설계에 반영하는 것이 중요하다.

**운영 환경 설정 부재**: 프로파일 분리, 시크릿 관리, Health Check. 로컬에서 잘 되던 것이 운영에서 안 되는 원인의 대부분이다.

아래 체크리스트를 참고하자.

1. `./gradlew`에 실행 권한 부여 (`chmod +x ./gradlew`) 후 커밋

2. `gradlew`, `gradle-wrapper.jar`, `.properties` 등 Wrapper 관련 파일을 Git에 반드시 커밋

3. Dockerfile에서 `eclipse-temurin` 이미지로 Java 환경 명시, **멀티 스테이지 빌드**로 이미지 크기 최소화

4. Gradle `toolchain`을 사용할 경우 Docker JDK 버전과 일치시킬 것

5. Render 루트에 `render.yaml` 존재 확인, `healthCheckPath` 설정

6. `server.port=${PORT:8080}`으로 Render의 PORT 환경변수 대응

7. JVM 메모리 옵션 `-XX:+UseContainerSupport -XX:MaxRAMPercentage=50.0` 설정

8. PostgreSQL 사용 시 `DATABASE_URL`과 JDBC 설정 추가

9. 로컬 H2, 운영 PostgreSQL 분리 시 `spring.profiles.active`로 환경별 설정 파일 분리

10. Spring Boot Actuator로 Health Check 엔드포인트 구성

11. `.dockerignore` 작성으로 빌드 컨텍스트 최적화

12. Render 배포 전 로컬에서 `docker build` + `docker run`으로 검증

Render는 편리하고 무료로 배포할 수 있는 도구이지만 Java 프로젝트를 위한 별도 설정이 필요하다는 점을 꼭 기억해야겠다!

[^1]: https://docs.gradle.org/current/userguide/toolchains.html
[^2]: https://render.com/
[^3]: https://docs.gradle.org/current/userguide/gradle_wrapper.html
[^4]: https://hub.docker.com/_/eclipse-temurin
[^5]: https://docs.gradle.org/current/userguide/toolchains.html
[^6]: https://jdbc.postgresql.org/
[^7]: https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html
