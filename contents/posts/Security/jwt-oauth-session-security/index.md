---
title: "JWT, OAuth, 세션 보안 완전 가이드: 인증·인가 취약점과 방어 전략"
description: "JWT 알고리즘 혼동 공격, none 알고리즘 취약점, OAuth CSRF, 오픈 리다이렉트, 세션 하이재킹까지 웹 인증·인가에서 실제로 발생하는 취약점과 안전한 구현 방법을 코드 중심으로 정리합니다."
date: 2026-05-11
update: 2026-05-11
tags:
  - Security
  - JWT
  - OAuth
  - 세션보안
  - 인증
  - 인가
  - OWASP
category: Security
series: "웹 보안 기초"
---

> 이 글은 웹 보안 기초 시리즈 4편입니다.
> - 1편: [OWASP Top 10:2025 완전 가이드](/owasp-top10-2025/)
> - 2편: [OWASP API Security Top 10:2023](/owasp-api-security-2023/)
> - 3편: [OWASP LLM Top 10:2025](/owasp-llm-top10-2025/)
> - 4편: **JWT, OAuth, 세션 보안** ← 현재 글

---

## 인증 vs 인가 — 먼저 개념부터

보안 취약점 대부분은 이 둘을 혼동하거나 둘 중 하나를 빠뜨리는 데서 시작합니다.

| 개념 | 질문 | 예시 |
|------|------|------|
| **인증 (Authentication)** | "너 누구야?" | 로그인, JWT 검증 |
| **인가 (Authorization)** | "너 이걸 할 수 있어?" | 관리자 권한 확인, 소유자 확인 |

```python
# 흔한 실수: 인증만 하고 인가를 빠뜨림
@app.route('/api/user/<int:user_id>/profile', methods=['DELETE'])
def delete_profile(user_id):
    token = request.headers.get('Authorization')
    user = verify_token(token)  # ✅ 인증: 로그인한 사용자인지 확인
    # ❌ 인가 없음: user_id가 자신의 것인지 확인 안 함
    db.delete_user(user_id)     # 다른 사람 계정도 삭제 가능
```

OWASP Top 10:2025의 **A01 Broken Access Control**이 6년째 1위인 이유입니다.

---

## 1. 세션 기반 인증과 보안

### 세션 동작 원리

```
1. 사용자 로그인 요청
2. 서버: 세션 생성 → 세션 ID를 쿠키에 Set-Cookie
3. 이후 요청마다 브라우저가 쿠키 자동 전송
4. 서버: 세션 ID로 사용자 확인
```

### 세션 하이재킹 (Session Hijacking)

공격자가 세션 ID를 탈취해 다른 사람으로 위장하는 공격입니다.

```javascript
// 취약한 쿠키 설정 (Express.js)
app.use(session({
  secret: 'mysecret',
  cookie: {
    // ❌ httpOnly: false → JavaScript로 document.cookie 접근 가능 (XSS 연계)
    // ❌ secure: false  → HTTP에서도 전송 (네트워크 도청 가능)
    // ❌ sameSite 없음  → CSRF 공격 가능
  }
}));

// 안전한 쿠키 설정
app.use(session({
  secret: process.env.SESSION_SECRET,  // 환경변수로 분리
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,    // ✅ JS에서 접근 불가 (XSS 방어)
    secure: true,      // ✅ HTTPS에서만 전송
    sameSite: 'strict',// ✅ 다른 사이트 요청 시 쿠키 미전송 (CSRF 방어)
    maxAge: 1000 * 60 * 60,  // ✅ 1시간 만료
  }
}));
```

### 세션 고정 공격 (Session Fixation)

공격자가 미리 만든 세션 ID를 피해자에게 강제로 사용하게 하는 공격입니다.

```python
# 취약: 로그인 후 세션 ID를 새로 발급하지 않음
def login(username, password):
    if verify_credentials(username, password):
        session['user'] = username  # ❌ 기존 세션 ID 유지
        return True

# 안전: 로그인 성공 시 세션 재생성
def login_safe(username, password):
    if verify_credentials(username, password):
        session.clear()             # ✅ 기존 세션 데이터 초기화
        session.regenerate()        # ✅ 새로운 세션 ID 발급
        session['user'] = username
        return True
```

### 세션 보안 체크리스트

```python
# Django 세션 보안 설정 예시
# settings.py

SESSION_COOKIE_HTTPONLY = True      # XSS 방어
SESSION_COOKIE_SECURE = True        # HTTPS 전용
SESSION_COOKIE_SAMESITE = 'Strict'  # CSRF 방어
SESSION_COOKIE_AGE = 3600           # 1시간 만료
SESSION_EXPIRE_AT_BROWSER_CLOSE = True  # 브라우저 종료 시 만료

# 세션 저장소: DB나 Redis 사용 (메모리 저장 금지)
SESSION_ENGINE = 'django.contrib.sessions.backends.cache'
SESSION_CACHE_ALIAS = 'default'  # Redis 연결
```

---

## 2. JWT — 구조와 주요 취약점

### JWT 구조

JWT(JSON Web Token)는 점(`.`)으로 구분된 세 부분으로 구성됩니다:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9   ← Header (Base64)
.eyJzdWIiOiJ1c2VyMTIzIiwicm9sZSI6InVzZXIiLCJleHAiOjE3MTYwMDAwMDB9  ← Payload (Base64)
.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c  ← Signature
```

```json
// Header
{
  "alg": "HS256",
  "typ": "JWT"
}

// Payload
{
  "sub": "user123",
  "role": "user",
  "exp": 1716000000
}
```

**중요**: Payload는 Base64 인코딩이지 암호화가 아닙니다. **누구나 디코딩해서 내용을 볼 수 있습니다.** 민감 정보를 Payload에 담지 마세요.

### 취약점 1: Algorithm None 공격

서버가 `alg: none`을 허용하면, 공격자가 서명 없이 임의의 토큰을 만들 수 있습니다.

```python
import base64, json

# 공격자가 직접 조작한 토큰 생성
header = base64.b64encode(json.dumps({"alg": "none", "typ": "JWT"}).encode()).decode()
payload = base64.b64encode(json.dumps({"sub": "admin", "role": "admin"}).encode()).decode()
fake_token = f"{header}.{payload}."  # 서명 없음

# 취약한 검증 코드
import jwt

def verify_token_bad(token: str):
    # ❌ algorithms를 지정하지 않으면 none 포함 모든 알고리즘 허용
    return jwt.decode(token, SECRET_KEY, algorithms=jwt.algorithms.get_default_algorithms())

# 안전한 검증 코드
def verify_token_safe(token: str):
    # ✅ 허용할 알고리즘을 명시적으로 지정
    return jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
```

### 취약점 2: 알고리즘 혼동 공격 (Algorithm Confusion)

서버가 RS256(비대칭키)을 사용하는데, 공격자가 공개키로 HS256(대칭키) 서명을 만들어 우회하는 공격입니다.

```python
# 공격 시나리오:
# 1. 서버가 RS256(공개키/개인키) 사용
# 2. 서버의 공개키는 누구나 얻을 수 있음 (JWKS 엔드포인트 등)
# 3. 공격자: 공개키를 시크릿으로 사용해 HS256으로 서명
# 4. 취약한 서버: "HS256이니까 공개키로 검증"하면 성공

# 안전한 구현: 헤더의 alg 값을 신뢰하지 말고 서버에서 강제
def verify_token_rs256(token: str, public_key: str):
    # ✅ RS256만 허용, HS256 등 다른 알고리즘 완전 차단
    return jwt.decode(token, public_key, algorithms=["RS256"])
```

### 취약점 3: 약한 시크릿 키

```python
# ❌ 취약한 시크릿 키
SECRET = "secret"
SECRET = "123456"
SECRET = "password"

# JWT 크래킹 도구(hashcat, jwt-cracker)로 수 초~분 내에 크랙 가능

# ✅ 충분히 긴 랜덤 시크릿 키 생성
import secrets
SECRET = secrets.token_hex(64)  # 128자 랜덤 hex 문자열

# 환경 변수로 관리
import os
SECRET = os.environ.get("JWT_SECRET_KEY")
if not SECRET or len(SECRET) < 32:
    raise ValueError("JWT_SECRET_KEY는 최소 32자 이상이어야 합니다.")
```

### 취약점 4: 만료 시간 미설정 또는 과도하게 긴 만료

```python
# ❌ 만료 시간 없는 토큰 — 영구적으로 유효
payload = {
    "sub": "user123",
    "role": "admin",
    # exp 없음
}

# ❌ 과도하게 긴 만료 시간
payload = {
    "sub": "user123",
    "exp": datetime.utcnow() + timedelta(days=365),  # 1년
}

# ✅ 적절한 만료 시간 + Refresh Token 패턴
from datetime import datetime, timedelta

def create_tokens(user_id: str) -> dict:
    access_payload = {
        "sub": user_id,
        "exp": datetime.utcnow() + timedelta(minutes=15),  # Access: 15분
        "type": "access",
    }
    refresh_payload = {
        "sub": user_id,
        "exp": datetime.utcnow() + timedelta(days=7),      # Refresh: 7일
        "type": "refresh",
    }
    return {
        "access_token": jwt.encode(access_payload, ACCESS_SECRET, algorithm="HS256"),
        "refresh_token": jwt.encode(refresh_payload, REFRESH_SECRET, algorithm="HS256"),
    }
```

### 취약점 5: JWT 저장 위치 문제

```javascript
// ❌ localStorage에 JWT 저장 — XSS 공격으로 탈취 가능
localStorage.setItem('token', jwt);

// ❌ JavaScript로 접근 가능한 쿠키
document.cookie = `token=${jwt}`;

// ✅ httpOnly 쿠키에 저장 (서버에서 Set-Cookie)
// 서버 응답
res.cookie('access_token', jwt, {
  httpOnly: true,    // JS 접근 불가
  secure: true,      // HTTPS 전용
  sameSite: 'strict',
  maxAge: 15 * 60 * 1000,  // 15분
});
```

### JWT 토큰 강제 무효화 (블랙리스트)

JWT는 서버가 상태를 갖지 않아서(Stateless), 발급 후 만료 전에는 서버에서 강제 무효화가 어렵습니다.

```python
# 방법 1: Redis 블랙리스트
import redis

r = redis.Redis(host='localhost', port=6379, db=0)

def revoke_token(jti: str, exp: int):
    """토큰을 블랙리스트에 추가합니다."""
    ttl = exp - int(datetime.utcnow().timestamp())
    r.setex(f"blacklist:{jti}", ttl, "revoked")

def is_revoked(jti: str) -> bool:
    return r.exists(f"blacklist:{jti}") > 0

def verify_token(token: str) -> dict:
    payload = jwt.decode(token, SECRET, algorithms=["HS256"])
    if is_revoked(payload.get("jti")):
        raise jwt.InvalidTokenError("Revoked token")
    return payload

# 토큰 발급 시 jti(JWT ID) 포함
def create_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "jti": secrets.token_hex(16),  # 고유 ID
        "exp": datetime.utcnow() + timedelta(minutes=15),
    }
    return jwt.encode(payload, SECRET, algorithm="HS256")
```

---

## 3. OAuth 2.0 — 흐름과 주요 취약점

### OAuth 2.0 Authorization Code 흐름

```
사용자 → 클라이언트(우리 서비스)
           ↓ 1. 인증 요청
         인가 서버(Google, GitHub 등)
           ↓ 2. 사용자 동의 후 Authorization Code 발급
         클라이언트
           ↓ 3. Code + Client Secret으로 Access Token 교환
         인가 서버
           ↓ 4. Access Token 발급
         클라이언트 → Resource Server(API)
```

### 취약점 1: state 파라미터 미검증 (CSRF 공격)

```python
# 취약: state 파라미터 없이 OAuth 시작
def oauth_login():
    return redirect(
        "https://github.com/login/oauth/authorize"
        f"?client_id={CLIENT_ID}"
        f"&redirect_uri={REDIRECT_URI}"
        # ❌ state 없음
    )

# 공격자 시나리오:
# 1. 공격자가 자신의 GitHub 계정으로 OAuth 흐름 시작
# 2. 인증 코드를 받는 단계에서 중단
# 3. callback URL을 피해자에게 전송
# 4. 피해자가 클릭하면 공격자 계정이 피해자 계정에 연결됨

# 안전: state 파라미터로 CSRF 방어
import secrets
from flask import session

def oauth_login_safe():
    state = secrets.token_urlsafe(32)
    session['oauth_state'] = state
    return redirect(
        "https://github.com/login/oauth/authorize"
        f"?client_id={CLIENT_ID}"
        f"&redirect_uri={REDIRECT_URI}"
        f"&state={state}"  # ✅ CSRF 토큰
    )

def oauth_callback(code: str, state: str):
    # ✅ state 검증
    if state != session.get('oauth_state'):
        raise SecurityError("Invalid state parameter — CSRF 공격 의심")
    session.pop('oauth_state', None)
    # 이후 code로 access token 교환
```

### 취약점 2: 오픈 리다이렉트 (Open Redirect)

```python
# 취약: redirect_uri를 서버에서 검증하지 않음
# 공격자가 아래처럼 redirect_uri를 조작:
# https://auth.example.com/authorize?redirect_uri=https://attacker.com

# 안전: redirect_uri를 사전에 등록된 값과 비교
ALLOWED_REDIRECT_URIS = [
    "https://myapp.com/oauth/callback",
    "https://myapp.com/auth/github/callback",
]

def validate_redirect_uri(redirect_uri: str) -> bool:
    # ✅ 정확히 일치하는 URI만 허용 (prefix 매칭 금지)
    return redirect_uri in ALLOWED_REDIRECT_URIS
```

### 취약점 3: Authorization Code 재사용

```python
# 안전한 구현: 코드는 1회만 사용 가능하도록 처리
import redis

r = redis.Redis()

def exchange_code_for_token(code: str) -> str:
    # ✅ 이미 사용된 코드인지 확인
    if r.exists(f"used_code:{code}"):
        raise SecurityError("Authorization code가 이미 사용되었습니다.")

    # 코드 사용 처리 (짧은 TTL로 저장)
    r.setex(f"used_code:{code}", 300, "used")  # 5분

    # 인가 서버에 토큰 교환 요청
    response = requests.post(TOKEN_ENDPOINT, data={
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": REDIRECT_URI,
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
    })
    return response.json()["access_token"]
```

### 취약점 4: Access Token 과다 권한

```python
# ❌ 필요 이상의 권한(scope) 요청
scope = "read write admin delete"

# ✅ 최소 권한 원칙 — 필요한 scope만 요청
scope = "read:user"  # 사용자 기본 정보만

# GitHub OAuth scope 예시
MINIMAL_SCOPES = {
    "user_info": "read:user",
    "email": "user:email",
    "repo_read": "repo:status",
    # admin이나 delete는 절대 사용 안 함
}
```

---

## 4. PKCE — 모바일/SPA 앱의 필수 보안

모바일 앱이나 SPA(Single Page App)는 client_secret을 안전하게 보관할 수 없습니다. 이때 **PKCE(Proof Key for Code Exchange)**를 사용합니다.

```python
import hashlib, base64, secrets

def generate_pkce():
    """PKCE code_verifier와 code_challenge를 생성합니다."""
    # 1. code_verifier 생성 (랜덤 문자열)
    code_verifier = secrets.token_urlsafe(64)

    # 2. code_challenge = Base64URL(SHA256(code_verifier))
    digest = hashlib.sha256(code_verifier.encode()).digest()
    code_challenge = base64.urlsafe_b64encode(digest).rstrip(b'=').decode()

    return code_verifier, code_challenge

# 인증 요청 시 code_challenge 포함
code_verifier, code_challenge = generate_pkce()

auth_url = (
    f"{AUTH_ENDPOINT}"
    f"?client_id={CLIENT_ID}"
    f"&redirect_uri={REDIRECT_URI}"
    f"&response_type=code"
    f"&code_challenge={code_challenge}"
    f"&code_challenge_method=S256"  # SHA256 방식
    f"&state={state}"
)

# 토큰 교환 시 code_verifier 포함 (client_secret 불필요)
token_response = requests.post(TOKEN_ENDPOINT, data={
    "grant_type": "authorization_code",
    "code": auth_code,
    "redirect_uri": REDIRECT_URI,
    "client_id": CLIENT_ID,
    "code_verifier": code_verifier,  # ✅ client_secret 대신 사용
})
```

---

## 5. 실전 구현 패턴

### Access Token + Refresh Token 완전 구현

```python
from datetime import datetime, timedelta
import jwt, secrets, redis

r = redis.Redis(host='localhost', port=6379, db=0)

ACCESS_SECRET = os.environ["ACCESS_TOKEN_SECRET"]
REFRESH_SECRET = os.environ["REFRESH_TOKEN_SECRET"]

def create_token_pair(user_id: str, role: str) -> dict:
    """Access Token(15분) + Refresh Token(7일) 발급"""
    jti = secrets.token_hex(16)

    access_token = jwt.encode({
        "sub": user_id,
        "role": role,
        "jti": jti,
        "type": "access",
        "exp": datetime.utcnow() + timedelta(minutes=15),
        "iat": datetime.utcnow(),
    }, ACCESS_SECRET, algorithm="HS256")

    refresh_token = jwt.encode({
        "sub": user_id,
        "jti": jti,
        "type": "refresh",
        "exp": datetime.utcnow() + timedelta(days=7),
        "iat": datetime.utcnow(),
    }, REFRESH_SECRET, algorithm="HS256")

    # Refresh Token을 Redis에 저장 (재사용 방지)
    r.setex(f"refresh:{jti}", 60 * 60 * 24 * 7, user_id)

    return {"access_token": access_token, "refresh_token": refresh_token}


def refresh_access_token(refresh_token: str) -> dict:
    """Refresh Token으로 새 Access Token 발급"""
    try:
        payload = jwt.decode(refresh_token, REFRESH_SECRET, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise ValueError("Refresh Token이 만료되었습니다. 다시 로그인하세요.")

    if payload.get("type") != "refresh":
        raise ValueError("잘못된 토큰 타입")

    jti = payload["jti"]

    # Redis에서 유효성 확인 (로그아웃 또는 재사용 여부)
    if not r.exists(f"refresh:{jti}"):
        raise ValueError("유효하지 않은 Refresh Token — 재로그인 필요")

    # ✅ Refresh Token Rotation: 기존 토큰 폐기 후 새 토큰 쌍 발급
    r.delete(f"refresh:{jti}")
    return create_token_pair(payload["sub"], get_user_role(payload["sub"]))


def logout(refresh_token: str):
    """로그아웃: Refresh Token 폐기"""
    try:
        payload = jwt.decode(refresh_token, REFRESH_SECRET, algorithms=["HS256"])
        r.delete(f"refresh:{payload['jti']}")
    except Exception:
        pass  # 이미 만료된 토큰이어도 로그아웃 성공 처리
```

### 미들웨어로 인증·인가 처리 (FastAPI 예시)

```python
from fastapi import Depends, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(security)
) -> dict:
    """JWT 검증 미들웨어"""
    token = credentials.credentials
    try:
        payload = jwt.decode(token, ACCESS_SECRET, algorithms=["HS256"])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="잘못된 토큰 타입")
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="토큰이 만료되었습니다")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="유효하지 않은 토큰")

def require_role(*roles: str):
    """특정 역할 필요 데코레이터"""
    def checker(user: dict = Depends(get_current_user)):
        if user.get("role") not in roles:
            raise HTTPException(status_code=403, detail="권한이 없습니다")
        return user
    return checker

# 라우터에서 사용
@app.get("/api/admin/users")
def list_users(user: dict = Depends(require_role("admin"))):
    return db.get_all_users()

@app.delete("/api/user/{user_id}")
def delete_user(user_id: str, current_user: dict = Depends(get_current_user)):
    # ✅ 인증 + 인가: 본인 계정만 삭제 가능
    if current_user["sub"] != user_id and current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="본인 계정만 삭제할 수 있습니다")
    db.delete_user(user_id)
```

---

## 전체 보안 체크리스트

### 세션

- [ ] `httpOnly: true` — JS에서 쿠키 접근 불가
- [ ] `secure: true` — HTTPS 전용 전송
- [ ] `sameSite: 'strict'` — CSRF 방어
- [ ] 로그인 성공 시 세션 ID 재생성 (세션 고정 공격 방어)
- [ ] 세션 만료 시간 설정 (1~2시간 이내)

### JWT

- [ ] 허용 알고리즘 명시적 지정 (`algorithms=["HS256"]`)
- [ ] `none` 알고리즘 허용 금지
- [ ] 시크릿 키 최소 32자 이상, 환경변수 관리
- [ ] `exp` 클레임 반드시 포함 (Access: 15분, Refresh: 7일)
- [ ] Payload에 민감 정보(비밀번호, 카드번호 등) 포함 금지
- [ ] `jti` 클레임 포함 + Redis 블랙리스트로 강제 무효화
- [ ] Refresh Token Rotation 구현
- [ ] httpOnly 쿠키에 저장 (localStorage 금지)

### OAuth

- [ ] `state` 파라미터 생성·검증 (CSRF 방어)
- [ ] `redirect_uri` 서버에서 allowlist 검증
- [ ] Authorization Code 1회 사용 후 무효화
- [ ] 최소 scope만 요청
- [ ] 모바일/SPA는 PKCE 의무 사용
- [ ] client_secret 서버 사이드에서만 사용 (클라이언트 코드에 포함 금지)

---

## 마치며

인증·인가 취약점이 OWASP Top 10에서 항상 상위를 차지하는 이유는 **구현은 쉬워 보이지만 실수 포인트가 많기 때문**입니다.

가장 먼저 챙겨야 할 것:
1. **쿠키 세 가지 속성** — `httpOnly`, `secure`, `sameSite` 모두 설정
2. **JWT 알고리즘 고정** — `algorithms` 파라미터 반드시 명시
3. **OAuth state 파라미터** — 없으면 CSRF 그대로 노출
4. **인증 후 인가 확인** — "로그인했는가" 다음에 "이 리소스에 권한이 있는가" 반드시

---

## 관련 글

- [OWASP Top 10:2025 — A07 인증 실패, A01 접근 제어 취약점](/owasp-top10-2025/)
- [OWASP API Security Top 10 — API2 Broken Authentication](/owasp-api-security-2023/)
- [Spring Security 인증 구조 완전 정리](/java-spring-authentication/)
