import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Form, Button, Input, Table, Row, Col, Select } from 'antd';
import { connect } from 'dva';
import { router, Link } from 'umi';
import tools from '@/utils/tools';
import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ test, loading }) => ({ loading, ...test }))
@Form.create()
class TestList extends Component {
  tableColumns = [
    {
      title: '仓库ID',
      dataIndex: 'id',
      width: 140,
      fixed: 'left',
    },
    {
      width: 140,
      fixed: 'left',
      title: '仓库名称',
      dataIndex: 'warehouseName',
    },
    {
      title: '仓库编码',
      dataIndex: 'warehouseCode',
    },
    {
      title: '仓库地址',
      dataIndex: 'address',
    },
    {
      title: '经纬度',
      render: record => (
        <span>{record.longitude}, {record.latitude}</span>
      ),
    },
    {
      title: '类型',
      dataIndex: 'belongTo',
      render: text => [
        '-',
        '自营仓',
        '三方仓',
        '云仓',
      ][text],
    },
    {
      title: '是否虚拟仓',
      dataIndex: 'buildType',
      render: text => {
        if (text === 1) {
          return '否';
        }
        if (text === 2) {
          return '是';
        }
        return '-';
      },
    },
    {
      title: '可存储类目',
      dataIndex: 'categoryList',
    },
    {
      title: '联系人',
      dataIndex: 'contactList',
      render: text => text && text.map(item => (
        <p className={styles.contact} key={item.userId}>{item.userName}({item.phone})</p>
      )),
    },
    {
      title: '支持退货',
      dataIndex: 'supportReturn',
      render: text => (text ? '是' : '否'),
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: text => ({
        'DRAFT': '草稿',
        'AUDIT': '审核中',
        'AUDIT_REJECT': '审核不通过',
        'AUDIT_PASS': '审核通过',
        'START_USING': '启用',
        'STOP_USING': '停用',
      }[text]),
    },
    {
      title: '备注',
      dataIndex: 'remark',
      render: text => (
        <div className={styles.etc} title={text}>{text}</div>
      )
    },
    {
      title: '更新时间',
      dataIndex: 'gmtModified',
      render: text => tools.formatDate(text),
    },
    {
      title: '操作人',
      dataIndex: 'operatorName',
    },
    {
      width: 200,
      fixed: 'right',
      title: '操作',
      render: record => (
        <span className={styles.caozuo}>
          <Link to={`/basisset/test/look/${record.id}`}>查看</Link>
          <Link to={`/basisset/test/edit/${record.id}`}>编辑</Link>
          {record.status === 'START_USING'
            ? (
              <a style={{ display: 'none' }} onClick={() => this.handleDisable(record.id)}>停用</a>
            )
            : (
              <a onClick={() => this.handleEnable(record.id)}>启用</a>
            )
          }
          {'DRAFT|AUDIT_REJECT'.includes(record.status)
            ? (
              <a onClick={() => this.handleReamove(record.id)}>删除</a>
            )
            : null
          }
        </span>
      ),
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      pageNum: 1,
      pageSize: 10
    }
  }

  componentDidMount() {
    this.getList(this.state)
  }

  getList = payload => {
    window.scrollTo(0, 0);
    this.props.dispatch({ type: 'test/requestList', payload })
  }

  handleSearch = () => {
    const options = this.props.form.getFieldsValue();
    const payload = {
      ...this.state,
      ...options,
      pageNum: 1
    }
    this.getList(payload)
  }

  handleCreate = () => {
    router.push('/basisset/test/create');
  }

  handleChangeTable = ({ current, pageSize }) => {
    this.setState({ pageNum: current, pageSize }, () => {
      this.getList(this.state)
    })
  }

  handleEnable = id => {
    return id
  }

  handleDisable = id => {
    return id
  }

  handleReamove = id => {
    return id
  }

  render() {
    const { pageNum, pageSize } = this.state;
    const { list, totalRecord, loading } = this.props;
    const { getFieldDecorator } = this.props.form;
    const tableLoading = loading.effects['test/requestList'];

    return (<PageHeaderWrapper>
      <Card bodyStyle={{ padding: 16 }} bordered={false}>
        <div className={styles.wrapper}>
          <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} className={styles.form}>
            <Row gutter={10}>
              <Col span={5}>
                <FormItem label="仓库编码">
                  {getFieldDecorator('warehouseCode')(<Input maxLength={50} placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col span={5}>
                <FormItem label="仓库名称">
                  {getFieldDecorator('warehouseName')(<Input maxLength={50} placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem label="类型">
                  {getFieldDecorator('warehouseType')(<Select placeholder="请选择">
                    <Option value="">全部</Option>
                    <Option value={1}>自营仓</Option>
                    <Option value={2}>三方仓</Option>
                    <Option value={3}>云仓</Option>
                  </Select>)}
                </FormItem>
              </Col>
              <Col span={5}>
                <FormItem label="是否虚拟">
                  {getFieldDecorator('isReal')(<Select placeholder="请选择">
                    <Option value="">全部</Option>
                    <Option value={1}>是</Option>
                    <Option value={2}>否</Option>
                  </Select>)}
                </FormItem>
              </Col>
              <Col span={5}>
                <FormItem label="状态">
                  {getFieldDecorator('warehouseStatus')(<Select placeholder="请选择">
                    <Option value="">全部</Option>
                    <Option value={0}>草稿</Option>
                    <Option value={1}>审核中</Option>
                    <Option value={2}>审核不通过</Option>
                    <Option value={3}>审核通过</Option>
                    <Option value={4}>启用</Option>
                    <Option value={5}>停用</Option>
                  </Select>)}
                </FormItem>
              </Col>
            </Row>

          </Form>
          <div className={styles['btn-area']}>
            <Button type="primary" onClick={this.handleSearch}>查询</Button>
            <Button type="primary" icon="plus" onClick={this.handleCreate}>新增仓库</Button>
          </div>
        </div>
        <Table
          scroll={{ x: 2200 }}
          rowKey="id"
          columns={this.tableColumns}
          dataSource={list}
          onChange={this.handleChangeTable}
          loading={tableLoading}
          pagination={{
            pageSize,
            total: totalRecord,
            current: pageNum,
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: total => (
              <span>共 {total} 条记录 第 {pageNum} / {Math.ceil(total / (pageSize))} 页</span>
            ),
          }}
        />
      </Card>

    </PageHeaderWrapper>);
  }
}

export default TestList;
