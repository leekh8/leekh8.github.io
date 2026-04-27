---
date: "2026-04-27"
title: "🔌 OWASP API Security Top 10:2023 완전 가이드: REST API 보안 취약점과 방어 전략"
category: "Security"
series: "웹 보안 기초"
tags:
  - OWASP
  - API보안
  - 웹보안
  - REST
  - 인증보안
  - 취약점
thumbnail: ""
description: "OWASP API Security Top 10:2023 기준으로 REST API의 10대 보안 취약점을 코드 예시와 실전 방어 전략으로 정리합니다. BOLA, 인증 실패, 리소스 소비 등 현대 API 환경의 핵심 위협을 다룹니다."
---

웹 애플리케이션의 핵심이 API로 이동하면서, 보안 위협도 함께 이동했다.

모바일 앱, SPA, 마이크로서비스 — 모두 API를 통해 통신한다.  
그런데 많은 개발팀이 **웹 보안은 신경 쓰면서 API 보안은 별도로 생각하지 않는다**.

OWASP는 이 문제를 인식하고 2019년 최초로, **2023년 갱신판으로** API Security Top 10을 발표했다.  
웹 애플리케이션 Top 10과는 별도의 목록이며, API 특유의 위협을 다룬다.

> **이전 글**: [🔐 OWASP Top 10:2025 완전 가이드](/owasp-top10-2025/) — 웹 애플리케이션 보안

---

## 왜 API 보안은 별도인가

웹 페이지와 API의 차이:

| 구분 | 웹 페이지 | API |
|------|---------|-----|
| 인터페이스 | HTML/CSS로 표시 제어 | 데이터만 반환 (JSON, XML) |
| 접근 방식 | 브라우저 UI | 직접 HTTP 요청 |
| 인증 | 세션/쿠키 중심 | 토큰 중심 (JWT, API Key) |
| 노출 수준 | 화면에 보이는 것만 | 응답 객체 전체 |
| 공격 표면 | 제한적 | 모든 엔드포인트 |

API는 UI가 없기 때문에 **브라우저가 제공하는 기본 보호막도 없다**.  
공격자는 Burp Suite나 curl 한 줄로 직접 API를 호출할 수 있다.

---

## 2019 → 2023, 무엇이 달라졌나

```mermaid
graph LR
    subgraph 2019
        O1["API1 Broken Object Level Auth"]
        O2["API2 Broken Auth"]
        O3["API3 Excessive Data Exposure"]
        O4["API4 Lack of Resources & Rate Limiting"]
        O5["API5 Broken Function Level Auth"]
        O6["API6 Mass Assignment"]
        O7["API7 Security Misconfiguration"]
        O8["API8 Injection"]
        O9["API9 Improper Assets Management"]
        O10["API10 Insufficient Logging"]
    end

    subgraph 2023
        N1["API1 BOLA"]
        N2["API2 Broken Auth"]
        N3["API3 Broken Object Property Level Auth 🆕"]
        N4["API4 Unrestricted Resource Consumption"]
        N5["API5 Broken Function Level Auth"]
        N6["API6 Unrestricted Access to Sensitive Flows 🆕"]
        N7["API7 Server Side Request Forgery 🆕"]
        N8["API8 Security Misconfiguration"]
        N9["API9 Improper Inventory Management"]
        N10["API10 Unsafe Consumption of APIs 🆕"]
    end

    O3 & O6 --> N3
    O4 --> N4
    O10 -.->|"제거"| N10
```

**핵심 변화:**
- "Excessive Data Exposure" + "Mass Assignment" → **BOPLA**(API3)로 통합
- SSRF(API7), 민감한 비즈니스 플로우(API6), 외부 API 신뢰 문제(API10) 신설
- Injection, Logging은 웹 Top 10으로 통합

---

## API1:2023 — Broken Object Level Authorization (BOLA)

### 개요

**객체 레벨 접근 제어 실패**. 2019에서도, 2023에서도 변함없이 1위다.  
흔히 **IDOR(Insecure Direct Object Reference)** 라고도 부른다.

API는 리소스에 직접 ID를 사용해 접근하는 경우가 많다.  
이때 **"이 사용자가 이 ID의 리소스에 접근할 권한이 있는가"** 를 검증하지 않으면 끝장이다.

### 취약한 패턴

```javascript
// 취약한 코드: 인증은 했지만 소유권 검증 없음
router.get('/api/orders/:orderId', authenticate, async (req, res) => {
  // orderId가 1, 2, 3, ... 순차적이면
  // 공격자는 orderId를 바꿔가며 다른 사람 주문 조회 가능
  const order = await Order.findById(req.params.orderId)
  return res.json(order)
})

// 공격자 요청:
// GET /api/orders/1001 → 내 주문
// GET /api/orders/1002 → 다른 사람 주문 (소유권 검증 없음)
// GET /api/orders/1003 → 또 다른 사람 주문...
```

```javascript
// 안전한 코드: 소유권 검증 포함
router.get('/api/orders/:orderId', authenticate, async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.orderId,
    userId: req.user.id  // 현재 인증된 사용자의 것인지 확인
  })

  if (!order) {
    return res.status(404).json({ error: 'Not found' })
    // 403이 아닌 404 반환: 리소스 존재 여부도 노출하지 않음
  }

  return res.json(order)
})
```

### 방어 전략

- 모든 데이터 접근 시 **소유권 검증** (userId, orgId, tenantId 등)
- 순차적 ID 대신 **UUID** 사용 (추측을 어렵게)
- 응답에서 **최소한의 데이터만** 반환
- 접근 시도 로깅 → 비정상 패턴 탐지

---

## API2:2023 — Broken Authentication

### 개요

인증 메커니즘의 결함. API에서는 특히 **토큰 관리** 문제가 크다.

### 취약한 패턴들

**① API Key 하드코딩**

```python
# 취약한 코드: API 키가 코드에 박혀있음
headers = {
    "Authorization": "Bearer sk-prod-abc123def456",  # 실제 프로덕션 키
    "Content-Type": "application/json"
}

# GitHub, GitLab에 이런 코드가 push되면 수초 내로 키가 탈취됨

# 안전한 코드
import os

headers = {
    "Authorization": f"Bearer {os.environ.get('API_SECRET_KEY')}",
    "Content-Type": "application/json"
}
```

**② JWT 검증 누락**

```javascript
// 취약한 코드: JWT 서명 검증 없이 디코딩만
const jwt = require('jsonwebtoken')

function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  // 서명 검증 없이 페이로드만 추출 (공격자가 위조 가능)
  const decoded = Buffer.from(token.split('.')[1], 'base64').toString()
  req.user = JSON.parse(decoded)
  next()
}

// 안전한 코드: 서명 검증 필수
function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'No token' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],  // 허용 알고리즘 명시
      issuer: 'my-api'        // issuer 검증
    })
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}
```

**③ 토큰 만료 미처리**

```javascript
// 취약한 코드: 만료된 토큰 허용
const decoded = jwt.verify(token, secret, {
  ignoreExpiration: true  // 절대 이렇게 하면 안 됨
})

// 안전한 코드: 적절한 만료 시간 설정
const accessToken = jwt.sign(
  { userId: user.id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '15m', issuer: 'my-api' }  // 15분 만료
)

const refreshToken = jwt.sign(
  { userId: user.id },
  process.env.JWT_REFRESH_SECRET,
  { expiresIn: '7d' }  // 리프레시는 7일
)
```

### 방어 전략

- API Key, 토큰은 절대 코드에 하드코딩 금지 (환경변수, Secrets Manager)
- JWT: 서명 검증 + 만료 검증 + 알고리즘 명시
- 민감 API에는 **MFA 추가 검증**
- 토큰 무효화 메커니즘 구현 (블랙리스트 또는 short-lived token)

---

## API3:2023 — Broken Object Property Level Authorization (BOPLA)

### 개요

2023 신설. 2019의 "Excessive Data Exposure"와 "Mass Assignment"를 통합한 개념이다.

**두 가지 문제를 합쳐서 다룬다:**
1. **과도한 데이터 노출**: API가 필요 이상으로 많은 필드를 반환
2. **대량 할당(Mass Assignment)**: 사용자가 수정하면 안 되는 필드까지 업데이트 허용

### 과도한 데이터 노출

```javascript
// 취약한 코드: DB 객체를 그대로 반환
router.get('/api/users/:id', async (req, res) => {
  const user = await User.findById(req.params.id)
  return res.json(user)
  // 반환됨: { _id, name, email, passwordHash, role, ssn, creditCard, ... }
  // 비밀번호 해시, 권한, 주민번호, 카드번호까지 다 나감
})

// 안전한 코드: 필요한 필드만 명시적 선택
router.get('/api/users/:id', async (req, res) => {
  const user = await User.findById(req.params.id)
    .select('name email createdAt')  // 필요한 필드만
  return res.json(user)
})
```

### Mass Assignment

```javascript
// 취약한 코드: 요청 바디를 그대로 DB에 저장
router.put('/api/users/:id', authenticate, async (req, res) => {
  // 공격자가 body에 { "role": "admin" } 을 추가하면?
  const user = await User.findByIdAndUpdate(req.params.id, req.body)
  return res.json(user)
})

// 안전한 코드: 허용 필드 명시적 추출
router.put('/api/users/:id', authenticate, async (req, res) => {
  const { name, email, bio } = req.body  // role, isAdmin 등은 제외

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { name, email, bio },  // 허용된 필드만
    { new: true, runValidators: true }
  )
  return res.json({ name: user.name, email: user.email })
})
```

### 방어 전략

- **응답 DTO(Data Transfer Object)** 패턴 사용: 반환 스키마 명시
- 입력 검증: allowlist 방식으로 허용 필드만 처리
- ORM의 `select()`, `omit()` 적극 활용
- API 명세(OpenAPI/Swagger)에 응답 스키마 정의

---

## API4:2023 — Unrestricted Resource Consumption

### 개요

리소스 소비 제한 없음. API에 Rate Limit이 없으면 공격자가 서버를 과부하시킬 수 있다.  
2019의 "Lack of Resources & Rate Limiting"에서 범위가 확장됐다.

### 취약한 시나리오

```mermaid
flowchart LR
    A["공격자"] -->|"초당 1000회 요청"| B["API 서버"]
    B -->|"모든 요청 처리"| C["DB 쿼리 × 1000"]
    C -->|"과부하"| D["서버 다운 / 비용 폭탄"]

    style A fill:#ff4444,color:#fff
    style D fill:#ff4444,color:#fff
```

**파일 업로드 공격:**

```bash
# 공격자가 대용량 파일을 지속적으로 업로드
while true; do
  curl -X POST https://api.example.com/upload \
    -F "file=@huge_file_10gb.bin"
done
# → 디스크 고갈, 처리 큐 마비
```

### 방어 코드

```javascript
const rateLimit = require('express-rate-limit')
const slowDown = require('express-slow-down')

// API 전체 Rate Limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15분
  max: 100,                   // 100회 제한
  standardHeaders: true,
  message: { error: 'Too many requests, please try again later.' }
})

// 특히 민감한 엔드포인트 (로그인, 회원가입)
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,  // 1시간
  max: 5,                     // 5회
  skipSuccessfulRequests: true
})

// Slow Down: 점점 응답을 느리게
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 50,            // 50회 이후
  delayMs: hits => hits * 100  // 점진적 지연
})

app.use('/api/', apiLimiter)
app.use('/api/auth/', authLimiter, speedLimiter)

// 파일 업로드 크기 제한
const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024,  // 5MB
    files: 1
  }
})
```

### 방어 전략

- **Rate Limiting**: 글로벌 + 엔드포인트별 + IP별
- **파일 크기 제한**: 업로드 용량, 파일 타입 검증
- **요청 타임아웃**: 너무 오래 걸리는 요청은 강제 종료
- **쿼리 복잡도 제한**: GraphQL의 경우 깊이/비용 제한

---

## API5:2023 — Broken Function Level Authorization

### 개요

기능(함수) 레벨 접근 제어 실패.  
API1이 "이 데이터에 접근할 수 있는가"였다면, API5는 **"이 기능을 실행할 수 있는가"** 의 문제다.

일반 사용자가 관리자 전용 기능을 호출할 수 있는 경우다.

### 취약한 패턴

```javascript
// 취약한 코드: HTTP 메서드로만 구분, 실제 권한 검증 없음
router.get('/api/users', authenticate, getAllUsers)    // 일반 사용자용
router.delete('/api/users/:id', authenticate, deleteUser)  // 관리자용인데 권한 확인 없음

// 공격자: DELETE /api/users/123  → 다른 사용자 계정 삭제 가능

// 안전한 코드
const requireAdmin = (req, res, next) => {
  if (!req.user.roles?.includes('ADMIN')) {
    return res.status(403).json({ error: 'Admin access required' })
  }
  next()
}

router.get('/api/users', authenticate, getAllUsers)
router.delete('/api/users/:id', authenticate, requireAdmin, deleteUser)
router.post('/api/admin/settings', authenticate, requireAdmin, updateSettings)
```

**숨겨진 관리자 엔드포인트:**

```bash
# 공격자가 추측하는 관리자 엔드포인트 패턴
GET /api/v1/admin/users
GET /api/internal/users
POST /api/users/promote
DELETE /api/admin/delete-all

# 모두 인증+인가 검증이 없으면 호출 가능
```

### 방어 전략

- **기본값은 거부**: 명시적으로 허용하지 않은 모든 기능은 차단
- 관리자 기능은 **별도 권한 미들웨어** 적용
- API 문서화 시 **인증 요구사항 명시**
- 정기적인 **API 엔드포인트 인벤토리** 관리

---

## API6:2023 — Unrestricted Access to Sensitive Business Flows

### 개요

2023 신설. 기술적 취약점이 아닌 **비즈니스 로직 악용**을 다룬다.

API 자체는 정상적으로 동작하지만, 자동화된 공격으로 비즈니스 프로세스를 악용하는 경우다.

### 실제 공격 시나리오

```mermaid
flowchart TD
    A["정상 사용자\n쿠폰 1개 사용"] -->|"1회"| B["쿠폰 API"]
    C["공격자 봇\n스크립트 자동화"] -->|"초당 100회"| B
    B --> D["할인 코드 생성"]
    D -->|"정상 사용자"| E["1개 할인 코드"]
    D -->|"공격자"| F["수천 개 할인 코드\n무한 혜택 탈취"]

    style C fill:#ff4444,color:#fff
    style F fill:#ff4444,color:#fff
```

**한정 수량 상품 선점:**

```javascript
// 취약한 코드: 봇이 초당 수백 번 요청해 한정 상품 독점
router.post('/api/checkout', authenticate, async (req, res) => {
  const { productId, quantity } = req.body

  const product = await Product.findById(productId)
  if (product.stock < quantity) {
    return res.status(400).json({ error: 'Out of stock' })
  }

  // 재고 확인 후 구매 처리
  // 봇이 수백 ms 간격으로 요청하면 동시에 여러 번 결제 가능
  await product.decrementStock(quantity)
  return res.json({ success: true })
})

// 안전한 코드: 분산 락(Distributed Lock) + Rate Limit + 봇 탐지
router.post('/api/checkout', authenticate, checkoutLimiter, async (req, res) => {
  const lockKey = `checkout:${req.user.id}:${req.body.productId}`

  const lock = await redisLock.acquire(lockKey, 5000)  // 5초 락
  if (!lock) {
    return res.status(429).json({ error: '이미 처리 중입니다.' })
  }

  try {
    // 원자적 재고 감소 (race condition 방지)
    const result = await Product.findOneAndUpdate(
      { _id: req.body.productId, stock: { $gte: req.body.quantity } },
      { $inc: { stock: -req.body.quantity } },
      { new: true }
    )
    if (!result) return res.status(400).json({ error: '재고 부족' })
    // ...결제 처리
  } finally {
    await lock.release()
  }
})
```

### 방어 전략

- **봇 탐지**: CAPTCHA, 행동 분석, User-Agent 검증
- **비즈니스 레벨 Rate Limit**: "사용자당 하루 3회" 같은 로직
- **CAPTCHA**: 민감한 비즈니스 플로우 진입점에 적용
- 이상 행동 패턴 **실시간 모니터링 및 알림**

---

## API7:2023 — Server Side Request Forgery (SSRF)

### 개요

2023 신설 (웹 Top 10:2021의 A10이었다가 API 전용으로 이동).  
서버가 외부 URL 요청을 처리할 때 공격자가 그 요청을 조작하는 공격이다.

API에서 URL을 받아 처리하는 기능 (웹훅, 썸네일 생성, URL 미리보기 등)이 특히 위험하다.

### 취약한 패턴

```python
import requests

# 취약한 코드: 사용자가 제공한 URL을 검증 없이 요청
@app.route('/api/fetch-preview', methods=['POST'])
def fetch_preview():
    url = request.json.get('url')
    response = requests.get(url)  # 공격자가 url 조작 가능
    return jsonify({'content': response.text[:1000]})

# 공격자 요청 예시:
# { "url": "http://169.254.169.254/latest/meta-data/" }
# → AWS EC2 메타데이터 탈취 (IAM 자격증명, 인스턴스 정보)

# { "url": "http://internal-service.local/admin" }
# → 내부 서비스 접근 (방화벽 우회)

# { "url": "file:///etc/passwd" }
# → 로컬 파일 읽기 (라이브러리에 따라)
```

```python
# 안전한 코드
import ipaddress
from urllib.parse import urlparse

ALLOWED_SCHEMES = {'http', 'https'}
BLOCKED_HOSTS = {
    '169.254.169.254',  # AWS 메타데이터
    '169.254.170.2',    # AWS ECS 메타데이터
    'metadata.google.internal',  # GCP 메타데이터
}

def is_safe_url(url):
    try:
        parsed = urlparse(url)

        # 스킴 검증
        if parsed.scheme not in ALLOWED_SCHEMES:
            return False

        # 차단된 호스트 검증
        if parsed.hostname in BLOCKED_HOSTS:
            return False

        # Private IP 차단 (내부망 접근 방지)
        try:
            ip = ipaddress.ip_address(parsed.hostname)
            if ip.is_private or ip.is_loopback or ip.is_link_local:
                return False
        except ValueError:
            pass  # 도메인명인 경우 통과

        return True
    except Exception:
        return False

@app.route('/api/fetch-preview', methods=['POST'])
def fetch_preview():
    url = request.json.get('url')
    if not is_safe_url(url):
        return jsonify({'error': '허용되지 않는 URL입니다.'}), 400

    response = requests.get(url, timeout=5, allow_redirects=False)
    return jsonify({'content': response.text[:1000]})
```

### 방어 전략

- **URL 허용 목록(allowlist)**: 신뢰할 수 있는 도메인만 허용
- Private IP, 루프백, 링크-로컬 주소 차단
- **리다이렉트 비허용**: `allow_redirects=False`
- 클라우드 환경: IMDSv2 강제 적용 (AWS EC2 메타데이터 보호)
- 아웃바운드 방화벽으로 서버의 외부 요청 범위 제한

---

## API8:2023 — Security Misconfiguration

### 개요

API 환경 설정 오류. 웹 Top 10:2025의 A02와 동일한 범주지만 API 특화 문제를 다룬다.

### API에서 자주 발생하는 설정 오류

**① CORS 과도한 허용**

```javascript
// 취약한 설정: 모든 Origin 허용
app.use(cors())
// 또는
app.use(cors({ origin: '*' }))

// 이렇게 하면 어떤 도메인에서든 API 호출 가능
// CSRF 공격에 노출될 수 있음

// 안전한 설정: 허용 도메인 명시
const allowedOrigins = [
  'https://myapp.com',
  'https://www.myapp.com',
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : null
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))
```

**② 디버그 모드 프로덕션 노출**

```python
# 취약한 설정
if __name__ == '__main__':
    app.run(debug=True)  # 프로덕션에서도 debug=True면 Werkzeug 디버거 노출

# 안전한 설정
import os

debug_mode = os.environ.get('FLASK_DEBUG', 'false').lower() == 'true'
app.run(debug=debug_mode)
```

**③ HTTP 보안 헤더 누락**

```javascript
// helmet.js로 간편하게 보안 헤더 적용
const helmet = require('helmet')

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}))

// 커스텀 헤더 추가
app.use((req, res, next) => {
  res.setHeader('X-API-Version', '1.0')
  res.removeHeader('X-Powered-By')  // 서버 기술 스택 숨기기
  next()
})
```

---

## API9:2023 — Improper Inventory Management

### 개요

API 인벤토리 관리 실패. "자신이 보유한 API를 파악하지 못하는" 문제다.

마이크로서비스, 레거시 시스템, 다양한 API 버전이 혼재하면 **어떤 API가 어디에 존재하는지조차 모르는** 상황이 온다.

### 흔한 시나리오

```mermaid
flowchart TD
    A["서비스 운영 중"] --> B["API v1 (보안 패치 완료)"]
    A --> C["API v2 (현재 사용 중)"]
    A --> D["API v1-beta (개발 중 잊혀짐)"]
    A --> E["API-internal (테스트용, 방치)"]

    F["공격자"] -->|"스캔"| D
    F -->|"스캔"| E

    D -->|"인증 없음"| G["취약점 악용"]
    E -->|"관리 미흡"| G

    style F fill:#ff4444,color:#fff
    style G fill:#ff4444,color:#fff
    style D fill:#ffaa00
    style E fill:#ffaa00
```

**실제 위험:**
- 구버전 API(`/api/v1/`)는 보안 패치가 안 된 채로 운영
- 내부 테스트 API가 프로덕션에 그대로 노출
- 서드파티 API 문서화 없이 운영 → 권한 범위 불명확

### 방어 전략

```yaml
# OpenAPI/Swagger 명세로 API 인벤토리 관리
openapi: "3.0.0"
info:
  title: "My API"
  version: "2.1.0"
  x-api-status: "production"  # 상태 명시
  x-deprecated-versions:
    - version: "1.0.0"
      sunset-date: "2025-12-31"

paths:
  /api/v2/users:
    get:
      summary: "사용자 목록 조회"
      security:
        - bearerAuth: []
      # ...

  /api/v1/users:
    get:
      deprecated: true  # 명시적 deprecated 표시
      description: "v2로 마이그레이션 필요. 2025-12-31 종료."
```

- **API Gateway** 도입: 모든 API 트래픽 중앙화
- **OpenAPI 명세** 기반 문서화 + 버전 관리
- 사용되지 않는 API **정기적 폐기** (Sunset Policy)
- 외부 노출 API 목록 주기적 감사

---

## API10:2023 — Unsafe Consumption of APIs

### 개요

2023 신설. "외부 API를 신뢰하는 것 자체가 위험"이라는 개념이다.

자신이 만든 API를 보호하는 것에만 집중하고, **자신이 호출하는 외부 API는 암묵적으로 신뢰**하는 경우가 많다.

### 취약한 패턴

```javascript
// 취약한 코드: 외부 API 응답을 그대로 신뢰
async function getUserLocation(ipAddress) {
  const response = await fetch(`https://third-party-geo.api/lookup/${ipAddress}`)
  const data = await response.json()

  // 외부 API가 악의적인 데이터를 반환하면?
  // data.city = "<script>alert('xss')</script>"
  return data  // 검증 없이 반환 → XSS, Injection 위험
}

// 외부 API가 침해당한 경우 (API3:2025 공급망 공격)
// → 우리 서버가 악성 응답을 실행
```

```javascript
// 안전한 코드: 외부 API 응답도 검증
const Joi = require('joi')

const geoResponseSchema = Joi.object({
  ip: Joi.string().ip().required(),
  city: Joi.string().max(100).required(),
  country: Joi.string().length(2).required(),
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required()
})

async function getUserLocation(ipAddress) {
  const response = await fetch(`https://third-party-geo.api/lookup/${ipAddress}`, {
    timeout: 3000  // 타임아웃 설정
  })

  if (!response.ok) {
    throw new Error(`External API error: ${response.status}`)
  }

  const data = await response.json()

  // 외부 응답도 스키마 검증
  const { error, value } = geoResponseSchema.validate(data)
  if (error) {
    throw new Error(`Invalid external API response: ${error.message}`)
  }

  return value  // 검증된 데이터만 반환
}
```

### 방어 전략

- 외부 API 응답도 **스키마 검증** (Joi, Zod, Pydantic 등)
- 외부 API에 **타임아웃 설정** (무한 대기 방지)
- HTTPS 강제 + **인증서 검증** (`verify=True`)
- 외부 API 제공사의 **보안 공지 구독** (침해 사고 알림)
- 외부 API가 다운됐을 때 **Fallback 로직** 준비

---

## 전체 위험도 요약

| 항목 | 이름 | 핵심 위협 | 대응 난이도 |
|------|------|---------|----------|
| API1 | BOLA | 다른 사용자 리소스 접근 | 중 |
| API2 | Broken Auth | 토큰 탈취/위조 | 중 |
| API3 | BOPLA | 데이터 과다 노출/필드 조작 | 중 |
| API4 | Resource Consumption | 서버 과부하/DDoS | 하 |
| API5 | BFLA | 권한 없는 기능 실행 | 중 |
| API6 | Sensitive Business Flows | 비즈니스 로직 자동화 악용 | 상 |
| API7 | SSRF | 내부 서비스/메타데이터 접근 | 상 |
| API8 | Misconfiguration | 잘못된 설정으로 전체 노출 | 하 |
| API9 | Inventory Management | 방치된 API 통한 침해 | 중 |
| API10 | Unsafe API Consumption | 외부 API 응답 신뢰로 인한 피해 | 중 |

---

## API 보안 개발 체크리스트

### 설계 단계
- [ ] 모든 엔드포인트에 인증/인가 요구사항 명시
- [ ] 응답 스키마 정의 (반환할 필드 사전 명확화)
- [ ] Rate Limit 정책 설계 (글로벌 / 사용자별 / 엔드포인트별)
- [ ] 민감 비즈니스 플로우 식별 및 보호 방안 계획

### 구현 단계
- [ ] 모든 데이터 접근에 소유권 검증 (BOLA 방지)
- [ ] 요청 입력 스키마 검증 (allowlist 방식)
- [ ] 응답 DTO 사용 (필요한 필드만 반환)
- [ ] Rate Limit 미들웨어 적용
- [ ] CORS 허용 도메인 명시적 설정
- [ ] HTTP 보안 헤더 설정

### 배포 단계
- [ ] API 인벤토리 문서화 (OpenAPI/Swagger)
- [ ] 구버전 API 폐기 계획 수립
- [ ] 에러 응답에 내부 정보 노출 없음 확인
- [ ] HTTPS 강제, 디버그 모드 비활성화
- [ ] 외부 API 목록 및 신뢰 수준 정리

### 운영 단계
- [ ] API 요청 로그 수집 및 이상 탐지
- [ ] 비정상 접근 시도 알림 설정
- [ ] 외부 의존성 보안 공지 구독
- [ ] 정기 API 감사 (사용하지 않는 엔드포인트 폐기)

---

## 마치며

OWASP API Security Top 10을 보면 공통된 패턴이 있다.

> **"서버가 직접 만든 것만 신뢰하라"**

- 사용자 입력: 검증
- 외부 API 응답: 검증
- JWT 토큰: 서명 검증
- 요청 URL: 검증
- DB에서 가져온 데이터: 소유권 검증

API 보안은 "한 번 설정하면 끝"이 아니다.  
새로운 엔드포인트가 추가될 때마다, 외부 의존성이 바뀔 때마다 다시 점검해야 한다.

---

## 관련 글

- [🔐 OWASP Top 10:2025 완전 가이드](/owasp-top10-2025/) — 웹 애플리케이션 보안의 기초
- [🔑 Spring Boot 인증 구현 가이드](/java-spring-authentication/) — JWT, OAuth2 실전 구현
- [🌐 OSI 7계층, 외우지 말고 이해하자](/osi-7-layers/) — 네트워크 계층에서 API 통신 이해
