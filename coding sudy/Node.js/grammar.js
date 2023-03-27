// ---------------- let, const ----------------
// 기존 문법
// 상수와 변수 구분 없음
var title = 'node.js';
var director = 'direct';
director = 'rabbit';
title = 'es6'; // 오류 없음

// ES6
// 상수와 변수 구분 가능
const title = 'node.js'; // 값을 변경할 수 없는 상수로 선언
let director = 'direct'; // 값을 변경할 수 있는 변수로 선언
director = 'rabbit';
title = 'es6'; // 오류 발생

// ---------------- Template String ----------------
// 기존 문법
var name = 'peter';
var age = 20;

// +를 사용해 문자열과 변수 연결
// \n 개행문자 필요
var hi = 'hi my name is' + name + "\n i'm" + age + 'years old';
console.log(hi);

// ES6
const name = 'peter'; // 값을 변경할 수 없는 상수로 선언
const age = 20;

// 벡틱을 사용해 문자열 사이에 간단하게 변수 사용 가능
// 따옴표 사용 간단하게 가능
// 줄 바꿈 지원
const hi = `hi my name is ${name}
i'm ${age} years old`;
console.log(hi);

// ---------------- arrow function ----------------
// 기존 문법
// 기본 함수 표현 방법
function dosomething(param) {
  console.log('do something');
}

// 익명 함수 표현 방법
setTimeout(function (param) {
  console.log('no name function');
}, 0);

// 함수 새로 선언 가능
function dosomething() {
  console.log('do other');
}

// ES6
// 상수형으로 표현 가능
const dosomething = (param) => {
  console.log('do something');
};

// 익명 함수 간단히 표현 가능
setTimeout((param) => {
  console.log('no name function');
}, 0);

// 함수 새로 선언 불가능
dosomething = () => {
  console.log('do other');
};

// ---------------- class ----------------
// 기존 문법
class model {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  // prototype으로 class 함수 구현
  getInfo() {
    console.log(this.name, this.age);
  }
}

var Model = new model('james', 30);
Model.getInfo();

// ES6
class model {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  getInfo() {
    console.log(this.name, this.age);
  }
}

const Model = new model('james', 30);
Model.getInfo();

// ---------------- destructing ----------------
// 기존 문법
var obj = { name: 'peter', age: 20 };
var name = obj.name;
var age = obj.age;

var arr = ['some', 'values'];
var first = arr[0];
var second = arr[1];

// ES6
const obj = { name: 'peter', age: 20 };
// Object의 key와 같은 이름으로 변수 선언 가능
const { name, age } = obj;
// 다른 이름으로 변수 선언하는 방법
const { name: n1, age: a1 } = obj;

const arr = ['some', 'values'];
// arr에서 순차적으로 변수 선언 가능
const [first, second] = arr;
