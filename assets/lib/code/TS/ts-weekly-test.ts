// ---------------- Interface 확장 ----------------
/*
Interface는 클래스와 마찬가지로 인터페이스 간 확장 가능
*/
/*
Animal interface 선언
void 타입인 makeSound() 메소드를 가짐
Dog interface 선언
void 타입인 run() 메소드 가짐
BullDog class 선언하고, Dog interface implements
Dog interface에 Animal interface를 확장해
makeSound(), run() 메소드 구현
*/
// Animal 인터페이스를 선언하세요.
interface Animals {
  makeSound(): void;
}

// Dog 인터페이스를 선언하세요.
// Dog 인터페이스에 Animal 인터페이스를 확장하세요.
interface Doggies extends Animals {
  run(): void;
}

// BullDog class는 Dog interface를 implements했기 때문에,
// interface가 가지고 있는 함수를 class에서 구현시켜야합니다.
class BullDoggy implements Doggies {
  makeSound() {
    console.log("멍멍");
  }
  run() {
    console.log("달리기");
  }
}

// 아래가 정상적으로 동작하도록 코드를 작성하세요.
const bullDog = new BullDoggy();
bullDog.makeSound(); // 멍멍 출력
bullDog.run(); // 달리기 출력

// ---------------- Generic ----------------
/*
Generic은 코드를 작성할 때가 아니라 코드가 수행될 때 타입을 명시할 때 사용
*/
/*
Generic을 이용해 class Queue 선언
class Queue를 generic을 활용해 push와 pop 메소드를 구현
*/
// 제네릭을 이용해 클래스를 선언하세요.
class Queue<T> {
  private data: Array<T> = [];

  // 제네릭을 활용하여 push()와 pop() 메소드를 구현해주세요.
  push(item: T) {
    this.data.push(item);
  }

  pop(): T | undefined {
    return this.data.shift();
  }
}

// 아래 코드가 올바르게 동작하도록 코드를 작성하세요.
const numberQueue = new Queue<number>();

numberQueue.push(0);
console.log(numberQueue.pop());

// ---------------- utility type ----------------
/*
Partial: 프로퍼티를 선택적으로 만드는 타입으로 구성 가능
Omit: 모든 프로퍼티를 선택한 다음 K를 제거한 타입 구성
Pick: 프로퍼티 K의 집합을 선택해 타입 구성
*/
/*
메소드의 파라미터 타입을 유틸리티 타입을 이용해 정상 동작할 수 있게 코드를 수정
*/
interface IBook {
  title: string;
  author: string;
  description: string;
}

// Ibook에 Utility types을 추가해주세요
function updateBookDescription(book: Partial<IBook>) {
  console.log(book);
}

// Ibook에 Utility types을 추가해주세요
function updateBookTitleAndAuthor(book: Omit<IBook, "description">) {
  console.log(book);
}

// Ibook에 Utility types을 추가해주세요
function updateTitle(book: Pick<IBook, "title">) {
  console.log(book);
}

// 함수 호출 부분은 수정을 하지 않습니다
updateBookDescription({ description: "new description" });
updateBookTitleAndAuthor({ title: "new title", author: "new author" });
updateTitle({ title: "new title" });

// ---------------- getter & setter ----------------
/*
주어진 TS 코드에서는 private property에 접근해 에러 발생
private property인 age의 값을 가져오는 getAge와, 값을 변경하는 setAge 메소드를 생성, 사용
*/
/*
personInfo class 내 age property 반환하는 getAge method 구현
personInfo class 내 any type의 인자를 받는 setAge method 구현
전달된 매개변수의 타입이 number이면 class의 age property 변경,
age changed to (changed age) 반환
전달된 매개변수의 타입이 number아니면 cannot change age 반환

변수의 type check 위해 typeof keyword 사용
typeof 변수 는 변수의 type을 문자열로 반환
어떤 변수가 문자열인지 확인하기 위해서는 typeof 변수 === 'string' 으로 확인 가능

실행결과
cannot change age
30
age changed to 31
*/
class personInfo {
  private age: number;
  getAge() {
    return this.age;
  }
  setAge(age: any) {
    if (typeof age === "number") {
      this.age = age;
      return `age changed to ${age}`;
    } else {
      return "cannot change age";
    }
  }
  constructor(age: number) {
    this.age = age;
  }
}

const bob = new personInfo(30);

// console.log(bob.age);

console.log(bob.setAge("s"));
console.log(bob.getAge());
console.log(bob.setAge(31));

// ---------------- generic function 만들기 ----------------
/*
여러 type에서 동작이 가능한 generic function 만들기
배열의 중앙값을 반환하는 generic function getMiddle 구현
만약 배열의 원소 갯수가 짝수라면 중앙에 가까운 두 원소 중 index가 튼 원소 반환
*/
/*
generic function getMiddle 선언
T type 배열을 input으로 받고, T type return
getMille 함수가 배열의 중앙값을 반환하도록 코드 작성
generic function 사용해 변수 numMiddle, strMiddle, boolMiddle이
각 배열의 중앙값을 저장하도록

실행 결과
number 92
string array
boolean true
*/
/*
// generic function getMiddle을 작성하세요.
function getMiddle<T>(input: T[]): T {
  return input.sort();
}
let numMiddle: number[] = [1, 2, 3];
let strMiddle: string[] = ['a', 'b', 'c'];
let boolMiddle: boolean[] = [true, false];
const numArray: number[] = [
  500, 893, 68, 87, 345, 411, 345, 92, 625, 767, 534, 16, 246, 351,
];
const numMiddle = undefined;
console.log(`${typeof numMiddle} ${numMiddle}`);

const strArray: string[] = [
  'a',
  'getmiddle',
  'elice',
  'function',
  'typescript',
  'type',
  'array',
  'aaa',
  's',
  'swtrack',
  'generic',
  'str',
  'string',
];
const strMiddle = undefined;
console.log(`${typeof strMiddle} ${strMiddle}`);

const boolArray: boolean[] = [
  true,
  true,
  true,
  false,
  false,
  true,
  false,
  false,
  true,
  false,
  false,
  true,
  false,
  true,
  false,
  false,
];
const boolMiddle = undefined;
console.log(`${typeof boolMiddle} ${boolMiddle}`);
*/
// ---------------- factory pattern ----------------
// 객체를 생성하는 interface는 미리 정의하되
// instance를 만들 class의 결정은 sub class에서 진행하는 pattern

// Bus, Taxi class의 부모 class인 Car 추상 클래스 구현
// 추상 클래스에서 constructor 구현해 자식에서 사용 할 수 있게
// name field 선언 및 할당
// name field는 상속받은 sub class에서 접근가능한 접근제어자 선언
// drive, park 추상 메소드 완성

// Car 추상 클래스를 구현해주세요.
// 1. constructor를 구현해서 name필드값을 생성하세요.
// 2. name 필드는 상속받은 자식 클래스에서 접근가능한 접근제어자를 선언해주세요.
// 3. 추상 메소드를 구현해주세요.
abstract class CarFactoryPattern {
  protected name: string;
  constructor(name: string) {
    this.name = name;
  }
  abstract drive(): void;
  abstract park(): void;
}

// 이하 아래 코드는 수정하지 않습니다.
class BusFactoryPattern extends CarFactoryPattern {
  constructor(name: string) {
    super(name);
  }

  drive(): void {}
  park(): void {
    console.log(`${this.name} 주차`);
  }
}
class TaxiFactoryPattern extends CarFactoryPattern {
  constructor(name: string) {
    super(name);
  }

  drive(): void {}
  park(): void {
    console.log(`${this.name} 주차`);
  }
}

class CarFactoryPatterns {
  static getInstance<T extends CarFactoryPattern>(
    type: { new (name: string): T },
    name: string
  ): T {
    return new type(name);
  }
}

// const busFactoryPattern = CarFactoryPatterns.getInstance(Bus, "버스");
// const taxiFactoryPattern = CarFactoryPatterns.getInstance(Taxi, "택시");
// busFactoryPattern.park();
// taxiFactoryPattern.park();

// ---------------- strategy pattern ----------------
/*
객체가 할 수 있는 행위들 각각을 전략으로 만들어 놓고
동적으로 행위의 수정이 필요한 경우 전략을 바꾸는 것 만으로
행위의 수정이 가능하도록 만든 패턴
*/
/*
만드는 주스에 따라 반환 값이 달라지는 것을 대비해
MakeJuice class를 strategy pattern으로 구현
JuiceCafe class 내 makeJuiceStrategy method 완성
해당 메소드는 클래스 객체를 매개변수로 받아
juiceCafe 객체가 어떤 동작을 수행할 지 전략 지정
JuiceCafe class 내 make method 완성
해당 method를 통해 지정된 전략의 동작 수행
*/
interface MakeJuice {
  make(): void;
}

class BananaJuice implements MakeJuice {
  make() {
    console.log("Banana juice");
  }
}

class StrawberryJuice implements MakeJuice {
  make() {
    console.log("Strawberry juice");
  }
}

class JuiceCafe {
  private makejuice: MakeJuice;
  makeJuiceStrategy(makejuice: MakeJuice) {
    this.makejuice = makejuice;
  }
  make() {
    this.makejuice.make();
  }
}

// 아래 코드는 수정하지 않습니다.
const juiceCafe = new JuiceCafe();

juiceCafe.makeJuiceStrategy(new BananaJuice());
juiceCafe.make();

juiceCafe.makeJuiceStrategy(new StrawberryJuice());
juiceCafe.make();

// ---------------- 함수 오버로딩 ----------------
/*
함수 오버로딩을 이용해 두 개 또는 세 개의 인자를 받아
합을 계산하는 함수 만들기
*/
/*
두 개의 number 타입을 인자로 받아 number 타입을 반환하는 add 함수 선언
세 개의 number 타입을 인자로 받아 number 타입을 반환하는 add 함수 선언
두 개 또는 세 개의 인자를 받아 합을 계산하는 코드 구현
인자가 두 개인 경우 두 인자의 합 반환
인자가 세 개인 경우 첫 번재 인자에 두 번째 인자를 세 번째 인자만큼 반복해 더해 반환
입력 예시 1
10 20
출력 예시 1
30
입력 예시 2
5 3 10
출력 예시 2
35
*/
function add(input1: number, input2: number): number;
function add(input1: number, input2: number, input3: number): number;

function add(input1: number, input2: number, input3?: number): number {
  if (input3 !== undefined) {
    return input1 + input2 * input3;
  } else {
    return input1 + input2;
  }
}

export { add };

// ---------------- 빈 사각형 그리기 ----------------
/*
사각형의 변의 길이를 수정하고 속이 빈 정시각형을 출력하는 기능을 가진 클래스 구현
*/
/*
클래스 Square 선언
변의 길이를 확인하고 변경할 수 있는 getLength, setLength method 구현
속이 빈 사각형을 출력하는 draw method 구현
입력 예시
3
실행 결과
3
***
* *
***
*/
class Square {
  length: number;
  getLength() {
    return this.length;
  }
  setLength(length: number) {
    this.length = length;
  }
  draw() {
    let star = "*";

    for (let i = 1; i <= this.length; i++) {
      console.log(star.repeat(this.length));
    }
  }
}

export { Square };

// ---------------- 추상 클래스 (template method pattern) ----------------
/*
프로그램의 일부분을 sub class로 캡슐화해 전체구조를 바꾸지 않고
특정 단계의 기능을 바꾸는 design pattern 중 하나

주어진 Student abstract class를 상속받는 Alice, June, Chloe가 있을 때,
각자 study function을 실행했을 때 각자 다른 동작을 하도록
design pattern을 활용해 코드 구현
*/
/*
Alice, June, Chloe class에 Student class 상속
A, J, C class가 다른 동작을 하도록 takeABreak 함수 구현되어 있음
study function이 호출될 때 takeABreak가 실행될 수 있도록
Student class에 추상 메소드 구현
A, J, C class에 study function 실행해 다음과 같은 결과
A
공부 시작!
잠자며 휴식
공부 종료!
J
공부 시작!
커피 한잔하며 휴식
공부 종료!
C
공부 시작!
산책하며 휴식
공부 종료!
*/
abstract class Student {
  // 자식 class에서 공통적으로 사용하는 부분을 템플릿 메서드라 합니다.
  // study메소드를 템플릿 메소드로 만들어 주세요.
  public study(): any {
    console.log("공부 시작!");
    // 자식 class에서 각자 다른 메소드가 구현되는 takeABreak 메소드를 구현해주세요.
    this.takeABreak();
    console.log("공부 종료!");
  }
  abstract takeABreak(): void;
}

// Alice, June, Chloe는 학생입니다. Student Class를 확장하세요.
class Alice extends Student {
  takeABreak(): void {
    console.log("잠자며 휴식!");
  }
}

class June extends Student {
  takeABreak(): void {
    console.log("커피 한잔하며 휴식!");
  }
}

class Chloe extends Student {
  takeABreak(): void {
    console.log("산책하며 휴식!");
  }
}

/**
공부 시작!
잠자며 휴식
공부 종료!
*/
const alice = new Alice();
alice.study();

/**
공부 시작!
커피 한잔하며 휴식
공부 종료!
*/
const june = new June();
june.study();

/**
공부 시작!
산책하며 휴식
공부 종료!
*/
const chloe = new Chloe();
chloe.study();

// ---------------- Generic과 Interface ----------------
/*
Generic은 코드를 작성할 때가 아니라 코드가 수행될 때 타입을 명시해 사용
extends keyword를 사용해 interface extend
*/
/*
Player class는 string 제약조건의 Generic type으로 구현되어 있음
IVideo type의 제약조건을 변경 해 코드가 동작하도록 수정

openFile method에서 title, runningTime, extension parameter가 모두 허용되게
interface 확장
*/
interface IFile {
  title: string;
  runningTime: number;
}

// interface를 확장해주세요.
interface IVideo extends IFile {
  extention: string;
}

// Genric 제약조건을 변경해주세요.
class Player<T extends any> {
  private file: T;

  openFile(file: T): void {
    this.file = file;
  }

  play(): void {
    console.log(this.file);
  }
}

// 아래 코드는 수정을 하지 않습니다.
const player = new Player<IVideo>();
player.openFile({ title: "타입스크립트", runningTime: 60, extention: "MPEG" });
player.play();
