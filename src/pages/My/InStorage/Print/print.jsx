import React, { PureComponent } from 'react';
import classnames from 'classnames';
import moment from 'moment';
import styles from './print.less';

const DATE_FORMAT = 'YYYY-MM-DD';

class PrintArea extends PureComponent {
  tableBodder = true;

  render() {
    const { info } = this.props;
    const {
      warehouseName, bizBillNo, inStorageNo, supplierName, endReceivingTime,
      detailVOList = []
    } = info;
    return (<section style={{ padding: 30 }} className={styles['print-area']}>
      <h2 className="mb-20">收货交接单</h2>

      <div className="mb-10">
        <h3>
          <span>收货仓库:</span>
          <span>{warehouseName || '--'}</span>
        </h3>
      </div>

      <ul className={classnames(styles['title-area'], 'mb-20')}>
        <li>
          <h3>
            <span>到货通知单号:</span>
            <span>{bizBillNo || '--'}</span>
          </h3>
        </li>
        <li>
          <h3>
            <span>收货入库单号:</span>
            <span>{inStorageNo || '--'}</span>
          </h3>
        </li>
        <li>
          <h3>
            <span>供应商:</span>
            <span>{supplierName || '--'}</span>
          </h3>
        </li>
        <li>
          <h3>
            <span>收货日期:</span>
            <span>
              {
                endReceivingTime
                  ? moment(new Date(endReceivingTime)).format(DATE_FORMAT)
                  : '--'
              }
            </span>
          </h3>
        </li>
      </ul>

      <table border="1" className={styles['table-area']}>
        <tr>
          <td>商品编码</td>
          <td>商品条码</td>
          <td>商品名称</td>
          <td>规格</td>
          <td>单位</td>
          <td>应收数量</td>
          <td>实收数量</td>
        </tr>
        {
          detailVOList.map(item => {
            const {
              id, skuCode, skuBarCode, skuName, spec, unit, preArrivalQty, arrivalQty
            } = item;
            return <tr
              key={id}
            >
              <td>{skuCode}</td>
              <td>{skuBarCode}</td>
              <td>{skuName}</td>
              <td>{spec}</td>
              <td>{unit}</td>
              <td>{preArrivalQty}</td>
              <td>{arrivalQty}</td>
            </tr>
          })
        }
      </table>

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
