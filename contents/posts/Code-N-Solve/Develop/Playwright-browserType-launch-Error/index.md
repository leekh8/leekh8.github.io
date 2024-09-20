---
title: "🚀 Gatsby CI/CD 환경에서 Playwright 오류 해결: browserType.launch, Chromium 버전 충돌 문제 해결"
description: "Gatsby CI/CD 파이프라인에서 Playwright의 browserType.launch 오류와 Chromium 버전 충돌로 빌드가 실패하는 오류의 원인을 분석하고, 캐시 삭제, Chromium 경로 명시, 빌드 로그 활용 등 다양한 해결 방법을 통하여 GitHub Actions와 Gatsby 빌드 환경 설정을 최적화하여 안정적인 CI/CD 파이프라인을 구축해보자!"
date: 2024-09-13
update: 2024-09-19
tags:
  - Code N Solve
  - GitHub Actions
  - Gatsby
  - CI/CD
  - Playwright
  - Chromium
  - 빌드 오류
  - 배포 자동화
series: "Code N Solve"
---

## Code N Solve 📘: Playwright와 Gatsby CI/CD 과정에서 발생한 browserType.launch 오류 및 해결 방법 정리

이전에 해결했다고 생각했던 Playwright[^1] 관련 문제가 다시 발생했다.

Gatsby build 과정에서 지속적으로 오류가 발생했다.

## 문제: Playwright Chromium 브라우저 버전 참조 오류[^2]

- Gatsby 블로그의 배포를 위한 GitHub Actions에서 Playwright 설치 시, 오래된 Chromium 브라우저 버전(예: chromium-1129)을 계속 참조하는 문제가 발생했다.
- 캐시를 비워도 해결되지 않거나, 최신 브라우저 버전(chromium-1134)을 올바르게 사용하지 못했다.
- ```bash
  browserType.launch: Executable doesn't exist at /home/runner/.cache/ms-playwright/chromium-1129/chrome-linux/chrome
  ```

## 문제 분석

- 이전에 캐시된 Playwright 브라우저 경로가 GitHub Actions에서 참조되면서, 최신 버전 설치 후에도 잘못된 경로를 사용함.
- Playwright 경로를 명확하게 지정하지 않아 Gatsby 빌드에서 문제가 발생함.

## 해결 방법

- Playwright 캐시 강제 삭제

  - 캐시된 Playwright 브라우저 파일들을 강제로 삭제한 후, 최신 버전으로 다시 설치하였다.
  - ```yml
    - name: Remove Playwright Cache
      run: |
        rm -rf ~/.cache/ms-playwright
        rm -rf ~/work/<your-repo-name>/<your-repo-name>/.cache/ms-playwright
    ```
  - 소용은 없었다.

- Chromium 경로 명확히 지정

  - Playwright 브라우저를 설치한 후, 최신 Chromium 경로를 확인하여 명확하게 설정한다.
  - 이를 환경 변수에 저장하여 GitHub Actions와 Gatsby 빌드 시 명시적으로 해당 경로를 참조하게한다.
  - ```yml
    - name: Install Playwright and Set Browser Path
      run: |
        npx playwright install --with-deps chromium
        CHROMIUM_DIR=$(ls -d $HOME/.cache/ms-playwright/chromium-*/ | sort -V | tail -n 1)
        echo "CHROMIUM_DIR=$CHROMIUM_DIR" >> $GITHUB_ENV
        ls -al $CHROMIUM_DIR
    ```
  - 소용은 없었다.

- 빌드 시 Playwright 경로 확인

  - 빌드 도중 Playwright 브라우저가 올바르게 설치되었는지, 그리고 정확한 경로를 참조하고 있는지 확인하는 로그를 추가하여 디버깅에 활용했다.
  - ```yml
    - name: Verify Playwright Installation and Path
      run: |
        npx playwright --version
        echo "Using Chromium from: $CHROMIUM_DIR"
        ls -al $CHROMIUM_DIR
    ```

- 빌드 전 gatsby 캐시 삭제
  - 빌드 실행 전에 `package.json`에 설정해둔 cache clean 명령어를 미리 사용하여 빌드 시 이전 cache를 사용하지 않고 빌드하여 올바른 디렉토리를 찾도록 하였다.
  - ```yml
    - name: Build with Gatsby
      env:
        PREFIX_PATHS: "true"
        CHROMIUM_DIR: ${{ env.CHROMIUM_DIR }}
      run: |
        yarn clean
        yarn build
    ```

### 최종 CI/CD 워크플로

- CI 파이프라인

  - 최신 Playwright 브라우저를 `$HOME/.cache/ms-playwright` 경로에 설치하고, 이 버전의 경로를 환경 변수로 설정하여 빌드 과정에서 활용하였다.
  - 또, pull request와 push 상황을 나누어 관리하였다.
  - ```bash
    name: CI

    on:
      pull_request:
        branches:
          - main
      push:
        branches:
          - main

    jobs:
      check_on_pull_request:
        if: github.event_name == 'pull_request'
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v4
          - uses: actions/setup-node@v4
            with:
              node-version: "20"

          - name: Remove Playwright Cache
            run: |
              rm -rf ~/.cache/ms-playwright

          - name: Install Playwright and Chromium Browser
            run: |
              npx playwright install --with-deps chromium
              CHROMIUM_DIR=$(ls -d $HOME/.cache/ms-playwright/chromium-*/ | sort -V | tail -n 1)
              echo "CHROMIUM_DIR=$CHROMIUM_DIR" >> $GITHUB_ENV
              ls -al $CHROMIUM_DIR

          - name: Install node packages
            run: yarn

          - name: Check lint
            run: yarn check:lint

          - name: Check prettier
            run: yarn check:prettier

      build_on_push:
        if: github.event_name == 'push'
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v4
          - uses: actions/setup-node@v4
            with:
              node-version: "20"

          - name: Remove Playwright Cache
            run: |
              rm -rf ~/.cache/ms-playwright

          - name: Install Playwright and Chromium Browser
            run: |
              npx playwright install --with-deps chromium
              CHROMIUM_DIR=$(ls -d $HOME/.cache/ms-playwright/chromium-*/ | sort -V | tail -n 1)
              echo "CHROMIUM_DIR=$CHROMIUM_DIR" >> $GITHUB_ENV
              ls -al $CHROMIUM_DIR

          - name: Install node packages
            run: yarn

          - name: Build
            run: yarn build

          - name: Verify Playwright Installation
            run: npx playwright --version
    ```

- CD 파이프라인

  - CI가 성공적으로 완료되면 자동으로 진행되면서 build 전에 캐시 삭제 후 build를 진행하여 이전에 사용하던 경로가 아닌 새로운 버전의 playwright가 설치된 경로를 사용하도록 하였다.
  - ```bash
    name: CD

    on:
      workflow_run:
        workflows: ["CI"]
        types:
          - completed

    permissions:
      contents: read
      pages: write
      id-token: write

    jobs:
      build:
        runs-on: ubuntu-latest
        steps:
          - name: Checkout Repository
            uses: actions/checkout@v4

          - name: Remove Playwright Cache
            run: |
              rm -rf ~/.cache/ms-playwright

          - name: Setup Node.js
            uses: actions/setup-node@v4
            with:
              node-version: "20"

          - name: Install Project Dependencies and Playwright Browsers
            run: |
              yarn install
              npx playwright install --with-deps chromium
              CHROMIUM_DIR=$(ls -d $HOME/.cache/ms-playwright/chromium-* | sort -V | tail -n 1)
              echo "CHROMIUM_DIR=$CHROMIUM_DIR" >> $GITHUB_ENV
              ls -al $CHROMIUM_DIR

          - name: Build with Gatsby
            env:
              PREFIX_PATHS: "true"
              CHROMIUM_DIR: ${{ env.CHROMIUM_DIR }}
            run: |
              yarn clean
              yarn build

          - name: Upload artifact
            uses: actions/upload-pages-artifact@v3
            with:
              path: ./public

      deploy:
        environment:
          name: github-pages
          url: ${{ steps.deployment.outputs.page_url }}
        runs-on: ubuntu-latest
        needs: build
        steps:
          - name: Deploy to GitHub Pages
            id: deployment
            uses: actions/deploy-pages@v4
    ```

## 추가

- Gatsby 페이지 설징 및 404 오류 해결
  - Node.js 20 버전 설치 후 `actions/configure-pages@v5`을 추가하여 Gatsby 페이지를 설정하여 빌드된 블로그가 정상적으로 배포되도록 한다.
  - ```yml
    - name: Setup Pages
      id: pages
      uses: actions/configure-pages@v5
      with:
        static_site_generator: gatsby
    ```

### Github Pages의 동작 방식:

- Github Pages는 정적 웹사이트 호스팅 서비스로, HTML, CSS, JavaScript와 같은 정적 파일을 제공한다.
- 사용자가 특정 URL에 접속하면, Github Pages는 해당 URL에 맞는 HTML 파일을 찾아서 제공한다.
- 만약 해당 URL에 맞는 HTML 파일이 없으면, 404 오류 페이지를 표시한다.

### Gatsby의 특징:

- Gatsby는 React 기반의 정적 웹사이트 생성 프레임워크로 빌드 과정에서 모든 페이지를 미리 생성하여 정적 HTML 파일로 저장한다.
- 하지만 Gatsby는 클라이언트 사이드 라우팅을 사용하여 페이지 전환을 처리한다.[^3]
- 즉, 사용자가 웹사이트 내에서 링크를 클릭하면, 실제로 새로운 페이지를 요청하는 것이 아닌 JavaScript를 통해 페이지 내용을 변경한다.

### 문제 발생 원인:

- `actions/configure-pages@v5`[^4] 액션이 없으면, Github Pages는 Gatsby의 클라이언트 사이드 라우팅을 이해하지 못한다.[^5]
- 사용자가 Gatsby 블로그 내에서 링크를 클릭하여 페이지를 전환하면, 실제로 새로운 URL에 접속하는 것처럼 보이지만 Github Pages는 해당 URL에 맞는 HTML 파일을 찾지 못해 404 오류 페이지를 표시했던 것이다.

### 해결 방법:

- `actions/configure-pages@v5` 액션 사용을 통해, Gatsby 블로그의 특징을 Github Pages에 알려준다.
- 이 액션은 Gatsby 블로그의 빌드 결과를 분석하여, 각 페이지에 대한 정보를 Github Pages에 제공한다.
- 따라서 사용자가 Gatsby 블로그 내에서 링크를 클릭하여 페이지를 전환하더라도, Github Pages는 해당 URL에 맞는 HTML 파일을 찾아서 제공할 수 있게 된다.

## 결론

- Playwright 경로 문제
  - 최신 playwright 버전을 확인하고, 해당 버전의 최신 playwright를 사용하도록, 이전 캐시를 삭제함으로써 원하는 대로 최신 playwright를 사용하도록 지정할 수 있었다.
- Gatsby 페이지 설정 및 404 오류 해결
  - `actions/configure-pages@v5` 액션을 추가하여 Gatsby 페이지를 설정하고 404 페이지 오류를 해결할 수 있었다.

[^1]: https://playwright.dev/
[^2]: https://github.com/microsoft/playwright/issues/5767
[^3]: https://www.gatsbyjs.com/docs/conceptual/rendering-options/
[^4]: https://github.com/actions/configure-pages?tab=readme-ov-file
[^5]: https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting/how-gatsby-works-with-github-pages/#github-actions
