import React from 'react';
import { Select } from 'antd';

const { Option } = Select;
const selectStyle = {
  width: 300,
}


function handleChange(val) {
  console.log(`selected ${val}`, val);
}

class Demo2 extends React.Component {
  state = {}

  render() {
    return (<>
      <Select
        mode="multiple"
        style={selectStyle}
        placeholder="select one country"
        defaultValue={['china']}
        onChange={handleChange}
        optionLabelProp="label"
      >
        <Option value="china" label="China">
          <div className="demo-option-label-item">
            <span role="img" aria-label="China">
              🇨🇳
        </span>
        China (中国)
      </div>
        </Option>
        <Option value="usa" label="USA">
          <div className="demo-option-label-item">
            <span role="img" aria-label="USA">
              🇺🇸
        </span>
        USA (美国)
      </div>
        </Option>
        <Option value="japan" label="Japan">
          <div className="demo-option-label-item">
            <span role="img" aria-label="Japan">
              🇯🇵
        </span>
        Japan (日本)
      </div>
        </Option>
        <Option value="korea" label="Korea">
          <div className="demo-option-label-item">
            <span role="img" aria-label="Korea">
              🇰🇷
        </span>
        Korea (韩国)
      </div>
        </Option>
      </Select>
    </>);
  }
}

export default Demo2;

/**
 * 多选 option 定制内容
 * 
 */
