import React, { PureComponent } from 'react';
import { Select, Spin } from 'antd';
import Toast from '@/lib/Toast';

const { Option } = Select;

class SelectComponent extends PureComponent {
  state = {
    list: [],
    loading: false,
  }

  cache = {}

  handleSearch = debounce(val => {
    this.setState({ loading: true, list: [] })
    const list = this.cache[val];
    if (list) {
      this.setState({ list, loading: false })
      return
    }
    this.props.fetchData(val).then(res => {
      this.cache[val] = res;
      this.setState({ list: res })
    }).catch(err => {
      const msg = err && err.msg || '网络错误';
      Toast.error(msg)
      this.setState({ list: [] })
    }).finally(() => {
      this.setState({ loading: false })
    })
  })

  render() {
    const { loading, list, } = this.state;
    const { form, propname, rules, Wrap, wrapProps } = this.props;
    return (
      <Wrap {...wrapProps}>
        {
          form.getFieldDecorator(propname, {
            rules: rules || [
              { required: true, message: '必填项' },
            ]
          })(
            <Select
              placeholder="请选择"
              showSearch
              onSearch={this.handleSearch}
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              notFoundContent={loading ? <Spin size="small" /> : null}
            >
              {
                list?.map(item => {
                  return <Option value={item.value} key={item.id} a={item.id}>{item.label}</Option>
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

function debounce(fn, delay = 300) {
  let timer = null;
  return function func(...r) {
    timer && clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, r)
    }, delay)
  }
}

/**
 * 模糊搜索单选 组件 使用说明
 * 毕传参数
 * form fetchData (list: {label, value, id} []) 列表参数 必须包含 label, value, id 字段
 * Wrap={FormItem} wrapProps
 * 其他参数
 * rules  校验规则
 * 请求方法 错误 msg fetchData.then(() => Promise.reject({msg: 'xxx'}))
 */
