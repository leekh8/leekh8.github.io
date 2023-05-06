// -------- HTML을 JSX로 변환하기

// JSX란 JS를 확장한 문법
// JS 코드 안에서 UI 관련 작업을 할 때 효과적으로 활용
// JSX를 사용할 때 유의 사항
//   - HTML을 JSX로 변환할 때, 변수 내에 HTML코드를 저장
//   - 여러 자식 태그로 구성된 HTML 코드는 반드시 부모 태그 내에 구성되어야 함
//   - 문장의 끝은 세미콜론(;)을 사용

// HTML 예시

// <p>Hello, world!</p>
// <p>Nice to meet you</p>

// JSX 예시
const element1 = (
  <div>
    <p>Hello, world!</p>
    <p>Nice to meet you</p>
  </div>
);

// -------- JSX에 표현식 포함하기

// JSX 중괄호({}) 안에는 여러 자바스크립트 표현식 사용 가능
//   산술식: 숫자 표현 (ex. 3.14159, −2)
//   문자열: 문자열 표현 (ex. "234", "Fred")
//   논리식: 참 또는 거짓 표현 (ex. true, false)
//   기본 표현식: 자바스크립트의 기본 키워드 및 일반 표현식 (ex. 3 + 5)

// 기본 표현식 사용 예시
const expression2 = 3 * 5;
const element2 = <h1>3*5= {expression2}</h1>;

// -------- JSX에 함수 표현식 넣기

// 함수 표현식도 마찬가지로 중괄호({})를 사용하여 호출 가능
// 함수를 정의하는 방법
//   function 키워드를 사용하여 함수를 정의
//   필요 시, 매개변수 값을 받아 함수 내에서 사용
//   return 키워드를 통해 결과를 반환

// 함수 정의 및 호출 예시
function multiplication3(num1, num2) {
  return num1 + "*" + num2 + " = " + num1 * num2;
}

const element3 = <h1>{multiplication3(5, 9)}</h1>;

// -------- 함수에 JSX 활용하기

// 함수도 표현식의 한 종류
// 따라서 함수 내에 중괄호({})를 사용하여 다른 함수 표현식을 추가 가능

// 함수 내 다른 함수 표현식 사용 예시
function formatGreeting4(name) {
  return "Hello" + " " + name;
}

function getGreeting4(user) {
  return <h1>Hello, {formatName4("elice!")}!</h1>;
}

// -------- JSX 속성 정의

// HTML 태그 속성을 사용하면 태그 내에 여러 기능을 추가하거나 디자인을 변경 가능
// JSX의 문법에서는 태그 내에 원하는 속성을 삽입 가능
// 대표적: 링크 이동, 이미지 삽입 등

// 이미지 삽입 예시
// <img src="https://elice-front-door-cdn.azureedge.net/web/static/media/lost_bunny.fcbeff1a.png"></img>

// 링크 이동 예시
// <a href = 'www.naver.com'>네이버로 이동하기</a>

// -------- JSX로 자식 정의

// JSX는 태그 내에서 자식 태그를 정의 가능
// 자식 태그란 태그 내에 존재하는 하위 태그를 의미,
// 이 때 하위 태그를 포함한 상위 태그는 부모 태그

// 자식 태그가 둘 이상일 경우 반드시 상위 태그가 자식 태그들을 포함하는 형태

// HTML 태그 예시
<div>
  <h2>첫번째 자식태그입니다 </h2>
  <h2>두번째 자식태그입니다.</h2>
</div>;

// -------- JSX의 객체 표현

// JSX는 React.createElement() 메소드를 사용해서 자바스크립트로 HTML 요소를 작성 가능

// 객체 생성 예시
const element7 = React.createElement(
  "태그 명", // 태그 명: HTML의 태그 명
  { className: "클래스 명" }, // 클래스 명: 클래스의 이름
  "출력 내용" // 출력 내용: 화면에 출력하고자 하는 내용
);

// 단 className은 태그의 속성으로 반드시 똑같이 사용되는 것은 아님
// 예시로 아래처럼 사용이 가능
// 아래 두 코드는 형식은 다르지만 같은 내용

// HTML 직접 표현
// const myelement7 = <h1>I Love JSX!</h1>;

// HTML을 객체로 생성
const myelement7 = React.createElement("h1", {}, "I do not use JSX!");

// -------- DOM에 엘리먼트 렌더링
// HTML파일 내에 id값이 root인 <div>태그가 있다면

<div id="root"></div>;

// index.html파일을 열어 해당 코드를 직접 확인
// 해당 <div>태그 내에 들어가는 모든 요소는 ReactDOM에서 자동으로 관리

// React는 렌더링 과정을 통해 index.js 파일에서 생성한 엘리먼트를 DOM에 제공
// 엘리먼트는 React 앱의 가장 작은 단위로 엘리먼트에 화면에 표시될 내용이 기술되어 있음

// 렌더링 예시
ReactDOM.render(element, document.getElementById("root"));

// 위의 코드는 id가 root인 태그를 찾은 후, 정의한 엘리먼트를 ReactDOM에 렌더링 하는 과정

// -------- 렌더링 된 엘리먼트 업데이트
// 엘리먼트는 불변객체
// 불변객체란, 한번 생성하면 수정이 불가능한 객체를 의미

// 기존의 엘리먼트를 수정하는 것은 불가능
// 엘리먼트를 업데이트 하기 위해서 새로운 엘리먼트를 생성한 후, ReactDOM.render()에 전달해야 함

// 해당 내용을 참고하여 버튼 클릭 횟수를 출력하는 페이지를 만들어 보자

// 지시사항
// 버튼 클릭 시, 횟수가 증가하는 함수click()을 정의
// 함수 안에서 value값을 1 증가시킨 후, 다시 value에 저장

// element를 ReactDOM에 렌더링

// Tips
// App 컴포넌트는 index.js에서 setInterval 함수를 통해 1초에 한 번씩 자동으로 호출
// 함수 내에서 1초마다 새로운 엘리먼트가 생성된 후 렌더링이 진행
// 이러한 과정을 통해 element를 업데이트 가능

// App.js
import React from "react";
import ReactDOM from "react-dom";
import "./App.css";

//버튼 클릭된 횟수를 저장
let value = 0;

//버튼 클릭시 횟수를 증가시키는 함수를 정의합니다.
function click() {
  value = value + 1;
}

function App() {
  const element = (
    <div>
      <h1>버튼을 클릭해보세요</h1>
      <button onClick={click}>Click Me!</button>
      <h2>총 {value}번 클릭했습니다.</h2>
    </div>
  );
  //ReactDOM으로 element를 렌더링합니다.
  ReactDOM.render(element, document.getElementById("root"));
}

export default App;

// index.js
import "./index.css";
import App from "./App";

//1초마다 App 컴포넌트 호출
setInterval(App, 1000);

// -------- 변경된 부분만 업데이트
// 앞의 실습에서 렌더링된 엘리먼트를 업데이트 하는 방법에 대해 공부

// ReactDOM은 엘리먼트를 업데이트할 때, 이전 엘리먼트와 비교하여 변경된 부분만 업데이트

// 실습을 실행하여 개발자 도구를 통해 변화되는 부분을 직접 확인

// 지시사항
// 제공된 코드를 실행하여 결과 페이지를 화면에 띄움
// 개발자 도구를 통해 업데이트 되는 항목을 확인
// 크롬의 오른쪽 상단의 메뉴 버튼 클릭 후 "도구 더보기" > "개발자 도구" 클릭하여 개발자 도구를 실행
// 버튼을 클릭하며 숫자가 증가할 때 마다 업데이트 되는 항목을 확인

// Tips!
// 해당 실습은 앞에서 했던 실습 내용과 동일
// 실행 후 개발자 도구로 값이 변하는 것을 직접 확인

// 개발자 도구로 확인해보면
<h2>"총 " "11" "번 클릭했습니다."</h2>;
// 여기서 숫자만 변경되는 것 확인

// -------- 함수 컴포넌트
// 앞에서는 엘리먼트 내에 UI를 작성하여 렌더링하는 방법에 대해 학습
// 지금부터는 컴포넌트를 활용하여 UI를 작성할 것

// 컴포넌트란?
// 기능을 단위별로 캡슐화하는 리액트의 기본 단위
// 컴포넌트는 함수 컴포넌트와 클래스 컴포넌트로 나뉨

// 먼저 함수 컴포넌트를 정의하는 방법에 대해 학습
// 정의 순서를 예시와 함께 확인

// 자바스크립트 문법을 활용하여 컴포넌트 정의
// 컴포넌트 명은 항상 대문자로 시작해야 함
// 컴포넌트를 호출
// ReactDOM에 렌더링

// 함수 컴포넌트 예시

//함수 컴포넌트 작성
function Hello() {
  return <h1>Hello, React!</h1>;
}

//컴포넌트 호출
const element = <Hello />;

//렌더링
ReactDOM.render(element, document.getElementById("root"));

// 함수 컴포넌트를 작성하여 정의된 이름 Sara에게 인사를 건네는 페이지를 작성해보자

// 지시사항
// 함수명이 Welcome인 컴포넌트를 작성
// 출력 시 사용되는 태그는 <h2>
// 출력문구는 하단의 출력결과와 동일해야 함
// 표현식을 이용해 name 변수를 나타낼 것
// 컴포넌트를 호출하여 element 변수에 저장
import React from "react";
import "./App.css";

//정의된 이름
const name14 = "Sara";

//함수명이 Welcome인 컴포넌트를 작성합니다.
function Welcome14() {
  return <h2>Welcome, {name14}!</h2>;
}

//컴포넌트를 호출하여 element에 저장합니다.
const element14 = <Welcome14 />;

// export default element14;

// -------- 클래스 컴포넌트
// 컴포넌트는 크게 함수 컴포넌트와 클래스 컴포넌트로 분류
// 클래스 컴포넌트를 정의하는 방법

// 클래스 컴포넌트는 React.Component를 상속받아 작성

// React.Component를 확장하는 클래스 컴포넌트에 선언
// 마찬가지로 컴포넌트 명은 항상 대문자로 시작해야 함
// render() 메소드 내에 기능을 구현해야 함
// 컴포넌트를 호출
// ReactDOM에 렌더링

// 클래스 컴포넌트 예시

//클래스 컴포넌트 작성
class Hello extends React.Component {
  render() {
    return <h1>Hello, React!</h1>;
  }
}

//컴포넌트 호출
const element5 = <Hello />;

//렌더링
ReactDOM.render(element5, document.getElementById("root"));

// 클래스 컴포넌트를 작성하여 정의된 이름에게 인사를 건네는 페이지를 작성해보자

// 지시사항
// 클래스명이 Welcome인 컴포넌트를 작성
// 해당 클래스의 render() 함수가 다음 내용을 반환하도록 작성
// 출력은 <h2>태그를 사용
// 출력문구는 하단의 출력결과와 동일해야 함
// 표현식을 이용해 name 변수를 나타내보자
// 컴포넌트를 호출하여 element에 저장

import React from "react";
import "./App.css";

//정의된 이름
const name13 = "Sara";

//클래스명이 Welcome인 컴포넌트를 작성합니다.
class Welcome extends React.Component {
  render() {
    return <h2>Welcome, {name13}!</h2>;
  }
}

//컴포넌트를 호출하여 element에 저장합니다.
const element13 = <Welcome />;

// export default element13;

// -------- 컴포넌트 렌더링
// 그동안은 React 엘리먼트를 DOM태그를 사용해 정의했다
// DOM태그란 DOM내에 정의되어 있는 태그를 의미
// 기본적으로 아래와 같은 형태로 사용

const element22 = <div />;

// 사용자가 정의한 컴포넌트를 DOM태그로 호출하여 React의 엘리먼트로 나타낼 수 있음

// 사용자 정의 클래스 컴포넌트 및 호출

//클래스 컴포넌트 작성
class Hello extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}

//컴포넌트 호출
const element23 = <Hello name="react" />;

// 해당 코드가 동작하는 순서는 다음과 같다

// <Hello name="react"/>엘리먼트로 ReactDOM.render()를 호출
// React는 {name: "react"}를 props 데이터로 전달하여 Hello 컴포넌트를 호출
// Hello 컴포넌트는 <h1>Hello, react</h1> 엘리먼트를 반환

// 이렇게 클래스 컴포넌트를 사용하는 것도 가능하지만, 이번 실습은 함수 컴포넌트를 이용해 해결해보자

// 함수 컴포넌트는 props를 사용하는데 차이가 조금 있다

// 사용자 정의 함수 컴포넌트

function Hello(props) {
  return <h1>Hello, {props.name}</h1>;
}

// props를 매개변수로 전달 받아서 사용해야 하며 this를 사용하지 않음

// 그리고 render를 함수 내에서 하지 않음
// 이렇게 함수형 컴포넌트를 반환한 뒤, index.js에서 컴포넌트를 렌더링 함

// 지시사항
// 함수명이 Welcome인 컴포넌트를 작성
// 출력은 <h2>태그를 사용
// 출력문구는 하단의 출력 결과와 동일
// props와 표현식을 이용해 name 변수를 나타내보자
// 컴포넌트를 호출하여 element에 저장
// 단, 컴포넌트 호출 시 props로 name="Sara"을 제공

// Tips!
// props란, 함수의 인자값과 동일한 역할을 수행
// 여기서는 일단 props.name을 표현식 안에 넣어 Sara가 표현된다는 것을 이해해보자
import React from "react";
import "./App.css";

//함수명이 Welcome인 컴포넌트를 작성
function Welcome(props) {
  return <h2>안녕하세요. {props.name}님!</h2>;
}

//컴포넌트를 호출하여 element에 저장
const element33 = <Welcome name="Sara" />;

// -------- 이벤트와 State 연동하기
// React로 애플리케이션을 개발하다보면 실시간으로 사용자로부터 값을 전달받아
// 컴포넌트에 반영할 일이 많기 때문에 이벤트와 State는 뗄래야 뗄 수 없는 관계라고 할 수 있음

// 아래 예시는 input element로부터 값을 입력받아 state에 반영하는 코드

// const App = () => {
//   const [inputValue, setInputValue] =
// useState("defaultValue");

//   const handleChange = (event) => {
//     setInputValue(event.target.value);
//   }

//   return (
//     <div>
//       <input onChange={hadleChange}
// defaultValue={inputValue} />
//       <br />
//       입력한 값은: {inputValue}
//     </div>
//   );
// };

// 이제 직접 사용자로부터 값을 입력받는 이벤트 핸들링 함수를 작성해보자

// 지시사항
// App 컴포넌트 내에 inputValue 라는 state를 선언
// className이 "App"인 div element 내에 <input> element를 생성
// 생성한 input element의 onChange 이벤트에서 사용자로부터 입력받은 값을 state에 반영
// 힌트: event.target.value
// input element 아래에 <span> element를 생성
// span element의 내용은 inputValue state를 출력하도록

import React, { useState } from "react";

function App2() {
  const [inputValue, setInputValue] = useState("");
  return (
    <div className="App">
      <input
        onChange={(event) => {
          setInputValue(event.target.value);
        }}
      />
      <span>{inputValue}</span>
    </div>
  );
}

// export default App2;

// -------- Effect Hook 1
// Effect Hook을 사용하면 함수 컴포넌트에서 side effect를 수행할 수 있음
// 컴포넌트가 최초로 렌더링될 때, 지정한 State나 Props가 변경될 때마다 이펙트 콜백 함수가 호출

// Effect Hook 사용 형태
// const App = () => {
//   useEffect(EffectCallback, Deps);
// }

// 예시
// // count 가 증가할 때마다 콘솔에 출력해주는 예시
// const App = () => {
//     const [count, setCount] = useState(0);
//     useEffect(() => {
//         console.log(count);
//     }, [count]);
//     return <button onClick={() => {
//         setCount(current => {
//             return current + 1;
//         });
//     }}>
//         카운트 증가
//     </button>
// }

// 그럼 직접 state 값이 바뀔 때마다 console에 변경된 값이 출력되는 코드를 작성해보자

// 지시사항
// App 컴포넌트에 inputValue 라는 값을 갖는 state를 선언
// className이 "App"인 div element 내부에 <input> element를 생성하고
// value를 생성한 inputValue state로 설정하고 사용자가 값을 입력할 때마다 state가 변경되도록 설정
// 선언한 state와 return 사이에 useEffect를 이용해 inputValue state가 변경될 때마다
// console.log를 이용해 값을 출력
// useEffect 작성 예:
// useEffect(EffectCallback, Deps);
import React, { useState, useEffect } from "react";

function App() {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    console.log(`${inputValue}`);
  }, [inputValue]);
  return (
    <div className="App">
      <input
        value={inputValue}
        onChange={(event) => {
          setInputValue(event.target.value);
        }}
      />
    </div>
  );
}

// export default App;

// -------- Effect Hook 2
// 지난 실습에서 Effect Hook을 이용하면 컴포넌트 내의 State나 Props의 변화를 감지해
// 원하는 로직을 실행할 수 있다는 점을 배워음
// 이어서 Effect Hook을 응용해 개발하는 방법 확인

// Effect Hook을 이용하면 컴포넌트가 생성됐을 때,
// 컴포넌트가 소멸될 때를 감지해서 특정 로직 실행 가능

// Effect Hook으로 컴포넌트의 생성/소멸 시의 로직을 작성하는 방법.

// 예시
// const App = () => {

//     useEffect(() => {
//         console.log("컴포넌트 생성");

//         return () => {
//             console.log("컴포넌트 소멸");
//         }
//     }, []);
//     return <div></div>
// }

// 위의 코드를 보면 useEffect의 두 번째 매개변수인 Deps에 빈 배열 넣음
// 이 때는 오직 컴포넌트의 생성과 소멸 시에만 Effect Callback 함수가 호출되게 함

// 또한 Effect Callback 함수 내에서 return 해주는 또다른 함수가 Effect의 종료 시에 호출되기 때문에
// 이는 곧 컴포넌트의 소멸 단계에 호출이 되는 함수라고 할 수 있음

// 지시사항
// src/components 디렉토리를 생성하고 Greeting.js 파일을 생성
// 생성한 Greeting.js 파일 내에 새로운 함수 컴포넌트 Greeting을 선언
// 이 컴포넌트는 <h1>안녕하세요.</h1>를 반환
// Effect Hook을 이용한 코드를 작성
// deps는 빈 배열,
// Effect Callback 함수에서는 console.log를 이용해 "컴포넌트가 생성되었습니다." 를 출력하고
// "컴포넌트가 소멸되었습니다." 를 출력하는 새로운 함수를 반환하도록 함
// useEffect(() => {
//     console.log("컴포넌트가 생성되었습니다.");
//     return () => {
//         console.log("컴포넌트가 소멸되었습니다.");
//     }
// }, []);

// Greeting 컴포넌트를 export 후 App.js로 돌아와 해당 컴포넌트를 import
// App 컴포넌트 내에 isCreated state를 선언
// 타입은 boolean이며 초기값은 false
// className이 "App"인 div element 내에 <button> element를 하나 삽입
// button의 내용은 컴포넌트 생성/제거 라고 입력하고
// onClick 이벤트 발생 시 isCreated state를 반전시키는 코드를 작성
// (현재 값이 false일 경우 true로, true일 경우 false로 전환)
// 생성한 버튼 아래쪽에 아래와 같은 코드를 작성
// 주어진 코드는 isCreated가 true일 경우 Greeting 컴포넌트를 출력한다는 의미의 코드
// 중괄호를 포함해서 입력
// {isCreated && <Greeting />}

// 코드를 실행하여 버튼을 클릭해보고 개발자 도구의 콘솔을 관찰

// -------- Greeting.js
import React, { useState, useEffect } from "react";
const Greeting = () => {
  useEffect(() => {
    console.log(`컴포넌트가 생성되었습니다.`);
    return () => {
      console.log(`컴포넌트가 소멸되었습니다.`);
    };
  }, []);
  return <h1>안녕하세요.</h1>;
};

// export default Greeting;

// -------- App.js
import React, { useState, useEffect } from "react";
import Greeting from "./components/Greeting";

function App() {
  const [isCreated, setIsCreated] = useState(false);
  return (
    <div className="App">
      <button
        onClick={(current) => {
          setIsCreated((current) => {
            return !current;
          });
        }}
      >
        컴포넌트 생성/제거
      </button>
      {isCreated && <Greeting />}
    </div>
  );
}

// export default App;
