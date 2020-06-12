import React from 'react';
import { Form, DatePicker, Button } from 'antd';
import moment from 'moment';

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const FormItem = Form.Item;
const dateFormat = 'YYYY-MM-DD';
const lastWeek = [moment().subtract('days', 7), moment()];


function onChange(date, dateString) {
  console.log(date, dateString);
}

function disabledDate(startDate) {
  if (!startDate) return false
  const timestamp = Date.now();
  const startTimestamp = startDate.valueOf();
  return startTimestamp > timestamp;
}

function dateValidator(rule, value, callback) {
  const weekTimestamp = 7 * 24 * 3600 * 1000;
  if (value[1].valueOf() - value[0].valueOf() > weekTimestamp) {
    callback('查询时间跨度最大为7天')
    return
  }
  callback()
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
        <FormItem>
          {getFieldDecorator('date', {
            initialValue: moment(new Date(1591238107875), dateFormat)
          })(
            <DatePicker onChange={onChange} />
          )}
        </FormItem>

        <br />
        <MonthPicker onChange={onChange} placeholder="Select month" />
        <br />
        <FormItem>
          {
            getFieldDecorator('daterange', {
              rules: [
                { validator: dateValidator }
              ]
            })(
              <RangePicker
                disabledDate={disabledDate}
                ranges={{
                  '过去一周': lastWeek,
                }}
                showTime
                format="YYYY/MM/DD HH:mm"
              />
            )
          }
        </FormItem>
        <br />
        <WeekPicker onChange={onChange} placeholder="Select week" />
      </Form>);
  }
}

export default Demo;

/**
 * form
 */
