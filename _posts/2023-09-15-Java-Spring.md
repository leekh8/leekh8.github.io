---
categories: [Java]
tags: [java, spring]
img_path: /assets/lib/post-img/
mermaid: true
math: true
---

# Spring Framework

- 엔터프라이즈용 Java 애플리케이션 개발을 편하게 할 수 있도록 해주는 **오픈소스 경량급 애플리케이션 프레임워크**
- 개발 초기 기본적인 설정과 적용시킬 기술들만 잘 선택한다면, 기술보다 애플리케이션의 로직 자체에 더 집중하여 비즈니스 로직 구현 가능
- 우리나라 **전자정부 표준 프레임워크**의 기반 기술

## Spring의 특징

### POJO 프로그래밍 지향

- POJO
  - Plain Old Java Object
  - 순수 Java만을 이용해 생성한 객체
  - 다른 기술을 사용하지 않고 Java 및 Java의 스펙에 정의된 기술만 사용하는 것
- 순수 Java만을 사용해 만든 객체이므로 특정 기술이나 환경에 종속되지 않음
- 외부 기술이나 규약의 변화에 얽매이지 않아 보다 유연하게 변화와 확장에 대처 가능
- 객체지향 설계를 제한없이 적용 가능

#### IoC / DI

- Inversion of Control / Dependency Injection
- 제어 역전
- 사용할 객체를 직접 생성하지 않고 객체의 생명주기 관리를 외부에 위임
  - 외부: Spring Container or IoC Container
- 객체의 관리를 컨테이너에 맡겨 제어권이 넘어간 것
- 제어 역전을 통해 의존성 주입 가능

##### DI

- 의존성 주입
- 제어 역전의 방법 중 하나
- 사용할 객체를 직접 생성하지 않고 외부 컨테이너가 생성한 객체를 주입받아 사용하는 방식
  - 생성자를 통한 의존성 주입
  - 필드 객체 선언을 통한 의존성 주입
  - setter 메서드를 통한 의존성 주입
