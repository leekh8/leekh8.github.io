---
title: "🚀 프로젝트 백엔드 빌드 오류 해결"
description: "다양한 기술 스택을 활용하여 마크다운 글을 최적화하는 MDGGU 프로그램"
date: 2024-06-20
update: 2024-06-20
tags:
  - MDGGU
  - Java
  - Spring Security
  - 백엔드
series: "MDGGU"
---

## 🚀 프로젝트 백엔드 빌드 오류 해결

### 🛠️ 발생한 문제와 해결 방안

- 문제 1: Spring Security 설정에서 requestMatchers 관련 오류

  - 오류 내용: requestMatchers 메서드가 문자열을 인수로 받을 수 없음
  - 원인: Spring Security 6에서는 antMatchers가 사라지고, 대신 requestMatchers 사용. requestMatchers는 문자열 대신 RequestMatcher 객체 배열을 인수로 요구
  - 해결 방법: AntPathRequestMatcher를 사용하여 문자열 경로를 RequestMatcher로 변환
  - 수정 전
    ```java
      .requestMatchers("/api/v1/auth/**").permitAll()
      .requestMatchers("/api/v1/documents/**").permitAll()
    ```
  - 수정 후
    ```java
      .requestMatchers(new AntPathRequestMatcher("/api/v1/auth/**")).permitAll()
      .requestMatchers(new AntPathRequestMatcher("/api/v1/documents/**")).permitAll()
    ```
