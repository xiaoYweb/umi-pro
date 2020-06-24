import React, { PureComponent } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Table, Descriptions } from 'antd';
import { connect } from 'dva';
import { router } from 'umi';

// @ts-ignore
@connect(({ loading, purchase }) => ({ loading, ...purchase }))

class Detail extends PureComponent {
  columns = [
    { title: '商品编码', dataIndex: 'skuCode' },
    { title: '商品条码', dataIndex: 'skuBarCode' },
    { title: '商品名称', dataIndex: 'skuName' },
    { title: '规格', dataIndex: 'spec' },
    { title: '单位', dataIndex: 'unit' },
    { title: '应收数量', dataIndex: 'preArrivalQty' },
    { title: '实收数量', dataIndex: 'arrivalQty' },
    { title: '良品', dataIndex: 'qualifiedQty' },
    { title: '不良品', dataIndex: 'unqualifiedQty' },
  ]

  state = {
    pageNum: 1,
    pageSize: 10
  }

  componentDidMount() {
    this.requestDetail()
  }

  requestDetail = () => {
    const { dispatch } = this.props;
    const id = this.props.computedMatch?.params?.id;
    if (!id) return
    dispatch({ type: 'purchase/requestGetDetail', payload: { inStorageOrderId: id } })
  }

  handlePageChange = pagination => { // 切换 采购入库单列表 页码
    const payload = {
      ...this.state, // 存在 pageSize 变化 pageNum不变化情况 覆盖一遍比较稳妥
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
    };
    this.setState(payload, () => {
      this.requestDetail()
    });
  }

  handleBack = () => {
    router.push('/my/instorage')
  }

  render() {
    const { pageNum, pageSize } = this.state;
    const { detail, detailTotal, detialList } = this.props;
    return (<PageHeaderWrapper onBack={this.handleBack} title="入库单明细">
      <Card>
        <Descriptions>
          <Descriptions.Item label="到货通知单号"> {detail?.bizBillNo || '--'}</Descriptions.Item>
          <Descriptions.Item label="收货入库单号"> {detail?.inStorageNo || '--'}</Descriptions.Item>
          <Descriptions.Item label="供应商"> {detail?.supplierName || '--'}</Descriptions.Item>
          <Descriptions.Item label="顾客"> {detail?.cargoOwnerName || '--'}</Descriptions.Item>
          <Descriptions.Item label="发货地址"> {detail?.receivingAddress || '--'}</Descriptions.Item>
        </Descriptions>
        <Table
          dataSource={detialList}
          columns={this.columns}
          onChange={this.handlePageChange}
          pagination={{
            current: pageNum,
            pageSize,
            total: detailTotal,
            pageSizeOptions: ['2', '4'],
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: totalCount => <span>共 {totalCount} 条记录 第 {pageNum} / {
              Math.ceil(totalCount / pageSize)
            } 页</span>
          }}
        />
      </Card>
    </PageHeaderWrapper>);
  }
}

export default Detail;
