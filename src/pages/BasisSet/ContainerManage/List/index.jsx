import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Form, Button, Input, Table, Row, Col, Select } from 'antd';
import { connect } from 'dva';
import Toast from '@/lib/Toast';
import ContainerModal from './components/ContainerModal'
import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ containerlist, loading }) => ({ loading, ...containerlist }))
@Form.create()

class ContainerManageList extends Component {
  state = {
    pageInfo: {
      pageNum: 1,
      pageSize: 10
    },
    selectedRowKeys: [],
    visible: false
  }

  tableColumns = [
    {
      title: '容器编码',
      dataIndex: 'containerCode',
      render: (code, { id }) => <a onClick={() => this.checkDetail(id)}>{code}</a>
    },
    { title: '容器类型', dataIndex: 'containerType' },
    {
      title: '行列',
      render({ rowNo, columnNo }) {
        return rowNo && columnNo ? `${rowNo}X${columnNo}` : '-'
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      render(key) {
        return {
          'VALID': '启用',
          'INVALID': '停用',
        }[key]
      }
    },
    {
      title: '占用',
      dataIndex: 'usageType',
      render: key => ({
        'USING': '是',
        'RELEASE': '否',
      }[key])
    },
    { title: '单据占用信息', dataIndex: 'objectInfo' },
    { title: '备注', dataIndex: 'remark' },
    { title: '操作人', dataIndex: 'operatorName' },
  ]

  componentDidMount() {
    this.requestList()
  }

  handleSearch = () => { // 查询 默认重置 pageNum = 1
    const pageInfo = { pageNum: 1, ...this.state.pageInfo }
    this.requestList(pageInfo)
  }

  handleReset = () => { // 重置筛选条件 重置pageInfo
    this.props.form.resetFields();
    const pageInfo = { pageNum: 1, pageSize: 10 }
    this.requestList(pageInfo)
  }

  checkDetail = id => {
    this.props.dispatch({ type: 'containerlist/getContainerDetail', payload: id })
    this.setState({ visible: true })
  }

  handleNew = () => {
    this.setState({ visible: true })
  }

  handleModalClose = () => {
    const details = {}
    this.props.dispatch({ type: 'containerlist/updateState', payload: { details } })
    this.setState({ visible: false })
  }

  handleModalEdit = () => {
    this.handleModalClose()
    this.requestList()
  }

  handleEnable = () => {
    const { dispatch } = this.props;
    const { selectedRowKeys: selectedKeys } = this.state;
    const payload = { selectedKeys, onoff: true }
    dispatch({
      type: 'containerlist/updateContainerStatus',
      payload,
      success: () => {
        this.setState({ selectedRowKeys: [] })// 处于异步回调 setState 同步更新
        this.requestList()
      }
    })
  }

  handleDisable = () => {
    const { dispatch } = this.props;
    const { selectedRowKeys: selectedKeys } = this.state;
    const payload = { selectedKeys, onoff: false }
    Toast.confirm('你确定要停用这些库位吗？', {
      onOk: () => {
        dispatch({
          type: 'containerlist/updateContainerStatus',
          payload,
          success: () => {
            this.setState({ selectedRowKeys: [] }, () => {
            })
            this.requestList()
          }
        })
      }
    })
  }

  handleSelect = selectedRowKeys => {
    this.setState({ selectedRowKeys })
  }

  /**
   * 页码变化返回参数情况
   * 1. 切换pageSize pageNum 返回 1 
   * 2. 切换pageNum 数值
   */
  handlePageChange = ({ current: pageNum, pageSize }) => {
    const pageInfo = {
      ...this.state.pageInfo,
      pageNum,
      pageSize,
    }
    this.requestList(pageInfo)
  }

  // -----
  requestList = pageInfo => { // 设置pageInfo && 请求列表 
    pageInfo ? this.setState({ pageInfo }, () => {
      this.dispatchToGetContainerList()
    }) : this.dispatchToGetContainerList()
  }

  dispatchToGetContainerList = () => { // 获取请求参数 http请求列表
    const { dispatch, form } = this.props;
    if (typeof dispatch !== 'function') return Toast.error('dispath must be a function')
    const options = form.getFieldsValue()
    const payload = { ...this.state.pageInfo, ...options }
    dispatch({ type: 'containerlist/getContainerList', payload })
    window.scrollTo(0, 0)
    return undefined
  }

  // --------
  render() {
    const { pageInfo: { pageNum, pageSize }, selectedRowKeys, visible } = this.state;
    const { loading, form, total, list } = this.props;
    const { getFieldDecorator } = form;
    const tableLoading = loading.effects['containerlist/getContainerList']
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleSelect
    }
    const hasSelected = selectedRowKeys.length > 0;

    return (<PageHeaderWrapper >
      <Card bodyStyle={{ padding: 16 }} bordered={false}>
        <div className={styles.wrapper}>
          <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} className={styles.form}>
            <Row gutter={8}>
              <Col span={6}>
                <FormItem label="容器编码">
                  {
                    getFieldDecorator('containerCode')(
                      <Input placeholder="请输入" maxLength={50} />
                    )
                  }
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label="状态">
                  {
                    getFieldDecorator('containerStatus')(
                      <Select placeholder="请选择">
                        <Option value="">全部</Option>
                        <Option value="VALID">启用</Option>
                        <Option value="INVALID">停用</Option>
                      </Select>
                    )
                  }
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label="占用">
                  {
                    getFieldDecorator('isOccupied')(
                      <Select placeholder="请选择">
                        <Option value="">全部</Option>
                        <Option value="USING">是</Option>
                        <Option value="RELEASE">否</Option>
                      </Select>
                    )
                  }
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label="容器类型">
                  {
                    getFieldDecorator('containerCategory')(
                      <Select placeholder="请选择">
                        <Option value="">全部</Option>
                        <Option value="GT">滚筒</Option>
                        <Option value="GZ">格子</Option>
                        <Option value="JXC">拣选车</Option>
                        <Option value="FJC">分拣车</Option>
                      </Select>
                    )
                  }
                </FormItem>
              </Col>
            </Row>
          </Form>
          <div className={styles['btn-area']}>
            <Button type="primary" onClick={this.handleSearch}>查询</Button>
            <Button onClick={this.handleReset}>重置</Button>
          </div>
        </div>
        <div className={styles['second-btn-area']}>
          <Button type="primary" onClick={this.handleNew}>新增</Button>
          <Button type="primary" onClick={this.handleEnable} disabled={!hasSelected}>启用</Button>
          <Button type="primary" onClick={this.handleDisable} disabled={!hasSelected}>停用</Button>
        </div>

        <Table
          rowKey="id"
          columns={this.tableColumns}
          dataSource={list}
          rowSelection={rowSelection}
          loading={tableLoading}
          onChange={this.handlePageChange}
          pagination={{
            current: pageNum,
            pageSize,
            total,
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal(totalNum) {
              return <span>
                共 {totalNum} 条记录
                第 {pageNum} / {Math.ceil(totalNum / pageSize)} 页
              </span>
            }
          }}
        />
        <ContainerModal
          visible={visible}
          handleModalClose={this.handleModalClose}
          handleModalEdit={this.handleModalEdit}
        />
      </Card>
    </PageHeaderWrapper>);
  }
}

export default ContainerManageList;
