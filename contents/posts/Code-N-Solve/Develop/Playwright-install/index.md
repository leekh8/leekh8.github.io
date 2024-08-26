---
title: "🚀 CI/CD 환경에서 Playwright 문제 해결하기: 설치 오류 분석 및 해결 방안"
description: "CI/CD 파이프라인에서 Playwright 브라우저 설치와 관련된 문제 해결 및 캐시 사용 최적화 방법"
date: 2024-08-26
update: 2024-08-26
tags:
  - GitHub Actions
  - Gatsby
  - SEO
  - Netlify
  - Code N Solve
series: "Code N Solve"
---

## Code N Solve 📘: CI/CD 환경에서 Playwright 문제 해결하기: 설치 오류 분석 및 해결 방안

Gatsby를 사용해 블로그를 배포할 때, Playwright 설치와 관련해 문제가 발생했다.

어떻게 문제를 해결했는지 단계별로 살펴본다.

## 문제

- 로컬 환경에서는 정상적으로 작동하는 Gatsby 블로그가 CI/CD 파이프라인에서 Playwright 브라우저 설치 오류로 인한 빌드 실패가 발생했다.
- 특히, Playwright 설치 후, 브라우저 실행할 때 경로가 제대로 설정되지 않아 발생하였다.[^3]
- ```bash
    Error: Failed to launch chromium because executable doesn’t exist

    browserType.launch: Executable doesn't exist at /home/runner/.cache/ms-playwright/chromium-1124/chrome-linux/chrome

    Error:browserType.launch: Executable doesn't exist at /home/runner/.cache/ms-  playwright/chromium-1124/chrome-linux/chrome
  ```

### Playwright[^1] ? 🤔

- 웹 어플리케이션을 자동으로 테스트할 수 있는 도구로 여러 브라우저(Chromium, Firefox, WebKit 등)에서 웹 페이지의 기능을 테스트 할 수 있다.

#### Playwright 사용 목적

- CI/CD 파이프라인에서 자동화된 브라우저 테스트를 수행하기 위해 Playwright를 설치하고자 하였다.
- 이를 통해 코드 변경 사항이 실제 브라우저 환경에서 잘 작동하는지 확인할 수 있고, 이로 인한 잠재적인 문제를 미리 발견할 수 있다.
  - **결론: 브라우저 환경에서의 자동화된 테스트를 위해 사용.**

### CI/CD 설정

- `npm ci` (또는 `yarn install`)로 필요한 의존성을 설치한 후, `npx playwright isntall` 명령어로 Playwright 브라우저를 설치하였다.[^2]
- ```bash
   - name: Install Dependencies
      run: npm ci

    - name: Install Playwright Browsers
      run: npx playwright install
  ```

## 문제 분석

- 권한 문제
  - Playwright 브라우저 설치 중 권한이 거부되어 `sudo npx playwright install`을 시도했으나 여전히 문제가 발생하였다.
- 설치 경로 문제
  - Playwright의 기본 설치 경로에 대한 권한 문제로 인해 브라우저가 설치되지 않았거나, 설치된 위치에서 실행되지 않는 오류가 발생하였다.

## 해결 방법

- 설치 경로 수정
  - Playwright 브라우저의 설치 경로를 `$HOME/.cache/ms-playwright`로 변경하고, 이 경로를 환경 변수로 설정하여 문제를 해결했다.
- 캐시 무효화
  - 손상되었거나 충돌이 발생할 가능성이 있는 캐시를 무효화하고, 새로운 캐시를 생성하도록 빌드를 실행한다.
- 설치 경로 검증
  - 설치 후 해당 경로에 브라우저가 제대로 설치되었는지 확인하는 절차를 추가했다.

### CI/CD 파이프라인에서의 Playwright 설정

- CI 파이프라인

  - Playwright 브라우저를 `$HOME/.cache/ms-playwright` 경로에 설치하고 이 경로를 환경 변수로 설정하여 빌드 과정에서 활용하였다.
  - ```bash
    - name: Set Playwright Browsers Path
      run: echo "PLAYWRIGHT_BROWSERS_PATH=$HOME/.cache/ms-playwright" >> $GITHUB_ENV

    - name: Check Playwright Browsers Path
      run: echo "Playwright Browsers Path ---> ${{ env.PLAYWRIGHT_BROWSERS_PATH }}"

    - name: Install Playwright Browsers
      run: npx playwright install
    ```

- CD 파이프라인
  - CI에서 설치된 브라우저를 재사용하려 했으나, GitHub Actions 환경에서 CI의 캐시가 CD로 이어지지 않으므로 CD에서도 브라우저를 설치하는 과정을 반복해야 했다.
- 효율적인 설정
  - Playwright 브라우저 설치 후 설치 경로를 확인하는 단계를 추가하여 문제 발생 여부를 사전에 파악하고, 설치된 파일의 정확성을 검증하였다.

## 결론

- Playwright 설치 문제
  - CI/CD 환경에서 발생하는 Playwright 브라우저 설치 문제는 권한 문제를 해결하기 위해 설치 경로를 수정하고, 캐시 무효화 및 설치 경로 검증 절차를 추가하는 것으로 해결할 수 있다.
- 효율적인 빌드
  - 이러한 접근법을 통해 로컬 환경뿐만 아니라, CI/CD 환경에서도 안정적인 빌드를 유지할 수 있다.

[^1]: https://playwright.dev/
[^2]: https://playwright.dev/docs/intro
[^3]: https://github.com/microsoft/playwright/issues/13188
