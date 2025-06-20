---
title: "📚 알라딘 자동 로그인과 주문 도서 수집 자동화: 실패 사례와 해결 방안"
description: "Playwright와 GitHub Actions로 알라딘 주문 내역을 자동 수집하는 과정에서의 로그인 실패, 세션 저장 문제, 브라우저 자동화 대응 방안까지의 해결 여정"
date: 2025-06-20
update: 2025-06-20
tags:
  - GitHub Actions
  - Playwright
  - Web Scraping
  - 자동화
  - Code N Solve
  - Aladin
series: "Code N Solve"
---

## Code N Solve

## 📘: 알라딘 자동 로그인과 도서 수집 자동화 실패 사례 정리

최근에 과거 구매한 도서 내역을 체계적으로 관리하고 싶어서, 알라딘에서 주문 내역을 자동으로 수집하는 시스템을 구축해보았다.

Playwright[^1]를 사용한 브라우저 자동화와 GitHub Actions[^2]를 통한 주기적 실행으로 완전 자동화를 목표로 했지만, 예상보다 훨씬 많은 문제에 직면했다.

특히 headless Chrome 환경에서의 로그인 차단, 세션 관리 복잡성, Git 자동 커밋 오류 등 다양한 실패 사례와 해결 과정을 정리해보았다.

## 🚨 1. Playwright 자동 로그인 실패 - 봇 탐지 차단

### 🚨 문제 상황

```bash
❌ 로그인 실패: waiting for navigation to "**/account/wmaininfo.aspx*" until 'load'
navigated to "https://www.aladin.co.kr/login/wlogin_popup_result.aspx?SecureOpener=1"
```

### 🧐 원인 분석

- 알라딘의 로그인 페이지(`wlogin_popup.aspx?SecureOpener=1`)는 팝업 전용 페이지로 설계되어 있으며, 자동화 브라우저 탐지가 매우 강력하게 적용됨.
- GitHub Actions의 headless Chromium 환경에서는 다음과 같은 특징들이 자동화 도구로 인식됨:

  - `navigator.webdriver` 속성이 `true`로 설정
  - 일반 사용자와 다른 `User-Agent` 헤더
  - JavaScript 실행 패턴의 차이
  - 마우스/키보드 이벤트 타이밍의 부자연스러움

- 특히 `SecureOpener=1` 파라미터가 포함된 팝업 페이지는 `window.opener` 객체를 요구하거나 특정 JavaScript 컨텍스트에서만 정상 작동하도록 제한되어 있음.

### ✅ 해결 방법

#### 1. 브라우저 탐지 우회 설정

```python
# Playwright 브라우저 설정
browser = await playwright.chromium.launch(
    headless=True,
    args=[
        "--disable-blink-features=AutomationControlled",
        "--disable-web-security",
        "--disable-features=VizDisplayCompositor"
    ]
)

# JavaScript 속성 조작으로 탐지 우회
context.add_init_script("""
    Object.defineProperty(navigator, 'webdriver', {get: () => undefined});
    Object.defineProperty(navigator, 'plugins', {get: () => [1, 2, 3]});
    Object.defineProperty(navigator, 'languages', {get: () => ['ko-KR', 'ko']});
    window.chrome = { runtime: {} };
""")
```

#### 2. 자연스러운 입력 시뮬레이션

```python
# 일반 사용자와 유사한 입력 패턴 적용
await page.type("#Email", ALADIN_ID, delay=100)  # 100ms 간격으로 타이핑
await page.type("#Password", ALADIN_PW, delay=150)
await page.wait_for_timeout(1000)  # 입력 후 1초 대기

# 다양한 로그인 버튼 클릭 방식 시도
try:
    await page.click("input[type='submit'][value='로그인']")
except:
    await page.eval_on_selector("#LoginForm", "form => form.submit()")
```

#### 3. 로그인 성공 판단 로직 개선

```python
# URL 변화 대신 DOM 요소로 성공 여부 판단
await page.wait_for_timeout(3000)
if page.query_selector("#Email") and await page.is_visible("#Email"):
    print("❌ 로그인 실패: 로그인 폼이 여전히 표시됨")
    return False
else:
    print("✅ 로그인 성공으로 추정됨")
    return True
```

## 🚨 2. 세션 파일 없음 - GitHub Actions 환경 문제

### ❌ 문제 상황

```bash
FileNotFoundError: [Errno 2] No such file or directory: 'storage/aladin_storage.json'
```

### 🧐 원인 분석

- GitHub Actions에서 `save_aladin_session.py`가 로그인 실패로 인해 세션 파일(`aladin_storage.json`) 생성에 실패.
- 이후 `fetch_aladin.py` 실행 시 존재하지 않는 세션 파일을 참조하려고 해서 `FileNotFoundError` 발생.
- Playwright의 `storage_state` 옵션은 반드시 유효한 파일 경로를 요구하므로, 파일이 존재하지 않으면 브라우저 컨텍스트 생성 자체가 실패함.

### ✅ 해결 방법

#### 1. 세션 유효성 검사 함수 구현

```python
def verify_session():
    """저장된 세션이 유효한지 확인"""
    if not os.path.exists("storage/aladin_storage.json"):
        print("❌ 세션 파일이 존재하지 않습니다")
        return False

    try:
        with open("storage/aladin_storage.json", "r") as f:
            session_data = json.load(f)

        # 세션 데이터 구조 확인
        if not session_data.get("cookies") or not session_data.get("origins"):
            print("❌ 세션 데이터가 유효하지 않습니다")
            return False

        print("✅ 기존 세션이 유효합니다")
        return True
    except Exception as e:
        print(f"❌ 세션 확인 중 오류: {e}")
        return False
```

#### 2. GitHub Actions 캐시 전략

```yaml
- name: Restore Aladin session from cache
  id: restore-session
  uses: actions/cache@v4
  with:
    path: storage/aladin_storage.json
    key: aladin-session-v2-${{ secrets.ALADIN_ID }}-${{ github.run_number }}
    restore-keys: |
      aladin-session-v2-${{ secrets.ALADIN_ID }}-

- name: Generate or verify Aladin session
  env:
    ALADIN_ID: ${{ secrets.ALADIN_ID }}
    ALADIN_PW: ${{ secrets.ALADIN_PW }}
  run: |
    echo "🔍 세션 상태 확인 및 로그인 처리..."
    python scripts/save_aladin_session.py

- name: Save session to cache
  if: success()
  uses: actions/cache/save@v4
  with:
    path: storage/aladin_storage.json
    key: aladin-session-v2-${{ secrets.ALADIN_ID }}-${{ github.run_number }}
```

#### 3. 조건부 세션 처리 로직

```python
# save_aladin_session.py
if verify_session():
    print("✅ 기존 세션이 유효합니다")
    sys.exit(0)
else:
    print("🔄 새 세션을 생성합니다")
    if save_aladin_session():
        print("✅ 세션 저장 완료")
    else:
        print("❌ 세션 생성 실패")
        sys.exit(1)
```

## 🚨 3. Git 브랜치 충돌 - origin/main vs origin/master

### ❌ 문제 상황

```bash
fatal: invalid upstream 'origin/main'
error: cannot rebase: You have unstaged changes.
error: Please commit or stash them.
Error: Process completed with exit code 1.
```

### 🧐 원인 분석

- 저장소의 기본 브랜치가 `master`인데도 워크플로우에서 `origin/main`으로 리베이스를 시도함.
- `git rebase` 실행 전에 변경사항이 제대로 스테이징되지 않아 "unstaged changes" 오류 발생.
- Git 명령어 실행 순서와 브랜치 감지 로직에 문제가 있었음.

### ✅ 해결 방법

#### 1. 브랜치 자동 감지 로직

```yaml
- name: Detect default branch
  id: branch
  run: |
    if git ls-remote --heads origin main | grep -q main; then
      echo "default_branch=main" >> $GITHUB_OUTPUT
    else
      echo "default_branch=master" >> $GITHUB_OUTPUT
    fi
    echo "현재 브랜치: $(git branch --show-current)"
    echo "기본 브랜치: $(cat $GITHUB_OUTPUT | grep default_branch)"
```

#### 2. 안전한 커밋 및 푸시 로직

```yaml
- name: Commit and push changes
  if: steps.changes.outputs.changed == 'true'
  run: |
    git config --global user.name 'github-actions[bot]'
    git config --global user.email 'github-actions[bot]@users.noreply.github.com'

    # 변경사항 확인 및 스테이징
    if ! git diff --quiet data/; then
      echo "📝 변경사항이 확인됨, 커밋 진행..."

      git status
      git add data/*.json

      # 스테이징된 변경사항이 있을 때만 커밋
      if ! git diff --cached --quiet; then
        git commit -m "chore: update aladin book list $(date '+%Y-%m-%d %H:%M')"

        # 안전한 푸시 재시도 로직
        for i in {1..5}; do
          echo "🚀 푸시 시도 ${i}/5..."

          git fetch origin ${{ steps.branch.outputs.default_branch }}

          if git rebase origin/${{ steps.branch.outputs.default_branch }}; then
            if git push origin HEAD:${{ steps.branch.outputs.default_branch }}; then
              echo "✅ 푸시 성공!"
              break
            fi
          fi

          if [ $i -lt 5 ]; then
            echo "⏳ 10초 대기 후 재시도..."
            sleep 10
          fi
        done
      fi
    fi
```

## 🚨 4. 도서 수집 스크립트 실패 - DOM 구조 변화 대응

### ❌ 문제 상황

```bash
❌ 주문 내역을 찾을 수 없습니다
❌ 도서 정보 추출 실패
```

### 🧐 원인 분석

- 알라딘 웹사이트의 DOM 구조가 수시로 변경되어 고정된 CSS 셀렉터로는 요소를 찾을 수 없음.
- 페이지 로딩 타이밍에 따라 JavaScript로 동적 생성되는 요소들이 늦게 로드됨.
- 로그인 상태가 유지되지 않아 주문 내역 페이지에 접근할 수 없는 경우 발생.

### ✅ 해결 방법

#### 1. 다중 셀렉터 및 Fallback 전략

```python
def extract_books_from_page(page):
    """여러 셀렉터를 시도하여 주문 내역 추출"""
    selectors = [
        "tbody#tblOrdersItem > tr",  # 기본 셀렉터
        ".order-info tr",            # 대체 셀렉터 1
        "table tr",                  # 대체 셀렉터 2
        ".order-list-item"           # 대체 셀렉터 3
    ]

    for selector in selectors:
        elements = page.query_selector_all(selector)
        if elements:
            print(f"✅ 요소 발견: {selector} ({len(elements)}개)")
            return elements

    print("❌ 모든 셀렉터로 요소를 찾을 수 없습니다")
    return []
```

#### 2. 로그인 상태 확인 함수

```python
def check_login_status(page):
    """현재 페이지에서 로그인 상태 확인"""
    # 로그인이 필요한 페이지의 특징적 요소 확인
    login_indicators = [
        "#Email",           # 로그인 폼
        ".login-form",      # 로그인 클래스
        "input[name='Email']"  # 이메일 입력
    ]

    for indicator in login_indicators:
        if page.query_selector(indicator):
            return False  # 로그인 폼이 보이면 미로그인 상태

    return True  # 로그인 폼이 없으면 로그인 상태로 추정
```

#### 3. 디버그 정보 수집

```python
def safe_goto(page, url, timeout=30000):
    """안전한 페이지 이동 및 디버그 정보 수집"""
    try:
        page.goto(url, wait_until="networkidle", timeout=timeout)
        print(f"✅ 페이지 로드 성공: {url}")
        return True
    except Exception as e:
        print(f"❌ 페이지 로드 실패: {url}")
        print(f"오류: {e}")

        # 디버그용 스크린샷 저장
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        screenshot_path = f"debug_error_{timestamp}.png"
        page.screenshot(path=screenshot_path)
        print(f"📸 스크린샷 저장: {screenshot_path}")

        return False
```

## 🚨 5. GitHub Actions 실행 시간 초과

### ❌ 문제 상황

```bash
Error: The operation was canceled.
```

### 🧐 원인 분석

- Playwright의 브라우저 실행과 페이지 로딩이 예상보다 오래 걸림.
- 특히 headless 환경에서 JavaScript 실행이 느려지는 경우가 있음.
- 네트워크 지연이나 알라딘 서버 응답 지연 시 timeout 발생.

### ✅ 해결 방법

#### 1. 적절한 timeout 설정 및 재시도 로직

```yaml
jobs:
  fetch-books:
    runs-on: ubuntu-latest
    timeout-minutes: 30 # 충분한 실행 시간 확보

    steps:
      - name: Run fetch script with retry
        run: |
          echo "📚 책 정보 수집 시작..."
          python scripts/fetch_aladin.py || {
            echo "첫 번째 시도 실패, 30초 후 재시도..."
            sleep 30
            python scripts/fetch_aladin.py
          }
```

#### 2. Playwright timeout 최적화

```python
# 브라우저 및 페이지 timeout 설정
browser = await playwright.chromium.launch(headless=True)
context = await browser.new_context(
    storage_state="storage/aladin_storage.json" if os.path.exists("storage/aladin_storage.json") else None
)

# 페이지별 timeout 설정
page = await context.new_page()
page.set_default_timeout(60000)  # 60초
page.set_default_navigation_timeout(60000)  # 60초
```

## 결론

1. 브라우저 자동화 탐지 우회: `navigator.webdriver` 제거, 자연스러운 입력 패턴, User-Agent 조작으로 봇 탐지 회피
2. 세션 관리 체계화: GitHub Actions 캐시를 활용한 세션 저장/복원 및 유효성 검사 로직 구현
3. Git 자동화 안정화: 브랜치 자동 감지, 변경사항 확인 후 커밋, 푸시 재시도 로직으로 안정성 확보
4. DOM 변화 대응: 다중 셀렉터, Fallback 전략, 로그인 상태 확인으로 웹사이트 변화에 대응
5. 디버그 정보 수집: 실패 시 스크린샷 저장, 상세 로그 출력으로 문제 진단 용이성 확보
6. 적절한 timeout 설정: GitHub Actions와 Playwright 모두에서 충분한 실행 시간 확보

알라딘과 같은 대형 쇼핑몰 사이트의 자동화는 예상보다 까다로웠지만, 체계적인 접근과 충분한 예외 처리를 통해 안정적인 자동화 시스템을 구축할 수 있었다.
특히 실패에 대한 다양한 Fallback 전략과 디버그 정보 수집이 핵심이었으며, 이는 다른 웹사이트 자동화 프로젝트에도 적용할 수 있는 중요한 교훈이다!

---

[^1]: https://playwright.dev/
[^2]: https://github.com/features/actions
