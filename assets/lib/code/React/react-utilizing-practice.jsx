// -------- Form 개발하기 --------
// 사용자로부터 입력을 받아 데이터를 처리할 수 있는 form 개발하기 위해
// [state](https://leekh8.github.io/posts/react-2-Props%EC%99%80-State/#state), [이벤트 처리](https://leekh8.github.io/posts/react-3-%EC%9D%B4%EB%B2%A4%ED%8A%B8-%EC%B2%98%EB%A6%AC/) 필요
// React를 이용해 사용자로부터 데이터를 입력받아 처리하기 위한 관문인 Form을 개발해보자

// 이번 실습에서는 State와 이벤트를 활용해 개발을 진행

// 제작할 Form의 형태는 다음과 같다

// 컴포넌트 형태로 개발
// Form 컴포넌트 내부에서 State를 이용해 사용자의 입력을 저장/관리
// Form의 Submit 이벤트가 발생되면 부모 컴포넌트로 그 데이터를 전달
// 자 그럼 지시사항에 따라 함께 Form을 개발해보자

// 지시사항
// src/components 디렉토리를 생성하고 InsertForm.js 파일 생성
// 생성한 파일에 InsertForm 함수 컴포넌트를 작성
// 이 컴포넌트는 onInsert 라는 이벤트 핸들링 함수를 Props로 전달
// InsertForm은 아래와 같은 JSX Element를 반환
<form>
  <input />
  <button>등록</button>
</form>;

// inputValue 라는 이름의 state를 선언하고 생성한 input element에 value를 해당 state로 설정하고
// onChange 이벤트를 이용해 사용자의 입력을 받아 state를 변경할 수 있도록 함
// form element의 submit 이벤트 핸들링 함수를 작성
// submit 이벤트 핸들링 함수가 호출될 때 inputValue 값을 매개변수로 하여 props로부터 전달받은 onInsert 함수를 호출해주도록 함
// 또한 inputValue를 ""로 초기화
// 주의사항: form의 onSubmit 호출 시 event.preventDefault()를 호출해 HTML의 기본 form 동작이 일어나지 않도록 함

// App.js로 돌아와 작성한 InsertForm을 import하고 onInsert 이벤트에 console.log를 이용해 할일 등록 시 값이 잘 전달되는지 확인해보자

// InsertForm.js
import React, { useState } from "react";
const InsertForm = ({ onInsert }) => {
  const [inputValue, setInputValue] = useState("");
  const handleSubmit = (event) => {
    event.preventDefault();
    if (typeof onInsert === "function") {
      onInsert(inputValue);
    }
    setInputValue("");
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={inputValue}
        onChange={(event) => {
          setInputValue(event.target.value);
        }}
      />
      <button type="submit">등록</button>
    </form>
  );
};
export default InsertForm;

// App.js
import React from "react";
import InsertForm from "./components/InsertForm";

function App() {
  return (
    <div className="App">
      <InsertForm
        onInsert={(value) => {
          console.log(value);
        }}
      />
    </div>
  );
}

// export default App;

// -------- 리스트 표현하기 --------
// form으로부터 전달받은 값들을 리스트에 저장하고
// 리스트의 값을 [array method](https://github.com/leekh8/leekh8.github.io/blob/main/assets/lib/code/JS/js-grammar-new.js)를 이용해 순차적으로 화면에 출력

// 지난 실습에서 사용자로부터 할일을 입력받아 등록할 수 있는 Form을 개발해보자

// 이번 실습에서는 Form으로부터 전달받은 값을 실제 할일 목록에 추가하고 할일 목록을 화면에 출력하는 로직과 컴포넌트를 작성해보자

// 이 과정에서 State와 Array 메소드 등을 활용

// 이번 실습에서 작성하는 코드는 다음과 같다

// Form으로부터 전달받은 값을 todoList array에 push하는 로직
// todoList를 props로 전달받아 화면에 출력하는 ListView 컴포넌트
// 그럼 지시사항에 맞춰 코드를 작성해보자

// 지시사항
// InsertForm으로부터 전달받은 할일을 등록하고 관리할 todoList state를 선언
// 해당 state의 type은 Array이며 초기값은 [](빈 배열)
// InsertForm의 onInsert 이벤트 호출 시 todoList에 새로운 항목을 등록
// 등록할 항목은 다음과 같다
// {
//     key: new Date().getTime(), // JSX에서 Array의 값을 표현할 때 각 요소를 구분하기 위한 값
//     value: value, // onInsert로부터 전달받은 값,
//     isCompleted: false // 완료 처리를 위한 flag
// }

// 주의사항: Array를 값으로 갖는 state를 변경할 때 유의할 점에 대해 다시 한 번 생각해보자

// todoList를 전달받아 리스트를 출력해줄 컴포넌트를 작성
// src/components 디렉토리에 ListView.js 파일을 생성하고 해당 파일에 ListView 컴포넌트를 선언

// props로부터 todoList를 전달 해보자

// ListView는 다음과 같은 JSX Element를 반환

// <div>
//     <ol>
//     </ol>
// </div>

// ListView의 ol element 내에 Array.map을 이용해 todoList의 항목들을 출력합니다.
<ol>
  {todoList.map((item) => {
    return (
      <li key={item.key}>
        <span>{item.value}</span>
        <button type="button">완료</button>
        <button type="button">삭제</button>
      </li>
    );
  })}
</ol>;

// App.js로 돌아와 ListView를 import하고 InsertForm의 위쪽에 생성해보자

// 코드를 실행하여 할일 등록과 출력이 잘 진행되는 지 확인해보자
