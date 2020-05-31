import { message, Modal, Spin } from 'antd'
import React from 'react';

// message.config({
//   top: 100,
//   duration: 2,
// });

const duration = 2;
let modal;

const tip = {
  info(text) {
    return text && message.info(text, duration);
  },
  success(text) {
    return text && message.success(text, duration);
  },
  warnning(text) {
    return text && message.warnning(text, duration);
  },
  error(text) {
    return text && message.error(text, duration);
  },
  loading(title) {
    modal = Modal.info({
      className: 'toast-load-modal',
      transitionName: 'toast-modal-ani',
      width: 100,
      mask: false,
      centered: true,
      icon: null,
      content: (<div className="toast-loading">
        <Spin
          tip={title}
          size="large"
        />
      </div>),
    });
  },
  loaded() {
    if (!modal) return
    modal.destroy()
    modal = undefined;
  },
  alert(msg, options) {
    return Modal.info({
      mask: false,
      centered: true,
      okText: '确定',
      ...options,
      content: msg,
    });
  },
  confirm(msg, options) {
    return Modal.confirm({
      mask: true,
      cancelText: '取消',
      centered: true,
      okText: '确定',
      ...options,
      content: msg,
    });
  },
  closeAll() {
    message.destroy()
    modal && modal.destroy()
  }
}

export default tip;
