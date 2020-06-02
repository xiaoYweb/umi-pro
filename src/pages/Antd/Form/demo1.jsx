import React from 'react';
import { Form, Input, Button, Checkbox } from 'antd';

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 10 },
};
const tailLayout = {
  wrapperCol: { offset: 5, span: 10 },
};

const selectStyle = {
  width: 120,
  marginRight: 10
}

class Demo extends React.Component {
  state = {}

  onFinish = values => {
    console.log('Success:', values);
  }

  onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  }

  handleSubmit = () => {

  }

  render() {
    return (
      <Form {...layout}>
        <Form.Item label="Username" name="username"
          rules={[{ required: true, message: 'Please input your username!' }]} >
          <Input />
        </Form.Item>

        <Form.Item label="Password" name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item {...tailLayout} name="remember">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" onClick={this.handleSubmit}>
            Submit
        </Button>
        </Form.Item>
      </Form>);
  }
}

export default Demo;

/**
 * form
 */
