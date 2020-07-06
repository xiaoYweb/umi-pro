import React, { useState, useEffect } from 'react';
import Wrap from '@/components/MainWrap';
import { Table, Descriptions, Form } from 'antd';
import { connect } from 'dva';
import { router } from 'umi';

const columns = [
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

function Detail(props) {
  const [pageNum, setPageNum] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const { detail, detailTotal, detialList } = props;

  const requestDetail = () => {
    const { dispatch, computedMatch } = props;
    const inStorageOrderId = computedMatch?.params?.id;
    inStorageOrderId && dispatch({
      type: 'purchase/requestGetDetail',
      payload: {
        inStorageOrderId
      }
    })
  }

  useEffect(() => {
    requestDetail()
  }, [])

  const handlePageChange = ({ current, pageSize: size }) => { // 切换 采购入库单列表 页码
    current && setPageNum(current)
    size && setPageSize(size)
    requestDetail()
  }

  const handleBack = () => {
    router.push('/putstorage/purchase/list')
  }

  return <Wrap handleBack={handleBack} title="入库单明细">
    <Descriptions>
      <Descriptions.Item label="到货通知单号"> {detail?.bizBillNo || '--'}</Descriptions.Item>
      <Descriptions.Item label="收货入库单号"> {detail?.inStorageNo || '--'}</Descriptions.Item>
      <Descriptions.Item label="供应商"> {detail?.supplierName || '--'}</Descriptions.Item>
      <Descriptions.Item label="顾客"> {detail?.cargoOwnerName || '--'}</Descriptions.Item>
      <Descriptions.Item label="发货地址"> {detail?.receivingAddress || '--'}</Descriptions.Item>
    </Descriptions>
    
    <Table
      dataSource={detialList}
      columns={columns}
      onChange={handlePageChange}
      pagination={{
        current: pageNum,
        pageSize,
        total: detailTotal,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: totalCount => <span>共 {totalCount} 条记录 第 {pageNum} / {
          Math.ceil(totalCount / (pageSize))
        } 页</span>
      }}
    />
  </Wrap>
}

export default connect(({ loading }) => ({ loading }))(
  Form.create()(Detail)
)
