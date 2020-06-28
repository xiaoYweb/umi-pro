import React, { useState, useCallback } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Form, Card, Row, Col, Table } from 'antd';
import { connect } from 'dva';
import { Link } from 'umi';
import MySelect from '@/components/SearchOptions/Select';
import Toast from '@/lib/Toast';
import styles from './index.less';

const FormItem = Form.Item;

const columns = [
  { title: '货主', dataIndex: 'key1' },
  { title: '到货通知单号', dataIndex: 'key2' },
  { title: '收货入库单号', dataIndex: 'key3' },
  { title: '供应商', dataIndex: 'key4' },
  { title: '单据状态', dataIndex: 'key5' },
  { title: '计划到货时间', dataIndex: 'key6' },
  { title: '单据生成时间', dataIndex: 'key7' },
  { title: '单据类型', dataIndex: 'key8' },
  { title: '备注', dataIndex: 'key9' },
  {
    title: '操作',
    render: record => (
      <span className={styles.caozuo}>
        <Link to="/putstorage/purchase/detail">明细查询</Link>
        <a onClick={() => this.handleFinish(record)}>收货完成</a>
        <a onClick={() => this.handleRefuse(record)}>整单拒收</a>
      </span>
    )
  }
]
function Purchase({ form, dispatch }) {
  const [buyerList, setBuyerList] = useState([])
  const [buyerLoading, setBuyerLoading] = useState(false)

  const handleBuyerSearch = useCallback(debounce(val => {
    setBuyerLoading(true)
    setBuyerList([])
    fetchProductList(val).then(res => {
      const list = res.map(item => ({ ...item, id: item.value }))
      setBuyerList(list)
      setBuyerLoading(false)
    })
  }))

  return (<PageHeaderWrapper className="page-wrapper">
    <Card bodyStyle={{ padding: 24 }} bordered={false}>
      <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} className={styles.form}>
        <Row gutter={12}>
          <Col span={6}>
            <MySelect propname="cargoOwnerId" wrapProps={{ label: '货主' }} list={buyerList} loading={buyerLoading} handleSearch={handleBuyerSearch} form={form} Wrap={FormItem} />
          </Col>
        </Row>

      </Form>
      <Table

      />
    </Card>
  </PageHeaderWrapper>)
}

export default connect(
  ({ loading }) => ({ loading })
)(Form.create()(Purchase));

const handleSearch = debounce((
  propname,
  val,
  fetchData,
  fixPropname = (arr => arr.map(item => ({ ...item, id: item.value })))
) => {
  const loadingName = `${propname}Loading`;
  const listName = `${propname}List`;
  const listCache = `${propname}Cache`;
  this.setState({ [loadingName]: true, [listName]: [] })
  const list = this[listCache][val];
  if (list) {
    this.setState({ [listName]: list, [loadingName]: false })
    return
  }
  fetchData(val).then(res => {
    const newList = fixPropname(res)
    this[listCache][val] = newList;
    this.setState({ [listName]: newList, })
  }).catch(err => {
    const msg = err && err.msg || '网络错误';
    Toast.error(msg)
    this.setState({ [listName]: [] })
  }).finally(() => {
    this.setState({ [loadingName]: false })
  })
}, 300);

function fetchProductList(n = 3) {
  const result = [
    { value: 1, label: '产品1' },
    { value: 2, label: '产品2' },
    { value: 3, label: '产品3' },
    { value: 4, label: '产品4' },
    { value: 5, label: '产品5' },
    { value: 6, label: '产品6' },
  ]

  return new Promise(resolve => {
    setTimeout(() => {
      resolve(result.slice(0, n))
    }, 300)
  })
}

function debounce(fn, delay = 300) {
  let timer;
  return function func(...r) {
    timer && clearTimeout(timer)
    setTimeout(() => {
      fn.apply(this, r)
    }, delay);
  }
}
