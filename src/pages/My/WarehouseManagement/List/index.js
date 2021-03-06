import React, { PureComponent } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Form, Row, Col, Input, Select, Button, Table } from 'antd';
import { connect } from 'dva';
import classNames from 'classNames';
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
    { dataIndex: 'id', title: '仓库ID', fixed: 'left', },
    { dataIndex: 'warehouseName', title: '仓库名称', fixed: 'left' },
    { dataIndex: 'warehouseCode', title: '仓库编码', },
    {
      dataIndex: 'address',
      title: '仓库地址',
      render() {
        return <div className="etc">address</div>
      }
    },
    {
      title: '经纬度',
      render: ({ latitude, longitude }) => (<>
        <div>{latitude}</div>
        <div>{longitude}</div>
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
      dataIndex: 'contactList',
      title: '联系人',
      render: contactList => contactList && contactList.map(item => (
        <p className={styles.contact} key={item.userId}>
          {item.userName}({item.phone})
        </p>
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
      render: key => tools.formatDate(key)
    },
    { dataIndex: '', title: '备操作人注', },
    {
      title: '操作',
      fixed: 'right',
      render: ({ id, status }) => (
        <span>
          <Link to={`/my/warehousemanagement/detail/${id}`} className="mr-5">查看</Link>
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
    this.requestList()
  }

  handleSearch = () => {
    this.setState({ pageNum: 1 }, () => {
      this.requestList()
    })
  }

  requestList = () => {
    const { dispatch, form: { getFieldsValue } } = this.props;
    const { pageNum, pagesize } = this.state;
    const options = getFieldsValue()
    dispatch({
      type: 'mywarehouse/requestWarehouseList',
      payload: { ...options, pageNum, pagesize }
    })
  }

  handleChangeTable = ({ current: pageNum, pagesize }) => {
    this.setState({ pageNum, pagesize }, () => {
      this.requestList()
    })
  }

  createWarehouse = () => {
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
    const { dispatch } = this.props;
    tip.confirm('确定要删除此仓库吗？', {
      onOk: () => {
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
          <section className="flex fyc">
            <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
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
            </Form>
            <div className={classNames(styles['btn-area'], 'flex')}>
              <Button type="primary" onClick={this.handleSearch}>查询</Button>
              <Button type="primary" icon="plus" onClick={this.createWarehouse}>新建仓库</Button>
            </div>
          </section>
          <Table
            rowKey="id"
            dataSource={list}
            columns={this.columns}
            scroll={{ x: 2300 }}
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
