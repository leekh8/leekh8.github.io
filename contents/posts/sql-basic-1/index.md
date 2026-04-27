---
title: "SQL 기초 완전 정리 1편: SELECT, WHERE, JOIN, GROUP BY 핵심 문법"
description: "SQL을 처음 배우는 분을 위한 기초 완전 가이드. 관계형 데이터베이스 구조, SELECT 문법부터 WHERE 조건, 집계 함수(COUNT, SUM, AVG), JOIN까지 실제 쿼리 예시로 배웁니다."
date: 2023-03-16
update: 2023-03-16
tags:
  - SQL
  - RDB
  - Database
  - Basic
series: "SQL Basic"
---

## 들어가며

데이터베이스를 처음 공부할 때 가장 먼저 마주치는 것이 SQL이다. "SQL을 안다"는 것은 단순히 쿼리 몇 줄을 외운다는 뜻이 아니다. 데이터가 어떻게 저장되고, 어떻게 꺼내오고, 어떻게 수정·삭제되는지 그 흐름 전체를 이해하는 것이다.

이 글에서는 SQL의 역사와 개념부터 시작해, 실무에서 가장 많이 쓰는 DDL·DML 구문을 실전 예제와 함께 정리한다. 예제는 처음에 만들어 두는 샘플 테이블(`employees`, `departments`)을 전체에 걸쳐 일관되게 사용하므로, 예제를 직접 실행해 보면서 따라오면 이해가 훨씬 빠를 것이다.

---

## 1. SQL이란? — 역사와 배경

### 1-1. SQL의 탄생

SQL(Structured Query Language)은 1970년대 IBM 연구소에서 탄생했다. Edgar F. Codd가 1970년에 관계형 데이터 모델 이론을 논문으로 발표하고, IBM이 이를 구현한 시스템을 SEQUEL(Structured English Query Language)이라고 불렀다. 이후 법적 문제로 이름이 SQL로 바뀌었고, 1979년 Oracle이 최초로 상용 RDBMS를 출시하면서 SQL은 산업 표준으로 자리 잡게 됐다.

1986년 ANSI(미국 국가표준원), 1987년 ISO(국제표준화기구)가 SQL을 공식 표준으로 채택하면서 각 DBMS 제품(MySQL, PostgreSQL, SQL Server, Oracle, SQLite)들이 표준 SQL을 기반으로 발전해 왔다. 물론 제품마다 방언(dialect)이 있어 완전히 동일하지는 않지만, 기본 문법은 거의 공통이다.

### 1-2. SQL이 왜 중요한가?

현대 소프트웨어 시스템에서 데이터는 가장 핵심적인 자산이다. 웹 서비스, 모바일 앱, ERP, 데이터 분석, 머신러닝 파이프라인 모두 어떤 형태로든 데이터베이스와 연결돼 있다. SQL은 이 데이터베이스와 대화하는 언어다.

- 백엔드 개발자라면 애플리케이션이 DB에 저장하고 꺼내오는 로직을 SQL로 작성한다.
- 데이터 분석가라면 수천만 행 데이터에서 인사이트를 뽑을 때 SQL을 사용한다.
- DevOps·운영자라면 DB 상태를 점검하거나 데이터 마이그레이션을 SQL로 처리한다.

즉, IT 직군을 막론하고 SQL은 기본 소양에 가깝다.

### 1-3. SQL vs. NoSQL

SQL은 관계형 데이터베이스(RDBMS)를 위한 언어고, NoSQL(MongoDB, Redis, Cassandra 등)은 관계형 구조를 벗어난 다양한 저장 방식을 통칭한다.

| 구분 | RDBMS (SQL) | NoSQL |
|---|---|---|
| 데이터 모델 | 테이블(행·열) | 문서, 키-값, 그래프 등 |
| 스키마 | 고정 스키마 | 유연한 스키마 |
| 트랜잭션 | ACID 보장 | 제품마다 다름 |
| 확장성 | 수직 확장 중심 | 수평 확장에 유리 |
| 대표 제품 | MySQL, PostgreSQL, Oracle | MongoDB, Redis, DynamoDB |

어느 쪽이 더 낫다기보다 요구사항에 따라 선택한다. 이 시리즈는 RDBMS와 SQL에 집중한다.

---

## 2. RDBMS 핵심 개념

SQL을 제대로 쓰려면 관계형 데이터베이스(RDBMS)가 데이터를 어떻게 구조화하는지 먼저 이해해야 한다.

### 2-1. 테이블, 행, 열

RDBMS는 데이터를 **테이블(table)** 로 저장한다. 테이블은 엑셀 시트처럼 생겼지만, 훨씬 엄격한 규칙을 가진다.

- **테이블(Table)**: 같은 주제에 관한 데이터의 집합. 예) `employees` 테이블은 직원 정보를 담는다.
- **행(Row / Record / Tuple)**: 테이블의 한 레코드. 예) 직원 한 명의 정보.
- **열(Column / Attribute / Field)**: 테이블의 한 속성. 예) `name`, `salary`, `hire_date`.

```
employees 테이블

| emp_id | name     | dept_id | salary  | hire_date  |
|--------|----------|---------|---------|------------|
|      1 | 김민준   |       1 | 5500000 | 2020-03-15 |
|      2 | 이서연   |       2 | 6200000 | 2019-07-22 |
|      3 | 박지훈   |       1 | 4800000 | 2021-11-01 |
|      4 | 최수아   |       3 | 7100000 | 2018-05-10 |
|      5 | 정도현   |       2 | 5900000 | 2022-01-30 |
```

### 2-2. 기본키(Primary Key)

기본키는 테이블에서 각 행을 유일하게 식별하는 열(또는 열의 조합)이다.

**특징:**
- NULL이 될 수 없다.
- 중복 값이 허용되지 않는다.
- 테이블당 하나만 존재한다.

`employees` 테이블에서 `emp_id`가 기본키다. 두 직원이 동명이인일 수 있지만 `emp_id`는 항상 유일하다.

### 2-3. 외래키(Foreign Key)

외래키는 다른 테이블의 기본키를 참조하는 열이다. 이를 통해 테이블 간의 관계(Relation)를 표현한다.

```
departments 테이블

| dept_id | dept_name   | location |
|---------|-------------|----------|
|       1 | 개발팀      | 서울     |
|       2 | 마케팅팀    | 부산     |
|       3 | 경영지원팀  | 서울     |
```

`employees.dept_id`는 `departments.dept_id`를 참조하는 외래키다. 이 관계 덕분에 "개발팀 직원 목록"처럼 두 테이블을 연결하는 질의가 가능해진다.

**외래키의 역할:**
- **참조 무결성(Referential Integrity)** 보장: 존재하지 않는 부서에 직원을 배치할 수 없다.
- 데이터 중복 방지: 부서 이름을 직원마다 반복하는 대신, 부서 ID만 저장하면 된다.

### 2-4. 스키마(Schema)

스키마는 데이터베이스의 구조 설계도다. 어떤 테이블이 있고, 각 테이블에 어떤 열이 있으며, 어떤 관계로 연결되는지를 정의한다. 물리적으로는 테이블 정의(CREATE TABLE 문)의 집합이다.

### 2-5. 인덱스(Index)

인덱스는 책의 색인처럼 특정 열의 값을 빠르게 찾기 위한 자료구조다. 기본키에는 자동으로 인덱스가 생성된다. 자주 검색하는 열에 인덱스를 추가하면 조회 속도가 크게 향상된다. 단, 인덱스는 저장 공간을 사용하고 INSERT/UPDATE/DELETE 시 오버헤드가 있으므로 무작정 추가하면 안 된다.

---

## 3. SQL 분류: DDL, DML, DCL, TCL

SQL 명령어는 목적에 따라 네 가지로 분류된다.

### 3-1. DDL (Data Definition Language) — 데이터 정의

데이터베이스의 구조(스키마)를 정의하거나 변경하는 명령어다.

| 명령어 | 설명 |
|--------|------|
| `CREATE` | 테이블, 데이터베이스, 인덱스 등을 생성 |
| `ALTER` | 기존 구조를 변경 |
| `DROP` | 구조와 데이터를 함께 삭제 |
| `TRUNCATE` | 테이블 구조는 유지하면서 모든 데이터 삭제 |
| `RENAME` | 이름 변경 |

DDL은 자동으로 커밋(COMMIT)된다. 즉, 실행하면 즉시 반영되고 롤백(ROLLBACK)이 불가능하다.

### 3-2. DML (Data Manipulation Language) — 데이터 조작

테이블의 데이터를 조회하거나 변경하는 명령어다.

| 명령어 | 설명 |
|--------|------|
| `SELECT` | 데이터 조회 |
| `INSERT` | 데이터 삽입 |
| `UPDATE` | 데이터 수정 |
| `DELETE` | 데이터 삭제 |

DML은 트랜잭션 내에서 실행되므로 COMMIT 전에 ROLLBACK으로 취소할 수 있다.

### 3-3. DCL (Data Control Language) — 데이터 제어

데이터베이스 접근 권한을 관리하는 명령어다.

| 명령어 | 설명 |
|--------|------|
| `GRANT` | 권한 부여 |
| `REVOKE` | 권한 회수 |

### 3-4. TCL (Transaction Control Language) — 트랜잭션 제어

DML로 변경한 내용을 확정하거나 취소하는 명령어다.

| 명령어 | 설명 |
|--------|------|
| `COMMIT` | 변경사항 확정 |
| `ROLLBACK` | 변경사항 취소 (마지막 COMMIT 이후 상태로 복구) |
| `SAVEPOINT` | 특정 지점을 저장해 부분 롤백 가능하게 함 |

---

## 4. DDL: 테이블 정의와 관리

### 4-1. 샘플 테이블 생성

이 글 전체에서 사용할 샘플 테이블을 먼저 만든다.

```sql
-- 부서 테이블
CREATE TABLE departments (
    dept_id   INT           NOT NULL AUTO_INCREMENT,
    dept_name VARCHAR(50)   NOT NULL,
    location  VARCHAR(100),
    PRIMARY KEY (dept_id)
);

-- 직원 테이블
CREATE TABLE employees (
    emp_id    INT           NOT NULL AUTO_INCREMENT,
    name      VARCHAR(100)  NOT NULL,
    dept_id   INT,
    salary    DECIMAL(10, 0),
    hire_date DATE,
    email     VARCHAR(200),
    PRIMARY KEY (emp_id),
    FOREIGN KEY (dept_id) REFERENCES departments(dept_id)
);
```

**주요 데이터 타입:**

| 타입 | 설명 | 예시 |
|------|------|------|
| `INT` | 정수 | 나이, ID |
| `BIGINT` | 큰 정수 | 게시글 수 |
| `DECIMAL(p,s)` | 고정 소수점 (p: 전체 자릿수, s: 소수 자릿수) | 금액 |
| `VARCHAR(n)` | 가변 길이 문자열 (최대 n자) | 이름, 이메일 |
| `CHAR(n)` | 고정 길이 문자열 | 성별 코드, 국가 코드 |
| `TEXT` | 긴 텍스트 | 게시글 내용 |
| `DATE` | 날짜 (YYYY-MM-DD) | 생년월일 |
| `DATETIME` | 날짜+시각 | 가입 시각 |
| `BOOLEAN` | 참/거짓 | 활성 여부 |

**주요 제약 조건:**

| 제약 조건 | 설명 |
|-----------|------|
| `NOT NULL` | NULL 허용 안 함 |
| `UNIQUE` | 중복 값 불허 |
| `PRIMARY KEY` | 기본키 (NOT NULL + UNIQUE) |
| `FOREIGN KEY` | 외래키, 다른 테이블 참조 |
| `DEFAULT` | 기본값 설정 |
| `CHECK` | 조건을 만족하는 값만 허용 |

### 4-2. 제약 조건 예제

```sql
-- 더 다양한 제약 조건을 적용한 테이블
CREATE TABLE employees_v2 (
    emp_id    INT           NOT NULL AUTO_INCREMENT,
    name      VARCHAR(100)  NOT NULL,
    email     VARCHAR(200)  NOT NULL UNIQUE,
    dept_id   INT,
    salary    DECIMAL(10, 0) DEFAULT 3000000,
    gender    CHAR(1)       CHECK (gender IN ('M', 'F')),
    hire_date DATE          NOT NULL DEFAULT (CURRENT_DATE),
    is_active BOOLEAN       NOT NULL DEFAULT TRUE,
    PRIMARY KEY (emp_id),
    FOREIGN KEY (dept_id) REFERENCES departments(dept_id)
        ON DELETE SET NULL  -- 부서 삭제 시 dept_id를 NULL로
        ON UPDATE CASCADE   -- 부서 ID 변경 시 따라서 변경
);
```

`ON DELETE`와 `ON UPDATE`는 참조하는 부모 레코드가 삭제되거나 변경될 때 자식 레코드를 어떻게 처리할지를 결정한다.

- `CASCADE`: 같이 삭제/변경
- `SET NULL`: NULL로 설정
- `RESTRICT`: 부모 삭제/변경을 막음 (기본값)
- `NO ACTION`: RESTRICT와 유사

### 4-3. ALTER TABLE — 테이블 구조 변경

이미 운영 중인 테이블에 열을 추가하거나 변경해야 할 때 `ALTER TABLE`을 사용한다.

```sql
-- 열 추가
ALTER TABLE employees
ADD COLUMN phone VARCHAR(20);

-- 열 이름 변경 (MySQL)
ALTER TABLE employees
RENAME COLUMN phone TO phone_number;

-- 열 타입 변경
ALTER TABLE employees
MODIFY COLUMN phone_number VARCHAR(30);

-- 열 삭제
ALTER TABLE employees
DROP COLUMN phone_number;

-- 제약 조건 추가
ALTER TABLE employees
ADD CONSTRAINT uq_email UNIQUE (email);

-- 제약 조건 삭제
ALTER TABLE employees
DROP INDEX uq_email;

-- 테이블 이름 변경
ALTER TABLE employees RENAME TO staff;
-- 다시 원래대로
ALTER TABLE staff RENAME TO employees;
```

### 4-4. DROP TABLE과 TRUNCATE TABLE

```sql
-- 테이블 완전 삭제 (구조 + 데이터 모두)
DROP TABLE employees;

-- 외래키가 있는 경우 참조하는 테이블부터 삭제
DROP TABLE employees;       -- 먼저 자식 테이블 삭제
DROP TABLE departments;     -- 그다음 부모 테이블 삭제

-- 테이블 구조는 유지, 데이터만 전체 삭제 (롤백 불가)
TRUNCATE TABLE employees;
```

> **주의:** `DROP TABLE`과 `TRUNCATE TABLE`은 DDL이므로 자동 커밋된다. 실수로 실행했다면 복구가 어렵다. 프로덕션 환경에서는 반드시 백업 후 실행할 것.

---

## 5. 샘플 데이터 INSERT

예제 실행을 위해 샘플 데이터를 먼저 넣어 두자.

```sql
-- 부서 데이터
INSERT INTO departments (dept_name, location) VALUES
    ('개발팀',      '서울'),
    ('마케팅팀',    '부산'),
    ('경영지원팀',  '서울'),
    ('데이터팀',    '서울'),
    ('영업팀',      '대구');

-- 직원 데이터
INSERT INTO employees (name, dept_id, salary, hire_date, email) VALUES
    ('김민준', 1, 5500000, '2020-03-15', 'minjun.kim@company.com'),
    ('이서연', 2, 6200000, '2019-07-22', 'seoyeon.lee@company.com'),
    ('박지훈', 1, 4800000, '2021-11-01', 'jihoon.park@company.com'),
    ('최수아', 3, 7100000, '2018-05-10', 'sua.choi@company.com'),
    ('정도현', 2, 5900000, '2022-01-30', 'dohyun.jung@company.com'),
    ('강하은', 4, 6800000, '2020-09-14', 'haeun.kang@company.com'),
    ('윤재원', 1, 5200000, '2021-06-07', 'jaewon.yoon@company.com'),
    ('임수진', 4, 7300000, '2017-12-20', 'sujin.lim@company.com'),
    ('한지민', 5, 4500000, '2023-03-01', 'jimin.han@company.com'),
    ('오승현', NULL, 5000000, '2023-08-15', 'seunghyun.oh@company.com');
```

`오승현`은 아직 부서 배정이 되지 않은 상태다. `dept_id`가 NULL인 이 레코드가 나중에 유용한 예제로 활용된다.

---

## 6. DML: SELECT — 데이터 조회

SELECT는 SQL에서 가장 많이 사용하는 명령어다. 복잡한 조건을 조합해 원하는 데이터만 정확하게 꺼내오는 것이 SQL 실력의 핵심이다.

### 6-1. 기본 SELECT

```sql
-- 모든 열 조회
SELECT * FROM employees;

-- 특정 열만 조회
SELECT emp_id, name, salary FROM employees;

-- 열에 별칭(alias) 붙이기
SELECT
    emp_id    AS 사번,
    name      AS 이름,
    salary    AS 급여
FROM employees;

-- 중복 제거
SELECT DISTINCT dept_id FROM employees;

-- 계산식 사용
SELECT
    name,
    salary,
    salary * 12 AS annual_salary
FROM employees;
```

### 6-2. WHERE 절 — 조건 필터링

#### 비교 연산자

```sql
-- 급여가 6,000,000 이상인 직원
SELECT name, salary FROM employees WHERE salary >= 6000000;

-- 개발팀(dept_id = 1)이 아닌 직원
SELECT name, dept_id FROM employees WHERE dept_id != 1;
-- 또는
SELECT name, dept_id FROM employees WHERE dept_id <> 1;
```

#### 논리 연산자 AND, OR, NOT

```sql
-- 개발팀이면서 급여 5,000,000 이상
SELECT name, dept_id, salary
FROM employees
WHERE dept_id = 1 AND salary >= 5000000;

-- 마케팅팀 또는 데이터팀
SELECT name, dept_id
FROM employees
WHERE dept_id = 2 OR dept_id = 4;

-- 개발팀이 아닌 직원
SELECT name, dept_id
FROM employees
WHERE NOT dept_id = 1;
```

#### BETWEEN — 범위 조건

```sql
-- 급여가 5,000,000 이상 6,500,000 이하
SELECT name, salary
FROM employees
WHERE salary BETWEEN 5000000 AND 6500000;

-- 날짜 범위
SELECT name, hire_date
FROM employees
WHERE hire_date BETWEEN '2020-01-01' AND '2021-12-31';
```

`BETWEEN A AND B`는 A와 B를 포함한다 (경계값 포함).

#### IN — 목록 조건

```sql
-- 개발팀(1) 또는 마케팅팀(2) 또는 데이터팀(4)
SELECT name, dept_id
FROM employees
WHERE dept_id IN (1, 2, 4);

-- NOT IN: 해당 목록에 없는 것
SELECT name, dept_id
FROM employees
WHERE dept_id NOT IN (1, 2);
```

#### LIKE — 패턴 매칭

```sql
-- 이름이 '김'으로 시작하는 직원
SELECT name FROM employees WHERE name LIKE '김%';

-- 이름이 '현'으로 끝나는 직원
SELECT name FROM employees WHERE name LIKE '%현';

-- 이름에 '수'가 포함된 직원
SELECT name FROM employees WHERE name LIKE '%수%';

-- 이름이 정확히 3글자인 직원 (언더스코어 하나 = 문자 하나)
SELECT name FROM employees WHERE name LIKE '___';

-- 이메일 도메인이 company.com인 직원
SELECT name, email FROM employees WHERE email LIKE '%@company.com';
```

`%`는 0개 이상의 임의 문자, `_`는 정확히 1개의 임의 문자를 뜻한다.

#### IS NULL / IS NOT NULL

```sql
-- 부서가 배정되지 않은 직원
SELECT name, dept_id
FROM employees
WHERE dept_id IS NULL;

-- 부서가 배정된 직원
SELECT name, dept_id
FROM employees
WHERE dept_id IS NOT NULL;
```

> **흔한 실수:** `WHERE dept_id = NULL` 또는 `WHERE dept_id != NULL`은 동작하지 않는다. NULL 비교는 반드시 `IS NULL` / `IS NOT NULL`을 사용해야 한다.

### 6-3. ORDER BY — 정렬

```sql
-- 급여 오름차순 정렬 (기본값: ASC)
SELECT name, salary FROM employees ORDER BY salary;
SELECT name, salary FROM employees ORDER BY salary ASC;

-- 급여 내림차순 정렬
SELECT name, salary FROM employees ORDER BY salary DESC;

-- 다중 정렬: 부서 오름차순 → 급여 내림차순
SELECT name, dept_id, salary
FROM employees
ORDER BY dept_id ASC, salary DESC;

-- 열 인덱스로 정렬 (1부터 시작, 권장하지 않음)
SELECT name, salary FROM employees ORDER BY 2 DESC;
```

### 6-4. LIMIT / OFFSET — 행 수 제한

```sql
-- 상위 5명만 조회
SELECT name, salary FROM employees ORDER BY salary DESC LIMIT 5;

-- 6번째부터 5명 (페이지네이션)
SELECT name, salary FROM employees ORDER BY salary DESC LIMIT 5 OFFSET 5;

-- 급여 TOP 3
SELECT name, salary
FROM employees
ORDER BY salary DESC
LIMIT 3;
```

---

## 7. DML: INSERT — 데이터 삽입

### 7-1. 기본 INSERT

```sql
-- 모든 열에 값을 지정
INSERT INTO employees (name, dept_id, salary, hire_date, email)
VALUES ('홍길동', 1, 4500000, '2023-09-01', 'gildong.hong@company.com');

-- 열 목록 생략 (열 순서대로 모든 값 입력, 비권장)
INSERT INTO employees
VALUES (NULL, '홍길동', 1, 4500000, '2023-09-01', 'gildong2.hong@company.com');
-- NULL은 AUTO_INCREMENT가 자동으로 처리
```

### 7-2. 다중 행 INSERT

```sql
INSERT INTO departments (dept_name, location) VALUES
    ('법무팀', '서울'),
    ('인사팀', '서울'),
    ('구매팀', '인천');
```

한 번의 INSERT로 여러 행을 넣을 수 있다. 반복문으로 한 행씩 삽입하는 것보다 성능이 좋다.

### 7-3. SELECT 결과를 INSERT (INSERT INTO ... SELECT)

```sql
-- 다른 테이블에서 데이터를 복사할 때
INSERT INTO employees_archive (emp_id, name, dept_id, salary)
SELECT emp_id, name, dept_id, salary
FROM employees
WHERE hire_date < '2019-01-01';
```

---

## 8. DML: UPDATE — 데이터 수정

### 8-1. 기본 UPDATE

```sql
-- 특정 직원의 급여 수정
UPDATE employees
SET salary = 6000000
WHERE emp_id = 3;

-- 여러 열 동시 수정
UPDATE employees
SET salary   = 7000000,
    dept_id  = 4
WHERE name = '박지훈';
```

### 8-2. 조건부 UPDATE

```sql
-- 개발팀 직원 전체 급여 10% 인상
UPDATE employees
SET salary = salary * 1.1
WHERE dept_id = 1;

-- 급여가 5,000,000 미만인 직원을 5,000,000으로 조정
UPDATE employees
SET salary = 5000000
WHERE salary < 5000000;

-- 부서가 없는 직원을 경영지원팀으로 배정
UPDATE employees
SET dept_id = 3
WHERE dept_id IS NULL;
```

> **매우 중요한 주의사항:** `UPDATE`와 `DELETE`를 실행할 때는 반드시 WHERE 절을 확인하라. WHERE 절이 없으면 테이블의 모든 행이 수정/삭제된다.
>
> 안전한 습관: UPDATE/DELETE를 실행하기 전에 동일한 WHERE 조건으로 SELECT를 먼저 실행해 영향받는 행을 확인하라.

```sql
-- 먼저 대상 확인
SELECT * FROM employees WHERE dept_id IS NULL;

-- 확인 후 UPDATE 실행
UPDATE employees SET dept_id = 3 WHERE dept_id IS NULL;
```

---

## 9. DML: DELETE — 데이터 삭제

### 9-1. 기본 DELETE

```sql
-- 특정 직원 삭제
DELETE FROM employees WHERE emp_id = 11;

-- 조건부 삭제
DELETE FROM employees
WHERE hire_date > '2023-01-01' AND salary < 5000000;

-- 모든 행 삭제 (테이블 구조는 유지)
-- 주의: WHERE 없이 실행하면 모든 데이터 삭제
DELETE FROM employees;
```

### 9-2. TRUNCATE vs DELETE

```sql
-- TRUNCATE: 전체 삭제, DDL이라 롤백 불가, 속도 빠름
TRUNCATE TABLE employees;

-- DELETE: 조건부 삭제 가능, DML이라 롤백 가능, 속도 느림
DELETE FROM employees;  -- WHERE 없이 실행 = 전체 삭제
```

실수로 데이터를 지웠을 때 복구하려면 DELETE를 사용하고 커밋 전에 ROLLBACK해야 한다. TRUNCATE는 자동 커밋이라 복구할 수 없다.

---

## 10. 집계 함수와 GROUP BY

### 10-1. 집계 함수 기본

집계 함수는 여러 행을 하나의 결과값으로 줄인다.

```sql
-- 전체 직원 수
SELECT COUNT(*) AS 전체인원 FROM employees;

-- NULL이 아닌 dept_id 개수 (부서 배정된 직원 수)
SELECT COUNT(dept_id) AS 부서배정인원 FROM employees;

-- 급여 합계
SELECT SUM(salary) AS 급여총합 FROM employees;

-- 평균 급여
SELECT AVG(salary) AS 평균급여 FROM employees;

-- 최고/최저 급여
SELECT MAX(salary) AS 최고급여, MIN(salary) AS 최저급여 FROM employees;

-- 최근 입사일
SELECT MAX(hire_date) AS 최근입사일 FROM employees;

-- 가장 오래된 입사일
SELECT MIN(hire_date) AS 최초입사일 FROM employees;
```

### 10-2. GROUP BY — 그룹별 집계

```sql
-- 부서별 직원 수
SELECT dept_id, COUNT(*) AS 인원수
FROM employees
GROUP BY dept_id;

-- 부서별 평균 급여 (내림차순)
SELECT dept_id, AVG(salary) AS 평균급여
FROM employees
GROUP BY dept_id
ORDER BY 평균급여 DESC;

-- 부서별 최고/최저/평균 급여
SELECT
    dept_id,
    COUNT(*)       AS 인원수,
    MAX(salary)    AS 최고급여,
    MIN(salary)    AS 최저급여,
    AVG(salary)    AS 평균급여,
    SUM(salary)    AS 급여합계
FROM employees
GROUP BY dept_id
ORDER BY dept_id;
```

> **GROUP BY 주의:** SELECT 절에는 GROUP BY에 명시한 열과 집계 함수만 올 수 있다. GROUP BY에 없는 일반 열을 SELECT에 쓰면 오류가 발생한다.

```sql
-- 잘못된 예 (name은 GROUP BY에 없음)
SELECT dept_id, name, COUNT(*) FROM employees GROUP BY dept_id; -- 오류!

-- 올바른 예
SELECT dept_id, COUNT(*) FROM employees GROUP BY dept_id;
```

### 10-3. HAVING — 그룹 결과 필터링

WHERE는 그룹화하기 전 개별 행을 필터링하고, HAVING은 그룹화 후 집계 결과를 필터링한다.

```sql
-- 인원이 2명 이상인 부서만
SELECT dept_id, COUNT(*) AS 인원수
FROM employees
GROUP BY dept_id
HAVING COUNT(*) >= 2;

-- 평균 급여가 6,000,000 이상인 부서
SELECT dept_id, AVG(salary) AS 평균급여
FROM employees
GROUP BY dept_id
HAVING AVG(salary) >= 6000000;

-- WHERE + GROUP BY + HAVING 함께 사용
-- 2020년 이후 입사자 중 부서별 인원이 2명 이상인 부서
SELECT dept_id, COUNT(*) AS 인원수
FROM employees
WHERE hire_date >= '2020-01-01'
GROUP BY dept_id
HAVING COUNT(*) >= 2
ORDER BY 인원수 DESC;
```

**SELECT 실행 순서:**

SQL은 작성 순서와 실제 실행 순서가 다르다.

```
FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT
```

이 순서를 알면 왜 WHERE에 집계 함수를 쓸 수 없는지(아직 집계 전이기 때문), HAVING에는 집계 함수를 쓸 수 있는지가 이해된다.

---

## 11. 자주 하는 실수와 주의사항

### 11-1. NULL 비교 실수

```sql
-- 잘못된 방법 (아무 것도 반환되지 않음)
SELECT * FROM employees WHERE dept_id = NULL;
SELECT * FROM employees WHERE dept_id != NULL;

-- 올바른 방법
SELECT * FROM employees WHERE dept_id IS NULL;
SELECT * FROM employees WHERE dept_id IS NOT NULL;
```

NULL은 "알 수 없는 값"이다. NULL = NULL도 TRUE가 아니라 NULL이다.

### 11-2. WHERE 없는 UPDATE/DELETE

```sql
-- 의도: 특정 직원 급여 수정
-- 실수: WHERE 절을 빠뜨려 전체 직원 급여가 9,000,000으로 바뀜
UPDATE employees SET salary = 9000000;

-- 올바른 방법
UPDATE employees SET salary = 9000000 WHERE emp_id = 5;
```

UPDATE와 DELETE는 항상 WHERE 조건을 확인하는 습관을 들이자.

### 11-3. GROUP BY + 집계 함수 혼용 실수

```sql
-- 오류: name은 GROUP BY에 포함되지 않은 비집계 열
SELECT dept_id, name, COUNT(*) FROM employees GROUP BY dept_id;

-- 해결 1: name도 GROUP BY에 추가
SELECT dept_id, name, COUNT(*) FROM employees GROUP BY dept_id, name;

-- 해결 2: name을 집계 함수로 감싸기
SELECT dept_id, MAX(name) AS 대표이름, COUNT(*) FROM employees GROUP BY dept_id;
```

### 11-4. LIKE와 인덱스 성능

```sql
-- 인덱스를 사용할 수 있음 (앞이 고정값)
SELECT * FROM employees WHERE name LIKE '김%';

-- 인덱스를 사용할 수 없음 (앞에 와일드카드)
SELECT * FROM employees WHERE name LIKE '%민%';
```

`%`로 시작하는 LIKE 패턴은 인덱스를 활용하지 못해 전체 테이블 스캔이 발생한다. 대용량 데이터에서는 Full-Text Search 등의 대안을 고려해야 한다.

### 11-5. 암묵적 형변환

```sql
-- emp_id는 INT인데 문자열로 비교
-- DBMS가 암묵적으로 형변환하지만 인덱스를 사용 못할 수 있음
SELECT * FROM employees WHERE emp_id = '1';

-- 명시적으로 타입 맞추기
SELECT * FROM employees WHERE emp_id = 1;
```

### 11-6. COUNT(*) vs COUNT(열이름)

```sql
-- COUNT(*): 모든 행 수 (NULL 포함)
SELECT COUNT(*) FROM employees;  -- 10

-- COUNT(dept_id): NULL이 아닌 dept_id 행 수
SELECT COUNT(dept_id) FROM employees;  -- 9 (오승현의 dept_id가 NULL이므로)
```

---

## 12. 실용 쿼리 모음

실무에서 자주 쓰이는 패턴을 정리해 두자.

```sql
-- 1. 급여 상위 3명
SELECT name, salary
FROM employees
ORDER BY salary DESC
LIMIT 3;

-- 2. 부서별 최고 급여자 이름과 급여
SELECT dept_id, MAX(salary) AS max_salary
FROM employees
GROUP BY dept_id;

-- 3. 입사 연도별 직원 수 (YEAR 함수)
SELECT YEAR(hire_date) AS 입사연도, COUNT(*) AS 인원
FROM employees
GROUP BY YEAR(hire_date)
ORDER BY 입사연도;

-- 4. 이름에 '수'가 들어가는 직원의 이메일 조회
SELECT name, email
FROM employees
WHERE name LIKE '%수%';

-- 5. 급여가 평균 이상인 직원 (서브쿼리 맛보기)
SELECT name, salary
FROM employees
WHERE salary >= (SELECT AVG(salary) FROM employees)
ORDER BY salary DESC;

-- 6. 부서별 급여 현황 (전체 요약)
SELECT
    dept_id,
    COUNT(*)                       AS 인원수,
    FORMAT(AVG(salary), 0)         AS 평균급여,
    FORMAT(MAX(salary), 0)         AS 최고급여,
    FORMAT(MIN(salary), 0)         AS 최저급여
FROM employees
WHERE dept_id IS NOT NULL
GROUP BY dept_id
ORDER BY dept_id;
```

---

## 13. SELECT 문 전체 구조 정리

지금까지 배운 SELECT의 모든 절을 순서대로 정리하면 다음과 같다.

```sql
SELECT   [DISTINCT] 열1, 열2, 집계함수(열3) AS 별칭
FROM     테이블명
WHERE    조건식                    -- 행 필터 (그룹화 전)
GROUP BY 열1, 열2                  -- 그룹화 기준
HAVING   집계조건식                -- 그룹 필터 (그룹화 후)
ORDER BY 열1 [ASC|DESC], 열2 ...  -- 정렬
LIMIT    n OFFSET m;              -- 행 수 제한
```

모든 절이 항상 필요하지는 않다. 필요한 절만 조합해서 사용하면 된다.

---

## 14. 마무리 및 다음 편 예고

이번 편에서는 SQL의 역사부터 시작해 RDBMS의 핵심 개념(테이블, 기본키, 외래키), SQL 분류(DDL/DML/DCL/TCL), DDL(CREATE/ALTER/DROP), DML(SELECT/INSERT/UPDATE/DELETE), WHERE 절과 다양한 연산자, ORDER BY/LIMIT, 집계 함수, GROUP BY/HAVING까지 SQL 기초의 거의 전부를 다뤘다.

여기서 배운 내용만으로도 단일 테이블에서 원하는 데이터를 자유롭게 다룰 수 있다.

**다음 편 — SQL Basic 2: JOIN**에서는 여러 테이블을 연결하는 JOIN을 다룬다.

- INNER JOIN: 두 테이블에 모두 존재하는 데이터만
- LEFT JOIN / RIGHT JOIN: 한쪽 테이블을 기준으로 전체 포함
- CROSS JOIN: 모든 조합
- SELF JOIN: 같은 테이블끼리

`employees`와 `departments`를 JOIN해서 "개발팀 직원 목록"처럼 두 테이블의 데이터를 합쳐 조회하는 법을 배울 것이다. 실무에서 쿼리를 작성할 때 JOIN이 차지하는 비중은 매우 높다. 꼭 이어서 읽어 보길 권한다.

---

## 참고 자료

- [MySQL 8.0 Reference Manual](https://dev.mysql.com/doc/refman/8.0/en/)
- [PostgreSQL 16 Documentation](https://www.postgresql.org/docs/16/index.html)
- [W3Schools SQL Tutorial](https://www.w3schools.com/sql/)
- [SQLZoo Interactive Tutorial](https://sqlzoo.net/)
