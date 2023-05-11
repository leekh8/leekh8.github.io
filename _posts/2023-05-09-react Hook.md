---
categories: [React]
tags: [React, Hook]
img_path: /assets/lib/post-img/
---

# Hook

## Hook이란?

- 기존 함수형 컴포넌트에서도 클래스형 컴포넌트의 기능을 사용할 수 있게 하는 기능
- 즉, 함수형 컴포넌트에서 React state와 생명주기 기능(lifecycle features)을 연동(hook into) 할 수 있게 해주는 것

## 왜 사용?

- 기존의 React에서의 문제점

  - 컴포넌트 사이에서 상태와 관련된 로직을 재사용하기 어려움
  - 복잡한 컴포넌트들은 이해하기 어려움
  - 클래스는 사람과 기계를 혼동시킴
    - 즉, 클래스는 코드의 재사용성과 코드 구성을 좀 더 어렵게 만들 뿐만 아니라, React를 배우는데 큰 진입장벽
    - 예를 들어 this가 자바스크립트에서 어떻게 작동하는지 알아야만하는데 이는 대부분의 다른 언어(파이썬 등)와는 다르게 작동
  - React 16.8에서 Hook이 나오기 전에는 컴포넌트를 사용하던 중 state를 추가하고 싶을 때 클래스 컴포넌트로 바꾸곤 했지만 이제 Hook을 사용하면서 손쉽게 함수형 컴포넌트로도 state를 사용할 수 있다!
  - 즉, 클래스 없이 React를 사용할 수 있게 해주는 것

- 물론 그렇다고 클래스형 컴포넌트가 사라지는 것은 아님
- 리액트는 기존에 사용하던 것들의 하위 호환성을 중요시하기 때문에 앞으로 클래스에 대한 업데이트도 염두에 둘 예정

## Hook의 장점

- 컴포넌트의 함수가 많아질 때 클래스 구성 요소로 리팩토링할 필요가 없다
- 일반적으로 React 컴포넌트가 함수 컴포넌트로 시작하는 경우가 있는데, 함수 컴포넌트에서 클래스 컴포넌트로 변경하려면 컴포넌트 요소가 얼마나 복잡한지에 따라 약간의 리팩토링이 필요
- React hooks를 사용하면 함수 구성 요소로만 상태 관리를 할 수 있기 때문에 리팩토링 노력이 최소화

- UI에서 로직을 더 쉽게 분리하여 두 가지 모두 재사용 가능
- Hook 및 UI를 사용하면 분리하기가 더 쉽다
- 즉 코드를 재사용하기 위한 로직을 쉽게 만들 수 있다
- Hook은 더 적은 상용구와 더 직관적인 UI 및 논리 구성으로 더 세련되게 구현할 수 있음
- 코드의 재사용은 전체적으로 작성해야 할 코드의 양을 줄어들게 함
- 전체적인 코드의 양이 줄어들면 코드의 가독성 또한 좋아짐

- 기존의 코드를 다시 작성할 필요 없이 일부의 컴포넌트들 안에서 Hook을 사용할 수 있음
- Hook이 등장했다고 해서 기존의 모든 코드를 다시 작성해야 하는 것은 아님
- 기존의 코드와 잘 호환이 되기 때문에 필요한 곳에서 Hook을 사용하면 ok

- Hook을 사용하면 컴포넌트로부터 상태 관련 로직을 추상화가 가능
- Hook을 이용하면 컴포넌트별로 독립적인 테스트와 재사용이 가능
- Hook은 컴포넌트 간 계층 변화 없이 상태 관련 로직을 재사용할 수 있도록 도와줌

## Hook의 종류

### State Hook

- Hook이 나오기 전에는 컴포넌트의 상태 관리를 하려면 클래스 기반 React 컴포넌트를 작성해야 했다
- 대표적으로 상태 관리가 필요한 경우인 사용자 입력을 위한 컴포넌트를 작성한다고 생각해보자

```jsx
import React, { Component } from "react";

class UserFormClass extends Component {
  state = { userID: "", email: "" };
  handleClick = ({ target: { name, value } }) => {
    this.setState({ [name]: value });
  };
  render() {
    const { userID, email } = this.state;
    return (
      <>
        <label>
          userID:
          <input
            type="text"
            name="userID"
            value={userID}
            onChange={this.handleClick}
          />
        </label>
        <label>
          userID:
          <input
            type="email"
            name="email"
            value={email}
            onChange={this.handleClick}
          />
        </label>
      </>
    );
  }
}
```

- 위의 예제 코드는 사용자의 ID와 이메일을 입력받기 위한 전형적인 React 컴포넌트
- 클래스 컴포넌트의 this.state 필드에 userID와 email 값을 저장해두고 사용자가 이 값을 변경할 때마다 값이 갱신되고 다시 화면에 반영
- 이렇게 간단한 상태 관리조차도 클래스 기반 컴포넌트로 작성해야 한다는 불편함 때문에 클래스 기반 컴포넌트는 함수 기반 컴포넌트보다 복잡하고 따라서 오류가 발생하기 쉽고 유지 보수가 힘들다

- 하지만 State Hook의 useState()를 사용하면 함수형 컴포넌트에서 이를 간단히 사용할 수 있다
- 아래와 같은 문법을 이용하면 위의 예시에 등장한 userID나 email 같은 state를 함수형 컴포넌트가 사용 가능

`const [<상태 값 저장 변수>, <상태 값 갱신 함수>] = userState(<상태 초깃값>);`

- 이렇게 useState() 함수를 사용하여 클래스 기반 컴포넌트를 함수 기반으로 작성하면 컴포넌트 상태를 관리하기 위한 코드 역시 매우 간단해진다
- useState() 함수는 배열을 리턴하는데 첫 번째 원소는 상태 값을 저장할 변수이고 두 번째 원소는 해당 상태 값을 갱신할 때 사용할 수 있는 함수
- useState() 함수에 인자로 해당 상태의 초깃값을 넘길 수 있다

- State Hook이 등장한 이후 이미 짜놓은 컴포넌트를 모조리 재작성하는 것은 권장하지 않지만 새로 작성하는 컴포넌트부터는 Hook을 이용하는 것이 권장되고 있다!

### Effect Hook

- useEffect()는 단어에서 알 수 있듯이 함수형 컴포넌트에서 side effects들을 실행하는 것

- React 컴포넌트 안에서 데이터를 가져오거나 구독하고, DOM을 직접 조작하는 작업을 이전에도 종종 해본 이런 모든 동작을 “side effects”(또는 짧게 “effects”)라고 한다
- 쉽게 말해 함수(React의 함수형 컴포넌트) 외부에서 로컬의 상태 값을 변경하는 것
- 이러한 과정은 다른 컴포넌트에 영향을 줄 수도 있어 렌더링 과정에서는 구현할 수 없는 작업

- Effect Hook의 useEffect()는 함수형 컴포넌트 내에서 이런 side effects를 수행할 수 있게 해준다

- 간단한 카운터 예제
- React 클래스의 생명주기 메소드인 componentDidMount() 나 componentDidUpdate()는 로직이 분리되어 있다
- 따라서 버튼 클릭 때마다 1씩 count를 하는 카운터 컴포넌트에서 매 렌더링 시에도 count를 갱신하고 State가 업데이트될 때에도 count를 갱신하고 싶다면 두 메소드를 동시에 사용해야 한다

- 생명주기 메소드를 사용하는 대신 useEffect()를 이용한다면 쉽게 구현할 수 있다

```jsx
import React, { useState, useEffect } from 'react';

const Example = () = > {
const [count, setCount] = useState(0);

    useEffect() => {
     documen.title = 'You checked ${count} times';

     };

return (
<div>
<p> You clicked {count} times </p>
<button onClick={() => setCount(count + 1)}> Click Me</button>
</div>
);
};
export default Example;
```

- useEffect()를 사용하는 방법은 위 코드처럼 내가 원하는 effects(여기서는 document.title을 바꾸는 것)를 동작해줄 함수 useEffect()를 작성해주면 되는 것
- 타이틀 바꾸는 것 외에도 필수적인 API를 불러오거나 데이터를 가져올 때도 사용 할 수 있다
- useEffect()를 사용하면 모든 렌더링하는 요소마다 원하는 작업을 수행할 수 있어 코드를 중복할 필요가 없다

- 위에서 언급한”필수적인 API를 불러오거나 데이터를 가져올 때”는 쉽게 말해 프론트엔드에서 백엔드의 데이터를 사용하는 데 필요한 과정을 말한다
- 이러한 과정을 원래는 컴포넌트의 생명주기마다 구현해주어야 했는데, Effect Hook이 이를 간단하게 해준 것!

## Hook의 규칙

- 자바스크립트의 함수인 Hook을 사용하기 위한 두 가지 큰 규칙

  1. 최상위(at the Top Level)에서만 Hook을 호출

  - 반복문(while), 조건문 (if) 혹은 중첩된 함수 내에 Hook을 호출하면 안 된다
  - Hook은 렌더링 시 항상 동일한 순서로 호출이 되어야 하며 그렇지 않을 경우 버그가 발생

  - 따라서 React가 useState()와 useEffect()가 여러 번 호출되는 중에도 Hook의 상태를 올바르게 유지할 수 있도록 해줘야 한다
  - Hook은 React 함수의 최상위(at the top level)에서 호출되는 규칙을 따르면 컴포넌트가 렌더링 될 때마다 항상 동일한 순서로 Hook이 호출되는 것이 보장할 수 있다

  2. 오직 React 함수 내에서 Hook을 호출해야 한다

  - Hook을 일반적인 자바스크립트 함수에서 호출하면 안 된다
  - Hook은 아래에 설명된 곳에서만 호출할 수 있다

    - React 함수 컴포넌트에서 Hook을 호출할 수 있다
    - 나만의 Hook에서 Hook을 호출할 수 있다

- 이 규칙을 지켜야만 컴포넌트의 모든 상태 관련 로직을 소스 코드에서 명확하게 볼 수 있다

## 규칙을 지켜야 하는 이유

- Hook 사용 규칙을 지키지 않으면?

  ```jsx
  // 조건문 안에서 Hook을 사용함으로써 1번 규칙을 깼습니다.
  if (name !== "") {
    useEffect(function persistForm() {
      localStorage.setItem("formData", name);
    });
  }
  ```

  - name !== '' 조건은 첫 번째 렌더링에서 참이기 때문에 Hook은 동작한다
  - 하지만 사용자가 그다음 렌더링에서 폼을 초기화하면서 조건을 거짓으로 만들 수 있다
  - 렌더링 간에 Hook을 건너뛰기 때문에 Hook 호출 순서는 달라진다 (변경된 name을 Hook에서 알 수가 없게 됨)

  - React의 특정 state가 어떤 useState()에서 호출되었는지 알 수 있는 이유는 React가 Hook이 호출되는 순서에 의존하기 때문
  - 즉, 모든 렌더링에서 Hook의 호출 순서는 같아서 Hook이 올바르게 동작할 수 있는 것

  - 하지만 Hook을 조건문 안에서 호출한다면 Hook을 건너뛰는 경우가 생길 수 있고 Hook을 호출하는 순서가 달라짐
  - 이에 따라 건너뛴 Hook 다음에 호출되는 Hook의 순서가 하나씩 밀리면서 버그를 발생
  - 이것이 컴포넌트 최상위에서만 Hook을 호출하는 이유

- 만약 조건부로 side effect를 실행하길 원한다면, 조건문을 Hook 내부에 넣으면 된다
  ```jsx
  useEffect(function persistForm() {
    // 더 이상 규칙을 어기지 않습니다.
    if (name !== "") {
      localStorage.setItem("formData", name);
    }
  });
  ```
