import React, { createRef } from 'react';
import ReactToPrint from 'react-to-print';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Divider, Button } from 'antd';
import { router } from 'umi';
import Demo1 from './demo1';
import Demo2 from './demo2';
import PrintArea from './print';
import styles from './print.less';

class SelectComp extends React.Component {
  constructor(props) {
    super(props)
    this.componentRef = createRef()
  }

  state = {
    index: 3
  }

  navBack = () => {
    router.push('/antd/input')
  }

  render() {
    const { index } = this.state;
    return (<PageHeaderWrapper onBack={this.navBack} >
      <Card>
        <section>
          {
            index === 1 ? <Demo1 />
            : index === 2 ? <Demo2 />
            : <>
            <ul ref={this.componentRef} >
              <li className={styles.page}>
                <PrintArea />
              </li>
              <li className={styles.page}>
                <PrintArea />
              </li>
            </ul>
              
              <ReactToPrint
                trigger={() => {
                  // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
                  // to the root node of the returned component as it will be overwritten.
                  return <Button>Print</Button>;
                }}
                content={() => this.componentRef?.current}
              />
            </>
          }
          <Divider dashed />
        </section>
      </Card>

    </PageHeaderWrapper>);
  }
}

export default SelectComp;
