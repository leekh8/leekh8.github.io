# Changelog

All notable changes to this blog are documented here.
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### Planned
- 포스트 커버 이미지 (각 포스트 thumbnail 필드 지원)

---

## [2026-04-09] — UI/UX 2차 개선

### Added
- 소셜 공유 버튼: 포스트 하단 Twitter(X), LinkedIn 공유 버튼
- 포스트 목록 읽기 시간 표시: 날짜 옆 `· N min read`
- Bio 링크 아이콘 tooltip/aria-label 추가 (About, GitHub, Email 등)

---

## [2026-04-09]

### Added
- 코드 블록 복사 버튼 (hover 시 표시, 2초 후 원복)
- Back to top 버튼 (스크롤 400px 이상 시 등장)
- 모바일 접이식 TOC (1300px 이하에서 "목차 열기/닫기" 버튼)

### Fixed
- SideTagList 위치 버그: `left: 112%` → `calc(100% + 24px)` (SideSeriesList와 통일)
- SideTagList `height: 100px` 고정값 제거 (태그 많을 때 잘림 현상 수정)
- Footer 폰트 단위 통일: `11pt` → `13px`
- auto-post 워크플로우 schedule 비활성화 (GH_PAT, ANTHROPIC_API_KEY 미설정)

---

## [2026-04-03]

### Added
- 신규 포스트: Linux 파일 권한 완전 정복 (chmod/chown/SUID/SGID/Sticky bit)
  - 시리즈: "Linux 시스템 기초" 1편

### Fixed
- SideSeriesList 시리즈 링크 경로 수정: `/series?q=...` → `/series/시리즈명` (정적 페이지 직접 이동)
- Playwright 빌드 오류: `npx playwright` 대신 `playwright-core@1.58.2`와 동일 버전 고정

### Removed
- MD-GGU 내부 스펙 문서 5개 삭제 (기능명세/비기능요구사항/아키텍처/빌드오류/동작원리)
  - 이유: 독자 대상 콘텐츠가 아닌 내부 프로젝트 문서 → 레포 docs/로 이동 예정

---

## [2026-03-30]

### Added
- 신규 포스트: SOAR 개념 및 FortiSOAR 입문 (시리즈: "보안 자동화 입문")
- 신규 포스트: Wappalyzer 동작 원리와 보안 관점 분석 (시리즈: "웹 보안 기초")
- 신규 포스트: OSI 7계층 — 데이터가 실제로 이동하는 방식 (시리즈: "네트워크 기초")
- 신규 포스트: NAT 완전 정복 (시리즈: "네트워크 기초")
- 신규 포스트: Python VirusTotal API 자동화 (시리즈: "Python 보안 자동화")
- 좌측 Series 사이드바 (SideSeriesList 컴포넌트, 1300px 이상에서만 표시)
- GitHub Actions CI/CD 파이프라인 (ci.yml, cd.yml)
- auto-post 워크플로우 초안 (scripts/generate_post.py)

### Changed
- 전체 폰트 크기 축소: html base `16px` → `14px`
- 포스트 제목 크기 축소: `44.8px` → `28px` (모바일 `22px` 반응형 추가)
- TagLink 크기/여백 축소: `14.4px` → `12px`, padding `9.6px 11.2px` → `4px 10px`
- SideTagList 표시 태그 수 제한: 전체 → 상위 12개
- 포스트 간 Divider 여백 축소
- Body max-width: `740px` → `760px`
- 블로그 description 업데이트

### Fixed
- Mermaid 다이어그램 초기화 블록 (`%%{init: {"theme": "base"}}%%`) 전체 적용
- OSI 포스트 한국어 bold 렌더링 수정 (`**text**가` → `**text가**`)
- OSI 캡슐화 다이어그램: 너무 넓은 `graph LR` → 세로 `flowchart TB` 2개로 분리
- NAT 중첩 다이어그램 레이아웃 개선 (`flowchart TD` → `flowchart LR`)
- Series 사이드바 `position: absolute` 미적용 버그 (RelativeWrapper 추가)
- yarn.lock 누락으로 인한 CD 빌드 실패 수정

---

## [2025-06-20]

### Added
- Playwright 로그인 자동화 가이드 문서

---

## [2025-05-16] — [2025-05-19]

### Fixed
- Bio 컴포넌트 react-icons 오류 수정 (im → fa)
- pathPrefix 제거 (sitemap URL GitHub Pages 루트 경로 정렬)
- About 페이지 빌드 오류 수정
- 내부 링크 절대 경로 수정

