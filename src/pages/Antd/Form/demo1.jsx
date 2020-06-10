import React, { PureComponent } from 'react';
import { Form, Input, InputNumber, Row, Col, Button, Select, Spin, DatePicker } from 'antd';
import moment from 'moment';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

const lastWeek = [moment().subtract('days', 7), moment()];
const weekTimestamp = 7 * 24 * 3600 * 1000;
@Form.create()
class Demo extends PureComponent {
  state = {
    statusList: [
      { value: 1, label: '正常' },
      { value: 2, label: '异常' },
    ],
    userList: [
      { value: 1, label: '张三' },
      { value: 2, label: '丽丽' },
      { value: 3, label: '李四' },
    ],
    productList: [],
    productListLoading: false,
    warehouseList: [],
    fetching: false,
  }

  cache = {}

  getProductList = debounce(val => {
    this.setState({ productListLoading: true, productList: [] })
    const list = this.cache[val];
    if (list) {
      this.setState({ productList: list, productListLoading: false })
      return
    }
    fetchProductList(+val).then(res => {
      this.cache[val] = res;
      this.setState({ productList: res, productListLoading: false })
    })
  })

  getWarehouseList = debounce(() => {
    this.setState({ fetching: true })
    fetchWarehouseList().then(res => {
      const warehouseList = res.map(user => ({
        text: `${user.name.first} ${user.name.last}`,
        value: user.login.username,
      }));
      this.setState({ warehouseList, fetching: false })
    })
  })

  handleClick = () => {
    const { form: { getFieldsValue } } = this.props;
    const res = getFieldsValue() // ['str', 'key']
    console.log('Demo -> handleClick -> res', res)
    return res;
  }

  dateValidator = (rule, value, callback) => {
    console.log(value[1].valueOf() - value[0].valueOf())
    if (value[1].valueOf() - value[0].valueOf() > weekTimestamp) {
      callback('查询时间跨度最大为7天')
      return
    }
    callback()
  }

  disabledDate = startDate => {
    if (!startDate) return false
    const timestamp = Date.now();
    const startTimestamp = startDate.valueOf();
    return startTimestamp > timestamp;
  }

  render() {
    const { statusList, userList, productList,
      productListLoading, warehouseList, fetching } = this.state;
    const { form: { getFieldDecorator } } = this.props;
    return (<Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
      <Row gutter={12}>
        <Col span={6}>
          <FormItem label="输入input">
            {getFieldDecorator('input', {
              initialValue: '11'
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>
        </Col>
        <Col span={4}>
          <FormItem label="数值输入">
            {getFieldDecorator('inputnum')(
              <InputNumber />
            )}
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem label="单选">
            {getFieldDecorator('status', { initialValue: 2 })(
              <Select placeholder="请选择" >
                {
                  statusList?.map(item => {
                    return <Option key={item.value}>{item.label}</Option>
                  })
                }
              </Select>
            )}
          </FormItem>
        </Col>
        <Col span={8}>
          <FormItem label="多选">
            {getFieldDecorator('user', { initialValue: [1, 2] })(
              <Select placeholder="请选择" mode="multiple">
                {
                  userList?.map(item => {
                    return <Option value={item.value} key={item.value}>{item.label}</Option>
                  })
                }
              </Select>
            )}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={12}>
        <Col span={6}>
          <FormItem label="创建日期" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} >
            {getFieldDecorator('date', {
              rules: [
                { validator: this.dateValidator }
              ],
            })(
              <RangePicker
                disabledDate={this.disabledDate}
                ranges={{
                  '过去一周': lastWeek,
                }}
                showTime
                format="YYYY/MM/DD HH:mm"
              />
            )}
          </FormItem>
        </Col>
      </Row>
      <Row gutter={12}>
        <Col span={6}>
          <FormItem label="模糊单选产品">
            {getFieldDecorator('product')(
              <Select
                placeholder="请选择"
                showSearch
                onSearch={this.getProductList}
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                notFoundContent={productListLoading ? <Spin size="small" /> : null}
              >
                {
                  productList?.map(item => {
                    return <Option value={item.value} key={item.value}>{item.label}</Option>
                  })
                }
              </Select>
            )}
          </FormItem>
        </Col>
        <Col span={18}>
          <FormItem label="模糊多选参会库">
            {getFieldDecorator('warehouse')(
              <Select
                placeholder="请选择"
                mode="multiple"
                onSearch={this.getWarehouseList}
                notFoundContent={fetching ? <Spin size="small" /> : null}
                filterOption={false}
              >
                {
                  warehouseList?.map(item => {
                    return <Option value={item.value} key={item.value}>{item.text}</Option>
                  })
                }
              </Select>
            )}
          </FormItem>
        </Col>
      </Row>
      <Button onClick={this.handleClick}>test</Button>
    </Form>);
  }
}

export default Demo;

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
  let timer = null;
  return function func(...r) {
    timer && clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, r)
    }, delay)
  }
}

function fetchWarehouseList() {
  const arr = [{ 'name': { 'title': 'Mr', 'first': 'Joe', 'last': 'Gilbert' }, 'login': { 'uuid': '846d256f-8804-4a14-a582-8158f881b283', 'username': 'lazycat559', 'password': 'fighting', 'salt': 'HHdqQgqk', 'md5': '314be100ace85e69b183ddf728a9f695', 'sha1': 'fc8ff2e58a025c739f6756dc03efd6a91b4f0f5f', 'sha256': 'd379dc905924674d6f3833ec3c43e7bc9027a091fc5758bb079b33817a547d6f' } }, { 'name': { 'title': 'Monsieur', 'first': 'Vincent', 'last': 'Brun' }, 'login': { 'uuid': 'f31d95ab-297e-429f-8a39-34f1973821ec', 'username': 'purplewolf194', 'password': 'anders', 'salt': '5WAa4wVg', 'md5': '4104cce4a48bbb27fa101aac88c2a0cc', 'sha1': '06a8ed95c9b87cf166e325e9a58928510aa9fcc0', 'sha256': '17eaff7038b1b72be4364c722a6413085559ce4d9758e3f275e79eaec2611eda' } }, { 'name': { 'title': 'Ms', 'first': 'Kimberly', 'last': 'Bryant' }, 'login': { 'uuid': 'e5c11ae1-6b80-4c7f-bef5-cbede43684a5', 'username': 'sadswan161', 'password': 'caligula', 'salt': 'PfQXSEmF', 'md5': '823eccb8005bbcf6a5a7cde693eea671', 'sha1': '76db404cad4f0696c3be3c1d5bdcd5ea093d2178', 'sha256': '6bc9bbfb836a1c0811389a33c843a95d2b5ffac2bc992d5d628b3220fa5f4abf' } }, { 'name': { 'title': 'Monsieur', 'first': 'Tino', 'last': 'Meunier' }, 'login': { 'uuid': '68c579d9-1cf8-428e-8a1b-cb7383bd1d50', 'username': 'lazybutterfly773', 'password': 'snapple', 'salt': 'kTXUcGGW', 'md5': '93d224fadfa95994b2e92f61c37d1b82', 'sha1': 'da1f8cb98b04f206139a81b48d80f2311ab1dad1', 'sha256': 'ff5a26107aa56dd1a897f6095692f89ad8eca9c7bd48815c0f3d74d76ca6fe98' } }, { 'name': { 'title': 'Mr', 'first': 'Imran', 'last': 'Haavik' }, 'login': { 'uuid': 'aa82b13b-396a-4c0e-83ff-41770d3ea702', 'username': 'happykoala485', 'password': 'robin1', 'salt': '33H7YWTC', 'md5': 'eb5e940535cca1f9636379c0d3ae5a8d', 'sha1': 'dd3dd99dec10dc76f70ba19e2d747ba00ca8a79e', 'sha256': '96fc1df9ca5769e55af2195c08aaebdf8cf21b73a4f6b811e952b355c5fdd35b' } }];
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(arr)
    }, 300);
  })
}
