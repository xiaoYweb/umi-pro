import React from 'react';
import moment from 'moment';
import { DatePicker, Form, Button } from 'antd';

const { MonthPicker, RangePicker } = DatePicker;

function range(start, end) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}

function disabledDateTime() {
  return {
    disabledHours: () => range(0, 24).splice(4, 20),
    disabledMinutes: () => range(30, 60),
    disabledSeconds: () => [55, 56],
  };
}

function disabledRangeTime(_, type) {
  if (type === 'start') {
    return {
      disabledHours: () => range(0, 60).splice(4, 20),
      disabledMinutes: () => range(30, 60),
      disabledSeconds: () => [55, 56],
    };
  }
  return {
    disabledHours: () => range(0, 60).splice(20, 4),
    disabledMinutes: () => range(0, 31),
    disabledSeconds: () => [55, 56],
  };
}

@Form.create()

class Demo extends React.Component {
  state = {}

  handleClick = () => {
    // const { form: { getFieldsValue } } = this.props;
    // const res = getFieldsValue()
  }

  disabledDate = current => {
    this.handleClick()
    // Can not select days before today and today
    return current && current < moment().endOf('day');
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return <div>
      <Button onClick={this.handleClick}>button</Button>
      <DatePicker
        format="YYYY-MM-DD HH:mm:ss"
        disabledDate={this.disabledDate}
        disabledTime={disabledDateTime}
        showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
      />
      <br />
      <MonthPicker disabledDate={this.disabledDate} placeholder="Select month" />
      <br />
      <Form.Item>
        {getFieldDecorator('date')(
          <RangePicker
            disabledDate={this.disabledDate}
            disabledTime={disabledRangeTime}
            showTime={{
              hideDisabledOptions: true,
              defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
            }}
            format="YYYY-MM-DD HH:mm:ss"
          />
        )}
      </Form.Item>

    </div>
  }
}

export default Demo;
