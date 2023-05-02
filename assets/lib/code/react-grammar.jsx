// 생산성, 재사용성

// 기존에 사용하던 HTML/JS
<body>
  <span id="text"></span>
  <script>document.getElementById("text").innerText="hello world";</script>
</body>;

// react 버전
const App = () => {
  const test = 'hello world';
  return <span>{text}</span>;
};
