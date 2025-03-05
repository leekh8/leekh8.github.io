---
title: "🚀 Vite 배포 오류 해결: xdg-open, CJS API, npm 버전 충돌 문제 분석"
description: "Vite 프로젝트를 Render에 배포할 때 발생하는 오류들과 그 해결 과정 정리"
date: 2025-03-05
update: 2025-03-05
tags:
  - Code N Solve
  - Vite
  - CI/CD
  - Docker
  - Render
series: "Code N Solve"
---

## Code N Solve 📘: Vite 배포 오류 해결 - xdg-open, CJS API, npm 버전 충돌 문제 분석

Vite 프로젝트를 Render에서 배포하는 과정에서 몇가지 오류가 발생했다.

처음에는 브라우저 자동 실행 문제, 이후에는 Vite의 CJS API 경고, npm 버전 충돌 문제가 있었다.

각각의 오류를 분석하고 해결한 과정에 대해 알아보자.

## 🚨 1. xdg-open 오류: "spawn xdg-open ENOENT"

### ❌ 문제 상황

Vite 개발 서버 실행 시 다음과 같은 오류가 발생했다.

```bash
Error: spawn xdg-open ENOENT
    at ChildProcess._handle.onexit (node:internal/child_process:284:19)
    at onErrorNT (node:internal/child_process:477:16)
    at process.processTicksAndRejections (node:internal/process/task_queues:82:21)
```

### 🧐 원인 분석

- `xdg-open`은 Linux 환경에서 기본 웹 브라우저를 여는 명령어.
- Render에서 `vite dev` 실행 시 브라우저를 자동으로 열려고 하지만, 컨테이너 환경에는 `xdg-open`이 기본적으로 설치되지 않음.
- Vite 공식 문서에서는 개발 서버 실행 시 브라우저를 자동으로 열지 않도록 설정할 수 있다고 설명함.[^1]

### ✅ 해결 방법

#### 1. Render 환경 변수 추가

- ```bash
  BROWSER=none
  ```
- Render 환경에서 BROWSER=none을 설정하면 브라우저 자동 실행을 막을 수 있다.

#### 또는 2. xdg-utils 패키지 설치

- 만약 개발 환경에서 xdg-open이 없을 경우 다음을 실행한다.
- ```bash
  sudo apt update && sudo apt install xdg-utils
  ```
- Ubuntn나 Debian 계열에서 `xdg-open`을 설치하는 명령어로, CentOS/RHEL 계열에서는 `sudo yum install xdg-utils` 명령어를 사용한다.[^2]

## 🚨 2. Vite CJS API 사용 경고

### ❌ 문제 상황

- Vite 실행 시 다음과 같은 경고 메시지가 출력됨.
- ```bash
  The CJS build of Vite's Node API is deprecated.
  See https://vite.dev/guide/troubleshooting.html#vite-cjs-node-api-deprecated for more details.
  ```

### 🧐 원인 분석

- Vite 5 버전부터는 `CommonJS(CJS)` 대신 `ECMAScript Module(ESM)` 방식 사용을 권장함.[^3]
- 기존의 `vite.config.js` 파일이 `CommonJS` 방식을 따르고 있음.
- Vite 공식 문서에서는 `ESM(ECMAScript Module)` 방식으로 변경할 것을 권장.

### ✅ 해결 방법

#### 1. vite.config.js 파일을 vite.config.mjs로 변경

- ```bash
  mv vite.config.js vite.config.mjs
  ```

#### 또는 2. 기존의 `require` 구문을 `import`로 변경

- ```js
  import { defineConfig } from "vite"

  export default defineConfig({
    server: {
      host: true,
    },
  })
  ```

#### 또는 3. `package.json`에 다음 설정 추가

- ```js
  {
  "type": "module"
  }
  ```
- Vite 공식 문서에서 ESM 방식으로 사용하도록 권장하고 있다.[^3]

## 🚨 3. npm 버전 충돌: "EBADENGINE" 오류

### ❌ 문제 상황

Docker 빌드 과정에서 다음과 같은 오류 발생

```bash
npm error code EBADENGINE
npm error engine Unsupported engine
npm error engine Not compatible with your version of node/npm: npm@11.1.0
npm error notsup Required: {"node":"^20.17.0 || >=22.9.0"}
npm error notsup Actual:   {"npm":"10.8.2","node":"v18.20.7"}
```

### 🧐 원인 분석

- `npm install -g npm@latest` 실행 시 `npm@11.1.0`을 설치하려고 하지만, 현재 사용 중인 Node.js 버전이 `18.20.7`로 호환되지 않음.
- `npm@11.1.0`은 Node.js 20.17.0 이상이 필요함.[^4]
- Node.js 공식 문서에서 특정 npm 버전이 특정 Node.js 버전과 호환되는지 확인 가능함.[^5]

### ✅ 해결 방법

#### 1. Node.js 버전을 20 이상으로 업그레이드

- Dockerfile에서 Node.js 버전을 올려서 해결할 수 있다.

  - ```dockerfile
    FROM node:20-alpine
    WORKDIR /app
    COPY package*.json ./
    RUN npm install --legacy-peer-deps
    COPY . .
    EXPOSE 3000
    CMD ["npm", "start"]
    ```

#### 또는 2. `postinstall` 스크립트 수정

- `package.json`에서 `postinstall` 스크립트를 수정하여 npm 최신 버전으로 강제 업데이트하지 않도록 한다.
- ```json
  "postinstall": "node -v && npm -v"
  ```

## 결론

1. xdg-open 오류: Render에서 `BROWSER=none` 설정하여 해결.
2. Vite CJS API 경고: `package.json`에서 `"type": "module"` 으로 변경.
3. npm 버전 충돌: Dockerfile에서 Node.js 버전 20 이상으로 올려 해결.

이제 Vite 프로젝트를 Render에 원활하게 배포할 수 있다!

[^1]: https://vite.dev/guide/troubleshooting.html
[^2]: https://www.freedesktop.org/wiki/Software/xdg-utils/
[^3]: https://vite.dev/guide/esm
[^4]: https://github.com/npm/cli/releases/tag/v11.1.0
[^5]: https://nodejs.org/en/download/releases
