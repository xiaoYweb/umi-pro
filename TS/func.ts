/**
 * 定义函数
 */

function hello(a: number, b: number) {
  return a + b
}

const hello2 = (a: string, b: string) => {
  return a + b
}

const hello3: (a: number, b: string) => string = (a, b) => {
  return a + b
}

function sayHello(): void { //不该有返回值 返回值为 空 null undefined 
  // return undefined
  // return 
  // return null
}

function sayNever(): never { // 函数不能执行到最后 
  while (true) {

  }
}

function calcCount({ a, b }: { a: number, b: number }) {
  return a + b
}
const result = calcCount({ a: 1, b: 2 })
