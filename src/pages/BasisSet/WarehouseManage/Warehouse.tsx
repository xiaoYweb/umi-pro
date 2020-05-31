import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import {
  Card, Form, Cascader, Button, Input, Radio, Select, Spin,
} from 'antd';
import { queryContacter } from '@/services/user';
import { WarehouseProps, WarehouseState } from './typings.d';
import { ConnectState } from '@/models/connect';
import { router } from 'umi';
import tools from '@/utils/tools';
import styles from './Warehouse.less';

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const floorOptions: any[] = [];
for (let i = 1; i < 10; i++) {
  floorOptions.push(<Option key={i.toString(22)} value={`${i}楼`}>{i}楼</Option>);
}

// @ts-ignore
@connect(({ global, warehouse }: ConnectState) => ({
  wholeCountry: global.wholeCountry,
  itemCates: global.itemCates,
  data: warehouse,
}))
// @ts-ignore
@Form.create()
export default class Warehouse extends Component<WarehouseProps, WarehouseState> {
  static getDerivedStateFromProps(props: WarehouseProps, state: WarehouseState) {
    const { contactList2, status } = props.data;
    if (state.contactFlag && contactList2 && contactList2.length) {
      return {
        statusDisabled: !'DRAFT|AUDIT_REJECT'.includes(status as string),
        contactFlag: false,
        contactData: contactList2.map((item) => ({
          employeeId: item.userId,
          empName: item.userName,
        })),
      };
    }

    return null;
  }

  state: WarehouseState = {
    statusDisabled: false,
    lookDisabled: false,
    contactFlag: true,
    contactData: [],
    contacting: false,
  }

  handleSearchContact = tools.debounce((value: string) => {
    if (value) {
      this.setState({
        contactData: [],
        contacting: true,
      });
      queryContacter(value).then(({ status, entry }) => {
        if (status && entry) {
          this.setState({
            contacting: false,
            contactData: entry,
          });
        } else {
          this.setState({ contacting: false });
        }
      });
    } else {
      this.setState({
        contacting: false,
        contactData: [],
      });
    }
  }, 500);

  componentDidMount() {
    const { dispatch, location, match } = this.props;
    if (location.pathname !== '/basisset/warehousemanage/create') {
      dispatch({
        type: 'warehouse/fetchDetails',
        payload: match.params.id,
      });
      if (location.pathname.includes('look')) {
        this.setState({
          lookDisabled: true,
        });
      }
    }
  }

  componentWillUnmount() {
    this.props.dispatch({ type: 'warehouse/clearData' });
  }

  handleClickCancel = () => {
    router.goBack();
  }

  handleClickSave = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const [province, city, county, street] = values.county;
        delete values.county;
        const [longitude, latitude] = values.locationVals.split(',');
        delete values.locationVals;
        values['contactList'] = values.contactList.map((userId: string) => ({ userId }));
        this.props.dispatch({
          type: 'warehouse/saveWarehouse',
          payload: {
            ...values,
            province,
            city,
            county,
            street,
            longitude,
            latitude,
          },
        });
      }
    });
  }

  handleCheckFloor = (rule: any, value: any[], callback: any) => {
    if (value && value.length < 2) {
      callback('楼层至少需选择2层');
    } else {
      callback();
    }
  }

  render() {
    const {
      contacting,
      contactData = [],
      lookDisabled,
      statusDisabled,
    } = this.state;
    const { form, wholeCountry, itemCates, data = {} } = this.props;
    const { getFieldDecorator } = form;
    const optionsCascader = wholeCountry ? wholeCountry.children : [];

    return (
      <PageHeaderWrapper className="page-wrapper">
        <Card bodyStyle={{ padding: 16 }} bordered={false}>
          <Form
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            className={styles.form}
          >
            <FormItem label="仓库名称">
              {getFieldDecorator('warehouseName', {
                initialValue: data.warehouseName,
                rules: [
                  { required: true, message: '必填项' },
                  { pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]+$/, message: '只能输入中文英文和数字' },
                ],
              })(<Input
                maxLength={30}
                disabled={lookDisabled || statusDisabled}
                placeholder="请输入"
              />)}
            </FormItem>
            <FormItem label="仓库编码">
              {getFieldDecorator('warehouseCode', {
                initialValue: data.warehouseCode,
                rules: [
                  { required: true, message: '必填项' },
                  { pattern: /^[a-zA-Z0-9-]+$/, message: '只能输入中英文、数字、-' },
                ],
              })(<Input
                maxLength={8}
                disabled={lookDisabled || statusDisabled}
                placeholder="请输入"
              />)}
            </FormItem>
            <FormItem label="仓库地址">
              {getFieldDecorator('county', {
                initialValue: data.county,
                rules: [
                  { required: true, message: '必填项' },
                ],
              })(
                <Cascader
                  disabled={lookDisabled || statusDisabled}
                  fieldNames={{ label: 'name', value: 'code' }}
                  options={optionsCascader}
                  placeholder="请输入"
                />
              )}
            </FormItem>
            <FormItem
              wrapperCol={{ offset: 6 }}
            >
              {getFieldDecorator('address', {
                initialValue: data.address,
                rules: [
                  { required: true, message: '必填项' },
                ],
              })(<Input
                maxLength={50}
                disabled={lookDisabled || statusDisabled}
                placeholder="请输入详细地址"
              />)}
            </FormItem>
            <FormItem label="经纬度">
              {getFieldDecorator('locationVals', {
                initialValue: data.locationVals,
                rules: [
                  { required: true, message: '必填项' },
                ],
              })(<Input disabled={lookDisabled || statusDisabled} placeholder="请输入经纬度逗号隔开" />)}
            </FormItem>
            <FormItem label="类型">
              {getFieldDecorator('belongTo', {
                initialValue: data.belongTo,
                rules: [
                  { required: true, message: '必填项' },
                ],
              })(
                <RadioGroup disabled={lookDisabled || statusDisabled}>
                  <Radio value={1}>自营仓</Radio>
                  <Radio value={2}>三方仓</Radio>
                  <Radio value={3}>云仓</Radio>
                  {/* <Radio value={4}>样品仓</Radio> */}
                </RadioGroup>
              )}
            </FormItem>
            <FormItem label="是否虚拟仓">
              {getFieldDecorator('buildType', {
                initialValue: data.buildType,
                rules: [
                  { required: true, message: '必填项' },
                ],
              })(
                <RadioGroup disabled={lookDisabled || statusDisabled}>
                  <Radio value={2}>是</Radio>
                  <Radio value={1}>否</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem label="楼层类型">
              {getFieldDecorator('floorType', {
                initialValue: data.floorInfo ? 1 : 0,
                rules: [
                  { required: true, message: '必填项' },
                ],
              })(
                <RadioGroup disabled={lookDisabled || statusDisabled}>
                  <Radio value={0}>单层</Radio>
                  <Radio value={1}>多层</Radio>
                </RadioGroup>
              )}
            </FormItem>
            {form.getFieldValue('floorType') === 1
              ? (
                <FormItem label="楼层">
                  {getFieldDecorator('floorInfo', {
                    initialValue: data.floorInfo,
                    rules: [
                      { required: true, message: '必填项' },
                      { validator: this.handleCheckFloor },
                    ],
                  })(
                    <Select
                      disabled={lookDisabled || statusDisabled}
                      showArrow
                      mode="multiple"
                      placeholder="请选择（多选）"
                    >
                      {floorOptions}
                    </Select>
                  )}
                </FormItem>
              )
              : null
            }
            <FormItem label="可存储类目">
              {getFieldDecorator('categoryList', {
                initialValue: data.categoryList,
                rules: [
                  { required: true, message: '必填项' },
                ],
              })(
                <Select
                  disabled={lookDisabled || statusDisabled}
                  showArrow
                  mode="multiple"
                  placeholder="请选择（多选）"
                >
                  {itemCates && itemCates.map((item) => (
                    <Option key={item.id} value={item.catId}>{item.catName}</Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem label="仓库联系人">
              {getFieldDecorator('contactList', {
                initialValue: data.contactList,
                rules: [
                  { required: true, message: '必填项' },
                ],
              })(
                <Select
                  disabled={lookDisabled}
                  mode="multiple"
                  placeholder="请选择（多选）"
                  notFoundContent={contacting ? <Spin size="small" /> : null}
                  filterOption={false}
                  onSearch={this.handleSearchContact}
                >
                  {contactData.map((item) => (
                    <Option key={item.employeeId} value={item.employeeId}>{item.empName}</Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem label="备注">
              {getFieldDecorator('remark', {
                initialValue: data.remark,
              })(<TextArea maxLength={300} disabled={lookDisabled} placeholder="300字以内" rows={4} />)}
            </FormItem>
            <FormItem label="支持退货">
              {getFieldDecorator('supportReturn', {
                initialValue: data.supportReturn,
                rules: [
                  { required: true, message: '必填项' },
                ],
              })(
                <RadioGroup disabled={lookDisabled || statusDisabled}>
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
                </RadioGroup>
              )}
            </FormItem>
            {!lookDisabled
              ? (
                <FormItem
                  wrapperCol={{ offset: 6 }}
                >
                  <Button
                    disabled
                    style={{ marginRight: 20 }}
                    type="primary"
                  >提交审核</Button>
                  <Button
                    onClick={this.handleClickSave}
                    style={{ marginRight: 20 }}
                    type="primary"
                  >保存草稿</Button>
                  <Button
                    onClick={this.handleClickCancel}
                  >取消</Button>
                </FormItem>
              )
              : null
            }
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
