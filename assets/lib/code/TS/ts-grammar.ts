// ---------------- 동적 타입을 정적 타입으로 ----------------
// JS
/*
let a;
a = 1;
a = 'b';
*/

// TS
let a: number;

a = 1;
// Type 'string' in not assignable to type 'number'
// a = 'b';

// ---------------- 타입 유추를 통한 타입 제어 ----------------
// JS
/*
const sum = (a, b) => {
  return a + b
}

sum(1, "2") // string: 12
*/

// TS
const sum = (a: number, b: number) => {
  return a + b;
};

sum(1, 2); // 3

// ---------------- TS의 기본 자료형 ----------------
// string: 문자열 저장
let str: string = 'hi';

// ----------------
// boolean: 참, 거짓 저장
let isSucceeded: boolean = true;

// ----------------
// number: 부동 소수 값 저장
// 2진수, 8진수, 10진수, 16진수 사용 가능
let decimal: number = 6;
let hex: number = 0xf00d;
let binary: number = 0b1010;
let octal: number = 0o744;

// ----------------
// null: 값이 의도적으로 비어 있는 상태 저장
let n: null = null;

// ----------------
// undefined: 값이 할당되지 않은 상태 저장
let u: undefined = undefined;

// typeof로 데이터 타입 확인
typeof null; // 'object'
typeof undefined; // 'undefined'

// ----------------
null === undefined; // false
null == undefined; // true
null === null; // true
null == null; // true
!null; // true
// isNaN(1 + null); // false
// isNaN(1 + undefined); // true

// ---------------- TS의 참조 자료형 ----------------
// object: 기본 자료형에 해당하지 않는 타입
// string, boolean, number, null, undefined를 제외한 타입
function create(o: object): void {}

create({ prop: 0 }); // success
create([1, 2, 3]); // success
// create('string'); // error
// create(false); // error
// create(42); // error
// create(null); // error
// create(undefined); // error

// ----------------
// array: 배열 저장
let arr1: number[] = [1, 2, 3];

// 제네릭 사용한 타입 표기 가능
let arr2: Array<number> = [1, 2, 3];

// ---------------- TS의 추가 제공 자료형 ----------------
// tuple: 길이와 각 요소의 타입이 정해진 배열을 저장
let arr3: [string, number] = ['hi', 6];

// string 전용 함수 concat
// Error, 'number' does not have 'concat'
// arr3[3].concat('!');

// 정의하지 않은 index 호출 시 오류
// Error, Property '3' does not exist on type '[string, number]'
// arr[3] = 'hello';

// ----------------
// enum: 특정 값(상수)들의 집합 저장
enum car1 {
  bus,
  taxi,
  suv,
}

// let bus1: car1 = car1.bus;
// 인덱스 번호로 접근 가능
// let bus1: car1 = car1[0];

// 인덱스를 사용자 편의로 변경
enum car2 {
  bus = 1,
  taxi = 2,
  suv = 3,
}
let taxi2: string = car2[2];

enum car3 {
  bus = 2,
  taxi,
  suv,
}
let taxi3: string = car3[3];
// any: 모든 타입 저장
// 컴파일 중 타입 검사 안함
let str2: any = 'hi';
let num: any = 10;
let arr4: any = ['a', 2, true];

// ----------------
// void: any의 반대로 함수에서 반환 값 없는 경우
// 변수에는 undefined와 null 할당하고, 함수에는 반환값 설정할 수 없는 타입
let unknown: void = undefined;

function sayhi(): void {
  console.log('hi');
}

// ----------------
// never: 발생할 수 없는 타입
// 항상 오류를 발생시키거나 절대 반환하지 않는 반환 타입
// 종료되지 않는 함수
function neverend(): never {
  while (true) {}
}

// Error: A function returning 'never' cannot have a reachable end point
/*
function neverend2(): never {
  while (true) {
    break;
  }
}
*/

// 항상 오류를 발생시키는 함수
function error(message: string): never {
  throw new Error(message);
}

// ---------------- TS의 utility type ----------------
// Partial<T>: 프로퍼티를 선택적으로 만드는 타입 구성
// 주어진 타입의 모든 하위 타입 집합을 나타내는 타입 반환
interface Todo1 {
  title: string;
  description: string;
}

function updateTodo2(todo: Todo1, fieldsToUpdate: Partial<Todo1>) {
  return { ...todo, ...fieldsToUpdate };
}

const todo1 = {
  title: 'organize desk',
  description: 'clear clutter',
};
// description만 꺼내서 사용 가능
const todo2 = updateTodo2(todo1, { description: 'throw out trash' });

// ----------------
// Readonly<T>: 프로퍼티를 읽기 전용으로 설정한 타입 구성
interface Todo2 {
  title: string;
}

const todo3: Readonly<Todo2> = {
  title: 'delete inactive users',
};
// Error: Cannot as sign to 'title' because it is a read-only property
todo1.title = 'hello';

// ----------------
// Record<T>: 프로피티의 집합 K로 타입 구성
// 타입의 프로퍼티들을 다른 타입에 매핑시키는 데 사용
interface PageInfo {
  title: string;
}

type Page = 'home' | 'about' | 'contact';

const x: Record<Page, PageInfo> = {
  about: { title: 'about' },
  contact: { title: 'contact' },
  // Error: '{subTitle: string;}' is not assignable
  //  home: { subTitle: 'home' },
  home: { title: 'home' },

  //Error: main is not assignable to type 'Page'
  //  main: { title: 'home' },
};

// ----------------
// Pick<T,K>: 프로퍼티 K의 집합을 선택해 타입 구성
interface Todo3 {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview1 = Pick<Todo3, 'title' | 'completed'>;

const todo4: TodoPreview1 = {
  title: 'clean room',
  completed: false,
  // Error: 'description' is not assignable to type
  // description: 'description',
};

// ----------------
// Omit<T,K>: 모든 프로퍼티를 선택한 다음 K를 제거한 타입 구성
interface Todo4 {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview2 = Omit<Todo4, 'description'>;

const todo5: TodoPreview2 = {
  title: 'clean room',
  completed: false,
  // Error: 'description' is not assignable to type
  // description: 'description',
};

// ----------------
// Exclude<T,U>: T에서 U에 할당할 수 있는 모든 속성을 제외한 타입 구성
// T0: 'b' | 'c'
type T0 = Exclude<'a' | 'b' | 'c', 'a'>;
// T1: 'c'
type T1 = Exclude<'a' | 'b' | 'c', 'a' | 'b'>;
// T3: string | number
type T2 = Exclude<string | number | (() => void), Function>;

// ----------------
// Extract<T,U>: T에서 U에 할당할 수 있는 모든 속성을 추출해 타입 구성
// T4: 'a'
type T4 = Extract<'a' | 'b' | 'c', 'a' | 'f'>;
// T5: () => void
type T5 = Extract<string | number | (() => void), Function>;

// ----------------
// NonNullable<T>: null과 undefined를 제외한 타입
// T6: string | number
type T6 = NonNullable<string | number | undefined>;
// T7: string[]
type T7 = NonNullable<string[] | number | undefined>;

// ----------------
// Parameters<T>: 함수 타입 T의 매개변수 타입들의 튜플 타입 구성
declare function f1(arg: { a: number; b: string }): void;
// t0: []
type t0 = Parameters<() => string>;
// t1: [string]
type t1 = Parameters<(s: string) => void>;
// t2: [unknown]
type t2 = Parameters<<T>(arg: T) => T>;
// t3: [{a: number, b: string}]
type t3 = Parameters<typeof f1>;
// t4: unknown[]
type t4 = Parameters<any>;
// t5:never
type t5 = Parameters<never>;
// t6: Error
// type t6 = Parameters<string>;
// t7: Error
// type t7 = Parameters<Function>;

// ----------------
// ConstructorParameters<T>: 생성자 함수 타입의 모든 매개변수 타입 추출
// 모든 매개 변수 타입을 가지는 튜플 타입(T가 함수가 아닌 경우 never) 생성
// T8: [(string | undefined)?]
type T8 = ConstructorParameters<ErrorConstructor>;
// T9: string[]
type T9 = ConstructorParameters<FunctionConstructor>;
// T10: [string, (string | undefined)?]
type T10 = ConstructorParameters<RegExpConstructor>;

interface I1 {
  new (args: string): Function;
}

// T11: [string]
type T11 = ConstructorParameters<I1>;

function f2(a: T11) {
  a[0];
  // Error: Tuple type ][args: string]' of length '1' has no element at index '1'
  // a[1];
}

// ----------------
// ReturnType<T>: 함수 T의 반환 타입으로 구성된 타입 생성
declare function f3(): { a: number; b: string };
// type T20: string
type T20 = ReturnType<() => string>;
// type T21: void
type T21 = ReturnType<(s: string) => string>;
// type T22: {}
type T22 = ReturnType<<T>() => T>;
// type T23: number[]
type T23 = ReturnType<<T extends U, U extends number[]>() => T>;
// type T24: {a: number, b: string}
type T24 = ReturnType<typeof f3>;
// type T25: any
type T25 = ReturnType<any>;
// type T26: any
type T26 = ReturnType<never>;
// type T27: Error
// type T27 = ReturnType<string>;
// type T28: Error
// type T28 = ReturnType<Function>;

// ----------------
// Required<T>: T의 모든 프로퍼티가 필수로 설정된 타입 구성
interface Props {
  a?: number;
  b?: string;
}

const obj: Props = { a: 5 };

// Error: Property 'b' is missing in type '{a: number;}'
// const obj2: Required<Props> = { a: 5 };

// ---------------- 함수 선언 방법 ----------------
// 함수 선언식
function func1(name) {
  return `hello${name}`;
}

// TS
function func11(name: string): string {
  return `hello${name}`;
}

// ----------------
// 함수 표현식
let func2 = function (name) {
  return `hello${name}`;
};

// TS
let func21 = function (name: string): string {
  return `hello${name}`;
};

// ----------------
// arrow 함수 표현식
let func3 = (name) => {
  return `hello${name}`;
};

// TS
let func31 = (name: string): string => {
  return `hello${name}`;
};

// ----------------
// 단축형 arrow 함수 표현식
let func4 = (name) => `hello${name}`;

// TS
let func41 = (name: string): string => `hello${name}`;

// ----------------
// 함수 생성자: 되도록 사용 권장 안함
let func5 = new Function('name', 'return"hello"+name');

// ---------------- 타입 추론 ----------------
let f10 = function (x: number, y: number): number {
  return x + y;
};

// contextual typing
// function의 타입을 알려주지 않아도 방정식의 한 쪽이 이미 number
let f11: (baseValue: number, increment: number) => number = function (x, y) {
  return x + y;
};
// ---------------- 기본 매개변수 ----------------
function buildName1(firstName: string, lastName: string) {
  return firstName + ' ' + lastName;
}

// Error: Expected 2 arguments, but got 1
// let result1 = buildName1('bob');
let result2 = buildName1('bob', 'adams');
// Error: Expected 2 arguments, but got 3
// let result3 = buildName1('bob', 'adams', 'Sr.');

// ---------------- 선택적 매개변수 ----------------
function buildName2(firstName: string, lastName?: string) {
  if (lastName) return firstName + ' ' + lastName;
  else return firstName;
}

let result4 = buildName2('bob');
let result5 = buildName2('bob', 'adams');
// Error: Expected 2 arguments, but got 3
// let result6 = buildName2('bob', 'adams', 'Sr.');

// ---------------- 기본 - 초기화 매개변수 ----------------
function buildName3(firstName: string, lastName = 'smith') {
  return firstName + ' ' + lastName;
}

let result7 = buildName3('bob'); // bob smith
let result8 = buildName3('bob', undefined); // bob smith
let result9 = buildName3('bob', 'adams'); // bob adams
// Error: Expected 1-2 arguments, but got 3
// let result10 = buildName3('bob', 'adams', 'Sr.');

// ---------------- 나머지 매개변수 ----------------
function buildName4(firstName: string, ...resrOfName: string[]) {
  // restOfName = ['samuel', 'lucas', 'peter']
  return firstName + ' ' + resrOfName.join(' ');
}

let employeeName = buildName4('joseph', 'samuel', 'lucas', 'peter'); // "joseph samuel lucas peter"

// ---------------- class 생성 ----------------
// new를 사용해 Person 클래스의 instance 생성
// Person class의 member: name, constructor, say()
// class 안에서 'this.'를 앞에 붙이면 class의 member 의미
class Person1 {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  say() {
    return 'hello my name is ' + this.name;
  }
}

let person1 = new Person1('june');

// ---------------- 접근 제어자 ----------------
// public
class Animal1 {
  public name: string;
  constructor(theName: string) {
    this.name = theName;
  }
}
new Animal1('cat').name;

// ----------------
// private
class Animal2 {
  private name: string;
  constructor(theName: string) {
    this.name = theName;
  }
}
// Error: Property 'name' is private and only accessible within class 'Animal2'
// new Animal2('cat').name;

// ----------------
// 상속
// extends 키워드를 통해 animal3에서 cat, dog으로 파생
// animal의 기능을 확장하기 때문에 cat, dog 역시 move를 가진 인스턴스 생성 가능
class Animal3 {
  move(distanceInMeters: number) {
    console.log(`animal moved ${distanceInMeters}m`);
  }
}

class Dog3 extends Animal3 {
  makeSound() {
    console.log('mung mung');
  }
}

class Cat3 extends Animal3 {
  makeSound() {
    console.log('ya-ong');
  }
}

const dog3 = new Dog3();
dog3.move(10);
dog3.makeSound;

const cat3 = new Cat3();
cat3.move(5);
cat3.makeSound;

// ----------------
// protected
class Person2 {
  protected name: string;
  constructor(name: string) {
    this.name = name;
  }
}

class Employee extends Person2 {
  private department: string;

  constructor(name: string, department: string) {
    super(name);
    this.department = department;
  }

  public getLiftPitch() {
    return `hello my name is ${this.name} and i work in ${this.department}`;
  }
}

let james = new Employee('james', 'potter');
console.log(james.getLiftPitch());
// Error: Property 'name' is protected and only accessible within class 'Person2'
// and its subclasses
// console.log(james.name);

// ---------------- getter/setter ----------------
class Person3 {
  private _name: string;

  get name() {
    return this._name;
  }
  set name(name: string) {
    if (name.length > 10) {
      throw new Error('too long name');
    }
    this._name = name;
  }
}

let person3 = new Person3();

console.log(person3.name); // undefined
person3.name = 'june';
console.log(person3.name); // june
person3.name = 'toolongtobehumanname'; // throw error

// ---------------- readonly ----------------
class Person4 {
  readonly age: number = 20; // 선언 초기화
  constructor(age: number) {
    this.age = age;
  }
}

let person4 = new Person4(10); // 생성자 초기화
// Error: Cannot assign to 'age' because it is a read-only property
// person4.age = 30;

// ---------------- static ----------------
class Grid1 {
  static origin = { x: 0, y: 0 };
  calculateDistanceFromOrigin(point: { x: number; y: number }) {
    let xDist = point.x - Grid1.origin.x;
    let yDist = point.y - Grid1.origin.y;
    return Math.sqrt(xDist * xDist + yDist * yDist) / this.scale;
  }
  constructor(public scale: number) {}
}

let grid1 = new Grid1(1.0); // 1x scale
let grid11 = new Grid1(5.0); // 5x scale

console.log(grid1.calculateDistanceFromOrigin({ x: 10, y: 10 }));
console.log(grid11.calculateDistanceFromOrigin({ x: 10, y: 10 }));

// ---------------- 추상 클래스 ----------------
abstract class Animal4 {
  protected name: String;

  constructor(name: string) {
    this.name = name;
  }

  abstract makeSound(): void;

  move(): void {
    console.log('move ~.~');
  }
}

class Dog4 extends Animal4 {
  constructor(name: string) {
    // 하위 클래스의 생성자는 반드시 super() 호출
    super(name);
  }

  makeSound(): void {
    // 반드시 하위 클래스에서 구현
    console.log(this.name + 'mung mung');
  }
}

// Error: Cannot create an instance of an abstract class
// const animal4 = new Animal4('animal');

const dog4 = new Dog4('jindo');
dog4.makeSound();

// ---------------- 추상 클래스를 활용한 디자인 패턴 ----------------
abstract class Parent1 {
  // 템플릿 메소드: 자식에서 공통적으로 사용하는 부분 (someMethod)
  public do() {
    console.log('hello from parent1 #1');

    this.hook(); // hook method: Child1에서 구현해야 할 부분

    console.log('hello from parent1 #2');
  }

  abstract hook(): void;
}

class Child1 extends Parent1 {
  hook(): void {
    console.log('hi from child1');
  }
}

const child1 = new Child1();
child1.do();

/*
실행 결과
hello from parent #1
he from child1
hello from parent #2
*/

// ---------------- Interface ----------------
function sayName1(obj: { name: string }) {
  console.log(obj.name);
}

let people1 = { name: 'tony' };

sayName1(people1);

// interface 변환
interface People1 {
  name: string;
}

function sayName11(obj: People1) {
  console.log(obj.name);
}

let people11 = { name: 'pepper' };

sayName11(people11);

// ---------------- Optional Properties ----------------
interface SquareConfig1 {
  color1?: string;
  width1?: number;
}

function createSquare1(config: SquareConfig1): {
  color1: string;
  area1: number;
} {
  let newSquare1 = { color1: 'white', area1: 100 };
  if (config.color1) {
    newSquare1.color1 = config.color1;
  }
  if (config.width1) {
    newSquare1.area1 = config.width1 * config.width1;
  }
  return newSquare1;
}

let mySquare1 = createSquare1({ color1: 'black' });

// ---------------- Readonly Properties ----------------
interface Point1 {
  readonly x: number;
  readonly y: number;
}

let point1: Point1 = { x: 10, y: 20 };
// Cannot assign to 'x' because it is a read-only property
// point1.x = 5;

// ---------------- readonly vs const ----------------
let array1: number[] = [1, 2, 3, 4];

let readonly_array: ReadonlyArray<number> = array1;

// readonly_array[0] = 12; // Error
// readonly_array.push(5); // Error
// readonly_array.length = 100; // Error

// ---------------- function type ----------------
interface SearchFunc1 {
  (source: string, substring: string): boolean;
}

// 변수로 직접 함수 값이 할당되었기 때문에 인수 타입 생략 가능
// TS의 문맥상 타이핑 (Contextual typing)이 인수 타입 추론
let mySearch1: SearchFunc1;

mySearch1 = function (src, sub) {
  let result = src.search(sub);
  return result > -1;
};

// Error: Type '(src: string, sub: string) => string' is not assignable to type 'SerarchFunc1'
// Type 'string' is not assignable to type 'boolean'
// mySearch1 = function (src, sub) {
//   let result = src.search(sub);
//   return 'string';
// };

// ---------------- class type ----------------
interface Animal22 {
  makeSound(): void;
}

class Dog22 implements Animal22 {
  makeSound(): void {
    console.log('bowwow');
  }
}

// ---------------- Interface 확장 ----------------
interface Animal11 {
  makeSound(): void;
}

interface Dog11 extends Animal11 {
  speed: number;
}

class Bulldog11 implements Dog11 {
  speed: number;
  makeSound(): void {
    console.log('bowwow');
  }
}

// ---------------- hybrid type ----------------
interface Counter1 {
  (start: number): string;
  interval: number;
  reset(): void;
}

function getCounter1(): Counter1 {
  let counter = function (start: number) {} as Counter1;
  counter.interval = 123;
  counter.reset = function () {};
  return counter;
}

let c1 = getCounter1();
c1(10);
c1.reset();
c1.interval = 5.0;

// ---------------- interface를 활용한 디자인 패턴 (strategy pattern) ----------------
/*
자판기 결제 방법을 현금 결제에서 카드 결제로 변경할 때, pay 메소드 구현 변경 필요
*/
class VendingMachine11 {
  pay() {
    console.log('pay in cash');
  }
}

// strategy pattern 변환
interface PaymentStrategy1 {
  pay(): void;
}

class CardPaymentStrategy1 implements PaymentStrategy1 {
  pay(): void {
    console.log('pay in card');
  }
}

class CashPaymentStrategy1 implements PaymentStrategy1 {
  pay(): void {
    console.log('pay in cash');
  }
}

class VendingMachine1 {
  private paymentStrategy: PaymentStrategy1;

  setPaymentStrategy(paymentStrategy: PaymentStrategy1) {
    this.paymentStrategy = paymentStrategy;
  }

  pay() {
    this.paymentStrategy.pay();
  }
}

const vendingMachine1 = new VendingMachine1();

vendingMachine1.setPaymentStrategy(new CashPaymentStrategy1());
vendingMachine1.pay(); // pay in cash

vendingMachine1.setPaymentStrategy(new CardPaymentStrategy1());
vendingMachine1.pay(); // pay in card

// ---------------- Generic으로 함수 만들기 ----------------
function sort1<T>(items: T[]): T[] {
  return items.sort();
}

const num1: number[] = [1, 2, 3, 4];
const char1: string[] = ['a', 'b', 'c', 'd', 'e'];

sort1<number>(num1);
sort1<string>(char1);

// ---------------- Generic으로 클래스 만들기 ----------------
class Queue1<T> {
  protected data: Array<T> = [];

  push(item: T) {
    this.data.push(item);
  }

  pop(): T | undefined {
    return this.data.shift();
  }
}

const numberQueue1 = new Queue1<number>();

numberQueue1.push(0);
// numberQueue1.push('1'); // 의도하지 않은 실수 사전 검출 가능
numberQueue1.push(+'1'); // 실수를 사전 인지하고 수정 가능

// ---------------- Union ----------------
// union type
const printMessage1 = (message: string | number) => {
  return message;
};

const message1 = printMessage1(1234);
const message11 = printMessage1('helloworld');

// string, number type의 공통된 메소드만 사용 가능
// Error: length does not exist on type string | number
// message1.length;

// generic
const printMessage2 = <T>(message: T) => {
  return message;
};

const message2 = printMessage2<string>('helloworld');
message2.length;

// ---------------- Constraints ----------------
const printMessage3 = <T extends string | number>(message: T): T => {
  return message;
};

printMessage3<string>('1');
printMessage3<number>(1);
// Error: Type 'boolean' does not satisfy the constraint 'string | number'
// printMessage3<boolean>(false);

// ---------------- keyof ----------------
const getProperty3 = <T extends object, U extends keyof T>(obj: T, key: U) => {
  return obj[key];
};

getProperty3({ a: 1, b: 2, c: 3 }, 'a');
// Error: Argument of type 'z' is not assignable to parameter of thpe ''a' | 'b' | 'c''
// getProperty3({{a:1,b:2,c:3},'z'})

// ---------------- factory pattern ----------------
interface Car1 {
  drive(): void;
  park(): void;
}

class Bus1 implements Car1 {
  drive(): void {}
  park(): void {}
}

class Taxi1 implements Car1 {
  drive(): void {}
  park(): void {}
}

class CarFactory1 {
  static getInstance(type: string): Car1 {
    // car의 type이 추가될 때마다 case 문을 추가해야 하는 단점
    switch (type) {
      case 'bus':
        return new Bus1();
      default:
        return new Taxi1();
    }
  }
}

const bus1 = CarFactory1.getInstance('bus');
const taxi1 = CarFactory1.getInstance('taxi');

// generic을 활용한 factory pattern
interface Car2 {
  drive(): void;
  park(): void;
}

class Bus implements Car2 {
  drive(): void {}
  park(): void {}
}

class Taxi implements Car2 {
  drive(): void {}
  park(): void {}
}

class suv implements Car2 {
  drive(): void {}
  park(): void {}
}

export class CarFactory2 {
  static getInstance<T extends Car2>(type: { new (): T }): T {
    return new type();
  }
}

const bus2 = CarFactory2.getInstance(Bus);
const taxi22 = CarFactory2.getInstance(Taxi);
