import React, { Component } from 'react';
import { Row, Col } from 'antd';
import classnames from 'classnames';
import styles from './test.less';

class Test extends Component {
  state = {
    list: [],
    hourList: [],
    index: -1,
  }

  componentDidMount() {
    const list = [
      { id: 1, startTime: 34258, endTime: 52258, planTime: { start: '', end: '' } },
      { id: 2, startTime: 36058, endTime: 55858, planTime: { start: '', end: '' } },
      { id: 3, startTime: 30658, endTime: 63058, planTime: { start: '', end: '' } },
    ]
    this.calcList(list)
  }

  calcList = list => {
    let start = 24 * 3600; // 列表 起始最早时间 second
    let end = 0; // 列表 截止最早时间 second
    const fixedList = list.map(item => { // 修复100秒偏差
      let { startTime, endTime } = item;
      startTime = Math.floor(startTime / 100) * 100; // 修复100秒偏差
      endTime = Math.floor(endTime / 100) * 100; // 修复100秒偏差
      start > startTime && (start = startTime) // 计算最早开始时间 
      endTime > end && (end = endTime) // 计算最晚结束时间 
      return { ...item, startTime, endTime };
    })

    const total = end - start; //
    this.calcHousrList(start, end)

    const newList = fixedList.map(item => { // 计算 不可用时间
      const { startTime, endTime } = item;
      const uselessArr = [];
      if (startTime > start) {
        const widthPercent = this.calcPecent(startTime - start, total)
        uselessArr.push({
          left: 0, width: `${widthPercent}%`
        })
      }
      if (endTime < end) {
        const widthPercent = this.calcPecent(end - endTime, total)
        const leftPercent = this.calcPecent(endTime - start, total)
        uselessArr.push({
          left: `${leftPercent}%`, width: `${widthPercent}%`
        })
      }
      return { ...item, uselessArr };
    })

    this.setState({ list: newList })
  }

  calcHousrList = (start, end) => { // 计算 时间段列表(时间段列表)
    const startHour = Math.floor(start / 1800)
    const endHour = Math.ceil(end / 1800)
    const hourList = [];
    let num = startHour;
    while (num <= endHour) {
      const text = this.calcHour(num)
      hourList.push({ text })
      num += 2;
    }
    if ((startHour - endHour) % 2 !== 0) { // 起始时间 结束时间 时间间隔 无法被 1h 整除 
      hourList.push({
        text: this.calcHour(endHour),
        sepcial: true
      })
    }
    const calcList = []
    for (let i = 0; i < hourList.length - 1; i++) {
      calcList[i] = ({
        id: i,
        sepcial: hourList[i + 1].sepcial,
        prev: hourList[i].text,
        next: hourList[i + 1].text,
      })
    }
    this.setState({ hourList: calcList })
  }

  calcHour = num => {
    const hour = Math.floor(num / 2)
    const min = num % 2 === 0 ? '00' : '30'
    return `${hour}:${min}`;
  }

  calcPecent = (n, total) => {
    return Math.round(n / total * 100);
  }

  handleClick = index => {
    this.setState({ index })
  }

  render() {
    const { hourList, index, list } = this.state;

    return (<div>
      <Row className={styles['title-row']}>
        <Col span={2}>
          月台编号
        </Col>
        <Col span={2}>
          已排程数
        </Col>
        <Col span={20}>
          <ul className={styles['title-ul']}>
            {
              hourList.map((item, i) => (
                <li key={item.id} className={classnames({ [styles['special']]: item.sepcial })}>
                  <span>{item.prev}</span>
                  {
                    i === hourList.length - 1
                      ? <span>{item.next}</span>
                      : null
                  }
                </li>
              ))
            }
          </ul>
        </Col>
      </Row>

      {
        list.map(({ id, uselessArr, usedArr }, i) => <Row
          className={classnames({ [styles['row-line']]: true, [styles['row-line-focus']]: index === i })}
          key={id}
          onClick={() => this.handleClick(i)}
        >
          <Col span={2} className={styles['col-line']}>
            1
          </Col>

          <Col span={2} className={styles['col-line']}>
            1
          </Col>

          <Col span={20}>
            <ul className={styles['used-line']}>
              {
                usedArr && usedArr.map(({ left, width }) => {
                  return <li style={{ left, width }}>1</li>
                })
              }
            </ul>

            <ul className={styles['useless-line']}>
              {
                uselessArr && uselessArr.map(({ left, width }) => {
                  return <li style={{ left, width }}>1</li>
                })
              }
            </ul>
          </Col>

        </Row>)
      }
    </div>);
  }
}

export default Test;
