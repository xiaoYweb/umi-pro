import React, { Component } from 'react';
import { Modal, Form, Select, Input } from 'antd';
import { connect } from 'dva';
import { ConnectProps } from '@/models/connect';
import { FormComponentProps } from 'antd/es/form';

const FormItem = Form.Item;
const { Option } = Select;

interface AreaModalProps extends ConnectProps {
  visible?: boolean;
  params?: any;
  onClose: () => void;
  onSave: () => void;
  form: FormComponentProps['form'];
}

// @ts-ignore
@connect()
// @ts-ignore
@Form.create()
export default class AreaModal extends Component<AreaModalProps> {
  static defaultProps = {
    form: {},
  }

  handleOk = () => {
    const { form, dispatch, onSave, params } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        dispatch && dispatch({
          type: 'areas/saveArea',
          payload: {
            ...params,
            ...values,
          },
          callback: onSave,
        });
        this.handleCancel();
      }
    });
  }

  handleCancel = () => {
    this.props.form.resetFields();
    this.props.onClose();
  }

  handleGetValueEvent = (e: any) => {
    return e.target.value.toUpperCase();
  }

  render() {
    const { visible, params = {}, form: { getFieldDecorator } } = this.props;
    let title = '新建库区';
    let isCode = true;
    if (params.id) {
      title = '编辑库区';
      isCode = false;
    }

    return (
      <Modal
        title={title}
        visible={visible}
        maskClosable={false}
        okText="保存"
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
        >
          <FormItem
            style={{ display: isCode ? 'block' : 'none' }}
            label="库区编码"
          >
            {getFieldDecorator('areaCode', {
              initialValue: params.areaCode,
              getValueFromEvent: this.handleGetValueEvent,
              rules: [
                { required: true, message: '必填项' },
                { pattern: /^[a-zA-Z0-9]+$/, message: '只能输入字母或数字' },
              ],
            })(<Input maxLength={2} placeholder="请输入" />)}
          </FormItem>
          <FormItem label="温控">
            {getFieldDecorator('temperatureType', {
              initialValue: params.temperatureType,
              rules: [
                { required: true, message: '必填项' },
              ],
            })(
              <Select placeholder="请选择">
                <Option value="NORMAL">常温</Option>
                <Option value="REFRIGERATION">冷藏</Option>
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
