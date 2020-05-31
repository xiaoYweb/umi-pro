import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { Card, Form, Button, Input, Table, Row, Col, Select } from 'antd';
import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ goodslist, loading }) => ({
  ...goodslist,
  loading,
}))
@Form.create()


class GoodsDataManage extends Component {
  state = {
    pageNum: 1,
    pageSize: 10
  }

  tableColumns = [
    {
      title: '序号',
      width: 140,
      dataIndex: 'key',
      render(...r) {
        return r[2]
      }
    },
    {
      width: 140,
      title: '商品编码',
      dataIndex: 'code',
    },
    {
      title: '商品名称',
      dataIndex: 'name',
    },
    {
      title: '规格',
      dataIndex: 'spec',
      render() {
        return (<div><span>红色；</span><span>L</span></div>)
      }
    },
    {
      title: '品牌',
      dataIndex: 'brand',
    },
    {
      title: '厂家编码',
      dataIndex: 'menufacturersCode',
    },
    {
      title: '条形码',
      dataIndex: 'barcode',
    },
    {
      title: '直播价',
      dataIndex: 'price',
    },
    {
      title: '商品类目',
      dataIndex: 'goodsCategory',
    },
    {
      title: '仓库类目',
      dataIndex: 'warehouseCategory',
    },
    {
      title: '仓库',
      dataIndex: 'warehouse',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
    },
  ];

  componentDidMount() {
    this.requsetList(this.state)
  }

  requsetList = payload => {
    window.scrollTo(0, 0);
    this.props.dispatch({ type: 'goodslist/requestList', payload })
  }

  handleSearch = () => {

  }

  onSelectChange = () => {

  }

  handleCreate = () => {
    // 新建供应商 一期暂时不做
  }

  handlePageChange = pagination => {
    const payload = {
      ...this.state,
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
    };
    this.setState(payload, () => {
      this.requsetList(payload)
    });
  }

  render() {
    const { pageNum, pageSize } = this.state;
    const { list, totalRecord, loading } = this.props;
    const { getFieldDecorator } = this.props.form;

    const tableLoading = loading.effects['goodslist/requestList'];

    return (<PageHeaderWrapper className="page-wrapper">
      <Card bodyStyle={{ padding: 16 }} bordered={false}>
        <div className={styles.wrapper}>
          <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} className={styles.form}>
            <Row gutter={8}>
              <Col span={5}>
                <FormItem label="仓库">
                  {getFieldDecorator('supplierStatus', {
                  })(
                    <Select placeholder="请选择">
                      <Option value={1}>仓库1</Option>
                      <Option value={2}>仓库2</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={5}>
                <FormItem label="商品ID">
                  {getFieldDecorator('supplierCode', {
                  })(<Input maxLength={50} placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col span={5}>
                <FormItem label="商品名称">
                  {getFieldDecorator('supplierName', {
                  })(<Input maxLength={50} placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col span={5}>
                <FormItem label="商品分类">
                  {getFieldDecorator('supplierType', {
                  })(
                    <Select placeholder="请选择">
                      <Option value={1}>栈板</Option>
                      <Option value={2}>容器</Option>
                      <Option value={3}>容车</Option>
                      <Option value={4}>拣选车</Option>
                      <Option value={5}>PDA</Option>
                      <Option value={6}>PDA柜</Option>
                      <Option value={7}>手拉地牛</Option>
                      <Option value={8}>电动地牛</Option>
                      <Option value={9}>平衡重叉</Option>
                      <Option value={10}>高位叉车</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={4}>
                <FormItem label="状态">
                  {getFieldDecorator('supplierStatus', {
                  })(
                    <Select placeholder="请选择">
                      <Option value="">全部</Option>
                      <Option value={1}>启用</Option>
                      <Option value={2}>停用</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
          <div style={{ marginLeft: 20 }}>
            <Button onClick={this.handleSearch} style={{ marginRight: 10 }} type="primary">查 询</Button>
            {/* <Button onClick={this.handleCreate} icon="plus" type="primary">新建供应商</Button> */}
          </div>
        </div>

        <Table
          rowKey="key"
          columns={this.tableColumns}
          dataSource={list}
          onChange={this.handlePageChange}
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

export default GoodsDataManage;
