import React from 'react';
import { Form, DatePicker, Button } from 'antd';
import moment from 'moment';

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const FormIten = Form.Item;
const dateFormat = 'YYYY-MM-DD';

function onChange(date, dateString) {
  console.log(date, dateString);
}

@Form.create()
class Demo extends React.Component {
  state = {}

  componentDidMount() {
    console.log(moment().subtract('days', 6))
  }

  handleClick = () => {
    const { form: { getFieldsValue } } = this.props;
    let res = window.m = getFieldsValue()
    const m = moment(new Date())
    console.log(moment('2020-5-5', dateFormat), '----', m.format(dateFormat))
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form>
        <Button onClick={this.handleClick}>
          Button
        </Button>
        <FormIten>
          {getFieldDecorator('date', {
            initialValue: moment(new Date(1591238107875), dateFormat)
          })(
            <DatePicker onChange={onChange} />
          )}
        </FormIten>

        <br />
        <MonthPicker onChange={onChange} placeholder="Select month" />
        <br />
        <RangePicker onChange={onChange} />
        <br />
        <WeekPicker onChange={onChange} placeholder="Select week" />
      </Form>);
  }
}

export default Demo;

/**
 * form
 */
