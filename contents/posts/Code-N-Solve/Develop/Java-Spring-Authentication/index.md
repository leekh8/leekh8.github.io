---
title: "🚀 Java Spring 프레임워크에서의 인증 작동 원리와 문제 해결"
description: "Java Spring 프레임워크에서의 인증 메커니즘과 자주 발생하는 문제와 그 해결 방법에 대한 설명 및 Spring Security를 사용하여 사용자 인증을 관리하는 방법과 발생할 수 있는 일반적인 오류에 관한 정리"
date: 2024-09-09
update: 2024-09-09
tags:
  - Code N Solve
  - Java
  - Spring Framework
  - Spring Security
  - Authentication
  - Authorization
  - Web Development
series: "Code N Solve"
---

## Code N Solve 📘: Java Spring 프레임워크에서의 인증 작동 원리와 문제 해결

Spring 프레임워크는 자바 어플리케이션에서 인증과 접근 제어를 위한 강력하고 유연한 도구이다.

Spring Security를 이용한 인증 메커니즘의 동작 원리와 일반적으로 발생할 수 있는 일반적인 문제, 그리고 그 해결 방법에 대해 알아보자.

## Spring Security ? 🤔

- Spring Security는 Java 기반 어플리케이션에서 필수적으로 고려되어야 할 요소 중 하나이다.
- 올바른 사용자 식별과 접근 제어를 통해 어플리케이션의 신뢰성을 높이고 보안을 강화할 수 있다.
- 특히 사용자 데이터 보호와 권한 관리 기능을 제공하는 Spring Security는 강력한 대책이 될 수 있다.

## Spring Authentication 작동 원리

### **인증 과정**

- Spring 어플리케이션 내에서 사용자가 시스템에 접근하기 위해서는 인증 과정을 우선 거쳐야 한다.

- **사용자 정보 입력**

  - 클라이언트가 서버에 로그인 요청을 보내면, 사용자는 이메일과 비밀번호와 같은 자격 증명을 입력한다.

- **인증 프로세스 시작**

  - 서버에서는 입력된 자격 증명을 바탕으로사용자를 인증하려고 시도한다.
  - 이때 `AuthenticationManager`를 통해 사용자의 자격 증명이 유효한지 확인한다.
  - Spring Security는 이 과정을 통해 사용자 정보를 데이터베이스나 다른 저장소에서 조회하여 유효성을 검증한다.
  - ```java
    Authentication authentication = authenticationManager.authenticate(
      new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()));
    ```

- **권한 부여**

  - 인증이 성공하면, 사용자는 데이터베이스에 저장된 역할(Role)에 따라 적절한 권한을 부여받는다.
  - 이후 애플리케이션의 다른 부분에서 권한이 검증되어 사용자가 특정 작업을 수행할 수 있는지 결정된다.

- **SecurityContextHolder**
  - 인증이 성공하면, Spring Security는 `SecurityContextHolder`를 사용하여 인증 정보를 관리한다.
    - `SecurityContextHolder`는 현재 인증된 사용자의 세부 정보를 저장하는 컨텍스트이다.
    - ```java
      SecurityContextHolder.getContext().setAuthentication(authentication);
      ```

### 인증과 인가의 차이 [^1]? 🤔

- **인증(Identification):** '_누구인지_'를 아는 프로세스를 의미
- **인가(Authorization):** '_무엇을 할 수 있는지_'를 결정

- 두 용어는 종종 혼용되지만 명확히 구분할 필요가 있다.
- 애플리케이션 설계 시 두 개념을 정확히 이해하고 구현해야 한다.

## 발생 가능한 문제 분석 및 오류 해결 방법 [^2]

- **잘못된 사용자 입력 처리**

  - 사용자가 제공하는 정보는 종종 부정확할 수 있다.
  - 애플리케이션이 잘못된 입력을 감지하고, 명확한 에러 메시지를 사용자에게 제공해야 한다.
  - **해결 방법**

    - 유효성 검사(validation)를 도입해야 한다.
    - 유효성 검사는 사용자가 제출한 데이터가 특정 기준을 충족하는지 확인하는 과정이다.
    - Java에서는 `javax.validation.constraints` 패키지를 사용하여 쉽게 유효성 검사를 설정할 수 있다.
    - ```java
      import javax.validation.constraints.Email;
      import javax.validation.constraints.NotBlank;

      public class User {
        @NotBlank(message = "이메일은 필수 입력 사항입니다.")
        @Email(message = "이메일 형식이 잘못되었습니다.")
        private String email;

        @NotBlank(message = "비밀번호는 필수 입력 사항입니다.")
        private String password;
      }
      ```

- **서버 오류 진단**

  - 서버에서 발생하는 오류는 사용자가 직접 해결하기 어려운 문제이다.
  - 예를 들어, 데이터베이스 연결 오류가 발생하면 서버는 더 이상 요청을 처리할 수 없다.
  - 이런 상황에서는 서버 로그에 오류를 기록하고, 이를 빠르게 분석하여 문제를 해결할 수 있어야 한다.
  - **해결 방법**
    - 예외 처리를 통해 이러한 오류를 포착하고, 오류 발생 시 해당 오류를 로그에 기록해야 한다.
    - 이를 통해 개발자는 서버에서 발생한 문제를 빠르게 진단하고 대응할 수 있다.
    - ```java
      try {
        // 데이터베이스 연결 시도
        connectToDatabase();
      } catch (DatabaseConnectionException e) {
        log.error("데이터베이스 연결에 실패했습니다: {}", e.getMessage());
        throw new ServerException("서버 오류가 발생했습니다. 나중에 다시 시도해주세요.");
      }
      ```

- **인증 실패 오류**

  - 사용자의 잘못된 자격 증명, 비정상적인 `AuthenticationManager` 설정, 또는 사용자의 비밀번호가 해시된 형태로 저장되지 않고 평문으로 저장된 경우 등으로 발생하는 문제이다.
  - 인증 시도 후, "Authentication successful" 로그가 출력되지 않고, 인증 실패로 인해 사용자는 로그인을 할 수 없게 된다.

  - **해결 방법**

    - 사용자의 이메일과 비밀번호가 올바르게 입력되었는지 확인하고, `AuthenticationManager`와 `UserDetailsService`가 올바르게 설정되었는지 점검해야 한다.
    - 또한 비밀번호가 올바른 해시 알고리즘을 사용하여 저장되었는지도 확인해야 한다.
    - ```java
      log.info("Login attempt for user: {}", user.getEmail());

      try {
        Authentication authentication = authenticationManager.authenticate(
          new UsernamePasswordAuthenticationToken(
            user.getEmail(), user.getPassword()));
        log.info("Authentication successful for user: {}", user.getEmail());
      } catch (Exception e) {
        log.error("Authentication failed: {}", e.getMessage());
        throw new BadCredentialsException("Invalid credentials");
      }
      ```

- **SecurityContextHolder 설정 문제**

  - 인증이 성공했음에도 불구하고 `SecurityContextHolder`에 인증 정보가 저장되지 않아서 이후의 보안 관련 작업이 실패하는 경우가 있다.
  - 보통 `SecurityContextHolder`를 올바르게 구성하지 않았거나, 인증 후 응답이 반환되기 전에 컨텍스트가 초기화되었을 때 발생합니다.

  - **해결 방법**
    - `SecurityContextHolder.getContext().setAuthentication(authentication);` 호출이 올바르게 이루어졌는지, 그리고 이 호출 후 컨텍스트가 다른 곳에서 초기화되지 않았는지 확인해야 합니다.

- **비동기 처리에서의 인증 문제**

  - 비동기 요청 처리 중 인증 정보가 제대로 전달되지 않거나 손실되는 경우가 있다.
  - 예를 들어, 사용자가 백그라운드에서 실행되는 작업을 요청했을 때, 인증된 사용자인지 확인할 수 없어 요청이 실패할 수 있다.
  - `Spring Security`는 기본적으로 `스레드 로컬(ThreadLocal)`을 사용하여 `SecurityContext`를 관리한다.
  - 따라서 비동기 환경에서는 인증 정보가 스레드 간에 올바르게 전달되지 않을 수 있습니다.

  - **해결 방법**

    - 비동기 환경에서 `SecurityContext`를 유지하려면 `@Async` 메소드 또는 `Executor`를 사용할 때 `SecurityContext`를 명시적으로 전달하는 방식으로 설정해야 한다.
    - 예를 들어 `DelegatingSecurityContextExecutor`를 사용할 수 있다.

    - ```java
      @Bean
      public Executor taskExecutor() {
        return new DelegatingSecurityContextExecutor(new SimpleAsyncTaskExecutor());
      }
      ```

## 보안 베스트 프랙티스 [^3] [^4]

보안성을 높이기 위해 개발자는 모범 사례를 준수해야 한다.

- **확인된 안전한 라이브러리 사용**

  - 항상 최근 버전의 라이브러리를 유지하고 알려진 취약점을 주기적으로 점검해야할 필요성이 있다.

- **HTTP 보안 헤더 설정**

  - 기본 HTTP 헤더 외 추가 헤더 값을 통해 애플리케이션을 더욱 안전하게 보호할 수 있다.
  - 예를 들어, `Content-Security-Policy` 헤더를 사용하면 웹 페이지에서 실행될 수 있는 자바스크립트의 출처를 제한할 수 있다.
  - ```java
    http.headers()
      .contentSecurityPolicy("script-src 'self'")
      .and()
      .referrerPolicy(ReferrerPolicyHeaderWriter.ReferrerPolicy.NO_REFERRER);
    ```

- **데이터 명령어 분리**

  - 데이터를 처리하는 부분과 명령어 수행 부분은 철저히 분산하여 SQL 주입 공격과 같은 보안 위협을 예방해야 한다.
  - 예를 들어, SQL 쿼리를 직접 작성하는 대신, `PreparedStatement`를 사용하여 데이터를 안전하게 처리할 수 있습니다.
  - ```java
      String query = "SELECT * FROM users WHERE email = ?";
      PreparedStatement statement = connection.prepareStatement(query);
      statement.setString(1, userEmail);
      ResultSet resultSet = statement.executeQuery();
    ```

## 결론

스프링(Authentication) 기술이 어떻게 작동하며 우리가 마주칠 수 있는 문제들 그리고 그 해결 방안을 살펴보았다.

각 주제를 종합적으로 고려하여 안정적이고 효율적인 코드를 작성하면 좋겠다.

[^1] Marco Behler - Spring Security: Authentication and Authorization In-Depth (https://www.marcobehler.com/guides/spring-security)
[^2] Medium - Securing Spring Boot Applications: Best Practices and ... (https://medium.com/@shubhamvartak01/securing-spring-boot-applications-best-practices-and-strategies-3ab731f8b317)
[^3] Spring - Getting Started | Securing a Web Application (https://spring.io/guides/gs/securing-web)
[^4] Synopsys - Top 10 Spring Security Best Practices for Java Developers (https://www.synopsys.com/blogs/software-security/spring-security-best-practices.html)
