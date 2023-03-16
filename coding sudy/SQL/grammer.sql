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
-- 성이 Lee인 직원의 모든 정보 조회
SELECT *
FROM EMP
WHERE first_name = 'Lee';

-- 성이 Lee이고 성별이 여자인 직원의 모든 정보 조회
SELECT *
FROM EMP
WHERE first_name = 'Lee' AND gender = 'F';

-- 범위를 지정해 검색
-- BETWEEN: 범위 지정
-- 연봉이 2000에서 3000 사이인 직원의 모든 정보 조회
SELECT *
FROM EMP
WHERE (salary >= 2000) and (salary <= 3000);

SELECT *
FROM EMP
WHERE salary BETWEEN 2000 AND 3000;