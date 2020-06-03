/**
 * 抽象类 
 */
class Persontest {
  constructor(private name: string) { }

}

abstract class Animal {
  abstract asy(): void; // 方法不能定义 指定 继承的子类 必须实现这个方法
  walk: string;
}

class Bird extends Animal {
  asy() {

  }
}

class Dog extends Animal {
  asy() {

  }
}

// interface 接口 本质 也可以 吧公共部分抽离定义 

interface HumanCommon {
  name: string;
}

const classmate = {
  name: 'classmate',
  learningAge: 11
}
const doctor = {
  name: 'doctor',
  age: 28
}

const getUserName = (user: HumanCommon) => {
  console.log(user.name)
}

getUserName(classmate)
getUserName(doctor)