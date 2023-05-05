// ---------------- 변수 ----------------
var fruit; // 변수 선언
fruit = 'mango'; // 변수 초기화
var fruit = 'mango'; // 변수 선언 및 초기화
fruit = 'apple'; // 변수의 데이터 변경
console.log(fruit); // 변수 안의 데이터 확인

// ---------------- html 파일과 연동 방법 ----------------

{
  /* <body>
  <script src="./grammar.js"></script>
</body> */
}

// ---------------- 8가지 데이터 타입 ----------------
// 문자열 주의 사항
// var str1 = "hello world'; // 혼용 불가
// var str2 = "i'm a girl"
// var str3 = "i\'m a girl"

//  ---------------- 숫자
var num1 = 10; // 정수
var num2 = -10; // 음수
var num3 = 3.14; // 실수

//  ---------------- 함수 #1
var func1 = function () {
  // function 키워드 사용해 생성
  console.log('func1'); // 함수 생성
};

func1(); // 함수 호출

//  ---------------- 함수 #2
function func1() {
  console.log('func1'); // 함수 생성
}
func1(); // 함수 호출

//  ---------------- 함수 #3
var area = function (width, height) {
  // 면적 계산하는 함수
  // 매개변수: 인자로부터 전달받은 값이 들어가는 통로
  return width * height; // return: 함수 안에 데이터를 저장할 때 사용
};

area(10, 20); // 인자: 함수에게 전달하는 데이터

// ---------------- 함수 데이터 호출 #1
var result = area(10, 20);
console.log(result); // console.log(200);

// ---------------- 함수 데이터 호출 #2
console.log(area(10, 20)); // console.log(200);

//  ---------------- 배열
var fruit = ['사과', '배', '수박'];

// 배열 데이터 추출
console.log(fruit); // ["사과", "배", "수박"]
console.log(fruit[0]); // 0번째 인덱스: 사과

// 배열 데이터 변경
fruit[0] = 'apple';
console.log(fruit); // ['apple', '배', '수박']

var arrTest = [
  [10, 20, 30],
  [100, 200, 300],
  [1000, 2000, 3000]
];

console.log(arrTest[1][2]); // 300

//  ----------------
// 객체(object): 프로퍼티, 메소드, 데이터 로 구성,
// 어떤 종류의 데이터 타입도 삽입 가능
var student = {
  // 프로퍼티: name: natasha, age: 30, skills: english
  // 프로퍼티 키: name, age, skills
  // 데이터: natasha, 30, english
  name: 'natasha',
  age: 30,
  skills: ['english'],

  // 메소드: 프로퍼티 값이 함수인 경우: sum
  sum: function (num1, num2) {
    return num1 + num2;
  }
};

// 객체 데이터 추출
console.log(student.name);
console.log(student['name']);

// 객체 데이터 변경
student.age = 40;
console.log(student.age); // 40 출력

//  ----------------
// undefined, null

// var unde; // undefined: 변수 안에 데이터를 입력하지 않은 것(데이터 없음)
// var empty = null; // null: 변수 안에 빈 데이터가 저장되어 있는 것(빈 데이터 저장)

// ----------------
// boolean: 참 또는 거짓을 값으로 가짐
var t = true;
var f = false;

// ---------------- 프로퍼티와 메서드 ----------------
// 문자열 프로퍼티와 메서드
var str1 = 'hello world';
str1.length; // 문자열 길이 11
str1.charAt(0); // 문자 h 추출
str1.split(' '); // 공백을 기춘으로 문자열을 나눈 뒤 배열 [hello, world] 출력

// ----------------
// 배열 프로퍼티와 메서드
var fruit = ['apple', 'pear', 'grape'];

fruit.length; // 데이터 개수: 3개

fruit.push('strawberry'); // 배열 뒤에 데이터 삽입 [..., 'grape', 'strawberry']
fruit.unshift('lemon'); // 배열 앞에 데이터 삽입 ['lemon', 'apple', ...]

fruit.pop(); // 배열 뒤의 데이터 제거: strawberry 제거
fruit.shift(); // 배열 앞의 데이터 제거: lemon 제거

// ----------------
// Math 객체: 수학에서 자주 사용하는 상수, 함수들을 미리 구현해놓은 JS 표준 내장 객체
// Math 프로퍼티와 메서드
Math.abs(-3); // 절대값: 3
Math.ceil(0.3); // 올림: 1
Math.floor(10.9); // 내림: 10
Math.random(); // 0과 1사이의 임의의 숫자 출력

// ----------------
// 문자를 숫자로 변환하는 메서드
parseInt('20.6'); // 내림해 정수로 변환: 20
parseFloat('20.6'); // 실수로 변환: 20.6

// ---------------- 연산자 ----------------
// 산술 연산자: 숫자 뿐 아니라 문자열에도 사용 가능
console.log(20 + 10); // 합: 30
console.log(20 - 10); // 차: 10
console.log(20 * 10); // 곱: 200
console.log(20 / 10); // 나눗셉: 2
console.log(20 % 10); // 나머지: 0

console.log('20' + '10'); // 합: 2010
console.log('20' - '10'); // 차: 10
console.log('20' * '10'); // 곱: 200
console.log('20' / '10'); // 나눗셉: 2
console.log('20' % '10'); // 나머지: 0

// ---------------- 증감 연산자
var num = 10;

console.log(++num); // +1 후 num 출력: 11
console.log(--num); // -1 후 num 출력: 10

console.log(num++); // num 출력 후 +1: 10
console.log(num--); // num 출력 후 -1: 10

// ---------------- 비교 연산자
console.log(10 == 20); // 값이 같다: false
console.log(10 === 20); // 데이터 타입과 값이 같아: false
console.log(10 !== 20); // 값이 같지 않다: true

console.log(10 == '10'); // true
console.log(10 === '10'); // false

console.log(10 > 20); // false
console.log(10 >= 20); // false
console.log(10 < 20); // true
console.log(10 <= 20); // true

// ---------------- 논리 연산자
console.log(10 === 10 && 20 === 30); // AND: 모두 참인 경우: false

console.log(10 === 10 || 20 === 30); // OR: 하나만 참인 경우: true

// ----------------
// typeof: 피연산자의 평가 전 자료형을 나타내는 문자열 반환
typeof operand;
console.log(typeof 43); // 숫자
console.log(typeof 'blue lemon'); // 문자열
console.log(typeof true); // boolean
console.log(typeof undeclaredVariable); // undefined

// ---------------- 조건문 ----------------
// if 문: if ( 조건 ) { 실행할 명령 }
var a = 20;
var b = 40;

if (a < b) {
  // 조건이 참이면 실행
  console.log('a<b');
}

// ---------------- if - else 문
if (a > b) {
  // 조건이 참이면 실행
  console.log('a>b');
} else {
  // 위의 조건 외의 모든 경우
  console.log('a<=b');
}

// ---------------- else if 문
var c = 60;

if (a > b) {
  console.log('a > b');
} else if (b > c) {
  console.log('b > c');
} else if (a < c) {
  // 제일 위의 참 조건만 실행
  console.log('a < b');
} else if (b < c) {
  console.log('b < c');
} else {
  console.log('sorry');
}

// ----------------
// 중첩 if 문: if 안에 또 다른 if 삽입
if (a !== b) {
  if (a > b) {
    console.log('a > b');
  } else {
    console.log('a < b');
  }
} else {
  console.log('a = b');
}

// ---------------- 반복문 ----------------
// 구구단과 같이 고정값과 가변값을 이용하는 경우
// 반복해야 하는 작업을 효율적으로 수행하게끔
// for 문
// for ( 초기화한 변수값; 조건; 증감표시 ){ 실행할 명령 }
for (let i = 0; i < 10; i++) {
  // 0으로 초기화된 i가 i < 10이 참인 동안 명령을 실행하고 값을 하나 더해라
  console.log(i);
}

// ---------------- while 문
// while ( 조건 ) { 실행할 명령 }
var num = 0;

while (num < 10) {
  // num < 10이 참인 동안 명령을 실행
  console.log(num);
  num++;
}

// ---------------- do - while 문:
// while의 조건과 관계없이, do를 무조건 한번은 실행,
// do { 실행할 명령 } while ( 조건 )

var i = 12;

do {
  console.log(i);
  i++;
} while (i < 10);
