---
categories: [React]
tags: [React, Props]
img_path: /assets/lib/post-img/
---

# Props

## 컴포넌트의 재사용

### 컴포넌트를 가지고 합성 및 추출하는 방법?

- React에서는 컴포넌트를 적절히 합성하고 추출하여 재사용하는 것이 좋음
- 코드의 재사용이 중요한 이유는 같은 동작을 하는 코드를 여러 번 작성한다면 코드의 가독성이 떨어지고 다른 사람이 보기에 이해하기가 어려워기 때문
- 또, 코드를 수정해야 할 때 여러 곳에 작성된 모든 코드를 수정하는 것은 번거로운 일
- 가능한한 재사용 가능하도록 컴포넌트를 만드는 것을 권장

- 컴포넌트 합성을 이용하면 작은 기능을 하는 컴포넌트를 결합하여 더 복잡한 기능을 구축 가능
- 또, 컴포넌트 추출을 통해서 여러 기능을 하는 컴포넌트를 작게 나눌 수 있음
- 컴포넌트는 기능이 작을수록 재사용이 쉽기 때문에 컴포넌트의 합성과 추출이 중요

  ### 컴포넌트 합성

  - 컴포넌트 안에서 다른 컴포넌트를 참조하는 것 가능

  ```jsx
  function Name() {
    return <h2>I am a sapiens!</h2>;
  }

  function Question() {
    return (
      <div>
        <h1>Who are you?</h1>
        <Name />
      </div>
    );
  }

  // index.js
  ReactDOM.render(<Question />, document.getElementById("root"));
  ```

  - Question 함수에서 Name 함수를 참조
  - 참조 방식은 지금까지 사용된 것과 동일하게 DOM 태그를 이용
  - 렌더링 할 때도 마찬가지로 DOM 태그를 이용해 호출

  ### 컴포넌트 추출

  - 한 컴포넌트가 복잡하다면 일부를 추출해서 분리하는 것이 가독성이 좋고 코드 재사용이 용이

  ```jsx
  function Comment(props) {
    return (
      <div className="Comment">
        <div className="UserInfo">
          <img
            className="Avatar"
            src={props.author.avatarUrl}
            alt={props.author.name}
          />
          <div className="UserInfo-name">{props.author.name}</div>
        </div>
        <div className="Comment-text">{props.text}</div>
        <div className="Comment-date">{formatDate(props.date)}</div>
      </div>
    );
  }
  ```

  - Comment는 사용자의 이미지를 띄우는 Avatar와 사용자 정보를 띄우는 UserInfo, 그리고 댓글의 내용과 날짜를 띄우는 Comment에 대한 요소로 3가지로 이루어져있음

  ```jsx
  function Avatar(props) {
    return (
      <img
        className="Avatar"
        src={props.user.avatarUrl}
        alt={props.user.name}
      />
    );
  }
  ```

  - 이미지를 띄우는 부분을 Avatar 컴포넌트로 분리

  ```jsx
  function UserInfo(props) {
    return (
      <div className="UserInfo">
        <Avatar user={props.user} />
        <div className="UserInfo-name">{props.user.name}</div>
      </div>
    );
  }
  ```

  - 사용자 정보를 띄우는 부분은 UserInfo 컴포넌트로 분리

  ```jsx
  function Comment(props) {
    return (
      <div className="Comment">
        <UserInfo user={props.author} />
        <div className="Comment-text">{props.text}</div>
        <div className="Comment-date">{formatDate(props.date)}</div>
      </div>
    );
  }
  ```

  - 댓글의 내용과 날짜를 띄우는 부분은 Comment 컴포넌트에 남겨두면 처음보다 컴포넌트가 간단해짐

## Props

- props는 컴포넌트로 전달되는 매개변수라고 생각하면 됨
- 쉽게 생각하면 함수의 매개변수라고 생각해도 좋음
- 컴포넌트에서 어떤 값을 전달받아 처리하고 싶다면 props를 이용해야 함
- 그리고 컴포넌트를 호출할 때 마치 함수 호출 시 매개변수를 전달하는 것처럼 props를 넘겨줘야 함

```jsx
const element = <Introduce name="sapiens" />;
function Introduce(props) {
  return <h2>I am a {props.name}!</h2>;
}
```

- props는 HTML 속성을 통해 컴포넌트로 전달
- 사용할 때는 중괄호를 이용해 표현하며 props.속성과 같은 형태로 호출
- 단, 위의 예제는 함수형 컴포넌트이고 클래스형 컴포넌트에서 사용할 때는 this를 붙여 사용
