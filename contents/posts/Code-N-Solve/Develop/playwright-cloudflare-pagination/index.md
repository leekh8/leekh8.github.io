---
title: "Playwright로 Cloudflare 보호 사이트 스크래핑할 때 페이지네이션이 안 되는 이유"
description: "Playwright로 1페이지는 수집되는데 2페이지부터 JSON 대신 빈 HTML이 반환되는 문제를 겪었습니다. Cloudflare가 AJAX 요청을 막는 원리와 새 컨텍스트 + init_script 오버라이드로 해결한 과정을 정리합니다."
date: 2026-05-12
update: 2026-05-12
tags:
  - Playwright
  - 브라우저 자동화
  - Cloudflare
  - 웹 스크래핑
  - E2E 테스트
  - Python
category: "Code N Solve"
series: "Playwright 실전 가이드"
---

> **Playwright 실전 가이드 시리즈**
> - [입문] [Playwright 완전 가이드: 설치부터 CI/CD까지](/playwright-complete-guide/)
> - [오류 해결] [browserType.launch: executable doesn't exist 해결](/playwright-browsertype-launch-error/)
> - [오류 해결] [failed to create browser context, $HOME 환경 변수, gstack setup failed 해결](/playwright-cicd-troubleshooting/)
> - [실전] **Cloudflare 보호 사이트 페이지네이션이 안 되는 문제** ← 현재 글

---

Cloudflare로 보호된 특정 사이트에서 데이터를 자동으로 수집해야 하는 일이 생겼다. 여러 페이지에 걸쳐 데이터가 쪼개져 있었고, 수동으로 복사하기엔 양이 너무 많았다. 당연히 Playwright로 자동화를 시도했다.

1페이지 수집은 완벽하게 됐다. 55건이 깔끔하게 추출됐다. 그런데 2페이지부터 뭔가 이상했다.

---

## 증상: 1페이지는 되는데, 2페이지부터 빈 데이터

```python
# 이렇게 하면 1페이지는 잘 됨
page.goto(url)
page.wait_for_timeout(3000)
# API 응답 캡처: {"result": {"html": "...1페이지 데이터..."}}

# 근데 2페이지를 요청하면?
page.click(".pagination-next")  # 또는 JS로 페이지네이션 함수 직접 호출
page.wait_for_timeout(3000)
# API 응답: {"result": {"html": ""}}  ← 빈 HTML
```

분명히 사이트에서 수동으로 클릭하면 2페이지 데이터가 나온다. 근데 Playwright에서 클릭하거나 JS로 직접 함수를 호출하면 빈 결과만 반환된다.

처음엔 타이밍 문제인 줄 알았다. `wait_for_timeout`을 늘려봤다. 안 됐다. 네트워크 인터셉터로 실제 API 요청을 들여다봤다.

---

## 원인 분석: Cloudflare가 AJAX만 선별 차단한다

API 응답을 보니 JSON이 아니라 HTML이 왔다. Cloudflare의 challenge 페이지였다.

여기서 이해해야 할 게 있다.

**Cloudflare가 첫 페이지 로드를 허용하는 이유:**
- 브라우저가 처음 사이트에 접속하면 Cloudflare가 JS 챌린지를 실행한다
- Playwright는 실제 Chromium을 구동하므로 이 챌린지를 통과한다
- 통과하면 Cloudflare 쿠키(`cf_clearance`)가 발급된다
- 이후 요청에 이 쿠키가 붙으면 정상 응답을 받는다

**그런데 2페이지 AJAX 요청이 막히는 이유:**
- 페이지네이션 클릭 시 JS가 `XMLHttpRequest` 또는 `fetch`로 API를 직접 호출한다
- 이 AJAX 요청의 헤더 구조가 초기 페이지 로드 때와 다르다
- Cloudflare는 요청 패턴, `Referer`, `Origin`, `sec-fetch-*` 헤더 등을 종합적으로 분석한다
- AJAX 요청이 "자동화 툴이 만든 요청"처럼 보이면 challenge를 내린다
- 결과: JSON 대신 Cloudflare challenge HTML 반환 → `{"result": {"html": ""}}` 처럼 빈 데이터

요약하면: **초기 페이지 로드는 실제 브라우저와 구분이 어렵지만, AJAX 요청은 패턴이 달라서 더 쉽게 탐지된다.**

---

## 시도해봤지만 안 된 것들

### 시도 1: 클릭 대신 JS 직접 호출

```python
page.evaluate("loadData(resource_id, 2, params)")
```

안 됨. 같은 컨텍스트에서 나온 AJAX 요청이라 동일하게 차단된다.

### 시도 2: `requests` 라이브러리로 쿠키 추출 후 직접 호출

```python
cookies = {c["name"]: c["value"] for c in page.context.cookies()}
response = requests.get(api_url, cookies=cookies, headers={...})
```

안 됨. `cf_clearance` 쿠키는 특정 TLS 핑거프린트와 묶여 있다. 다른 HTTP 클라이언트에서 쓰면 Cloudflare가 무효 처리한다.

### 시도 3: `page.wait_for_response()`로 응답 대기 시간 늘리기

```python
with page.expect_response("**/api/data/list**") as resp_info:
    page.click(".next-page")
response = resp_info.value
```

응답 자체는 받는다. 근데 내용이 빈 HTML이라 의미 없다.

---

## 해결: 페이지마다 새 컨텍스트 + init_script로 함수 오버라이드

핵심 아이디어는 이것이다:

> **"초기 페이지 로드 때만 API가 정상 동작한다면, 페이지마다 새로 로드하되 원하는 페이지 번호를 주입하면 된다."**

### 먼저: 페이지네이션 함수 이름 찾기

해결에 앞서 사이트가 어떤 함수로 데이터를 불러오는지 파악해야 한다. DevTools에서 찾을 수 있다.

1. Chrome DevTools → Network 탭 열기
2. 페이지네이션 버튼 클릭
3. XHR/Fetch 요청 중 데이터가 담긴 응답 선택
4. Initiator 컬럼 클릭 → 호출 스택 확인 → 함수 이름 확인

또는 Sources 탭 → `{  }` (pretty print) → 페이지네이션 관련 키워드(`page`, `list`, `load`) 검색으로도 찾을 수 있다.

이 글의 경우 페이지 로드 완료 시 자동으로 `loadData(resource_id, 1, params)` 같은 함수가 호출됐다. 1페이지를 자동으로 불러오는 함수다.

이 함수가 호출되는 시점을 가로채서 `1` 대신 원하는 페이지 번호를 넣으면 된다. `page.add_init_script()`가 이 역할을 한다. 이 API는 페이지의 모든 JS보다 먼저 실행되므로, 사이트 JS가 함수를 정의하기 전에 감시자를 심어둘 수 있다.

```python
def _make_init_script(target_page: int) -> str:
    """페이지 로드 시 자동 호출되는 페이지네이션 함수를 가로채서 원하는 페이지 번호로 바꾸는 스크립트."""
    return f"""
        window.__target_page = {target_page};
        Object.defineProperty(window, 'loadData', {{
            configurable: true,
            set: function(originalFn) {{
                const targetPage = window.__target_page;
                const wrapped = function(resourceId, requestedPage, params) {{
                    // 사이트가 1페이지 요청하는 걸 가로채서 우리가 원하는 페이지로 바꾼다
                    return originalFn.call(this, resourceId, targetPage, params);
                }};
                Object.defineProperty(window, 'loadData', {{
                    value: wrapped, writable: true, configurable: true
                }});
            }}
        }});
    """
```

그리고 페이지마다 새 browser context를 만든다. 새 컨텍스트는 새 브라우저 세션과 같다. Cloudflare 챌린지를 처음부터 통과한다.

```python
def fetch_page_data(browser, url: str, target_page: int) -> dict | None:
    # 매번 새 context: Cloudflare 쿠키를 새로 받는다
    ctx = browser.new_context(
        viewport={"width": 1280, "height": 900},
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) ...",
    )
    page = ctx.new_page()

    # 페이지 로드 전에 JS 오버라이드 주입
    page.add_init_script(_make_init_script(target_page))

    # API 응답 인터셉트 (실제 API 경로로 변경)
    captured = {}
    def on_response(resp):
        if "/api/data/list" in resp.url:
            try:
                captured["data"] = resp.json()
            except Exception:
                pass
    page.on("response", on_response)

    page.goto(url, wait_until="domcontentloaded", timeout=60000)
    page.wait_for_timeout(10000)  # API 호출 대기
    ctx.close()

    return captured if "data" in captured else None
```

전체 페이지 순회는 이렇게:

```python
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)

    for pg in range(1, max_pages + 1):
        result = fetch_page_data(browser, url, pg)

        if result is None:
            break

        html = result["data"].get("result", {}).get("html", "")
        if not html:
            print(f"페이지 {pg}: 빈 페이지, 종료")
            break

        # 파싱 및 저장...

    browser.close()
```

---

## 결과

| | 이전 | 이후 |
|---|---|---|
| 수집 가능 페이지 | 1페이지만 | 전체 페이지 |
| 방식 | 단일 컨텍스트 + 클릭 | 페이지마다 새 컨텍스트 + init_script |
| Cloudflare 차단 | 2페이지부터 빈 응답 | 통과 |

단점도 있다. 페이지마다 새 컨텍스트를 만드니까 페이지 수만큼 브라우저 세션이 열린다. 10페이지면 10번 Cloudflare 챌린지를 통과해야 한다. 각 페이지당 10초씩 기다리니 전체 수집에 1~2분 걸린다. 초당 수백 페이지를 긁는 고속 스크래퍼에는 맞지 않는다. 하지만 수십 페이지 수준이라면 충분히 실용적이다.

---

## 정리

Playwright가 Cloudflare를 통과하지 못하는 게 아니다. **초기 페이지 로드는 통과한다. AJAX 요청이 막히는 것이다.**

핵심 해결 전략 두 가지:
1. **새 context**: AJAX 대신 매번 full page load. Cloudflare를 계속 정상 통과.
2. **init_script 오버라이드**: 사이트의 자동 호출 함수를 가로채서 원하는 인자를 주입.

이 방법이 맞지 않는 경우도 있다. 사이트 구조가 다르거나, 페이지마다 다른 토큰을 요구하거나, Cloudflare Turnstile처럼 더 강한 챌린지가 붙은 경우다. 그럴 때는 별도로 다루겠다.
