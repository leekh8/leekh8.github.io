---
title: "React 타이머 앱에서 stale closure에 세 번 당한 이야기"
description: "Pomodoro 타이머를 만들다가 설정이 반영 안 되고, 배경음이 끊기고, 초기화가 오작동하는 버그를 연달아 겪었습니다. 원인은 전부 stale closure였고, stateRef 패턴과 useCallback으로 해결했습니다."
date: 2026-05-12
update: 2026-05-12
tags:
  - React
  - JavaScript
  - useEffect
  - 웹 개발
  - 프론트엔드
category: "Code N Solve"
series: "React 버그 해부"
---

> **React 버그 해부 시리즈**
> - [1편] **React 타이머 앱에서 stale closure에 세 번 당한 이야기** ← 현재 글
> - [2편] [useCallback 없는 함수가 useEffect를 매 렌더마다 실행시킨 이야기](/react-useCallback-deps/)
> - [3편] [백그라운드 탭에서 setInterval 타이머가 느려지는 이유와 벽시계 해법](/react-background-timer-drift/)
> - [4편] [드래그 앤 드롭이 조용히 죽었다 — react-beautiful-dnd와 React 18 StrictMode](/react-beautiful-dnd-strictmode/)

---

[TimeTrack](https://github.com/leekh8/TimeTrack)이라는 Pomodoro 타이머 앱을 만들고 있었다. 기능은 단순했다. 집중 시간 동안 타이머가 돌고, 끝나면 휴식으로 넘어가고, 배경에 화이트노이즈를 틀어주는 것.

그런데 이상한 버그들이 연달아 터졌다.

- 설정에서 집중 시간을 25분 → 30분으로 바꾸고 시작을 눌렀는데 25분짜리가 시작된다.
- 휴식 중에 초기화 버튼을 눌렀더니 집중 시간이 아니라 휴식 시간(5분)으로 리셋됐다.
- 집중 중 배경음이 가끔 툭 끊겼다가 다시 켜진다.

모두 `stale closure` 문제였다.

---

## stale closure가 뭔지 한 줄로

`useEffect` 내부, `setInterval` 콜백, 이벤트 핸들러는 **정의된 시점의 변수 값을 캡처**한다. 이후 state가 바뀌어도 콜백 안에서는 옛날 값이 보인다. 이 "오래된 값을 물고 있는" 상태가 stale closure다.

---

## 버그 1: 설정을 바꿔도 타이머가 이전 시간으로 시작된다

### 증상

집중 시간을 기본값(25분)에서 30분으로 바꾸고 시작을 눌렀다. 타이머는 25분으로 시작됐다.

### 원인

`startTimer` 함수가 컴포넌트 내에 일반 함수로 선언돼 있었다.

```js
// 문제 코드
const [focusTime, setFocusTime] = useState(25);

function startTimer() {
  setTime(focusTime * 60); // focusTime을 클로저로 캡처
  setIsActive(true);
  // ...
}
```

`startTimer`가 처음 정의될 때 `focusTime`은 25다. 이후 사용자가 설정을 바꿔도 `startTimer` 내부의 `focusTime`은 그대로 25를 본다.

`useEffect`에 등록된 이벤트 핸들러나 `setInterval` 콜백도 마찬가지다. 함수가 정의된 순간의 값을 캡처하기 때문에, state가 바뀐 뒤에 호출돼도 최신 값을 참조하지 못한다.

### 해결: stateRef 패턴

렌더링마다 ref에 최신 state를 덮어쓰고, 함수 내부에서는 ref에서 읽는다.

```js
// stateRef: 항상 최신 state를 가리킨다
const stateRef = useRef({});
stateRef.current = { isBreak, focusTime, breakTime, currentCycle, repeatCycles };

const startTimer = useCallback(() => {
  const { focusTime: ft } = stateRef.current; // 호출 시점의 최신값
  setTime(ft * 60);
  setIsBreak(false);
  setCurrentCycle(0);
  setIsActive(true);
  setIsPaused(false);
}, []); // deps 없음: stateRef는 ref라서 변경돼도 useCallback을 재생성하지 않는다
```

`stateRef.current`는 매 렌더마다 새로 쓰이므로 항상 최신 state다. `useCallback`의 deps는 비워도 되는데, `stateRef` 자체는 렌더 간 동일한 객체 참조이기 때문이다.

---

## 버그 2: 초기화했더니 집중 시간이 아니라 휴식 시간으로 리셋됐다

### 증상

휴식 중(5분 타이머 돌아가는 중)에 초기화 버튼을 눌렀다. 타이머가 25분으로 돌아가야 하는데 5분짜리가 다시 시작됐다. 게다가 다음 사이클을 시작해도 `currentCycle`이 0으로 안 돌아오는 경우가 있었다.

### 원인

`resetTimer`에 두 가지 문제가 있었다.

```js
// 문제 코드
function resetTimer() {
  stopNoise();
  setTime(isBreak ? breakTime * 60 : focusTime * 60); // isBreak를 클로저로 캡처
  setIsActive(false);
  setIsPaused(false);
  // isBreak, currentCycle 리셋 누락!
}
```

1. `isBreak`를 클로저로 읽는다. 상황에 따라 stale한 값이 보일 수 있다.
2. `setIsBreak(false)`, `setCurrentCycle(0)`이 없다. 초기화를 눌러도 내부 상태는 "휴식 중" 또는 "3사이클 진행" 상태로 남는다.

### 해결

```js
const resetTimer = useCallback(() => {
  stopNoise();
  const { focusTime: ft } = stateRef.current;
  setIsActive(false);
  setIsPaused(false);
  setIsBreak(false);    // 명시적으로 집중 상태로 복귀
  setCurrentCycle(0);   // 사이클 카운터도 초기화
  setTime(ft * 60);     // 항상 집중 시간으로
}, [stopNoise]);
```

초기화 함수라면 모든 관련 state를 명시적으로 초기값으로 되돌려야 한다. "당연히 되겠지"라고 넘어간 것들이 버그가 된다.

---

## 버그 3: 배경음이 끊겼다 켜졌다 한다

### 증상

집중 중에 화이트노이즈를 켰는데, 뭔가 클릭할 때마다 배경음이 순간 툭 끊기고 다시 켜지는 느낌이 들었다.

### 원인

`stopNoise`가 일반 함수로 선언돼 있었고, 이것이 `useEffect`의 deps에 빠져 있었다.

```js
// 문제 코드
const stopNoise = () => {
  // 오디오 컨텍스트 종료
};

useEffect(() => {
  const shouldPlay = isActive && !isPaused && !isBreak && soundMode !== "off";
  if (!shouldPlay) { stopNoise(); return; }

  // 오디오 컨텍스트 생성 및 재생...
  return () => stopNoise();
}, [isActive, isPaused, isBreak, soundMode]); // stopNoise 누락!
```

ESLint의 `exhaustive-deps` 규칙이 경고를 내는 바로 그 상황이다. `stopNoise`가 deps에 없으니 "괜찮아 보이지만" 실제로는 문제가 있다.

`stopNoise`는 일반 함수라서 **매 렌더마다 새로운 함수 참조**가 만들어진다. 만약 deps에 포함했다면 `stopNoise`가 바뀔 때마다 (= 매 렌더마다) effect가 재실행됐을 것이다. 그래서 의도적으로 뺐을 가능성이 높다. 하지만 그 결과로 클린업 함수 안의 `stopNoise`가 오래된 참조를 물고 있어서 오작동했다.

### 해결: useCallback으로 안정화

```js
// stopNoise는 ref만 참조하므로 deps가 없어도 된다
const stopNoise = useCallback(() => {
  if (noiseSourceRef.current) {
    try { noiseSourceRef.current.stop(); } catch {}
    noiseSourceRef.current = null;
  }
  if (audioCtxRef.current) {
    try { audioCtxRef.current.close(); } catch {}
    audioCtxRef.current = null;
  }
}, []); // ref는 렌더 간 동일한 참조 → deps 불필요

useEffect(() => {
  // ...
  return () => stopNoise();
}, [isActive, isPaused, isBreak, soundMode, stopNoise]); // stopNoise 포함
```

`stopNoise`가 `useCallback`으로 안정화되면 참조가 바뀌지 않으므로, deps에 포함해도 effect가 매 렌더마다 재실행되지 않는다.

**핵심**: 함수가 state나 props를 참조하지 않고 ref만 쓴다면 `useCallback(() => {...}, [])`으로 선언해서 참조를 안정화할 수 있다.

---

## 패턴 정리

실제로 겪고 나서 정리된 기준이다.

### `stateRef.current` 패턴

```js
const stateRef = useRef({});
stateRef.current = { foo, bar, baz }; // 매 렌더마다 덮어씀

const handler = useCallback(() => {
  const { foo } = stateRef.current; // 항상 최신값
}, []); // stateRef는 고정 참조라서 deps 불필요
```

**언제**: interval, 이벤트 핸들러, `useCallback`에서 여러 state를 동시에 읽어야 하는데, 그 함수를 deps 없이 안정화하고 싶을 때.

### functional updater

```js
setTime((prev) => (prev > 0 ? prev - 1 : 0));
setIsPaused((p) => !p);
```

**언제**: 이전 값만 있으면 되는 단순한 업데이트. 다른 state를 함께 읽을 필요가 없을 때. `setInterval` 카운트다운에 딱 맞는다.

### `useCallback(() => {...}, [])`

**언제**: 함수 내부에서 state/props가 아닌 ref만 참조할 때. `deps = []`로 함수 참조를 완전히 고정할 수 있다.

---

## 공통 징후

stale closure 버그는 보통 이런 식으로 나타난다.

- 기능이 가끔은 되고 가끔은 안 된다.
- 첫 번째 동작은 정상인데 두 번째부터 이상하다.
- 설정을 바꿨는데 이전 설정으로 동작한다.
- `console.log`를 찍으면 값이 이상하게 옛날 것이다.

이 증상이 보이면 클로저가 어떤 시점의 값을 캡처하고 있는지부터 의심해보는 게 빠르다.

---

## 마무리

타이머 앱이라서 오히려 stale closure를 다양하게 경험할 수 있었다. interval로 카운트다운을 구현하면서, 이벤트 핸들러에서 state를 읽으면서, cleanup 함수에서 이전 참조를 쓰면서. 간단해 보이는 앱이 React 동작 방식을 꽤 잘 보여준다.

[TimeTrack 코드 전체](https://github.com/leekh8/TimeTrack)는 GitHub에 있다. `client/src/components/Timer.js`와 `client/src/context/AppContext.js`에서 위에서 설명한 패턴들을 그대로 볼 수 있다.
