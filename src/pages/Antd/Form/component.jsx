import React, { PureComponent } from 'react';
import { Select, Spin } from 'antd';

const { Option } = Select;
const defaultOption = {
  rules: [
    { required: true, message: '必填项' },
  ]
}

class SelectComponent extends PureComponent {
  constructor(props) {
    super(props)
    this.decorationOption = Object.assign({}, defaultOption, props.decorationOptionProps || {})
  }

  render() {
    const { form, propname, Wrap, wrapProps, loading, list, handleSearch } = this.props;
    
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
                list?.map(item => {
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

export default SelectComponent;


/**
 * 模糊搜索单选 组件 使用说明
 * 毕传参数
 * form fetchData (list: {label, value, id} []) 列表参数 必须包含 label, value, id 字段
 * Wrap={FormItem} wrapProps
 * 其他参数
 * rules  校验规则
 * 请求方法 错误 msg fetchData.then(() => Promise.reject({msg: 'xxx'}))
 */
