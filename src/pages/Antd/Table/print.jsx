import React, { PureComponent } from 'react';
import { Row, Col, Table } from 'antd';

const dataSource = [
  {
    key: '1',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号',
  },
  {
    key: '2',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
  },
];

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '住址',
    dataIndex: 'address',
    key: 'address',
  },
];

class PrintArea extends PureComponent {
  render() {
    return (<div style={{ padding: 20 }}>
      <Row>
        <Col>
          <Table dataSource={dataSource} columns={columns} pagination={false} />
        </Col>
      </Row>
    </div>);
  }
}

export default PrintArea;
