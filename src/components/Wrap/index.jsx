import React, { PureComponent } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card } from 'antd';

class Wrap extends PureComponent {
  state = {}

  render() {
    return (<PageHeaderWrapper>
      <Card bodyStyle={{ padding: 24 }} bordered={false}>
        {
          this.props.children
        }
      </Card>
    </PageHeaderWrapper>);
  }
}

export default Wrap;
