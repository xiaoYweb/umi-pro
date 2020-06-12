import React, { PureComponent } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Form, Input, Select, Radio, Spin, Button, Cascader } from 'antd';
import { connect } from 'dva';
import { router } from 'umi';

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

@connect(({ loading, mywarehouse }) => ({ loading, ...mywarehouse }))
@Form.create()

class WarehouseManageDetail extends PureComponent {
  constructor(props) {
    super(props);
    const { computedMatch: { params, url } } = props;
    this.state = {
      current: ['checkt', 'detail', 'create'].find(name => url.includes(name)),
      id: params?.id
    }
  }

  handleSearchContact = () => {

  }

  handleSave = () => { // 保存
    const { current, id } = this.state;
    const { dispatch, form: { validateFields } } = this.props;
    validateFields((err, values) => {
      if (!err) {
        console.log('values', values)
        if (current === 'edit' && id) {
          this.handleSaveEdit(id)
          return
        }
        current === 'create' && dispatch({
          type: 'mywarehouse/requestSaveWarehouse',
          success: () => {
            this.handleCancel()
          }
        })
      }
    })
  }

  handleSaveEdit = id => { // 编辑保存
    const { dispatch, form: { getFieldsValue } } = this.props;
    const options = getFieldsValue();

    dispatch({
      type: 'mywarehouse/requestUpdateWarehouse',
      payload: {
        ...options,
        id,
      },
      success: () => {
        this.handleCancel()
      }
    })
  }

  handleCancel = () => {
    router.push('/my/warehousemanagement/list')
  }

  render() {
    const { current } = this.state;
    const { form: { getFieldDecorator } } = this.props;

    const disabled = current === 'check';
    return (<PageHeaderWrapper>
      <Card >
        <Form labelCol={{ span: 4 }} wrapperCol={{ span: 10 }}>
          <FormItem label="仓库名称">
            {getFieldDecorator('warehouseName', {
              rules: [
                { required: true, message: '请填写仓库名称' },
                { pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]+$/, message: '只允许输入(中英文、数字)', max: 30 },
              ]
            })(
              <Input maxLength={30} placeholder="请输入" />
            )}
          </FormItem>
          <FormItem label="仓库编码">
            {getFieldDecorator('warehouseCode', {
              rules: [
                { required: true, message: '请填写仓库编码' },
                { pattern: /^[a-zA-Z0-9]+$/, message: '只允许输入(英文、数字) 最多8个字符', max: 8 },
              ]
            })(
              <Input maxLength={8} placeholder="请输入" />
            )}
          </FormItem>
          <FormItem label="仓库地址">
            {getFieldDecorator('county', {
              rules: [
                { required: true, message: '必填项' },
              ],
            })(
              <Cascader
                disabled={disabled}
                fieldNames={{ label: 'name', value: 'code' }}
                options={[]}
                placeholder="请输入"
              />
            )}
          </FormItem>
          <FormItem wrapperCol={{ offset: 4, span: 10 }}>
            {getFieldDecorator('address')(
              <Input maxLength={50} placeholder="请输入" />
            )}
          </FormItem>
          <FormItem label="经纬度">
            {getFieldDecorator('locationVals')(
              <Input maxLength={50} placeholder="请输入" />
            )}
          </FormItem>
          <FormItem label="类型" wrapperCol={{ span: 14 }}>
            {getFieldDecorator('belongTo', {
              rules: [{ required: true, message: '请选择类型' }]
            })(
              <Radio.Group>
                <Radio value={1}>自营仓</Radio>
                <Radio value={2}>三方仓</Radio>
                <Radio value={3}>云仓</Radio>
              </Radio.Group>
            )}
          </FormItem>
          <FormItem label="是否虚拟仓">
            {getFieldDecorator('buildType', {
              rules: [
                { required: true, message: '请选择是否虚拟仓' },
              ],
            })(
              <RadioGroup>
                <Radio value={2}>是</Radio>
                <Radio value={1}>否</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label="楼层类型">
            {getFieldDecorator('floorType', {
              initialValue: 0,
              rules: [
                { required: true, message: '必填项' },
              ],
            })(
              <RadioGroup>
                <Radio value={0}>单层</Radio>
                <Radio value={1}>多层</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label="可存储类目">
            {getFieldDecorator('categoryList', {
              rules: [
                { required: true, message: '必填项' },
              ],
            })(
              <Select
                disabled={disabled}
                showArrow
                mode="multiple"
                placeholder="请选择（多选）"
              >
                {[].map(item => (
                  <Option key={item.id} value={item.catId}>{item.catName}</Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="仓库联系人">
            {getFieldDecorator('contactList', {
              rules: [
                { required: true, message: '必填项' },
              ],
            })(
              <Select
                disabled={disabled}
                mode="multiple"
                placeholder="请选择（多选）"
                notFoundContent={false ? <Spin size="small" /> : null}
                filterOption={false}
                onSearch={this.handleSearchContact}
              >
                {[].map(item => (
                  <Option key={item.employeeId} value={item.employeeId}>{item.empName}</Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="备注">
            {getFieldDecorator('remark', {
              rules: [
                { required: true, message: '必填项' },
                { max: 300, message: '限300字以内' },
              ],
            })(<TextArea disabled={disabled} placeholder="300字以内" rows={4} />)}
          </FormItem>
          <FormItem label="支持退货">
            {getFieldDecorator('supportReturn', {
              rules: [
                { required: true, message: '必填项' },
              ],
            })(
              <RadioGroup disabled={disabled}>
                <Radio value={1}>是</Radio>
                <Radio value={0}>否</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <div>
            {
              !disabled
                ? (
                  <FormItem
                    wrapperCol={{ offset: 4 }}
                  >
                    <Button
                      disabled
                      style={{ marginRight: 20 }}
                      type="primary"
                    >提交审核</Button>
                    <Button
                      onClick={this.handleSave}
                      style={{ marginRight: 20 }}
                      type="primary"
                    >保存草稿</Button>
                    <Button
                      onClick={this.handleCancel}
                    >取消</Button>
                  </FormItem>
                )
                : null
            }
          </div>

        </Form>
      </Card>
    </PageHeaderWrapper>);
  }
}

export default WarehouseManageDetail;
