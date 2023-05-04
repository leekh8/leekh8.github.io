// -------- JSX --------

// JS XML의 약자
// 여기서 XML은 HTML의 한계를 극복하기 위해 만들어진 마크업 언어
// JSX는 JS를 확장한 문법
// HTML을 React에서 쉽게 쓰기 위해 사용

const element1 = <h1> Hello, elice! </h1>;

// 코드에는 HTML 태그가 들어가지만 그렇다고 해당 코드가 HTML 문법은 아님
// 이러한 문법이 바로 JSX이며, React에서 사용되는 문법
// React는 JSX 문법을 이용해 마크업 언어와 코드의 로직을 따로 분리하지 않고
// 두 가지를 포함한 컴포넌트라는 것을 사용

// -------- 변수

// 변수 선언 방식은 const, let, var 세 가지
// 형태: 변수선언방식 변수명 (= 값);

//선언과 동시에 값을 할당 가능
var a1;
var a1 = 10;
// 선언 이후에 값을 할당 가능
a1 = 10;

// 재선언: 같은 이름의 변수를 같은 선언 방식으로 똑같이 만드는 것
// 재할당: 선언 후 초기화된 변수의 값을 변경하는 것을 의미

// var 같은 경우 아래처럼 재선언이 가능
// 다른 선언 방식은 불가능

var name1 = "Chris";
var name1 = "John";

// var과 let은 아래와 같은 재할당이 가능하지만 const는 불가능

let name2 = "Chris";
name2 = "John";

// |-----------|-------|--------|
// |  선언방식  | 재할당 | 재선언 |
// |-----------|-------|--------|
// |    var    |  가능  |  가능  |
// |    let    |  가능  | 불가능 |
// |   const   | 불가능 | 불가능 |
// |-----------|-------|--------|

// -------- 표현식

// JSX에서 중괄호를 이용해 사용 가능한 표현식들의 예시

// 중괄호를 이용해 HTML 내에 변수를 표현
const name3 = "elice";
const element2 = <h1> Hello, {name3}! </h1>;

//중괄호를 이용해 함수 표현식을 넣는 것 가능
function greeting1() {
  return "Hello, elice!";
}

const element3 = <h1>{greeting1()}</h1>;

// 함수 내에서 표현식을 적용
function formatGreeting1(name) {
  return "Hello" + " " + name;
}

function getGreeting2(user) {
  return <h1>Hello, {formatGreeting1("elice!")}!</h1>;
}

// -------- 속성

// 큰 따옴표를 이용해 JSX의 속성을 지정

const element4 = <a href="https://kdt.elice.io/explore">엘리스로 이동</a>;

// 속성도 표현식을 이용해 지정하는 것도 가능

const link1 = "https://kdt.elice.io/explore";
const element6 = <a href={link1}>엘리스로 이동</a>;

// -------- 자식 정의

// 자식 태그가 여러개 포함된 코드를 저장하기 위해서는
// 자식 태그를 부모 태그로 감싸야 함
// 여기 아래 예시에서는 <div> 태그가 부모 태그, <h1>과 <h2>가 자식 태그

const element7 = (
  <div>
    <h1>Hello,</h1>
    <h2>elice!</h2>
  </div>
);

// 모든 태그는 반드시 닫혀야 한다는 것에 유의
// 다만 아래 코드에서 원래 태그 이름을 맞춰서 </input>처럼 닫아야 하지만,
// 이름은 생략하고 />만 이용해서 닫아도 괜찮

const element8 = <input type="text" />;

// -------- 객체 표현

// React.createElement() 메소드를 이용하면 JSX 문법을 이용하지 않고 객체로 표현 가능
// 아래의 두 코드는 문법이 조금 다르지만 같은 내용
// 기존 JSX 문법 대신에 React.createElement() 메소드를 이용하여
// 매개변수로 헤더, 속성, 출력 값을 순서대로 넘겨줌

const element9 = <h1 className="greeting9">Hello, world!</h1>;
const element10 = React.createElement(
  "h1",
  { className: "greeting10" },
  "Hello, world!"
);

// -------- 엘리먼트 렌더링 --------

// 엘리먼트란?
// React 앱의 가장 작은 단위
// 컴포넌트의 구성요소

// 엘리먼트에 화면에 표시할 것들을 기록
// 쉽게 말하자면 HTML 요소

// 렌더링은 이러한 요소들을 화면에 그리는 것

// -------- ReactDOM과 렌더링

// DOM(Document Object Model)이란 객체 지향 모델을 통해 구조화된 문서를 표현하는 형식
// React는 가상(Virtual) DOM과 실제로 표시되는 DOM을 유지
// React는 실제 DOM을 추상화하여 가상 DOM에 만들어두고,
// 데이터가 업데이트되면 한 번에 렌더링하기 때문에 계속해서 DOM을 렌더링하는 것보다 속도가 빠름
// ReactDOM.render() 메소드를 이용하면 렌더링

// HTML 파일 안에 id가 root인 요소가 있다고 가정
<div id="root"></div>;

// 해당 HTML에 텍스트를 넣기 위해 ReactDOM.render()을 이용해 다음과 같이 렌더링 가능
const element = <h1>Hello, elice</h1>;
ReactDOM.render(element, document.getElementById("root"));

// 매개변수로는 표시할 엘리먼트와 HTML 어디에서 표시할 지를 넘겨줌
// 이 때 document.getElementById() 의 매개변수에
// 찾을 id를 넘겨줌으로써 표시할 위치를 찾을 수 있음
// 해당 함수는 넘겨준 id의 요소 가져옴

// -------- 엘리먼트 업데이트
// 엘리먼트는 한 번 생성되면 수정이 불가능한 불변 객체이기 때문에
// 값을 변경하고 싶으면 새로운 엘리먼트를 만들어 업데이트 해야 함
// 만약 시간을 출력하는 기능을 구현하고 싶다면 매 초마다 렌더링 해줘야 함
function tick() {
  const element = (
    <div>
      <h1>{new Date().toLocaleTimeString()}</h1>
    </div>
  );
  ReactDOM.render(element, document.getElementById("root"));
}

setInterval(tick, 1000);

// Date객체의 toLocaleTimeString() 메소드를 이용하면 시간을 반환해주는데
// 실제로 시간이 변하는 것을 확인하기 위해서는
// setInterval() 콜백을 이용해 tick을 계속해서 호출해야 함
// setInterval()의 매개변수인 1000은 1초를 의미하며 해당 숫자를 바꿔 호출되는 간격을 변경 가능
// 해당 코드를 실행한 후 개발자 도구를 이용하면 HTML의 텍스트가 시간이 변함에 따라 똑같이 바뀌는 것을 확인 가능

// -------- 컴포넌트 --------
// 컴포넌트 한 마디 정의?
// 앱의 기능을 단위별로 캡슐화하는 React의 기본 단위
// 쉽게는 HTML 요소를 반환하는 함수와 같다고 생각해도 됨
// 따라서 컴포넌트는 독립적이고 재사용 가능한 코드의 조각
// 컴포넌트 종류:  함수형 컴포넌트와 클래스형 컴포넌트

// -------- 함수형 컴포넌트
// 함수형 컴포넌트를 어떻게 사용해야 하는지 예제와 함께 확인해보자
// 먼저 함수형 컴포넌트를 선언해주고,
// ReactDOM.render()를 이용해 렌더링
// 매개변수로 함수형 컴포넌트를 <함수 이름 />와 같은 형태로 넘겨주고 요소를 표기할 곳을 함께 넘겨줌
function Introduce() {
  return <h2>Hi, I am elice!</h2>;
}

ReactDOM.render(<Introduce />, document.getElementById("root"));

// -------- 클래스형 컴포넌트
// 클래스형 컴포넌트도 마찬가지로 렌더링을 해주면 되며 구조만 약간 다름
// class 선언 시 React.Component의 메소드들을 사용하기 위해서
// extends를 이용해 React.Component를 상속받도록 구현해야 함
// 상속 시 해당 클래스형 컴포넌트에서
// render() 메소드가 구현되어야 하는데 HTML을 반환해주면 됨

// 아래는 위의 함수형 컴포넌트와 동일한 기능
class Introduce extends React.Component {
  render() {
    return <h2>Hi, I am elice!</h2>;
  }
}

ReactDOM.render(<Introduce />, document.getElementById("root"));

// -------- 언제 사용?
// 함수형 컴포넌트와 클래스형 컴포넌트가 언제 사용?

// 함수형 컴포넌트:
// 단순히 HTML UI를 반환하는 간단한 자바스크림트 함수로 자주 사용
// 단순히 데이터를 받고 렌더링을 하면 끝이기 때문에 비상태형 컴포넌트라고도 함

// 즉, 상태를 사용하지 않고 함수에 대한 결과를 반환하는데,
// 여기서 상태란 React의 State를 의미하며
// 컴포넌트의 렌더링 결과물에 영향을 주는 데이터를 갖고 있는 객체

// 쉽게 말하자면 컴포넌트의 현재 저장된 값이 State

// 클래스형 컴포넌트:
// 이러한 논리와 상태를 구현할 때 사용되어 상태형 컴포넌트
// HTML을 반환하는 render() 메소드가 구현되어,
// 복잡한 UI 로직을 구현할 때 클래스형 컴포넌트 사용

// 특히 위에서 언급한 State를 사용할 때 반드시 클래스형 컴포넌트로 구현이 되어야 함

// -------- DOM 태그
// 컴포넌트 렌더링 시 넘겨주었던 <함수 혹은 클래스 이름 />은
// 아래와 같은 엘리먼트를 만들어서 렌더링 시 넘겨줘도 괜찮음
// 해당 태그를 DOM 태그라고 함

const element11 = <Introduce />;
// 이러한 DOM 태그를 아래처럼 정의할 수도 있음
// name을 엘리먼트에서 함께 넘겨주고 함수형 컴포넌트에서 props를 이용해 넘겨준 name을 받을 수 있음
// props가 메소드의 매개변수 역할을 한다고 생각하면 됨

function Introduce(props) {
  return <h1>Hello, {props.name}</h1>;
}

const element12 = <Introduce name="Elice" />;
ReactDOM.render(element, document.getElementById("root"));
