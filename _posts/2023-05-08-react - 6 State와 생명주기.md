---
categories: [React]
tags: [React, State, 생명주기]
img_path: /assets/lib/post-img/
---

# State와 생명주기

## State

- State는 앞서 배운 Props처럼 컴포넌트의 렌더링 결과물에 영향을 주는 데이터를 갖고 있는 객체
- 다만 Props는 컴포넌트에 전달되어 사용되는 반면 State는 컴포넌트 안에서 관리된다는 것의 차이
- 즉, Props는 함수의 매개변수처럼 사용되는 것
- State는 함수 내에 선언된 변수처럼 사용되는 것

```jsx
function tick() {
  const element = (
    <div>
      <h1>{new Date().toLocaleTimeString()}</h1>
    </div>
  );
  ReactDOM.render(element, document.getElementById("root"));
}

setInterval(tick, 1000);
```

- 위의 시간을 표시하는 컴포넌트에서 현재 시간을 띄우는 코드를 따로 캡슐화하여 시간을 표시하는 부분과 분리해보자

```jsx
function Clock(props) {
  return (
    <div>
      <h1>{props.date.toLocaleTimeString()}.</h1>
    </div>
  );
}

function tick() {
  ReactDOM.render(<Clock date={new Date()} />, document.getElementById("root"));
}

setInterval(tick, 1000);
```

- 그러기 위해 시간을 표시하는 컴포넌트에서 실제 시간을 가져올 때 Props를 이용
- 참고로 이런식으로 캡슐화를 하는 경우, 시간을 표시하는 양식이 달라졌을 때 시간을 구해주는 tick 컴포넌트를 변경없이 그대로 사용할 수 있고, Clock 컴포넌트는 다른 나라의 시간을 넘겨주면 재사용이 가능

```jsx
class Clock extends React.Component {
  render() {
    return (
      <div>
        <h1>{this.props.date.toLocaleTimeString()}.</h1>
      </div>
    );
  }
}
```

- 위에서 Props를 사용한 이유는 함수형 컴포넌트에서는 State를 사용할 수 없기 때문
- 함수형 컴포넌트에서 State를 사용하려면 useState를 사용해야 함
- 여기서 함수형 컴포넌트를 클래스형 컴포넌트로 변환해보자
- 클래스형 컴포넌트를 만들 때 React.Component를 상속받고 render() 메소드를 구현해야 하는 것을 유의하며 변환
- HTML 요소 자체는 그대로 사용

```jsx
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = { date: new Date() };
  }

  render() {
    return (
      <div>
        <h1>{this.state.date.toLocaleTimeString()}.</h1>
      </div>
    );
  }
}

ReactDOM.render(<Clock />, document.getElementById("root"));
```

- State로 구현한 결과
- render() 메소드에서 props를 state로 바꿔주고, 클래스 내에 초기 this.state를 지정하는 constructor()를 추가
- this.state에 실제 시간이 입력
- 그리고 실제로 렌더링을 하는 ReactDOM.render()을 작성
- 기존의 tick 컴포넌트와 다르게 더 이상 필요없는 date props는 지우고 작성

## Props vs State

- Props와 State의 가장 큰 차이?

  - Props는 부모 컴포넌트에서 자식 컴포넌트로 전달하는 값으로 자식 컴포넌트에서는 Props를 직접 수정할 수 없지만
  - State는 컴포넌트 내부에서 선언하며 내부에서 관리되는 값으로 값을 변경할 수 있다는 점

- 따라서 값이 변경되어야하는 상황, 예를 들면 매초 변하는 시간을 출력해야 하거나 버튼 클릭시 값이 변하는 것을 출력해야 한다면 State를 사용해야 함
- 정리하면 Props는 읽기 전용으로 수정이 불가능하고, State는 원하는 경우 수정이 가능하기 때문에 상황에 따라 알맞은 것을 사용해보자

## setState(): State의 값을 변경하기 위한 메소드

- State를 변경하기 위해서는 직접 값을 수정하는 것이 아니라 setState() 메소드를 이용
- 아래는 버튼 클릭 시 출력되는 텍스트가 red에서 blue로 수정되는 코드
- 참고로 시간이 변하는 것처럼 주기적으로 발생하는 것이 아니라 버튼 클릭과 같은 특정 이벤트로 상태가 변하는 것을 State가 비동기적으로 변경된다고 표현

```jsx
class Change extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: "red"
    };
  }
  changeColor = () => {
    this.setState({ color: "blue" });
  };
  render() {
    return (
      <div>
        <h1>It is a {this.state.color}</h1>
        <button type="button" onClick={this.changeColor}>
          Change color
        </button>
      </div>
    );
  }
}
```

## 생명주기

- 클래스 컴포넌트에 적용되는 생명주기(Life cycle)란 앱이 실행되고 종료되는 과정을 특정 시점 별로 나눠둔 것
- 파이썬의 클래스 객체로 예를 들면, 클래스가 생성되면 생성자가 호출되고 소멸되면 소멸자가 호출
- 간단하지만 이러한 요소의 시작과 끝이 바로 생명주기!

### React의 생명주기

- React의 생명주기는 컴포넌트가 이벤트를 다룰 수 있는 특정 시점을 말하며 마운트, 업데이트, 언마운트 상태로 구성
  - 마운트
    - 컴포넌트가 실제 DOM에 삽입되는 것
  - 업데이트
    - 컴포넌트가 변하는 것
  - 언마운트
    - 컴포넌트가 DOM 상에서 제거되는 것을

### 생명주기 메소드

- 특정 시점별 호출되는 생명주기 메소드

- constructor()
  - State 데이터를 초기화 하는 메소드
- render()
  - 클래스 컴포넌트에서 반드시 구현되어야 하는 메소드
- componentDidMount()
  - 컴포넌트가 마운트 된 직후 호출되는 메소드
- componentDidUpdate()
  - 업데이트가 진행된 직후에 호출되는 메소드
- componentWillUnmount()
  - 컴포넌트가 마운트 해제되어 제거되기 직전에 호출되는 메소드

```jsx
class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = { favoritecolor: "red" };
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({ favoritecolor: "yellow" });
    }, 1000);
  }
  render() {
    return <h1>My Favorite Color is {this.state.favoritecolor}</h1>;
  }
}

ReactDOM.render(<Header />, document.getElementById("root"));
```

- componentDidMount()를 사용한 예시
- 마운트 직후 해당 함수가 호출되면서 표시된 색깔이 red에서 yellow로 변경
- 참고로 setTimeout()을 이용해서 실행이 되는 타이머를 설정 가능
- 따라서 현재 코드를 실행하면 처음에는 red가 표시되다가 1초 뒤에 yellow로 변함

### 사용 시점?

- 만약 동적인 앱을 만들고 싶다면 이러한 생명주기에 대한 지식 필요
- 예를 들어 사용자가 특정 행동을 완료할 때마다 알림을 주고 싶다면 컴포넌트가 마운트 된 이후 호출되는 componentDidMount() 메소드를 이용해 알림을 줄 수가 있어야 함
- 즉 원하는 시점에 따라 컴포넌트가 다른 동작을 실행하길 원한다면, 생명주기 메소드에 대한 지식 필요
