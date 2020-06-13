import React, { PureComponent } from 'react';
import { Select, Spin } from 'antd';

const { Option } = Select;
const defaultOption = {
  // rules: [
  //   { required: true, message: '必填项' },
  // ]
}

interface propsType {
  form: any;
  Wrap: any;
  wrapProps: object;
  propname: string;
  list: any[];
  loading: boolean;
  decorationOptionProps?: any;
  handleSearch(val:string): any;
}

interface stateType {

}

class MySelect extends PureComponent<propsType, stateType> {
  decorationOption = Object.assign(
    {},
    defaultOption,
    this.props.decorationOptionProps || {}
  )

  render() {
    const { form, loading, list, propname, Wrap, wrapProps, handleSearch } = this.props;
    return (
      <Wrap {...wrapProps}>
        {
          form.getFieldDecorator(propname, this.decorationOption)(
            <Select
              placeholder="请选择"
              showSearch
              onSearch={handleSearch}
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              notFoundContent={loading ? <Spin size="small" /> : null}
            >
              {
                list?.map((item: any) => {
                  return <Option value={item.value} key={item.id}>{item.label}</Option>
                })
              }
            </Select>
          )
        }
      </Wrap>
    );
  }
}

export default MySelect

/**
 * 模糊搜索单选 组件 使用说明
 * 毕传参数
 * form fetchData (list: {label, value, id} []) 列表参数 必须包含 label, value, id 字段
 * Wrap={FormItem} wrapProps
 * 其他参数
 * rules  校验规则
 * 请求方法 错误 msg fetchData.then(() => Promise.reject({msg: 'xxx'}))
 */
