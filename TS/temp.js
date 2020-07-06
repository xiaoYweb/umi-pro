/**
 * 
 */

const arr = [0, 23, 1, 4, 12, 5, 22, 17, 77, 2, 3]
const arr1 = [1, 6]

function bubbleSort(arr) { // 冒泡 排序
  const newArr = [...arr]
  const len = newArr.length;
  for (let i = 0; i < len - 1; i++) {
    for (let j = 0; j < len - 1 - i; j++) {
      if (newArr[j] > newArr[j + 1]) {
        [newArr[j], newArr[j + 1]] = [newArr[j + 1], newArr[j]]
      }
    }
  }
  return newArr;
}

function selectionSrot(arr) { // 选择 排序
  const newArr = [...arr]
  const len = newArr.length;
  for (let i = 0; i < len - 1; i++) {
    let minIndex = i, temp = newArr[i];
    for (let j = i + 1; j < len; j++) {
      const item = newArr[j];
      if (item < temp) {
        minIndex = j;
        temp = item;
      }
    }
    newArr[minIndex] = newArr[i] // 最小的索引放 当前值
    newArr[i] = temp; // 当前索引 放最小值
  }
  return newArr;
}

/**
 * 从 第二项开始 选取每一项 跟前面项 比较 比前一项大则停止并插入当前向 
 * 反之则继续向前比较 以此类推 直到第一项
 * @param {} arr 
 */
function insertSort(arr) { // 插入 排序
  const newArr = [...arr]
  const len = newArr.length;
  for (let i = 1; i < len; i++) { // 控制 比较次数 && 锁定当前选择 哪一项比较
    let temp = newArr[i], index = i;
    for (let j = i - 1; j < 0; j--) {
      if (temp < newArr[j]) {
        index = j
      }
    }
    newArr.splice(index, 1, temp)
  }
  return newArr;
}