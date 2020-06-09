import React from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';

const { RangePicker } = DatePicker;

const lastWeek = [moment().subtract('days', 7), moment()];
const lastMonth = [moment().subtract('days', 30), moment()];
const thisWeek = [moment().startOf('week'), moment().endOf('week')];
const thisMonth = [moment().startOf('month'), moment().endOf('month')];

class ControlledRangePicker extends React.Component {
  state = {}

  render() {
    return (
      <RangePicker
        // style={{ width: 400 }}
        ranges={{
          '过去一周': lastWeek,
          '过去30天': lastMonth,
          '这周': thisWeek,
          '这个月': thisMonth,
        }}
        showTime
        format="YYYY/MM/DD HH:mm"
      />
    );
  }
}

export default ControlledRangePicker;
