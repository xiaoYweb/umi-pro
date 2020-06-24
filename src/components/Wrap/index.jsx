import React, { PureComponent } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card } from 'antd';
import styles from './index.less';

class Wrap extends PureComponent {
  state = {}

  render() {
    return (<PageHeaderWrapper>
      <Card bordered={false} className={styles['main-style']}>
        {
          this.props.children
        }
      </Card>
    </PageHeaderWrapper>);
  }
}

export default Wrap;
