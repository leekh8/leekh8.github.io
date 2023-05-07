// -------- Object를 전달받는 Component --------
// object로 선언된 학생 정보를 전달 받아 출력하는 컴포넌트를 개발
// 지시사항
// src/components 디렉토리를 생성
// 생성한 디렉토리 내에 Student.js 이라는 파일을 생성
// Student 라는 함수 컴포넌트를 선언
// 생성한 컴포넌트의 Props에서 student라는 변수를 전달받음
// student object는 다음과 같은 값들을 전달받음
// {
//     name: "성명",
//     subject: "수업명",
//     score: 점수
// }

// 전달받은 student를 <div> element로 다음과 같은 내용을 출력
// 점수가 80점 이상일 경우 PASS, 80점 미만일 경우 FAIL로 표시
// XXX 학생은 YYY 수업을 수강중입니다.
// 현재 점수는 ZZ점으로 PASS/FAIL입니다.

// Student 컴포넌트를 export
// export default Student;

// App.js로 돌아와 Student 컴포넌트를 import
// 다음과 같은 정보를 담고있는 object 두개를 각각 선언
// {
//     name: "김민수",
//     subject: "수학",
//     score: 88
// }

// {
//     name: "홍길동",
//     subject: "영어",
//     score: 72
// }

// className이 "App"인 div 안에 선언한 두 개의 object를 각각 컴포넌트에 전달하여 출력하는 코드를 작성
// -------- app.js
import React from "react";
import "./App.css";
import Student from "./components/Student";

function App() {
  const person1 = {
    name: "김민수",
    subject: "수학",
    score: 88
  };
  const person2 = {
    name: "홍길동",
    subject: "영어",
    score: 72
  };
  return (
    <div className="App">
      <Student student={person1} />
      <Student student={person2} />
    </div>
  );
}

export default App;

// -------- app.js
// -------- ver.1
import React from "react";
const Student1 = ({ student }) => {
  return (
    <div>
      {student.name} 학생은 {student.subject} 수업을 수강중입니다. 현재 점수는{" "}
      {student.score}점으로 {student.score >= 80 ? "PASS" : "FAIL"}입니다.
    </div>
  );
};
// export default Student1;

import React from "react";
// -------- ver.2
const Student2 = ({ student }) => {
  const strPass = student.score >= 80 ? "PASS" : "FAIL";
  return (
    <div>
      {student.name} 학생은 {student.subject} 수업을 수강중입니다. 현재 점수는{" "}
      {student.score}점으로 {strPass}입니다.
    </div>
  );
};
// export default Student2;

// -------- 이벤트와 State 연동하기
// React로 애플리케이션을 개발하다보면 실시간으로 사용자로부터 값을 전달받아
// 컴포넌트에 반영할 일이 많기 때문에 이벤트와 State는 뗄래야 뗄 수 없는 관계라고 할 수 있음

// 아래 예시는 input element로부터 값을 입력받아 state에 반영하는 코드
const App = () => {
  const [inputValue, setInputValue] = useState("defaultValue");

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <div>
      <input onChange={hadleChange} defaultValue={inputValue} />
      <br />
      입력한 값은: {inputValue}
    </div>
  );
};

// 이제 직접 사용자로부터 값을 입력받는 이벤트 핸들링 함수를 작성해보자

// 지시사항
// App 컴포넌트 내에 inputValue 라는 state를 선언
// className이 "App"인 div element 내에 <input> element를 생성
// 생성한 input element의 onChange 이벤트에서 사용자로부터 입력받은 값을 state에 반영
// 힌트: event.target.value
// input element 아래에 <span> element를 생성
// span element의 내용은 inputValue state를 출력하도록

import React, { useState } from "react";

function App2() {
  const [inputValue, setInputValue] = useState("");
  return (
    <div className="App">
      <input
        onChange={(event) => {
          setInputValue(event.target.value);
        }}
      />
      <span>{inputValue}</span>
    </div>
  );
}

// export default App2;

// -------- Effect Hook 1
// Effect Hook을 사용하면 함수 컴포넌트에서 side effect를 수행할 수 있음
// 컴포넌트가 최초로 렌더링될 때, 지정한 State나 Props가 변경될 때마다 이펙트 콜백 함수가 호출

// Effect Hook 사용 형태
const App = () => {
  useEffect(EffectCallback, Deps);
};

// 예시
// count 가 증가할 때마다 콘솔에 출력해주는 예시
const App = () => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    console.log(count);
  }, [count]);
  return (
    <button
      onClick={() => {
        setCount((current) => {
          return current + 1;
        });
      }}
    >
      카운트 증가
    </button>
  );
};

// 그럼 직접 state 값이 바뀔 때마다 console에 변경된 값이 출력되는 코드를 작성해보자

// 지시사항
// App 컴포넌트에 inputValue 라는 값을 갖는 state를 선언
// className이 "App"인 div element 내부에 <input> element를 생성하고
// value를 생성한 inputValue state로 설정하고 사용자가 값을 입력할 때마다 state가 변경되도록 설정
// 선언한 state와 return 사이에 useEffect를 이용해 inputValue state가 변경될 때마다
// console.log를 이용해 값을 출력
// useEffect 작성 예:
// useEffect(EffectCallback, Deps);
import React, { useState, useEffect } from "react";

function App() {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    console.log(`${inputValue}`);
  }, [inputValue]);
  return (
    <div className="App">
      <input
        value={inputValue}
        onChange={(event) => {
          setInputValue(event.target.value);
        }}
      />
    </div>
  );
}

// export default App;

// -------- Effect Hook 2
// 지난 실습에서 Effect Hook을 이용하면 컴포넌트 내의 State나 Props의 변화를 감지해
// 원하는 로직을 실행할 수 있다는 점을 배워음
// 이어서 Effect Hook을 응용해 개발하는 방법 확인

// Effect Hook을 이용하면 컴포넌트가 생성됐을 때,
// 컴포넌트가 소멸될 때를 감지해서 특정 로직 실행 가능

// Effect Hook으로 컴포넌트의 생성/소멸 시의 로직을 작성하는 방법.

// 예시
const App = () => {
  useEffect(() => {
    console.log("컴포넌트 생성");

    return () => {
      console.log("컴포넌트 소멸");
    };
  }, []);
  return <div></div>;
};

// 위의 코드를 보면 useEffect의 두 번째 매개변수인 Deps에 빈 배열 넣음
// 이 때는 오직 컴포넌트의 생성과 소멸 시에만 Effect Callback 함수가 호출되게 함

// 또한 Effect Callback 함수 내에서 return 해주는 또다른 함수가 Effect의 종료 시에 호출되기 때문에
// 이는 곧 컴포넌트의 소멸 단계에 호출이 되는 함수라고 할 수 있음

// 지시사항
// src/components 디렉토리를 생성하고 Greeting.js 파일을 생성
// 생성한 Greeting.js 파일 내에 새로운 함수 컴포넌트 Greeting을 선언
// 이 컴포넌트는 <h1>안녕하세요.</h1>를 반환
// Effect Hook을 이용한 코드를 작성
// deps는 빈 배열,
// Effect Callback 함수에서는 console.log를 이용해 "컴포넌트가 생성되었습니다." 를 출력하고
// "컴포넌트가 소멸되었습니다." 를 출력하는 새로운 함수를 반환하도록 함
useEffect(() => {
  console.log("컴포넌트가 생성되었습니다.");
  return () => {
    console.log("컴포넌트가 소멸되었습니다.");
  };
}, []);

// Greeting 컴포넌트를 export 후 App.js로 돌아와 해당 컴포넌트를 import
// App 컴포넌트 내에 isCreated state를 선언
// 타입은 boolean이며 초기값은 false
// className이 "App"인 div element 내에 <button> element를 하나 삽입
// button의 내용은 컴포넌트 생성/제거 라고 입력하고
// onClick 이벤트 발생 시 isCreated state를 반전시키는 코드를 작성
// (현재 값이 false일 경우 true로, true일 경우 false로 전환)
// 생성한 버튼 아래쪽에 아래와 같은 코드를 작성
// 주어진 코드는 isCreated가 true일 경우 Greeting 컴포넌트를 출력한다는 의미의 코드
// 중괄호를 포함해서 입력
// {isCreated && <Greeting />}

// 코드를 실행하여 버튼을 클릭해보고 개발자 도구의 콘솔을 관찰

// -------- Greeting.js
import React, { useState, useEffect } from "react";
const Greeting = () => {
  useEffect(() => {
    console.log(`컴포넌트가 생성되었습니다.`);
    return () => {
      console.log(`컴포넌트가 소멸되었습니다.`);
    };
  }, []);
  return <h1>안녕하세요.</h1>;
};

// export default Greeting;

// -------- App.js
import React, { useState, useEffect } from "react";
import Greeting from "./components/Greeting";

function App() {
  const [isCreated, setIsCreated] = useState(false);
  return (
    <div className="App">
      <button
        onClick={(current) => {
          setIsCreated((current) => {
            return !current;
          });
        }}
      >
        컴포넌트 생성/제거
      </button>
      {isCreated && <Greeting />}
    </div>
  );
}

// export default App;

// -------- useMemo
// useMemo를 이용해 지정한 State나 Props가 변경될 경우 해당 값을 활용해
// 계산된 값을 메모이제이션하여 재렌더링 시 불필요한 연산을 줄여보자

// 예시
const App = () => {
  const [firstName, setFirstName] = useState("철수");
  const [lastName, setLastName] = useState("김");

  // 이름과 성이 바뀔 때마다 풀네임을 메모이제이션
  const fullName = useMemo(() => {
    return `${firstName} ${lastName}`;
  }, [firstName, lastName]);
};

// useMemo를 사용해 메모이제이션을 했을 경우와 하지 않았을 때의 차이도 알아보자

// 다음 예시는 임의로 복잡한 연산을 수행하는 상황을 가정하기 위해 작성된 코드

// useMemo를 사용하지 않았을 때
const App = () => {
  const [value, setValue] = useState(1);

  const something = (() => {
    let sum = 0;
    for (let i = 0; i < 999999999; i++) {
      sum += i;
    }
  })();

  return (
    <div>
      <button
        onClick={() => {
          setValue((current) => {
            return current + 1;
          });
        }}
      >
        {value}
      </button>
      <div>{something}</div>
    </div>
  );
};

// 위 코드를 복사 붙여넣기한 후 실행해보면
// value state의 변경이 일어나며 컴포넌트가 다시 렌더링되는 과정에서
// 부하가 발생하는 것을 확인할 수 있음

// 동일한 코드를 useMemo를 이용해 작성해보자

// useMemo를 사용했을 때
const App = () => {
  const [value, setValue] = useState(1);

  const something = useMemo(() => {
    let sum = 0;
    for (let i = 0; i < 999999999; i++) {
      sum += i;
    }
    return sum;
  }, []);

  return (
    <div>
      <button
        onClick={() => {
          setValue((current) => {
            return current + 1;
          });
        }}
      >
        {value}
      </button>
      <div>{something}</div>
    </div>
  );
};

// 위 코드도 한번 실행해보면
// 컴포넌트의 재 렌더링이 일어날 때마다 차이가 명확하게 느껴질 것

// 추가로, useMemo의 연산은 렌더링 단계에서 이루어지기 때문에
// 렌더링 과정과 무관하게 시간이 오래 걸리는 로직을 작성하지 않는 것이 권장

// 그럼 코드 작성을 통해 useMemo를 사용하는 방법을 알아보자
// 이번 실습에서는 두 개의 숫자 state가 변경될 때마다
// 자동으로 숫자들의 곱을 메모이제이션하는 코드를 작성해보자

// 지시사항
// App.js의 App 컴포넌트에 foo와 bar state를 선언
// 초기값은 두 state 모두 0

// className이 "App"인 div 내부에 <input> element를 두 개 생성하고
// 각각 foo state와 bar state를 변경할 수 있도록 value와 onChange를 설정

// 주의사항: onChange 이벤트에서 setState를 할 때 parseInt를 이용해 string을 number로 변환하도록 함.

// 예시
// setFoo(parseInt(event.target.value));

// 두 개의 state를 선언한 코드와 return 사이에 useMemo를 이용하여 multi 변수를 생성
// multi는 foo와 bar의 곱을 메모이제이션 한 값

// 생성한 두 개의 input element 아래에 <div> element를 생성하고 내부에 multi 값을 출력

// input element의 숫자를 자유롭게 변경해보며 확인해보자
import React, { useState, useMemo } from "react";

function App() {
  const [foo, setFoo] = useState(0);
  const [bar, setBar] = useState(0);
  const multi = useMemo(() => {
    return foo * bar;
  }, [foo, bar]);

  return (
    <div className="App">
      <input
        value={foo}
        onChange={(event) => {
          setFoo(parseInt(event.target.value));
        }}
      />
      <input
        value={bar}
        onChange={(event) => {
          setBar(parseInt(event.target.value));
        }}
      />
      <div>{multi}</div>
    </div>
  );
}

// export default App;

// -------- useCallback
// useCallback은 함수를 메모이제이션하기 위해 사용하는 Hook
// 컴포넌트가 재 렌더링될 때 불필요하게 함수가 다시 생성되는 것을 방지

// 참고: js useMemo(() => fn, deps) 와 useCallback(fn, deps) 는 같습니다.

// 예시
const App = () => {
  const [firstName, setFirstName] = useState("철수");
  const [lastName, setLastName] = useState("김");

  // 이름과 성이 바뀔 때마다
  // 풀네임을 return하는 함수를 메모이제이션
  const getFullName = useCallback(() => {
    return `${firstName} ${lastName}`;
  }, [firstName, lastName]);

  return <>{getFullName()}</>;
};

// 이제 직접 useCallback을 사용하여 코드를 작성해보자

// 지시사항
// App.js 파일 내의 App 컴포넌트에 foo, bar state를 선언
// 두 state 모두 number이며 초기값은 0

// useCallback을 이용해 foo, bar state가 변경될 때마다
// foo + bar를 연산하여 return 해주는 함수를 메모이제이션
// 메모이제이션된 함수의 이름은 calc

// className이 "App"인 div element 내부에 <input> element 두 개를 삽입하고
// foo와 bar state를 각각 변경할 수 있도록 value와 onChange 이벤트를 작성

// 주의사항: onChange 이벤트에서 setState를 할 때
// parseInt를 이용해 string을 number로 변환해보자
// 예시

setFoo(parseInt(event.target.value));

// 생성한 두 개의 input element 아래에
// <div> element를 생성하고 내부에 calc() 값을 출력

// 코드를 실행하여 확인해봅니다. input element의 숫자를 자유롭게 변경해보자

import React, { useState, useCallback } from "react";

function App() {
  const [foo, setFoo] = useState(0);
  const [bar, setBar] = useState(0);

  const calc = useCallback(() => {
    return foo + bar;
  }, [foo, bar]);
  return (
    <div className="App">
      <input
        value={foo}
        onChange={(event) => {
          setFoo(parseInt(event.target.value));
        }}
      />
      <input
        value={bar}
        onChange={(event) => {
          setBar(parseInt(event.target.value));
        }}
      />
      <div>{calc()}</div>
    </div>
  );
}

// export default App;

// -------- useRef
// useRef는 컴포넌트 생애 주기 내에서 유지할 ref 객체를 반환

// ref 객체는 .current라는 프로퍼티를 가지며 이 값을 자유롭게 변경할 수 있음

// 일반적으로 React에서 DOM Element에 접근할 때 사용(DOM Element의 ref 속성을 이용)

// useRef에 의해 반환된 ref 객체가 변경되어도 컴포넌트가 재 렌더링되지 않음

// 예시
const App = () => {
  const inputRef = useRef(null);
  const onButtonClick = () => {
    inputRef.current.focus();
  };
  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={onButtonClick}>input으로 포커스</button>
    </div>
  );
};

// 이제 직접 useRef를 활용해보자
// 이번에는 input element에 접근하여 입력된 value 값을 alert를 이용해 출력해보는 코드를 작성

// 지시사항
// App.js 파일 내의 App 컴포넌트 내에 useRef를 이용해 ref object를 선언
// 반환된 ref object를 담을 변수명은 inputRef
// className이 "App"인 div 내에 <input> element를 생성하고 ref attribute를 inputRef로 설정
// 생성한 input element 하단에 <button> element를 생성하고 onClick 이벤트 발생 시
// 생성한 input element의 value를 alert를 이용해 출력
// inputRef로부터 value를 가져오는 코드는 다음과 같다
// inputRef.current.value

// 작성한 코드를 실행하고 input에 값을 입력한 뒤 button을 클릭하여 결과를 확인해보자

import React, { useState, useRef } from "react";

function App() {
  const inputRef = useRef();
  return (
    <div className="App">
      <input ref={inputRef} />
      <button
        onClick={() => {
          alert(`${inputRef.current.value}`);
        }}
      >
        button
      </button>
    </div>
  );
}

// export default App;
