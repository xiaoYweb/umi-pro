/**
 * class
 * 子类 super 在原型方法(Child.prototype)中 指向 父类的原型 Parent.prototype
 * super 在静态方法 或 constructor 中 指向父类函数 (Parent) 本身
 * 
 */

class Human {
  
  name = 'xxx';
  getName() {
    return this.name;
  }
}

class Boy extends Human {
  getBoyName() {
    return 'xyxyxy'
  }
  getName() { // 重写父类方法
    return 'yyyy'
    return super.getName() // 调用父类 原型上(Human.prototype)的方法
  }
}

const man = new Human;
const boy = new Boy;

console.log(man.getName())
console.log(boy.getBoyName())



