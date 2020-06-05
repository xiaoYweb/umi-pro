import React from 'react';
import { Select, Form, Button } from 'antd';

const { Option } = Select;

const selectStyle = {
  width: 120,
  marginRight: 10
}

@Form.create()
class Demo1 extends React.Component {
  state = {}

  handleChange = val => {
    console.log('val', val)
  }

  handleClick = () => {
    const res = this.props.form.getFieldsValue()
    console.log("Demo1 -> handleClick -> res", res)
  }

  render() {
    return (<>
      <Select defaultValue="lucy" style={selectStyle} onChange={this.handleChange}>
        <Option value="jack">Jack</Option>
        <Option value="lucy">Lucy</Option>
        <Option value="disabled" disabled>
          Disabled
      </Option>
        <Option value="Yiminghe">yiminghe</Option>
      </Select>
      <Select defaultValue="lucy" style={selectStyle} disabled>
        <Option value="lucy">Lucy</Option>
      </Select>
      <Select defaultValue="lucy" style={selectStyle} loading>
        <Option value="lucy">Lucy</Option>
      </Select>
      <Select defaultValue="lucy" style={selectStyle} allowClear>
        <Option value="lucy">Lucy</Option>
      </Select>
      <Form>
        <Form.Item>
          {
           this.props.form.getFieldDecorator('test')(
            <Select>
            <Option value="jack-val">Jack</Option>
            <Option value="lucy-val">Lucy</Option>
          </Select>
           ) 
          }
        </Form.Item>
      </Form>
      <Button onClick={this.handleClick}>button</Button>
    </>);
  }
}

export default Demo1;

/**
 * 单选
 * --> Select
 * defaultValue="xxx"
 * onChange = { val => void }
 * disabled
 * loading
 * allowClear
 * --> Option
 * value
 * disabled
 */
