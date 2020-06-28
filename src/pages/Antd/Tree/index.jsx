import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Divider } from 'antd';
import { router } from 'umi';
import Demo1 from './demo1';
import Demo2 from './demo2';
import Demo3 from './demo3';

class SelectComp extends React.Component {
  state = {
    index: 3
  }

  navBack = () => {
    router.push('/antd/input')
  }

  render() {
    const { index } = this.state
    return (<PageHeaderWrapper onBack={this.navBack} >
      <Card>
        <section>
          {
            index === 1 ? <Demo1 />
            : index === 2 ? <Demo2 />
            : index === 3 ? <Demo3 />
            : null
          }
          <Divider dashed />
        </section>
      </Card>

    </PageHeaderWrapper>);
  }
}

export default SelectComp;
