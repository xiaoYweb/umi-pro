import React from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import styles from './index.less';


const HouseSwitch = props => {
  const { warehouseName, dispatch } = props;

  const handleClick = () => {
    dispatch && dispatch({
      type: 'global/changeWarehouseModal',
      payload: true,
    });
  }

  return (
    <div className={styles.box}>
      <div className={styles.cont}>{warehouseName}</div>
      <Button
        onClick={handleClick}
        size="small"
      >切换</Button>
    </div>
  );
};

export default connect(({ global }) => ({
  warehouseName: global.userWarehouseInfo.curWarehouseName,
}))(HouseSwitch);
