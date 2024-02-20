// ---------------- Node.js 시작하기 ----------------
// Node.js로 간단한 웹 서버 만들기

// http 모듈은 Node.js에서 가장 기본적이고, 중요한 웹 모듈
// 서버나 클라이언트와 관련된 기능 제공

// createServer() 함수로 요청받고 응답할 수 있는 http.Server 객체 생성

// createServer()는 요청에 관한 정보를 담고있는 request와
// 응답에 관한 정보를 담고 있는 response라는 두 개의 매개변수가 있는 함수를 인자로 받음

// response의 writeHead()를 이용해 요청에 응답 헤더 정보 전송
// 인자로 HTTP 상태 코드와 응답 헤더 전송
// 응답 헤더에서는 Content-Type 같은 정보 포함
// Content-Type은 보낼 데이터에 대한 타입 지정
// text/html외에 text/plain 등 필요에 따라 설정

// response의 end()함수는 헤더와 본문 데이터를 서버에 전달했음을 알림
// 인자로 서버에 보낼 본문 전달

// http.Server 객체이 listen()으로 포트 정보 전달해 연결 수신하는 HTTP 서버 시작

// createServer 를 통해 화면에 "Hello Everyone!" 출력

// require을 이용해 http 모듈 불러오기
// createServer()함수를 이용해 화면에 "Hello Everyone!"을 출력하는 서버 객체 생성
// HTTP 응답 코드는 200, Content-Type은 text/html로 설정
// 반환되는 http.Server 객체는 8080포트로 열어 서버 시작

// http 모듈을 불러오세요.
var http = require('http');

// "Hello Everyone!"를 출력하는 서버 객체를 만드세요.
// 8080포트로 서버를 시작하세요.
http
  .createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('Hello Everyone!');
  })
  .listen(8080);

// ---------------- Node.js 모듈 사용하기 ----------------
// 모듈(module)?
// 애플리케이션을 구성하는 개별적 요소 의미
// 독립된 기능을 갖는 함수 또는 파일의 모임

// 모든 기능을 써내려가는 것보다 기능별로 함수를 만들어
// 함수를 호출하는 방식으로 프로그래밍 해 개발 효율성을 높이고 유지보수 편리하게

// Node.js 모듈은 nodejs가 제공하는 내장 모듈,
// 개발자들이 직접 개발해 npm을 사용하는 외정 모듈 2 가지로 구성

// 내장 모듈
// Node.js를 설치하면 이미 제공되어지는 모듈
// npm 사용 안함

// 외장 모듈
// 일반 Node.js 개발자들이 만들어 놓은 모듈(라이브러리)
// 외장 모듈 사용을 위해 npm(Node Package Manager) 사용

// app.js
// require() 함수를 호출해 calc.js 파일과 calc2.js 파일 불러오기
// require("./calc");

// calc.js
// exports 객체에 직접 add와 multiply 등 프로퍼티 추가
// 사칙연산에 해당하는 함수 4개 작성 후 exports에 할당
// exports.add = function (a, b) {
//   return a + b;
// };

// calc2.js
// calc 객체 생성
// calc 객체에 사칙연산에 해당하는 프로퍼티 모두 추가
// calc.add = function (a, b) {
//   return a + b;
// };
// module.exports에 calc 객체 할당
// module.exports = calc;

// app.js
//calc.js 파일 불러오세요.
//모듈을 불러오기 위해 require()함수를 호출합니다.
var calc = require('./calc');
// require()는 exports 객체를 반환한다.

//require()함수의 반환값은 exports 객체이고 calc 변수는 exports 객체처럼 사용할 수 있습니다.
var calc2 = require('./calc2');
//2.  console에 calc와 calc2의 사칙연산을 활용해서 결과창의 값을 확인하세요. 아래 코드는 수정하지 마세요.
console.log(calc.divide(15, 5));
console.log(calc2.multiply(calc2.add(1, 2), calc2.add(2, 3))); // 15
console.log(calc2.add(3, 5));

// calc.js
//calc.js는 exports에 직접 프로퍼티를 할당합니다.
//사칙연산에 해당하는 함수 4개를 작성해서 exports에 할당하세요.
exports.add = function (a, b) {
  return a + b;
};
exports.multiply = function (a, b) {
  return a * b;
};
exports.subtract = function (a, b) {
  return a - b;
};
exports.divide = function (a, b) {
  return a / b;
};

// calc2.js
//calc2.js는 새로운 객체에 프로퍼티를 설정 후 module.exports라는 하나의 값에 할당합니다.

//1. calc 라는 객체를 생성하세요.
var calc = {};
//2. calc객체에 사칙연산에 해당하는 프로퍼티를 모두 추가하세요.
calc.add = function (a, b) {
  return a + b;
};
calc.multiply = function (a, b) {
  return a * b;
};
calc.subtract = function (a, b) {
  return a - b;
};
calc.divide = function (a, b) {
  return a / b;
};
//3. module.exports 에 calc 객체를 할당하세요.
module.exports = calc;
