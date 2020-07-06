import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Form, Row, Col, Input, Select, DatePicker, Button, Table, Checkbox } from 'antd';
import { Link } from 'umi';
import Wrap from '@/components/MainWrap';
import Loading from '@/components/Loading';
import Toast from '@/lib/Toast';
import Print from './Print';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const DATE_FORMAT = 'YYYY-MM-DD';

@connect(({ loading, purchase }) => ({ loading, ...purchase }))

@Form.create()

class InStorage extends PureComponent {
  columns = [
    {
      title: '到货通知单号',
      dataIndex: 'bizBillNo',
      render(res, record) {
        const navUrl = `/my/instorage/detail/${record.id}`;
        return record.id ? <Link to={navUrl}>{res}</Link> : <span>{res}</span>
      }
    },
    { title: '收货入库单号', dataIndex: 'inStorageNo' },
    { title: '货主', dataIndex: 'cargoOwnerName' },
    {
      title: '供应商',
      dataIndex: 'supplierName',
      render(name, { supplierCode, orderType }) {
        let code = '--';
        orderType === 'PURCHASE' && (code = supplierCode)
        orderType === 'TRANSFER' && (code = '发货仓库编码')
        return `${code} ${name}`
      }
    },
    {
      title: '单据状态',
      dataIndex: 'status',
      render(type) {
        return {
          CANCEL: '已取消',
          NOTICE: '已通知',
          RECEIVING: '收货中',
          FINISHED: '已完成',
          REJECT: '已拒收',
        }[type] || '--'
      }
    },
    {
      title: '计划到货时间',
      dataIndex: 'arrivalPlanTime',
      render: timestamp => (timestamp
        ? moment(new Date(timestamp)).format(DATE_FORMAT)
        : '--')
    },
    {
      title: '单据生成时间',
      dataIndex: 'gmtCreate',
      render: timestamp => (timestamp
        ? moment(new Date(timestamp)).format(DATE_FORMAT)
        : '--')
    },
    {
      title: '单据类型',
      dataIndex: 'orderType',
      render(type) {
        return {
          PURCHASE: '采购入库',
          PROXY: '代销入库',
          TRANSFER: '调拨入库',
          CUSTOMER_RETURN: '客退入库'
        }[type] || '--'
      }
    },
    { title: '备注', dataIndex: 'remark' },
    {
      title: '操作',
      render: ({ id, status }) => {
        return <span>
          {
            status === 'RECEIVING' ? <a onClick={() => this.handleFinish(id)}>收货完成</a>
              : status === 'NOTICE' ? <a onClick={() => this.handleRefuse(id)}>整单拒收</a>
                : null
          }
        </span>
      }
    }
  ]

  state = {
    pageNum: 1, 
    pageSize: 10,
    selectedRowKeys: [],
    isAllSelected: false,
    printList: []
  }

  printInstance = React.createRef()

  componentDidMount() {
    this.requestList()
  }

  handleFinish = inStorageOrderId => { // 收货完成
    inStorageOrderId && Toast.confirm('确认收货完成', {
      onOk: () => {
        this.props.dispatch({
          type: 'purchase/requestFinishReceive',
          payload: { inStorageOrderId },
          success: () => {
            this.requestList()
          }
        })
      },
    });
  }

  handleRefuse = inStorageOrderId => { // 整单拒收
    inStorageOrderId && Toast.confirm('是否整单拒收', {
      onOk: () => {
        this.props.dispatch({
          type: 'purchase/requestRefuseReceive',
          payload: { inStorageOrderId },
          success: () => {
            this.requestList()
          }
        })
      }
    });
  }

  requestList = () => { // 请求采购入库单列表
    const { pageNum, pageSize } = this.state;
    const { dispatch, form } = this.props;
    const options = form.getFieldsValue()
    dispatch({
      type: 'purchase/requestGetList',
      payload: { ...formatParams(options), pageNum, pageSize }
    })
    window.scrollTo(0, 0);
  }

  handleSearch = () => { // 搜索操作
    // const res = this.props.form?.getFieldsValue()
    this.setState({ pageNum: 1 }, () => {
      this.requestList()
    })
  }

  handleReset = () => { // 重置操作
    this.props.form.resetFields()
    this.handleSearch()
  }

  handlePageChange = pagination => { // 切换 采购入库单列表 页码
    const payload = {
      ...this.state, // 存在 pageSize 变化 pageNum不变化情况 覆盖一遍比较稳妥
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      selectedRowKeys: [], // 覆盖已选项
    };
    this.setState(payload, () => {
      this.requestList()
    });
  }

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  }

  getCheckboxProps = record => ({ // 表格 列表项 是否允许被选择 
    disabled: this.state.isAllSelected, // Column configuration not to be checked
    name: record.name,
  })

  handleSelectAll = e => { // toggle 全选按钮(勾选后 后端 将符合条件的 list 全部操作 打印、导出)
    this.setState({ isAllSelected: e.target.checked })
  }

  retParams = () => { // 返回 所需参数
    const { pageNum, pageSize, isAllSelected, selectedRowKeys } = this.state;
    const options = this.props.form.getFieldsValue()
    const params = { ...formatParams(options), pageNum, pageSize }
    params.inStorageOrderIds = isAllSelected ? [] : selectedRowKeys;
    return params;
  }

  handlePrint = () => { // 收货交接单打印
    // const { selectedRowKeys, isAllSelected } = this.state;
    const payload = this.retParams()
    this.props.dispatch({ 
      type: 'purchase/requestListPrint', 
      payload, 
      success: printList => {
        this.setState({ printList }, () => {
          console.log(printList)
          // eslint-disable-next-line no-unused-expressions
          this.printInstance.current?.handlePrint()
        })
        
      }
    })
  }

  handleExport = () => { // 单据导出
    const payload = this.retParams()
    this.props.dispatch({ type: 'purchase/requestListExport', payload })
  }

  handleDetailExport = () => { // 明细导出
    const payload = this.retParams()
    this.props.dispatch({ type: 'purchase/requestDetailExport', payload })
  }

  retIsEffectLoading = key => { // 返回 modal.effects 是否请求中 
    if (!key) return false
    return this.props.loading.effects[key]
  }

  render() {
    const { pageNum, pageSize, isAllSelected, selectedRowKeys, printList } = this.state;
    const { form: { getFieldDecorator }, list = [], total } = this.props;
    const tableLoading = this.retIsEffectLoading('purchase/requestGetList')
    const exportLoading = this.retIsEffectLoading('purchase/requestListExport') || this.retIsEffectLoading('purchase/requestDetailExport') || this.retIsEffectLoading('purchase/requestListPrint');
    const canOperate = isAllSelected || selectedRowKeys.length > 0; // 是否可以操作 打印 导出等功能
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      getCheckboxProps: this.getCheckboxProps,
    };
    return (<Wrap>
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
                        <Option value="PURCHASE">采购入库</Option>
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
              <Button type="primary" onClick={this.handleSearch}>查询</Button>
              <Button type="primary" onClick={this.handleReset}>重置</Button>
            </div>
          </Col>
        </Row>
        <div className="btn-area">
          <div>
            <Button type="primary" disabled={!canOperate} onClick={this.handlePrint}>收货交接单打印</Button>
            <Button type="primary" disabled={!canOperate} onClick={this.handleExport}>单据导出</Button>
            <Button type="primary" disabled={!canOperate} onClick={this.handleDetailExport}>明细导出</Button>
            <Checkbox value={isAllSelected} onChange={this.handleSelectAll}>全选</Checkbox>
          </div>
        </div>
      </Form>
      <Table
          rowKey="id"
          dataSource={list}
          columns={this.columns}
          onChange={this.handlePageChange}
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
        <Print ref={this.printInstance} list={printList} />
    </Wrap>);
  }
}

export default InStorage;

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
