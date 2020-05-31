import React from 'react';
import { Modal, message, notification, Spin } from 'antd';
import { ModalFuncProps } from 'antd/es/modal';

type NoticeConfig = {
  msg: string;
  desc: string;
  type?: 'success' | 'info' | 'error' | 'warning';
};

message.config({
  top: 100,
  duration: 3,
  maxCount: 3,
});

notification.config({
  top: 70,
  placement: 'topRight',
  duration: 3,
});

export default class Toast {
  static duration = 2;

  private static _loadModal: any;

  static success(msg: string): void {
    message.success(msg, this.duration);
  }

  static error(msg: string): void {
    message.error(msg, this.duration);
  }

  static tips(msg: string): void {
    message.info(msg, this.duration);
  }

  static notice({ msg, desc, type = 'info' }: NoticeConfig): void {
    notification[type]({
      message: msg,
      description: desc,
      duration: this.duration,
    });
  }

  static loading(title = '正在加载...'): void {
    this.loaded();
    this._loadModal = Modal.info({
      className: 'toast-load-modal',
      transitionName: 'toast-modal-ani',
      width: 100,
      mask: false,
      centered: true,
      icon: null,
      content: (
        <div className="toast-loading">
          <Spin
            tip={title}
            size="large"
          />
        </div>
      ),
    });
  }

  static loaded(): void {
    if (this._loadModal) {
      this._loadModal.destroy();
      this._loadModal = undefined;
    }
  }

  static alert(msg: string, options?: ModalFuncProps) {
    return Modal.info({
      mask: false,
      centered: true,
      okText: '确定',
      ...options,
      content: msg,
    });
  }

  static confirm(msg: string, options?: ModalFuncProps) {
    return Modal.confirm({
      mask: true,
      cancelText: '取消',
      centered: true,
      okText: '确定',
      ...options,
      content: msg,
    });
  }

  static closeAll(): void {
    message.destroy();
    Modal.destroyAll();
  }
}
