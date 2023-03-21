// ---------------- 변수 ----------------
var fruit; // 변수 선언
fruit = 'mango'; // 변수 초기화
var fruit = 'mango'; // 변수 선언 및 초기화
fruit = 'apple'; // 변수의 데이터 변경
console.log(fruit); // 변수 안의 데이터 확인

// ---------------- html 파일과 연동 방법 ----------------
/*
<body>
  <script src="./grammar.js"></script>
</body>
*/

// ---------------- 8가지 데이터 타입 ----------------
// 문자열 주의 사항
// var str1 = "hello world'; // 혼용 불가
// var str2 = "i'm a girl"
// var str3 = "i\'m a girl"

//  ----------------
// 숫자
var num1 = 10; // 정수
var num2 = -10; // 음수
var num3 = 3.14; // 실수

//  ----------------
// 함수 #1
var func1 = function () {
  // function 키워드 사용해 생성
  console.log('func1'); // 함수 생성
};

func1(); // 함수 호출

// 함수 #2
function func1() {
  console.log('func1'); // 함수 생성
}
func1(); // 함수 호출

// 함수 #3
var area = function (width, height) {
  // 면적 계산하는 함수
  // 매개변수: 인자로부터 전달받은 값이 들어가는 통로
  return width * height; // return: 함수 안에 데이터를 저장할 때 사용
};

area(10, 20); // 인자: 함수에게 전달하는 데이터

// 함수 데이터 호출 #1
var result = area(10, 20);
console.log(result); // console.log(200);

// 함수 데이터 호출 #2
console.log(area(10, 20)); // console.log(200);

//  ----------------
// 배열
var fruit = ['사과', '배', '수박'];

// 배열 데이터 추출
console.log(fruit); // ["사과", "배", "수박"]
console.log(fruit[0]); // 0번째 인덱스: 사과

// 배열 데이터 변경
fruit[0] = 'apple';
console.log(fruit); // ['apple', '배', '수박']

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
  },
};

// 객체 데이터 추출
console.log(student.name);
console.log(student['name']);

// 객체 데이터 변경
student.age = 40;
console.log(student.age); // 40 출력

//  ----------------
// undefined, null
/*
var unde; // undefined: 변수 안에 데이터를 입력하지 않은 것(데이터 없음)
var empty = null; // null: 변수 안에 빈 데이터가 저장되어 있는 것(빈 데이터 저장)
*/

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
Math.random();
