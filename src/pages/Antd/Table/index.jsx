import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Divider } from 'antd';
import { router } from 'umi';
import Demo1 from './demo1';
import Demo2 from './demo2';

class SelectComp extends React.Component {
  state = {}

  navBack = () => {
    router.push('/antd/input')
  }

  render() {
    return (<PageHeaderWrapper onBack={this.navBack} >
      <Card>
        <section>
          <Demo1 />
          <Divider dashed />
          <Demo2 />
          <Divider dashed />
        </section>
      </Card>

    </PageHeaderWrapper>);
  }
}

export default SelectComp;
