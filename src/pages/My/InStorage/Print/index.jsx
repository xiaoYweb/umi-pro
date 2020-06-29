import React, { createRef } from 'react';
import { Button } from 'antd';
import PrintTrigger from '@/components/Print';
import PrintItem from './print';
import styles from './print.less';

class PrintArea extends React.PureComponent {
  printAreaInstance = createRef()

  printBtn = createRef()

  handlePrint = () => {
    // eslint-disable-next-line no-unused-expressions
    this.printBtn.current?.handleClick()
  }

  render() {
    const { list = [] } = this.props;
    return (<>
      <div className={styles['hide-wrap']}>
        <ul ref={this.printAreaInstance} className={styles['print-content']}>
          {
            list.map(item => {
              const { id } = item;
              return <li className={styles['page-next']} key={id}>
                <PrintItem info={item} />
              </li>
            })
          }
        </ul>
        <PrintTrigger content={this.printAreaInstance?.current}>
          <Button ref={this.printBtn}>Print</Button>
        </PrintTrigger>
      </div>
    </>);
  }
}

export default PrintArea;
