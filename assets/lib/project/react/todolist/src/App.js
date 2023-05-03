// JS, jQuery로 만든 todo list react로 변환하기

/* 구현할 기능?
1. 할 일 리스트 보여주기
2. 리스트에 할 일 추가하기
3. 할 일 완료 처리하기
4. 할 일 삭제하기
*/
/* 변환 시 살펴볼 것?
1. 할 일 리스트의 표현 방법이 어떻게 달라지는 지
2. 할 일 추가가 어떻게 이루어지는 지
*/
/*
Tips!
자바스크립트 코드를 jQuery를 이용해 구현하고 있지만,
jQuery에 대해 상세히 알 필요는 없다
중요한 것은 자바스크립트를 React로 바꿔보면서
둘의 차이와 React에 특징에 대해 이해하는 것!*/

import { useState } from 'react';
import './App.css';

function App() {
  // todo list 배열을 관리할 state
  const [todoList, setTodoList] = useState([]);
  // input value 관리할 state
  // input이 바뀔때마다 state 변경
  const [inputValue, setInputValue] = useState('');

  // 새로운 todo list 추가하는 로직
  const handleSubmit = (event) => {
    // 폼을 submit할때는 preventDefalut 필수
    event.preventDefault();
    setTodoList((current) => {
      return [
        ...current, // 현재 값 유지
        {
          // 현재 시간
          id: new Date().getTime(),
          // 완료되었는지 식별, default: false
          isCompleted: false,
          value: inputValue
        }
      ];
    });

    // submit 하고 나면 입력 폼 초기화
    setInputValue('');
  };

  // 완료 함수 생성
  // 완료 처리를 할 순서를 index로 받아옴
  const handelCompleteClick = (index) => {
    // 현재를 복사
    setTodoList((current) => {
      const newList = [...current];
      // default: false였던 완료되었는지 식별하는 isCompleted를 true로 설정
      newList[index].isCompleted = true;
      return newList;
    });
  };

  // 삭제 함수 생성
  // 삭제 처리를 할 순서를 index로 받아옴
  const handelDeleteClick = (index) => {
    // 현재를 복사
    setTodoList((current) => {
      const newList = [...current];
      newList.splice(index, 1);
      return newList;
    });
  };

  return (
    <div>
      <ol id="todo-list">
        {/*
        map: 요소를 하나씩 꺼내서 그 다음걸 해줘
        */}
        {/*
        할 일이 완료되면 클래스 넣어줌
        item의 isCompleted이 ture면 completed 넣고, 아니면 넣지마
        react의 큰 차이: class= 이 아니고 className= 이라는 점!
        */}
        {todoList.map((item, index) => (
          <li className={item.isCompleted === true ? 'completed' : ''}>
            {/*
          span으로 감싸서 버튼이랑 거리 주기
          */}
            <span>{item.value}</span>
            <button onClick={() => handelCompleteClick(index)}>complete</button>
            <button onClick={() => handelDeleteClick(index)}>delete</button>
          </li>
        ))}
      </ol>
      {/*
      handleSubmit 호출 시 input을 새로운 todolist인 setTodoList에 넣어줌
      */}
      <form id="create" onSubmit={handleSubmit}>
        {/*
        value 값이 바뀔때마다 onChange를 통해 함수 호출
        setInputValue: state의 값을 변경
        */}
        <input
          type="text"
          value={inputValue}
          onChange={(event) => {
            setInputValue(event.target.value);
          }}
        />
        <button type="submit">submmit</button>
      </form>
    </div>
  );
}

export default App;
