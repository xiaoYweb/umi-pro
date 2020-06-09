import React from 'react';
import { Select } from 'antd';

const { Option } = Select;
const selectStyle = {
  width: 300,
}

class Demo2 extends React.Component {
  state = {
    data: [],
    value: undefined,
  };

  request = debounce((val, cb) => {
    getList(val).then(list => {
      const result = this.handleList(list)
      cb(result)
    })
  })

  handleSearch = value => {
    if (value) {
      this.request(value, data => this.setState({ data }));
    } else {
      this.setState({ data: [] });
    }
  };

  handleList = list => {
    return list.map(r => {
      return {
        value: r[1],
        text: r[0]
      }
    })
  }

  handleChange = value => {
    this.setState({ value });
  };

  render() {
    const options = this.state.data.map(d => <Option key={d.value}>{d.text}</Option>);
    return (<>
      <Select
        showSearch
        value={this.state.value}
        placeholder="input search text"
        style={selectStyle}
        onSearch={this.handleSearch}
        onChange={this.handleChange}
        defaultActiveFirstOption={false}
        showArrow={false}
        filterOption={false}
        notFoundContent={null}
      >
        {options}
      </Select>
    </>);
  }
}

export default Demo2;

/**
 * 单选 搜索选择 
 * onSearch = { val => void }
 * 
 */
function getList(val) {
  const arr = val === '1'
    ? [
      ['2020夏装新款女', '3558865.749002441'],
      ['2020新款连衣裙夏', '1399085.4063203055'],
      ['2020新款连衣裙时尚', '290354.36804301554'],
      ['2020凉鞋女鞋', '528156.1144706834'],
    ]
    : [
      ['2020新款凉鞋女', '629596.0186649795'],
      ['2020年新款连衣裙', '1115794.1067432384'],
      ['2020新款女鞋', '380491.21815667045'],
      ['2020款女装 爆款', '37100.347004661664'],
      ['2020新款t恤女', '1792317.4753258845'],
      ['2020夏季新款套装', '937694.7072775901']
    ];
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(arr)
    }, 300);
  })
}

function debounce(fn, wait = 300) {
  let timer = null;
  return function func(...args) {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args)
    }, wait);
  }
}
