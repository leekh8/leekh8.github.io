---
title: "🔷 TypeScript 입문: JavaScript 개발자를 위한 타입 시스템 완전 가이드"
description: "TypeScript가 왜 필요한지부터 시작해서, 기본 타입, 인터페이스, 제네릭, 유틸리티 타입까지 JavaScript 개발자가 TypeScript를 빠르게 익힐 수 있도록 실전 코드 중심으로 정리합니다."
date: 2026-04-20
update: 2026-04-20
tags:
  - TypeScript
  - JavaScript
  - 타입 시스템
  - 프론트엔드
  - Web
series: "TypeScript 완전 정복"
---

JavaScript로 규모가 커지는 프로젝트를 작업하다 보면 어느 순간 이런 상황이 온다.

```javascript
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.pricee, 0); // 오타인데 오류 없음
}
```

`pricee`라는 오타가 있지만 JavaScript는 아무 경고도 주지 않는다. 실행하면 `NaN`이 나오고, 그때야 디버깅을 시작한다. TypeScript는 이런 문제를 **코드를 작성하는 순간** 잡아준다.

---

## 왜 TypeScript인가

### JavaScript가 놓치는 오류들

```javascript
// ❌ 런타임에 터지는 JavaScript 코드들

// 1. 존재하지 않는 속성 접근
const user = { name: 'Alice', age: 25 };
console.log(user.email.toLowerCase()); // TypeError: Cannot read properties of undefined

// 2. 잘못된 타입 연산
function double(n) {
  return n * 2;
}
double('3'); // "33" — 문자열이 들어왔는데 오류 없음

// 3. 오타
const CONFIG = { apiUrl: 'https://api.example.com' };
fetch(CONFIG.apiURl); // undefined — 오타인데 조용히 실패
```

이 모든 오류는 런타임에 사용자가 직접 마주치게 된다.

TypeScript를 쓰면 같은 코드가 **컴파일 타임**에 바로 오류로 표시된다:

```typescript
// ✅ TypeScript가 미리 잡아주는 오류들

const user: { name: string; age: number } = { name: 'Alice', age: 25 };
console.log(user.email.toLowerCase()); // 오류: 'email' 속성이 없음

function double(n: number): number {
  return n * 2;
}
double('3'); // 오류: 'string'은 'number' 매개변수에 할당할 수 없음
```

### TypeScript 채택 현황

- Stack Overflow 개발자 설문(2024)에서 TypeScript는 가장 사랑받는 언어 4위
- Angular는 TypeScript 기본, React/Vue도 TypeScript First 방향으로 전환 중
- Microsoft, Google, Airbnb, Slack 등 대형 프로젝트 대부분 TypeScript 사용

---

## TypeScript 설치 및 시작

### 순수 TypeScript 프로젝트

```bash
# TypeScript 컴파일러 설치
npm install -g typescript

# 버전 확인
tsc --version

# 프로젝트 초기화 (tsconfig.json 생성)
tsc --init

# 컴파일
tsc index.ts

# 감시 모드 (파일 변경 시 자동 컴파일)
tsc --watch
```

### tsconfig.json 주요 옵션

```json
{
  "compilerOptions": {
    "target": "ES2020",          // 컴파일 결과물의 JavaScript 버전
    "module": "commonjs",        // 모듈 시스템 (commonjs / ESNext)
    "lib": ["ES2020", "DOM"],    // 사용할 내장 타입 라이브러리
    "outDir": "./dist",          // 컴파일 결과물 저장 위치
    "rootDir": "./src",          // TypeScript 소스 파일 위치
    "strict": true,              // 엄격 모드 (강력 권장!)
    "esModuleInterop": true,     // CommonJS 모듈 import 편의성
    "skipLibCheck": true,        // node_modules 타입 검사 생략
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

> `"strict": true`는 반드시 켜두자. `strictNullChecks`, `noImplicitAny` 등 핵심 옵션들이 모두 활성화된다.

### Vite + React + TypeScript 시작

```bash
# Vite로 React + TypeScript 프로젝트 생성
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
npm run dev
```

---

## 기본 타입 완전 정리

### 원시 타입

```typescript
// 기본 원시 타입
const name: string = 'Alice';
const age: number = 25;
const isActive: boolean = true;

// null과 undefined
let value: null = null;
let data: undefined = undefined;

// symbol
const id: symbol = Symbol('id');

// bigint
const bigNum: bigint = 9007199254740991n;
```

### 배열과 튜플

```typescript
// 배열 — 두 가지 표기법
const numbers: number[] = [1, 2, 3];
const strings: Array<string> = ['a', 'b', 'c'];

// 읽기 전용 배열
const readOnly: readonly number[] = [1, 2, 3];
// readOnly.push(4); // 오류!

// 튜플 — 각 위치의 타입이 고정됨
const point: [number, number] = [10, 20];
const entry: [string, number] = ['Alice', 25];

// named tuple (TypeScript 4.0+)
const namedPoint: [x: number, y: number] = [10, 20];
```

### any, unknown, never, void 비교

| 타입 | 의미 | 타입 체크 | 사용 시점 |
|---|---|---|---|
| `any` | 모든 타입 허용, 타입 체크 없음 | ❌ | 마이그레이션 초기, 어쩔 수 없을 때만 |
| `unknown` | 모든 타입 허용, 사용 전 타입 체크 필요 | ✅ | API 응답 등 타입 불명확할 때 |
| `never` | 절대 발생하지 않는 값 | ✅ | 함수가 항상 throw, 무한 루프 |
| `void` | 반환값 없음 | ✅ | 반환값이 없는 함수 |

```typescript
// any — 피하는 게 좋다
let anything: any = 42;
anything = 'string';      // OK
anything.foo.bar.baz;     // OK (런타임 오류 위험!)

// unknown — any보다 안전
let value: unknown = 42;
value.toFixed(2);         // 오류: 타입 체크 없이 사용 불가
if (typeof value === 'number') {
  value.toFixed(2);       // OK: 타입 가드 후 사용
}

// never — 도달 불가능한 코드
function throwError(msg: string): never {
  throw new Error(msg);
  // 여기 이후 코드는 never 타입
}

// void — 반환값 없는 함수
function logMessage(msg: string): void {
  console.log(msg);
  // return 42; // 오류
}
```

### 타입 추론 (Type Inference)

모든 변수에 타입을 명시할 필요는 없다. TypeScript는 대부분의 경우 타입을 알아서 추론한다:

```typescript
// TypeScript가 타입을 자동으로 추론
const name = 'Alice';   // string으로 추론
const age = 25;         // number로 추론
const arr = [1, 2, 3];  // number[]로 추론

// 함수 반환 타입도 추론
function add(a: number, b: number) {
  return a + b; // 반환 타입: number (추론됨)
}

// 복잡한 경우엔 명시하는 게 좋음
function getUser(id: number): User {
  // 명시적으로 쓰면 의도가 명확하고 오류도 빨리 발견
}
```

---

## 인터페이스 vs 타입 별칭

TypeScript에서 객체 타입을 정의하는 방법은 두 가지다.

### interface

```typescript
interface User {
  id: number;
  name: string;
  email?: string;      // optional (있어도 되고 없어도 됨)
  readonly createdAt: Date;  // 한 번 설정하면 변경 불가
}

// 인터페이스 확장
interface Admin extends User {
  role: 'admin' | 'superadmin';
  permissions: string[];
}

// 선언 병합 (같은 이름으로 여러 번 선언하면 합쳐짐)
interface Window {
  myCustomProp: string; // 브라우저 전역 객체 확장 가능
}
```

### type alias

```typescript
type User = {
  id: number;
  name: string;
  email?: string;
};

// Union 타입
type ID = string | number;
type Status = 'active' | 'inactive' | 'pending';

// Intersection 타입 (모든 타입의 속성을 합침)
type AdminUser = User & { role: string; permissions: string[] };

// 함수 타입
type Handler = (event: MouseEvent) => void;
```

### 언제 interface vs type?

| | `interface` | `type` |
|---|---|---|
| 객체 타입 정의 | ✅ | ✅ |
| Union / Intersection | ❌ | ✅ |
| 선언 병합 | ✅ | ❌ |
| extends | ✅ | `&`로 가능 |
| 원시 타입 별칭 | ❌ | ✅ |

**실무 가이드라인**:
- **interface**: 객체(클래스, API 응답 등) 타입 정의 — 확장 가능성이 있을 때
- **type**: Union, Intersection, 함수 타입, 유틸리티 타입 조합 — 유연한 타입이 필요할 때
- 팀이 있다면 **일관성**이 가장 중요. 하나로 통일해서 쓰는 게 낫다.

---

## 함수 타입

```typescript
// 기본 함수 타입
function add(a: number, b: number): number {
  return a + b;
}

// 화살표 함수
const multiply = (a: number, b: number): number => a * b;

// 선택적 매개변수 (?)
function greet(name: string, greeting?: string): string {
  return `${greeting ?? 'Hello'}, ${name}!`;
}

// 기본값
function greet(name: string, greeting: string = 'Hello'): string {
  return `${greeting}, ${name}!`;
}

// 나머지 매개변수
function sum(...numbers: number[]): number {
  return numbers.reduce((acc, n) => acc + n, 0);
}

// 함수 오버로딩
function format(value: string): string;
function format(value: number): string;
function format(value: string | number): string {
  if (typeof value === 'string') return value.toUpperCase();
  return value.toFixed(2);
}
```

---

## 제네릭 (Generics)

제네릭은 타입을 변수처럼 다루는 기능이다. "어떤 타입이든 동작하되, 타입 안전성은 유지하겠다"는 뜻이다.

```typescript
// 제네릭 없이 — 타입 정보 손실
function identity(value: any): any {
  return value; // 반환 타입이 any라 타입 정보가 없음
}

// 제네릭 사용 — 타입 정보 유지
function identity<T>(value: T): T {
  return value;
}

const num = identity(42);      // T = number, 반환 타입 number
const str = identity('hello'); // T = string, 반환 타입 string
```

### 제네릭 제약 (Constraints)

```typescript
// T는 반드시 length 속성을 가져야 함
function getLength<T extends { length: number }>(value: T): number {
  return value.length;
}

getLength('hello');      // OK (string은 length가 있음)
getLength([1, 2, 3]);    // OK (배열은 length가 있음)
getLength(42);           // 오류! (number는 length 없음)
```

### 실용적인 제네릭 함수 예시

```typescript
// API 응답을 제네릭으로 감싸기
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

async function fetchData<T>(url: string): Promise<ApiResponse<T>> {
  const response = await fetch(url);
  return response.json();
}

// 사용
interface User {
  id: number;
  name: string;
}

const result = await fetchData<User>('/api/users/1');
result.data.name; // TypeScript가 User 타입임을 알고 자동완성 제공

// 첫 번째 요소 반환
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

// 키로 객체 값 가져오기
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { id: 1, name: 'Alice' };
getProperty(user, 'name');  // string 반환
getProperty(user, 'email'); // 오류! 'email'은 user의 키가 아님
```

---

## 유틸리티 타입 (Utility Types)

TypeScript는 자주 쓰는 타입 변환 패턴을 내장 유틸리티 타입으로 제공한다.

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

// Partial<T> — 모든 속성을 optional로 만듦
type UserUpdate = Partial<User>;
// { id?: number; name?: string; email?: string; ... }

// Required<T> — 모든 속성을 필수로 만듦
type RequiredUser = Required<Partial<User>>;

// Readonly<T> — 모든 속성을 읽기 전용으로 만듦
type FrozenUser = Readonly<User>;
// frozenUser.name = 'Bob'; // 오류!

// Pick<T, K> — 특정 속성만 선택
type UserPreview = Pick<User, 'id' | 'name'>;
// { id: number; name: string }

// Omit<T, K> — 특정 속성 제외
type PublicUser = Omit<User, 'password'>;
// { id, name, email, createdAt } (password 제외)

// Record<K, V> — 키-값 맵 타입
type RolePermissions = Record<string, string[]>;
const permissions: RolePermissions = {
  admin: ['read', 'write', 'delete'],
  user: ['read'],
};

// Exclude<T, U> — Union에서 특정 타입 제외
type Status = 'active' | 'inactive' | 'pending' | 'deleted';
type ActiveStatus = Exclude<Status, 'deleted' | 'inactive'>;
// 'active' | 'pending'

// Extract<T, U> — Union에서 특정 타입만 추출
type Numeric = Extract<string | number | boolean, number>;
// number

// ReturnType<T> — 함수 반환 타입 추출
function getUser() {
  return { id: 1, name: 'Alice' };
}
type UserType = ReturnType<typeof getUser>;
// { id: number; name: string }

// Parameters<T> — 함수 매개변수 타입 추출
function createUser(name: string, age: number, email: string) {}
type CreateUserParams = Parameters<typeof createUser>;
// [string, number, string]
```

### 실전 활용 예시

```typescript
interface Todo {
  id: number;
  title: string;
  completed: boolean;
  dueDate: Date;
}

// API에서 받는 생성 요청: id와 완료 여부는 서버가 정함
type CreateTodoRequest = Omit<Todo, 'id' | 'completed'>;
// { title: string; dueDate: Date }

// 업데이트 요청: id는 필수, 나머지는 선택
type UpdateTodoRequest = Pick<Todo, 'id'> & Partial<Omit<Todo, 'id'>>;
// { id: number; title?: string; completed?: boolean; dueDate?: Date }
```

---

## React + TypeScript 실전

### Props 타입 정의

```typescript
// interface로 Props 정의
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  children?: React.ReactNode;
}

// 함수 컴포넌트
const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  variant = 'primary',
  disabled = false,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`btn btn-${variant}`}
  >
    {label}
  </button>
);

// React.FC 없이 (더 유연한 방식)
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2>{title}</h2>
      {children}
    </div>
  );
}
```

### useState와 타입

```typescript
// 타입 추론으로 충분한 경우
const [count, setCount] = useState(0);         // number
const [name, setName] = useState('');          // string
const [isOpen, setIsOpen] = useState(false);   // boolean

// 타입을 명시해야 하는 경우
const [user, setUser] = useState<User | null>(null);
const [items, setItems] = useState<string[]>([]);

// 복잡한 상태
interface FormState {
  username: string;
  email: string;
  errors: Record<string, string>;
}

const [form, setForm] = useState<FormState>({
  username: '',
  email: '',
  errors: {},
});
```

### useRef와 타입

```typescript
// DOM 요소 참조
const inputRef = useRef<HTMLInputElement>(null);

// 값 유지 (DOM 아닌 경우)
const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

// 사용
const focusInput = () => {
  inputRef.current?.focus(); // optional chaining 필요
};
```

### 이벤트 타입

```typescript
// 자주 쓰는 이벤트 타입들
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  console.log(e.currentTarget.name);
};

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setName(e.target.value);
};

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
};

const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'Enter') doSearch();
};
```

---

## 자주 하는 실수와 해결법

### ① any 남용

```typescript
// ❌ 타입스크립트 쓰는 의미가 없어짐
function processData(data: any) {
  return data.result.items.map((item: any) => item.value);
}

// ✅ 실제 타입을 정의하거나 unknown + 타입 가드 사용
interface ApiData {
  result: {
    items: Array<{ value: string }>;
  };
}

function processData(data: unknown) {
  if (isApiData(data)) {
    return data.result.items.map(item => item.value);
  }
  throw new Error('Invalid data format');
}
```

### ② Type Assertion(as) 남용

```typescript
// ❌ 위험 — 실제로는 User가 아닐 수 있음
const user = JSON.parse(jsonString) as User;
user.name.toUpperCase(); // 런타임 오류 가능

// ✅ 검증 후 사용
function parseUser(json: string): User {
  const data = JSON.parse(json);
  if (typeof data.name !== 'string') throw new Error('Invalid user');
  return data as User; // 검증 후 assertion은 안전
}
```

### ③ Non-null assertion(!) 남용

```typescript
// ❌ !를 습관적으로 붙이면 타입스크립트의 의미 없음
const element = document.getElementById('root')!;

// ✅ 실제로 null이 아님을 확인 후 사용
const element = document.getElementById('root');
if (!element) throw new Error('root element not found');
// 이제 element는 HTMLElement
```

---

## JavaScript → TypeScript 마이그레이션 전략

이미 JavaScript로 작성된 프로젝트를 TypeScript로 전환할 때:

```
1단계: tsconfig.json 추가, .js → .ts 확장자 변경
       "allowJs": true, "strict": false 로 시작

2단계: 핵심 모듈부터 타입 추가
       any를 일단 허용하면서 조금씩 타입 정의

3단계: strict 옵션 활성화
       any를 실제 타입으로 대체
       strictNullChecks 오류 처리

4단계: any 제거, 유틸리티 타입 활용
       완전한 TypeScript 코드베이스
```

한 번에 전환하려 하지 말고, 파일 단위로 점진적으로 전환하는 것이 실용적이다.

---

TypeScript는 처음엔 타입 오류와 씨름하는 것 같아서 번거롭게 느껴질 수 있다. 하지만 프로젝트 규모가 커질수록 TypeScript가 제공하는 **IDE 자동완성**, **리팩토링 안전성**, **버그 사전 차단**의 가치가 훨씬 커진다.

다음 글에서는 TypeScript로 React 앱을 실전에서 어떻게 구조화하는지, 그리고 API 레이어를 어떻게 타입 안전하게 만드는지 다룰 예정이다.

---

## 관련 글

- [⚡ JavaScript 비동기 처리 완전 가이드](/javascript-async/) — TypeScript와 함께 쓰는 async/await 패턴
- [📘 React Props와 State 완전 정복](/react-2-props-state/) — TypeScript로 React 컴포넌트 타입 정의하기
- [🎨 CSS Flexbox & Grid 완전 정복](/css-layout-guide/) — 프론트엔드 개발의 또 다른 핵심 기술
