---
title: "📘React 기초 정리 3 "
description: "Props는 컴포넌트 외부에서 값을 전달하고, State는 컴포넌트 내부에서 동적으로 변화하는 값을 관리한다"
date: 2023-05-05
update: 2024-04-15
tags:
  - React
  - Props
  - State
  - Basic
series: "React Basic"
---

## React 기초 정리 📘

## Props와 State: React 컴포넌트의 핵심 이해하기 🚀

React를 사용하여 멋진 웹 애플리케이션을 만들기 위해 반드시 알아야 할 두 가지 개념, Props와 State에 대해 자세히 알아보자.[^1]

### 📦 Props란? 🤔

Props는 properties의 줄임말로, 컴포넌트 간에 데이터를 전달할 때 사용하는 입력값이다.
부모 컴포넌트로부터 자식 컴포넌트로 데이터를 넘겨줄 수 있다.

- 기본 사용법 🛠️

  ```jsx
  // 컴포넌트 생성
  const Welcome = props => {
    return <h1>Hello, {props.name} 🌟</h1>
  }
  // 컴포넌트 사용
  const App = () => {
    return (
      <div>
        <Welcome name="Amy" />
        <Welcome name="Andy" />
        <Welcome name="Sapiens" />
      </div>
    )
  }
  ```

- Props는 읽기 전용.
- 컴포넌트 내에서 Props를 변경하려고 하면 안 된다. 🚫

  ```jsx
  // 잘못된 예
  const Welcome = props => {
    let greeting = "Sir " + props.name // 이렇게 사용하세요!
    return <h1>Hello, {greeting}</h1>
  }
  ```

### 🎨 JSX와 HTML의 차이점

JSX에서는 HTML과 다르게 작성되는 속성들이 있다.
예를 들어, class는 className으로, for는 htmlFor로 사용된다.

- CamelCase 사용 🐫
  - `<div tabIndex="0"></div>`
- data-와 aria- 속성은 그대로 사용 ✅
  - `<div aria-label="Close" data-testid="close-button"></div>`

### 💾 State란? 🤔

State는 컴포넌트 내부에서 관리되는 데이터이다.
사용자의 상호작용에 따라 동적으로 데이터를 변경할 수 있다.

- 기본 사용법 🛠️

  ```jsx
  import { useState } from "react"

  function Counter() {
    const [count, setCount] = useState(0)

    return (
      <div>
        <p>You clicked {count} times 🔥</p>
        <button onClick={() => setCount(count + 1)}>Click me</button>
      </div>
    )
  }
  ```

- State 값을 직접 변경하지 않고, 반드시 setState 함수(여기서는 setCount)를 사용해야 한다. 🔄[^2]

이렇게 Props와 State를 이해하고 활용하면, React에서 더욱 동적이고 반응적인 웹 애플리케이션을 만들 수 있다! 🌈

### State를 변경하는 두 가지 방법과 Object를 갖는 State를 만들 때 주의할 점 🛠️

React에서 State를 관리하는 방법은 매우 중요하다.
특히, State가 객체를 포함할 때는 더욱 주의해야 한다.
State를 변경하는 두 가지 방법과 객체를 포함하는 State를 만들 때 주의해야 할 점을 살펴보자.

#### State 변경 방법

1. setState 내에 변경할 값 넣기

```jsx
const [count, setCount] = useState(0)
setCount(count + 1)
```

- 가장 기본적인 방법으로, 직접 변경할 값을 setState에 넣어준다.

2. setState에 함수 넣기

- 함수가 반환하는 값으로 State 변경
- 현재 값을 기반으로 State를 변경하고자 하는 경우, 함수 넣기 방법을 권장

```jsx
const [count, setCount] = useState(0)
setCount(current => {
  return current + 1
})
```

#### Object를 갖는 State 만들 때 주의할 점 🛠️

Object를 값으로 갖는 State도 가능하지만, React가 State의 변경을 감지하지 못하는 경우가 있다.
예를 들어, Object 내부의 속성만 변경되고 Object 자체는 변경되지 않았기 때문이다.

```jsx
const [user, setUser] = useState({ name: "sapiens", age: 30 })
setUser(current => {
  current.age = 29
  return current
})
```

- 위와 같이 사용하면, React는 user Object의 변경을 감지하지 못한다.

이를 해결하기 위해서는, 기존 Object의 내용을 새로운 Object에 담고 변경해야 한다.
즉, 새로운 Object를 생성하여 반환해야 React가 State의 변경을 감지할 수 있다.

```jsx
const [user, setUser] = useState({ name: "sapiens", age: 30 })
setUser(current => {
  const newUser = { ...current }
  newUser.age = 29
  return newUser
})
```

- 이 방법을 사용하면, user의 age가 변경되었을 때 React가 이를 감지하고 UI를 업데이트할 수 있다.

React에서 State를 효과적으로 관리하는 것은 애플리케이션의 성능과 유지 보수성에 큰 영향을 미친다.
특히, Object를 포함하는 State를 다룰 때는 불변성(Immutability)을 유지하는 것이 중요하다.
이를 통해 예측 가능한 State 관리와 성능 최적화를 달성할 수 있다. 🚀[^3]

[^1]: https://legacy.reactjs.org/docs/components-and-props.html
[^2]: https://www.geeksforgeeks.org/reactjs-setstate/
[^3]: https://ko.legacy.reactjs.org/docs/state-and-lifecycle.html
