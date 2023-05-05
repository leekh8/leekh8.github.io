// -------- Object를 전달받는 Component --------
// object로 선언된 학생 정보를 전달 받아 출력하는 컴포넌트를 개발
// 지시사항
// src/components 디렉토리를 생성
// 생성한 디렉토리 내에 Student.js 이라는 파일을 생성
// Student 라는 함수 컴포넌트를 선언
// 생성한 컴포넌트의 Props에서 student라는 변수를 전달받음
// student object는 다음과 같은 값들을 전달받음
// {
//     name: "성명",
//     subject: "수업명",
//     score: 점수
// }

// 전달받은 student를 <div> element로 다음과 같은 내용을 출력
// 점수가 80점 이상일 경우 PASS, 80점 미만일 경우 FAIL로 표시
// XXX 학생은 YYY 수업을 수강중입니다.
// 현재 점수는 ZZ점으로 PASS/FAIL입니다.

// Student 컴포넌트를 export
// export default Student;

// App.js로 돌아와 Student 컴포넌트를 import
// 다음과 같은 정보를 담고있는 object 두개를 각각 선언
// {
//     name: "김민수",
//     subject: "수학",
//     score: 88
// }
// Copy
// {
//     name: "홍길동",
//     subject: "영어",
//     score: 72
// }

// className이 "App"인 div 안에 선언한 두 개의 object를 각각 컴포넌트에 전달하여 출력하는 코드를 작성
// -------- app.js
import React from "react";
import "./App.css";
import Student from "./components/Student";

function App() {
  const person1 = {
    name: "김민수",
    subject: "수학",
    score: 88
  };
  const person2 = {
    name: "홍길동",
    subject: "영어",
    score: 72
  };
  return (
    <div className="App">
      <Student student={person1} />
      <Student student={person2} />
    </div>
  );
}

export default App;

// -------- app.js
// -------- ver.1
import React from "react";
const Student1 = ({ student }) => {
  return (
    <div>
      {student.name} 학생은 {student.subject} 수업을 수강중입니다. 현재 점수는{" "}
      {student.score}점으로 {student.score >= 80 ? "PASS" : "FAIL"}입니다.
    </div>
  );
};
// export default Student1;

import React from "react";
// -------- ver.2
const Student2 = ({ student }) => {
  const strPass = student.score >= 80 ? "PASS" : "FAIL";
  return (
    <div>
      {student.name} 학생은 {student.subject} 수업을 수강중입니다. 현재 점수는{" "}
      {student.score}점으로 {strPass}입니다.
    </div>
  );
};
// export default Student2;
