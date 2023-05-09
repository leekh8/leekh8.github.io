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

// InsertForm1.js
import React, { useState } from "react";
const InsertForm1 = ({ onInsert }) => {
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
// export default InsertForm1;

// App1.js
import React from "react";
import InsertForm1 from "./components/InsertForm1";

function App1() {
  return (
    <div className="App1">
      <InsertForm1
        onInsert={(value) => {
          console.log(value);
        }}
      />
    </div>
  );
}

// export default App1;

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

// ListView의 ol element 내에 Array.map을 이용해 todoList의 항목들을 출력
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
// App.js
import React, { useState } from "react";
import InsertForm2 from "./components/InsertForm";
import ListView2 from "./components/ListView";

function App2() {
  const [todoList, setTodoList] = useState([]);
  const handleInsert2 = (value) => {
    setTodoList((current) => {
      const newTodoList = [...current];
      newTodoList.push({
        key: new Date().getTime(), // JSX에서 Array의 값을 표현할 때 각 요소를 구분하기 위한 값
        value: value, // onInsert로부터 전달받은 값,
        isCompleted: false // 완료 처리를 위한 flag});
      });
      return newTodoList;
    });
  };
  return (
    <div className="App2">
      <ListView2 todoList={todoList} />
      <InsertForm2 onInsert={handleInsert2} />
    </div>
  );
}
// export default App2;

// InsertForm2.js
import React, { useState, useCallback } from "react";

const InsertForm2 = ({ onInsert }) => {
  const [inputValue, setInputValue] = useState("");
  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault(); // 기본적인 HTML 동작으로 인해 페이지가 새로고침 되는 것을 방지
      if (typeof onInsert === "function" && inputValue) {
        // onInsert가 정상적인 함수인 지 확인하여 에러 방지
        onInsert(inputValue);
      }
      setInputValue("");
    },
    [onInsert, inputValue]
  );

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

// export default InsertForm2;

// ListView.js
import React from "react";

const ListView2 = ({ todoList }) => {
  return (
    <div>
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
      </ol>
    </div>
  );
};

// export default ListView2;

// -------- 유연하게 State 변경하기 --------
// 리스트의 값을 변경 및 삭제하는 기능

// 구현할 사항
// ListView 내 Item의 완료 버튼을 클릭할 때 부모 컴포넌트로 완료 명령을 내릴 수 있는 이벤트 작성
// ListView 내 Item의 삭제 버튼을 클릭할 때 부모 컴포넌트로 삭제 명령을 내릴 수 있는 이벤트 작성
// App 컴포넌트에서 ListView의 완료 및 삭제 이벤트 핸들링 함수 작성

// 지시사항
// ListView.js 파일을 열어 ListView 컴포넌트에서 onComplete, onRemove props를 받아올 수 있도록
// onComplete와 onRemove는 함수
// todoList를 출력한 li element의 완료 button에 onClick 이벤트 핸들링 함수를 추가
// 이 이벤트 핸들링 함수는 todoList 항목의 index를 매개변수로 담아 onComplete 함수를 호출
// 참고: todoList의 항목의 index는 Array.map 콜백 함수의 두 번째 매개변수
// todoList를 출력한 li element의 삭제 button에 onClick 이벤트 핸들링 함수를 추가
// 이 이벤트 핸들링 함수는 todoList 항목의 index를 매개변수로 담아 onRemove 함수를 호출
// App.js로 돌아와 ListView에 전달할 onComplete, onInsert 이벤트 핸들링 함수를 작성
// onComplete의 경우 index를 전달받아 todoList state의 index번째에 해당하는 요소의 isCompleted를 true로 설정
// onRemove의 경우 index를 전달받아 todoList state의 index번째에 해당하는 요소를 삭제
// 삭제 예시
Array.splice(index, 1);
// ListView.js
import React from "react";

const ListView3 = ({ todoList, onComplete, onRemove }) => {
  return (
    <div>
      <ol>
        {todoList.map((item, index) => {
          return (
            <li key={item.key}>
              <span>{item.value}</span>
              <button
                type="button"
                onClick={() => {
                  if (typeof onComplete === "function") {
                    onComplete(index);
                  }
                }}
              >
                완료
              </button>
              <button
                type="button"
                onClick={() => {
                  if (typeof onRemove === "function") {
                    onRemove(index);
                  }
                }}
              >
                삭제
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

// export default ListView3;

// App.js
import React, { useState } from "react";
import InsertForm3 from "./components/InsertForm";
import ListView3 from "./components/ListView";

function App3() {
  const [todoList, setTodoList] = useState([]);

  const handleInsert = (value) => {
    setTodoList((current) => {
      const newList = [...current];
      newList.push({
        key: new Date().getTime(),
        value,
        isCompleted: false
      });
      return newList;
    });
  };

  const handleComplete = (index) => {
    setTodoList((current) => {
      const newList = [...current];
      newList[index].isCompleted = true;
      return newList;
    });
  };
  const handleRemove = (index) => {
    setTodoList((current) => {
      const newList = [...current];
      newList.splice(index, 1);
      return newList;
    });
  };
  return (
    <div className="App3">
      <ListView3
        todoList={todoList}
        onComplete={handleComplete}
        onRemove={handleRemove}
      />
      <InsertForm3 onInsert={handleInsert} />
    </div>
  );
}

// export default App3;

// -------- CSS로 꾸미기 --------
// CSS를 이용해 UI와 UX를 개선

// React에서 스타일을 적용하는 방법 두 가지

// 첫 번째는 css파일을 import 하기
// 두 번째는 JSX 내에 인라인 스타일 적용하기

// ListView 컴포넌트는 별도의 CSS 파일을 이용해서,
// InsertForm 컴포넌트는 인라인 스타일을 입력해서

// 지시사항
// src 디렉토리에 있는 index.css를 열어 body의 style을 다음과 같이 설정

// background-color를 #eeeeee로 설정
// padding을 16px로 설정

// src/components 디렉토리에 있는 InsertForm.js 파일의 InsertForm 컴포넌트의 form element의 style을 다음과 같이 설정

// background-color를 #ffffff로 설정
// border-radius를 16px로 설정
// margin-bottom을 16px로 설정
// display를 flex로 설정
// justify-content를 space-between으로 설정
// align-items를 center로 설정

// InsertForm 컴포넌트의 input element의 style을 다음과 같이 설정

// flex를 1로 설정
// border를 none으로 설정
// color를 #000000로 설정
// padding을 상하 6px, 좌우 12px로 설정
// background-color를 transparent로 설정

// InsertForm 컴포넌트의 button element의 style을 다음과 같이 설정

// border를 none으로 설정
// border-radius를 16px로 설정
// background-color를 #3ab6bc로 설정
// color를 #ffffff로 설정
// cursor를 pointer로 설정
// padding을 상하 8px, 좌우 16px로 설정

// src/components 디렉토리에 있는 ListView.js 파일의 ListView 컴포넌트의 div element의 className을 "listview"로 설정

// ListView 컴포넌트의 li element의 className을 item.isCompleted가 true일 경우 "completed", false일 경우 ""로 설정

// ListView 컴포넌트의 삭제 button element의 className을 "remove"로 설정

// ListView.js 파일과 동일한 위치에 ListView.css 파일을 생성

// ListView.css 파일 내에 다음과 같이 스타일을 입력

// .listview {
//     display: block;
//     position: relative;
//     min-height: 120px;
//     margin-bottom: 8px;
//     background-color: #ffffff;
//     padding: 16px;
//     border-radius: 16px;
// }

// .listview ol {
//     margin: 0;
//     padding-left: 2em;
// }

// .listview ol li {
//     clear: both;
//     margin-bottom: 8px;
// }

// .listview ol li span{
//     float: left;
//     font-size: 16px;
// }

// .listview ol li.completed span {
//     text-decoration: line-through;
// }

// .listview ol li button {
//     float: right;
//     margin-left: 4px;
//     cursor: pointer;
//     border: none;
//     color: #ffffff;
//     background-color: #524FA1;
//     padding: 4px 8px;
// }

// .listview ol li button.remove {
//     background-color: #FA466A;
// }

// 코드를 실행하여 결과를 확인
// index.css
// body {
//   margin: 0;
//   font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
//     'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
//     sans-serif;
//   -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;
//   background-color: #eeeeee;
//   padding: 16px;
// }

// code {
//   font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
//     monospace;
// }

// InsertForm4.js
import React, { useState, useCallback } from "react";

const InsertForm4 = ({ onInsert }) => {
  const [inputValue, setInputValue] = useState("");
  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault(); // 기본적인 HTML 동작으로 인해 페이지가 새로고침 되는 것을 방지
      if (typeof onInsert === "function" && inputValue) {
        // onInsert가 정상적인 함수인 지 확인하여 에러 방지
        onInsert(inputValue);
      }
      setInputValue("");
    },
    [onInsert, inputValue]
  );

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        backgroundColor: "#ffffff",
        borderRadius: 16,
        marginBottom: 16,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      <input
        value={inputValue}
        onChange={(event) => {
          setInputValue(event.target.value);
        }}
        style={{
          flex: 1,
          border: "none",
          color: "#000000",
          padding: "6px 12px",
          backgroundColor: "transparent"
        }}
      />
      <button
        type="submit"
        style={{
          border: "none",
          borderRadius: 16,
          backgroundColor: "#3ab6bc",
          color: "#ffffff",
          cursor: "pointer",
          padding: "8px 16px"
        }}
      >
        등록
      </button>
    </form>
  );
};

// export default InsertForm4;

// ListView4.js
import React from "react";
import "./ListView.css";

const ListView4 = ({ todoList, onComplete, onRemove }) => {
  return (
    <div className="listview">
      <ol>
        {todoList.map((item, index) => {
          return (
            <li className={item.isCompleted ? "completed" : ""} key={item.key}>
              <span>{item.value}</span>
              <button
                type="button"
                onClick={() => {
                  if (typeof onComplete === "function") {
                    onComplete(index);
                  }
                }}
              >
                완료
              </button>
              <button
                className="remove"
                type="button"
                onClick={() => {
                  if (typeof onRemove === "function") {
                    onRemove(index);
                  }
                }}
              >
                삭제
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

// export default ListView4;

// ListView.css
// .listview {
//   display: block;
//   position: relative;
//   min-height: 120px;
//   margin-bottom: 8px;
//   background-color: #ffffff;
//   padding: 16px;
//   border-radius: 16px;
// }

// .listview ol {
//   margin: 0;
//   padding-left: 2em;
// }

// .listview ol li {
//   clear: both;
//   margin-bottom: 8px;
// }

// .listview ol li span {
//   float: left;
//   font-size: 16px;
// }

// .listview ol li.completed span {
//   text-decoration: line-through;
// }

// .listview ol li button {
//   float: right;
//   margin-left: 4px;
//   cursor: pointer;
//   border: none;
//   color: #ffffff;
//   background-color: #524fa1;
//   padding: 4px 8px;
// }

// .listview ol li button.remove {
//   background-color: #fa466a;
// }

// -------- 부가 기능 구현 --------
// Todo List 애플리케이션에 몇 가지 부가적인 기능을 구현해보자

// 구현할 기능

// 완료 버튼 클릭 시 이펙트(애니메이션) 추가
// todoList 개수 제한하기

// 지시사항
// 완료 이펙트
// src/components 디렉토리에 있는 ListView.css에
// .listview ol li span 에 다음 속성 추가
// .listview ol li span {
//     ...
//     position: relative;
// }

// 다음 속성 추가
// .listview ol li span::after {
//    content: "";
//    position: absolute;
//    left: 0;
//    top: 50%;
//    transition: width 0.2s ease-in-out;
//    width: 0%;
//    height: 3px;
//    background-color: #524FA1;
// }

// 다음 속성 추가
// .listview ol li.completed span::after {
//    width: 100%;
// }

// 다음 속성을 제거
// .listview ol li.completed span

// 결과 확인
// 개수 제한
// App.js의 App 컴포넌트에 useMemo hook을 이용해 isLimitReached 변수를 선언
// 현재 todoList의 항목이 10개 이상일 때 경고메시지를 띄우기 위해 사용
// 메모이제이션할 값은 todoList.length가 10 이상일 경우 true, 10 미만일 경우 false
// isLimitReached가 true일 때 경고메시지를 띄우기 위해 <ListView>와 <InsertForm> 사이에 다음과 같은 코드를 삽입
{
  isLimitReached && (
    <div
      style={{
        padding: "8px 16px",
        border: "1px solid #FA466A",
        backgroundColor: "#feecf0",
        color: "#FA466A",
        marginBottom: 16
      }}
    >
      ※ 할일 목록이 너무 많습니다.
    </div>
  );
}

// isLimitReached가 true일 때 더 이상 할 일을 등록할 수 없게 하기 위해
// src/components 디렉토리에 있는 InsertForm.js의 InsertForm 컴포넌트에 disabled props를 추가하고
// 해당 disabled 값을 컴포넌트 내부의 input에 그대로 전달
// App.js의 App 컴포넌트에서 <InsertForm>에 disabled를 isLimitReached로 설정
// 결과를 확인
// App.js
import React, { useState, useMemo } from "react";
import InsertForm5 from "./components/InsertForm";
import ListView5 from "./components/ListView";

function App5() {
  const [todoList, setTodoList] = useState([]);
  const isLimitReached = useMemo(() => {
    return todoList.length >= 10;
  }, [todoList]);

  const handleInsert = (value) => {
    setTodoList((current) => {
      const newList = [...current];
      newList.push({
        key: new Date().getTime(),
        value,
        isCompleted: false
      });
      return newList;
    });
  };

  const handleComplete = (index) => {
    setTodoList((current) => {
      const newList = [...current];
      newList[index].isCompleted = true;
      return newList;
    });
  };

  const handleRemove = (index) => {
    setTodoList((current) => {
      const newList = [...current];
      newList.splice(index, 1);
      return newList;
    });
  };

  return (
    <div className="App">
      <ListView
        todoList={todoList}
        onComplete={handleComplete}
        onRemove={handleRemove}
      />
      {isLimitReached && (
        <div
          style={{
            padding: "8px 16px",
            border: "1px solid #FA466A",
            backgroundColor: "#feecf0",
            color: "#FA466A",
            marginBottom: 16
          }}
        >
          ※ 할일 목록이 너무 많습니다.
        </div>
      )}
      <InsertForm onInsert={handleInsert} />
    </div>
  );
}

// export default App5;

// ListView.js
import React from "react";
import "./ListView.css";

const ListView5 = ({ todoList, onComplete, onRemove }) => {
  return (
    <div className="listview">
      <ol>
        {todoList.map((item, index) => {
          return (
            <li key={item.key} className={item.isCompleted ? "completed" : ""}>
              <span>{item.value}</span>
              <button
                type="button"
                onClick={() => {
                  if (typeof onComplete === "function") {
                    onComplete(index);
                  }
                }}
              >
                완료
              </button>
              <button
                className="remove"
                type="button"
                onClick={() => {
                  if (typeof onRemove === "function") {
                    onRemove(index);
                  }
                }}
              >
                삭제
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default ListView5;

// ListView.css
// .listview {
//   display: block;
//   position: relative;
//   min-height: 120px;
//   margin-bottom: 8px;
//   background-color: #ffffff;
//   padding: 16px;
//   border-radius: 16px;
// }

// .listview ol {
//   margin: 0;
//   padding-left: 2em;
// }

// .listview ol li {
//   clear: both;
//   margin-bottom: 8px;
// }

// .listview ol li span {
//   float: left;
//   font-size: 16px;
//   position: relative;
// }
// .listview ol li span::after {
//   content: '';
//   position: absolute;
//   left: 0;
//   top: 50%;
//   transition: width 0.2s ease-in-out;
//   width: 0%;
//   height: 3px;
//   background-color: #524fa1;
// }

// .listview ol li.completed span::after {
//   width: 100%;
// }

// .listview ol li button {
//   float: right;
//   margin-left: 4px;
//   cursor: pointer;
//   border: none;
//   color: #ffffff;
//   background-color: #524fa1;
//   padding: 4px 8px;
// }

// .listview ol li button.remove {
//   background-color: #fa466a;
// }
