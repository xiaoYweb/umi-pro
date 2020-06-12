import React, { PureComponent } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Form, Row, Col, Input, Select, Button, Table } from 'antd';
import { connect } from 'dva';
import tools from '@/utils/tools';
import { Link, router } from 'umi';
import tip from '@/lib/tip';
import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ loading, mywarehouse }) => ({ loading, ...mywarehouse }))
@Form.create()

class WarehouseManageMentList extends PureComponent {
  state = {
    pageNum: 1,
    pageSize: 10,
  }

  columns = [
    { dataIndex: 'id', title: '仓库ID', fixed: 'left', ellipsis: true, },
    { dataIndex: 'warehouseName', title: '仓库名称', fixed: 'left', ellipsis: true, },
    { dataIndex: 'warehouseCode', title: '仓库编码', ellipsis: true, },
    {
      dataIndex: 'address',
      title: '仓库地址',
      render() {
        return <div className="etc">address</div>
      }
    },
    {
      title: '经纬度',
      width: 180,
      ellipsis: true,
      render: ({ latitude, longitude }) => (<>
        <span>{latitude}</span>,
        <span>{longitude}</span>
      </>)
    },
    {
      dataIndex: 'belongTo',
      title: '类型',
      render: key => ({
        0: '-',
        1: '自营仓',
        2: '三方仓',
        3: '云仓',
      }[key])
    },
    {
      dataIndex: 'buildType',
      title: '是否虚拟仓',
      render(i) {
        if (i === 1) return '否';
        if (i === 2) return '是';
        return '-'
      }
    },
    { dataIndex: '', title: '可存储类目', },
    {
      width: 180,
      dataIndex: 'contactList',
      title: '联系人',
      ellipsis: true,
      render: contactList => contactList && contactList.map(item => (
        <span className={styles.contact} key={item.userId}>
          {item.userName}({item.phone})
        </span>
      )),
    },
    {
      dataIndex: 'supportReturn',
      title: '支持退货',
      rener: key => ({
        0: '否',
        1: '是',
      }[key])
    },
    {
      dataIndex: 'status',
      title: '状态',
      render: key => ({
        'DRAFT': '草稿',
        'AUDIT': '审核中',
        'AUDIT_REJECT': '审核不通过',
        'AUDIT_PASS': '审核通过',
        'START_USING': '启用',
        'STOP_USING': '停用',
      }[key]),
    },
    {
      dataIndex: 'remark',
      title: '备注',
      render() {
        return <div className="etc">remark</div>
      }
    },
    {
      dataIndex: 'gmtModified',
      title: '更新时间',
      render: key => tools.formatDate(key).substr(0, 10)
    },
    { dataIndex: '', title: '备操作人注', },
    {
      title: '操作',
      fixed: 'right',
      render: ({ id, status }) => (
        <span>
          <Link to={`/my/warehousemanagement/check/${id}`} className="mr-5">查看</Link>
          <Link to={`/my/warehousemanagement/edit/${id}`} className="mr-5">编辑</Link>
          {status === 'START_USING'
            ? (
              <a style={{ display: 'none' }} onClick={() => this.handleDisable(id)} className="mr-5">停用</a>
            )
            : (
              <a onClick={() => this.handleEnable(id)} className="mr-5">启用</a>
            )
          }
          {'DRAFT|AUDIT_REJECT'.includes(status)
            ? (
              <a onClick={() => this.handleRemove(id)} className="mr-5">删除</a>
            )
            : null
          }
        </span>
      ),
    },
  ]

  componentDidMount() {
    this.handleInitOptionValue()
    this.requestList()
  }

  handleInitOptionValue = () => { // 搜索条件 回显 / 初始化
    const { record, form: { setFieldsInitialValue } } = this.props;
    record && setFieldsInitialValue(record)
  }

  handleBackupOptionValue = () => { // 备份 搜索条件
    const { dispatch, form: { getFieldsValue } } = this.props;
    const options = getFieldsValue()
    dispatch({ type: 'mywarehouse/updateState', payload: { record: options } })
  }

  handleSearch = () => {
    this.setState({ pageNum: 1 }, () => {
      this.requestList()
    })
  }

  requestList = () => {
    const { dispatch, form: { getFieldsValue } } = this.props;
    const { pageNum, pageSize } = this.state;
    const options = getFieldsValue()
    dispatch({
      type: 'mywarehouse/requestWarehouseList',
      payload: { ...options, pageNum, pageSize }
    })
  }

  handleChangeTable = ({ current: pageNum, pageSize }) => {
    this.setState({ pageNum, pageSize }, () => {
      this.requestList()
    })
  }

  createWarehouse = () => {
    this.handleBackupOptionValue()
    router.push('/my/warehousemanagement/create')
  }

  handleEnable = id => {
    const { dispatch } = this.props;
    dispatch && dispatch({
      type: 'mywarehouse/requestWarehouseEnable',
      id,
      success: () => {
        this.requestList()
      }
    })
  }

  handleDisable = id => {
    const { dispatch } = this.props;
    dispatch && dispatch({
      type: 'mywarehouse/requestWarehousDisnable',
      id,
      success: () => {
        this.requestList()
      }
    })
  }

  handleRemove = id => {
    tip.confirm('确定要删除此仓库吗？', {
      onOk: () => {
        const { dispatch } = this.props;
        dispatch && dispatch({
          type: 'mywarehouse/requestWarehousRemove',
          id,
          success: () => {
            this.requestList()
          }
        });
      },
    });
  }

  render() {
    const { pageNum, pageSize } = this.state;
    const { form, loading, list, total } = this.props;
    const { getFieldDecorator } = form;
    const tableLoading = loading.effects['mywarehouse/requestWarehouseList']

    return (
      <PageHeaderWrapper>
        <Card bodyStyle={{ padding: 16 }} bordered={false}>
          <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>

            <Row gutter={12}>
              <Col span={20}>
                <Row gutters={12} >
                  <Col span={5}>
                    <FormItem label="仓库编码">
                      {getFieldDecorator('warehouseCode')(
                        <Input maxLength={50} placeholder="请输入" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={5}>
                    <FormItem label="仓库名称">
                      {getFieldDecorator('warehouseName')(
                        <Input maxLength={50} placeholder="请输入" />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={4}>
                    <FormItem label="类型">
                      {getFieldDecorator('belongTo')(
                        <Select placeholder="请选择">
                          <Option value="">全部</Option>
                          <Option value={1}>自营仓</Option>
                          <Option value={2}>三方仓</Option>
                          <Option value={3}>云仓</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem label="是否虚拟仓">
                      {getFieldDecorator('buildType')(
                        <Select placeholder="请选择">
                          <Option value="">全部</Option>
                          <Option value={2}>是</Option>
                          <Option value={1}>否</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col span={4}>
                    <FormItem label="状态">
                      {getFieldDecorator('status')(
                        <Select placeholder="请选择">
                          <Option value="">全部</Option>
                          <Option value={0}>草稿</Option>
                          <Option value={1}>审核中</Option>
                          <Option value={2}>审核不通过</Option>
                          <Option value={3}>审核通过</Option>
                          <Option value={4}>启用</Option>
                          <Option value={5}>停用</Option>
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </Col>
              <Col span={4}>
                {/* <Row gutter={12}>
                  <Col span={8}>
                  <Button type="primary" onClick={this.handleSearch}>查询</Button>
                  </Col>
                  <Col span={16}>
                  <Button type="primary" icon="plus" onClick={this.createWarehouse}>新建仓库</Button>
                  </Col>
                </Row> */}
                <div className={styles['btn-area']}>
                  <Button type="primary" onClick={this.handleSearch}>查询</Button>
                  <Button type="primary" icon="plus" onClick={this.createWarehouse}>新建仓库</Button>
                </div>
              </Col>
            </Row>
          </Form>

          <Table
            rowKey="id"
            dataSource={list}
            columns={this.columns}
            scroll={{ x: 2500 }}
            onChange={this.handleChangeTable}
            loading={tableLoading}
            pagination={{
              pageSize,
              total,
              current: pageNum,
              showQuickJumper: true,
              showSizeChanger: true,
              showTotal: totalCount => (
                <span>共 {totalCount} 条记录 第 {pageNum} / {Math.ceil(totalCount / (pageSize))} 页</span>
              ),
            }}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default WarehouseManageMentList;
