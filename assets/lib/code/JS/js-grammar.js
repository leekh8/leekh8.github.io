// -------- 최신 JS 문법 --------
// JS == ECMA == ES 라고 불림

// -------- var -> const & let --------
// const: 한 번 선언하면 값을 바꿀 수 없는 상수
// 같은 중괄호 내에서 중복된 이름을 가질 수 없음
// let: 선언과 변경이 자유로운 변수
// past
var a;
var b = 1;

// now
const c = 2;
let d = 3;
d = 4;

// not available
const e = 5;
e = 6; // error occured

// -------- Array method --------
// -------- forEach
// Array.forEach는 배열의 요소를 이용해 순차적으로 함수를 실행하는 method
// Array.forEach에 실행할 콜백 함수는 현재 값, 인덱스, forEach를 호출한 배열을 매개변수로 받음
// 함수 내에서 따로 return 할 필요 없음
// past
var f = [0, 1, 2, 3, 4, 5];
for (var i = 1; i < f.length; i++) {
  var g = f[i];
  console.log(g);
}

// now
const h = [0, 1, 2, 3, 4, 5];
h.forEach(function (item) {
  console.log(item);
});

// -------- map
// Array.map은 배열의 요소를 이용해 순차적으로 함수를 실행하여 새로운 배열을 반환하는 method
// Array.map에 실행할 콜백 함수는 현재 값, 인덱스, map을 호출한 배열을 매개변수로 받음
// 함수 내에서 반드시 새로운 값 return 할 필요 없음
// past
var j = [0, 1, 2, 3, 4, 5];
var newJ = [];
for (var i = 0; i < j.length; i++) {
  var item = j[i];
  newJ.push(item * 2);
}
// now
const k = [0, 1, 2, 3, 4, 5];
const newK = k.map(function (item) {
  return item * 2;
});

// -------- filter
// Array.filter는 배열의 요소를 이용해 순차적으로 함수를 실행하여
// 조건을 통과하는 요소를 모아 새로운 배열을 반환하는 method
// Array.filter에 실행할 콜백 함수는 현재 값, 인덱스, map을 호출한 배열을 매개변수로 받음
// 함수 내에서 false를 return 할 경우 새로운 배열에서 제외되고
// true를 return 할 경우 새로운 배열에 추가
// past
var l = [0, 1, 2, 3, 4, 5];
var newL = [];
for (var i = 0; i < l.length; i++) {
  var item = l[i];
  if (item > 3) {
    newL.push(item * 2);
  }
}
// now
const m = [0, 1, 2, 3, 4, 5];
const newM = m.filter(function (item) {
  return item > 3;
});
// -------- Arrow function --------
// function 표현보다 구문이 짧은 함수 표현
// function 키워드 생략하고 매개변수를 받은 뒤 => 화살표를 써주는 형태
// 중괄호를 열어 로직을 작성하고
// return 값만 존재하는 짧은 함수의 경우
// 중괄호와 return을 생략하고 바로 return 할 값 입력 가능
const o = (x, y) => {
  console.log(x, y);
};
o(3, 4);

const p = (x, y) => console.log(x, y);
p(4, 5);

// -------- Destructuring assignment --------
// destructuring assignment 구조 분해 할당은 객체나 배열을 해체해 개별 변수에 담을 수 있게 하는 표현식

// -------- object
// 기존 객체에 담긴 값을 새로운 변수로 선언하기 위해 작성하던 방법
// past
var q = { x: 1, y: 2, z: 3 };
var x = q.x;
var y = q.y;
var z = q.z;
// 현재 간편하게 코드를 작성할 수 있는 방법
// now
const r = { t: 1, u: 2, v: 3 };
const { t, u, v } = r;

// -------- array
// 기존 배열에 담긴 값을 각각 담기 위해 사용하던 방법
// past
var w = [1, 2, 3];
var w0 = w[0];
var w1 = w[1];
var w2 = w[2];

// 현재 더 간편하게 코드를 작성할 수 있는 방법
// now
const w = [1, 2, 3];
const [w0, w1, w2] = w;

// --------  --------
// --------  --------
// --------  --------
// --------  --------
