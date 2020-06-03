/**
 * get set 
 * 
 * 单例模式
 */

class Demo {
  constructor(private name: string) { }
  get getName() {
    return `your name is ${this.name}`;
  }
  set setName(name: string) {
    this.name = name;
  }
}

const demo = new Demo('demo');
console.log(demo.getName)
demo.setName = 'xxxxx';
console.log(demo.getName)
// demo.name // 无法方位私有属性

class Single {
  private static instance: Single;
  private constructor() { }
  static create() {
    if (!Single.instance) {
      Single.instance = new Single;
    }
    return Single.instance;
  }
}

const instance = Single.create()
console.log(instance === Single.create()) // true
