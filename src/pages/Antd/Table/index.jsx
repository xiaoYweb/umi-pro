import React, { createRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Divider, Button } from 'antd';
import { router } from 'umi';
import Demo1 from './demo1';
import Demo2 from './demo2';
import PrintArea from './print';
import styles from './print.less';
import Print from '@/components/Print';

class SelectComp extends React.Component {
  constructor(props) {
    super(props)
    this.componentRef = createRef()
    this.printBtn = createRef()
  }

  state = {
    index: 3
  }

  navBack = () => {
    router.push('/antd/input')
  }

  handleClick = () => {
    console.log(this.printBtn.current)
    // eslint-disable-next-line no-unused-expressions
    this.printBtn.current?.handleClick()
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
            <div className={styles['hide-wrap']}>
              <ul ref={this.componentRef} className={styles['print-content']}>
                <li className={styles.page}>
                  <PrintArea />
                </li>
                {/* <li className={styles.page}>
                  <PrintArea />
                </li> */}
              </ul>
            </div>
              <Print content={this.componentRef?.current}>
                <Button ref={this.printBtn}>Print</Button>
              </Print>
              <Button onClick={this.handleClick}>other</Button>
            </>
          }
          <Divider dashed />
        </section>
      </Card>

    </PageHeaderWrapper>);
  }
}

export default SelectComp;
