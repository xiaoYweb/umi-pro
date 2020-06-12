import React, { PureComponent } from 'react';
import { Form, Row, Col, Button, Input, DatePicker } from 'antd';
import Toast from '@/lib/Toast';
import { router } from 'umi';
import { connect } from 'dva';
import moment from 'moment';
import MySelect from './component';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const lastWeek = [moment().subtract('days', 7), moment()];
const weekTimestamp = 7 * 24 * 3600 * 1000;

@connect(({ antdform }) => ({ ...antdform }))

@Form.create()
class Demo extends PureComponent {
  state = {
    productLoading: false,
    productList: [],
    warehouseLoading: false,
    warehouseList: [],
  }

  productCache = {}

  warehouseCache = {}

  handleSearch = debounce((
    propname,
    val,
    fetchData,
    fixPropname = arr => arr.map(item => ({ ...item, id: item.value }))
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
  })

  componentDidMount() {
    this.handleInitOptionValue()
  }

  handleProductSearch = val => {
    this.handleSearch('product', val, fetchProductList)
  }

  handleWarehouseSearch = val => {
    this.handleSearch('warehouse', val, fetchWarehouseList,
      arr => arr.map(user => ({
        label: `${user.name.first} ${user.name.last}`,
        value: user.login.username,
        id: user.login.username
      })))
  }

  handleClick = () => {
    this.handleBackupOptionValue()
    router.push('/antd/table')
  }

  handleSubmit = () => {
    const { form: { validateFields } } = this.props;
    validateFields((err, values) => {
      if (!err) {
        console.log(values)
      }
    })
  }

  handleInitOptionValue = () => { // 搜索条件 回显 / 初始化
    const { record, form: { setFieldsInitialValue } } = this.props;
    if (!record) return
    const { productList, warehouseList, ...options } = record;
    this.setState({ productList, warehouseList })
    setFieldsInitialValue(options)
  }

  handleBackupOptionValue = () => { // 备份 搜索条件
    const { productList, warehouseList } = this.state;
    const { dispatch, form: { getFieldsValue } } = this.props;
    const options = getFieldsValue()
    dispatch({
      type: 'antdform/updateState',
      payload: { record: { ...options, productList, warehouseList } }
    })
  }

  disabledDate = startDate => {
    if (!startDate) return false
    const timestamp = Date.now();
    const startTimestamp = startDate.valueOf();
    return startTimestamp > timestamp;
  }

  dateValidator = (rule, value, callback) => {
    if (value[1].valueOf() - value[0].valueOf() > weekTimestamp) {
      callback('查询时间跨度最大为7天')
      return
    }
    callback()
  }

  render() {
    const { form } = this.props;
    const { productList, productLoading, warehouseLoading, warehouseList } = this.state;

    return (<Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
      <Row gutter={12}>
        <Col span={6}>
          <MySelect propname="product" wrapProps={{ label: '模糊单选产品' }} list={productList} loading={productLoading} handleSearch={this.handleProductSearch} form={form} Wrap={FormItem} />
        </Col>
        <Col span={6}>
          <MySelect handleSearch={this.handleWarehouseSearch} form={form} propname="warehouse" Wrap={FormItem} wrapProps={{ label: '模糊单选仓库' }} list={warehouseList} loading={warehouseLoading} />
        </Col>
        <Col span={6}>
          <Form.Item label="输入框">
            {
              form.getFieldDecorator('input', {
                rules: [
                  { required: true, message: '必填项' }
                ]
              })(
                <Input placeholder="请输入" />
              )
            }
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={12}>
        <Col span={8}>
          {
            form.getFieldDecorator('date')(
              <RangePicker
                disabledDate={this.disabledDate}
                ranges={{
                  '过去一周': lastWeek,
                }}
                showTime
                format="YYYY-MM-DD"
              />
            )
          }
        </Col>
      </Row>
      <Button onClick={this.handleClick}>test</Button>
      <Button onClick={this.handleSubmit}>submit</Button>
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

function fetchWarehouseList() {
  const arr = [{ 'name': { 'title': 'Mr', 'first': 'Joe', 'last': 'Gilbert' }, 'login': { 'uuid': '846d256f-8804-4a14-a582-8158f881b283', 'username': 'lazycat559', 'password': 'fighting', 'salt': 'HHdqQgqk', 'md5': '314be100ace85e69b183ddf728a9f695', 'sha1': 'fc8ff2e58a025c739f6756dc03efd6a91b4f0f5f', 'sha256': 'd379dc905924674d6f3833ec3c43e7bc9027a091fc5758bb079b33817a547d6f' } }, { 'name': { 'title': 'Monsieur', 'first': 'Vincent', 'last': 'Brun' }, 'login': { 'uuid': 'f31d95ab-297e-429f-8a39-34f1973821ec', 'username': 'purplewolf194', 'password': 'anders', 'salt': '5WAa4wVg', 'md5': '4104cce4a48bbb27fa101aac88c2a0cc', 'sha1': '06a8ed95c9b87cf166e325e9a58928510aa9fcc0', 'sha256': '17eaff7038b1b72be4364c722a6413085559ce4d9758e3f275e79eaec2611eda' } }, { 'name': { 'title': 'Ms', 'first': 'Kimberly', 'last': 'Bryant' }, 'login': { 'uuid': 'e5c11ae1-6b80-4c7f-bef5-cbede43684a5', 'username': 'sadswan161', 'password': 'caligula', 'salt': 'PfQXSEmF', 'md5': '823eccb8005bbcf6a5a7cde693eea671', 'sha1': '76db404cad4f0696c3be3c1d5bdcd5ea093d2178', 'sha256': '6bc9bbfb836a1c0811389a33c843a95d2b5ffac2bc992d5d628b3220fa5f4abf' } }, { 'name': { 'title': 'Monsieur', 'first': 'Tino', 'last': 'Meunier' }, 'login': { 'uuid': '68c579d9-1cf8-428e-8a1b-cb7383bd1d50', 'username': 'lazybutterfly773', 'password': 'snapple', 'salt': 'kTXUcGGW', 'md5': '93d224fadfa95994b2e92f61c37d1b82', 'sha1': 'da1f8cb98b04f206139a81b48d80f2311ab1dad1', 'sha256': 'ff5a26107aa56dd1a897f6095692f89ad8eca9c7bd48815c0f3d74d76ca6fe98' } }, { 'name': { 'title': 'Mr', 'first': 'Imran', 'last': 'Haavik' }, 'login': { 'uuid': 'aa82b13b-396a-4c0e-83ff-41770d3ea702', 'username': 'happykoala485', 'password': 'robin1', 'salt': '33H7YWTC', 'md5': 'eb5e940535cca1f9636379c0d3ae5a8d', 'sha1': 'dd3dd99dec10dc76f70ba19e2d747ba00ca8a79e', 'sha256': '96fc1df9ca5769e55af2195c08aaebdf8cf21b73a4f6b811e952b355c5fdd35b' } }];
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(arr)
    }, 300);
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
