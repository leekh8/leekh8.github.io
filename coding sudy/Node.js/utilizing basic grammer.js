// ---------------- let, const 사용하기 ----------------
// variable은 언제든 변경 가능한 변수로,
// constant는 변경이 불가능한 상수로

let variable = 1;
const constant = 2;

console.log('variable', 1);
console.log('constant', 2);

// ---------------- template string 사용하기 ----------------
// 아래의 주석과 같이 문자열을 출력하는 프로그램
/*
Cat has 4 legs.
Cat says "meow".
 */
const animal = 'Cat';
const legs = 4;
const sound = 'meow';

const explain = `${animal} has ${legs} legs.
${animal} says "meow".`;

console.log(explain);

// ---------------- arrow function 사용하기 ----------------
/*
function add(a, b) {
  return `${a}+${b}=${a + b}`;
}
*/
// 위의 주석을 ES5 arrow function 표현으로 변환
const add = (a, b) => {
  return `${a}+${b}=${a + b}`;
};

module.exports = add;

// ---------------- ES6 class 사용하기 ----------------
/*
Animal 클래스의 explain() 함수가 동작할 수 있도록 constructor를 완성하고, 
Animal 클래스를 사용하여 duck 객체를 생성

constructor에 알맞은 코드를 작성하여 explain() 함수 동작
const duck 변수에 name은 “duck”, sound는 “quack”으로 duck 객체를 생성
*/

class Animal {
  constructor(name, sound) {
    /* constructor 완성하기 */
    this.name = name;
    this.sound = sound;
  }

  explain() {
    console.log(`${this.name} says ${this.sound}`);
  }
}

// "duck", "quack"
const duck = new Animal('duck', 'quack');

module.exports = duck;

// ---------------- ES6 destructing 사용하기 ----------------
/*
object destructing과 array destructing을 사용하여 주어진 코드를 간결하게 표현
name과 sound를 object destructing을 사용하여 한 줄 코드로 수정
first, second, third를 array destructing을 사용하여 한 줄 코드로 수정
*/
const duck = {
  name: 'duck',
  sound: 'quack',
};
const { name, sound } = duck;

console.log('name', name);
console.log('sound', sound);

const animals = ['duck', 'cat', 'bear'];

const [first, second, third] = animals;

console.log('first', first);
console.log('second', second);
console.log('third', third);

// ---------------- callback 사용하기 ----------------
/*
countDown(count, callback) 함수는 count 값을 초 단위로 카운트 다운한 후 callback 함수를 실행하는 함수

5초 후에 callback이 실행되도록 수정
callback은 “BOOM!”이라는 문자열이 출력되는 함수로 구성 합니다. 출력은 console.log 함수를 사용
함수는 ES6의 arrow function을 사용
*/
/*
function countDown(count, callback) {
    console.log(count);
    
    if (count === 0) {
        callback();
        return;
    }
    
    setTimeout(() => {
        countDown(count - 1, callback);
    }, 1000);
}
*/
countDown(5, () => {
  console.log('BOOM!');
});

// ---------------- promise 사용하기 ----------------
/*
callback 함수로 작성된 코드를 promise로 작성하여 사용
callback.js는 콜백을 활용하여 
세 값을 더하는 기능을 구현한 프로그램의 일부입니다.

callback 지옥에서 벗어나기 위해 
이 함수를 promise로 재작성
callback.js를 참고하여 
지시사항을 만족하는 promise.js를 완성

adder(a, b, callback) 함수를 
promise로 재작성한 함수 adder_promise를 완성
callback 함수 실행 오류를 promise로 처리
callback 함수 실행 결과를 promise로 처리
add_all() 함수 내 adder_promise(a, b)의 다음 줄을 완성
catch를 활용하여 promise 에러를 handle_error 함수로 처리하도록 완성
*/
/*
실행 시 함수를 세 번 시행하고
각각 add_all(1, 2, 3), add_all(4, 5, 0), add_all(6, 0, 7)이 실행됩니다.

출력값

1+2=3
3+3=6
1+2+3=6
-
4+5=9
ERROR: no zero
-
ERROR: no zero
*/
/* callback.js
function adder(a, b, callback) {
    if (a == 0 || b == 0) {
        callback("no zero", null);
        return;
    }
    console.log(`${a}+${b}=${a + b}`);
    
    callback(null, a + b);
}

function handle_error(error) {
    console.log("ERROR: ", error);
}

function add_all(a, b, c) {
    adder(a, b, (err, result) => {
        if (err == null) {
            adder(result, c, (err, result2) => {
                if (err == null) {
                    console.log(`${a}+${b}+${c}=${result2}`);
                } else {
                    handle_error(err);
                }
            });
        } else {
            handle_error(err);
        }
    });
}
*/
function adder(a, b, callback) {
  if (a == 0 || b == 0) {
    callback('no zero', null);
    return;
  }
  console.log(`${a}+${b}=${a + b}`);

  callback(null, a + b);
}

function handle_error(error) {
  console.log('ERROR: ', error);
}

function adder_promise(a, b) {
  return new Promise((resolve, reject) => {
    adder(a, b, (err, result) => {
      if (err) {
        /* 1. promise 에서 에러 처리하기 */
        reject(err);
        return;
      }
      /* 2. promise 에서 결과값 처리하기 */
      resolve(result);
    });
  });
}

function add_all(a, b, c) {
  adder_promise(a, b)
    /* 3. then 을 활용하여 result 와 c 를 add_promise 하기 */
    .then((result) => {
      return adder_promise(result, c);
    })
    .then((result2) => {
      console.log(`${a}+${b}+${c}=${result2}`);
    })
    /* 4. catch 를 활용하여 promise 의 에러를 handle_error 함수로 전달하기 */
    .catch((err) => handle_error(err));
}

module.exports = add_all;

// ---------------- async - await 사용하기 ----------------
/*
adder_promise는 두 값을 더한 결과를 promise로 전달하는 함수
지시사항에 따라 main 함수를 완성

main_promise 함수의 동작을 참고하여 main 함수를 완성

async, await을 적절하게 활용

main 함수를 async 함수로 선언하도록 수정
adder_promise(a, b)와 adder_promise(c, d)를 
동시에 실행하고 결과를 각각 r1과 r2에 저장
r1과 r2를 한 번 더 adder_promise 함수에 전달하고 
결과를 r3에 저장
*/
/*
function adder_promise(a, b) {
    return new Promise((resolve, reject) => {
        resolve(a+b);
    });
}
*/
const adder_promise = require('./promise');

function main_promise(a, b, c, d) {
  Promise.all([adder_promise(a, b), adder_promise(c, d)])
    .then(([r1, r2]) => {
      return adder_promise(r1, r2);
    })
    .then((r3) => {
      console.log(`${a}+${b}+${c}+${d}=${r3}`);
    });
}

/* 1. main 을 async 함수로 선언 */
async function main(a, b, c, d) {
  const [r1, r2] = await Promise.all([
    adder_promise(a, b),
    adder_promise(c, d),
  ]); /* 2. 두 promise 함수를 동시에 실행하여 결과를 r1, r2에 저장 */
  const r3 = await adder_promise(
    r1,
    r2
  ); /*3. r1 과 r2 를 한번 더 adder_promise 로 실행 */
  console.log(`${a}+${b}+${c}+${d}=${r3}`);
}

main(1, 2, 3, 4);
