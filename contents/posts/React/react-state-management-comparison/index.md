---
title: "⚛️ React 상태 관리 쉽게 하기: Context API vs Redux vs Zustand"
description: "React에서 상태 관리 도구를 선택할 때 Context API, Redux, Zustand의 특징을 비교하고 프로젝트에 맞는 최적의 상태 관리 방법과 각각의 도구를 작은 프로젝트와 큰 프로젝트에 활용하는 방법과 성능 최적화 팁도 함께 소개한다."
date: 2024-11-10
update: 2024-11-10
tags:
  - React
  - 상태 관리
  - Context API
  - Redux
  - Zustand
series: "React 상태 관리"
---

## React 📘: React 상태 관리 쉽게 하기: Context API vs Redux vs Zustand

React 프로젝트에서 상태 관리는 필수적인 요소이지만, 프로젝트의 규모나 특성에 따라 어떤 상태 관리 도구를 선택해야 할지 정말 고민이 된다.

대표적으로 사용되는 Context API, Redux, Zustand를 비교하고, 각 도구의 특성과 활용 방법을 알아보자.

## React 상태 관리 도구 비교

### Context API[^1]

- **특징**: React에 내장된 상태 관리 도구로, 계층 구조를 통해 하위 컴포넌트에 상태를 전달할 때 유용하다.
  - UI의 구조가 단순하고 상태가 자주 바뀌지 않는 경우에 적합하다.
- **장점**: 별도의 설치가 필요 없고, 전역 상태가 필요한 작은 프로젝트에 적합하다.
- **단점**: 상태가 빈번하게 변경되거나 데이터가 방대한 경우, 리렌더링으로 인해 성능이 저하될 수 있다.

### Redux[^2]

- **특징**: 복잡한 애플리케이션에서 중앙 집중형 상태 관리가 필요할 때 주로 사용되며 액션과 리듀서를 통해 상태 변경을 추적하고 제어할 수 있다.
  - 상태를 정확하게 추적하고 디버깅해야 할 필요가 있는 경우 유용하다.
- **장점**: 상태가 예측 가능하고 디버깅이 용이해, 큰 프로젝트에서 효과적이다.[^4]
- **단점**: 보일러플레이트 코드가 많고, 복잡한 초기 설정이 필요할 수 있다.

### Zustand[^3]

- **특징**: React 앱의 가벼운 상태 관리 도구로, 빠르고 간결하게 상태를 관리할 수 있으며 Redux와 Context API의 중간 성격을 지니며, 훅 기반의 사용 방식으로 직관적이다.
  - 상태 변화가 빈번하지만, 코드의 간결성을 유지하고자 할 때 탁월하다.
- **장점**: 설치와 사용이 간단하고, 상태 변경이 필요한 컴포넌트에만 적용할 수 있어 효율적이다.
- **단점**: 비교적 작은 커뮤니티와 제한된 개발자 경험을 제공할 수 있다.

## 사용 예제

### 작은 프로젝트 (To-do List 예제)

- **Context API**: To-do List 같은 작은 프로젝트에서는 Context API만으로도 충분히 전역 상태를 관리할 수 있다.

```javascript
// context/TodoContext.js
import React, { createContext, useReducer, useContext } from "react"

const TodoContext = createContext()

const todoReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TODO":
      return [...state, action.payload]
    case "REMOVE_TODO":
      return state.filter(todo => todo.id !== action.payload)
    default:
      return state
  }
}

export function TodoProvider({ children }) {
  const [todos, dispatch] = useReducer(todoReducer, [])
  return (
    <TodoContext.Provider value={{ todos, dispatch }}>
      {children}
    </TodoContext.Provider>
  )
}

export const useTodos = () => useContext(TodoContext)
```

- 이후 `useTodos` 훅을 통해 To-do 상태를 쉽게 사용할 수 있다.

```javascript
// components/TodoList.js
import React, { useState } from "react"
import { useTodos } from "../context/TodoContext"

function TodoList() {
  const { todos, dispatch } = useTodos()
  const [text, setText] = useState("")

  const addTodo = () => {
    dispatch({ type: "ADD_TODO", payload: { id: Date.now(), text } })
    setText("")
  }

  return (
    <div>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </div>
  )
}

export default TodoList
```

### 중간 규모 프로젝트 (eCommerce 예제)

- **Redux**: 사용자가 많고 여러 페이지에서 다양한 상태가 필요한 경우, Redux로 중앙 집중형 상태 관리가 효과적이다.

```javascript
// store/cartSlice.js
import { createSlice } from "@reduxjs/toolkit"

export const cartSlice = createSlice({
  name: "cart",
  initialState: [],
  reducers: {
    addToCart: (state, action) => {
      state.push(action.payload)
    },
    removeFromCart: (state, action) => {
      return state.filter(item => item.id !== action.payload)
    },
  },
})

export const { addToCart, removeFromCart } = cartSlice.actions
export default cartSlice.reducer
```

- Redux 스토어를 설정한다.

```javascript
// store/index.js
import { configureStore } from "@reduxjs/toolkit"
import cartReducer from "./cartSlice"

const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
})

export default store
```

- 그리고 `useDispatch`와 `useSelector`를 활용해 Redux 상태를 쉽게 접근한다.

```javascript
// components/Cart.js
import React from "react"
import { useSelector, useDispatch } from "react-redux"
import { addToCart, removeFromCart } from "../store/cartSlice"

function Cart() {
  const cart = useSelector(state => state.cart)
  const dispatch = useDispatch()

  const addItem = item => dispatch(addToCart(item))
  const removeItem = id => dispatch(removeFromCart(id))

  return (
    <div>
      <h2>Cart</h2>
      <ul>
        {cart.map(item => (
          <li key={item.id}>
            {item.name}{" "}
            <button onClick={() => removeItem(item.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Cart
```

### 성능 최적화가 필요한 큰 프로젝트 (블로그 사이트 예제)

- **Zustand**: Redux보다 설정이 간단하고 성능이 우수해 상태 관리가 자주 필요한 대규모 프로젝트에서도 효과적이다.

```javascript
// store/usePostStore.js
import create from "zustand"

const usePostStore = create(set => ({
  posts: [],
  addPost: post => set(state => ({ posts: [...state.posts, post] })),
  removePost: id =>
    set(state => ({
      posts: state.posts.filter(post => post.id !== id),
    })),
}))

export default usePostStore
```

- 상태를 사용하여 게시글 목록을 관리한다.

```javascript
// components/PostList.js
import React, { useState } from "react"
import usePostStore from "../store/usePostStore"

function PostList() {
  const { posts, addPost, removePost } = usePostStore()
  const [text, setText] = useState("")

  const addNewPost = () => {
    addPost({ id: Date.now(), text })
    setText("")
  }

  return (
    <div>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={addNewPost}>Add Post</button>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            {post.text}
            <button onClick={() => removePost(post.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PostList
```

## Redux와 Zustand 미들웨어 활용법

- Redux와 Zustand는 비동기 액션을 다루기 위한 미들웨어를 제공한다.

### Redux 미들웨어 (redux-thunk):

- 비동기 액션을 Redux에서 쉽게 관리할 수 있도록 도와준다.

```javascript
// store/cartSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

export const fetchCartItems = createAsyncThunk("cart/fetchItems", async () => {
  const response = await fetch("/api/cart")
  return response.json()
})

const cartSlice = createSlice({
  name: "cart",
  initialState: [],
  reducers: {
    addToCart: (state, action) => {
      state.push(action.payload)
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchCartItems.fulfilled, (state, action) => {
      return action.payload
    })
  },
})

export const { addToCart } = cartSlice.actions
export default cartSlice.reducer
```

### Zustand 미들웨어:

- Zustand는 기본적으로 비동기 처리가 가능하지만, 플러그인을 통해 더 정교한 비동기 로직을 추가할 수 있다.

```javascript
const useStore = create(set => ({
  data: [],
  fetchData: async () => {
    const response = await fetch("/api/data")
    const data = await response.json()
    set({ data })
  },
}))
```

### 상태 관리 성능 최적화 팁!

- **필요한 컴포넌트에만 상태 전달**: Context API의 경우 상태 변경이 필요한 컴포넌트에서만 context를 사용하자.
- **Selector 사용하기**: Redux와 Zustand에서 selector를 사용해 원하는 상태만 구독하여 불필요한 리렌더링을 방지하자.
- **React.memo와 useMemo 활용**: 리렌더링을 줄이기 위해 Context API는 React.memo와 useMemo로 상태가 자주 변하지 않는 컴포넌트를 최적화하자.

  - ```javascript
    // components/OptimizedTodoList.js
    import React, { memo } from "react"
    import { useTodos } from "../context/TodoContext"

    const OptimizedTodoList = memo(() => {
      const { todos } = useTodos()
      return (
        <ul>
          {todos.map(todo => (
            <li key={todo.id}>{todo.text}</li>
          ))}
        </ul>
      )
    })

    export default OptimizedTodoList
    ```

## 공통으로 발생하는 문제와 해결 방안

- Context API의 깊은 계층 문제:
  - 계층이 깊어지면 prop drilling 문제가 발생할 수 있습니다. Context를 여러 개 사용해 상태를 분리하거나 React의 Recoil을 고려할 수도 있다.
- Redux에서 복잡한 액션 관리:
  - Redux Slice를 사용하여 리듀서를 나누고 가독성을 높일 수 있다.
- Zustand 비동기 처리 문제:
  - Zustand에서 비동기와 동기 상태가 혼재될 때 상태를 정확히 유지하기 위해 immer 플러그인을 사용할 수 있다.

## 기타 상태 관리 도구

### MobX

- 빠른 상태 관리와 코드 가독성을 제공하지만, 큰 프로젝트에서 상태 추적이 어려울 수 있다.

### Recoil

- Context API와 비슷하지만, 더 세분화된 상태 관리가 가능해 가볍고 빠른 반응이 필요한 SPA에 유리하다.

## 성능 및 유지보수 측면에서의 장단점 분석

| 상태 관리   | 도구 성능 | 유지보수 | 학습 곡선 |
| ----------- | --------- | -------- | --------- |
| Context API | 낮음      | 간편     | 낮음      |
| Redux       | 중간      | 어려움   | 높음      |
| Zustand     | 높음      | 쉬움     | 낮음      |

## 협업 및 유지보수 측면

- Context API:
  - 코드베이스가 커지면 상태 전달 구조가 복잡해질 수 있다.
- Redux:
  - 보일러플레이트 코드가 많지만 중앙 집중형 상태 관리가 가능해 협업에 유리하다.
- Zustand:
  - 간단한 코드로 유지보수가 쉽고, 작은 팀이 빠르게 개발하는 프로젝트에 적합하다.

## 추가 사항

- 상태 분리:
  - 큰 상태 덩어리를 하나의 context나 store에 담기보다 페이지별로 상태를 나눠 관리해보자.
- 미들웨어 활용 (Redux):
  - 복잡한 비동기 로직은 redux-thunk나 redux-saga로 관리해보자.
- 캐시와 메모이제이션:
  - React.memo, useMemo, useCallback을 활용해 불필요한 렌더링을 줄여 성능을 최적화해보자.

## 결론

React의 상태 관리 도구 선택은 프로젝트의 규모와 특성에 따라 달라진다.
Context API는 작은 프로젝트에서 충분히 활용 가능하고, Redux는 복잡한 상태 관리에 강점이 있다.
그러나 보다 가볍고 간편한 대안을 찾는다면 Zustand도 매우 유용하다.

이 글을 통해 여러분의 프로젝트에 맞는 최적의 상태 관리 도구를 선택할 수 있기를 바란다!

[^1]: https://ko.legacy.reactjs.org/docs/context.html#api
[^2]: https://redux.js.org/
[^3]: https://zustand-demo.pmnd.rs/
[^4]: https://github.com/reduxjs/redux-devtools]
