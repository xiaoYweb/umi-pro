import React, { PureComponent } from 'react';
import { Table, Descriptions } from 'antd';
import styles from './print.less';

const dataSource = [
  {
    key: '1',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号',
  },
  {
    key: '2',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
  },
];

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '住址',
    dataIndex: 'address',
    key: 'address',
  },
];

class PrintArea extends PureComponent {
  tableBodder = true;

  render() {
    return (<section style={{ padding: 30 }} className={styles['print-area']}>
      <h2>收货交接单</h2>

      <div>
        <h3>
          <span>收货仓库:</span>
          <span>W001   广州服装仓</span>
        </h3>
      </div>
      <ul>
        <li>
          <h3>
            <span>到货通知单号:</span>
            <span>PO020505000009</span>
          </h3>
        </li>
        <li>
          <h3>
            <span>收货入库单号:</span>
            <span>RK020505000011</span>
          </h3>
        </li>
        <li>
          <h3>
            <span>供应商:</span>
            <span>G023 上海xxx服饰有限公司</span>
          </h3>
        </li>
        <li>
          <h3>
            <span>收货日期:</span>
            <span>2020-05-23</span>
          </h3>
        </li>
      </ul>

      {/* <table className={styles['table-area']} border="1">
        <tr>
          <th>Month</th>
          <th>Savings</th>
        </tr>
        <tr>
          <td>January</td>
          <td>$100</td>
        </tr>
      </table> */}
      <table border="1" className={styles['table-area']}>
        <tr>
          <td>&nbsp;</td>
          <td>t1</td>
          <td>t2</td>
          <td>t3</td>
          <td>t4</td>
          <td>t5</td>
          <td>t6</td>
        </tr>
        <tr>
          <td>r1</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td>r2</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
        </tr>
      </table>
      {/* <Table
        className="mb-20"
        size="small"
        // bordered={this.tableBodder}
        dataSource={dataSource}
        columns={columns}
        pagination={false}
      /> */}
      <ul className={styles['sign-area']}>
        <li>
          <span>交接人:</span>
          <span></span>
        </li>
        <li>
          <span>日期:</span>
          <span></span>
        </li>
      </ul>
    </section>);
  }
}

export default PrintArea;
