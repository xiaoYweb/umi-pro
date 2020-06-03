/**
 * interface {} 
 * 定义 对象 函数
 * interface 可以继承 extends
 *  类 应用接口 必须具备/拥有接口的属性
 */

interface Person {
  name: string;
  age?: number;
  readonly hobby: string;
  [key: string]: any; // 不确定是否 还有其他变量 
  say(a: number): void; // 方法定义
  do: () => number // 方法定义
}

interface Girl extends Person { // 继承 接口
  sing(): string;
}

const getPersonName = (person: Person): void => {
  console.log(person.name)
}

const setPersonName = (person: Girl, name: string): void => {
  person.name = name;
}

const person = {
  name: 'test',
  hobby: 'basketball',
  sex: 'male',
  say() { },
  do() {
    return 11
  },
  sing() {return ''}
}

getPersonName(person)
// getPersonName({ name: 'test', hobby: 'basketball', sex: 'male'}) //传递对象字面量 会进行强校验
setPersonName(person, 'lili')

class User implements Person { // 类 应用接口 必须具备/拥有接口的属性
  name = 'name'
  hobby = 'basketball'
  say() { }
  do() { return 11 }
}

interface SayHi {
  (word: string): string // 
}

const sayHi: SayHi = function (a: string) {
  return a;
}
