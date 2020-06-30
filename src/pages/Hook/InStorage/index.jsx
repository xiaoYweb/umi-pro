import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Input, Select, DatePicker, Button, Table, Checkbox } from 'antd';
import Wrap from '@/components/Wrap';
import Loading from '@/components/Loading';
import Toast from '@/lib/Toast';
import retColumns from './columns';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const DATE_FORMAT = 'YYYY-MM-DD';


function Instorage(props) {
  const [pageNum, setPageNum] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [isAllSelected, selectAll] = useState(false)
  const [selectedRowKeys, onSelectChange] = useState([])
  // console.log(1)
  const requestList = (current, size) => { // 请求采购入库单列表
    const { dispatch, form } = props;
    const options = form.getFieldsValue()
    dispatch({
      type: 'hookppurchase/requestGetList',
      payload: { 
        ...formatParams(options), 
        pageNum: current || pageNum, 
        pageSize: size || pageSize 
      }
    })
    window.scrollTo(0, 0);
  }

  useEffect(() => {
    requestList()
  }, [])

  const handleSearch = () => { // 搜索操作
    setPageNum(1)
    requestList(1)
  }

  const handleReset = () => { // 重置操作
    props.form.resetFields()
    handleSearch()
  }

  const handlePageChange = ({ current, pageSize: size }) => { // 切换 采购入库单列表 页码
    setPageNum(current)
    setPageSize(size)
    requestList(current, size)
  }

  const getCheckboxProps = record => ({ // 表格 列表项 是否允许被选择 
    disabled: isAllSelected, // Column configuration not to be checked
    name: record.name,
  })

  const handleSelectAll = e => { // toggle 全选按钮(勾选后 后端 将符合条件的 list 全部操作 打印、导出)
    selectAll(e.target.checked)
  }

  const retIsEffectLoading = key => { // 返回 modal.effects 是否请求中 
    if (!key) return false
    return props.loading.effects[key]
  }

  const retParams = () => { // 返回 所需参数
    const options = props.form.getFieldsValue()
    const params = { ...formatParams(options) }
    params.inStorageOrderIds = isAllSelected ? [] : selectedRowKeys;
    return params;
  }

  const handlePrint = () => { // 收货交接单打印
    const payload = retParams()
    props.dispatch({ type: 'hookppurchase/requestListPrint', payload })
  }

  const handleExport = () => { // 单据导出
    const payload = retParams()
    props.dispatch({ type: 'hookppurchase/requestListExport', payload })
  }

  const handleDetailExport = () => { // 明细导出
    const payload = retParams()
    props.dispatch({ type: 'hookppurchase/requestDetailExport', payload })
  }

  const handleFinish = inStorageOrderId => { // 收货完成
    inStorageOrderId && Toast.confirm('确认收货完成', {
      onOk: () => {
        props.dispatch({
          type: 'hookppurchase/requestFinishReceive',
          payload: { inStorageOrderId },
          success: () => {
            requestList()
          }
        })
      },
    });
  }

  const handleRefuse = inStorageOrderId => { // 整单拒收
    inStorageOrderId && Toast.confirm('是否整单拒收', {
      onOk: () => {
        props.dispatch({
          type: 'hookppurchase/requestRefuseReceive',
          payload: { inStorageOrderId },
          success: () => {
            requestList()
          }
        })
      }
    });
  }

  const columns = retColumns(handleFinish, handleRefuse)
  const { form: { getFieldDecorator }, list = [], total } = props;
  const tableLoading = retIsEffectLoading('hookppurchase/requestGetList')
  const exportLoading = retIsEffectLoading('hookppurchase/requestListExport') || retIsEffectLoading('hookppurchase/requestDetailExport')
  const canOperate = isAllSelected || selectedRowKeys.length > 0; // 是否可以操作 打印 导出等功能
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps,
  };

  return <Wrap>
    <Loading loading={exportLoading} />
    <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
      <Row gutter={16}>
        <Col span={20}>
          <Row gutter={12}>
            <Col span={6}>
              <FormItem label="货主">
                {
                  getFieldDecorator('cargoOwnerId')(
                    <Input placeholder="请输入" />
                  )
                }
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="到货通知单号">
                {
                  getFieldDecorator('bizBillNo')(
                    <Input placeholder="请输入" />
                  )
                }
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="收货入库单号">
                {
                  getFieldDecorator('inStorageNo')(
                    <Input placeholder="请输入" />
                  )
                }
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="商品编码">
                {
                  getFieldDecorator('skuRelatedCode')( // skuRelatedCod 支持 编码 二维码查询 skuId
                    <Input placeholder="请输入" />
                  )
                }
              </FormItem>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={6}>
              <FormItem label="供应商">
                {
                  getFieldDecorator('supplierCode')(
                    <Input placeholder="请输入供应商编码" />
                  )
                }
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="单据类型">
                {
                  getFieldDecorator('orderType')(
                    <Select placeholder="请选择">
                      <Option value="hookppurchase">采购入库</Option>
                      {/* <Option value="PROXY">代销入库</Option> */}
                      {/* <Option value="TRANSFER">调拨入库</Option> */}
                      {/* <Option value="CUSTOMER_RETURN">客退入库</Option> */}
                    </Select>
                  )
                }
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="状  态">
                {
                  getFieldDecorator('status')(
                    <Select placeholder="请选择">
                      <Option value="CANCEL">已取消</Option>
                      <Option value="NOTICE">已通知</Option>
                      <Option value="RECEIVING">收货中</Option>
                      <Option value="FINISHED">已完成</Option>
                      <Option value="REJECT">已拒收</Option>
                    </Select>
                  )
                }
              </FormItem>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={6}>
              <FormItem label="计划到货时间" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                {
                  getFieldDecorator('arrivalTime')(
                    <RangePicker format={DATE_FORMAT} />
                  )
                }
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="单据生成时间" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                {
                  getFieldDecorator('createTime')(
                    <RangePicker format={DATE_FORMAT} />
                  )
                }
              </FormItem>
            </Col>
          </Row>
        </Col>
        <Col span={4}>
          <div className="search-area">
            <Button type="primary" onClick={handleSearch}>查询</Button>
            <Button type="primary" onClick={handleReset}>重置</Button>
          </div>
        </Col>
      </Row>
      <div className="btn-area">
        <div>
          <Button type="primary" disabled={!canOperate} onClick={handlePrint}>收货交接单打印</Button>
          <Button type="primary" disabled={!canOperate} onClick={handleExport}>单据导出</Button>
          <Button type="primary" disabled={!canOperate} onClick={handleDetailExport}>明细导出</Button>
          <Checkbox value={isAllSelected} onChange={handleSelectAll}>全选</Checkbox>
        </div>
      </div>
    </Form>

    <Table
      rowKey="id"
      dataSource={list}
      columns={columns}
      onChange={handlePageChange}
      rowSelection={rowSelection}
      loading={tableLoading}
      pagination={{
        // pageSizeOptions: ['2', '3', '10'],
        current: pageNum,
        pageSize,
        total,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: totalCount => <span>共 {totalCount} 条记录 第 {pageNum} / {
          Math.ceil(totalCount / pageSize)
        } 页</span>
      }}
    />
  </Wrap>
}

export default connect(
  ({ loading, hookppurchase }) => ({ loading, ...hookppurchase })
)(Form.create()(Instorage));

function fixStartHMS(str) { // 处理 日期精度问题 5/20 - 5/21 默认起始时间 00:00:00 结束时间 23:59:59
  return `${str} 00:00:00`
}

function fixEndHMS(str) {
  return `${str} 23:59:59`
}

function formatParams(params) { // 处理传参 时间字段
  const { arrivalTime, createTime } = params;
  let arrivalPlanTimeBeginTime;
  let arrivalPlanTimeEndTime;
  let createdBeginTime;
  let createdEndTime;

  if (Array.isArray(arrivalTime) && arrivalTime.length === 2) {
    arrivalPlanTimeBeginTime = fixStartHMS(arrivalTime[0].format(DATE_FORMAT))
    arrivalPlanTimeEndTime = fixEndHMS(arrivalTime[1].format(DATE_FORMAT))
  }
  if (Array.isArray(createTime) && createTime.length === 2) {
    createdBeginTime = fixStartHMS(createTime[0].format(DATE_FORMAT))
    createdEndTime = fixEndHMS(createTime[1].format(DATE_FORMAT))
  }

  return {
    ...params,
    arrivalTime: undefined,
    createTime: undefined,
    arrivalPlanTimeBeginTime,
    arrivalPlanTimeEndTime,
    createdBeginTime,
    createdEndTime
  }
}
