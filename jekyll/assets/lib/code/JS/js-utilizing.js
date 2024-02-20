// ---------------- 주사위 게임 ----------------
var dice = Math.floor(Math.random() * 6) + 1;
// Math.floor: 내림
// Math.random(): 0과 1 사이의 임의의 수

// 사칙연산 순으로 실행

// Math.random()이 제일 먼저 실행
// 그 후 * 6 실행
// 그 후 Math.floor() 실행
// 그 후 + 1 실행

function rand(maxNum) {
  var dice = Math.floor(Math.random() * 6) + 1;
  console.log(dice);
}

rand(6);

// ---------------- 소수 출력하기 ----------------
function isPrime(n) {
  var divisor = 2;
  // 2부터 나누기 시작
  while (n > divisor) {
    // n이 나누는 수 보다 클 때까지
    if (n % divisor === 0) {
      // n과 나누는 수가 나누어 떨어지면
      return false;
    } else {
      // n과 나누는 수가 나누어 떨어지지 않으면 나누는 수 1 증가
      divisor++;
    }
  }
  return true;
}

// ---------------- 문자열 거꾸로 출력하기 ----------------
function reverse(str) {
  var reverseStr = '';
  // 빈 문자열
  for (let i = str.length - 1; i >= 0; i--) {
    // i가 str의 길이보다 1 작게 초기화 -> str의 맨 뒤를 가리키도록록
    reverseStr = reverseStr + str.charAt(i);
    // 빈 문자열 reverseStr에 str의 i번째 문자를 추가
  }
  return reverseStr;
}

console.log(reverse('hello')); // olleh

// ---------------- 구구단 만들기 ----------------
function timesTable(n) {
  for (let i = 0; i < 10; i++) {
    console.log(n + 'x' + i + '=' + n * i);
  }
}

timesTable(2); // 2단 구구단 출력

// ---------------- 반복문으로 구구단 완성하기 ----------------
for (let n = 2; n < 10; n++) {
  for (let i = 1; i < 10; i++) {
    console.log(n + 'x' + i + '=' + n * i);
  }
}

// ---------------- 여러 줄에 걸쳐 입력 받기 ----------------
function solution(inputData) {
  var answer = inputData.split('\n');
  return answer;
}

// ---------------- 문자열 자르기 ----------------
function solution2(str) {
  var answer = [];

  var arr = str.split(' '); // 공백을 기준으로 문자열 자르기
  answer.push(typeof arr);
  answer.push(arr[0]);
  return answer;
}
