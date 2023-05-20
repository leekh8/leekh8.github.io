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
- 비동기 작업을 할당하면, 비동기 처리가 끝나고 브라우저는 `task queue`에 실행 코드를 넣는다
- main thread는 `event loop`를 돌려 `task queue`에 작업이 있는지 체크한다
- 작업이 있으면 `task`를 실행한다

  ```jsx
  request("user-data", (userData) => {
    console.log("load userData");
    saveUsers(userData);
  });

  console.log("change DOM");
  console.log("User Input");
  ```

  ```mermaid
  flowchart RL
    subgraph TQ[Task Queue]
    style TQ fill:#00ff0000, stroke:#02
    B(" ")
    style B fill:#00ff0010, stroke:#333
    end
    B -.-> C{Event Loop}
    style C fill:#00ff0000, stroke:#333
    subgraph CS[Call Stack]
    style CS fill:#00ff0000, stroke:#261
    F("request()")
    E(console.log)
    D(console.log)
    style D fill:#00ff000, stroke:#333
    style E fill:#00ff000, stroke:#333
    style F fill:#00ff000, stroke:#333
    end
    C -.-> D
  ```

## Callback pattern VS Promise

- 비동기 처리 후 실행될 코드를 `Callback function`으로 보내는 것
- 비동기 처리가 고도화되면서, `Callback hell` 등이 단점으로 부각되었다
- `Promise`를 활용해 비동기 처리의 순서 조작, 에러 핸들링, 여러 비동기 요청 처리 등을 쉽게 처리할 수 있게 되었다

  ### Single request

  ```jsx
  // <!-- Callback pattern -->
  function fetchUsers(onSuccess) {
    request("/users", onSuccess);
  }
  // <!-- Promise -->
  function fetchUsers(onSuccess) {
    return request("/users").then(onSuccess);
  }
  ```

  ### Error handling

  ```jsx
  // <!-- Callback pattern -->
  function fetchUsers(onSuccess, onError) {
    return request("/users").then(onSuccess).catch(onError);
    // or
    return request("/users").then(onSuccess, onError);
  }
  // <!-- Promise -->
  function fetchUsers() {
    return request("/users");
  }
  ```

  ### Mulriple request

  ```jsx
  // <!-- Callback pattern -->
  function fetchUserAddress(onSuccess) {
    request("/users", (userData) => {
      const userDataWithAddress = [];
      const userLength = userData.length;

      userData.map((user) =>
        request(`/users/${user.userId}/address`, (address) => {
          userDataWithAddress.push({ ...user, address });
          if (userDataWithAddress.length === userLength) {
            onSuccess(userDataWithAddress);
          }
        })
      );
    });
  }
  // <!-- Promise -->
  function fetchUserAddress() {
    return request("/users").then((userData) =>
      Promise.all(
        userData.map((user) =>
          request(`/users/{user.userId}/address`).then((address) => ({
            ...user,
            address
          }))
        )
      )
    );
  }
  ```

## Promise

- Promise 객체는 객체가 생성 당시에는 알려지지 않은 데이터에 대한 Proxy
- 비동기 실행이 완료된 후 `.then`, `.catch`, `.finally` 등의 핸들러를 붙여 각각 데이터 처리 로직, 에러 처리 로직, 클린업 로직을 실행
- `then` 체인을 통해 비동기 실행을 동기 실행처럼 동작하도록 한다
- 참고 사이트: [Promise 참고사이트](https://promisesaplus.com/)

```jsx
function returnPromise() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const randomNumber = generateRandomNumber(100);
      if (randomNumber < 50) resolve(randomNumber);
      else reject(new Error("too small random number"));
    }, 1000);
  });
}
```

- Promise 객체는 `pending`, `fulfilled`, `rejected` 3가지의 상태를 갖는다
- `fulfilled`, `rejected` 상태는 `settled`라고 지칭한다
- `pending`
  - 비동기 실행이 끝나기를 기다리는 상태
- `fulfilled`
  - 비동기 실행이 성공한 상태
- `rejected`
  - 비동기 실행이 실패한 상태
- `then`, `catch`는 비동기(Promise), 동기 실행 중 어떤 것이라도 return 가능

  ### Multiple Promise Handling

  - Promise.all()
    - 모든 promise가 fulfilled 되기를 기다린다
    - 하나라도 에러 발생 시, 모든 promise 요청이 중단된다
      ```jsx
      Promise.all(users.map((user) => request("/user/detail", user.name)))
        // [Promise, Promise, Promise, ... ,Promise]
        .then(console.log) // [UserNameData, UserNameData, ... ,UserNameData]
        .catch((e) => console.log("fail even one last thing"));
      ```
  - Promise.allSettled()

    - 모든 promise가 settled 되기를 기다린다

      ```jsx
      function saveLogRetry(logs, retryNum) {
        if (retryNum >= 3) return; // no more try

        Promise.allSettled(logs.map(saveLog))
          .then((results) => {
            return results.filter((result) => result.status === "rejected");
          })
          .then((failedPromises) => {
            saveLogRetry(
              failedPromises.map((promise) => promise.reason.failedLog),
              retryNum + 1
            );
          });
      }
      ```

  - Promise.race()

    - 넘겨진 promise들 중 하나라도 settled 되기를 기다린다

      ```jsx
      function requestWithTimeout(request, timeout = 1000) {
        return Promise.race([request, wait(timeout)]).then((data) => {
          console.log("request success");
          return data;
        });
      }
      requestWithTimeout(req)
        .then((data) => console.log("data: ", data))
        .catch(() => console.log("timeout error"));
      ```

  - Promise.any()
    - 넘겨진 promise 중 하나라도 fulfilled 되기를 기다린다
      ```jsx
      function getAnyData(dataList) {
        Promise.any(dataList.map((dat) => request(data.url)))
          .then((data) => {
            console.log("first data: ", data);
          })
          .catch((e) => {
            console.log("nothing");
          });
      }
      ```

  ### Promise, chaining, nested promise

  - Promise 객체는 settled 되더라도 계속 핸들러를 붙일 수 있다
  - 핸들러를 붙인 순서대로 호출된다
  - `.catch` 뒤에 계속 핸들러가 붙어있다면, 에러를 처리한 후에 계속 진행된다
    - 이때는 catch에서 return한 값이 then으로 전달된다

  ```jsx
  Promise.resolve()
    .then(() => wait2(500).then(() => console.log("500 waited")))
    .then(() => {
      console.log("after 500 waited");
      return wait2(1000).then(() => console.log("1000 waited"));
    })
    .then(() => console.log("DONE"));
  /*
  500 waited
  after 500 waited
  1000 waited
  DONE
  */
  ```
