// ---------------- 변수 타입 지정하기 ----------------
/*
타입스크립트에서 변수를 정의할 때는 타입을 지정하는 방법

변수를 선언하기 위한 var나 let 키워드 뒤에 변수명까지 작성하고,
변수명 뒤에 : 타입과 같은 형태로 지정

지정 가능한 타입명은
string, boolean, number, null, undefined, object, array,
tuple, enum, any, void, never 등 여러가지

1. 한 변수 혹은 객체에 타입 정의하기
// name이란 변수에 문자열로 타입 지정
let name: string = "kim";

2. 한 변수 혹은 객체에 여러 타입을 정의하기
// id란 변수에 문자열 또는 숫자로 타입 지정 (Union type)
let id: string | number = 123;

배열의 타입
변수선언키워드 변수명: 타입[] = 값;

튜플의 타입
변수선언키워드 변수명: [첫번째요소타입, 두번째요소타입, ...] = 값;
*/
/*
number 타입으로 지정한 array 변수 a를 선언
a에 값은 [1, 2, 3]을 저장
boolean 타입의 isCamelCase 변수를 정의하고 값을 true로 저장
2개의 요소를 갖는 tuple 변수 b를 정의
첫 번재 요소는 string 타입
두 번째 요소는 number 타입
주석 처리된 코드 중 b 튜플에 값을 넣을 수 있는 주석이 무엇인지 고민해보고,
해당 코드만 주석을 해제
*/
// http 모듈을 불러오세요.
// number 타입으로 지정한 array 변수 a를 선언하고 [1, 2, 3]을 저장
let a: number[] = [1, 2, 3];

// boolean 타입의 isCamelCase 변수를 정의하고 값을 true로 저장
let isCamelCase: boolean = true;
// 첫번째 요소의 타입으로 string을, 두번째 요소의 타입으로 number를 가지는 tuple b를 선언
let b: [string, number];
// 아래 주석을 위부터 하나씩 해제해서 선언된 것들중 에러가 발생하지 않고 출력되는 배열 b를 확인
// b = [2,3]
b = ['2', 3];
// b = ['2','3']

// 채점을 위한 코드입니다 수정하지 마세요
export { a, isCamelCase, b };

// ---------------- 함수에서 타입 지정하기 ----------------
/*
함수의 매개변수와 반환값에 타입을 지정하는 방법

파라미터 타입을 number로, 반환하는 값도 number로 지정
function sayNumber(x: number): number {
  return x * 2;
}

// sayNumber("hello"); //error 발생
sayNumber(2); //4

반환값의 타입을 여러개로 정의하는 방법
function sayHi(x: number): number | string {
  if (0 < x) {
    return x;
  } else {
    return "negative number";
  }
}
여러개로 정의 된 타입(number, string)중 에 하나를 반환
*/
/*
매개변수 타입이 number이며,
반환하는 값도 number인 add 함수를 완성
add 함수는 parameter로 두 숫자(x, y)를 받아서 그 합을 반환
const result = add(1, 2);
console.log(result); // 3

아래 조건을 만족하는 helloUser 함수를 작성
함수에 매개변수 중 id의 타입은 string 또는 number로,
age의 타입은 number로 지정
age는 선택이 가능한(optional) parameter이며
age에 해당하는 값이 없어도 에러가 발생하지 않음
반환 값은 string
매개변수로 age를 전달받을 경우 id와 age를 모두 반환하고
없을 경우 사용자 id만 반환
id와 age를 반환: Hello, ${id}. You are ${age}years old.
id만 반환: Hello, ${id}.
호출 예시
console.log(helloUser("Vero", 23));
// "Hello, Vero. You are 23 years old."
*/
// add 함수에 매개변수 타입을 number로, 반환하는 값도 number로 지정
function add(x: number, y: number): number {
  return x + y;
}

// 지시사항을 참고하여 id와 age를 입력 받아 문자열을 출력하는 helloUser 함수를 완성
function helloUser(id: String | number, age?: number) {
  if (age !== undefined) {
    //console.log(`Hello, ${id}. You are ${age} years old.`);
    return `Hello, ${id}. You are ${age}years old.`;
  } else {
    //console.log(`Hello, ${id}`);
    return `Hello, ${id}.`;
  }
}

console.log(helloUser('Vero', 23));
// "Hello, Vero. You are 23 years old."

// 채점을 위한 코드입니다 수정하지 마세요
export { add, helloUser };

// ---------------- 클래스 생성 ----------------
/*
클래스(class)란 객체를 정의하는 틀 또는 설계도와 같은 의미로 사용

하나의 클래스의 요소들은 다음을 포함
  멤버
    필드
    생성자
    메소드

Car 클래스 have 3개의 멤버
(brand 필드, 생성자(constructor) 그리고 getBrand 메소드)
class Car {
  brand: string;
  constructor(message: string) {
    this.brand = message;
  }
  getBrand() {
    return "This car is " + this.brand;
  }
}

let car = new Car("Porsche");

클래스 안에서 this.를 앞에 덧붙이면 클래스의 멤버를 의미

마지막 줄에서, new를 사용하여 Car 클래스의 인스턴스를 생성
이 코드는 정의한 생성자를 호출하여 Car 형태의 새로운 객체를 만들고,
생성자를 실행해 초기화
*/
/*
Sneakers 클래스에 멤버 변수인 color를 선언
타입은 string
생성자를 만들어 멤버 변수의 color의 타입을 string으로 지정
color를 생성자에 입력된 매개변수로 설정
클래스의 멤버를 접근하기 위해 this.를 사용
매개변수에 주어진 색상으로 color를 변경하는 setColor() 메소드를 구현
매개변수의 타입은 string
클래스 밖에 new를 사용하여 Sneakers 클래스의 인스턴스를 생성
color는 "red"로 설정하여, redShoes 변수에 저장
주석 처리된 blueShoes의 color를 setColor 메소드를 이용해 "blue"로 변경
*/
class Sneakers1 {
  // 멤버 변수인 color를 정의
  color: string;
  // 생성자를 만들고 this.를 사용해 멤버변수의 color의 값을
  // 입력된 매개변수로 설정
  constructor(color: string) {
    this.color = color;
  }
  // 멤버 변수 color를 변경하는 setColor 메소드를 정의

  setColor1(settingColor: string) {
    this.color = settingColor;
  }
}
// color가 red인 Sneakers의 인스턴스를 생성
const redShoes1 = new Sneakers1('red');

// 아래 코드의 주석을 해제하고, setColor 메소드로 색상을 변경
const blueShoes1 = new Sneakers1('red');
blueShoes1.setColor1('blue');

// 채점을 위한 코드입니다 수정하지 마세요
export { Sneakers1, redShoes1, blueShoes1 };

// ---------------- 클래스 상속 ----------------
/*
TypeScript에서는,
일반적인 객체지향 패턴을 사용 가능

Java, C++, C#, Python, PHP, Typescript 등과 같은
클래스 기반 프로그래밍의 가장 기본적인 패턴 중 하나는
상속을 이용하여 이미 존재하는 클래스를 확장해 새로운 클래스를 생성하는 것

아래 예시에서는 이미 존재하는 Animal 클래스를 확장해
새로운 Cat 클래스를 생성
class Animal {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  getName() {
    return "Name is " + this.name;
  }
}

class Cat extends Animal {
  constructor(name: string) {
    super(name);
  }
  cry() {
    console.log("Meow");
  }
}

Cat은 Animal의 기능을 확장하기 때문에,
getName()을 가진 인스턴스를 생성 가능

위 예제에서 파생된 클래스(Animal)의 생성자 함수는
기초 클래스의 생성자를 실행할 super()를 호출해야

타입스크립트에서 부모 클래스 자식 클래스 둘 다 생성자가 있는 경우
서브클래스의 생성자는 super() 메소드로
슈퍼 클래스의 생성자를 호출하지 않으면 에러가 발생

따라서 Cat은 Animal의 필드를 오버라이드해서
클래스의 특성에 맞는 기능을 가진 메소드를 생성 가능
*/
/*
extends 키워드를 사용하여 Sneakers 클래스를 상속받는
Nike 클래스를 생성
super를 이용해 생성자를 설정
Nike 클래스 내에 saySlogan 메소드를 생성
"Just Do It"를 반환
myShoe 변수에 Nike 클래스의 인스턴스를 생성
color를 "red"로 설정
myShoe 메소드에 설정된 주석을 해제하여, 올바르게 실행되는지 확인
*/
class Sneakers {
  color: string;
  constructor(color: string) {
    this.color = color;
  }
  setColor(color: string) {
    this.color = color;
  }
}

// `extends` 키워드를 사용하여 Sneakers 클래스를 상속받는 Nike 클래스를 생성
class Nike extends Sneakers {
  // 생성자를 올바르게 설정
  constructor(color: string) {
    super(color);
    this.color = color;
  }
  // 슬로건을 반환하는 saySlogan 메소드를 정의
  saySlogan() {
    return 'Just Do It';
  }
}

// color가 "red"인 Nike 클래스의 인스턴스를 정의
const myShoe = new Nike('red');

// 아래 주석을 해제하고 정상적으로 실행되는지 확인
myShoe.setColor('blue');
console.log(myShoe.saySlogan());

// 채점을 위한 코드입니다 수정하지 마세요
export { Nike, myShoe };

// ---------------- 클래스 상속 & 접근 제한자 ----------------
/*
클래스에서 public, private, protected 지정자를 사용해
프로그램 내에서 선언된 멤버들에 자유롭게 접근 또는 제한 가능

public - 자식 클래스나 클래스 인스턴스에서 접근 가능 (아무것도 표기하지 않으면 public입니다)
private - 해당 클래스 내부에서만 접근 가능
protected - 자식 클래스에서 접근 가능
*/
/*
Sneakers 클래스를 상속받는 Adidas 클래스를 작성
printPrice() 메소드를 자식 클래스에서 접근할 수 있도록
접근 제한자를 올바르게 수정

Adidas 클래스에서 printPrice() 메소드를 재정의
아래와 같은 형식의 문자열을 반환
Thank you for choosing Adidas
The "color" one is "unitInWon" won.

Tips!
문제에 주어진 주석을 해제 후 실행했을 때 아래 메시지가 콘솔에 출력
Thank you for choosing Adidas
The red one is 120000 won.

super를 이용해 부모 클래스의 멤버들을 이용
템플릿 리터럴을 이용해 출력 양식을 맞추세요
*/
class Sneakers2 {
  color: string;
  constructor(theColor: string) {
    this.color = theColor;
  }
  // printPrice()의 접근 제한자를 수정하세요.
  protected printPrice2(unitInWon: number = 0) {
    return `The ${this.color} one is ${unitInWon} won.`;
  }
}

// Sneakers 클래스를 상속받는 Adidas 클래스를 작성하세요.
class Adidas2 extends Sneakers2 {
  constructor(color: string) {
    super(color);
  }

  // Adidas 클래스 내에 printPrice() 메소드를 재정의하세요.
  printPrice2(unitInWon: number = 0) {
    return `Thank you for choosing Adidas
${super.printPrice2(unitInWon)}`;
  }
}
// 주석을 해제하여 결과를 확인해보세요.
let toni = new Adidas2('red');
console.log(toni.printPrice2(120000));

// 채점을 위한 코드입니다. 수정하지 마세요.
export { Adidas2 };

// ---------------- Interface 사용 ----------------
/*
Interface(인터페이스)는 자바스크립트가 지원하지 않는 타입스크립트만의 특징이며 타입 체크 목적으로 사용합니다.

타입 체크란 자바스립트에서 변수에 어떤 타입의 값이 할당될 지 예측하기 어려웠던 반면 타입스크립트에서는 컴파일될 때 어떤 값의 타입을 확인하고 검사할 수 있다는 의미입니다.
Interface를 사용하여 함수 파라미터의 타입을 선언할 수 있어서 함수에 객체를 전달할 때 복잡한 매개변수 체크가 따로 필요없어서 매우 유용합니다.

아래 예제를 살펴보며 Interface를 어떻게 정의하는지 알아보겠습니다.

클래스와 달리 Interface는 TypeScript의 컨텍스트 내에서만 존재하는 가상 구조로 선언만 존재합니다.

interface User {
    name: string;
    job: string;
    age: number;
}

위처럼 프로퍼티를 정해서 User라는 객체를 표현할때 Interface를 사용합니다.

이때 Interface 타입으로 선언한 변수는 해당 Interface를 준수해야 합니다.

// ERROR
let user : User = {  }

// OK
let user: User = {
    name: 'Calvin',
    job: 'Software Engineer',
    age: 26
};
*/
/*
printName 함수는 파라미터로 string 타입의 name 프로퍼티를 가지는 객체를 받습니다. 코드를 실행하여 함수가 무엇을 출력하는지 확인해보세요.

주어진 예제와 동일한 기능을 하는 함수를 Interface를 사용해서 만들어봅니다. 먼저, string 타입의 프로퍼티인 name을 갖는 Interface를 정의하세요.

printName 함수와 동일하게 작동하는 printName2라는 함수를 생성합니다. 이번엔 정의된 Interface를 parameter 타입으로 지정하세요.

name을 "Elice Kim"으로 지정한 객체가 선언된 코드의 주석을 해제하여, printName2 함수의 호출 결과를 확인
 */
// 매개변수로 객체를 받는 예제 코드입니다.
function printName(namedObj: { name: string }) {
  return namedObj.name;
}

// 어떤 결과가 나오는지 확인해보세요.
let myObj = { size: 10, name: 'Saehee Choi' };
console.log(printName(myObj));

// string 타입의 프로퍼티인 name을 갖는 Interface를 정의하세요.
interface nameInterface {
  name: string;
}

// printName 함수와 동일하게 작동하는 printName2라는 함수를 생성하고, 정의된 Interface를 parameter 타입으로 지정하세요.
function printName2(nameOBJ: nameInterface) {
  return nameOBJ.name;
}
// 주석을 해제하여 어떤 결과가 나오는지 확인해보세요.
let myObj2 = { size: 10, name: 'Elice Kim' };
console.log(printName2(myObj2));

// 채점을 위한 코드입니다. 수정하지 마세요.
export { printName2 };

// ---------------- optional, readonly ----------------
/*
선택적 프로퍼티 (Optional)

인터페이스의 모든 프로퍼티가 필요한 것은 아닙니다. 어떤 조건에서만 존재하거나 아예 없을 수도 있습니다.

User의 name과 age를 제외한 나머지 프로퍼티들을 선택사항으로 지정하려면 선언에서 프로퍼티 이름 끝에 ? 를 붙여 표시합니다.

interface User {
  name: string;
  age: number;
  job?: string;
  passportId?: number;
}
Copy
아래와 같이 User라는 프로퍼티를 사용할 때 job과 passportId를 선언하지 않아도 에러가 발생하지 않습니다.

// OK
let user: User = {
  name: "Calvin",
  age: 18,
};
Copy
읽기전용 프로퍼티 (Readonly)

어떤 프로퍼티들은 객체가 처음 생성될 때만 수정 가능하도록 설정할 수 있습니다. 프로퍼티 이름 앞에 readonly를 넣어서 지정합니다.

변수를 선언할 때 사용하는 const와 유사하다고 생각할 수 있는데, 변수는 const를 사용하고 프로퍼티는 readonly를 사용한다고 기억하면 됩니다.

interface User {
  readonly name: string;
  age: number;
}
Copy
let user: User = {
  name: "Calvin",
  age: 23,
};
Copy
위의 readonly 속성을 가진 인터페이스를 할당하여 객체를 생성한 후, name은 수정할 수 없습니다.

user.name: 'Jamie'; // ERROR
*/
/*
다음과 같은 타입의 프로퍼티들을 갖도록 Interface를 정의

name - string 타입 (읽기 전용)
id - string 또는 number 타입 (읽기 전용)
gender - string 타입 (선택 사항)
accountNumber - number 타입의 프로퍼티
위의 인터페이스를 할당한 객체를 정의하여, optional과 readonly가 정상적으로 동작하는지 확인
*/
// 지시사항에 주어진 타입의 프로퍼티들을 갖도록 Interface를 정의하세요.
interface User {
  readonly name: string;
  readonly id: string | number;
  gender?: string;
  accountNumber: number;
}

// 정의한 인터페이스를 할당한 객체를 생성하여 테스트해보세요.
let user: User = {
  name: 'Calvin',
  id: 23,
  accountNumber: 20,
};

// 채점을 위한 코드입니다. 수정하지 마세요.
export { User };

// ---------------- Union 타입, Intersection 타입 ----------------
/*
1. Union 타입
Union 타입이란 자바스크립트의 OR 연산자(||)와 비슷하게 'A' 이거나 'B'이다처럼 두 개 이상의 타입을 사용 가능하게 합니다.

| 연산자를 이용하여 타입을 여러 개 연결하는 방식을 유니온 타입 정의 방식이라고 부릅니다.

function logText(text: string | number) {
  // ...
}
Copy
따라서 위 함수의 파라미터 text에는 문자열 타입이나 숫자 타입이 올 수 있습니다.

Union Type 사용 이유
아래 2개의 코드를 비교해서 유니온 타입의 장점을 알아봅시다.

타입 any를 사용하는 경우
function getNumber(num: any) {
  num.toFixed(); // 에러 발생
  return num;
}
Copy
어떠한 타입도 허용하는 any는 타입 체크로 엄격하게 관리하는 타입스크립트 입장에서 어떠한 정보를 알려주지 않기 때문에 문제가 발생하기 쉽습니다. 그래서 위처럼 숫자 관련된 함수를 작성할 때 에러를 발생합니다.

유니온 타입을 사용하는 경우
function getNumber(num: number | string) {
  if (typeof num == 'number') {
    return num.toFixed(); // 정상 동작
  }
  if (typeof num == 'string') {
    return num; // 정상 동작
  }
  return new TypeError('num must be number or string');
}
Copy
| 연산자를 이용하여 유니온 타입을 사용하면 num의 타입이 ‘number’로 추론되기 때문에 숫자 관련된 API를 쉽게 자동완성 할 수 있습니다.

2. Intersection 타입
인터섹션 타입(Intersection Type)은 여러 타입을 모두 만족하는 하나의 타입을 의미합니다.

interface Band {
  name: string;
  ranking: number;
}

interface Drummer {
  name: string;
  age: number;
}

type Prop = Band & Drummer;
Copy
위 코드는 Band 인터페이스와 Drummer 인터페이스의 타입 정의를 & 연산자를 이용하여 합친 후, Prop이라는 타입에 할당한 코드입니다. Prop의 타입은 아래와 같이 정의됩니다.

{
  name: string;
  ranking: number;
  age: number;
}
Copy
& 연산자를 이용해 여러 개의 타입 정의를 하나로 합치는 방식을 사용
*/
/*
introduce 함수를 실행하면
person.age와 person.skill를 사용하는 코드에서 에러가 발생합니다.
이를 해결하기 위해 인터섹션 타입(Intersection Type)을 사용하세요.

Doctor 인터페이스의 타입과 Engineer 인터페이스의 타입을 합친
intersction 타입의 객체를 선언하세요.
파라미터 타입을 Intersection 타입의 객체로 바꾸세요.
*/
interface Doctor {
  name: string;
  age: number;
}
interface Engineer {
  name: string;
  skill: string;
}

// Docter 인터페이스와 Engineer 인터페이스를 합친 타입을 선언하세요.
type human = Doctor & Engineer;

// 함수의 매개변수 타입을 수정하세요.
function introduce(person: human) {
  console.log(person.name); // 정상 동작
  console.log(person.age); // 타입 오류
  console.log(person.skill); // 타입 오류
}

// 채점을 위한 코드입니다. 수정하지 마세요.
export { introduce };

// ---------------- 함수에서 Generic 사용 ----------------
/*
Generic이란 데이터의 타입을 일반화한다(generalize)라는 의미입니다. 쉽게 말하자면, 특정 타입을 정하지 않고 여러 타입을 변수를 전달하는 개념입니다.

따라서 한번의 선언으로 다양한 타입에 재사용이 가능하다는 장점이 있습니다.

Generic은 <>를 사용하여 그 안에 문자로 클래스나 함수 interface를 재사용할 수 있습니다.

function func<T1, T2>(param1: T1, param2: T2) {
  // ...
}
Copy
위 예시 코드에 <T1, T2>가 Typescript의 강력한 Generic System 입니다.

다이아몬드 연산자 안에 있는 T1, T2를 타입변수라고 합니다.

T1과 T2라는 변수를 주면, 이 변수는 추후 우리가 다양한 타입으로 작성할 수 있습니다.
*/
/*
getFirstElement 함수는 매개변수로 입력된 배열의 첫번째 요소를 반환하고 있습니다. 하지만 입력된 매개변수나 반환하는 값의 타입이 any이기 때문에 정확한 타입을 알 수 없습니다.

따라서 배열의 요소가 숫자일 때 substring 함수를 적용할 수가 없는데, 이 에러를 런타임 단계에서 확인할 수 있습니다.

getFirstElement 함수에 입력되는 배열 요소와 반환되는 값의 타입을 지정할 수 있도록 제네릭을 적용하세요.
<number> 타입을 적용할 때, substring 함수를 적용하면 어떻게 되는지 확인해보세요.
Tips!
Generic을 적용하지 않은 경우, 1과 o까지 출력된 이후에 에러가 발생하는 것을 확인할 수 있습니다.


Generic을 적용하는 경우, 실행을 하기 전에 에러를 확인할 수 있습니다.
*/
// Generic을 적용해 함수를 수정하세요.
function getFirstElement<T>(elements: T[]) {
  return elements[0];
}

// 수정한 함수에 맞게 출력해보세요.
console.log(getFirstElement([1, 2, 3]));
console.log(getFirstElement(['one', 'two', 'three']).substring(0, 1));
// console.log(getFirstElement([1, 2, 3]).substring(0, 1)); // 런타임 단계에서 에러 발생

// 채점을 위한 코드입니다. 수정하지 마세요.
export { getFirstElement };

// ---------------- 타입스크립트 컴파일러(TSC) 동작 확인 ----------------
/*
여러분이 작성한 모든 코드들을 컴퓨터가 이해하도록 AST(추상 구문 트리)라는 자료구조로 변환하고 컴퓨터에서 실행 가능한 프로그램을 생성하는 것이 컴파일러입니다.

Typescript Compiler(TSC) 과정
타입스크립트로 작성된 코드가 어떻게 유저에게 전달되는 과정은 이렇게 요약됩니다.

개발자가 타입스크립트 코드를 작성

컴파일러가 타입스크립트 코드를 AST(추상구문트리)라는 자료구조로 변환

타입검사기(Typechecker)가 AST의 코드의 타입 안정성을 검증

타입스크립트 AST → 자바스크립트 소스로 변환

– 아래부터 브라우저, NodeJS, 기타 자바스크립트 엔진(node.js) 등이 수행—

자바스크립트 소스 → 자바스크립트 AST로 변환

자바스크립트 AST → Bytecode로 변환

JS 런타임이 Bytecode를 평가, 실행 결과 보여줌

이번 실습에서는 터미널에서 타입스크립트를 실행

*/
/*
로컬에서 typescript 파일을 실행 방법을 바탕으로 이 실습 터미널에서 진행하겠습니다.

터미널에서 node로 javascript 파일을 실행하세요.
node index.js

ts-node를 설치하세요.
yarn add ts-node-dev --dev

ts-node로 typescript 를 실행하세요.
ts-node index.ts

로컬에서 typescript 파일 실행 방법
로컬에서도 위와 마찬가지로 진행한 후 Code Runner(VScode extension)로 typescript 파일을 실행합니다.
(1) 자바스크립트 엔진 (Node.js) 설치
(2) 타입스크립트 설치
(3) Code Runner extension을 설치
(4) 실행하고자 하는 타입스크립트 파일(index.ts) 실행(npx ts-node index.ts)
*/
