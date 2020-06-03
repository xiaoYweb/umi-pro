/**
 * 类的属性 方位类型 
 * private protected public
 * private 仅 允许在 类 内部使用
 * protected 仅 允许在 类及子类 内部使用
 * public 类 子类 实例 静态方法 均可以被调用
 * readonly
 * static 
 * constructor 
 */

class Test {
  public name = Test;
  private sayHi() {

  }
  private static age = 22;
  getAge() {
    this.sayHi()
    console.log(Test.age)
  }
  protected sayHello() {

  }
}

class TestChild extends Test {
  getHello() {
    this.sayHello()
  }
}
const test = new Test()
console.log(test.name)
// console.log(test.sayHi) // private 只允许类内部调用 
// console.log(Test.age) // private 只允许类内部调用 

class ConstructorDemo {
  // public name: string;
  // constructor(name: string) {
  //   this.name = name;
  // }
  constructor(public name: string) { } // 简化写法

  protected sayHi() {

  }
}

const constructorDemo = new ConstructorDemo('sss')

class ConstructorDemoChild extends ConstructorDemo {
  constructor(private age: number) {
    super('xxx') // -- > 父类 ConstructorDemo 子类必须调用 super 不然报错
  }
  sayHello() {
    super.sayHi() // -- > 父类原型方法 ConstructorDemo.prototype
  }
}

const constructorDemoChild = new ConstructorDemoChild(111)
constructorDemoChild.sayHello()
