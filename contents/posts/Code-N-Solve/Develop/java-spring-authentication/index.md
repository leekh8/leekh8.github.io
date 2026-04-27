---
title: "🚀 Java Spring 프레임워크에서의 인증 작동 원리와 문제 해결"
description: "Java Spring 프레임워크에서의 인증 메커니즘과 자주 발생하는 문제와 그 해결 방법에 대한 설명 및 Spring Security를 사용하여 사용자 인증을 관리하는 방법과 발생할 수 있는 일반적인 오류에 관한 정리"
date: 2024-09-09
update: 2026-04-20
tags:
  - Code N Solve
  - Java
  - Spring Framework
  - Spring Security
  - Authentication
  - Authorization
  - Web Development
  - JWT
  - OAuth2
series: "Code N Solve"
---

## Code N Solve 📘: Java Spring 프레임워크에서의 인증 작동 원리와 문제 해결

Spring 프레임워크는 자바 어플리케이션에서 인증과 접근 제어를 위한 강력하고 유연한 도구이다.

Spring Security를 이용한 인증 메커니즘의 동작 원리와 일반적으로 발생할 수 있는 일반적인 문제, 그리고 그 해결 방법에 대해 알아보자.

---

## Spring Security ? 🤔

- Spring Security는 Java 기반 어플리케이션에서 필수적으로 고려되어야 할 요소 중 하나이다.
- 올바른 사용자 식별과 접근 제어를 통해 어플리케이션의 신뢰성을 높이고 보안을 강화할 수 있다.
- 특히 사용자 데이터 보호와 권한 관리 기능을 제공하는 Spring Security는 강력한 대책이 될 수 있다.

---

## Spring Security Filter Chain 전체 동작 흐름

Spring Security의 핵심은 **Filter Chain**이다. 클라이언트의 HTTP 요청이 실제 컨트롤러에 도달하기 전에, 여러 필터를 순서대로 통과하면서 인증과 인가가 처리된다. 각 필터는 단일 책임 원칙에 따라 자신의 역할만 수행하고, 다음 필터로 요청을 넘긴다.

```mermaid
flowchart TD
    A[클라이언트 HTTP 요청] --> B[DelegatingFilterProxy]
    B --> C[FilterChainProxy]
    C --> D{SecurityFilterChain 매칭}
    D --> E[SecurityContextPersistenceFilter\n세션에서 SecurityContext 복원]
    E --> F[UsernamePasswordAuthenticationFilter\n폼 로그인 처리]
    F --> G{자격 증명 유효?}
    G -- 예 --> H[AuthenticationManager.authenticate]
    G -- 아니오 --> I[AuthenticationFailureHandler\n401 응답 반환]
    H --> J[UserDetailsService.loadUserByUsername\nDB에서 사용자 조회]
    J --> K[PasswordEncoder.matches\n비밀번호 검증]
    K --> L{비밀번호 일치?}
    L -- 예 --> M[SecurityContextHolder에 Authentication 저장]
    L -- 아니오 --> I
    M --> N[AuthenticationSuccessHandler\n성공 응답 또는 리다이렉트]
    N --> O[ExceptionTranslationFilter\n보안 예외 처리]
    O --> P[FilterSecurityInterceptor\n인가 검사]
    P --> Q{권한 충분?}
    Q -- 예 --> R[DispatcherServlet → Controller]
    Q -- 아니오 --> S[AccessDeniedHandler\n403 응답 반환]
    R --> T[응답 반환]
```

### 주요 필터 설명

| 필터 이름 | 역할 |
|---|---|
| `SecurityContextPersistenceFilter` | 요청 시작 시 세션에서 `SecurityContext`를 복원하고, 종료 시 저장 |
| `UsernamePasswordAuthenticationFilter` | 폼 로그인 POST 요청을 가로채어 인증 처리 |
| `BearerTokenAuthenticationFilter` | Authorization 헤더의 JWT 토큰을 추출하여 인증 처리 |
| `ExceptionTranslationFilter` | `AuthenticationException`, `AccessDeniedException`을 적절한 HTTP 응답으로 변환 |
| `FilterSecurityInterceptor` | URL별 권한 규칙을 확인하여 인가 처리 |

실제로 Spring Security는 수십 개의 필터를 제공하지만, 대부분의 애플리케이션에서는 위 5개 필터가 핵심 역할을 담당한다.

---

## Spring Authentication 작동 원리

### 인증 과정

Spring 어플리케이션 내에서 사용자가 시스템에 접근하기 위해서는 인증 과정을 우선 거쳐야 한다.

- **사용자 정보 입력**

  - 클라이언트가 서버에 로그인 요청을 보내면, 사용자는 이메일과 비밀번호와 같은 자격 증명을 입력한다.

- **인증 프로세스 시작**

  - 서버에서는 입력된 자격 증명을 바탕으로 사용자를 인증하려고 시도한다.
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

- **인증(Authentication):** '_누구인지_'를 아는 프로세스를 의미
- **인가(Authorization):** '_무엇을 할 수 있는지_'를 결정

- 두 용어는 종종 혼용되지만 명확히 구분할 필요가 있다.
- 애플리케이션 설계 시 두 개념을 정확히 이해하고 구현해야 한다.

---

## Spring Security 6.x 설정 방법 (Lambda DSL)

Spring Boot 3.x부터는 Spring Security 6.x가 기본으로 사용된다. 기존에 널리 사용되던 `WebSecurityConfigurerAdapter`는 **deprecated** 처리되어 더 이상 사용을 권장하지 않는다. 대신 `SecurityFilterChain`을 Bean으로 직접 등록하는 방식과 Lambda DSL을 사용해야 한다.

### 기존 방식 (Spring Security 5.x, deprecated)

```java
// 더 이상 사용하지 말 것
@Configuration
@EnableWebSecurity
public class OldSecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .authorizeRequests()
                .antMatchers("/public/**").permitAll()
                .anyRequest().authenticated()
            .and()
            .formLogin()
                .loginPage("/login")
                .permitAll();
    }
}
```

### 새로운 방식 (Spring Security 6.x, Lambda DSL)

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/public/**", "/api/auth/**").permitAll()
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // JWT 사용 시
            )
            .csrf(csrf -> csrf.disable()) // REST API는 CSRF 비활성화
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

Lambda DSL 방식의 핵심 변화점은 다음과 같다.

- `antMatchers` → `requestMatchers`로 변경
- `.and()` 체이닝 대신 각 설정을 람다 블록으로 독립적으로 작성
- `http.build()`를 명시적으로 호출하여 `SecurityFilterChain` 반환

---

## 비밀번호 인코딩: BCryptPasswordEncoder

평문 비밀번호를 그대로 데이터베이스에 저장하는 것은 심각한 보안 취약점이다. Spring Security는 `PasswordEncoder` 인터페이스를 통해 다양한 해시 알고리즘을 지원하며, 실무에서는 **BCrypt**가 가장 널리 사용된다.

BCrypt는 단방향 해시 함수로, 같은 비밀번호를 인코딩해도 매번 다른 해시값이 생성된다. 내부적으로 랜덤 솔트(Salt)를 포함하기 때문에 레인보우 테이블 공격에 강하다.

```java
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // 회원가입: 비밀번호 해싱 후 저장
    public User register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
        }

        User user = User.builder()
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword())) // 해싱
            .role(Role.USER)
            .build();

        return userRepository.save(user);
    }

    // 로그인: 입력값과 해시값 비교
    public boolean verifyPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
        // matches() 내부에서 솔트 추출 후 재해싱하여 비교
    }
}
```

`BCryptPasswordEncoder`의 생성자에는 `strength` 파라미터(기본값 10)를 전달할 수 있다. 값이 클수록 해싱에 걸리는 시간이 늘어나 브루트포스 공격에 더 강해지지만, 로그인 처리 성능은 저하된다. 실무에서는 10~12가 적절하다.

```java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder(12); // strength 12
}
```

---

## JWT (JSON Web Token) 기반 인증

### JWT란?

JWT는 당사자 간에 정보를 JSON 형태로 안전하게 전달하기 위한 개방형 표준(RFC 7519)이다. 세션 기반 인증과 달리 서버가 상태를 저장하지 않아도 되므로, 마이크로서비스 아키텍처나 수평 확장이 필요한 환경에서 특히 유용하다.

### JWT 구조

JWT는 점(`.`)으로 구분된 세 부분으로 구성된다.

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyQGV4YW1wbGUuY29tIiwicm9sZXMiOlsiUk9MRV9VU0VSIl0sImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxNzAwMDA3MjAwfQ.abc123signature
```

| 구성 요소 | 설명 | 예시 |
|---|---|---|
| **Header** | 알고리즘과 토큰 타입 | `{"alg": "HS256", "typ": "JWT"}` |
| **Payload** | 클레임(사용자 정보, 만료 시간 등) | `{"sub": "user@example.com", "exp": 1700007200}` |
| **Signature** | Header + Payload를 비밀키로 서명 | `HMACSHA256(base64(header) + "." + base64(payload), secret)` |

Header와 Payload는 Base64URL로 인코딩되어 있어 누구나 디코딩할 수 있다. 따라서 **Payload에 비밀번호나 민감한 정보를 절대 담지 말아야 한다.** Signature는 서버만 알고 있는 비밀키로 생성되므로, 위변조 여부를 검증하는 데 사용된다.

### 의존성 추가

```xml
<!-- pom.xml -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.3</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.12.3</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.12.3</version>
    <scope>runtime</scope>
</dependency>
```

### JWT 유틸리티 클래스

```java
@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.access-token-validity}")
    private long accessTokenValidityMs; // 예: 3600000 (1시간)

    @Value("${jwt.refresh-token-validity}")
    private long refreshTokenValidityMs; // 예: 604800000 (7일)

    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // Access Token 발급
    public String generateAccessToken(UserDetails userDetails) {
        return generateToken(userDetails, accessTokenValidityMs);
    }

    // Refresh Token 발급
    public String generateRefreshToken(UserDetails userDetails) {
        return generateToken(userDetails, refreshTokenValidityMs);
    }

    private String generateToken(UserDetails userDetails, long validityMs) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", userDetails.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .collect(Collectors.toList()));

        return Jwts.builder()
            .claims(claims)
            .subject(userDetails.getUsername())
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + validityMs))
            .signWith(getSigningKey())
            .compact();
    }

    // 토큰에서 사용자명 추출
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // 토큰 만료 여부 확인
    public boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }

    // 토큰 유효성 검증
    public boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = Jwts.parser()
            .verifyWith(getSigningKey())
            .build()
            .parseSignedClaims(token)
            .getPayload();
        return claimsResolver.apply(claims);
    }
}
```

### JwtAuthenticationFilter 구현

매 요청마다 Authorization 헤더에서 JWT를 추출하고 검증하는 필터이다. 이 필터를 `UsernamePasswordAuthenticationFilter` 앞에 배치하면, 토큰 기반 인증이 폼 로그인보다 먼저 처리된다.

```java
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        // Bearer 토큰이 없으면 다음 필터로 패스
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = authHeader.substring(7); // "Bearer " 이후의 토큰 문자열
        String username = null;

        try {
            username = jwtTokenProvider.extractUsername(jwt);
        } catch (ExpiredJwtException e) {
            // 만료된 토큰 처리
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\": \"Token expired\"}");
            return;
        } catch (JwtException e) {
            // 위변조 또는 잘못된 토큰
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\": \"Invalid token\"}");
            return;
        }

        // SecurityContext에 인증 정보가 없는 경우에만 처리 (중복 처리 방지)
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            if (jwtTokenProvider.validateToken(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                    );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);
    }
}
```

### 토큰 발급 및 갱신 엔드포인트

```java
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenRepository refreshTokenRepository;

    // 로그인: Access Token + Refresh Token 발급
    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@RequestBody @Valid LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String accessToken = jwtTokenProvider.generateAccessToken(userDetails);
        String refreshToken = jwtTokenProvider.generateRefreshToken(userDetails);

        // Refresh Token은 DB에 저장 (탈취 시 무효화 가능)
        refreshTokenRepository.save(RefreshToken.builder()
            .token(refreshToken)
            .userEmail(userDetails.getUsername())
            .expiresAt(LocalDateTime.now().plusDays(7))
            .build());

        return ResponseEntity.ok(new TokenResponse(accessToken, refreshToken));
    }

    // Access Token 갱신
    @PostMapping("/refresh")
    public ResponseEntity<TokenResponse> refresh(@RequestBody RefreshRequest request) {
        String refreshToken = request.getRefreshToken();

        // DB에서 Refresh Token 검증
        RefreshToken savedToken = refreshTokenRepository.findByToken(refreshToken)
            .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 Refresh Token입니다."));

        if (savedToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            refreshTokenRepository.delete(savedToken);
            throw new IllegalArgumentException("만료된 Refresh Token입니다. 재로그인이 필요합니다.");
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(savedToken.getUserEmail());
        String newAccessToken = jwtTokenProvider.generateAccessToken(userDetails);

        return ResponseEntity.ok(new TokenResponse(newAccessToken, refreshToken));
    }

    // 로그아웃: Refresh Token 무효화
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestBody RefreshRequest request) {
        refreshTokenRepository.deleteByToken(request.getRefreshToken());
        return ResponseEntity.noContent().build();
    }
}
```

`application.yml` 설정:

```yaml
jwt:
  secret: your-256-bit-base64-encoded-secret-key-here
  access-token-validity: 3600000    # 1시간 (밀리초)
  refresh-token-validity: 604800000 # 7일 (밀리초)
```

---

## OAuth2 소셜 로그인 연동

### OAuth2란?

OAuth2는 사용자가 자신의 자격 증명을 직접 제공하지 않고, 구글·카카오·네이버 등의 외부 서비스를 통해 인증할 수 있도록 해주는 개방형 표준이다. Spring Security는 `spring-security-oauth2-client` 모듈을 통해 이를 간단하게 연동할 수 있도록 지원한다.

### OAuth2 소셜 로그인 전체 흐름

```mermaid
flowchart TD
    A[사용자: 구글로 로그인 클릭] --> B[Spring Security:\nOAuth2AuthorizationRequestRedirectFilter]
    B --> C[구글 로그인 페이지로 리다이렉트\nclient_id, redirect_uri, scope 포함]
    C --> D[사용자: 구글 계정으로 로그인]
    D --> E[구글: 인증 코드 Authorization Code 발급]
    E --> F[Spring Security:\nOAuth2LoginAuthenticationFilter\n/login/oauth2/code/google 수신]
    F --> G[Spring Security:\n구글에 Authorization Code로\nAccess Token 교환 요청]
    G --> H[구글: Access Token 반환]
    H --> I[Spring Security:\nAccess Token으로 사용자 정보 요청\nGoogle UserInfo API]
    I --> J[구글: 이름, 이메일, 프로필 사진 반환]
    J --> K[CustomOAuth2UserService.loadUser\nDB에서 사용자 조회 또는 신규 생성]
    K --> L[SecurityContextHolder에 OAuth2User 저장]
    L --> M[OAuth2AuthenticationSuccessHandler\nJWT 발급 후 프론트엔드로 리다이렉트]
```

### 의존성 추가

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-oauth2-client</artifactId>
</dependency>
```

### application.yml 설정

```yaml
spring:
  security:
    oauth2:
      client:
        registration:
          google:
            client-id: ${GOOGLE_CLIENT_ID}
            client-secret: ${GOOGLE_CLIENT_SECRET}
            scope:
              - email
              - profile
          kakao:
            client-id: ${KAKAO_CLIENT_ID}
            client-secret: ${KAKAO_CLIENT_SECRET}
            client-authentication-method: client_secret_post
            authorization-grant-type: authorization_code
            redirect-uri: "{baseUrl}/login/oauth2/code/kakao"
            scope:
              - profile_nickname
              - account_email
        provider:
          kakao:
            authorization-uri: https://kauth.kakao.com/oauth/authorize
            token-uri: https://kauth.kakao.com/oauth/token
            user-info-uri: https://kapi.kakao.com/v2/user/me
            user-name-attribute: id
```

### CustomOAuth2UserService 구현

Spring Security가 OAuth2 제공자로부터 사용자 정보를 받아온 후 호출하는 서비스이다. 이 클래스에서 사용자를 DB에 저장하거나 기존 사용자와 연동하는 로직을 구현한다.

```java
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        OAuth2UserInfo userInfo = extractUserInfo(registrationId, oAuth2User.getAttributes());

        User user = userRepository.findByEmail(userInfo.getEmail())
            .map(existingUser -> existingUser.updateOAuthInfo(userInfo.getName()))
            .orElseGet(() -> User.builder()
                .email(userInfo.getEmail())
                .name(userInfo.getName())
                .provider(registrationId)
                .role(Role.USER)
                .build());

        userRepository.save(user);

        return new DefaultOAuth2User(
            Collections.singleton(new SimpleGrantedAuthority(user.getRole().name())),
            oAuth2User.getAttributes(),
            userRequest.getClientRegistration()
                .getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName()
        );
    }

    private OAuth2UserInfo extractUserInfo(String provider, Map<String, Object> attributes) {
        return switch (provider) {
            case "google" -> new GoogleUserInfo(attributes);
            case "kakao"  -> new KakaoUserInfo(attributes);
            default -> throw new OAuth2AuthenticationException("지원하지 않는 OAuth2 제공자: " + provider);
        };
    }
}
```

### OAuth2 성공 핸들러 (JWT 발급)

소셜 로그인 성공 후 JWT를 발급하여 프론트엔드로 전달하는 핸들러이다.

```java
@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler
        extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

    @Value("${app.oauth2.redirect-uri}")
    private String redirectUri;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = (String) oAuth2User.getAttributes().get("email");

        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다."));

        UserDetails userDetails = new CustomUserDetails(user);
        String accessToken = jwtTokenProvider.generateAccessToken(userDetails);
        String refreshToken = jwtTokenProvider.generateRefreshToken(userDetails);

        // 프론트엔드로 토큰을 쿼리 파라미터로 전달 (실무에서는 HttpOnly 쿠키 권장)
        String targetUrl = UriComponentsBuilder.fromUriString(redirectUri)
            .queryParam("access_token", accessToken)
            .queryParam("refresh_token", refreshToken)
            .build().toUriString();

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
```

### SecurityConfig에 OAuth2 설정 추가

```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/", "/login/**", "/api/auth/**").permitAll()
            .anyRequest().authenticated()
        )
        .oauth2Login(oauth2 -> oauth2
            .userInfoEndpoint(userInfo -> userInfo
                .userService(customOAuth2UserService)
            )
            .successHandler(oAuth2AuthenticationSuccessHandler)
            .failureHandler((request, response, exception) -> {
                response.sendRedirect("/login?error=oauth2");
            })
        )
        .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

    return http.build();
}
```

---

## 세션 기반 vs JWT 기반 인증 비교

두 방식은 각각 장단점이 있으며, 프로젝트의 아키텍처와 요구사항에 따라 선택해야 한다.

| 항목 | 세션 기반 인증 | JWT 기반 인증 |
|---|---|---|
| **상태 저장** | 서버 메모리/Redis에 세션 저장 (Stateful) | 서버 무상태 (Stateless) |
| **확장성** | 서버 증설 시 세션 공유 필요 (Redis 등) | 토큰 자체에 정보 포함, 서버 간 공유 불필요 |
| **토큰 무효화** | 세션 삭제만으로 즉시 로그아웃 가능 | 만료 전 강제 무효화 어려움 (블랙리스트 필요) |
| **저장 위치** | 서버 세션 + 브라우저 쿠키 (Session ID) | 클라이언트 (localStorage 또는 HttpOnly 쿠키) |
| **보안 위협** | CSRF 공격에 취약 (CSRF 토큰으로 방어) | XSS 공격에 취약 (HttpOnly 쿠키로 완화) |
| **네트워크 부하** | Session ID만 전송 (가벼움) | 토큰 크기만큼 매 요청마다 전송 |
| **적합한 환경** | 전통적인 MVC 웹 애플리케이션 | REST API, 마이크로서비스, 모바일 앱 |
| **구현 복잡도** | Spring Security 기본 제공으로 단순 | 토큰 발급/검증/갱신 로직 직접 구현 필요 |

### 선택 기준

- **세션 기반**: 단일 서버 배포, 즉각적인 로그아웃이 중요한 경우, 전통적인 서버 사이드 렌더링
- **JWT 기반**: REST API 서버, 멀티 서버/마이크로서비스, 모바일 앱과의 통신, OAuth2 연동

---

## CSRF 및 CORS 설정

### CSRF (Cross-Site Request Forgery)

CSRF는 인증된 사용자의 브라우저를 통해 악의적인 요청을 보내는 공격이다. Spring Security는 기본적으로 CSRF 방어를 활성화한다.

**REST API (Stateless)** 의 경우, 세션 쿠키를 사용하지 않기 때문에 CSRF 공격이 의미 없으며 비활성화하는 것이 일반적이다.

```java
// REST API - CSRF 비활성화
http.csrf(csrf -> csrf.disable());

// 전통적인 웹 앱 - CSRF 활성화 (기본값)
http.csrf(csrf -> csrf
    .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
);
```

### CORS (Cross-Origin Resource Sharing)

프론트엔드(예: `http://localhost:3000`)와 백엔드(예: `http://localhost:8080`)가 분리된 환경에서는 CORS 설정이 필수다.

```java
@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // 허용할 출처 (프로덕션에서는 실제 도메인만 지정)
        configuration.setAllowedOrigins(List.of(
            "http://localhost:3000",
            "https://your-frontend-domain.com"
        ));

        // 허용할 HTTP 메서드
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));

        // 허용할 헤더
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With"));

        // 인증 정보(쿠키 등) 포함 허용
        configuration.setAllowCredentials(true);

        // Preflight 결과 캐시 시간 (초)
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

SecurityFilterChain에 CORS 적용:

```java
http.cors(cors -> cors.configurationSource(corsConfigurationSource()));
```

> **중요**: Spring Security의 CORS 설정과 `@CrossOrigin` 어노테이션이 충돌할 수 있다. Spring Security 필터가 먼저 실행되므로, CORS 설정은 반드시 Security 레벨에서 처리해야 한다.

---

## 발생 가능한 문제 분석 및 오류 해결 방법 [^2]

### 잘못된 사용자 입력 처리

사용자가 제공하는 정보는 종종 부정확할 수 있다. 애플리케이션이 잘못된 입력을 감지하고, 명확한 에러 메시지를 사용자에게 제공해야 한다.

**해결 방법**

유효성 검사(validation)를 도입해야 한다. Java에서는 `jakarta.validation.constraints` 패키지(Spring Boot 3.x 기준)를 사용하여 쉽게 유효성 검사를 설정할 수 있다.

```java
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class LoginRequest {
    @NotBlank(message = "이메일은 필수 입력 사항입니다.")
    @Email(message = "이메일 형식이 잘못되었습니다.")
    private String email;

    @NotBlank(message = "비밀번호는 필수 입력 사항입니다.")
    @Size(min = 8, message = "비밀번호는 8자 이상이어야 합니다.")
    private String password;
}
```

컨트롤러에서 `@Valid` 어노테이션으로 검증을 활성화하고, 전역 예외 핸들러로 에러 응답을 일관성 있게 반환한다.

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationErrors(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
            errors.put(error.getField(), error.getDefaultMessage())
        );
        return ResponseEntity.badRequest().body(errors);
    }
}
```

### 서버 오류 진단

서버에서 발생하는 오류는 사용자가 직접 해결하기 어려운 문제이다. 예를 들어, 데이터베이스 연결 오류가 발생하면 서버는 더 이상 요청을 처리할 수 없다.

**해결 방법**

예외 처리를 통해 이러한 오류를 포착하고, 오류 발생 시 해당 오류를 로그에 기록해야 한다.

```java
try {
  // 데이터베이스 연결 시도
  connectToDatabase();
} catch (DatabaseConnectionException e) {
  log.error("데이터베이스 연결에 실패했습니다: {}", e.getMessage());
  throw new ServerException("서버 오류가 발생했습니다. 나중에 다시 시도해주세요.");
}
```

### 인증 실패 오류

사용자의 잘못된 자격 증명, 비정상적인 `AuthenticationManager` 설정, 또는 비밀번호가 평문으로 저장된 경우 등에서 발생한다.

**해결 방법**

```java
log.info("Login attempt for user: {}", user.getEmail());

try {
  Authentication authentication = authenticationManager.authenticate(
    new UsernamePasswordAuthenticationToken(
      user.getEmail(), user.getPassword()));
  log.info("Authentication successful for user: {}", user.getEmail());
} catch (BadCredentialsException e) {
  log.error("Authentication failed: {}", e.getMessage());
  throw new BadCredentialsException("이메일 또는 비밀번호가 올바르지 않습니다.");
} catch (DisabledException e) {
  throw new DisabledException("비활성화된 계정입니다. 관리자에게 문의하세요.");
}
```

### SecurityContextHolder 설정 문제

인증이 성공했음에도 불구하고 `SecurityContextHolder`에 인증 정보가 저장되지 않아서 이후의 보안 관련 작업이 실패하는 경우가 있다. 보통 `SecurityContextHolder`를 올바르게 구성하지 않았거나, 인증 후 응답이 반환되기 전에 컨텍스트가 초기화되었을 때 발생한다.

**해결 방법**

`SecurityContextHolder.getContext().setAuthentication(authentication);` 호출이 올바르게 이루어졌는지, 그리고 이 호출 후 컨텍스트가 다른 곳에서 초기화되지 않았는지 확인해야 한다.

### 비동기 처리에서의 인증 문제

비동기 요청 처리 중 인증 정보가 제대로 전달되지 않거나 손실되는 경우가 있다. Spring Security는 기본적으로 `스레드 로컬(ThreadLocal)`을 사용하여 `SecurityContext`를 관리하므로, 비동기 환경에서는 인증 정보가 스레드 간에 올바르게 전달되지 않을 수 있다.

**해결 방법**

`DelegatingSecurityContextExecutor`를 사용하여 비동기 환경에서도 `SecurityContext`가 전파되도록 설정한다.

```java
@Bean
public Executor taskExecutor() {
  return new DelegatingSecurityContextExecutor(new SimpleAsyncTaskExecutor());
}
```

---

## 실무에서 자주 발생하는 추가 오류들

### 401 Unauthorized vs 403 Forbidden

두 상태 코드는 모두 접근 거부를 나타내지만 의미가 다르다.

| 상태 코드 | 의미 | 발생 상황 | Spring Security 처리 클래스 |
|---|---|---|---|
| **401 Unauthorized** | 인증 정보 없음 또는 유효하지 않음 | 토큰 미포함, 만료, 위변조 | `AuthenticationEntryPoint` |
| **403 Forbidden** | 인증은 됐지만 권한 부족 | ROLE_USER로 ADMIN 전용 API 접근 | `AccessDeniedHandler` |

실무에서는 이 두 상태를 명확히 구분하여 클라이언트가 적절한 조치를 취할 수 있도록 해야 한다.

```java
@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException {
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.getWriter().write("""
            {"error": "UNAUTHORIZED", "message": "인증이 필요합니다."}
            """);
    }
}

@Component
public class CustomAccessDeniedHandler implements AccessDeniedHandler {

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response,
                       AccessDeniedException accessDeniedException) throws IOException {
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.getWriter().write("""
            {"error": "FORBIDDEN", "message": "접근 권한이 없습니다."}
            """);
    }
}
```

SecurityConfig에 핸들러 등록:

```java
http.exceptionHandling(exceptions -> exceptions
    .authenticationEntryPoint(customAuthenticationEntryPoint)
    .accessDeniedHandler(customAccessDeniedHandler)
);
```

### CORS 오류와 Spring Security

**증상**: 브라우저 개발자 도구에서 `Access-Control-Allow-Origin` 오류가 발생하거나, Preflight OPTIONS 요청이 401을 반환하는 경우다.

**원인**: Spring Security 필터가 CORS Preflight 요청을 가로채어 인증을 요구하는 경우, 브라우저가 실제 요청 전에 보내는 OPTIONS 요청이 인증 오류로 차단된다.

**해결 방법**: OPTIONS 요청을 명시적으로 허용하거나, Spring Security CORS 설정을 올바르게 적용한다.

```java
http
    .cors(cors -> cors.configurationSource(corsConfigurationSource()))
    .authorizeHttpRequests(auth -> auth
        // OPTIONS 요청은 인증 없이 허용
        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
        .anyRequest().authenticated()
    );
```

또한 `@CrossOrigin` 어노테이션과 Spring Security CORS 설정이 중복으로 적용되면 예상치 못한 동작이 발생할 수 있으므로, 한 곳에서만 설정하는 것을 권장한다.

### JWT 만료 처리

JWT는 만료되면 더 이상 유효하지 않지만, 클라이언트는 이를 인지하지 못할 수 있다. 실무에서는 Access Token과 Refresh Token을 분리하여 관리하는 것이 일반적이다.

| 시나리오 | 처리 방법 |
|---|---|
| Access Token 만료 | 401 응답 반환, 클라이언트가 Refresh Token으로 재발급 요청 |
| Refresh Token 만료 | 재로그인 유도 |
| Refresh Token 탈취 의심 | DB에서 해당 토큰 삭제 (즉시 무효화) |

```java
// JwtAuthenticationFilter에서 만료 처리
try {
    username = jwtTokenProvider.extractUsername(jwt);
} catch (ExpiredJwtException e) {
    // Access Token 만료: 클라이언트에게 갱신 필요 신호
    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
    response.setHeader("X-Token-Expired", "true"); // 커스텀 헤더로 만료 여부 전달
    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
    response.getWriter().write("""
        {"error": "TOKEN_EXPIRED", "message": "토큰이 만료되었습니다. 갱신이 필요합니다."}
        """);
    return;
}
```

클라이언트(예: React + Axios)에서는 Interceptor를 통해 이를 자동으로 처리할 수 있다.

```javascript
// Axios Interceptor 예시 (참고용)
axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401 &&
        error.response?.headers['x-token-expired']) {
      // Refresh Token으로 Access Token 자동 갱신
      const { data } = await axios.post('/api/auth/refresh', {
        refreshToken: localStorage.getItem('refreshToken')
      });
      // 새 토큰으로 원래 요청 재시도
      error.config.headers['Authorization'] = `Bearer ${data.accessToken}`;
      return axios(error.config);
    }
    return Promise.reject(error);
  }
);
```

---

## 보안 베스트 프랙티스 [^3] [^4]

보안성을 높이기 위해 개발자는 모범 사례를 준수해야 한다.

### 확인된 안전한 라이브러리 사용

항상 최근 버전의 라이브러리를 유지하고 알려진 취약점을 주기적으로 점검해야 한다. `spring-boot-starter-parent`를 사용하면 검증된 의존성 버전 조합을 자동으로 관리받을 수 있다.

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.4.0</version>
</parent>
```

### HTTP 보안 헤더 설정

Spring Security는 기본적으로 여러 보안 헤더를 자동으로 추가한다. 추가적인 설정이 필요한 경우 다음과 같이 구성할 수 있다.

```java
http.headers(headers -> headers
    .contentSecurityPolicy(csp -> csp
        .policyDirectives("script-src 'self'; object-src 'none'; base-uri 'self'")
    )
    .frameOptions(frame -> frame.deny()) // Clickjacking 방지
    .xssProtection(xss -> xss.disable()) // 모던 브라우저는 CSP로 대체
    .httpStrictTransportSecurity(hsts -> hsts
        .includeSubDomains(true)
        .maxAgeInSeconds(31536000) // 1년
    )
);
```

### 데이터 명령어 분리 (SQL 주입 방어)

데이터를 처리하는 부분과 명령어 수행 부분은 철저히 분산하여 SQL 주입 공격을 예방해야 한다. Spring Data JPA를 사용하면 대부분의 경우 자동으로 방어된다.

```java
// 안전: Spring Data JPA의 파라미터 바인딩
@Query("SELECT u FROM User u WHERE u.email = :email")
Optional<User> findByEmail(@Param("email") String email);

// 안전: PreparedStatement 사용
String query = "SELECT * FROM users WHERE email = ?";
PreparedStatement statement = connection.prepareStatement(query);
statement.setString(1, userEmail);
ResultSet resultSet = statement.executeQuery();

// 위험: 문자열 직접 연결 (절대 사용 금지)
// String query = "SELECT * FROM users WHERE email = '" + userEmail + "'";
```

### 민감한 정보 관리

비밀키, DB 패스워드, OAuth2 클라이언트 시크릿 등 민감한 정보는 절대 소스코드에 직접 포함하지 않는다.

```yaml
# 환경 변수 또는 AWS Secrets Manager, Vault 등을 통해 주입
jwt:
  secret: ${JWT_SECRET}

spring:
  security:
    oauth2:
      client:
        registration:
          google:
            client-id: ${GOOGLE_CLIENT_ID}
            client-secret: ${GOOGLE_CLIENT_SECRET}
```

### 계정 잠금 정책

무차별 대입 공격(Brute-force)을 방어하기 위해 일정 횟수 이상 로그인 실패 시 계정을 잠금하는 정책을 구현한다.

```java
@Service
@RequiredArgsConstructor
public class LoginAttemptService {

    private static final int MAX_ATTEMPT = 5;
    private final Map<String, Integer> attemptsCache = new ConcurrentHashMap<>();

    public void loginFailed(String email) {
        int attempts = attemptsCache.getOrDefault(email, 0);
        attemptsCache.put(email, attempts + 1);
    }

    public void loginSucceeded(String email) {
        attemptsCache.remove(email);
    }

    public boolean isBlocked(String email) {
        return attemptsCache.getOrDefault(email, 0) >= MAX_ATTEMPT;
    }
}
```

실제 운영 환경에서는 `attemptsCache`를 Redis로 대체하고, 잠금 해제 시간(TTL)을 설정하는 것이 좋다.

---

## 결론

이 글에서는 Spring Security의 Filter Chain 전체 동작 흐름부터 시작하여, JWT 기반 인증 구현, OAuth2 소셜 로그인 연동, Spring Security 6.x의 Lambda DSL 설정 방식, 그리고 실무에서 자주 마주치는 오류와 그 해결 방법까지 폭넓게 살펴보았다.

정리하면 다음과 같다.

- **Filter Chain**은 Spring Security의 심장부로, 요청이 컨트롤러에 도달하기 전에 인증과 인가를 처리한다.
- **JWT**는 Stateless 아키텍처에 적합하며, Access Token과 Refresh Token을 분리하여 보안성과 사용성을 균형 있게 유지해야 한다.
- **OAuth2**는 소셜 로그인을 간단하게 구현할 수 있게 해주며, `CustomOAuth2UserService`를 통해 자체 DB와 연동할 수 있다.
- **Spring Security 6.x**에서는 `WebSecurityConfigurerAdapter` 대신 Lambda DSL 방식을 사용해야 한다.
- **401과 403**의 차이를 명확히 구분하고, CORS와 CSRF 설정은 아키텍처에 맞게 적절히 구성해야 한다.

각 주제를 종합적으로 고려하여 안정적이고 효율적인 코드를 작성하길 바란다.

---

## 관련 글

- [🔐 OWASP Top 10:2025 완전 가이드](/owasp-top10-2025/) — 인증 실패(A07)를 포함한 웹 보안 취약점 전체 흐름 파악
- [🌐 OSI 7계층, 외우지 말고 이해하자](/osi-7-layers/) — 네트워크 계층에서 인증 패킷이 어떻게 흐르는지 이해
- [🚀 Spring Boot Render 배포 오류 완전 가이드](/spring-boot-render-error/) — 구현한 인증 시스템을 실제 서버에 배포하기

[^1]: Marco Behler - Spring Security: Authentication and Authorization In-Depth (https://www.marcobehler.com/guides/spring-security)
[^2]: Medium - Securing Spring Boot Applications: Best Practices and ... (https://medium.com/@shubhamvartak01/securing-spring-boot-applications-best-practices-and-strategies-3ab731f8b317)
[^3]: Spring - Getting Started | Securing a Web Application (https://spring.io/guides/gs/securing-web)
[^4]: Synopsys - Top 10 Spring Security Best Practices for Java Developers (https://www.synopsys.com/blogs/software-security/spring-security-best-practices.html)
