---
title: "🚀 Spring Boot 프로젝트의의 Render 배포 실패 사례 정리: gradlew, JAVA_HOME, Dockerfile 문제 해결"
description: "Render에 Spring Boot 프로젝트를 배포할 때 겪는 gradlew 실행 오류, JAVA_HOME 설정 문제, Dockerfile 작성법의의 실제 사례 정리"
date: 2025-05-13
update: 2025-05-14
tags:
  - Code N Solve
  - Spring Boot
  - Render
  - CI/CD
  - Docker
  - Gradle
series: "Code N Solve"
---

## Code N Solve 📘: Spring Boot 프로젝트의의 Render 배포 실패 사례 정리

지난번 [Vite 배포 오류 글](https://leekh8.github.io/Vite-Develop-Error/)과는 달리, Java + Spring Boot + Gradle[^1] 환경의 백엔드 프로젝트를 Render[^2]에 Docker로 배포할 때 겪은 빌드 실패 사례와 해결 과정을 정리하였다.

각각의 오류를 분석하고 해결한 과정에 대해 알아보자.

Vite나 Node.js 환경이 아닌, Java 기반 서버를 Docker 환경에서 Render로 배포하려고 하는 다른 사람에게 도움이 되면 좋겠다.

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

#### 1. 실행 권한 부여

- ```bash
  chmod +x ./gradlew
  ```

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

- ```bash
  gradlew
  gradlew.bat
  gradle/wrapper/gradle-wrapper.jar
  gradle/wrapper/gradle-wrapper.properties
  ```
- 이 파일들은 Gradle 빌드 시스템의 핵심 요소로, Gradle 설치 없이도 `./gradlew` 명령어로 빌드가 가능하게 함.

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

- ```dockerfile
    # Dockerfile
    FROM eclipse-temurin:21-jdk

    WORKDIR /app
    COPY . .

    RUN chmod +x ./gradlew
    RUN ./gradlew build

    CMD find ./build/libs -name "*.jar" | xargs java -jar
  ```

- Render에서 Java를 사용할 수 있게 하기 위해 Dockerfile에서 Java를 명시척으로 설치함.
  - `eclipse-temurin`[^4]은 OpenJDK를 제공하는 공식 Docker 이미지.

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

#### 1. `build.gradle`에서 toolchain 제거

- ```bash
  tasks.withType(JavaCompile) {
    options.encoding = 'UTF-8'
  }
  ```
- `build.gradle`에서 toolchain 제거 또는 Java 버전 자동 매칭 제거.

#### 또는 2. Java 버전 Docker와 맞추기

- ```dockerfile
  FROM eclipse-temurin:17-jdk
  ```

- Dockerfile의 JDK 버전을 Gradle toolchain과 일치시킴.

  - 🔎 추가로, Gradle의 toolchain 설정이 꼭 필요한 경우에는 Dockerfile에서 동일한 JDK 버전을 명시적으로 포함시켜야 함.

  - ```bash
    java {
      toolchain {
        languageVersion = JavaLanguageVersion.of(17)
      }
    }
    ```

  - 이 경우, 빌드 환경에서도 정확히 JDK 17이 설치되어 있어야 정상 작동함.

  - ```bash
    Failed to calculate the value of task ':compileJava' property 'javaCompiler'.
    Cannot find a Java installation matching: {languageVersion=17...}
    ```

## 🚨 5. Render 배포 설정 - render.yaml

### 🧐 원인 분석

- Github 저장소 루트에 `render.yaml`이 있어야 함.

- `Dockerfile` 기준으로 빌드되도록 설정 필요함.

- `Dockerfile`이 존재하고 `CMD` 구문에서 `.jar`실행해야 함.

- 여러 서비스가 있을 경우 `healthCheckPath`, `buildCommand` 등 추가 설정 가능.

### ✅ 해결 방법

#### 1. `render.yaml` 작성

```bash
  services:
    - type: web
      name: testweave
      env: docker
      plan: free
```

## 🚨 6. DATABASE_URL 자동 제공 vs H2

- Render는 PostgreSQL 사용 시 환경변수 `DATABASE_URL`을 자동 제공함.[^6]

- `postgres://<user>:<password>@<host>:<port>/<dbname>` 형식의 접속 문자열로, Spring Boot에서 외부 데이터베이스에 연결하기 위한 정보를 한 줄로 제공함.

- 기존에 `H2 (in-memory)`를 사용했다면 `application.properties`에 다음을 반영해야 함.

### ❌ 문제 상황

### 🧐 원인 분석

- 로컬 개발에서 H2 인메모리 DB를 사용하다가, Render와 같은 운영 배포 환경세서는 PostgreSQL 같은 영속적인 데이터베이스가 필요함

- Render는 PostgreSQL 데이터베이스를 생성하면 자동으로 `DATABASE_URL` 환경변수를 생성해주지만, Spring Boot의 `application.properties`에서 이 값을 읽도록 설정하지 않으면 기본적으로 H2를 계속 사용하거나 연결 오류가 발생함.

- 또한 PostgreSQL을 사용하려면 JDBC 드라이버 의존성을 별도로 추가해야 하며, 로컬에서는 문제가 없었던 설정이 Render에서는 작동하지 않을 수 있음.

### ✅ 해결 방법

#### 1. PostgreSQL 사용 시 설정

- ```bash
  # application.properties
  spring.datasource.url=${DATABASE_URL}
  spring.datasource.driver-class-name=org.postgresql.Driver
  spring.jpa.hibernate.ddl-auto=update
  ```

- ```bash
  # build.gradle
  dependencies {
    implementation 'org.postgresql:postgresql:42.7.3'
  }
  ```

- PostgreSQL 드라이버 의존성도 build.gradle에 추가 필요함.

### ⛔ H2에서 전환 시 주의

- 로컬 개발과 배포 환경에서 DB가 다를 경우, 데이터 스키마가 일치하지 않을 수 있으므로 Flyway 또는 Liquibase 등의 마이그레이션 툴을 사용하는 것이 좋음.

- Render에서 제공하는 `DATABASE_URL` 환경변수는 아래와 같은 형식.

  - `postgres://username:password@hostname:port/dbname`

- 해당 URL은 `spring.datasource.url`에 그대로 넣으면 Spring Boot에서 자동으로 분리 파싱하여 사용 가능함.

## 결론

1. `./gradlew`에 실행 권한 부여 (`chmod +x ./gradlew`)

2. `gradlew`, `gradle-wrapper.jar`, `.properties` 등 Wrapper 관련 파일을 Git에 반드시 커밋

3. `Dockerfile`에서 `eclipse-temurin` 이미지로 Java 환경 명시

4. Gradle `toolchain`을 사용할 경우 Docker JDK 버전과 일치시킬 것

5. Render 루트에 `render.yaml` 존재 확인

6. PostgreSQL 사용 시 `DATABASE_URL`과 JDBC 설정 추가

7. 로컬에서는 H2, 운영에서는 PostgreSQL을 사용한다면 DB 마이그레이션 도구(Flyway 등) 도입 고려

Render는 편리하고 무료로 배포할 수 있는 도구이지만 Java 프로젝트를 위한 별도 설정이 필요하다는 점을 꼭 기억해야겠다!

[^1]: https://docs.gradle.org/current/userguide/toolchains.html
[^2]: https://render.com/
[^3]: https://chatgpt.com/c/67e36540-b3e8-800a-a312-039366b172c9
[^4]: https://hub.docker.com/_/eclipse-temurin
[^5]: https://docs.gradle.org/current/userguide/toolchains.html
[^6]: https://jdbc.postgresql.org/
