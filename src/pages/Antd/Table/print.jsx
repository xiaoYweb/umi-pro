import React, { PureComponent } from 'react';
import classnames from 'classnames';
import styles from './print.less';

class PrintArea extends PureComponent {
  tableBodder = true;

  render() {
    return (<section style={{ padding: 30 }} className={styles['print-area']}>
      <h2 className="mb-20">收货交接单</h2>

      <div className="mb-10">
        <h3>
          <span>收货仓库:</span>
          <span>W001   广州服装仓</span>
        </h3>
      </div>
      
      <ul className={classnames(styles['title-area'], 'mb-20')}>
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
            <span>G023上海xxx服饰有限公司</span>
          </h3>
        </li>
        <li>
          <h3>
            <span>收货日期:</span>
            <span>2020-05-23</span>
          </h3>
        </li>
      </ul>


      <div className={styles['table-area']}>
        <dl>
          <dt>商品编码</dt>
          <dt>商品条码</dt>
          <dt>商品名称</dt>
          <dt>规格</dt>
          <dt>单位</dt>
          <dt>应收数量</dt>
          <dt>实收数量</dt>
        </dl>
        <dl className={styles['page']}>
          <dd>SKU0000001</dd>
          <dd>BARCODE0000001</dd>
          <dd>练习册</dd>
          <dd>2件/套</dd>
          <dd>套</dd>
          <dd>250</dd>
          <dd>250</dd>
        </dl>
        <dl>
          <dd>SKU0000002</dd>
          <dd>BARCODE0000002</dd>
          <dd>练习册</dd>
          <dd>2件/套</dd>
          <dd>套</dd>
          <dd>250</dd>
          <dd>250</dd>
        </dl>
      </div>
      {/* <table border="1" className={styles['table-area']}>
        <tr>
          <td>商品编码</td>
          <td>商品条码</td>
          <td>商品名称</td>
          <td>规格</td>
          <td>单位</td>
          <td>应收数量</td>
          <td>实收数量</td>
        </tr>
        <tr>
          <td>SKU0000001</td>
          <td>BARCODE0000002</td>
          <td>练习册</td>
          <td>2件/套</td>
          <td>套</td>
          <td>250</td>
          <td>250</td>
        </tr>
        <tr>
          <td>SKU0000002</td>
          <td>SKU0000002</td>
          <td>鞋子</td>
          <td>件</td>
          <td>件</td>
          <td>200</td>
          <td>200</td>
        </tr>
      </table> */}
      
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
