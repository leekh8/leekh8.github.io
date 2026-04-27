---
title: "React vs Vue vs Angular 비교: 2025년 기준 프레임워크 선택 가이드"
description: "React, Vue, Angular를 학습 곡선, 성능, 생태계, 채용 시장 기준으로 완전 비교합니다. 스타트업엔 React, 소규모 팀엔 Vue, 엔터프라이즈엔 Angular를 추천하는 이유를 실제 코드와 함께 설명합니다."
date: 2024-11-24
update: 2024-11-24
tags:
  - React
  - Vue
  - Angular
  - 프레임워크 선택
  - 웹 개발
series: "프론트엔드 프레임워크 비교"
---

## React vs Vue vs Angular: 어떤 것을 선택해야 할까?

웹 개발을 시작하려는 모두가 한 번쯤 고민하는 질문이다. React, Vue, Angular — 셋 다 좋다는 말만 들려온다. 이 글에서는 생태계 현황, 렌더링 방식, 번들 크기, 학습 곡선, 상태 관리, TypeScript 지원, SSR까지 실제 수치와 코드 예제를 들어 철저하게 비교한다.

---

## 1. 2024~2025년 생태계 현황

숫자로 보는 세 프레임워크의 현재 위치다.

### npm 주간 다운로드 수 (2024년 기준)

| 패키지 | 주간 다운로드 | 추세 |
|---|---|---|
| react | 약 2,300만 회 | 꾸준히 성장 |
| vue | 약 470만 회 | 안정적 성장 |
| @angular/core | 약 310만 회 | 안정적 유지 |

React가 압도적으로 많다. 하지만 다운로드 수가 곧 "더 좋은 프레임워크"를 의미하지는 않는다.

### GitHub Stars (2024년 말 기준)

| 리포지토리 | Stars |
|---|---|
| facebook/react | ~228,000 |
| vuejs/vue | ~208,000 |
| angular/angular | ~96,000 |

Vue는 Stars 수로는 React와 거의 비슷하다. Angular는 Stars가 적지만, 기업 환경에서의 채택률은 높다.

### Stack Overflow 개발자 설문 (2024)

2024년 Stack Overflow 설문에서 가장 인기 있는 웹 프레임워크 순위:
- React: 39.5% (5년 연속 1위)
- Vue.js: 15.4%
- Angular: 17.1%

Angular가 Vue보다 사용률이 높은 것은 기업용 대형 프로젝트에서의 강세 때문이다.

---

## 2. 각 프레임워크 소개

### React — 라이브러리인가, 프레임워크인가?

React는 엄밀히 말하면 **UI 라이브러리**다. Facebook(현 Meta)에서 2013년 오픈소스로 공개했다. 라우팅, 상태 관리, HTTP 클라이언트 등은 서드파티 라이브러리를 선택해서 조합해야 한다. 이 유연함이 장점이자 단점이다.

**주요 특징:**
- JSX: JavaScript 안에서 HTML을 쓰는 문법
- Virtual DOM 기반 렌더링
- 단방향 데이터 흐름
- Hooks(16.8+)로 함수형 프로그래밍 강화

### Vue.js — 직관적인 프로그레시브 프레임워크

Evan You가 2014년 Angular에서 영감을 받아 만들었다. "프로그레시브 프레임워크"를 표방하며, 기존 프로젝트에 점진적으로 도입할 수 있다. Vue 3(2020년 출시)부터 Composition API가 추가되어 React Hooks와 유사한 방식으로 코드 작성이 가능해졌다.

**주요 특징:**
- Single File Component(SFC): `.vue` 파일에 template, script, style 통합
- Reactivity System: 데이터 변경을 자동으로 추적
- Options API(전통적) + Composition API(현대적) 선택 가능
- 부드러운 학습 곡선

### Angular — 완전한 엔터프라이즈 프레임워크

Google이 개발한 TypeScript 기반 풀 프레임워크다. AngularJS(2010)를 완전히 재작성한 Angular 2(2016)를 기점으로 버전이 올라가고 있다. 라우팅, HTTP, 폼, 상태 관리, 의존성 주입 등이 모두 내장되어 있다.

**주요 특징:**
- TypeScript 기본 채택 (JavaScript도 지원)
- 의존성 주입(Dependency Injection) 내장
- RxJS 기반 반응형 프로그래밍
- Angular CLI로 강력한 개발 도구 제공

---

## 3. 렌더링 방식 비교

### React: Virtual DOM

React는 실제 DOM을 직접 조작하는 대신, 메모리에 가상 DOM(Virtual DOM)을 유지한다.

```
State 변경 → Virtual DOM 업데이트 → Diffing 알고리즘 → 실제 DOM에 최소한으로 반영
```

**Diffing 알고리즘 (Reconciliation):**
React는 이전 Virtual DOM과 새 Virtual DOM을 비교하여 실제로 변경된 부분만 DOM에 반영한다. 이를 통해 직접 DOM 조작보다 효율적인 업데이트가 가능하다.

```jsx
// State가 변경되면 React가 자동으로 최적의 DOM 업데이트를 처리
function App() {
  const [items, setItems] = useState(['A', 'B', 'C'])

  const addItem = () => {
    setItems(prev => [...prev, 'D'])
  }

  return (
    <ul>
      {items.map(item => <li key={item}>{item}</li>)}
      <button onClick={addItem}>추가</button>
    </ul>
  )
}
```

React 18부터는 **Concurrent Mode**가 도입되어, 렌더링 작업을 우선순위에 따라 중단/재개할 수 있어 더 유연한 성능 최적화가 가능하다.

### Vue.js: Reactivity System

Vue는 **반응형 시스템(Reactivity System)**을 사용한다. 데이터 객체를 프록시(Proxy, Vue 3)로 감싸서 데이터의 읽기/쓰기를 가로채고, 변경이 감지되면 해당 부분만 자동으로 업데이트한다.

```vue
<template>
  <div>
    <!-- items가 변경되면 이 부분만 자동 업데이트 -->
    <ul>
      <li v-for="item in items" :key="item">{{ item }}</li>
    </ul>
    <button @click="addItem">추가</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const items = ref(['A', 'B', 'C'])

const addItem = () => {
  items.value.push('D')
}
</script>
```

Vue의 반응형 시스템은 **정확히 어떤 데이터가 어떤 뷰에 영향을 주는지 추적**하기 때문에, 불필요한 리렌더링이 React보다 적을 수 있다.

### Angular: Zone.js와 Change Detection

Angular는 **Zone.js**를 통해 변경 감지를 수행한다. Zone.js는 비동기 작업(setTimeout, HTTP 요청 등)을 가로채서 완료 시 Angular에게 알린다. Angular는 알림을 받으면 컴포넌트 트리를 검사하여 변경된 부분을 찾는다.

```typescript
@Component({
  selector: 'app-root',
  template: `
    <ul>
      <li *ngFor="let item of items">{{ item }}</li>
    </ul>
    <button (click)="addItem()">추가</button>
  `
})
export class AppComponent {
  items = ['A', 'B', 'C']

  addItem() {
    this.items = [...this.items, 'D']
    // Zone.js가 이 변경을 감지하고 Angular에게 알림
  }
}
```

Angular 17+부터는 **Signals**라는 새로운 반응형 시스템이 도입되어 Zone.js 없이도 세밀한 반응성을 구현할 수 있다.

---

## 4. 번들 크기 비교

번들 크기는 초기 로드 성능에 직접적인 영향을 미친다.

| 프레임워크 | 프레임워크 자체 크기 (gzip) | 최소 Hello World 앱 |
|---|---|---|
| React + ReactDOM | ~45KB | ~50KB |
| Vue 3 | ~34KB | ~40KB |
| Angular | ~70KB+ | ~150KB+ |

**주의사항:**
- 위 수치는 프로덕션 빌드 기준이며, Tree Shaking 적용 여부에 따라 달라진다.
- Angular는 초기 번들이 크지만, Lazy Loading을 적용하면 첫 화면 로드 크기를 크게 줄일 수 있다.
- 실제 앱 크기는 사용하는 라이브러리(상태 관리, 라우팅 등)를 합산해야 한다.

### React 전체 스택 실제 크기 예시

```
React + ReactDOM: ~45KB
React Router: ~15KB
Redux Toolkit: ~13KB
Axios: ~13KB
-----
합계: ~86KB (gzip 기준)
```

### Vue 3 전체 스택

```
Vue 3: ~34KB
Vue Router: ~12KB
Pinia: ~3KB
Axios: ~13KB
-----
합계: ~62KB (gzip 기준)
```

---

## 5. 학습 곡선: 얼마나 걸리나?

### Vue.js: 가장 완만한 학습 곡선 (2~4주)

HTML, CSS, JavaScript 기초가 있다면 Vue는 가장 빠르게 배울 수 있다.

- **1주차**: 템플릿 문법, v-bind, v-on, v-if, v-for
- **2주차**: 컴포넌트, props, emit, Composition API 기초
- **3주차**: Vue Router, Pinia 상태 관리
- **4주차**: 실전 프로젝트, Nuxt.js 입문

Vue의 Options API는 HTML/CSS/JS를 각각 분리하여 직관적이다. 단일 파일 컴포넌트(SFC)가 HTML 개발 경험과 가장 유사하다.

### React: 중간 학습 곡선 (4~8주)

React 자체는 어렵지 않지만, 생태계를 이해하는 데 시간이 걸린다.

- **1~2주차**: JSX, 컴포넌트, Props, State
- **3~4주차**: Hooks (useState, useEffect, useRef, useMemo)
- **5~6주차**: React Router, 상태 관리 선택(Context/Zustand/Redux)
- **7~8주차**: 성능 최적화(React.memo, useCallback), Next.js 입문

JSX 문법이 처음에는 낯설고, "어떤 라이브러리를 선택해야 하나"라는 결정 피로가 있다.

### Angular: 가장 가파른 학습 곡선 (8~16주)

Angular는 배울 것이 많다. 하지만 한 번 익히면 일관된 방식으로 대형 프로젝트를 관리할 수 있다.

- **1~2주차**: TypeScript 기초, 컴포넌트, 템플릿 문법
- **3~4주차**: 의존성 주입(DI), 서비스, 모듈
- **5~6주차**: Angular Router, Reactive Forms, HTTP Client
- **7~8주차**: RxJS 기초, Observable 패턴
- **9~12주차**: 상태 관리(NgRx), 테스팅(Jasmine/Karma)
- **13~16주차**: 성능 최적화, Signals(Angular 17+)

---

## 6. 실제 코드 비교 — 같은 컴포넌트 세 가지로 구현

카운터 + 할 일 추가 기능을 세 프레임워크로 구현하여 직접 비교해보자.

### React 버전

```jsx
import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)
  const [todos, setTodos] = useState([])
  const [input, setInput] = useState('')

  const addTodo = () => {
    if (!input.trim()) return
    setTodos(prev => [...prev, { id: Date.now(), text: input }])
    setInput('')
  }

  return (
    <div className="app">
      <h1>카운터: {count}</h1>
      <button onClick={() => setCount(c => c - 1)}>-</button>
      <button onClick={() => setCount(c => c + 1)}>+</button>

      <hr />

      <div>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && addTodo()}
          placeholder="할 일 입력..."
        />
        <button onClick={addTodo}>추가</button>
      </div>

      <ul>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </div>
  )
}

export default App
```

### Vue 3 버전 (Composition API)

```vue
<template>
  <div class="app">
    <h1>카운터: {{ count }}</h1>
    <button @click="count--">-</button>
    <button @click="count++">+</button>

    <hr />

    <div>
      <input
        v-model="input"
        @keypress.enter="addTodo"
        placeholder="할 일 입력..."
      />
      <button @click="addTodo">추가</button>
    </div>

    <ul>
      <li v-for="todo in todos" :key="todo.id">{{ todo.text }}</li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const count = ref(0)
const input = ref('')
const todos = ref([])

const addTodo = () => {
  if (!input.value.trim()) return
  todos.value.push({ id: Date.now(), text: input.value })
  input.value = ''
}
</script>
```

### Angular 버전

```typescript
// app.component.ts
import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'

interface Todo {
  id: number
  text: string
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="app">
      <h1>카운터: {{ count }}</h1>
      <button (click)="count = count - 1">-</button>
      <button (click)="count = count + 1">+</button>

      <hr />

      <div>
        <input
          [(ngModel)]="input"
          (keypress)="onKeyPress($event)"
          placeholder="할 일 입력..."
        />
        <button (click)="addTodo()">추가</button>
      </div>

      <ul>
        <li *ngFor="let todo of todos">{{ todo.text }}</li>
      </ul>
    </div>
  `
})
export class AppComponent {
  count = 0
  input = ''
  todos: Todo[] = []

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') this.addTodo()
  }

  addTodo() {
    if (!this.input.trim()) return
    this.todos = [...this.todos, { id: Date.now(), text: this.input }]
    this.input = ''
  }
}
```

**코드 비교 요약:**
- Vue가 가장 짧고 직관적이다 (v-model로 양방향 바인딩)
- React는 단방향 바인딩이라 onChange 핸들러가 필요하지만 명시적이다
- Angular는 가장 장황하지만 타입 안전성이 높고 구조가 명확하다

---

## 7. 상태 관리 비교

### React: Redux Toolkit vs Zustand vs Jotai

React는 상태 관리 라이브러리를 직접 선택해야 한다.

**Redux Toolkit** (대형 프로젝트, 팀 협업):
```js
// store/counterSlice.js
import { createSlice } from '@reduxjs/toolkit'

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: state => { state.value += 1 },
    decrement: state => { state.value -= 1 },
  }
})

export const { increment, decrement } = counterSlice.actions
export default counterSlice.reducer

// 컴포넌트에서 사용
import { useSelector, useDispatch } from 'react-redux'
function Counter() {
  const count = useSelector(state => state.counter.value)
  const dispatch = useDispatch()
  return (
    <div>
      <p>{count}</p>
      <button onClick={() => dispatch(increment())}>+</button>
    </div>
  )
}
```

**Zustand** (간결함을 원할 때):
```js
import { create } from 'zustand'

const useCounterStore = create(set => ({
  count: 0,
  increment: () => set(state => ({ count: state.count + 1 })),
  decrement: () => set(state => ({ count: state.count - 1 })),
}))

function Counter() {
  const { count, increment } = useCounterStore()
  return <button onClick={increment}>{count}</button>
}
```

Zustand는 설정이 거의 없고, 코드량이 Redux의 1/3 수준이라 소중간 규모 프로젝트에 적합하다.

### Vue: Pinia (공식 상태 관리)

Vue 3의 공식 상태 관리 라이브러리다. Vuex를 대체했다.

```js
// stores/counter.js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  getters: {
    doubleCount: state => state.count * 2,
  },
  actions: {
    increment() { this.count++ },
    decrement() { this.count-- },
  }
})

// 컴포넌트에서 사용
<script setup>
import { useCounterStore } from '@/stores/counter'
const counter = useCounterStore()
</script>

<template>
  <p>{{ counter.count }} (2배: {{ counter.doubleCount }})</p>
  <button @click="counter.increment">+</button>
</template>
```

Pinia는 DevTools 지원, TypeScript 친화적, 간단한 API가 강점이다.

### Angular: NgRx vs 서비스 + BehaviorSubject

Angular는 내장 서비스와 RxJS만으로도 충분한 상태 관리가 가능하다.

```typescript
// counter.service.ts
import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class CounterService {
  private count$ = new BehaviorSubject(0)
  readonly count = this.count$.asObservable()

  increment() { this.count$.next(this.count$.value + 1) }
  decrement() { this.count$.next(this.count$.value - 1) }
}

// 컴포넌트에서 사용
@Component({
  template: `
    <p>{{ count$ | async }}</p>
    <button (click)="counter.increment()">+</button>
  `
})
export class CounterComponent {
  count$ = this.counter.count
  constructor(public counter: CounterService) {}
}
```

대규모 프로젝트에서는 **NgRx** (Redux 패턴의 Angular 버전)를 사용한다.

---

## 8. TypeScript 지원 수준 비교

| 프레임워크 | TypeScript 지원 | 기본 설정 | 타입 안전성 |
|---|---|---|---|
| React | 매우 좋음 | 선택 사항 | 높음 (명시적) |
| Vue 3 | 좋음 | 선택 사항 | 중간~높음 |
| Angular | 최고 수준 | 기본 채택 | 매우 높음 |

### React + TypeScript

```tsx
interface ButtonProps {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  variant = 'primary',
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {label}
    </button>
  )
}
```

### Vue 3 + TypeScript

```vue
<script setup lang="ts">
interface Props {
  label: string
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  disabled: false,
})

const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <button
    :disabled="props.disabled"
    :class="`btn btn-${props.variant}`"
    @click="emit('click')"
  >
    {{ props.label }}
  </button>
</template>
```

### Angular (TypeScript 기본)

```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core'

type ButtonVariant = 'primary' | 'secondary' | 'danger'

@Component({
  selector: 'app-button',
  template: `
    <button
      [disabled]="disabled"
      [class]="'btn btn-' + variant"
      (click)="handleClick()"
    >
      {{ label }}
    </button>
  `
})
export class ButtonComponent {
  @Input() label!: string              // ! = 필수 (strictPropertyInitialization)
  @Input() variant: ButtonVariant = 'primary'
  @Input() disabled = false
  @Output() clicked = new EventEmitter<void>()

  handleClick() {
    this.clicked.emit()
  }
}
```

Angular는 TypeScript를 처음부터 전제로 설계되어 타입 시스템이 가장 촘촘하다.

---

## 9. Server-Side Rendering (SSR) 비교

SEO와 초기 로드 성능을 위해 SSR이 중요해진 요즘, 각 프레임워크의 SSR 솔루션을 비교한다.

### React: Next.js

Next.js는 React 생태계에서 사실상 표준 SSR 프레임워크다. Vercel이 개발하며, App Router(Next.js 13+)로 파일 기반 라우팅과 서버 컴포넌트를 지원한다.

```jsx
// Next.js App Router (app/users/page.tsx)
// 서버 컴포넌트: 서버에서 데이터를 가져와 HTML로 렌더링
async function UsersPage() {
  // fetch가 서버에서 실행됨
  const users = await fetch('https://api.example.com/users').then(r => r.json())

  return (
    <div>
      <h1>사용자 목록</h1>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  )
}

export default UsersPage
```

**Next.js의 렌더링 옵션:**
- **SSR**: 요청마다 서버에서 렌더링
- **SSG**: 빌드 시 정적 HTML 생성
- **ISR**: 정적 생성 + 주기적 재생성
- **클라이언트 렌더링**: 기존 React SPA 방식

### Vue: Nuxt.js

Nuxt.js는 Vue 생태계의 Next.js에 해당한다. Vue 3 기반의 Nuxt 3가 현재 버전이다.

```vue
<!-- pages/users.vue -->
<script setup>
// useFetch는 SSR과 CSR을 모두 처리
const { data: users } = await useFetch('/api/users')
</script>

<template>
  <div>
    <h1>사용자 목록</h1>
    <div v-for="user in users" :key="user.id">
      {{ user.name }}
    </div>
  </div>
</template>
```

### Angular: Angular Universal / SSR

Angular 17+부터는 Angular 자체에 SSR이 통합되었다.

```bash
# Angular 17+ SSR 프로젝트 생성
ng new my-app --ssr
```

```typescript
// Angular Universal은 Node.js 서버에서 Angular 앱을 렌더링
// app.config.server.ts
import { provideServerRendering } from '@angular/ssr'

export const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering()
  ]
}
```

### SSR 솔루션 비교

| 항목 | Next.js (React) | Nuxt.js (Vue) | Angular SSR |
|---|---|---|---|
| 성숙도 | 매우 높음 | 높음 | 중간 (17+부터 내장) |
| 배포 플랫폼 | Vercel 최적화 | Vercel/Netlify | Node.js 서버 |
| 학습 난이도 | 중간 | 낮음~중간 | 높음 |
| 서버 컴포넌트 | 지원 (App Router) | 부분 지원 | 미지원 |
| 생태계 | 매우 풍부 | 풍부 | 제한적 |

---

## 10. 취업 시장에서의 수요 (한국 기준)

2024~2025년 국내 채용 공고를 기준으로 한 대략적인 수요다.

### 직군별 선호도

**스타트업/소규모:**
- React 압도적 우세 (60~70%)
- Vue.js (20~30%)
- Angular는 드물다

**중견/대기업:**
- React (50~60%)
- Angular (20~30%, SI 프로젝트)
- Vue.js (10~20%)

**공공/SI 프로젝트:**
- Angular나 Vue 채택 비율이 상대적으로 높다
- 레거시 AngularJS(1.x) 프로젝트도 아직 존재

**주요 회사별 스택:**
- 카카오, 네이버, 토스: 주로 React
- 삼성전자 MX 파트: React, Angular 혼용
- SI 회사: Angular, Vue 혼용

### 연봉과의 상관관계

특정 프레임워크가 연봉에 직접 영향을 미치지는 않는다. 하지만 React는 채용 공고 수가 많아 이직 기회가 많고, Angular 전문가는 수요 대비 공급이 적어 특정 기업에서 높게 평가받기도 한다.

---

## 11. 2025년 기준 선택 가이드라인

### 처음 프론트엔드를 배우는 경우

**Vue.js 추천**

이유:
- 학습 곡선이 가장 완만하다
- HTML/CSS/JS 지식이 자연스럽게 이어진다
- 빠른 시간 안에 실제 동작하는 것을 만들 수 있다
- Vue를 익힌 후 React로 전환하는 것이 역방향보다 쉽다

### 취업이 목표인 경우

**React 추천**

이유:
- 채용 공고 수가 압도적으로 많다
- 스타트업부터 대기업까지 넓게 채택되어 있다
- React를 잘 하면 Next.js로 풀스택까지 가능하다
- 커뮤니티, 강의, 문서 자료가 가장 풍부하다

### 대규모 기업용 프로젝트

**Angular 추천**

이유:
- 강한 타입 시스템으로 대규모 팀에서 코드 일관성 유지
- 의존성 주입으로 테스트 용이성 높음
- "다 내장되어 있다"는 장점이 대형 프로젝트에서 빛을 발함
- Google의 지속적인 지원

### 기존 프로젝트에 점진적 도입

**Vue.js 추천**

이유:
- CDN으로도 사용 가능해서 기존 HTML 페이지에 부분 적용 가능
- "프로그레시브" 특성상 전체 재작성 없이 점진적 도입 가능

---

## 12. 자주 하는 실수와 각 프레임워크별 함정

### React 함정

**함정 1: 모든 것을 State로 만들기**
```jsx
// 잘못된 예: 파생 데이터를 State로
const [total, setTotal] = useState(0)
useEffect(() => {
  setTotal(items.reduce((s, i) => s + i.price, 0))
}, [items])

// 올바른 예: 렌더링 중 계산
const total = items.reduce((s, i) => s + i.price, 0)
```

**함정 2: useEffect 의존성 배열 빈 채로 두기**
```jsx
// 잘못된 예: userId가 바뀌어도 재실행 안 됨
useEffect(() => {
  fetchUser(userId)
}, [])  // userId 누락

// 올바른 예
useEffect(() => {
  fetchUser(userId)
}, [userId])
```

**함정 3: key에 인덱스 사용**
```jsx
// 잘못된 예: 목록이 바뀌면 항목이 뒤섞임
items.map((item, index) => <Item key={index} item={item} />)

// 올바른 예
items.map(item => <Item key={item.id} item={item} />)
```

### Vue 함정

**함정 1: ref 값 접근 시 .value 누락**
```js
const count = ref(0)

// 잘못된 예 (template 밖에서)
count++  // 작동 안 함

// 올바른 예
count.value++
```

**함정 2: reactive 객체를 구조분해하면 반응성 잃음**
```js
const state = reactive({ count: 0, name: 'Amy' })

// 잘못된 예: 반응성 잃음
const { count, name } = state
count++  // 변경해도 UI 업데이트 안 됨

// 올바른 예: toRefs 사용
const { count, name } = toRefs(state)
count.value++  // 반응성 유지
```

**함정 3: Options API에서 this 바인딩 문제**
```js
// 잘못된 예
methods: {
  fetchData() {
    setTimeout(function() {
      this.data = 'loaded'  // this가 undefined!
    }, 1000)
  }
}

// 올바른 예: 화살표 함수 사용
methods: {
  fetchData() {
    setTimeout(() => {
      this.data = 'loaded'  // 화살표 함수는 this를 상위에서 상속
    }, 1000)
  }
}
```

### Angular 함정

**함정 1: Observable 구독 해제 누락**
```typescript
// 잘못된 예: 메모리 누수
ngOnInit() {
  this.service.getData().subscribe(data => {
    this.data = data
  })
}

// 올바른 예 1: takeUntil 패턴
private destroy$ = new Subject<void>()

ngOnInit() {
  this.service.getData()
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => this.data = data)
}

ngOnDestroy() {
  this.destroy$.next()
  this.destroy$.complete()
}

// 올바른 예 2: async 파이프 (자동 구독 해제)
// template에서: {{ data$ | async }}
```

**함정 2: 불필요한 전체 Change Detection**
```typescript
// 기본: 모든 이벤트에서 전체 트리 검사 (느릴 수 있음)

// 성능 최적화: OnPush Change Detection
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ...
})
export class OptimizedComponent {
  // Props(Input)가 변경될 때만 업데이트
}
```

**함정 3: 서비스를 잘못된 레벨에 제공**
```typescript
// 컴포넌트마다 다른 인스턴스 생성 (의도하지 않은 경우)
@Component({
  providers: [CounterService]  // 컴포넌트마다 새 인스턴스
})

// 앱 전체에서 싱글톤으로 공유 (대부분 원하는 것)
@Injectable({ providedIn: 'root' })
export class CounterService {}
```

---

## 13. 최종 비교표

| 항목 | React | Vue.js | Angular |
|---|---|---|---|
| 출시 | 2013 (Meta) | 2014 (개인) | 2016 (Google) |
| 분류 | 라이브러리 | 프레임워크 | 풀 프레임워크 |
| 학습 곡선 | 중간 | 낮음 | 높음 |
| 번들 크기 | 중간 (~45KB) | 작음 (~34KB) | 큼 (~70KB+) |
| 렌더링 방식 | Virtual DOM | Reactivity System | Zone.js / Signals |
| TypeScript | 선택 (잘 지원) | 선택 (잘 지원) | 기본 채택 |
| 상태 관리 | 직접 선택 | Pinia (공식) | 서비스/NgRx |
| SSR | Next.js | Nuxt.js | Angular SSR |
| 취업 시장 | 최다 수요 | 중간 | 중간~높음(기업) |
| 대규모 팀 | 좋음 | 중간 | 매우 좋음 |
| 유연성 | 매우 높음 | 높음 | 낮음(규칙 강함) |
| 커뮤니티 | 최대 | 중간 | 대형 |

---

## 결론

세 프레임워크 중 "가장 좋은 것"은 없다. 상황에 따라 최선의 선택이 다르다.

- **Vue.js**: 빠르게 시작하고 싶다면, 기존 프로젝트에 점진적으로 도입한다면
- **React**: 취업을 목표로 한다면, 스타트업 환경이라면, 유연한 기술 선택을 원한다면
- **Angular**: 대규모 팀, 엔터프라이즈 프로젝트, 강한 타입 시스템이 필요하다면

가장 중요한 것은 **하나를 제대로 배우는 것**이다. 하나를 깊이 이해하면 다른 것은 훨씬 빠르게 배울 수 있다. 세 프레임워크 모두 같은 웹 표준과 JavaScript 위에서 동작하기 때문이다.

---

[^1]: https://legacy.reactjs.org/docs/getting-started.html
[^2]: https://ko.vuejs.org/guide/introduction.html
[^3]: https://angular.dev/overview
[^4]: https://npmtrends.com/angular-vs-react-vs-vue
[^5]: https://survey.stackoverflow.co/2024/technology
[^6]: https://nextjs.org/docs
[^7]: https://nuxt.com/docs
