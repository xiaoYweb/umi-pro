/**
 * type annotation 类型注解
 * type inference 类型推断
 * 
 * if ts 自动肥西变量类型 nothing to do
 * else 需要类型注解
 * 
 * ts 使用原则 竟可能让所有变量都有类型
 */

let num: number; // type annotation
num = 11;

let n = 12; // type inference

let total = num + n; // type annotation

function sum(a: number, b: number) { // 函数参数 需要进行 type annotation 调用 传参 无法确定
  return a + b
}

const sumCount = sum(num, n)

const obj = {
  name: 'xx',
  age: 11
}
