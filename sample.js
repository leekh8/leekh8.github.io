var inputA = [
  {
    name: '박태환',
    age: 35,
  },
  {
    name: '유재석',
    age: 49,
  },
  {
    name: '김강훈',
    age: 12,
  },
  {
    name: '이지원',
    age: 15,
  },
];
var ans = [];
for (var i = 0; i <= inputA.length - 1; i++) {
  if (inputA[i].age >= 20) {
    ans.push(inputA[i].name);
  }
}

document.write(ans);
