// ---------------- let, const ----------------
// 기존 문법
// 상수와 변수 구분 없음
var title = 'node.js';
var director = 'direct';
director = 'rabbit';
title = 'es6'; // 오류 없음

// ----------------
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

// ----------------
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

// ----------------
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

// ----------------
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

// ----------------
// ES6
const obj = { name: 'peter', age: 20 };
// Object의 key와 같은 이름으로 변수 선언 가능
const { name, age } = obj;
// 다른 이름으로 변수 선언하는 방법
const { name: n1, age: a1 } = obj;

const arr = ['some', 'values'];
// arr에서 순차적으로 변수 선언 가능
const [first, second] = arr;

// ---------------- 비동기 코딩 ----------------
// 아래는 비동기 동작을 동기적으로 처리하는 방법들
// callback: 이벤트 함수를 인자로 전달하는 방식

// db.getUsers는 db에서 유저 목록을 찾아오는 비동기 동작
// getUsers의 인자로 전달되는 함수가 getUsers를 실행될때 등록되는 이벤트 함수
// getUsers 함수의 실행이 완료되면
// callback 함수로 등록된 err, users를 인자로 갖는 익명 함수가 실행
db.getUsers((err, users) => {
  console.log(users);
});

// callback 단점 예시
// async1,2,3: callback 사용한는 비동기 함수
// 가독성 안좋은 콜백 지옥
db.getUsers((err, users) => {
  if (err) {
    console.log('err');
    return;
  }
  async(users, (r1) => {
    async(users, (r2) => {
      async(users, (r3) => {
        console.log('계속해서 반복한다면?');
      });
    });
  });
});

// ----------------
// promise: 동작이 완료되면 then에 등록된 callback 실행
// 오류 발생 시 catch에 등록된 callback 실행

// then에 등록된 callback 함수의 반환값으로 다시 promise를 사용하면
// 같은 레벨로 비동기 동작을 동기적으로 실행 가능해 callback 지옥에서 탈출 가능
// 중괄호 없이 arrow function을 한 줄로 작성하면
// return 없이 실행 결과를 바로 반환 가능
db.getUsersPromise()
  .then((users) => {
    return Promise1(users);
  })
  .then((r1) => Promise2(r1))
  .catch();

// callback 기반 함수를 promise 함수로 변경하는 방법
// 함수 생성 시 반환값을 promise 객체로 생성한 후
// promise 객체 생성 시 resolve, reject를 인자로 받는 함수를 등록
// 해당 함수 안에서 callback 기반 비동기 함수 실행 후
// 결과는 resolve, 오류는 reject에 전달

// 조금 복잡한 과정일 수 있지만
// promise 제공하지 않는 비동기 함수를 변환하는 데 꼭 필요한 과정

// callback 예시의 getUser를 promise 방식으로 변환할 때
// 함수 선언 후 return 값으로 new promise를 return
// promise를 생성할 때, resolve와 reject를 갖는 함수를 등록하는데
// 이 안에서 getUser를 실행
function getUsersPromise(params) {
  return new Promise((resolve, reject) => {
    // getUsers가 완료되면 err, users를 return되는데
    getUsers(params, (err, users) => {
      // err는 reject로 전달
      if (err) {
        reject(err);
        return;
      }
      // users는 resolve로 전달
      resolve(users);
    });
  });
}

// ----------------
// async - await: promise의 표현법 개선
// promise를 사용하는 다른 문법

// async 함수 내에서 promise 함수의 결과는 await으로 받을 수 있음
// await 함 promise 함수는 완료될 때 까지 다음 라인으로 넘어가지 않음
// 순차적 프로그래밍처럼 작성 가능
// async 함수의 return은 promise

// callback 단점 예시를 async - await으로 변환
// promise 1, 2, 3의 결과를 await으로 받을 수 있음
// promise1, 2의 결과 r1, 2를 간단히 promise3에 전달
async function dosomething() {
  const r1 = await promise1();
  const r2 = await promise2(r1);
  const r3 = await promise3(r1, r2);

  return r3;
}
// dosomething 함수의 결과가 promise인 r3이기 때문에 결과값을 then으로 처리 가능
dosomething().then((r3) => {
  console.log(r3);
});

// ----------------
// 오류 처리
// promise 오류 처리: catch
function dosomething(msg) {
  return promise1()
    .then((r) => {
      console.log(r);
    })
    .catch((e) => {
      console.error(e);
    });
}

// async 오류 처리: try - catch
// await으로 promise 함수를 실행하면 promise에서 reject된 error는 throw되기 때문에
// try - catch로 오류 처리 가능
async function dosomething(msg) {
  try {
    const r = await promise1();
    console.log(r);
  } catch (e) {
    console.log(e);
  }
}

// ----------------
// 비동기 동작을 동기적으로 처리할 필요가 없다면?
// promise.all을 통해 promise 함수를 동시에 실행시키고
// 등록된 모든 함수가 마무리되면 결과값을 한꺼번에 반환
// 동시에 실행할 수 있는 비동기 동작들을 병렬로 실행한다면 효율적

// 가정
// promise1: 1초가 소요되는 비동기 함수
// promise2: 2초가 소요되는 비동기 함수
// sync는 3초 소요
async function sync() {
  const r1 = await promise1();
  const r2 = await promise2();
  console.log(r1, r2);
}
// parallel은 2초 소요
async function parallel() {
  const [r1, r2] = await Promise.all([promise1(), promise2()]);
  console.log(r1, r2);
}
