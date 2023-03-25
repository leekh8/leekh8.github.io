// ---------------- 조건문 활용 ----------------
/* 
  가진 돈이 1000원 이상이면 택시
  가진 돈이 1000원 미만, 500원 이상이면 버스
  가진 돈이 500원 미만이면 걷기
*/
function solution(money) {
  var answer;
  if (money >= 1000) answer = 'taxi';
  else if (money > 1000 && money >= 500) answer = 'bus';
  else if (money < 500) answer = 'walking';
  return answer;
}

// ---------------- 관계연산자 활용 ----------------
/* 
  입력받은 네자리 숫자를 공백을 기준으로 나눠 a, b, c, d 저장
    1. a <= b
    2. a = d
    3. b > c
    4. c < 6
    5. a = b
    6. a = c
    7. a = d
  1, 2, 3, 4를 동시에 만족하거나, 5, 6, 7을 동시에 만족하면 true,
  그 외에는 false
*/
function solution2(inputData) {
  var answer;
  var num = inputData.split(' ');
  var a = num[0];
  var b = num[1];
  var c = num[2];
  var d = num[3];

  answer = (a <= b && a == d && b > c && c < 6) || (a == b && a == c && a == d);
  return answer;
}

// ---------------- 반복문 + 조건문 활용 ----------------
/* 
  입력받은 자연수 (2이상 100,000이하)의 약수를 작은 순서로 배치한 배열로 출력
*/
function solution3(inputData) {
  var answer = [];

  for (let i = 1; i <= inputData; i++) {
    if (inputData % i == 0) answer.push(i);
  }
  return answer;
}

// ---------------- 3 6 9 게임 ----------------
/* 
  1 ~ 30 까지 3 6 9 게임
*/
function solution4(inputData) {
  var answer = [];

  for (let i = 1; i < 30; i++) {
    if ((i % 10) % 3 == 0 && i % 10 != 0) answer.push('clap');
    else if ((Math.floor(i) / 10) % 3 == 0) answer.push('clap');
    else answer.push(i);
  }
  return answer;
}

// ---------------- 배열 활용 ----------------
/* 
  0보다 큰 정수를 매개변수로 입력받을 때 1부터 해당 숫자까지 배열에 담아 출력
*/
function solution5(inputData) {
  var answer = [];
  for (let i = 1; i <= num; i++) answer.push(i);
  return answer;
}
