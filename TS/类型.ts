/**
 * 基础类型 null undefined symbol boolean string number void 
 * 对象类型 {} Class function [] tuple[类型数量都一致] Date 
 */

const count: number = 123;
const str: string = '';


const human: {
  name: string;
  age: number;
} = {
  name: 'lili',
  age: 18
}

const arr: (number | string)[] = [1, '']

class Person { }

const leo: Person = new Person()

const func: (n: number) => number = num => {
  return num
}

const date: Date = new Date;

const rawData = '{"name": "test"}';
const newData: Person = JSON.parse(rawData);

let temp: number | string = 123;
temp = '';

const numArr: (number | string)[] = [1, 2, 3, '']

const objArr: ({ name: string })[] = [{ name: 'test' }]

type userInfo = {
  name: string;
  age?: number;
}

class Teacher {
  name: 'test';
  age: 11;
}

const userArr: userInfo[] = [
  { name: 'test' }, 
  new Teacher
]

const numOrStrTuple: [number, string, boolean] = [1, '', true]
