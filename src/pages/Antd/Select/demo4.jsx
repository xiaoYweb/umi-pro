import React from 'react';
import { Select } from 'antd';

const { Option, OptGroup } = Select;
const selectStyle = {
  width: 300,
}

const children = [];
for (let i = 10; i < 36; i++) {
  children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}

function handleChange(valArr) {
  console.log(`selected ${valArr}`, valArr);
}

class Demo2 extends React.Component {
  state = {}

  render() {
    return (<>
      <Select defaultValue="lucy" style={selectStyle} onChange={handleChange}>
        <OptGroup label="Manager">
          <Option value="jack">Jack</Option>
          <Option value="lucy">Lucy</Option>
        </OptGroup>
        <OptGroup label="Engineer">
          <Option value="Yiminghe">yiminghe</Option>
        </OptGroup>
      </Select>
    </>);
  }
}

export default Demo2;

/**
 * 单选 分组 --- 样式上分组操作 本质是单选
 * OptGroup
 */
