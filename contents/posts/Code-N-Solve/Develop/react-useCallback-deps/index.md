---
title: "useCallback 없는 함수가 useEffect를 매 렌더마다 실행시킨 이야기"
description: "Pomodoro 타이머 앱에서 배경음이 뚝뚝 끊기는 버그를 겪었습니다. stopNoise 함수에 useCallback을 빠뜨렸고, 그게 useEffect deps 체인을 타고 매 렌더마다 오디오 컨텍스트를 close/reopen했습니다. useCallback을 왜, 언제 써야 하는지 정리합니다."
date: 2026-05-27
update: 2026-05-27
tags:
  - React
  - JavaScript
  - useEffect
  - useCallback
  - 웹 개발
  - 프론트엔드
category: "Code N Solve"
series: "React 버그 해부"
---

> **React 버그 해부 시리즈**
> - [1편] [React 타이머 앱에서 stale closure에 세 번 당한 이야기](/react-stale-closure-timer/)
> - [2편] **useCallback 없는 함수가 useEffect를 매 렌더마다 실행시킨 이야기** ← 현재 글
> - [3편] [백그라운드 탭에서 setInterval 타이머가 느려지는 이유와 벽시계 해법](/react-background-timer-drift/)

---

[지난 글](/react-stale-closure-timer/)에서 TimeTrack 타이머 앱을 만들다 stale closure 버그를 세 번 겪은 이야기를 썼다. 그 과정에서 `useCallback`을 도입했는데, `useCallback`을 어디에 왜 써야 하는지 몰랐을 때 생긴 버그가 하나 더 있었다.

증상: 집중 중에 화이트노이즈를 켜두면 아무것도 안 했는데 배경음이 뚝 끊겼다 다시 켜진다.

---

## 코드 구조

배경음 관련 코드는 이렇게 생겼다.

```js
const audioCtxRef    = useRef(null);
const noiseSourceRef = useRef(null);

// 오디오 컨텍스트 종료 함수
const stopNoise = () => {
  if (noiseSourceRef.current) {
    try { noiseSourceRef.current.stop(); } catch {}
    noiseSourceRef.current = null;
  }
  if (audioCtxRef.current) {
    try { audioCtxRef.current.close(); } catch {}
    audioCtxRef.current = null;
  }
};

// 재생/정지 제어
useEffect(() => {
  const shouldPlay = isActive && !isPaused && !isBreak && soundMode !== "off";
  if (!shouldPlay) {
    stopNoise();
    return;
  }

  const ctx = new AudioContext();
  audioCtxRef.current = ctx;
  // 노이즈 생성 후 재생...

  return () => stopNoise(); // cleanup
}, [isActive, isPaused, isBreak, soundMode]); // stopNoise 빠짐
```

이 코드의 문제가 뭔지 한눈에 보이는가? 처음엔 나도 못 봤다.

---

## 원인: 함수도 매 렌더마다 새로 만들어진다

React에서 컴포넌트 함수 안에 선언된 일반 함수는 **렌더링마다 새로 생성된다**. `stopNoise`도 마찬가지다. 렌더가 일어날 때마다 새로운 `stopNoise` 함수 객체가 만들어진다.

여기서 문제가 시작된다.

ESLint의 `react-hooks/exhaustive-deps` 규칙은 `useEffect` 안에서 사용하는 모든 값을 deps에 넣으라고 경고한다. `stopNoise`도 `useEffect` 안에서 호출하므로 deps에 넣어야 한다. 그런데 위 코드에서는 `stopNoise`가 deps에 빠져 있다.

"deps에 안 넣으면 그냥 경고만 나는 거 아닌가?"라고 생각하기 쉽다. 하지만 `stopNoise`를 deps에 넣으면 어떻게 될지 생각해보면 문제가 명확해진다.

`stopNoise`가 매 렌더마다 새 함수가 생성되고, 이것을 deps에 넣으면 → `stopNoise`가 바뀔 때마다 effect 재실행 → 매 렌더마다 effect 재실행 → 오디오 컨텍스트를 close하고 다시 open.

그래서 `stopNoise`를 deps에서 뺀 것이다. 경고를 무시한 채로. 결과적으로 cleanup 함수 안의 `stopNoise`가 stale한 참조를 물고 있게 돼 오작동했다.

---

## 왜 배경음이 끊겼을까

정확한 흐름은 이렇다.

1. 집중 중 — `isActive=true`, `isBreak=false`, `soundMode="white"` → 오디오 재생 중
2. 사용자가 할 일 체크 등 다른 상호작용을 함 → 리렌더링 발생
3. 리렌더링마다 `stopNoise` 함수 객체가 새로 생성됨
4. `useEffect`의 cleanup은 이전 렌더의 `stopNoise`를 들고 있음
5. cleanup 함수의 동작이 불안정해지면서 오디오 컨텍스트가 의도치 않게 닫힘
6. 다음 effect 실행에서 새 오디오 컨텍스트가 열림 → 배경음 끊김 현상

---

## 해결: useCallback으로 함수 참조 고정

```js
// useCallback: deps가 바뀌지 않으면 함수 참조를 재사용한다
const stopNoise = useCallback(() => {
  if (noiseSourceRef.current) {
    try { noiseSourceRef.current.stop(); } catch {}
    noiseSourceRef.current = null;
  }
  if (audioCtxRef.current) {
    try { audioCtxRef.current.close(); } catch {}
    audioCtxRef.current = null;
  }
}, []); // deps가 빈 배열 → 컴포넌트 생애 동안 동일한 함수 참조 유지

useEffect(() => {
  const shouldPlay = isActive && !isPaused && !isBreak && soundMode !== "off";
  if (!shouldPlay) {
    stopNoise();
    return;
  }
  // ...
  return () => stopNoise();
}, [isActive, isPaused, isBreak, soundMode, stopNoise]); // stopNoise 포함
```

`stopNoise`가 `ref`만 참조하고 `state`나 `props`를 참조하지 않으므로 deps를 비워도 된다. `ref`는 렌더 간 동일한 객체 참조이기 때문이다.

이제 `stopNoise`는 마운트 시 한 번만 생성되고 이후 렌더에서 재사용된다. deps에 안전하게 포함할 수 있고, cleanup도 항상 최신 함수를 가리킨다.

---

## useCallback을 쓰는 기준

이번 버그를 겪고 나서 정리된 기준이다.

### deps가 `[]`인 경우: state/props 미참조 함수

```js
// ref만 쓴다 → deps = []
const stopNoise = useCallback(() => {
  if (someRef.current) { ... }
}, []);
```

`ref`는 변경돼도 참조(identity)가 바뀌지 않으므로 deps에 넣지 않아도 된다. 함수 내부에서 `ref`만 쓴다면 deps를 비울 수 있고, 함수 참조가 완전히 고정된다.

### deps가 있는 경우: state를 읽는 함수

```js
const handleSubmit = useCallback(() => {
  if (!inputValue) return;
  submitData(inputValue);
}, [inputValue]); // inputValue가 바뀔 때만 재생성
```

`inputValue`가 바뀔 때만 함수가 재생성된다. 자식 컴포넌트에 props로 내려줄 때 불필요한 리렌더링을 줄이는 데 유용하다.

### stateRef 패턴과 함께: deps가 없어도 최신값 참조

```js
// stateRef로 최신 state 노출
const stateRef = useRef({});
stateRef.current = { focusTime, isBreak };

// stateRef를 쓰면 state를 deps에 안 넣어도 된다
const startTimer = useCallback(() => {
  const { focusTime } = stateRef.current; // 항상 최신값
  setTime(focusTime * 60);
  setIsActive(true);
}, []); // deps = []
```

[지난 글](/react-stale-closure-timer/)에서 다뤘던 패턴이다. `useCallback`과 `stateRef`를 함께 쓰면 "항상 최신 state를 읽으면서도 함수 참조가 고정된" 함수를 만들 수 있다.

---

## useCallback이 필요 없는 경우

`useCallback`이 만능은 아니다. 오히려 불필요하게 붙이면 코드만 복잡해진다.

```js
// 이건 useCallback 필요 없다
const openModal = () => setIsModalOpen(true);

// JSX 안의 인라인 핸들러도 마찬가지
<button onClick={() => doSomething(id)}>클릭</button>
```

`useCallback`이 의미 있는 경우는 두 가지다.

1. **`useEffect`의 deps에 함수를 넣어야 할 때** — 함수 참조가 안정돼야 effect가 불필요하게 재실행되지 않는다.
2. **자식 컴포넌트에 함수를 props로 내릴 때** — 자식이 `React.memo`로 감싸져 있고 함수 prop이 바뀔 때마다 리렌더링하는 게 문제가 될 때.

단순히 "최적화하려고" 모든 함수에 `useCallback`을 붙이는 건 효과가 없다. 오히려 deps 배열 관리 실수가 새 버그를 만들 수 있다.

---

## 정리

| 상황 | 해결 |
|---|---|
| 함수를 `useEffect` deps에 넣어야 하는데 매 렌더마다 재생성된다 | `useCallback`으로 함수 참조 고정 |
| 함수 내부에서 state를 참조하지 않는다 | `useCallback(fn, [])` — deps 빈 배열 |
| 함수 내부에서 state를 참조해야 하는데 deps를 비우고 싶다 | `stateRef` 패턴 + `useCallback(fn, [])` |
| 단순 이벤트 핸들러, JSX 인라인 함수 | `useCallback` 불필요 |

이번 버그의 핵심은 **"deps에서 함수를 빼는 것"이 해결이 아니라는 점**이다. deps 경고가 나면 함수를 `useCallback`으로 안정화해서 deps에 넣는 것이 올바른 방향이다.

TimeTrack 전체 코드는 [GitHub](https://github.com/leekh8/TimeTrack)에서 볼 수 있다.
