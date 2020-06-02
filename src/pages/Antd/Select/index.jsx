import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Divider } from 'antd';
import Demo1 from './demo1';
import Demo2 from './demo2';
import Demo3 from './demo3';
import Demo4 from './demo4';
import Demo5 from './demo5';
import Demo15 from './demo15';

class SelectComp extends React.Component {
  state = {}

  render() {
    return (<PageHeaderWrapper>
      <Card>
        <section>
          <Demo1 />
          <Divider dashed />
          <Demo2 />
          <Divider dashed />
          <Demo3 />
          <Divider dashed />
          <Demo4 />
          <Divider dashed />
          <Demo5 />
          <Divider dashed />
          <Demo15 />
          <Divider dashed />
        </section>
      </Card>

    </PageHeaderWrapper>);
  }
}

export default SelectComp;
