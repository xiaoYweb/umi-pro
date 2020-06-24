import React from 'react';
import { InputNumber, Form, Button } from 'antd';

function onChange() {
}
const FormItem = Form.Item;
const inputStyle = {
  width: 200,
  marginRight: 10
}

@Form.create()

class Demo extends React.Component {
  state = {}

  handleFormat = num => {
    if (num === 0) return `${num} 值不允许为 0`
    return num;
  }

  handleParse = val => {
    const re = /[0-9]/g
    return val.replace(re, '')
  }

  handleSubmit = () => {
    // const res = this.props.form.getFieldsValue()
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (<Form>
      <InputNumber
        style={inputStyle}
        defaultValue={1000}
        formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        parser={value => value.replace(/\$\s?|(,*)/g, '')}
        onChange={onChange}
      />
      <InputNumber
        defaultValue={100}
        min={0}
        max={100}
        formatter={value => `${value}%`}
        parser={value => value.replace('%', '')}
        onChange={onChange}
      />
      <FormItem>{
        getFieldDecorator('test', {
          initialValue: 3
        })(
          <InputNumber
            style={inputStyle}
            formatter={this.handleFormat}
            parser={this.handleParse}
            onChange={onChange}
          />
        )
      }</FormItem>
      <Button onClick={this.handleSubmit}>button</Button>
      </Form>
    );
  }
}

export default Demo;

/**
 * 多选
 * mode="multiple"
 * defaultValue = []
 * onChange = { (valArr) => void }
 */
