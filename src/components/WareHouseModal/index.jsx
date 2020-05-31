import React, { Component } from 'react';
import { Modal, Radio } from 'antd';
import { connect } from 'dva';
import Toast from '@/lib/Toast';
import { router } from 'umi';

const RadioGroup = Radio.Group;

@connect(({ global }) => ({
  visible: global.warehouseModal,
  curId: global.userWarehouseInfo.curId,
  list: global.userWarehouseInfo.allWarehouses,
}))

class WareHouseModal extends Component {
  state = {
    value: '',
  }

  constructor(props) {
    super(props);
    if (props.curId) {
      this.state.value = props.curId;
    }
  }

  handleChange = e => {
    this.setState({
      value: e.target.value,
    });
  }

  handleOk = () => {
    if (this.state.value) {
      const { dispatch } = this.props;
      dispatch && dispatch({
        type: 'global/changeCurWarehouse',
        payload: this.state.value,
      });
      router.replace('/');
    } else {
      Toast.error('请先选择仓库');
    }
  }

  handleCancel = () => {
    const { dispatch, curId } = this.props;
    dispatch && dispatch({
      type: 'global/changeWarehouseModal',
      payload: false,
    });
    this.setState({
      value: curId,
    });
  }

  render() {
    const { visible, list, curId } = this.props;
    const radioStyle = {
      display: 'block',
      height: '32px',
      lineHeight: '32px',
    };
    const bodyStyle = {
      height: '300px',
      overflow: 'auto',
    };
    let title = '切换仓库';
    let closable = true;
    if (!curId) {
      title = '请选择仓库';
      closable = false;
    }

    return (
      <Modal
        cancelButtonProps={{ disabled: !closable }}
        closable={closable}
        bodyStyle={bodyStyle}
        width={380}
        title={title}
        visible={visible}
        maskClosable={false}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <RadioGroup value={this.state.value} onChange={this.handleChange}>
          {list && list.map(item => (
            <Radio style={radioStyle} key={item.id} value={item.id}>{item.warehouseName}</Radio>
          ))}
        </RadioGroup>
      </Modal>
    );
  }
}

export default WareHouseModal;
