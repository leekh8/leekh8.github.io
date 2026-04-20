---
title: "📘React 기초 정리 "
description: "React는 JSX, 컴포넌트, 상태 관리를 기반으로 웹 UI를 효율적으로 개발하는 JavaScript 라이브러리이다"
date: 2023-05-01
update: 2024-03-27
tags:
  - React
  - SPA
  - Component
  - Hook
  - JSX
  - NPM
  - Basic
series: "React Basic"
---

## React 기초 정리 📘

React는 웹 프론트엔드 개발에 혁신을 가져온 JavaScript 라이브러리.
사용자 인터페이스를 구축하기 위해 개발되었으며, 컴포넌트 기반의 개발을 가능하게 한다.

React의 기본 개념과 왜 React를 배워야 하는지, React의 특징, JSX의 활용, SPA의 개념, JSX와 일반 JavaScript의 차이점, Component의 개념과 활용, Component의 데이터 관리 방법등에 대해 알아보자.

## [React](https://react.dev/)란? 🤔

- 정의: React는 사용자 인터페이스를 구축하기 위한 JavaScript 라이브러리. Facebook에서 개발하였고, 컴포넌트 기반의 개발을 지향한다.[^1]
- 특징:
  - Component: 독립적인 단위로 쪼개어 구현되며, 레고 블럭처럼 여러 컴포넌트들을 조립하여 한 페이지를 완성한다.
  - Virtual DOM: 가상의 DOM을 메모리에 저장하고, 실제 DOM과 동기화하는 프로그래밍 개념. 이를 통해 성능을 향상시킨다.
  - JSX: JavaScript 내에서 HTML과 유사한 문법을 사용하여 UI를 표현한다. 이로 인해 개발자는 보다 직관적으로 UI를 구성할 수 있다.

### SPA (Single Page Application)와 전통적인 사이트 비교 🔄

- 전통적인 사이트: 페이지 변경이 필요할 때마다 서버에 요청하여 새로운 HTML을 받아오는 방식.
  이 과정에서 페이지 전체를 새로 불러온다.

  ```mermaid
  sequenceDiagram
    Client->>+Server: 최초 접속 요청
    Server-->>+Client: HTML 전달
    Client->>+Server: 데이터 전달 (Form Post)
    Server-->>+Client: HTML 전달
  ```

- SPA: 초기 로딩 시 서버로부터 HTML을 받아온 후, 이후의 페이지 변경은 AJAX 통신을 통해 필요한 데이터만 JSON 형태로 받아와서 클라이언트에서 렌더링한다.
  이 방식은 React를 포함한 현대적인 JavaScript 프레임워크/라이브러리에서 널리 사용된다.

  ```mermaid
  sequenceDiagram
    Client->>+Server: 최초 접속 요청
    Server-->>+Client: HTML 전달
    Client->>+Server: 데이터 전달 (AJAX 통신)
    Server-->>+Client: JSON 전달
  ```

## React를 공부해야 하는 이유 🚀

- 생산성과 재사용성: 컴포넌트와 Hook을 활용하여 개발자의 생산성을 높이고, 코드의 재사용성을 증가시킨다.
- 풍부한 자료와 라이브러리: React는 널리 사용되기 때문에 다양한 자료와 오픈소스 라이브러리를 쉽게 찾을 수 있다.
- 다양한 사용처: React를 배우면 웹 애플리케이션 뿐만 아니라 React Native를 통해 모바일 애플리케이션 개발에도 활용할 수 있다.

React를 배우는 것은 현대 웹 개발의 트렌드를 따라가는 데 있어 필수적인 요소가 되었다고 할 수 있다.
시작하기 전에, 기본적인 JavaScript 지식을 갖추는 것이 좋다.
React의 세계로! 🌟

## React의 핵심 특징 정리 🌟

React는 현대 웹 개발에서 중요한 역할을 하는 JavaScript 라이브러리. React의 주요 특징들을 좀 더 자세히 살펴보자.[^2]

### HTML과 JS 함께 사용하기 📝

- 전통적인 방식 (jQuery 사용 예): HTML 요소를 JavaScript로 동적으로 추가하는 방식.
  코드가 복잡해지고 유지보수가 어려워질 수 있다.

  ```javascript
  $("#todo-list").append(
    "<li><span>" +
      value +
      "</span><button type='button' class='complete'>complete</button> <button type='button' class='delete'>delete</button></li>"
  )
  ```

- React 방식 (JSX 사용 예): HTML과 JavaScript를 함께 사용하여 UI를 선언적으로 표현한다.
  코드가 더 간결하고 이해하기 쉽다.

  ```jsx
  <ol id="todo-list">
    {todoList.map((item, index) => (
      <li className={item.isCompleted ? "completed" : ""}>
        <span>{item.value}</span>
        <button onClick={() => handleCompleteClick(index)}>complete</button>
        <button onClick={() => handleDeleteClick(index)}>delete</button>
      </li>
    ))}
  </ol>
  ```

### Component 기반 개발 🛠️

- React는 컴포넌트 기반으로 개발된다.
  각 컴포넌트는 독립적인 단위로, 재사용이 가능하며, 복잡한 UI도 쉽게 구성할 수 있다.

  ```jsx
  const App = () => {
    const text = "hello world"
    return <span>{text}</span>
  }
  ```

### State를 통한 데이터 관리 🔄

- React에서는 state를 사용하여 컴포넌트의 상태를 관리한다. state가 변경될 때마다 컴포넌트는 자동으로 다시 렌더링된다.
  ```jsx
  const [todoList, setTodoList] = useState([])
  const [inputValue, setInputValue] = useState("")
  ```

React의 이러한 특징들은 개발자가 더 효율적으로 웹 애플리케이션을 구축할 수 있도록 돕는다.
JSX, 컴포넌트, 그리고 상태 관리는 React 개발의 핵심을 이루며, 이를 통해 더 나은 사용자 경험을 제공하는 웹 애플리케이션을 만들 수 있다.
React를 배우고 싶다면, 이러한 개념들을 깊이 이해하는 것이 중요! 🚀

## Create React App(CRA) 및 Node.js, NPM에 대한 정리 🚀

Create React App(CRA)은 React 프로젝트를 쉽게 시작할 수 있게 해주는 도구.[^3]
Facebook에 의해 만들어졌으며, 프로젝트 생성부터 다양한 개발 도구를 제공한다.
Node.js와 NPM은 CRA를 사용하여 React 프로젝트를 시작할 때 필수적인 환경이다.

### Create React App(CRA) 🛠️

- 개요: React 프로젝트를 쉽게 생성할 수 있도록 도와주는 Boilerplate.
  직접 스크립트를 추가하여 사용하는 것도 가능하지만, CRA를 사용하면 더 편리하다.
- 장점:
  - 개발에 집중할 수 있도록 환경을 구성해준다.
  - 다양한 브라우저에서 작동할 수 있도록 transcompile을 지원한다. (예: babel, webpack)
- 사용 방법:[^4]
  ```bash
  npx create-react-app <directory name>
  cd <directory name>
  npm start
  ```
- [공식 문서 및 자세한 정보](https://create-react-app.dev/)

### Node.js와 NPM 🌐

- Node.js:
  - 서버 프로그래밍에 주로 사용되는 JavaScript 기반의 소프트웨어 플랫폼.
  - 프론트엔드 개발자가 서버 개발에 쉽게 접근할 수 있도록 도와준다.
  - CRA를 사용한 React 프로젝트 생성 시 개발 환경 및 테스트 서버로 활용된다.
- NPM (Node Package Manager):
  - Node.js 환경에서 사용할 수 있는 패키지와 라이브러리를 관리하는 저장소.
  - 패키지 관리와 서버 실행, 관리에 필요한 다양한 명령어를 제공한다.
- 설치 및 사용:
  - Node.js 설치:
    - [Node.js 공식 홈페이지](https://nodejs.org/en) 에서 LTS 버전을 다운로드하고 설치한다.
  - 버전 확인: `node -v` 명령어로 설치된 Node.js 버전을 확인할 수 있다.

### React 프로젝트 생성 과정 📦

1. Node.js 설치: 위에서 언급한 대로 LTS 버전을 설치.
2. 프로젝트 생성: `npx create-react-app <directory name>` 명령어를 사용.
3. 프로젝트 실행: 생성된 디렉토리로 이동한 후 npm start 명령어로 프로젝트를 실행.

### npm 명령어 📚

- `npm install`: package.json에 정의된 의존성 패키지들을 설치.
- `npm install <package name>`: 원하는 패키지를 설치.
- `npm install <package name>@<version>`: 특정 버전의 패키지를 설치.
- `npm install <git repository 주소>`: git repository로부터 패키지를 설치.
- `npm start`: Node.js를 이용해 프로젝트를 실행.
- `npm build`: 프로젝트를 빌드.
- [더 많은 명령어 참고](https://docs.npmjs.com/cli/v9/commands?v=true)

CRA, Node.js, NPM을 활용하면 React 프로젝트를 효율적으로 시작하고 관리할 수 있다.
이 도구들은 현대 웹 개발에서 중요한 역할을 하며, 개발자가 더 나은 웹 애플리케이션을 만들 수 있도록 돕는다. 🌟

### React 프로젝트의 기본 구조 및 JSX 소개 📁

React 프로젝트를 시작하면 기본적으로 몇 가지 주요 디렉토리와 파일이 생성된다.
이들은 프로젝트의 구조를 이해하고 관리하는 데 중요한 역할을 한다.
또한, JSX는 React 개발에서 핵심적인 역할을 하는 문법으로, HTML과 유사하지만 JavaScript를 확장한 문법이다.[^5]

#### Directory 구조 📂

- `./node_modules/`: npm을 이용해 설치한 패키지 모음.
- `./public/`: 정적인 파일들(HTML, 이미지 등)의 모음.
- `./src/`: 리액트 개발을 위한 주요 소스 파일들이 위치한다.
- `./.gitignore`: git에 올리지 않을 파일 설정을 포함한다.
- `./package.json`: 프로젝트 관련 정보와 사용 패키지 명세 파일.
  패키지 버전은 ^, <=, >= 등의 기호로 범위를 표현할 수 있다.
- `./README.md`: 프로젝트에 관한 설명을 작성하는 파일.

#### 설치한 라이브러리 불러오기 📚

```jsx
import "package name" // CSS나 import만으로 역할을 하는 라이브러리
import something from "package name" // 기본적으로 불러와 활용할 때
import { a, b } from "package name" // 패키지 내 일부만 가져올 때
import * as something from "package name" // default로 export되지 않은 경우
```

## JSX 소개 ✨

JSX는 JavaScript를 확장한 문법으로, UI가 어떻게 생겨야 하는지 설명하기 위해 React와 함께 사용된다.
JSX는 React "엘리먼트"를 생성하며, HTML과 유사한 생김새를 가지지만 JavaScript의 모든 기능을 포함한다[^6].

### JSX의 장점

- 개발자 편의성의 향상
- 협업 용이 및 생산성의 향상
- 문법 오류 및 코드량 감소

### JSX의 특징

- HTML 태그 내에서 JavaScript 연산을 간결하게 표현할 수 있다.
- HTML과의 차이점으로는 class 대신 className을 사용하고, 스타일은 객체 형태로 표현한다.
- 닫는 태그가 필수이며, 최상단 element는 반드시 하나여야 한다.

#### JSX와 JavaScript의 차이점

- JSX는 사용자 인터페이스를 정의하는 데 사용되며, HTML처럼 보이지만 실제로는 JavaScript임.
- React에서는 JSX를 통해 컴포넌트를 정의하고, 이를 통해 UI를 구성한다. 이는 기존 JavaScript와 HTML을 사용하는 방식과는 다른 접근 방식을 제공한다[^7].

JSX는 React 개발에서 중요한 역할을 하며, 개발자가 보다 효율적으로 UI를 구성할 수 있도록 돕는다.
React 프로젝트의 구조와 JSX에 대해 이해하면, React 애플리케이션 개발에 있어 훨씬 더 편리하게 접근할 수 있다. 🚀

#### 브라우저에 데이터 저장 및 UI 업데이트 방법 💾🔄

브라우저에 데이터를 저장하고 UI를 업데이트하는 방법은 기술 스택에 따라 다르다.
JavaScript와 React는 이러한 작업을 처리하는 데 있어 서로 다른 접근 방식을 제공한다.

#### 브라우저에 데이터 저장 방법

##### JavaScript

- 사용자 데이터는 주로 DOM에 저장된다.
  DOM은 브라우저가 만들고 유지 관리하는 전체 HTML을 나타낸다.
- 사용자가 데이터를 입력하면, 개발자는 DOM에서 해당 값을 찾아 추출해야 한다.
  이 과정은 관리가 번거로울 수 있다[^8].

##### React

- React에서는 제어 컴포넌트를 사용하여 사용자 입력을 기반으로 상태를 관리하고 업데이트한다.
  이는 DOM에 의존하지 않고 JS 변수에 애플리케이션의 상태를 저장함으로써 이루어진다.
- 이 방식은 애플리케이션이 성장함에 따라 더욱 중요해지며, 코드 관리가 편리해진다.

#### UI 업데이트 방법

##### JavaScript

- UI 업데이트를 위해, 개발자는 DOM에서 요소를 찾고, 이벤트 리스너를 설정하여 사용자 상호작용에 반응해야 한다.
  이 과정은 복잡하고 관리하기 어려울 수 있다.

##### React

- React는 상태 관리를 통해 UI를 자동으로 업데이트한다. 상태가 변경되면 React는 이를 감지하고 필요한 UI 부분만을 효율적으로 업데이트한다.
- 이는 개발자가 UI 업데이트 로직에 집중하기보다는 사용자와의 상호작용 및 애플리케이션의 상태 관리에 더 집중할 수 있게 해준다[^9].

브라우저에 데이터를 저장하고 UI를 업데이트하는 방법은 기술의 선택에 따라 크게 달라질 수 있다. JavaScript는 직접적인 DOM 조작에 의존하는 반면, React는 상태 관리를 통해 보다 선언적이고 효율적인 방식을 제공한다.
이러한 차이점을 이해하는 것은 웹 개발에서 중요한 요소 중 하나. 🌟

## React 컴포넌트 🎨

React에서 페이지를 구성하는 기본 단위인 컴포넌트에 대해 알아보자.
컴포넌트는 React 애플리케이션의 핵심 요소로, 재사용 가능한 코드의 블록을 제공한다.

### 컴포넌트란? 🤔

- React에서의 역할: 페이지를 구성하는 최소 단위로, 재사용 가능한 UI 조각.
- 네이밍 규칙: 컴포넌트의 이름은 대문자로 시작한다.
  이는 일반 HTML 요소와 구별하기 위함임.

#### 컴포넌트의 종류

- Class 컴포넌트: 초기 React에서 주로 사용되었으며, Java 개발자에게 친숙한 개념.
  React의 생명 주기를 쉽게 파악할 수 있다.
- Function 컴포넌트: React v16부터 추가된 기능으로, 현재는 대부분의 컴포넌트가 이 형태로 사용된다.
  Hook을 사용하여 상태 관리가 가능하다.

#### Controlled Component와 Uncontrolled Component

- Controlled Component: form을 통해 입력을 받을 때, 각 input의 데이터를 state를 통해 직접 관리한.
- Uncontrolled Component: React로 input의 데이터를 직접 관리하지 않고, 필요할 때 DOM에서 직접 값을 가져온다.

#### 컴포넌트의 특징

- Props(Properties): 컴포넌트의 속성으로, 상위 컴포넌트로부터 데이터를 전달받는다.
- Children: 컴포넌트 안에 작성된 하위 요소로, props의 일부로 취급된다.

#### 컴포넌트의 데이터 관리

- Props를 통한 데이터 전달: 컴포넌트 간 데이터는 props를 통해 부모에서 자식으로 전달된다.
- State를 통한 내부 데이터 관리: 컴포넌트 내에서 데이터를 관리할 때는 state를 사용한다.

React 컴포넌트는 애플리케이션을 구성하는 데 있어 매우 중요한 역할을 한다.
컴포넌트를 통해 UI를 모듈화하고 재사용 가능한 코드를 생성하여, 개발 과정을 효율적으로 만들 수 있다.
데이터 관리에 대한 더 자세한 정보는 [여기](https://blog.stackademic.com/data-handling-in-react-components-props-state-and-best-practices-1c74ae800b43)에서 확인할 수 있다. 🌟

[^1]: https://ko.legacy.reactjs.org/tutorial/tutorial.html
[^2]: https://www.elancer.co.kr/blog/view?seq=167
[^3]: https://create-react-app.dev/
[^4]: https://legacy.reactjs.org/docs/create-a-new-react-app.html
[^5]: https://ko.legacy.reactjs.org/docs/introducing-jsx.html
[^6]: https://ko.legacy.reactjs.org/docs/introducing-jsx.html
[^7]: https://www.w3schools.com/react/react_css.asp
[^8]: https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Client-side_storage
[^9]: https://www.linkedin.com/pulse/understanding-react-reconciliation-heartbeat-ui-updates-rostami
