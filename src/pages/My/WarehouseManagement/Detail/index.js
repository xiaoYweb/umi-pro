import React, { PureComponent } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Form, Input, Select } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ loading, mywarehouse }) => ({ loading, ...mywarehouse }))
@Form.create()

class WarehouseManageDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (<PageHeaderWrapper>
      <Card >
        <Form labelCol={{ span: 4 }} wrapperCol={{ span: 10 }}>
          <FormItem label="仓库名称">
            {getFieldDecorator('warehouseName')(
              <Input maxLength={50} placeholder="请输入" />
            )}
          </FormItem>
          <FormItem label="仓库编码">
            {getFieldDecorator('warehouseCode')(
              <Input maxLength={50} placeholder="请输入" />
            )}
          </FormItem>
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
        </Form>
      </Card>
    </PageHeaderWrapper>);
  }
}

export default WarehouseManageDetail;
