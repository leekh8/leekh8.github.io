---
title: "📘React 기초 정리 2 "
description: "Props는 컴포넌트 외부에서 값을 전달하고, State는 컴포넌트 내부에서 동적으로 변화하는 값을 관리한다"
date: 2023-05-02
update: 2024-03-29
tags:
  - React
  - Props
  - State
  - Basic
series: "React Basic"
---

## React 기초 정리 — Props와 State 완전 정복

React를 처음 배울 때 가장 먼저 마주치는 두 개념이 바로 **Props**와 **State**다. 이 두 가지를 제대로 이해해야 React 컴포넌트를 올바르게 설계할 수 있다. 이 글에서는 기초부터 심화까지, 그리고 실전에서 자주 하는 실수까지 모두 다룬다.

---

## 1. Props란 무엇인가?

Props는 **Properties**의 줄임말로, 부모 컴포넌트가 자식 컴포넌트에게 데이터를 전달할 때 사용하는 메커니즘이다. 함수의 인자(argument)와 같은 역할을 한다.

### 기본 사용법

```jsx
// 자식 컴포넌트
const Welcome = (props) => {
  return <h1>Hello, {props.name}!</h1>
}

// 부모 컴포넌트
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

위 예제에서 `name`이라는 props를 자식 컴포넌트 `Welcome`에 전달하고 있다. JSX에서 HTML 속성처럼 작성하면 자식 컴포넌트의 `props` 객체를 통해 접근할 수 있다.

### 구조 분해 할당으로 깔끔하게 쓰기

매번 `props.name`처럼 쓰는 대신, ES6 구조 분해 할당을 사용하면 더 깔끔하다.

```jsx
// 방법 1: 파라미터에서 바로 구조분해
const Welcome = ({ name, age, city }) => {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>Age: {age}</p>
      <p>City: {city}</p>
    </div>
  )
}

// 방법 2: 함수 내부에서 구조분해
const Welcome = (props) => {
  const { name, age, city } = props
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>Age: {age}</p>
      <p>City: {city}</p>
    </div>
  )
}
```

---

## 2. Props 심화: defaultProps로 기본값 설정하기

부모 컴포넌트가 특정 props를 전달하지 않았을 때 기본값을 지정할 수 있다. 이를 `defaultProps`라고 한다.

```jsx
const Button = ({ label, color, size }) => {
  return (
    <button
      style={{
        backgroundColor: color,
        fontSize: size === 'large' ? '18px' : '14px',
        padding: '8px 16px',
      }}
    >
      {label}
    </button>
  )
}

// defaultProps 설정
Button.defaultProps = {
  label: '클릭',
  color: '#4CAF50',
  size: 'medium',
}

// 사용: label만 전달해도 나머지는 기본값으로
const App = () => {
  return (
    <div>
      <Button label="저장" color="#2196F3" />
      <Button label="삭제" color="#f44336" size="large" />
      <Button /> {/* 모든 기본값 사용 */}
    </div>
  )
}
```

> **참고**: React 함수형 컴포넌트에서는 `defaultProps` 대신 ES6 기본값 문법을 더 많이 사용한다.

```jsx
// defaultProps 대신 기본값 파라미터 사용 (더 현대적인 방식)
const Button = ({ label = '클릭', color = '#4CAF50', size = 'medium' }) => {
  return (
    <button style={{ backgroundColor: color }}>
      {label}
    </button>
  )
}
```

---

## 3. PropTypes로 타입 검사하기

JavaScript는 동적 타입 언어라 잘못된 타입의 props를 전달해도 바로 에러가 나지 않는다. `prop-types` 라이브러리를 사용하면 개발 환경에서 경고를 받을 수 있다.

```bash
npm install prop-types
```

```jsx
import PropTypes from 'prop-types'

const UserCard = ({ name, age, isAdmin, hobbies, onClick }) => {
  return (
    <div className="user-card">
      <h2>{name} {isAdmin && '(관리자)'}</h2>
      <p>나이: {age}세</p>
      <ul>
        {hobbies.map((hobby, index) => (
          <li key={index}>{hobby}</li>
        ))}
      </ul>
      <button onClick={onClick}>프로필 보기</button>
    </div>
  )
}

// PropTypes 정의
UserCard.propTypes = {
  name: PropTypes.string.isRequired,        // 문자열, 필수
  age: PropTypes.number.isRequired,          // 숫자, 필수
  isAdmin: PropTypes.bool,                   // 불리언, 선택
  hobbies: PropTypes.arrayOf(PropTypes.string), // 문자열 배열
  onClick: PropTypes.func,                   // 함수
}

UserCard.defaultProps = {
  isAdmin: false,
  hobbies: [],
  onClick: () => {},
}
```

`PropTypes`가 제공하는 주요 타입 검사기:

| 타입 검사기 | 설명 |
|---|---|
| `PropTypes.string` | 문자열 |
| `PropTypes.number` | 숫자 |
| `PropTypes.bool` | 불리언 |
| `PropTypes.array` | 배열 |
| `PropTypes.object` | 객체 |
| `PropTypes.func` | 함수 |
| `PropTypes.node` | 렌더링 가능한 모든 것 |
| `PropTypes.element` | React 엘리먼트 |
| `PropTypes.arrayOf(type)` | 특정 타입의 배열 |
| `PropTypes.shape({})` | 특정 구조의 객체 |
| `.isRequired` | 필수 props 지정 |

> **TypeScript를 사용한다면?** TypeScript를 쓸 경우 PropTypes 없이도 타입 안전성을 확보할 수 있다. 최신 프로젝트에서는 TypeScript + React를 조합하는 경우가 많다.

---

## 4. children prop: 컴포넌트 안에 컴포넌트 넣기

React에는 특별한 props가 있는데, 바로 `children`이다. JSX 태그 사이에 넣은 내용이 `children`으로 전달된다.

```jsx
// children을 받는 컴포넌트 (래퍼 컴포넌트)
const Card = ({ title, children, className }) => {
  return (
    <div className={`card ${className}`}>
      <div className="card-header">
        <h3>{title}</h3>
      </div>
      <div className="card-body">
        {children}  {/* 여기에 자식 요소들이 렌더링됨 */}
      </div>
    </div>
  )
}

// 사용
const App = () => {
  return (
    <div>
      <Card title="사용자 정보" className="user-card">
        <p>이름: Amy</p>
        <p>이메일: amy@example.com</p>
        <button>수정</button>
      </Card>

      <Card title="공지사항">
        <ul>
          <li>시스템 점검 안내</li>
          <li>새 기능 업데이트</li>
        </ul>
      </Card>
    </div>
  )
}
```

`children`을 활용하면 레이아웃 컴포넌트, 모달, 카드 같은 **컨테이너 컴포넌트**를 만들 때 매우 유용하다.

---

## 5. Spread Props: props 한꺼번에 전달하기

여러 props를 한 번에 전달하고 싶을 때 스프레드 연산자를 사용할 수 있다.

```jsx
const Input = ({ label, id, ...rest }) => {
  // label, id는 따로 사용하고, 나머지 속성들은 input 엘리먼트에 전달
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} {...rest} />
    </div>
  )
}

const App = () => {
  const inputProps = {
    type: 'email',
    placeholder: '이메일을 입력하세요',
    required: true,
    autoComplete: 'email',
  }

  return (
    <Input
      label="이메일"
      id="email"
      {...inputProps}  // 스프레드로 한꺼번에 전달
    />
  )
}
```

다만 스프레드 props는 **남용하면 어떤 props가 전달되는지 추적하기 어려워지므로** 신중하게 사용해야 한다.

---

## 6. Props Drilling 문제

컴포넌트가 깊이 중첩될수록 데이터를 전달하기 위해 중간 컴포넌트들이 사용하지도 않는 props를 계속 내려줘야 하는 문제가 생긴다. 이를 **Props Drilling**이라고 한다.

```jsx
// Props Drilling 예시: theme을 계속 내려줘야 함
const App = () => {
  const theme = 'dark'
  return <Page theme={theme} />
}

const Page = ({ theme }) => {
  return <Sidebar theme={theme} />
}

const Sidebar = ({ theme }) => {
  return <Menu theme={theme} />
}

const Menu = ({ theme }) => {
  return <MenuItem theme={theme} />
}

const MenuItem = ({ theme }) => {
  // 드디어 실제로 theme을 사용하는 컴포넌트
  return (
    <li style={{ color: theme === 'dark' ? 'white' : 'black' }}>
      메뉴 항목
    </li>
  )
}
```

`Page`, `Sidebar`, `Menu`는 `theme`을 직접 사용하지 않지만 전달만 한다. 컴포넌트가 5단계, 10단계로 깊어지면 관리가 매우 어려워진다.

**해결 방법:**
- **Context API**: React 내장 전역 상태 공유 (다음 글에서 다룸)
- **상태 관리 라이브러리**: Redux, Zustand, Jotai 등
- **컴포넌트 합성(Composition)**: children이나 render props 패턴 활용

---

## 7. State란 무엇인가?

State는 컴포넌트 내부에서 관리되는 **동적 데이터**다. 사용자 상호작용, API 응답, 시간 경과 등으로 인해 변할 수 있는 값을 State로 관리한다.

Props가 "외부에서 주어지는 값"이라면, State는 "컴포넌트 스스로 관리하는 값"이다.

```jsx
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>현재 카운트: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(count - 1)}>-1</button>
      <button onClick={() => setCount(0)}>초기화</button>
    </div>
  )
}
```

`useState`는 배열을 반환하는데, 첫 번째 요소는 **현재 State 값**, 두 번째 요소는 **State를 변경하는 함수**다.

---

## 8. State 심화: 비동기 업데이트 주의점

State 업데이트는 **즉각적으로 반영되지 않는다**. React는 성능 최적화를 위해 여러 State 업데이트를 묶어서 한 번에 처리(배치 처리)한다.

```jsx
function Counter() {
  const [count, setCount] = useState(0)

  const handleBadClick = () => {
    // 이렇게 하면 3이 아니라 1만 증가할 수 있다!
    setCount(count + 1)
    setCount(count + 1)
    setCount(count + 1)
    // 세 번 모두 같은 'count' 값을 참조하기 때문
  }

  const handleGoodClick = () => {
    // 함수형 업데이트를 사용하면 최신 state를 보장
    setCount(prev => prev + 1)
    setCount(prev => prev + 1)
    setCount(prev => prev + 1)
    // 이렇게 하면 정확히 3이 증가
  }

  return (
    <div>
      <p>카운트: {count}</p>
      <button onClick={handleBadClick}>잘못된 방법 (+3 시도)</button>
      <button onClick={handleGoodClick}>올바른 방법 (+3)</button>
    </div>
  )
}
```

**핵심 원칙**: 이전 State를 기반으로 새 State를 계산할 때는 반드시 **함수형 업데이트** (`prev => prev + 1`)를 사용한다.

---

## 9. 여러 State 관리하기

하나의 컴포넌트에서 여러 State를 관리할 때는 두 가지 접근법이 있다.

### 방법 1: 여러 useState 사용 (단순한 값에 적합)

```jsx
function UserForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [age, setAge] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    // API 호출...
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="이름" />
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="이메일" />
      <input value={age} onChange={(e) => setAge(e.target.value)} placeholder="나이" />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? '전송 중...' : '제출'}
      </button>
    </form>
  )
}
```

### 방법 2: 객체 State 사용 (관련 데이터 묶기)

```jsx
function UserForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 범용 핸들러: input name 속성을 이용
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,      // 기존 데이터 복사 (불변성 유지!)
      [name]: value // 해당 필드만 업데이트
    }))
  }

  return (
    <form>
      <input name="name" value={formData.name} onChange={handleChange} placeholder="이름" />
      <input name="email" value={formData.email} onChange={handleChange} placeholder="이메일" />
      <input name="age" value={formData.age} onChange={handleChange} placeholder="나이" />
    </form>
  )
}
```

---

## 10. 배열 State 다루기

배열을 State로 관리할 때도 **불변성**을 지켜야 한다. 배열을 직접 변경하는 메서드(`push`, `pop`, `splice` 등)는 사용하지 말고, 새로운 배열을 반환하는 메서드를 사용해야 한다.

```jsx
function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'React 공부하기', done: false },
    { id: 2, text: '운동하기', done: true },
  ])
  const [inputText, setInputText] = useState('')

  // 항목 추가
  const addTodo = () => {
    if (!inputText.trim()) return
    const newTodo = {
      id: Date.now(),
      text: inputText,
      done: false,
    }
    setTodos(prev => [...prev, newTodo])  // 새 배열 생성
    setInputText('')
  }

  // 완료 토글
  const toggleTodo = (id) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    )
  }

  // 항목 삭제
  const deleteTodo = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }

  return (
    <div>
      <div>
        <input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="할 일 입력..."
        />
        <button onClick={addTodo}>추가</button>
      </div>
      <ul>
        {todos.map(todo => (
          <li key={todo.id} style={{ textDecoration: todo.done ? 'line-through' : 'none' }}>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => toggleTodo(todo.id)}
            />
            {todo.text}
            <button onClick={() => deleteTodo(todo.id)}>삭제</button>
          </li>
        ))}
      </ul>
      <p>총 {todos.length}개 / 완료 {todos.filter(t => t.done).length}개</p>
    </div>
  )
}
```

배열 조작 시 불변성을 지키는 패턴 정리:

| 작업 | 잘못된 방법 (직접 변경) | 올바른 방법 (새 배열) |
|---|---|---|
| 추가 | `arr.push(item)` | `[...arr, item]` |
| 앞에 추가 | `arr.unshift(item)` | `[item, ...arr]` |
| 삭제 | `arr.splice(idx, 1)` | `arr.filter((_, i) => i !== idx)` |
| 수정 | `arr[idx] = newItem` | `arr.map((item, i) => i === idx ? newItem : item)` |
| 정렬 | `arr.sort()` | `[...arr].sort()` |

---

## 11. 불변성(Immutability)이란? 왜 중요한가?

불변성은 "한 번 만든 데이터를 직접 수정하지 않는다"는 원칙이다. React에서 불변성이 중요한 이유는 **React가 State 변경을 감지하는 방식** 때문이다.

### React의 변경 감지 방식

React는 State가 변경되었는지 확인하기 위해 **얕은 비교(Shallow Comparison)**를 사용한다. 즉, 객체의 내용이 바뀌었는지 깊이 비교하는 것이 아니라, **참조(Reference)가 바뀌었는지**를 확인한다.

```jsx
// 잘못된 예: 참조가 바뀌지 않아 React가 변경을 감지 못함
const [user, setUser] = useState({ name: 'Amy', age: 30 })

const badUpdate = () => {
  user.age = 31  // 직접 수정
  setUser(user)  // 같은 참조이므로 React가 변경을 감지 못함!
}

// 올바른 예: 새 객체를 생성하여 참조 변경
const goodUpdate = () => {
  setUser(prev => ({
    ...prev,  // 기존 객체의 속성을 복사
    age: 31   // 변경할 속성만 덮어씀
  }))
}
```

### 중첩 객체에서의 불변성

중첩 객체에서는 스프레드 연산자가 **얕은 복사**를 하기 때문에 주의가 필요하다.

```jsx
const [state, setState] = useState({
  user: {
    name: 'Amy',
    address: {
      city: '서울',
      district: '강남구',
    }
  }
})

// 중첩된 객체를 안전하게 업데이트
const updateCity = (newCity) => {
  setState(prev => ({
    ...prev,
    user: {
      ...prev.user,
      address: {
        ...prev.user.address,
        city: newCity,
      }
    }
  }))
}
```

깊이 중첩된 객체를 다룰수록 코드가 복잡해진다. 이를 해결해주는 라이브러리가 있다.

### Immer 라이브러리: 불변성을 쉽게

`immer`는 불변성을 자동으로 처리해준다. 마치 직접 수정하는 것처럼 코드를 작성해도, 내부적으로는 새 객체를 생성해준다.

```bash
npm install immer
```

```jsx
import { useState } from 'react'
import { produce } from 'immer'

const [state, setState] = useState({
  user: {
    name: 'Amy',
    address: {
      city: '서울',
      district: '강남구',
    }
  },
  todos: [
    { id: 1, text: '공부', done: false }
  ]
})

// immer 사용: 직접 수정하는 것처럼 코드 작성
const updateCity = (newCity) => {
  setState(produce(draft => {
    draft.user.address.city = newCity  // 직접 수정처럼 보이지만 안전
  }))
}

const toggleTodo = (id) => {
  setState(produce(draft => {
    const todo = draft.todos.find(t => t.id === id)
    if (todo) todo.done = !todo.done  // 직접 수정
  }))
}
```

`immer`는 특히 중첩이 깊은 State를 다룰 때 코드 가독성을 크게 향상시킨다.

---

## 12. 리렌더링: 언제 컴포넌트가 다시 렌더링되나?

React 컴포넌트는 다음 세 가지 상황에서 리렌더링된다:

1. **자신의 State가 변경될 때**
2. **부모로부터 받는 Props가 변경될 때**
3. **부모 컴포넌트가 리렌더링될 때** (props가 바뀌지 않아도!)

```jsx
const Parent = () => {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('Amy')

  console.log('Parent 렌더링')

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>카운트 증가</button>
      <Child name={name} />  {/* count가 바뀌어도 Child는 리렌더링됨! */}
    </div>
  )
}

const Child = ({ name }) => {
  console.log('Child 렌더링')
  return <p>이름: {name}</p>
}
```

버튼을 클릭하면 `count`가 변해서 `Parent`가 리렌더링되고, `Child`도 따라서 리렌더링된다. `name`은 바뀌지 않았는데도 말이다.

---

## 13. React.memo로 불필요한 렌더링 방지

`React.memo`는 컴포넌트를 메모이제이션하는 고차 컴포넌트(HOC)다. props가 변경되지 않으면 리렌더링을 건너뛴다.

```jsx
import { useState, memo } from 'react'

const Parent = () => {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('Amy')

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>카운트: {count}</button>
      <button onClick={() => setName('Andy')}>이름 변경</button>
      <MemoizedChild name={name} />
    </div>
  )
}

// React.memo로 감싸기
const MemoizedChild = memo(({ name }) => {
  console.log('Child 렌더링')
  return <p>이름: {name}</p>
})

// 또는 컴포넌트를 선언할 때 바로 감싸기
const Child = memo(({ name }) => {
  return <p>이름: {name}</p>
})
```

이제 `count`가 변해도 `Child`는 리렌더링되지 않는다. `name`이 바뀔 때만 리렌더링된다.

### React.memo의 커스텀 비교 함수

기본적으로 `React.memo`는 얕은 비교를 사용하지만, 두 번째 인자로 커스텀 비교 함수를 전달할 수 있다.

```jsx
const MyComponent = memo(
  ({ data }) => {
    return <div>{data.value}</div>
  },
  (prevProps, nextProps) => {
    // true를 반환하면 리렌더링 안 함
    // false를 반환하면 리렌더링 함
    return prevProps.data.id === nextProps.data.id
  }
)
```

> **주의**: `React.memo`를 남용하면 오히려 성능이 나빠질 수 있다. 비교 자체에도 비용이 들기 때문이다. 실제로 성능 문제가 있을 때만 사용한다.

---

## 14. 실전 예제: TodoList 완성 구현

지금까지 배운 Props, State, 불변성, React.memo를 모두 활용한 완성된 TodoList 예제다.

```jsx
import { useState, memo, useCallback } from 'react'

// 할 일 항목 컴포넌트 - React.memo로 최적화
const TodoItem = memo(({ todo, onToggle, onDelete }) => {
  console.log(`TodoItem 렌더링: ${todo.id}`)
  return (
    <li
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        textDecoration: todo.done ? 'line-through' : 'none',
        color: todo.done ? '#aaa' : '#333',
        padding: '8px 0',
      }}
    >
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => onToggle(todo.id)}
      />
      <span style={{ flex: 1 }}>{todo.text}</span>
      <span style={{ fontSize: '12px', color: '#999' }}>
        {new Date(todo.createdAt).toLocaleDateString()}
      </span>
      <button
        onClick={() => onDelete(todo.id)}
        style={{ color: '#f44336', background: 'none', border: 'none', cursor: 'pointer' }}
      >
        삭제
      </button>
    </li>
  )
})

// 입력 컴포넌트
const TodoInput = memo(({ onAdd }) => {
  const [text, setText] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    onAdd(text.trim())
    setText('')
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="할 일을 입력하세요..."
        style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
      />
      <button
        type="submit"
        style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        추가
      </button>
    </form>
  )
})

// 필터 컴포넌트
const TodoFilter = memo(({ filter, onChange }) => {
  return (
    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
      {['all', 'active', 'done'].map(f => (
        <button
          key={f}
          onClick={() => onChange(f)}
          style={{
            padding: '4px 12px',
            backgroundColor: filter === f ? '#2196F3' : '#eee',
            color: filter === f ? 'white' : '#333',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {f === 'all' ? '전체' : f === 'active' ? '진행 중' : '완료'}
        </button>
      ))}
    </div>
  )
})

// 메인 TodoList 컴포넌트
function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'React Props 공부하기', done: true, createdAt: Date.now() - 86400000 },
    { id: 2, text: 'React State 공부하기', done: true, createdAt: Date.now() - 43200000 },
    { id: 3, text: '불변성 개념 이해하기', done: false, createdAt: Date.now() },
  ])
  const [filter, setFilter] = useState('all')

  // useCallback으로 함수 메모이제이션 (TodoItem 재렌더링 방지)
  const handleAdd = useCallback((text) => {
    setTodos(prev => [
      ...prev,
      { id: Date.now(), text, done: false, createdAt: Date.now() }
    ])
  }, [])

  const handleToggle = useCallback((id) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    )
  }, [])

  const handleDelete = useCallback((id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }, [])

  // 필터링된 할 일 목록
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.done
    if (filter === 'done') return todo.done
    return true
  })

  const doneCount = todos.filter(t => t.done).length

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>Todo List</h1>
      <p style={{ color: '#666' }}>
        {doneCount}/{todos.length} 완료
        {doneCount === todos.length && todos.length > 0 && ' 모두 완료!'}
      </p>

      <TodoInput onAdd={handleAdd} />
      <TodoFilter filter={filter} onChange={setFilter} />

      {filteredTodos.length === 0 ? (
        <p style={{ color: '#999', textAlign: 'center' }}>할 일이 없습니다.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {filteredTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

export default TodoList
```

---

## 15. 자주 하는 실수 모음

### 실수 1: State를 직접 수정하기

```jsx
// 잘못된 코드
const [user, setUser] = useState({ name: 'Amy', age: 30 })

const birthday = () => {
  user.age++        // 직접 수정 - React가 감지하지 못함!
  setUser(user)     // 같은 참조라서 리렌더링 안 됨
}

// 올바른 코드
const birthday = () => {
  setUser(prev => ({ ...prev, age: prev.age + 1 }))
}
```

### 실수 2: 비동기 함수에서의 stale closure

```jsx
// 문제 상황
function Timer() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      // 여기서 count는 항상 0! (클로저가 초기값을 캡처)
      setCount(count + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])  // 빈 의존성 배열

  return <p>{count}</p>
}

// 해결: 함수형 업데이트 사용
function Timer() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => prev + 1)  // 항상 최신 값을 기반으로
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return <p>{count}</p>
}
```

### 실수 3: 렌더링 중에 State 변경하기

```jsx
// 잘못된 코드 - 무한 렌더링 루프 발생!
function BadComponent() {
  const [count, setCount] = useState(0)
  setCount(count + 1)  // 렌더링 중에 State 변경!
  return <p>{count}</p>
}

// 올바른 코드 - useEffect로 사이드 이펙트 처리
function GoodComponent({ initialValue }) {
  const [count, setCount] = useState(initialValue)
  // 렌더링 중에는 State 변경하지 않음
  return <p>{count}</p>
}
```

### 실수 4: key 없이 리스트 렌더링

```jsx
// 잘못된 코드 - key 없음
todos.map(todo => <TodoItem todo={todo} />)

// 잘못된 코드 - 인덱스를 key로 사용 (항목이 삭제/재정렬될 때 문제)
todos.map((todo, index) => <TodoItem key={index} todo={todo} />)

// 올바른 코드 - 고유한 id 사용
todos.map(todo => <TodoItem key={todo.id} todo={todo} />)
```

---

## 16. Props vs State 정리

| 구분 | Props | State |
|---|---|---|
| 정의 | 부모에서 전달받는 외부 데이터 | 컴포넌트가 직접 관리하는 내부 데이터 |
| 변경 가능 여부 | 읽기 전용 (자식이 변경 불가) | 변경 가능 (setState 함수 사용) |
| 변경 주체 | 부모 컴포넌트 | 컴포넌트 자신 |
| 변경 시 리렌더링 | 변경되면 자식 리렌더링 | 변경되면 해당 컴포넌트 리렌더링 |
| 초기값 | 부모가 전달한 값 | useState()의 인자 |

---

## 마치며

Props와 State는 React의 핵심이다. 이 두 가지를 제대로 이해하면 React로 어떤 UI든 설계할 수 있다. 특히 다음 세 가지를 항상 명심하자.

1. **Props는 읽기 전용**, 자식 컴포넌트에서 절대 수정하지 않는다.
2. **State는 항상 불변성을 유지**하며 업데이트한다.
3. **이전 State를 기반으로 업데이트할 때는 함수형 업데이트**를 사용한다.

다음 글에서는 React Hooks(useEffect, useRef, useMemo, useCallback, useContext)를 본격적으로 다룬다.

---

[^1]: https://legacy.reactjs.org/docs/components-and-props.html
[^2]: https://www.geeksforgeeks.org/reactjs-setstate/
[^3]: https://ko.legacy.reactjs.org/docs/state-and-lifecycle.html
[^4]: https://react.dev/learn/updating-objects-in-state
[^5]: https://immerjs.github.io/immer/
