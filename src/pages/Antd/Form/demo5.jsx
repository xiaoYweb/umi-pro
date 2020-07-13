import React from 'react';
import { Form, DatePicker, Row, Col, Button } from 'antd';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const monthStamp = 31 * 24 * 3600 * 1000;

@Form.create()

class Demo5 extends React.PureComponent {
  hadnleExport = () => {
    const { form: { validateFields } } = this.props;
    validateFields((err, values) => {
      if (err) return
      console.log('values', values)
    })
  }

  dateValidator = (rule, value, callback) => {
    if (!value) {
      callback('必填项')
      return
    }
    if (value && value[1].valueOf() - value[0].valueOf() > monthStamp) {
      callback('查询时间跨度最大为31天')
      return
    }
    callback()
  }


  render() {
    const { form: { getFieldDecorator } } = this.props
    return (
      <Form>
        <Row>
          <Col span={20}>
            <Row>
              <Col>
                <FormItem label="操作时间" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                  {getFieldDecorator('dateRange', {
                    rules: [
                      { message: '', required: true },
                      { validator: this.dateValidator },
                    ],
                  })(
                    <RangePicker
                      style={{ width: 400 }}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>

          </Col>
          <Col span={4}>
            <Button onClick={this.hadnleExport}>export</Button>
          </Col>
        </Row>
      </Form>);
  }
}

export default Demo5;

/**
 *  校验规则 数组顺序校验 
 *  自定义 校验规则 需要考虑没有选填值得情况 value === undefined 若这种情况没有考虑 函数内部报错 则 会造成校验 功能失效且没反应 
 *  if (value === undefined) return callback() 表示 没有值得时候 这条校验规则通过
 *  显示是的错误文字 也是按照rules 数组 列表顺序显示
 * rules: [
    { message: '必填项', required: true },
    { validator: this.dateValidator },
  ],
 */
