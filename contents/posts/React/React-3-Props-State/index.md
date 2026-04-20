---
title: "📘React 기초 정리 3 — Hooks 완전 정복"
description: "useState부터 useEffect, useRef, useMemo, useCallback, useContext까지 React Hooks를 실전 예제로 완전히 정리합니다."
date: 2023-05-05
update: 2024-04-15
tags:
  - React
  - Hooks
  - useEffect
  - useMemo
  - useCallback
  - Basic
series: "React Basic"
---

## React Hooks 완전 정복

React 16.8에서 도입된 **Hooks**는 함수형 컴포넌트에서도 State와 생명주기 기능을 사용할 수 있게 해준 혁신적인 변화다. 이 글에서는 주요 Hooks 전부를 실전 예제와 함께 깊게 살펴본다.

---

## 1. Hooks란? 왜 등장했나?

Hooks가 등장하기 전, React는 클래스형 컴포넌트와 함수형 컴포넌트 두 가지가 있었다. 함수형 컴포넌트는 단순하고 가볍지만, State 관리나 생명주기 메서드를 사용할 수 없었다. 복잡한 기능을 구현하려면 반드시 클래스 컴포넌트를 써야 했다.

### 클래스형 컴포넌트의 문제점

```jsx
// 클래스형 컴포넌트 — 복잡하고 장황하다
class UserProfile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null,
      loading: true,
      error: null,
    }
    this.handleClick = this.handleClick.bind(this)  // this 바인딩 필수
  }

  componentDidMount() {
    this.fetchUser()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.userId !== this.props.userId) {
      this.fetchUser()
    }
  }

  componentWillUnmount() {
    // 클린업 로직
  }

  fetchUser() {
    fetch(`/api/users/${this.props.userId}`)
      .then(res => res.json())
      .then(user => this.setState({ user, loading: false }))
      .catch(error => this.setState({ error, loading: false }))
  }

  handleClick() {
    // this 바인딩 없으면 에러
  }

  render() {
    const { user, loading, error } = this.state
    if (loading) return <p>로딩 중...</p>
    if (error) return <p>에러 발생</p>
    return <div>{user.name}</div>
  }
}
```

클래스형 컴포넌트의 주요 문제:
- `this` 바인딩 문제로 인한 버그
- 생명주기 메서드에 관련 없는 로직이 섞임 (`componentDidMount`에 여러 API 호출)
- 로직 재사용이 어려움 (HOC, render props 패턴이 복잡함)
- 클래스 자체가 JavaScript 초보자에게 낯선 개념

### Hooks로 변환하면

```jsx
// 함수형 컴포넌트 + Hooks — 훨씬 간결하다
function UserProfile({ userId }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(user => { setUser(user); setLoading(false) })
      .catch(error => { setError(error); setLoading(false) })
  }, [userId])  // userId가 바뀔 때마다 재실행

  if (loading) return <p>로딩 중...</p>
  if (error) return <p>에러 발생</p>
  return <div>{user.name}</div>
}
```

훨씬 짧고 직관적이다. 이게 Hooks의 힘이다.

---

## 2. useState 심화

`useState`는 가장 기본적인 Hook이지만 알아야 할 세부 사항이 있다.

### 지연 초기화(Lazy Initialization)

초기값 계산이 무거울 때, 매 렌더링마다 계산하지 않도록 **함수를 전달**할 수 있다.

```jsx
// 매 렌더링마다 실행됨 (불필요한 계산)
const [data, setData] = useState(heavyCalculation())

// 지연 초기화: 최초 렌더링에만 실행됨
const [data, setData] = useState(() => heavyCalculation())

// 실제 예시: localStorage에서 초기값 읽기
const [theme, setTheme] = useState(() => {
  const saved = localStorage.getItem('theme')
  return saved || 'light'
})
```

### 함수형 업데이트

이전 State 값을 기반으로 업데이트할 때는 함수형 업데이트를 사용한다.

```jsx
function Counter() {
  const [count, setCount] = useState(0)

  // 함수형 업데이트: 항상 최신 state 값을 보장
  const increment = () => setCount(prev => prev + 1)
  const decrement = () => setCount(prev => prev - 1)
  const double = () => setCount(prev => prev * 2)
  const reset = () => setCount(0)

  // 여러 번 연속 업데이트 시 함수형이 안전
  const incrementThree = () => {
    setCount(prev => prev + 1)
    setCount(prev => prev + 1)
    setCount(prev => prev + 1)
    // 결과: 정확히 3 증가
  }

  return (
    <div>
      <p>카운트: {count}</p>
      <button onClick={increment}>+1</button>
      <button onClick={decrement}>-1</button>
      <button onClick={double}>x2</button>
      <button onClick={incrementThree}>+3</button>
      <button onClick={reset}>초기화</button>
    </div>
  )
}
```

---

## 3. useEffect 완전 정복

`useEffect`는 컴포넌트가 렌더링된 후에 실행되는 사이드 이펙트를 처리한다. API 호출, 이벤트 리스너 등록, DOM 직접 조작 등에 사용한다.

### 의존성 배열의 세 가지 형태

```jsx
// 1. 의존성 배열 없음: 매 렌더링 후마다 실행
useEffect(() => {
  console.log('매번 실행')
})

// 2. 빈 배열: 최초 마운트 시 한 번만 실행
useEffect(() => {
  console.log('마운트 시 한 번만')
  fetchInitialData()
}, [])

// 3. 의존성 지정: 해당 값이 변경될 때마다 실행
useEffect(() => {
  console.log(`userId가 ${userId}로 변경됨`)
  fetchUserData(userId)
}, [userId])
```

### 클린업(Cleanup) 함수

`useEffect`는 반환값으로 클린업 함수를 받을 수 있다. 컴포넌트가 언마운트되거나 다음 effect가 실행되기 전에 호출된다.

```jsx
function ChatRoom({ roomId }) {
  useEffect(() => {
    // 이벤트 리스너 등록
    const socket = connectToRoom(roomId)
    socket.on('message', handleMessage)

    console.log(`방 ${roomId}에 연결됨`)

    // 클린업: 언마운트되거나 roomId가 바뀌기 전에 실행
    return () => {
      socket.off('message', handleMessage)
      socket.disconnect()
      console.log(`방 ${roomId}에서 연결 해제`)
    }
  }, [roomId])

  return <div>채팅방: {roomId}</div>
}
```

클린업이 필요한 경우:
- 이벤트 리스너 (`addEventListener` → `removeEventListener`)
- 타이머 (`setInterval` → `clearInterval`)
- 소켓 연결 해제
- 비동기 요청 취소 (`AbortController`)

### 비동기 함수와 useEffect

`useEffect`의 콜백은 직접 `async`로 만들 수 없다. 내부에 async 함수를 정의해서 호출해야 한다.

```jsx
// 잘못된 코드 (경고 발생)
useEffect(async () => {
  const data = await fetchData()
  setData(data)
}, [])

// 올바른 방법 1: 내부에 async 함수 정의
useEffect(() => {
  const fetchUser = async () => {
    try {
      const response = await fetch(`/api/users/${userId}`)
      const data = await response.json()
      setUser(data)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  fetchUser()
}, [userId])

// 올바른 방법 2: AbortController로 요청 취소 처리
useEffect(() => {
  const controller = new AbortController()

  const fetchUser = async () => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        signal: controller.signal,
      })
      const data = await response.json()
      setUser(data)
    } catch (error) {
      if (error.name !== 'AbortError') {
        setError(error.message)
      }
    }
  }

  fetchUser()

  return () => controller.abort()  // 컴포넌트 언마운트 시 요청 취소
}, [userId])
```

### 무한 루프 주의

useEffect 안에서 State를 변경하고, 그 State가 의존성 배열에 있으면 무한 루프가 발생한다.

```jsx
// 무한 루프 발생!
const [count, setCount] = useState(0)
useEffect(() => {
  setCount(count + 1)  // count를 변경하면 리렌더링 → 다시 effect 실행 → 무한반복
}, [count])

// 해결: 함수형 업데이트로 의존성 제거
useEffect(() => {
  const timer = setInterval(() => {
    setCount(prev => prev + 1)  // count 없이도 안전하게 증가
  }, 1000)
  return () => clearInterval(timer)
}, [])  // count가 의존성 배열에 없어도 됨
```

---

## 4. useRef: DOM 참조와 값 유지

`useRef`는 두 가지 용도로 사용한다: DOM 엘리먼트 직접 접근, 리렌더링 없이 값 유지.

### DOM 참조

```jsx
function TextInputWithFocus() {
  const inputRef = useRef(null)

  const focusInput = () => {
    inputRef.current.focus()  // DOM 엘리먼트에 직접 접근
  }

  const clearInput = () => {
    inputRef.current.value = ''
    inputRef.current.focus()
  }

  return (
    <div>
      <input ref={inputRef} type="text" placeholder="여기에 입력..." />
      <button onClick={focusInput}>포커스</button>
      <button onClick={clearInput}>지우기</button>
    </div>
  )
}
```

### 리렌더링 없이 값 유지

`useRef`는 `.current` 값이 변해도 컴포넌트를 리렌더링하지 않는다. 타이머 ID나 이전 props 값을 저장할 때 유용하다.

```jsx
function StopWatch() {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef(null)  // 타이머 ID 저장 (리렌더링 불필요)

  const start = () => {
    if (isRunning) return
    setIsRunning(true)
    intervalRef.current = setInterval(() => {
      setTime(prev => prev + 1)
    }, 1000)
  }

  const stop = () => {
    clearInterval(intervalRef.current)
    setIsRunning(false)
  }

  const reset = () => {
    clearInterval(intervalRef.current)
    setIsRunning(false)
    setTime(0)
  }

  return (
    <div>
      <p>{time}초</p>
      <button onClick={start} disabled={isRunning}>시작</button>
      <button onClick={stop} disabled={!isRunning}>정지</button>
      <button onClick={reset}>리셋</button>
    </div>
  )
}
```

### 이전 값 저장 (previous value)

```jsx
function usePrevious(value) {
  const prevRef = useRef()

  useEffect(() => {
    prevRef.current = value  // 렌더링 후 이전 값 저장
  })

  return prevRef.current  // 현재 렌더링에서는 이전 값 반환
}

function PriceTracker({ price }) {
  const prevPrice = usePrevious(price)

  const diff = price - (prevPrice || price)
  const direction = diff > 0 ? '▲' : diff < 0 ? '▼' : '—'
  const color = diff > 0 ? 'red' : diff < 0 ? 'blue' : 'black'

  return (
    <div>
      <span>현재 가격: {price.toLocaleString()}원</span>
      <span style={{ color }}>
        {direction} {Math.abs(diff).toLocaleString()}원
      </span>
    </div>
  )
}
```

---

## 5. useMemo: 계산 결과 캐싱

`useMemo`는 복잡한 계산 결과를 메모이제이션한다. 의존성 값이 바뀌지 않으면 이전 계산 결과를 재사용한다.

```jsx
import { useState, useMemo } from 'react'

function ProductList({ products, searchQuery, category }) {
  // 필터링 + 정렬 — 비용이 큰 연산
  const filteredProducts = useMemo(() => {
    console.log('필터링 연산 실행')
    return products
      .filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = category === 'all' || p.category === category
        return matchesSearch && matchesCategory
      })
      .sort((a, b) => a.price - b.price)
  }, [products, searchQuery, category])  // 이 세 값이 바뀔 때만 재계산

  const totalPrice = useMemo(() => {
    return filteredProducts.reduce((sum, p) => sum + p.price, 0)
  }, [filteredProducts])

  return (
    <div>
      <p>총 {filteredProducts.length}개 / 합계: {totalPrice.toLocaleString()}원</p>
      <ul>
        {filteredProducts.map(p => (
          <li key={p.id}>{p.name} - {p.price.toLocaleString()}원</li>
        ))}
      </ul>
    </div>
  )
}
```

### useMemo 사용 기준

`useMemo`를 항상 쓰는 것이 좋을 것 같지만, 과용하면 오히려 성능이 나빠진다.

**사용해야 할 때:**
- 리스트 필터링/정렬처럼 배열 연산이 무거울 때
- 계산 결과가 다른 Hook의 의존성으로 사용될 때
- React DevTools Profiler로 실제 성능 문제가 확인되었을 때

**사용하지 않아도 될 때:**
- 단순한 사칙연산
- 짧은 배열(10개 이하) 처리
- 컴포넌트가 자주 리렌더링되지 않을 때

---

## 6. useCallback: 함수 메모이제이션

`useCallback`은 함수를 메모이제이션한다. 의존성이 바뀌지 않으면 같은 함수 참조를 유지한다.

```jsx
import { useState, useCallback, memo } from 'react'

// React.memo로 최적화된 자식 컴포넌트
const Button = memo(({ onClick, label }) => {
  console.log(`Button "${label}" 렌더링`)
  return <button onClick={onClick}>{label}</button>
})

function Parent() {
  const [count, setCount] = useState(0)
  const [text, setText] = useState('')

  // useCallback 없이 — 매 렌더링마다 새 함수 생성
  // → Button이 props 변경으로 인식해서 매번 리렌더링
  const badIncrement = () => setCount(c => c + 1)

  // useCallback 사용 — 함수 참조 유지
  // → 의존성이 바뀌지 않으면 Button이 리렌더링되지 않음
  const increment = useCallback(() => {
    setCount(c => c + 1)
  }, [])  // 의존성 없음 — 항상 같은 함수

  const decrement = useCallback(() => {
    setCount(c => c - 1)
  }, [])

  return (
    <div>
      <p>카운트: {count}</p>
      <input value={text} onChange={e => setText(e.target.value)} />
      <Button onClick={increment} label="증가" />
      <Button onClick={decrement} label="감소" />
    </div>
  )
}
```

### React.memo + useCallback 조합의 실제 효과

```jsx
// 리스트 항목 컴포넌트 — memo로 최적화
const TodoItem = memo(({ todo, onToggle, onDelete }) => {
  console.log(`TodoItem ${todo.id} 렌더링`)
  return (
    <li>
      <input type="checkbox" checked={todo.done} onChange={() => onToggle(todo.id)} />
      {todo.text}
      <button onClick={() => onDelete(todo.id)}>삭제</button>
    </li>
  )
})

function TodoList() {
  const [todos, setTodos] = useState([...])
  const [filter, setFilter] = useState('all')

  // useCallback으로 메모이제이션 — todos가 바뀌어도 함수 참조 유지
  const handleToggle = useCallback((id) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }, [])  // setTodos는 안정적이므로 의존성 불필요

  const handleDelete = useCallback((id) => {
    setTodos(prev => prev.filter(t => t.id !== id))
  }, [])

  // filter가 바뀌어도 handleToggle, handleDelete는 재생성되지 않음
  // → 변경되지 않은 TodoItem은 리렌더링되지 않음
  return (
    <ul>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      ))}
    </ul>
  )
}
```

---

## 7. useContext: 전역 상태 공유

`useContext`를 사용하면 Props Drilling 없이 컴포넌트 트리의 어느 곳에서나 데이터를 공유할 수 있다.

```jsx
import { createContext, useContext, useState } from 'react'

// 1. Context 생성
const ThemeContext = createContext(null)

// 2. Provider 컴포넌트
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light')

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// 3. Context를 사용하는 커스텀 훅 (편의성 + 에러 처리)
function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme은 ThemeProvider 안에서 사용해야 합니다')
  }
  return context
}

// 4. 깊이 중첩된 컴포넌트에서 사용
function DeepComponent() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div
      style={{
        backgroundColor: theme === 'light' ? '#fff' : '#333',
        color: theme === 'light' ? '#333' : '#fff',
        padding: '20px',
      }}
    >
      <p>현재 테마: {theme}</p>
      <button onClick={toggleTheme}>테마 전환</button>
    </div>
  )
}

// 5. 최상위에서 Provider로 감싸기
function App() {
  return (
    <ThemeProvider>
      <Page />
    </ThemeProvider>
  )
}
```

### 여러 Context 조합하기

```jsx
// 인증 Context
const AuthContext = createContext(null)

function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const login = async (email, password) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    const userData = await response.json()
    setUser(userData)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  return useContext(AuthContext)
}

// 사용 예시
function Header() {
  const { user, logout } = useAuth()
  const { theme } = useTheme()

  return (
    <header style={{ backgroundColor: theme === 'dark' ? '#222' : '#f5f5f5' }}>
      {user ? (
        <>
          <span>안녕하세요, {user.name}님</span>
          <button onClick={logout}>로그아웃</button>
        </>
      ) : (
        <a href="/login">로그인</a>
      )}
    </header>
  )
}
```

---

## 8. 커스텀 훅 만들기

커스텀 훅은 여러 Hook을 조합해서 로직을 재사용 가능한 단위로 추출한 것이다. 이름은 반드시 `use`로 시작해야 한다.

### useFetch: 데이터 페칭 훅

```jsx
import { useState, useEffect, useCallback } from 'react'

function useFetch(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    if (!url) return

    setLoading(true)
    setError(null)

    const controller = new AbortController()

    try {
      const response = await fetch(url, { signal: controller.signal })

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`)
      }

      const json = await response.json()
      setData(json)
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }

    return () => controller.abort()
  }, [url])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

// 사용 예시
function UserList() {
  const { data: users, loading, error, refetch } = useFetch('/api/users')

  if (loading) return <div>로딩 중...</div>
  if (error) return <div>에러: {error} <button onClick={refetch}>재시도</button></div>
  if (!users) return null

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

### useLocalStorage: localStorage 동기화 훅

```jsx
import { useState, useEffect } from 'react'

function useLocalStorage(key, initialValue) {
  // 지연 초기화로 localStorage에서 읽기
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`useLocalStorage 초기화 에러 (key: ${key}):`, error)
      return initialValue
    }
  })

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(`useLocalStorage 저장 에러 (key: ${key}):`, error)
    }
  }

  const removeValue = () => {
    try {
      setStoredValue(initialValue)
      localStorage.removeItem(key)
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue, removeValue]
}

// 사용 예시
function Settings() {
  const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'light')
  const [language, setLanguage] = useLocalStorage('language', 'ko')

  return (
    <div>
      <label>
        테마:
        <select value={theme} onChange={e => setTheme(e.target.value)}>
          <option value="light">라이트</option>
          <option value="dark">다크</option>
        </select>
      </label>
      <label>
        언어:
        <select value={language} onChange={e => setLanguage(e.target.value)}>
          <option value="ko">한국어</option>
          <option value="en">English</option>
        </select>
      </label>
      <button onClick={removeTheme}>테마 초기화</button>
    </div>
  )
}
```

### useDebounce: 입력 지연 처리 훅

```jsx
import { useState, useEffect } from 'react'

function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timer)  // value가 바뀌면 이전 타이머 취소
  }, [value, delay])

  return debouncedValue
}

// 사용 예시: 검색창 — 입력을 멈추고 300ms 후에 검색 실행
function SearchBox() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)
  const { data: results, loading } = useFetch(
    debouncedQuery ? `/api/search?q=${debouncedQuery}` : null
  )

  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="검색어 입력..."
      />
      {loading && <p>검색 중...</p>}
      {results && results.map(r => <p key={r.id}>{r.title}</p>)}
    </div>
  )
}
```

---

## 9. Hooks 규칙

Hooks는 두 가지 중요한 규칙을 따라야 한다. 이 규칙을 어기면 예측할 수 없는 버그가 발생한다.

### 규칙 1: 최상위에서만 호출

Hook은 반복문, 조건문, 중첩 함수 안에서 호출할 수 없다.

```jsx
// 잘못된 코드
function BadComponent({ isLoggedIn }) {
  if (isLoggedIn) {
    const [user, setUser] = useState(null)  // 조건문 안에서 Hook 호출 — 금지!
  }

  for (let i = 0; i < 3; i++) {
    useEffect(() => {})  // 반복문 안에서 Hook 호출 — 금지!
  }
}

// 올바른 코드
function GoodComponent({ isLoggedIn }) {
  const [user, setUser] = useState(null)  // 항상 최상위에서

  useEffect(() => {
    if (isLoggedIn) {  // 조건문은 Hook 안에
      fetchUser()
    }
  }, [isLoggedIn])
}
```

React는 Hook이 호출되는 순서를 통해 각 Hook의 State를 추적한다. 조건에 따라 Hook이 호출되면 순서가 달라져서 State가 뒤섞인다.

### 규칙 2: React 함수에서만 호출

Hook은 React 함수형 컴포넌트나 커스텀 훅 안에서만 호출할 수 있다.

```jsx
// 잘못된 코드
function regularFunction() {
  const [state, setState] = useState(0)  // 일반 함수에서 Hook 호출 — 금지!
}

// 올바른 코드
function MyComponent() {
  const [state, setState] = useState(0)  // 함수형 컴포넌트 — OK
}

function useCustomHook() {
  const [state, setState] = useState(0)  // 커스텀 훅 — OK
}
```

> **eslint-plugin-react-hooks** 플러그인을 설치하면 규칙 위반 시 ESLint가 경고를 표시해준다.

---

## 10. 자주 하는 실수 모음

### 실수 1: useEffect 의존성 누락

```jsx
// 잘못된 코드: userId가 바뀌어도 effect가 재실행되지 않음
function UserProfile({ userId }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetchUser(userId).then(setUser)
  }, [])  // userId를 의존성에 넣지 않음!

  return <div>{user?.name}</div>
}

// 올바른 코드
useEffect(() => {
  fetchUser(userId).then(setUser)
}, [userId])  // userId 포함
```

### 실수 2: 불필요한 useEffect

```jsx
// 잘못된 코드: 파생 데이터를 굳이 State + useEffect로 관리
function Order({ items }) {
  const [total, setTotal] = useState(0)

  useEffect(() => {
    setTotal(items.reduce((sum, item) => sum + item.price, 0))
  }, [items])

  return <p>합계: {total}원</p>
}

// 올바른 코드: 렌더링 중에 직접 계산
function Order({ items }) {
  const total = items.reduce((sum, item) => sum + item.price, 0)
  return <p>합계: {total}원</p>
}
```

### 실수 3: 객체/배열을 의존성에 넣을 때

```jsx
// 문제: 매 렌더링마다 새 객체가 생성되어 무한 루프
function Component({ userId }) {
  const options = { method: 'GET' }  // 매번 새 객체

  useEffect(() => {
    fetch(`/api/users/${userId}`, options)
  }, [options])  // 항상 새 참조이므로 매번 실행

  // 해결 방법 1: useEffect 안으로 이동
  useEffect(() => {
    const options = { method: 'GET' }
    fetch(`/api/users/${userId}`, options)
  }, [userId])

  // 해결 방법 2: useMemo로 메모이제이션
  const options = useMemo(() => ({ method: 'GET' }), [])
}
```

### 실수 4: 렌더링 중 부수 효과

```jsx
// 잘못된 코드
function BadComponent() {
  const [data, setData] = useState(null)
  // 렌더링 중에 직접 fetch 호출 — 매 렌더링마다 실행됨!
  fetch('/api/data').then(r => r.json()).then(setData)
  return <div>{data?.name}</div>
}

// 올바른 코드
function GoodComponent() {
  const [data, setData] = useState(null)
  useEffect(() => {
    fetch('/api/data').then(r => r.json()).then(setData)
  }, [])
  return <div>{data?.name}</div>
}
```

---

## 11. Hook 한눈에 비교

| Hook | 용도 | 리렌더링 트리거 | 주요 사용 사례 |
|---|---|---|---|
| `useState` | 컴포넌트 상태 관리 | 값 변경 시 | 폼, 카운터, 토글 |
| `useEffect` | 사이드 이펙트 처리 | 없음 | API 호출, 이벤트 리스너 |
| `useRef` | DOM 참조, 값 유지 | 없음 | 포커스, 타이머 ID 저장 |
| `useMemo` | 계산 결과 캐싱 | 없음 | 무거운 연산, 파생 데이터 |
| `useCallback` | 함수 메모이제이션 | 없음 | 자식 컴포넌트에 콜백 전달 |
| `useContext` | Context 값 읽기 | Context 변경 시 | 전역 상태, 테마, 인증 |

---

## 마치며

React Hooks는 함수형 컴포넌트를 강력하게 만들어주는 핵심 기능이다. 핵심 원칙을 정리하자면:

1. **useState**: 값이 변할 때마다 화면을 다시 그려야 한다면 State로 관리
2. **useEffect**: 렌더링 이후에 실행해야 하는 작업(API 호출, 구독 등)에 사용
3. **useRef**: 렌더링과 무관하게 값을 유지하거나 DOM에 직접 접근할 때
4. **useMemo/useCallback**: 성능 문제가 실제로 확인되었을 때만 사용
5. **useContext**: Props Drilling이 깊어질 때 전역 상태 공유

커스텀 훅을 잘 만들면 로직을 깔끔하게 재사용할 수 있다. 중복되는 로직이 보인다면 커스텀 훅으로 추출하는 습관을 들이자.

---

[^1]: https://react.dev/reference/react/hooks
[^2]: https://react.dev/learn/reusing-logic-with-custom-hooks
[^3]: https://react.dev/learn/synchronizing-with-effects
[^4]: https://react.dev/reference/react/useCallback
[^5]: https://react.dev/reference/react/useMemo
