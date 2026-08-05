---
title: "📘 CRA에서 Vite로 넘어올 때 조용히 발목 잡는 것들"
description: "create-react-app 프로젝트를 Vite 5로 옮기면서 만난 세 가지 함정 — JSX 확장자, %PUBLIC_URL%, react-helmet. 어느 것도 에러 메시지가 친절하지 않았다."
date: 2026-08-05
update: 2026-08-05
tags:
  - React
  - Vite
  - CRA
  - JavaScript
  - 프론트엔드
  - 마이그레이션
  - 웹 개발
series: "Code N Solve"
category: "Code N Solve"
---

[SEO-Booster](https://github.com/leekh8/SEO-Booster)를 `create-react-app`에서 Vite 5로 옮겼다. 단순 설정 교체겠거니 했는데, 세 군데서 조용히 막혔다. 공통점이 있었다. **에러 메시지가 원인을 가리키지 않았다.**

---

## 함정 1: JSX 파일 확장자

Vite는 내부적으로 Rollup 기반이다. 그리고 Rollup은 **`.js` 파일에서 JSX를 기본으로 처리하지 않는다.** `@vitejs/plugin-react`를 설치해도 마찬가지다. 플러그인이 JSX를 처리하는 건 확장자가 `.jsx`(또는 `.tsx`)일 때뿐이다.

CRA는 `react-scripts` 내부의 Babel 설정이 `.js` 파일에서도 JSX를 알아서 처리해줬다. 그래서 CRA 프로젝트에선 컴포넌트 파일이 `.js`여도 아무 문제없이 돌아간다. 이게 Vite로 넘어오는 순간 폭탄이 된다.

```
src/components/Editor.js → (Vite/Rollup) → JSX 처리 안 함 → 빌드 실패 또는 런타임 오류
```

증상은 프로젝트마다 다르다. 빌드 자체가 깨지기도 하고, 개발 서버는 뜨는데 화면이 빈 채로 콘솔에 파싱 오류가 뜨기도 한다. 처음엔 설정 파일 문제로 착각하기 쉽다.

**해결**: `.js` → `.jsx`로 전부 바꾼다. 일괄 rename이라 번거롭지만, import 경로도 함께 바꿔줘야 한다.

```bash
# 일괄 확인: JSX 문법이 담긴 .js 파일 목록
grep -rl "return (" src --include="*.js" | grep -v ".test.js"
```

`vite.config.js`에서 `optimizeDeps.esbuildOptions`로 `.js`도 JSX로 처리하게 강제할 수 있긴 하다. 하지만 확장자가 역할을 드러내는 게 낫다. 강제 설정은 다음 사람이 왜 이게 있는지 이해 못 한다.

```js
// vite.config.js — 확장자 강제 방법 (비권장, 임시 우회용)
export default defineConfig({
  optimizeDeps: {
    esbuildOptions: {
      loader: { '.js': 'jsx' },
    },
  },
});
```

---

## 함정 2: %PUBLIC_URL%

CRA는 `public/` 폴더 안의 파일을 참조할 때 `%PUBLIC_URL%`이라는 특수 변수를 제공한다. `public/index.html`에서 자주 쓰인다.

```html
<!-- CRA: public/index.html -->
<link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
<meta property="og:image" content="%PUBLIC_URL%/logo192.png" />
```

Vite는 이걸 모른다. 그대로 두면 실제 URL에 `%PUBLIC_URL%`이라는 문자열이 그대로 박힌다. 파비콘이 안 뜨고 OG 이미지가 깨진다.

**해결**: Vite의 `index.html`은 프로젝트 루트에 놓고, `public/` 파일은 그냥 `/`로 참조한다.

```html
<!-- Vite: index.html (루트에 위치) -->
<link rel="icon" href="/favicon.ico" />
<meta property="og:image" content="/logo192.png" />
```

빌드 경로를 커스텀했거나 서브디렉토리에 배포한다면 `import.meta.env.BASE_URL`을 쓴다.

```html
<link rel="icon" href="<%= import.meta.env.BASE_URL %>favicon.ico" />
```

---

## 함정 3: react-helmet

`react-helmet`은 `<head>` 태그를 컴포넌트에서 제어하는 라이브러리다. CRA 프로젝트에서 메타 태그, OG, 타이틀 등을 다루는 가장 흔한 선택이다.

그런데 `react-helmet`은 오래전부터 유지보수가 멈춰 있다. React 18의 StrictMode 이중 마운트에서 내부 상태 관리가 어긋나고, 특히 SSR 환경에서 메모리 누수가 보고된다. CRA 환경에선 티가 안 나다가 Vite로 옮기며 개발 설정을 정리하는 과정에서 경고가 눈에 띄기 시작한다.

대체제는 **`react-helmet-async`** 다. API가 거의 같아서 교체 비용이 작다.

```bash
npm uninstall react-helmet
npm install react-helmet-async
```

```jsx
// ❌ react-helmet (유지보수 중단)
import { Helmet } from "react-helmet";

// ✅ react-helmet-async (React 18 StrictMode 호환)
import { Helmet, HelmetProvider } from "react-helmet-async";
```

앱 최상단에 `<HelmetProvider>`로 감싸줘야 한다.

```jsx
// main.jsx
import { HelmetProvider } from "react-helmet-async";

root.render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);
```

---

## CRA 마이그레이션이 불필요한 패키지를 드러낸다

`react-scripts`는 편리하지만 의존성을 블랙박스로 숨긴다. Vite로 넘어오면서 `package.json`을 다시 들여다보면, 실제로 쓰지 않는 패키지들이 명시적으로 보이기 시작한다.

SEO-Booster를 옮기며 제거한 패키지들:

```
axios, redux, react-redux, react-router-dom,
react-dnd, tui-editor, react-helmet, dotenv, web-vitals
```

9개가 한 번도 실제 기능에 쓰이지 않았다. 초기 세팅 시 "나중에 쓸 것 같아서" 넣어 둔 것들이다. CRA 때는 `react-scripts`가 빌드를 알아서 해줘서 이게 빌드 시간이나 번들 크기에 얼마나 영향을 주는지 체감하기 어렵다. Vite로 넘어오면 번들 분석도 쉬워지고, 불필요한 것들이 눈에 확 들어온다.

```bash
# Vite 빌드 후 번들 분석
npx vite-bundle-visualizer
```

---

## 마이그레이션 순서 정리

1. `react-scripts` 제거, `vite` + `@vitejs/plugin-react` 설치
2. `vite.config.js` 작성 (`root: '.'`, `publicDir: 'public'`)
3. `index.html`을 루트로 이동, `%PUBLIC_URL%` 제거
4. 컴포넌트 파일 `.js` → `.jsx` 일괄 rename + import 경로 수정
5. 환경변수 prefix `REACT_APP_` → `VITE_`, 참조 코드 `process.env.` → `import.meta.env.`
6. `react-helmet` → `react-helmet-async` 교체 (쓰고 있다면)
7. `package.json` scripts 수정: `"start": "vite"`, `"build": "vite build"`, `"preview": "vite preview"`
8. 테스트 프레임워크를 Jest에서 Vitest로 전환 (선택, 하지만 권장)

---

## 마무리

세 함정 모두 **CRA가 내부에서 해주던 걸 Vite는 안 해준다**는 패턴이다. CRA는 편의를 위해 많은 걸 숨겼고, 그 덕에 시작은 빠르지만 안에서 무슨 일이 일어나는지 잘 안 보였다. Vite는 더 투명하고 빠르지만, 그 투명함이 숨겨져 있던 전제들을 한꺼번에 드러낸다.

마이그레이션 자체는 어렵지 않다. 다만 에러 메시지가 원인을 직접 안 알려줄 때가 많다. "JSX 파싱 오류"가 뜨면 확장자를, 파비콘이 깨지면 `%PUBLIC_URL%`을, StrictMode 경고가 보이면 react-helmet을 먼저 확인한다.

---

### 관련 글

- [React 버그 해부 1편 — stale closure에 세 번 당한 이야기](/react-stale-closure-timer/)
- [React 버그 해부 4편 — 드래그 앤 드롭이 조용히 죽었다](/react-beautiful-dnd-strictmode/)
- [Vite CJS API Deprecated 경고 해결 + 배포 오류 완전 가이드](/vite-deploy-error/)
