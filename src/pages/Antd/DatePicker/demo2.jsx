import React from 'react';
import { Form, DatePicker, Button } from 'antd';
import moment from 'moment';

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const FormIten = Form.Item;
const dateFormat = 'YYYY-MM-DD';

function onChange(
  // date, dateString
  ) {
  // console.log(date.format(dateFormat), dateString);
}

@Form.create()
class Demo extends React.Component {
  state = {}

  componentDidMount() {

  }

  handleClick = () => {
    // const { form: { getFieldsValue } } = this.props;
    // let res = window.m = getFieldsValue()
    // console.log(moment('2020-5-5', dateFormat), '----')
  }

  disabledDate = startDate => {
    const timestamp = Date.now();
    const startTimestamp = startDate.valueOf();
    return startTimestamp > timestamp;
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
            <DatePicker
              disabledDate={this.disabledDate}
              onChange={onChange}
            />
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
