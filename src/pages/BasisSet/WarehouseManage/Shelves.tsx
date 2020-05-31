import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { Card, Form, Button, Input, Table, Row, Col, Select } from 'antd';
import { ConnectState } from '@/models/connect';
import { PaginationProps } from 'antd/es/pagination';
import { ColumnProps } from 'antd/es/table';
import { Link } from 'umi';
import Toast from '@/lib/Toast';
import tools from '@/utils/tools';
import { ShelvesProps, ShelvesState } from './typings.d';
import styles from './Shelves.less';
import AreaModal from './components/AreaModal';

const FormItem = Form.Item;
const { Option } = Select;

// @ts-ignore
@connect(({ shelves, loading }: ConnectState) => ({
  ...shelves,
  loading,
}))
// @ts-ignore
@Form.create()
export default class Shelves extends Component<ShelvesProps, ShelvesState> {
  static getDerivedStateFromProps(props: ShelvesProps, state: ShelvesState) {
    if (!state.floorId && props.floors && props.floors.length) {
      return {
        floorId: props.floors[0].tab,
      };
    }

    return null;
  }

  state: ShelvesState = {
    modalVisible: false,
    pageNum: 1,
    pageSize: 10,
  };

  tableColumns: ColumnProps<any>[] = [
    {
      title: '库区ID',
      dataIndex: 'id',
    },
    {
      title: '库区编码',
      dataIndex: 'areaCode',
    },
    {
      title: '温控',
      dataIndex: 'temperatureType',
      render: text => ({
        'NORMAL': '常温',
        'REFRIGERATION': '冷藏',
      }[text]),
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: text => ({
        'VALID': '启用',
        'INVALID': '停用',
      }[text]),
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
      title: '操作',
      render: record => {
        let cont;
        if (record.status === 'VALID') {
          cont = <a onClick={() => this.handleClickClose(record)}>停用</a>;
        } else if (record.status === 'INVALID') {
          cont = (<>
            <a onClick={() => this.handleClickOpen(record)}>启用</a>
            <a onClick={() => this.handleClickEdit(record)}>编辑</a>
            <a onClick={() => this.handleClickRemove(record)}>删除</a>
          </>);
        }

        return (
          <span className={styles.caozuo}>
            <Link style={{ display: 'none' }} to={`/basisset/warehousemanage/look/${record.id}`}>库位管理</Link>
            {cont}
          </span>
        );
      },
    },
  ];

  componentDidMount() {
  }

  handleClickOpen = (area: any) => {
    const { dispatch } = this.props
    dispatch && dispatch({
      type: 'areas/onOffArea',
      payload: {
        id: area.id,
        on: true,
      },
    });
  }

  handleClickClose = (area: any) => {
    Toast.confirm('你真的要停用此库区吗?', {
      onOk: () => {
        const { dispatch } = this.props
        dispatch && dispatch({
          type: 'areas/onOffArea',
          payload: {
            id: area.id,
            on: false,
          },
        });
      },
    });
  }

  handleClickEdit = (area: any) => {
    this.setState({
      modalVisible: true,
      modalId: area.id,
    });
  }

  handleClickRemove = (area: any) => {
    Toast.confirm('你确定要删除此库区吗?', {
      onOk: () => {
        const { modalId, modalVisible, ...pagePayload } = this.state;
        const { dispatch } = this.props
        dispatch && dispatch({
          type: 'areas/delArea',
          payload: area.id,
          pagePayload,
        });
      },
    });
  }

  handleSubmit = () => {
    let payload = this.props.form.getFieldsValue();
    payload = {
      ...this.state,
      ...payload,
      pageNum: 1,
    };
    this.setState(payload as ShelvesState);
    this.fetchData(payload as ShelvesState);
  }

  handleCreate = () => {
  }

  handleChangeTable = (pagination: PaginationProps) => {
    const payload: ShelvesState = {
      ...this.state,
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
    };
    this.setState(payload);
    this.fetchData(payload);
  }

  handleChangeTabs = (key: string) => {
    const payload = {
      pageNum: 1,
      pageSize: 10,
      floorId: key,
    };
    this.props.form.resetFields();
    this.setState(payload);
    this.fetchData(payload as ShelvesState);
  }

  handleCloseNew = () => {
    this.setState({
      modalVisible: false,
      modalId: undefined,
    });
  }

  handleSaveNew = () => {
    this.handleCloseNew();
    this.fetchData(this.state);
  }

  handleOpenNew = () => {
    this.setState({
      modalId: undefined,
      modalVisible: true,
    });
  }

  fetchData(params: ShelvesState) {
    const { modalVisible, modalId, ...payload } = params;
    window.scrollTo(0, 0);
    const { dispatch } = this.props
    dispatch && dispatch({
      type: 'areas/fetchAreaList',
      payload,
    });
  }

  render() {
    const { pageNum, pageSize, floorId, modalVisible, modalId } = this.state;
    const { list = [], totalRecord, floors, loading } = this.props;
    const { getFieldDecorator } = this.props.form;
    const tableLoading = loading.effects['areas/fetchAreaList'];
    const iobj = modalId && list.find(item => item.id === modalId);
    let temperatureType;
    if (iobj && iobj.temperatureType === 'NORMAL') {
      temperatureType = 1;
    } else if (iobj && iobj.temperatureType === 'REFRIGERATION') {
      temperatureType = 2;
    }
    const params = {
      floorId,
      id: modalId,
      temperatureType,
    };

    return (
      <PageHeaderWrapper
        tabActiveKey={floorId}
        tabList={floors}
        onTabChange={this.handleChangeTabs}
        className="page-wrapper"
      >
        <Card bodyStyle={{ padding: 16 }} bordered={false}>
          <div className={styles.wrapper}>
            <Form
              labelCol={{ span: 9 }}
              wrapperCol={{ span: 15 }}
              className={styles.form}
            >
              <Row gutter={8}>
                <Col span={5}>
                  <FormItem label="库区编码">
                    {getFieldDecorator('areaCode', {
                    })(<Input maxLength={50} placeholder="请输入" />)}
                  </FormItem>
                </Col>
                <Col span={5}>
                  <FormItem label="库位编码">
                    {getFieldDecorator('areaCode', {
                    })(<Input maxLength={50} placeholder="请输入" />)}
                  </FormItem>
                </Col>
                <Col span={5}>
                  <FormItem label="货架类型">
                    {getFieldDecorator('status', {
                    })(
                      <Select placeholder="请选择">
                        <Option value="">全部</Option>
                        <Option value={1}>有效</Option>
                        <Option value={0}>无效</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={5}>
                  <FormItem label="库位类型">
                    {getFieldDecorator('status', {
                    })(
                      <Select placeholder="请选择">
                        <Option value="">全部</Option>
                        <Option value={1}>有效</Option>
                        <Option value={0}>无效</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={4}>
                  <FormItem label="状态">
                    {getFieldDecorator('status', {
                    })(
                      <Select placeholder="请选择">
                        <Option value="">全部</Option>
                        <Option value={1}>有效</Option>
                        <Option value={0}>无效</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Form>
            <div className={styles.search}>
              <Button
                onClick={this.handleSubmit}
                type="primary"
              >查询</Button>
            </div>
          </div>
          <div className={styles.btnbox}>
            <Button
              onClick={this.handleOpenNew}
              style={{ marginRight: 16 }}
              type="primary"
            >启用</Button>
            <Button
              onClick={this.handleCreate}
              type="primary"
            >停用</Button>
          </div>
          <Table
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
        <AreaModal
          visible={modalVisible}
          onClose={this.handleCloseNew}
          onSave={this.handleSaveNew}
          params={params}
        />
      </PageHeaderWrapper>
    );
  }
}
