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
import styles from './Areas.less';
import AreaModal from './components/AreaModal';
import { AreasProps, AreasState } from './typings.d';

const FormItem = Form.Item;
const { Option } = Select;

// @ts-ignore
@connect(({ areas, loading }: ConnectState) => ({
  ...areas,
  loading,
}))
// @ts-ignore
@Form.create()
export default class Areas extends Component<AreasProps, AreasState> {
  static getDerivedStateFromProps(props: AreasProps, state: AreasState) {
    if (!state.floorName && props.floors && props.floors.length) {
      return {
        floorName: props.floors[0].tab,
      };
    }

    return null;
  }

  state: AreasState = {
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
          cont = <a style={{ display: 'none' }} onClick={() => this.handleClickClose(record)}>停用</a>;
        } else if (record.status === 'INVALID' || record.status === 'INIT') {
          cont = (<>
            <a onClick={() => this.handleClickOpen(record)}>启用</a>
            <a onClick={() => this.handleClickEdit(record)}>编辑</a>
            <a style={{ display: 'none' }} onClick={() => this.handleClickRemove(record)}>删除</a>
          </>);
        }

        return (
          <span className={styles.caozuo}>
            <Link to={`/basisset/shelvesmanage/list/${record.id}`}>库位管理</Link>
            {cont}
          </span>
        );
      },
    },
  ];

  componentDidMount() {
    const { modalVisible, ...pagePayload } = this.state;
    this.props.dispatch({
      type: 'areas/fetchFloors',
      pagePayload,
    });
  }

  handleClickOpen = (area: any) => {
    this.props.dispatch({
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
        this.props.dispatch({
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
        this.props.dispatch({
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
    this.setState(payload as AreasState);
    this.fetchData(payload as AreasState);
  }

  handleCreate = () => {
  }

  handleChangeTable = (pagination: PaginationProps) => {
    const payload: AreasState = {
      ...this.state,
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
    };
    this.setState(payload);
    this.fetchData(payload);
  }

  handleChangeTabs = (key: string) => {
    const payload = {
      areaCode: '',
      status: undefined,
      pageNum: 1,
      pageSize: 10,
      floorName: key,
    };
    this.props.form.resetFields();
    this.setState(payload);
    this.fetchData(payload as AreasState);
  }

  handleCloseNew = () => {
    this.setState({
      modalVisible: false,
      modalId: undefined,
    });
  }

  handleSaveNew = () => {
    this.fetchData(this.state);
  }

  handleOpenNew = () => {
    this.setState({
      modalId: undefined,
      modalVisible: true,
    });
  }

  fetchData(params: AreasState) {
    const { modalVisible, modalId, ...payload } = params;
    window.scrollTo(0, 0);
    this.props.dispatch({
      type: 'areas/fetchAreaList',
      payload,
    });
  }

  render() {
    const { pageNum, pageSize, floorName, modalVisible, modalId } = this.state;
    const { list = [], totalRecord, floors, loading } = this.props;
    const { getFieldDecorator } = this.props.form;
    const tableLoading = loading.effects['areas/fetchAreaList'];
    const iobj = modalId && list.find(item => item.id === modalId);
    const params = {
      floorName,
      id: modalId,
      temperatureType: iobj && iobj.temperatureType,
      areaCode: iobj && iobj.areaCode,
    };

    return (
      <PageHeaderWrapper
        tabActiveKey={floorName}
        tabList={floors}
        onTabChange={this.handleChangeTabs}
        className="page-wrapper"
      >
        <Card bodyStyle={{ padding: 16 }} bordered={false}>
          <div className={styles.wrapper}>
            <Form
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              className={styles.form}
            >
              <Row gutter={8}>
                <Col span={7}>
                  <FormItem label="库区编码">
                    {getFieldDecorator('areaCode', {
                    })(<Input maxLength={50} placeholder="请输入" />)}
                  </FormItem>
                </Col>
                <Col span={6}>
                  <FormItem label="状态">
                    {getFieldDecorator('status', {
                    })(
                      <Select placeholder="请选择">
                        <Option value="">全部</Option>
                        <Option value={1}>启用</Option>
                        <Option value={0}>停用</Option>
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
                onClick={this.handleOpenNew}
                style={{ marginRight: 10 }}
                icon="plus"
                type="primary"
              >新建库区</Button>
              <Button
                onClick={this.handleCreate}
                type="primary"
              >下载库区导入模板</Button>
            </div>
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
