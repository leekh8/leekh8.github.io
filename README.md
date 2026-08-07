# leekh8.github.io

실무에서 만난 버그를 증상에서 원인까지 추적한 기록. 2023년 5월 시작, **45편** 발행.

**→ [leekh8.github.io](https://leekh8.github.io/)**

---

## 무엇을 다루나

| 축 | 편 | 성격 |
|---|--:|---|
| **버그 해부** (Code N Solve) | **20** | 실제로 겪은 실패 — 증상, 원인 추적, 수정까지 |
| 보안 | 6 | OWASP Top 10, 인증·인가, 서버 하드닝 |
| 웹 | 5 | TypeScript, CSS 레이아웃, 비동기 |
| React | 5 | 상태 관리, 렌더링, 라이프사이클 |
| 네트워크 | 3 | OSI, NAT, DNS |
| Python | 2 | 보안 자동화 |
| Linux | 2 | 권한, 하드닝 |
| DevOps | 1 | Docker |
| SQL | 1 | 기초 문법 |

가장 큰 축이 버그 해부. 개념 정리가 아니라 **재현 가능한 실패 사례** 중심.

## 시리즈

| 시리즈 | 편 | 최신 |
|---|--:|---|
| 웹 보안 기초 | 5 | JWT, OAuth, 세션 보안 |
| 네트워크 기초 | 3 | DNS 완전 정복 (2026-08) |
| React Basic | 3 | — |
| 보안 자동화 입문 | 2 | — |
| Python 보안 자동화 | 2 | 권고문 RSS 수집기 |
| Linux 시스템 기초 | 2 | 파일 권한 |

그 외 단발 시리즈 8개 (TypeScript, CSS, Docker, 웹 접근성 등).

## 어떻게 굴러가나

| 항목 | 내용 |
|---|---|
| 스택 | Gatsby 5 + React 18, [gatsby-starter-hoodie](https://github.com/devHudi/gatsby-starter-hoodie) 테마 |
| 호스팅 | GitHub Pages |
| 배포 | `push to main` → CD 자동 (빌드 약 2분 30초 + 배포 10초) |
| 발행 주기 | 주 1회 |

워크플로 4개 — `cd`(배포), `ci`(lint, format), `clear-actions-cache`, `auto-post`(수동 실행, 대기 중).

## 글 규약

- **frontmatter 순서 고정** — `title` → `description` → `date` → `update` → `tags` → `series` → `category`
- `date`(최초 발행)와 `update`(최종 수정) 분리 운영
- **본문은 H2부터** — 테마가 `title`을 H1으로 렌더
- **이미지 0** — 도식은 Mermaid, 포스트 디렉토리는 `index.md` 단일 파일
- **글 끝 3종** — 실무 체크리스트 → 다음 글 예고 → 관련 글

포스트 경로: `contents/posts/{카테고리}/{슬러그}/index.md`

## 로컬 실행

```bash
npm install
npm start          # localhost:8000
npm run build      # 프로덕션 빌드
npm run check:lint # eslint
```

## 라이선스

본문(`contents/`)은 저작권 보유. 테마 및 코드는 원 저장소의 MIT를 따름.
