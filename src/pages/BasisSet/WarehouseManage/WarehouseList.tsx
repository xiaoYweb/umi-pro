import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { Card, Form, Button, Input, Table, Row, Col, Select } from 'antd';
import { ConnectState } from '@/models/connect';
import { PaginationProps } from 'antd/es/pagination';
import { ColumnProps } from 'antd/es/table';
import { router, Link } from 'umi';
import tools from '@/utils/tools';
import Toast from '@/lib/Toast';
import { WarehouseListProps, WarehouseListState } from './typings.d';
import { WarehouseModelState } from './models/warehouse';
import styles from './WarehouseList.less';

const FormItem = Form.Item;
const { Option } = Select;

// @ts-ignore
@connect(({ warehouselist, loading }: ConnectState) => ({
  ...warehouselist,
  loading,
}))
// @ts-ignore
@Form.create()
export default class WarehouseList extends Component<WarehouseListProps, WarehouseListState> {
  state: WarehouseListState = {
    pageNum: 1,
    pageSize: 10,
  };

  tableColumns: ColumnProps<any>[] = [
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
      render: (record: WarehouseModelState) => (
        <span>{record.longitude}, {record.latitude}</span>
      ),
    },
    {
      title: '类型',
      dataIndex: 'belongTo',
      render: (text: number) => [
        '-',
        '自营仓',
        '三方仓',
        '云仓',
      ][text],
    },
    {
      title: '是否虚拟仓',
      dataIndex: 'buildType',
      render: (text: number) => {
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
      render: (text: any[]) => text && text.map(item => (
        <p className={styles.contact} key={item.userId}>{item.userName}({item.phone})</p>
      )),
    },
    {
      title: '支持退货',
      dataIndex: 'supportReturn',
      render: (text: number) => (text ? '是' : '否'),
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (text: string) => ({
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
    },
    {
      title: '更新时间',
      dataIndex: 'gmtModified',
      render: (text: number) => tools.formatDate(text),
    },
    {
      title: '操作人',
      dataIndex: 'operatorName',
    },
    {
      width: 200,
      fixed: 'right',
      title: '操作',
      render: (record: WarehouseModelState) => (
        <span className={styles.caozuo}>
          <Link to={`/basisset/warehousemanage/look/${record.id}`}>查看</Link>
          <Link to={`/basisset/warehousemanage/edit/${record.id}`}>编辑</Link>
          {record.status === 'START_USING'
            ? (
              <a style={{ display: 'none' }} onClick={() => this.handleClickClose(record.id as string)}>停用</a>
            )
            : (
              <a onClick={() => this.handleClickOpen(record.id as string)}>启用</a>
            )
          }
          {'DRAFT|AUDIT_REJECT'.includes(record.status as string)
            ? (
              <a onClick={() => this.handleClickRemove(record.id as string)}>删除</a>
            )
            : null
          }
        </span>
      ),
    },
  ];

  componentDidMount() {
    this.fetchData(this.state);
  }

  handleClickOpen = (id: string) => {
    this.props.dispatch({
      type: 'warehouselist/turnOffWarehouse',
      payload: {
        id,
        on: true,
      },
      pagePayload: this.state,
    });
  }

  handleClickClose = (id: string) => {
    Toast.confirm('确定要停用此仓库吗？', {
      onOk: () => {
        this.props.dispatch({
          type: 'warehouselist/turnOffWarehouse',
          payload: {
            id,
            on: false,
          },
          pagePayload: this.state,
        });
      },
    });
  }

  handleClickRemove = (id: string) => {
    Toast.confirm('确定要删除此仓库吗？', {
      onOk: () => {
        this.props.dispatch({
          type: 'warehouselist/delWarehouse',
          payload: id,
          pagePayload: this.state,
        });
      },
    });
  }

  handleSubmit = () => { // search
    let payload = this.props.form.getFieldsValue();
    payload = {
      ...this.state,
      ...payload,
      pageNum: 1,
    };
    this.setState(payload as WarehouseListState);
    this.fetchData(payload as WarehouseListState);
  }

  handleCreate = () => { // new warehouse
    router.push('/basisset/warehousemanage/create');
  }

  handleChangeTable = (pagination: PaginationProps) => { // page change
    const payload: WarehouseListState = {
      ...this.state,
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
    };
    this.setState(payload);
    this.fetchData(payload);
  }

  fetchData(payload: WarehouseListState) { // dispatch fetchlist
    window.scrollTo(0, 0);
    this.props.dispatch({
      type: 'warehouselist/fetchList',
      payload,
    });
  }

  render() {
    const { pageNum, pageSize } = this.state;
    const { list, totalRecord, loading } = this.props;
    const { getFieldDecorator } = this.props.form;
    const tableLoading = loading.effects['warehouselist/fetchList'];

    return (
      <PageHeaderWrapper className="page-wrapper">
        <Card bodyStyle={{ padding: 16 }} bordered={false}>
          <div className={styles.wrapper}>
            
            <Form
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              className={styles.form}
            >
              <Row gutter={8}>
                <Col span={5}>
                  <FormItem label="仓库编码">
                    {getFieldDecorator('warehouseCode', {
                    })(<Input maxLength={50} placeholder="请输入" />)}
                  </FormItem>
                </Col>
                <Col span={5}>
                  <FormItem label="仓库名称">
                    {getFieldDecorator('warehouseName', {
                    })(<Input maxLength={50} placeholder="请输入" />)}
                  </FormItem>
                </Col>
                <Col span={4}>
                  <FormItem label="类型">
                    {getFieldDecorator('belongTo', {
                    })(
                      <Select placeholder="请选择">
                        <Option value="">全部</Option>
                        <Option value={1}>自营仓</Option>
                        <Option value={2}>三方仓</Option>
                        <Option value={3}>云仓</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={5}>
                  <FormItem
                    labelCol={{ span: 10 }}
                    wrapperCol={{ span: 14 }}
                    label="是否虚拟仓"
                  >
                    {getFieldDecorator('buildType', {
                    })(
                      <Select placeholder="请选择">
                        <Option value="">全部</Option>
                        <Option value={2}>是</Option>
                        <Option value={1}>否</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={5}>
                  <FormItem label="状态">
                    {getFieldDecorator('status', {
                    })(
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

            <div className={styles.search}>
              <Button
                onClick={this.handleSubmit}
                style={{ marginRight: 10 }}
                type="primary"
              >查 询</Button>

              <Button
                onClick={this.handleCreate}
                icon="plus"
                type="primary"
              >新建仓库</Button>
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
                <span>共 {total} 条记录 第 {pageNum} / {Math.ceil(total / (pageSize as number))} 页</span>
              ),
            }}
          />
          
        </Card>
      </PageHeaderWrapper>
    );
  }
}
