// JS, jQuery로 todo list 만들기

/* 구현할 기능?
1. 할 일 리스트 보여주기
2. 리스트에 할 일 추가하기
3. 할 일 완료 처리하기
4. 할 일 삭제하기
*/
/*
Tips!
자바스크립트 코드를 jQuery를 이용해 구현하고 있지만,
jQuery에 대해 상세히 알 필요는 없다
중요한 것은 자바스크립트를 React로 바꿔보면서
둘의 차이와 React에 특징에 대해 이해하는 것!*/

$(function () {
  // 새로운 todo list 추가하는 로직
  // 폼 이름에 콜백함수 넣어주고, 폼을 submit할때는 preventDefalut 필수
  $('#create').on('submit', function (event) {
    event.preventDefault();
    // this: create 폼, 입력한 값 가져옴
    var value = $(this).find('input').val();

    // 입력한 값 추가
    $('#todo-list').append(
      '<li>' +
        '<span>' +
        value + // 위에서 폼으로 받은 입력값
        '</span>' +
        // complete 버튼이 동작하는걸 알기 위해 complete class 추가
        '<button type="button" class="complete">complete</button> ' + // 버튼끼리 너무 붙어있으니 공백 추가
        '<button type="button" class="delete">delete</button>' +
        '</li>'
    );
    // 입력하고 나면 입력폼 초기화
    $(this).trigger('reset');
  });
  // complete 이벤트 등록
  $('body').on('click', '.complete', function () {
    // this: complete 버튼, 그 부모인 li에 completed 연결
    $(this).parent('li').addClass('completed');
  });
  // delete 이벤트 등록
  $('body').on('click', '.delete', function () {
    // this: delete 버튼, 그 부모인 li remove
    $(this).parent('li').remove();
  });
});
