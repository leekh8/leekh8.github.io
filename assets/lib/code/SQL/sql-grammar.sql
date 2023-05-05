-- EMP 테이블의 구조

-- emp_no: 직원 번호: 정수
-- birth_date: 생일: 날짜
-- first_name: 성: 문자열
-- last_name: 이름: 문자열
-- gender: 성별: 문자열
-- salary: 연봉: 정수
-- from_date: 입사일: 날짜


-- EMP 테이블의 구조 출력
DESC EMP;


-- EMP 테이블 조회
SELECT *
FROM EMP;


-- EMP 테이블의 이름 조회
SELECT first_name, last_name
FROM EMP;


-- 중복 없는 데이터 조회
-- DISTINCT: 중복 제거
SELECT DISTINCT emp_no
FROM EMP;


-- 조건에 맞는 정보 조회
-- 성이 LEE 직원의 모든 정보 조회
SELECT *
FROM EMP
WHERE first_name = 'LEE';

-- 성이 LEE이고 성별이 여자인 직원의 모든 정보 조회
SELECT *
FROM EMP
WHERE first_name = 'LEE' AND gender = 'F';

-- 범위를 지정해 검색
-- BETWEEN: 범위 지정
-- 연봉이 2000에서 3000 사이인 직원의 모든 정보 조회
SELECT *
FROM EMP
WHERE (salary >= 2000) and (salary <= 3000);

SELECT *
FROM EMP
WHERE salary BETWEEN 2000 AND 3000;

-- 여러 OR 간결하게 사용
SELECT *
FROM EMP
WHERE last_name in ('HARRY', 'LILLY', 'TONY', 'NATASHA', 'PEPPER');

-- 데이터에서 유사한 값 찾기
-- LIKE: 특정 문자가 포함된 문자열 찾기
-- 정규표현식 활용해 끝나는 말, 시작하는 말 등 찾기 가능
-- 이름이 ~y로 끝나는 직원의 모든 정보 찾기
SELECT *
FROM EMP
WHERE last_name LIKE '%y';

-- 데이터 정렬
-- Order by: 데이터 정렬
-- ASC: 오름차순 (작은 값부터)
-- DESC: 내림차순 (큰 값부터)
-- 생일 오름차순으로 모든 직원 정보 검색
SELECT *
FROM EMP
ORDER BY birth_date ASC;

-- 테이블에 데이터 삽입
-- INSERT: 관계형 데이터베이스 테이블에 값 저장
INSERT INTO EMP
  (emp_no, birth_date, first_name, last_name, gender, salary, from_date)
VALUES('009', '1990-02-09', 'PARK', 'TONY', 'M', '3000');

-- 별도 컬럼 명시 않으면 순서대로 값 삽입
INSERT INTO EMP
VALUES('010', '1989-05-09', 'CHOI', 'ASHLEY', 'F', '4500');

-- 테이블의 데이터 수정
-- UPDATE: 관계형 데이터베이스 테이블의 값 수정
-- 성이 CHOI1인 직원의 성을 CHOI로 변경
UPDATE EMP -- 변경할 테이블
SET first_name='CHOI' -- 변경할 값
WHERE first_name='CHOI1';

-- 테이블의 데이터 삭제
-- DELETE: 관계형 데이터베이스 테이블의 값 삭제
-- 성이 CHOI1인 직원 정보 삭제
DELETE FROM EMP WHERE first_name='CHOI1';

-- WHERE 조건 없으면 모든 데이터 삭제
DELETE FROM EMP;