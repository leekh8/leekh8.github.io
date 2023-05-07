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
