import React from 'react';
import { Select } from 'antd';

const { Option } = Select;
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
      <Select
        mode="multiple"
        style={selectStyle}
        placeholder="Please select"
        defaultValue={['a10', 'c12']}
        onChange={handleChange}
      >
        {children}
      </Select>
    </>);
  }
}

export default Demo2;

/**
 * 多选 
 * mode="multiple"
 * defaultValue = []
 * onChange = { (valArr) => void }
 */
