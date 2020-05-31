import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Form, Input, InputNumber, Row, Col, Select } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const rowStyle = { width: '80%' }

@connect(({ containerlist, loading }) => ({ loading, ...containerlist }))
@Form.create()

class ContainerModal extends Component {
  // eslint-disable-next-line react/sort-comp
  handleComfirm = () => {
    const { form, dispatch, details } = this.props;
    const { validateFields } = form;
    validateFields((err, options) => {
      if (err) return
      const success = this.props.handleModalEdit;
      if (details && details.id) {
        dispatch({
          type: 'containerlist/updateContainer',
          payload: { ...options, id: details.id },
          success
        })
      } else {
        dispatch({ type: 'containerlist/newContainer', payload: options, success })
      }
    })
  }

  handleCancel = () => {
    const { handleModalClose, form } = this.props;
    form.resetFields()
    handleModalClose && handleModalClose()
  }

  handleCalcVolume = debounce(() => {
    const { length = 0, width = 0, height = 0 } = this.props.form.getFieldsValue()
    const volume = length * width * height
    this.props.form.setFieldsValue({ volume })
  })

  render() {
    const { details = {}, form, visible } = this.props;
    const { getFieldDecorator } = form;
    const title = details.id ? '编辑容器' : '新增容器';
    return (<Modal
      visible={visible}
      title={title}
      onOk={this.handleComfirm}
      onCancel={this.handleCancel}
    >
      <section>
        <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <FormItem label="类型">
                {
                  getFieldDecorator('containerType', {
                    initialValue: details.containerType,
                    rules: [{ required: true, message: '必填项' }]
                  })(
                    <Select placeholder="请选择" style={rowStyle}>
                      <Option value="GT">滚筒</Option>
                      <Option value="GZ">格子</Option>
                      <Option value="JXC">拣选车</Option>
                      <Option value="FJC">分拣车</Option>
                    </Select>
                  )
                }
              </FormItem>
            </Col>
            <Col span={12}>
              {
                details.id ? null : <FormItem label="生成数量">
                  {
                    getFieldDecorator('totalCount', {
                      initialValue: details.totalCount,
                      rules: [{ required: true, message: '必填项', type: 'number' }]
                    })(
                      <InputNumber style={rowStyle} placeholder="请输入" />
                    )
                  }
                  <span> 件</span>
                </FormItem>
              }
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <FormItem label="分拣车行">
                {
                  getFieldDecorator('rowNo', { initialValue: details.rowNo })(
                    <InputNumber style={rowStyle} placeholder="请输入" />
                  )
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="分拣车列">
                {
                  getFieldDecorator('columnNo', { initialValue: details.columnNo })(
                    <InputNumber style={rowStyle} placeholder="请输入" />
                  )
                }
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <FormItem label="长">
                {
                  getFieldDecorator('length', { initialValue: details.length })(
                    <InputNumber onChange={this.handleCalcVolume} style={rowStyle} placeholder="请输入" />
                  )
                }
                <span> cm</span>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="宽">
                {
                  getFieldDecorator('width', { initialValue: details.width })(
                    <InputNumber onChange={this.handleCalcVolume} style={rowStyle} placeholder="请输入" />
                  )
                }
                <span> cm</span>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <FormItem label="高">
                {
                  getFieldDecorator('height', { initialValue: details.height })(
                    <InputNumber onChange={this.handleCalcVolume} style={rowStyle} placeholder="请输入" />
                  )
                }
                <span> cm</span>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="体积">
                {
                  getFieldDecorator('volume', { initialValue: details.volume })(
                    <InputNumber style={rowStyle} placeholder="自动计算" readOnly />
                  )
                }
                <span> cm³</span>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <FormItem label="最大容量">
                {
                  getFieldDecorator('maxCapacity', { initialValue: details.maxCapacity })(
                    <InputNumber style={rowStyle} placeholder="请输入" />
                  )
                }
                <span> cm³</span>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="最大承重">
                {
                  getFieldDecorator('maxWeight', { initialValue: details.maxWeight })(
                    <InputNumber style={rowStyle} placeholder="请输入" />
                  )
                }
                <span> cm³</span>
              </FormItem>
            </Col>
          </Row>
          <FormItem labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} label="备注">
            {
              getFieldDecorator('remark', { initialValue: details.remark })(
                <TextArea rows={3} placeholder="请输入" />
              )
            }
          </FormItem>
        </Form>
      </section>
    </Modal>);
  }
}

export default ContainerModal;

function debounce(fn, delay = 300) {
  let timer = null
  return function func(...args) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay);
  }
}
