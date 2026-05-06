---
title: "Playwright 완전 가이드: 설치부터 CI/CD 자동화까지"
description: "Playwright로 브라우저 자동화와 E2E 테스트를 처음 시작하는 분을 위한 완전 가이드입니다. 설치, Chromium·Firefox·WebKit 설정, locator API, 스크린샷, playwright.config.ts, GitHub Actions CI/CD 연동까지 실전 예제 중심으로 정리합니다."
date: 2026-05-06
update: 2026-05-06
tags:
  - Playwright
  - E2E 테스트
  - 브라우저자동화
  - CI/CD
  - GitHub Actions
  - Chromium
category: "Code N Solve"
series: "Playwright 실전 가이드"
---

> **이 시리즈의 다른 글**
> - [오류 해결] [browserType.launch: executable doesn't exist 해결](/playwright-browsertype-launch-error/)
> - [오류 해결] [failed to create browser context, $HOME 환경 변수, gstack setup failed 해결](/playwright-cicd-troubleshooting/)

---

## Playwright란?

Playwright는 Microsoft가 만든 오픈소스 브라우저 자동화 라이브러리입니다. **Chromium, Firefox, WebKit(Safari)** 세 가지 엔진을 하나의 API로 제어할 수 있어서 크로스 브라우저 테스트에 강점이 있습니다.

**Selenium과의 차이점:**

| 항목 | Playwright | Selenium |
|------|-----------|---------|
| 브라우저 드라이버 | 내장 (별도 설치 불필요) | ChromeDriver 등 별도 설치 |
| 자동 대기 | Auto-wait 내장 | 명시적 대기 필요 |
| 속도 | 빠름 | 상대적으로 느림 |
| 스크린샷/동영상 | 기본 제공 | 추가 설정 필요 |
| 언어 지원 | JS/TS, Python, Java, C# | 동일 |

**주요 사용 사례:**
- E2E(End-to-End) 테스트 자동화
- 웹 스크래핑
- 반복 작업 자동화 (로그인, 폼 제출 등)
- 스크린샷/PDF 생성
- 성능 측정

---

## 설치

### Node.js 프로젝트에 설치

```bash
# npm
npm init playwright@latest

# 또는 기존 프로젝트에 추가
npm install -D @playwright/test

# 브라우저 바이너리 설치 (Chromium, Firefox, WebKit)
npx playwright install

# 특정 브라우저만 설치
npx playwright install chromium
npx playwright install firefox
```

`npm init playwright@latest` 실행 시 대화형으로 설정합니다:

```
Where to put your end-to-end tests? › tests
Add a GitHub Actions workflow? › Y
Install Playwright browsers? › Y
```

### Python 프로젝트에 설치

```bash
pip install playwright
playwright install

# 특정 브라우저만
playwright install chromium
```

### 설치 후 디렉토리 구조

```
my-project/
├── tests/
│   └── example.spec.ts     # 테스트 파일
├── playwright.config.ts    # 설정 파일
├── package.json
└── node_modules/
```

---

## 브라우저 설치 경로와 환경 변수

Playwright 브라우저 바이너리는 기본적으로 아래 경로에 설치됩니다:

```bash
# macOS
~/Library/Caches/ms-playwright/

# Linux
~/.cache/ms-playwright/

# Windows
%USERPROFILE%\AppData\Local\ms-playwright\
```

### PLAYWRIGHT_BROWSERS_PATH 설정

기본 경로가 아닌 다른 위치에 설치하고 싶을 때 환경 변수로 지정합니다:

```bash
# 설치 경로 변경
export PLAYWRIGHT_BROWSERS_PATH=/opt/playwright-browsers
npx playwright install

# 또는 .env 파일에 등록
PLAYWRIGHT_BROWSERS_PATH=/opt/playwright-browsers
```

CI/CD 환경에서 이 변수가 설정되지 않거나 경로가 맞지 않으면 오류가 발생합니다. 자세한 오류 해결은 다음 글을 참고하세요:

→ [browserType.launch: executable doesn't exist 오류 해결](/playwright-browsertype-launch-error/)

---

## 첫 번째 테스트 작성

```typescript
// tests/example.spec.ts
import { test, expect } from '@playwright/test';

test('홈페이지 타이틀 확인', async ({ page }) => {
  // 페이지 이동
  await page.goto('https://example.com');

  // 타이틀 검증
  await expect(page).toHaveTitle(/Example/);
});

test('버튼 클릭 후 결과 확인', async ({ page }) => {
  await page.goto('https://example.com');

  // 버튼 클릭
  await page.getByRole('button', { name: '시작하기' }).click();

  // URL 변경 확인
  await expect(page).toHaveURL(/dashboard/);
});
```

```bash
# 테스트 실행
npx playwright test

# 헤드 모드로 실행 (브라우저 화면 보면서)
npx playwright test --headed

# 특정 파일만 실행
npx playwright test tests/example.spec.ts

# 특정 테스트만 실행
npx playwright test --grep "홈페이지"

# UI 모드 (인터랙티브 디버깅)
npx playwright test --ui
```

---

## 핵심 API

### 페이지 이동

```typescript
// 기본 이동
await page.goto('https://example.com');

// 응답 확인
const response = await page.goto('https://example.com');
console.log(response?.status()); // 200

// 뒤로/앞으로
await page.goBack();
await page.goForward();

// 새로고침
await page.reload();
```

### 요소 찾기 — Locators

Playwright의 핵심은 **Locator API**입니다. 요소를 찾는 가장 권장되는 방식입니다:

```typescript
// 역할(Role)로 찾기 — 가장 권장
page.getByRole('button', { name: '로그인' })
page.getByRole('link', { name: '홈' })
page.getByRole('textbox', { name: '이메일' })

// 텍스트로 찾기
page.getByText('안녕하세요')
page.getByText('안녕하세요', { exact: true })  // 정확히 일치

// 플레이스홀더로 찾기 (입력 필드)
page.getByPlaceholder('이메일을 입력하세요')

// 라벨로 찾기
page.getByLabel('비밀번호')

// alt 텍스트로 찾기 (이미지)
page.getByAltText('로고')

// CSS 선택자 (마지막 수단)
page.locator('.btn-primary')
page.locator('#submit-button')
page.locator('input[type="email"]')
```

### 인터랙션

```typescript
// 클릭
await page.getByRole('button', { name: '제출' }).click();

// 더블클릭
await page.getByText('파일명').dblclick();

// 마우스 오버 (hover)
await page.getByRole('navigation').hover();

// 텍스트 입력
await page.getByLabel('이메일').fill('user@example.com');

// 기존 값 지우고 입력
await page.getByLabel('검색').clear();
await page.getByLabel('검색').fill('playwright');

// 키보드 입력
await page.getByLabel('검색').press('Enter');
await page.keyboard.press('Tab');

// 체크박스
await page.getByRole('checkbox', { name: '동의' }).check();
await page.getByRole('checkbox', { name: '동의' }).uncheck();

// 셀렉트박스
await page.getByRole('combobox').selectOption('option-value');
await page.getByRole('combobox').selectOption({ label: '옵션 이름' });

// 파일 업로드
await page.getByLabel('파일 선택').setInputFiles('path/to/file.pdf');
```

### 대기 (Waiting)

Playwright는 **Auto-wait**를 기본으로 제공합니다. 대부분의 액션은 요소가 준비될 때까지 자동으로 기다립니다.

```typescript
// 특정 URL로 이동할 때까지 대기
await page.waitForURL('**/dashboard');

// 특정 요소가 나타날 때까지 대기
await page.waitForSelector('.loading-spinner', { state: 'hidden' });

// 네트워크 요청이 완료될 때까지 대기
await page.waitForLoadState('networkidle');

// 명시적 타임아웃 (기본 30초)
await page.getByText('결과').waitFor({ timeout: 5000 });
```

### 검증 (Assertions)

```typescript
// 텍스트 포함 여부
await expect(page.getByRole('heading')).toContainText('환영합니다');

// 정확한 텍스트
await expect(page.getByRole('heading')).toHaveText('환영합니다, 홍길동');

// 요소 존재 여부
await expect(page.getByText('성공')).toBeVisible();
await expect(page.getByText('오류')).toBeHidden();

// URL 확인
await expect(page).toHaveURL('https://example.com/dashboard');
await expect(page).toHaveURL(/dashboard/);

// 타이틀 확인
await expect(page).toHaveTitle('대시보드 - My App');

// 입력값 확인
await expect(page.getByLabel('이메일')).toHaveValue('user@example.com');

// 체크박스 상태
await expect(page.getByRole('checkbox')).toBeChecked();

// 요소 개수
await expect(page.getByRole('listitem')).toHaveCount(5);
```

### 스크린샷과 동영상

```typescript
// 스크린샷
await page.screenshot({ path: 'screenshot.png' });

// 전체 페이지 스크린샷
await page.screenshot({ path: 'fullpage.png', fullPage: true });

// 특정 요소만
await page.locator('.hero-section').screenshot({ path: 'hero.png' });

// PDF 저장 (Chromium만)
await page.pdf({ path: 'page.pdf', format: 'A4' });
```

`playwright.config.ts`에서 실패 시 자동 스크린샷 설정:

```typescript
// playwright.config.ts
export default {
  use: {
    screenshot: 'only-on-failure',  // 실패 시에만
    video: 'retain-on-failure',     // 실패 시 동영상 보관
    trace: 'on-first-retry',        // 첫 재시도에서 트레이스
  },
};
```

---

## playwright.config.ts 설정

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // 테스트 파일 위치
  testDir: './tests',

  // 병렬 실행
  fullyParallel: true,

  // CI 환경에서 재시도
  retries: process.env.CI ? 2 : 0,

  // 병렬 워커 수 (CPU 코어 기반 자동 설정)
  workers: process.env.CI ? 1 : undefined,

  // 리포터 설정
  reporter: [
    ['html'],           // HTML 리포트 생성
    ['list'],           // 터미널 출력
  ],

  // 전역 설정
  use: {
    // 기본 URL (page.goto('/login')처럼 상대경로 사용 가능)
    baseURL: 'http://localhost:3000',

    // 트레이스: 실패 재시도 시 수집
    trace: 'on-first-retry',

    // 모든 테스트에서 스크린샷 크기
    viewport: { width: 1280, height: 720 },

    // 헤드리스 모드 (기본 true)
    headless: true,

    // 액션 지연 (디버깅 시 슬로우 모션)
    // slowMo: 1000,
  },

  // 브라우저별 프로젝트 설정
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // 모바일 에뮬레이션
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 14'] },
    },
  ],

  // 테스트 전 로컬 서버 실행 (선택)
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
```

---

## GitHub Actions CI/CD 연동

### 기본 워크플로우

```yaml
# .github/workflows/playwright.yml
name: Playwright Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: 의존성 설치
        run: npm ci

      - name: Playwright 브라우저 설치
        run: npx playwright install --with-deps

      - name: 테스트 실행
        run: npx playwright test

      - name: 테스트 리포트 업로드 (실패 시)
        uses: actions/upload-artifact@v4
        if: ${{ !cancelled() }}
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

### 브라우저 캐시로 빌드 속도 개선

매번 브라우저를 새로 다운로드하면 2~3분이 걸립니다. 캐시를 적용하면 30초 이내로 줄일 수 있습니다:

```yaml
- name: Playwright 버전 캐시 키 생성
  id: playwright-version
  run: echo "version=$(npx playwright --version)" >> $GITHUB_OUTPUT

- name: 브라우저 캐시 복원
  uses: actions/cache@v4
  id: playwright-cache
  with:
    path: ~/.cache/ms-playwright
    key: playwright-${{ steps.playwright-version.outputs.version }}-${{ runner.os }}

- name: Playwright 브라우저 설치 (캐시 미스 시만)
  if: steps.playwright-cache.outputs.cache-hit != 'true'
  run: npx playwright install --with-deps

- name: 시스템 의존성만 설치 (캐시 히트 시)
  if: steps.playwright-cache.outputs.cache-hit == 'true'
  run: npx playwright install-deps
```

> CI/CD 환경에서 브라우저 경로나 `$HOME` 환경 변수 문제가 발생하면 아래 글을 참고하세요:
> → [Playwright 설치 오류 완전 해결: $HOME 환경 변수, browser context, gstack setup failed](/playwright-cicd-troubleshooting/)

---

## 실전 패턴 모음

### 로그인이 필요한 테스트 — 인증 상태 재사용

```typescript
// tests/auth.setup.ts — 한 번만 로그인하고 상태 저장
import { test as setup } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../.auth/user.json');

setup('로그인 상태 저장', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('이메일').fill('user@example.com');
  await page.getByLabel('비밀번호').fill('password');
  await page.getByRole('button', { name: '로그인' }).click();
  await page.waitForURL('/dashboard');

  // 로그인 상태(쿠키, 로컬스토리지) 저장
  await page.context().storageState({ path: authFile });
});
```

```typescript
// playwright.config.ts에 setup 프로젝트 추가
projects: [
  { name: 'setup', testMatch: /.*\.setup\.ts/ },
  {
    name: 'chromium',
    use: {
      ...devices['Desktop Chrome'],
      storageState: '.auth/user.json',  // 저장된 상태 사용
    },
    dependencies: ['setup'],  // setup 먼저 실행
  },
],
```

### API 응답 가로채기 (Mock)

```typescript
test('API 오류 상황 테스트', async ({ page }) => {
  // 특정 API를 실패로 응답하도록 설정
  await page.route('**/api/users', route => {
    route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Internal Server Error' }),
    });
  });

  await page.goto('/users');

  // 오류 메시지 표시 여부 확인
  await expect(page.getByText('오류가 발생했습니다')).toBeVisible();
});
```

### 네트워크 요청 대기

```typescript
test('데이터 로드 후 확인', async ({ page }) => {
  // 특정 API 요청이 완료될 때까지 대기
  const responsePromise = page.waitForResponse('**/api/products');
  await page.goto('/products');
  const response = await responsePromise;

  // 응답 데이터 검증
  const data = await response.json();
  expect(data.items.length).toBeGreaterThan(0);
});
```

### 여러 탭 처리

```typescript
test('새 탭에서 열기', async ({ page, context }) => {
  // 새 탭이 열리는 것을 감지
  const pagePromise = context.waitForEvent('page');
  await page.getByRole('link', { name: '새 창에서 열기' }).click();
  const newPage = await pagePromise;

  // 새 탭에서 작업
  await newPage.waitForLoadState();
  await expect(newPage).toHaveTitle(/새 페이지/);
});
```

---

## 디버깅 도구

### Playwright Inspector

```bash
# 인스펙터 실행 — 단계별 실행 가능
PWDEBUG=1 npx playwright test

# 또는
npx playwright test --debug
```

### Codegen — 자동 코드 생성

브라우저를 직접 조작하면서 코드를 자동으로 생성해주는 도구입니다:

```bash
# 새 브라우저 열고 조작하면 코드 자동 생성
npx playwright codegen https://example.com

# 특정 브라우저로
npx playwright codegen --browser firefox https://example.com

# 모바일 에뮬레이션
npx playwright codegen --device "iPhone 14" https://example.com
```

### 트레이스 뷰어

실패한 테스트의 트레이스 파일을 시각적으로 분석합니다:

```bash
# 트레이스 파일 열기
npx playwright show-trace trace.zip

# 마지막 실패 테스트 트레이스 확인
npx playwright show-report
```

---

## 자주 발생하는 오류

| 오류 | 원인 | 해결 |
|------|------|------|
| `browserType.launch: executable doesn't exist` | 브라우저 미설치 또는 경로 오류 | [상세 해결 가이드 →](/playwright-browsertype-launch-error/) |
| `failed to install playwright: $HOME not set` | CI 환경 변수 누락 | [상세 해결 가이드 →](/playwright-cicd-troubleshooting/) |
| `gstack setup failed: chromium could not be launched` | 시스템 의존성 누락 | [상세 해결 가이드 →](/playwright-cicd-troubleshooting/) |
| `Timeout 30000ms exceeded` | 요소 대기 초과 | `waitFor` 옵션 또는 타임아웃 조정 |
| `Target page, context or browser has been closed` | 비동기 처리 오류 | `await` 누락 확인 |
| `strict mode violation` | 동일 locator에 여러 요소 매칭 | locator를 더 구체적으로 작성 |

---

## 정리

Playwright는 배우기 쉽고 강력한 브라우저 자동화 도구입니다. 핵심만 요약하면:

1. **설치**: `npm init playwright@latest` → `npx playwright install`
2. **요소 찾기**: `getByRole`, `getByText`, `getByLabel` 우선 사용
3. **검증**: `expect(...).toBeVisible()`, `toHaveText()`, `toHaveURL()`
4. **CI/CD**: GitHub Actions + 캐시 전략으로 속도 최적화
5. **디버깅**: `--debug` 플래그, Codegen, 트레이스 뷰어 활용

설치나 CI/CD 환경에서 오류가 생긴다면 아래 글에서 구체적인 해결 방법을 확인하세요:

- [browserType.launch: executable doesn't exist 오류 해결](/playwright-browsertype-launch-error/)
- [Playwright CI/CD 설치 오류 완전 해결 ($HOME, gstack, browser context)](/playwright-cicd-troubleshooting/)
