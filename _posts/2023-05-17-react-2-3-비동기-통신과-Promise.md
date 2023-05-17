---
categories: [React]
tags: [React, 비동기 통신, Promise]
img_path: /assets/lib/post-img/
mermaid: true
---

# 비동기 통신과 Promise

## JS의 비동기

- 서버에서 모든 데이터를 로드해 페이지를 빌드하던 초기 웹 환경에서는 별도의 JS 비동기 처리가 필요하지 않았다
- Ajax(Asynchronous JavaScrtipt and XML) 기술의 등장으로 페이지 로드 없이 client-side에서 서버로 요청을 보내 데이터를 처리할 수 있게 되면서 `XMLHttpRequest`라는 객체를 이용해 서버로 요청을 보낼 수 있게 되었다
- JS는 single-threaded language이기 때문에, 서버 요청을 기다려야 하는 상황이라면 사용자는 멈춰있는 브라우저를 보아야 한다
- 따라서 동기가 아닌 비동기 처리를 이용한 서버와의 통신 필요성이 야기되었다
- 비동기 요청 후, main thread는 사용자의 입력을 받거나, 페이지를 그리는 등의 작업을 처리한다
- 비동기 응답을 받으면, 응답을 처리하는 callback 함수를 task queue에 넣는다
- event loop는 main thread에 여유가 있을 때 task queue에서 함수를 꺼내 실행한다

  ### 동기

  - synchronous 코드는 해당 코드 블록을 실행할 때 thread의 제어권을 넘기지 않고 순서대로 실행하는 것을 의미한다

  ```js
  console.log("synchronous");

  for (let i = 0; i < 1000000; ++i) {
    console.log("blocking the main thread");
  }

  console.log("synchronous done");
  ```

  ### 비동기

  - asynchronous 코드는 코드의 순서와 실행 순서가 다르다
  - 비동기 처리 코드를 감싼 블럭은 task queue에 넣어진다
  - main thread가 동기 코드를 실행한 후 제어권이 돌아왔을 때 event loop가 task queue에 넣어진 비동기 코드를 실행한다

  ```js
  setTimeout(() => console.log("asynchronous"), 5000);

  console.log("here is synchronous");

  for (let i = 0; i < 1000000; ++i) {
    console.log("blocking the main thread");
  }

  request("user-data", (userData) => {
    console.log("load userData");
    saveUsers(userData);
  });

  console.log("DOM change");
  console.log("User Input");
  ```

## 비동기 처리를 위한 내부 구조

- 브라우저에서 실행되는 JS 코드는 event driven 시스템으로 작동
- 웹 앱을 로드하면 브라우저는 HTML document를 읽어 문서에 있는 CSS code, JS code를 불러온다
- JS 엔진은 코드를 읽어 실행한다
- 브라우저의 main thread는 JS 코드에서 동기적으로 처리되어야 할 코드 실행 외에도, 웹 페이지를 실시간으로 렌더링하고, 사용자의 입력을 감지하고, 네트워크 통신을 처리하는 등 많은 일을 처리한다
- 비동기 작업을 할당하면, 비동기 처리가 끝나고 브라우저는 task queue에 실행 코드를 넣는다
- main thread는 event loop를 돌려 task queue에 작업이 있는지 체크한다
- 작업이 있으면 task를 실행한다
