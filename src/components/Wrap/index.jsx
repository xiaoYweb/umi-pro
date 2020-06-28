import React, { PureComponent } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card } from 'antd';
import styles from './index.less';

class Wrap extends PureComponent {
  state = {}

  render() {
    const { handleBack, title } = this.props;
    return (<PageHeaderWrapper onBack={handleBack} title={title}>
      <Card bordered={false} className={styles['main-style']}>
        {
          this.props.children
        }
      </Card>
    </PageHeaderWrapper>);
  }
}

export default Wrap;
