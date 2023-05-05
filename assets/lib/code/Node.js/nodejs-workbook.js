// ---------------- 시스템 환경 정보 확인하기 ----------------
// process 모듈
// 현재 실행중이 Node.js의 프로세스 정보를 얻거나, 제어할 수 있음
// 글로벌 객체로 require하지 않아도 사용 가능

console.log(process.arch); // Node.js가 컴파일된 프로세서의 아키텍처
console.log('==============');

console.log(process.argv); // 프로세서가 시작될 때 명령어와 함께 전달된 인수
console.log('==============');

console.log(process.env); // 사용자 환경 정보를 가진 객체
console.log('==============');
// process.exit(0); // 프로세스 종료
console.log(process.memoryUsage()); // 메모리 사용 정보를 가진 객체
console.log('==============');

console.log(process.platform); // Node.js가 컴파일된 운영체제 플랫폼
console.log('==============');

console.log(process.uptime()); // 프로세스가 실행된 시간
console.log('==============');

console.log(process.version); // Node.js의 버전
console.log('==============');

console.log(process.versions); // Node.js에 종속된 프로그램의 버전 정보를 가진 객체
console.log('==============');

// ---------------- 시 낭송하기 ----------------
// fs 모듈
// file system
// 파일과 관련된 처리와 관련된 작업에 사용

// readFileSync() 함수는 매개변수로 파일의 경로를 받아
// 파일을 동기적으로 읽고 결과를 문자열로 반환

// 텍스트가 들어있는 파일을 읽어 화면에 출력

// fs 모듈을 불러오세요.
var http = require('http');
var fs = require('fs');

// 서버를 생성
// fs 모듈의 readFileSync() 함수를 이용해 파일을 읽고, 화면에 출력
http
  .createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });

    var data = fs.readFileSync('poetry.txt', 'utf-8').split('\n');
    for (var i = 0; i < data.length; i++) {
      res.write(data[i]);
      res.write('<br />');
    }

    res.end();
  })
  .listen(8080);

// ---------------- 커피 제조 모듈 만들기 ----------------
// 매개 변수로 메뉴 명을 전달하면 커피를 만들어주는 cafe 모듈 생성
// response의 write() 이용해 본문에 내용 전달
// end()를 사용해 본문에 내용 전달, 출력 완료하고 응답 종료,
// write()는 계속 응답 유지
// "Make an Americano"가 출력되도록 코드 작성

// cafe.js에서 "Make a(n) 메뉴 이름" 문자열을 반환하는 함수 export

// 모듈 내 함수 이름 자유롭게 지정
// 조건문을 이용해 메뉴 이름의 앞글자가 모듬인 경우 "Make an ~"
// 그렇지 않은 경우 "Make a ~" 출력

// http 모듈 호출해 서버 생성
// HTTP 응답 코드 200, Content-Type: text/html
// 포트 8080

// 생성한 서버에 가져온 cafe 모듈의 함수 호출해
// 화면에 "Make an americano" 출력

// 첫 번째 문자가 모음인지 쉽게 검사하기 위해 indexOf 이용
// indexOf
// 인자로 받은 문자열을 대상 문자열에서 찾아 인덱스 반환
// 없다면 -1 반환

// cafe.js
// 입력된 문자열의 첫번째 인자가 모음으로 시작하면 true, 아니면 false를 반환하는 함수입니다.
function startsWithVowel(word) {
  var vowels = 'aeiou';
  return vowels.indexOf(word[0]) !== -1;
}

// "Make a(n) '메뉴 이름'" 문자열을 반환하는 함수를 export하세요.
// 메뉴 이름이 a, e, i, o, u로 시작하면 "Make an '메뉴이름'", 그렇지 않으면 "Make a '메뉴이름'"을 반환합니다.
exports.cafe = function (menu) {
  var article = startsWithVowel(menu) ? 'an' : 'a';

  return `Make ${article} ${menu}`;
};

// index.js
// 생성한 모듈을 불러오세요.
var http = require('http');
var coffee = require('./cafe');

// 서버를 생성하세요.
// 생성한 모듈에 "americano"를 인수로 넘겨 호출하여 화면에 "Make an americano"가 출력되도록 작성하세요.
http
  .createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(coffee.cafe('americano'));
    res.end();
  })
  .listen(8080);
