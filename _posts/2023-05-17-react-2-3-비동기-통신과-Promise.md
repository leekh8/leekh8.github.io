---
categories: [React]
tags: [React, 비동기 통신, Promise, async, await, POSTMAN, OpenAPI, CORS]
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
- 웹 애플리케이션을 로드하면 브라우저는 HTML document를 읽어 문서에 있는 CSS code, JS code를 불러온다
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
    style B fill:#00ff0000, stroke:#00ff0000
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

## async / await

- Promise 체인을 구축하지 않고도, Promise를 직관적으로 사용할 수 있는 문법
- 많은 프로그래밍 언어에 있는 `try-catch`문으로 에러를 직관적으로 처리한다
- `async function`을 만들고, Promise를 기다려야 하는 표현 앞에 `await`를 붙인다

```jsx
// async / await
async function fetchUsers() {
  try {
    const users = await request("/users");
    console.log("users fetched");
    return users;
  } catch (e) {
    console.log("error: ", e);
  }
}
//Promise
function fetchUsers() {
  return request("/users")
    .then((users) => console.log("users fetched"))
    .catch((e) => console.error("error: ", e));
}
```

### 여러 개의 await

- 여러 개의 `await`을 순서대로 나열하여 `then chain`을 구현할 수 있다
- `try-catch` 문을 자유롭게 활용하여 에러 처리를 적용한다

  ```jsx
  async function fetchUsersWithAddress(id) {
    try {
      const user = await request(`/user/${user.id}`);
      const address = await request(`/user/${user.id}/address`);
      return { ...user, address };
    } catch (e) {
      console.log("error: ", e);
    }
  }
  ```

  ```jsx
  // try-catch로 묶어 각각 error 처리
  async function fetchUserWithAddress(id) {
    let user = null;
    try {
      const user = await request(`/user/${user.id}`);
    } catch (e) {
      console.log("user fetch error: ", e);
      return;
    }
    try {
      const address = await request(`/user/${user.id}/address`);
      return { ...user, address };
    } catch (e) {
      console.log("address fetch error: ", e);
    }
  }
  ```

  ```jsx
  // try 구문 안에서 중간에 error 처리 가능
  async function fetchUserWithAddress(id) {
    try {
      const user = await request(`/user/${user.id}`);
      if (!user) throw new Error("no user found");

      const address = await request(`/user/${user.id}/address`);
      if (!address.userId !== user.id)
        throw new Error("no address match with user");

      return { ...user, address };
    } catch (e) {
      console.log("user fetch error: ", e);
    }
  }
  ```

  ```jsx
  // catch 문에서 error log를 try-catch로 묶어 처리하는 nested 구조
  async function fetchUserWithAddress(id) {
    try {
      const user = await request(`/user/${user.id}`);
      const address = await request(`/user/${user.id}/address`);
      return { ...user, address };
    } catch (e) {
      try {
        sendErrorLog(e);
      } catch (e) {
        console.log("fail to log the error");
      }
    }
  }
  ```

  ### Promise 와의 조합

  - `Promise.all`은 특정 비동기 작업이 상대적으로 빠르게 끝나더라도 느린 처리를 끝까지 기다려야 한다
  - `async/await`를 활용하면 parallelism 구현 (끝난대로 먼저 처리) 가능하다

  ```jsx
  async function fetchUserWithAddress(id) {
    return await Promise.all([
      (async () => await request(`/user/${id}`))(),
      (async () => await request(`/user/${id}/address`))()
    ]);
  }

  fetchUserWithAddress("1234")
    .then(([user, address]) => ({ ...user, address }))
    .catch((e) => console.log("error: ", e));
  ```

## POSTMAN, OpenAPI, CORS

### POSTMAN

- 서버와의 통신을 위해 API를 활용하는 경우 React 애플리케이션으로만 요청하여 API 동작을 확인하는 것을 비효율적이므로 POSTMAN과 같은 API 테스트 개발 도구 활용
- 많은 API의 endpoint와 실행조건을 관리
- Auth, header, payload, query 등 API 요청에 필요한 데이터를 쉽게 설정할 수 있다
- 다른 개발자가 쉽게 set up해 테스트할 수 있도록 API 정보 공유 가능하다
- Request를 모아 collection으로 만들어 API를 종류별로 관리한다
- 환경 변수를 정의해 환경별로 테스트 가능
- [POSTMAN 홈페이지](https://www.postman.com/)

### Open API

- RESTful API를 하나의 문서로 정의하기 위한 문서 표준
- OpenAPI Specification(OAS)로 정의된다
- Swagger 와 같은 도구를 이용해 Open API로 작성된 문서를 파싱해 테스팅 도구로 만들 수 있다
- 프론트엔드와 백엔드의 협업 시 주요한 도구로 사용
- API의 method, endpoint를 정의한다
- endpoint마다 인증 방식, content type 등을 정의한다
- body data, query string, path variable 등을 정의한다
- 요청, 응답 데이터 형식과 타입을 data model(schema)를 활용해 정의한다

### CORS

- Cross-Origin Resource Sharing
- 브라우저는 모든 요청 시 Origin header 포함한다
- 서버는 Origin header를 보고, 해당 요청이 원하는 도메인에서 출발한 것인지 판단한다
- 다른 Origin에서 온 요청은 서버에서 기본적으로 거부한다
- 일반적으로 서버의 endpoint와 홈페이지의 endpoint가 다른 경우가 많아 서버에서 홈페이지 도메인을 허용해 다른 도메인이라고 하더라도 요청을 보낼 수 있도록 하는 것
- 서버는 `Access-Control-Allow-Origin` 외에 `Access-Control-\*` 를 포함하는 헤더에 CORS 관련 정보를 클라이언트로 보낸다
- 웹 사이트에 악성 script가 로드되어 수상한 요청을 하는 것을 막기 위한 것
- 또는 익명 사용자로부터의 DDos 공격을 막기 위한 것
- 서버에 직접 CORS 설정을 할 수 없다면 Proxy 서버를 만들어 해결한다
