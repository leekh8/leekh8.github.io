---
categories: [React]
tags: [React, Hooks]
img_path: /assets/lib/post-img/
---

# Hooks

## hooks?

- 컴포넌트에서 데이터를 state(관리) 하고 데이터가 변경될 때 effert(상호작용) 하기 위해 사용
  - 대표적인 예: useState
- 기존 컴포넌트 내에서 state와 생명 주기를 관리하기 위해 반드시 사용해야 했던 class component의 복잡함을 보완하기 위해 react ver.16.8에 추가
- 함수 컴포넌트에서 클래스 컴포넌트의 기능 구현
  ### 유의사항
  - react 함수 내에서만 (component, hook) 사용 가능
  - 이름의 시작이 반드시 `use`
  - 최상위 level에서만 hook 호출 가능
    - if문, for문 내, 콜백 함수에서 호출하지 않을 것
  ```jsx
  const App = () => {
    const [username, setUsername] = useState("");
    return (
      <div>
        <h1>welcome, {username}</h1>
      </div>
    );
  };
  ```

## State Hook과 Effect Hook

### state hook

```jsx
const App = () => {
  // 일반적인 useState 사용법
  const [state이름, setState이름] = useState(초기값);
};
```

- useState는 컴포넌트 내 동적인 데이터를 관리할 수 있는 hook
- 최초에 useState가 호출될 때 초기값으로 설정되며 이후 재 렌더링이 될 경우 무시됨
- state는 읽기 전용이므로 직접 수정하지 않을 것
- state 변경을 위해 setState 이용
- state가 변경되면 자동으로 컴포넌트가 재 렌더링

```jsx
const App = () => {
  const [title, setTitle] = useState("");

  // state를 변경할 값 직접 입력
  setTitle("hello");

  // 또는 현재 값을 매개변수로 받는 함수 선언
  // return 값이 state에 반영
  setTitle((current) => {
    return current + " world";
  });
};
```

- state 변경을 위해
  - setState 함수에 직접 값을 입력
  - 현재 값을 매개변수로 받는 함수를 전달해 함수에서 return 되는 값이 state에 반영되도록 함

### effect hook

```jsx
const App=()=>{
  useEffect(EffectCallback, Deps?)
}
```

- effect hook 사용해 함수 컴포넌트에서 side effect 수행 가능
- 컴포넌트가 최초로 렌더링될 때, 지정한 state나 prop이 변경될 때마다 이펙트 콜백 함수 호출
  - Deps?
    - 변경을 감지할 변수들의 집합(배열)
  - EffectCallback?
    - Deps에 지정된 변수가 변경될 때 실행할 함수

```jsx
const App = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log(`clicked the button ${count} times`);
  }, [count]);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}></button>
    </div>
  );
};
```

```jsx
const App = () => {
  useEffect(()=>{
// state가 변경될 때, 컴포넌트를 렌더링할 때
    const intervalId = setInterval(() => {
      console.log(`hello`);
    }, 1000);

    // 컴포넌트를 재 렌더링 하기 전에, 컴포넌트가 없어질 때
    return ()={
      clearInterval(intervalId)
    }
  }, [])
}
```

- useEffect의 이펙트 함수 내에서 다른 함수를 return할 경우 state가 변경되어 컴포넌트가 다시 렌더링되기 전과 컴포넌트가 없어질 때(destroy) 호출할 함수를 지정

## 그 외의 Hooks

### 다양한 내장 hook

#### useMemo

```jsx
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

- 지정한 state나 propㄴ가 변경될 경우 해당 값을 활용해 계산된 값을 메모이제이션해 재 렌더링 시 불필요한 연산 줄임

```jsx
const App = () => {
  const [firstName, setFirstName] = useState("sapiens");
  const [lastName, setLastName] = useState("lee");
  // 이름과 성이 바뀔때마다 풀네임을 메모이제이션
  const fullName = useMemo(() => {
    return `${firstName} ${lastName}`;
  }, [firstName, lastName]);
};
```

- 렌더링 단계에서 연산이 이루어지기 때문에 오래 걸리는 로직은 작성하지 않는 것을 권장

#### useCallback

- 함수를 메모이제이션하기 위해 사용되는 hook
- 컴포넌트가 재 렌더링될 때 불필요하게 함수가 다시 생성되는 것을 방지

```jsx
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

```jsx
const App = () => {
  const [firstName, setFirstName] = useState("sapiens");
  const [lastName, setLastName] = useState("lee");
  // 이름과 성이 바뀔때마다 풀네임을 return 하는 함수를 메모이제이션
  const getFullName = useCallback(() => {
    return `${firstName} ${lastName}`;
  }, [firstName, lastName]);
  return <>{getFullName()}</>;
};
```

- `useMemo(() => fn, deps)` === `useCallback(fn, deps)`

#### useRef

- 컴포넌트 생애 주기 내에서 유지할 ref 객체 반환

```jsx
const refContainer = useRef(initialValue);
```

```jsx
const App = () => {
  const inputRef = useFef(null);
  const onButtonClick = () => {
    inputRef.current.focus();
  };
  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={onButtonClick}>focus on the input</button>
    </div>
  );
};
```

- ref 객체는 `.current`라는 프로퍼티를 가지며, 이 값을 자유롭게 변경 가능
- 일반적으로 react에서 DOM element에 접근할 때 사용
  - DOM element의 ref 속성 이용
- useRef에 의해 반환된 ref 객체가 변경되어도 컴포넌트 재 렌더링 되지 않음
