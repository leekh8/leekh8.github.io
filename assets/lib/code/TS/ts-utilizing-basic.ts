// ---------------- enum 사용하기 ----------------
/*
특정 값(상수)들의 집합
코드가 단순해지며, 가독성 좋음
인스턴스 생성과 상속 방지해 상수값의 타입안정성 보장
*/
/* Car enum을 이용해 taxi 변수에 알맞은 값 할당 */
// enum 선언
enum Car {
  BUS = "bus",
  TAXI = "taxi",
  SUV = "suv"
}

// enum Car를 이용해서 taxi값을 할당해주세요.
const taxi: Car = Car.TAXI;
console.log(taxi); // TAXI 출력

// ---------------- Partial 사용하기 ----------------
/*
프로퍼티를 선택적으로 만드는 타입인 Partial을 이용해
updateTodo 메소드의 매개변수 obj 타입 Todo에
Partial Utility type을 추가
*/
interface Todo {
  title: string;
  description: string;
}

// obj매개변수 타입에 Partial Utility types을 추가해주세요
function updateTodo(obj: Partial<Todo>) {
  return obj;
}

const result1 = updateTodo({
  title: "title"
});

console.log(result1); // { title: 'title' } 출력

// ---------------- Omit 사용하기 ----------------
/*
모든 프로퍼티를 선택한 뒤 K를 제거하는 타입인 Omit을 이용해
TodoPreview 메소드에 할당된 Todo 인터페이스에
Omit Utility type을 이용해 description 프로퍼티 제외
*/
interface Todoc1 {
  title: string;
  description: string;
  completed: boolean;
}

// Omit을 이용해 description 프로퍼티를 제외해봅니다.
type TodoPreviewc1 = Omit<Todoc1, "description">;

const todoc1: TodoPreviewc1 = {
  title: "Clean room",
  completed: false
};

// ---------------- Pick 사용하기 ----------------
/*
프로퍼티 K의 집합을 선택하는 타입인 Pick을 이용해
TodoPreview 메소드에 할당된 Todo 인터페이스에
Pick Utility type을 이용해 title 프로퍼티 포함
*/
interface Todoc2 {
  title: string;
  description: string;
  completed: boolean;
}

// Pick을 이용해 title 프로퍼티를 포함해봅니다..
type TodoPreviewc2 = Pick<Todo, "title">;

const todoc2: TodoPreviewc2 = {
  title: "Clean room"
};

// ---------------- default parameter 사용하기 ----------------
/*
값을 제공하지 않거나, undefined로 설정한 매개변수의 값에
기본값 할당하는 default parameter를 이용해
say 메소드의 매개변수 lastword를 수정해 '타입스트립트'가 출력되도록
*/
// lastWord를 Default Parameter 형식으로 수정해주세요.
function say(firstWord: string, lastWord = "타입스크립트") {
  return firstWord + " " + lastWord;
}

console.log(say("엘리스")); // "엘리스 타입스크립트" 출력

// ---------------- rest parameter 사용하기 ----------------
/*
생략부호 (...) 뒤의 이름으로 전달된 인자 배열을 빌드해
함수에서 사용이 가능한 rest parameter를 이용해
makeWord 메소드의 매개변수 restOfChar를 수정해 '타입스트립트'가 출력되도록
*/
// restOfChar를 rest parameters형식으로 수정해주세요
function makeWord(firstChar: string, ...restOfChar: string[]) {
  return firstChar + restOfChar.join("");
}

let word = makeWord("타", "입", "스", "크", "립", "트");

console.log(word); // 타입스크립트 출력

// ---------------- class 사용하기 ----------------
/*
객체를 정의하는 틀, 설계도와 같은 class를 사용해
my name is + name을 호출하는 say() 함수 구현
new 사용해 Person의 instance 생성
person.say()를 호출해 'my name is harry' 콘솔 창에 출력
*/
class Person {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  // "my name is" + this.name을 출력하는 say() 함수를 완성하세요.
  say() {
    console.log("my name is " + this.name);
    return "my name is " + this.name;
  }
}

// Person 클래스의 인스턴스를 생성하여 "my name is harry"가 출력되도록
// say() 함수를 호출하세요.
let person = new Person("harry");
person.say();

// ---------------- 추상 클래스 사용하기 ----------------
/*
다른 클래스들이 파생될 수 있는 기초 클래스로 직접 인스턴스화 하는 것이 불가능한
추상 클래스를 abstract 키워드를 통해 사용하고,
abstract 키워드를 추상 클래스 내에서 추상 메소드를 정의하는데 사용해보자
Dog 클래스를 생성해 추상 메소드 makeSound를 구현하고
dog.makeSound()를 구현 호출해 'jindo bow wow'를 출력
jindo 값은 Animal 클래스 name 필드에 할당해 호출
*/
abstract class Animal {
  protected name: string;

  constructor(name: string) {
    this.name = name;
  }

  abstract makeSounds(): void;
}

class Dog extends Animal {
  // constructor를 구현해주세요
  // 추상메소드 makeSound()를 Dog 클래스 내부에서 구현해주세요
  // makeSound() 메소드에 console.log를 구현해주세요.
  makeSounds(): void {
    console.log(`${this.name} 멍멍!!`);
  }
}

// 클래스 name필드에 값 "jindo"를 할당해주세요
const dog = new Dog("jindo");
dog.makeSounds(); // jindo 멍멍!!

// ---------------- Interface란? ----------------
/*
developer 변수에 Persons 인터페이스 타입을 지정했습니다.
sayMyJob을 호출하면 개발자가 콘솔화면에 나올 수 있도록 작성
*/
interface Persons {
  job: string;
}

function sayMyJob(obj: Persons) {
  console.log(obj.job);
}

// developer 변수에 interface Persons 타입이 선언이 되어있습니다.
// 오류가 발생하지 않게, developer 변수에 프로퍼티값을 선언해주세요
const developer: Persons = { job: "개발자" };

sayMyJob(developer); // 개발자

// ---------------- Interface 확장 ----------------
/*
BullDog class에 Dog interface를 implements했습니다
Dog interface에 Animal interface를 확장해서 makeSound(), run() 메소드를 구현
*/
interface Animals {
  makeSound(): void;
}

// Dog 인터페이스에 Animal 인터페이스를 확장하세요.
interface Dogs extends Animals {
  run(): void;
}

// BullDog class는 Dog interface를 implements했기 때문에,
// interface가 가지고 있는 함수를 class에서 구현시켜야합니다.
class BullDogs implements Dogs {
  makeSound(): void {
    console.log("멍멍");
  }
  run(): void {
    console.log("달리기");
  }
}

const bullDogs = new BullDogs();
bullDogs.makeSound(); // 멍멍 출력
bullDogs.run(); // 달리기 출력

// ---------------- Interface types (class) ----------------
/*
Interface는 클래스가 특정 통신 프로토콜을 충족시키도록
명시적으로 강제할 수 있습니다.

C#과 Java와 같은 언어에서 인터페이스를 사용하는
가장 일반적인 방법 동일합니다.
*/
/*
Dog 클래스에 Animal인터페이스를 implements합니다.
makeSound를 호출해서 멍멍이 콘솔 화면에 나올 수 있도록 작성
*/
/*
interface Animal {
  makeSound(): void;
}
*/
// Dog class에 Animal interface를 implements합니다.
// 따라서 interface가 가지고 있는 함수를 class에서 구현해야 합니다.
class Doggy implements Animals {
  // makeSound() 함수를 구현해주세요.
  // 함수 호출 시, "멍멍" 콘솔이 나타날수 있게 cosole.log()를 구현해주세요
  makeSound(): void {
    console.log("멍멍");
  }
}

const doggy = new Doggy();
doggy.makeSound(); // 멍멍 출력

// ---------------- Optional Properties ----------------
/*
optional properties는 인터페이스 프로퍼티를 선택적 속성으로 만들때 사용
optional properties는 ? 키워드를 붙여서 사용
*/
/*
Config 인터페이스에 width 프로퍼티를 optional 프로퍼티로 변경하여 코드가 정상 동작되게 수정
*/
// width 프로퍼티를 optional로 변경해주세요.
interface Config {
  color: string;
  width?: number;
}

function createSquare(config: Config): { color: string; area: number } {
  return {
    color: config.color,
    area: 100 * (config.width ? config.width : 1) // width 프로퍼티를 선택적 속성으로 사용합니다.
  };
}

const config = {
  color: "red"
};

createSquare(config);

// ---------------- 전략 패턴 (Strategy pattern) ----------------
/*
전략 패턴은 객체가 할 수 있는 행위들 각각을 전략으로 만들어 놓고,
동적으로 행위의 수정이 필요한 경우 전략을 바꾸는 것만으로 행위의 수정이 가능하도록 만든 패턴
*/
/*
CardPaymentStrategy 와CashPaymentStrategy를 PaymentStrategy implements 시켜서 클래스를 구현
vendingMachine.pay()를 호출 했을 때, cash pay, card pay가 각각 콘솔화면에 나올 수 있도록 구현
*/
interface PaymentStrategy {
  pay(): void;
}

// PaymentStrategy를 상속받는 두 개의 클래스를 구현해주세요.
// 각 클래스의 `pay()` 메소드를 호출했을 때 cash pay, card pay가 출력되어야 합니다.
class CardPaymentStrategy implements PaymentStrategy {
  pay() {
    console.log("card pay");
  }
}

class CashPaymentStrategy implements PaymentStrategy {
  pay() {
    console.log("cash pay");
  }
}

class VendingMachine {
  private paymentStrategy: PaymentStrategy;

  setPaymentStrategy(paymentStrategy: PaymentStrategy) {
    this.paymentStrategy = paymentStrategy;
  }

  pay() {
    this.paymentStrategy.pay();
  }
}

const vendingMachine = new VendingMachine();

vendingMachine.setPaymentStrategy(new CashPaymentStrategy());
vendingMachine.pay(); // cash pay

vendingMachine.setPaymentStrategy(new CardPaymentStrategy());
vendingMachine.pay(); // card pay

// ---------------- Generic ----------------
/*
Generic은 코드를 작성할 때가 아니라 코드가 수행될 때 타입을 명시할 때 사용
*/
/*
Queue 클래스를 Generic을 활용하여 push와 pop 메소드를 구현
*/
class Queues<T> {
  private data: Array<T> = [];
  // 제네릭을 활용하여 push()와 pop() 메소드를 구현해주세요.
  push(item: T) {
    this.data.push(item);
  }

  pop(): T | undefined {
    return this.data.shift();
  }
}

const numberQueues = new Queues<number>();

numberQueues.push(0);
console.log(numberQueues.pop());

// ---------------- Union type ----------------
/*
Union type은 키워드 |를 통해 둘 이상의 타입을 선언하는 방식
*/
/*
printMessage 메소드의 매개변수를 수정하여
printMessage(1234)와 printMessage("hello") 호출이 정상 동작이 가능하게 수정
*/
// string과 number 두 타입이 허용될수 있게 union type을 선언해주세요
const printMessage = (message: string | number) => {
  console.log(message);
};

printMessage(1234);
printMessage("hello");

// ---------------- Constraints ----------------
/*
제네릭 제약조건은 존재하지 않는 속성에 접근하는 것을 막기 위해 사용

키워드는 extends이며 특정 타입들로만 동작하는 제네릭 함수를 만들고 싶을 때 사용
*/
/*
printMessage 메소드의 제네릭 타입의 제약조건을 수정하여printMessage<boolean>(true) 이 정상 동작하게 수정
*/
// 제네릭 매개변수 타입이 boolean이 허용되게 수정해주세요.
const printMessages = <T extends string | number | boolean>(
  message: T
): void => {
  console.log(message);
};

printMessages<boolean>(true);

// ---------------- Factory pattern with Generic ----------------
/*
factory pattern이란 객체를 생성하는 인터페이스는 미리 정의하되, 인스턴스를 만들 클래스의 결정은 서브 클래스에서 진행하는 패턴
*/
/*
Car 클래스를 implements 하는 Bus 클래스를 생성
drive() 함수는 따로 구현하지 않아도 됩니다.
park() 함수에서는 버스 주차를 출력
Car 클래스를 implements 하는 Taxi 클래스를 생성
drive() 함수는 따로 구현하지 않아도 됩니다.
park() 함수에서는 택시 주차를 출력
CarFactory 클래스의 getInstance메소드를 이용해서 new 키워드를 사용하지 않고 Bus, Taxi 인스턴스를 생성
*/
interface Cars {
  drive(): void;
  park(): void;
}

// Bus 클래스와 Taxi 클래스를 생성하세요.
class Bus implements Cars {
  drive(): void {}
  park(): void {
    console.log("버스 주차");
  }
}

class Taxi implements Cars {
  drive(): void {}
  park(): void {
    console.log("택시 주차");
  }
}

// Factory pattern을 적용하기 위한 서브 클래스입니다.
class CarFactory {
  static getInstance<T extends Cars>(type: { new (): T }): T {
    return new type();
  }
}

// CarFactory 클래스의 getInstance메소드를 이용해서 Bus, Taxi 인스턴스를 생성해주세요.
const bus = CarFactory.getInstance(Bus);
const taxies = CarFactory.getInstance(Taxi);

bus.park();
taxies.park();
