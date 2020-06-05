import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Divider } from 'antd';
import Demo1 from './demo1';
import Demo2 from './demo2';

class InputComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (<PageHeaderWrapper>
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

export default InputComp;