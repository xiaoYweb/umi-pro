import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Divider } from 'antd';
import Demo1 from './demo1';
import Demo2 from './demo2';
import Demo3 from './demo3';
import Demo4 from './demo4';

class InputComp extends React.Component {
  state = {
    index: 0
  }

  render() {
    const { index } = this.state;
    return (<PageHeaderWrapper>
      <Card>
        <section>
          {
            index === 1 ? <Demo1 />
            : index === 2 ? <Demo2 />
            : index === 3 ? <Demo3 />
            : index === 4 ? <Demo4 />
            : null
          }
          <Divider dashed />
        </section>
      </Card>
    </PageHeaderWrapper>);
  }
}

export default InputComp;
