---
title: "MDGGU의 아키텍처 설계"
description: "MDGGU의 아키텍처 설계"
date: 2024-06-28
update: 2024-09-08
tags:
  - Markdown
  - MDGGU
series: "MDGGU"
---

## MDGGU의 아키텍처 설계

사용자에게 효율적이고 안전한 문서 관리 및 협업 환경 제공을 위한 아키텍처 채택.

### 백엔드

- **Java(Spring Boot)**
  - 핵심 백엔드 플랫폼으로 사용되며, Spring Security와 JWT를 통해 사용자 인증 및 권한 관리를 수행.
  - RESTful API 제공으로 프론트엔드와 데이터를 주고받음.
- **Python(Flask 또는 FastAPI)**
  - 데이터 분석, 마크아둔 변환, 자연어 처리 등 고성능 비동기 처리가 필요한 작업 담당.
  - Java 백엔드와 REST API 또는 메시지 브로커(Kafka, RabbitMQ)를 통해 통신.
- **데이터베이스 연동**
  - Java 백엔드는 JPA를 통해 MongoDB 및 PostgreSQL과 연동하여 데이터를 효율적으로 저장하고 관리.
  - 데이터베이스 선택은 확장성과 복잡한 쿼리 요구사항을 고려하여 결정.
- **마이크로서비스 구성**
  - 주요 기능별로 서비스를 분리하여 관리하며, Docker와 Kubernetes를 활용해 각 서비스의 배포와 관리가 용이.
  - 서비스 간 통신은 API 게이트웨이를 통해 효율적으로 관리.

### 프론트엔드

- **React**
  - 사용자 인터페이스를 구성하는 주요 프레임워크.
  - React 앱은 백엔드 서비스와 RESTful API를 통해 통신하며, Redux 또는 Context API를 사용해 상태 관리를 수행.
- **Tailwind CSS**
  - 프론트엔드 디자인을 위해 사용되며, 반응형 웹 디자인을 손쉽게 구현할 수 있도록 도움.

### 데이터베이스

- **MongoDB**
  - 유연한 문서 저장을 위한 NoSQL 데이터베이스로, 동적인 콘텐츠 관리에 적합.
- **PostgreSQL**
  - 관계형 데이터베이스로 사용자 정보, 트랜잭션 데이터 등을 관리하는데 사용.
  - 트랜잭션 일관성과 무결성을 보장.

### 외부 통합 포인트:

- **서드파티 서비스 연동**
  - 필요에 따라 외부 API (예: Google Maps, 소셜 미디어 API 등)를 연동하여 추가 기능을 제공.
- **OAuth2**
  - 소셜 로그인과 같은 사용자 인증 기능을 위해 OAuth2 프로토콜을 사용하여 외부 서비스와 통합.

### 프로젝트 구조

```bash
    MD-GGU/
  ├── .env    # 환경 변수 파일
  ├── docker-compose.yml    # Docker Compose 파일
  ├── frontend/    # 프론트엔드 코드
  │   ├── Dockerfile    # 프론트엔드 Dockerfile
  │   ├── public/    # HTML 파일과 정적 자원 (이미지, 스타일시트 등)
  │   ├── src/    # React 컴포넌트와 JavaScript 소스 코드
  │   │   ├── components/    # 재사용 가능한 UI 컴포넌트
  │   │   ├── pages/    # 각 페이지 컴포넌트
  │   │   ├── api.js    # 백엔드와 통신하기 위한 함수
  │   │   ├── App.js    # 메인 애플리케이션 컴포넌트
  │   │   ├── index.js    # 엔트리 포인트 파일
  │   │   └── styles/    # 스타일 관련 파일 (CSS or SASS)
  │   ├── package.json    # 프로젝트 의존성과 스크립트 (npm)
  │   ├── .gitignore    # Git에서 무시할 파일 목록
  │   └── README.md    # 프론트엔드 설정 및 사용 가이드
  │
  ├── backend/    # 백엔드 관련 디렉토리
  │   ├── mdggu-backend/    # Java(Spring Boot) 기반 메인 백엔드 서비스
  │   │   ├── Dockerfile    # 백엔드 Dockerfile
  │   │   ├── src/    # Java 소스 코드
  │   │   ├── resources/    # resources
  │   │   │   └── logback-spring.xml    # log 설정 파일
  │   │   ├── build.gradle    # Gradle 프로젝트 설정 파일
  │   │   └── README.md    # Java 백엔드 설명
  │   ├── python-service/    # Python 마이크로서비스
  │   │   ├── Dockerfile    # Python 서비스 Dockerfile
  │   │   ├── app/    # Python 애플리케이션 코드
  │   │   ├── requirements.txt    # Python 의존성 (pip)
  │   │   └── README.md    # Python 서비스 설명
  │   ├── node-service/    # Node.js 서비스
  │   │   ├── Dockerfile    # Node.js 서비스 Dockerfile
  │   │   ├── src/    # Node.js 소스 코드
  │   │   ├── package.json    # Node.js 프로젝트 설정 및 의존성 (npm)
  │   │   └── README.md    # Node.js 서비스 설명
  │   ├── shared/    # 여러 백엔드 서비스에서 공통으로 사용되는 코드
  │   └── api-docs/    # 백엔드 API 문서화
  │
  ├── database/    # 데이터베이스 스키마 및 마이그레이션
  │   ├── migrations/    # 데이터베이스 마이그레이션 파일
  │   ├── schema/    # 초기 데이터베이스 스키마 정의
  │   └── seed/    # 초기 데이터 적재를 위한 시드 데이터
  │
  ├── docs/    # 프로젝트 문서화
  │   ├── api/    # API 문서화
  │   ├── architecture/    # 아키텍처 설계 문서
  │   └── user-guide/    # 사용자 가이드
  │
  └── .gitignore    # Git에서 무시할 파일 목록
```
