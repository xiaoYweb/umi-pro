import React from 'react';
import { DatePicker } from 'antd';
 
class Demo extends React.Component {
  state = {
    startValue: null,
    endValue: null,
    endOpen: false,
    nowTimestap: Date.now() + 3600 * 1000,
  };

  disabledStartDate = startValue => {
    const { endValue, nowTimestap } = this.state;
    const startTimestamp = startValue.valueOf();
    if (startTimestamp > nowTimestap) return true;
    
    if (!endValue) {
      return false;
    }
    const endTimestamp = endValue.valueOf();
    return startTimestamp > endTimestamp;
  };

  disabledEndDate = endValue => {
    const { startValue, nowTimestap } = this.state;
    const endTimestamp = endValue.valueOf();
    if (endTimestamp > nowTimestap) return true;

    if (!startValue) {
      return false;
    }
    const startTimestamp = startValue.valueOf();
    return startTimestamp > endTimestamp;
  };

  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  };

  onStartChange = value => {
    this.onChange('startValue', value);
  };

  onEndChange = value => {
    this.onChange('endValue', value);
  };

  handleStartOpenChange = open => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  };

  handleEndOpenChange = open => {
    this.setState({ endOpen: open });
  };

  render() {
    const { startValue, endValue, endOpen } = this.state;
    return (
      <div>
        <DatePicker
          disabledDate={this.disabledStartDate}
          showTime
          format="YYYY-MM-DD HH:mm:ss"
          value={startValue}
          placeholder="Start"
          onChange={this.onStartChange}
          onOpenChange={this.handleStartOpenChange}
        />
        <DatePicker
          disabledDate={this.disabledEndDate}
          showTime
          format="YYYY-MM-DD HH:mm:ss"
          value={endValue}
          placeholder="End"
          onChange={this.onEndChange}
          open={endOpen}
          onOpenChange={this.handleEndOpenChange}
        />
      </div>
    );
  }
}
 
export default Demo;

/**
 *  const lastWeek: any[] = [moment().subtract('days', 7), moment()];
    const lastMonth: any[] = [moment().subtract('days', 30), moment()];
    const thisWeek: any[] = [moment().startOf('week'), moment().endOf('week')];
    const thisMonth: any[] = [moment().startOf('month'), moment().endOf('month')];
 */
