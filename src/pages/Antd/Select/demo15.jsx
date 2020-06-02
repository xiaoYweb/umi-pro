import React from 'react';
import { Select, Spin } from 'antd';

const { Option } = Select;
const selectStyle = {
  width: 300,
}

class Demo extends React.Component {
  cache = {}

  constructor(props) {
    super(props);
    this.fetchUser = debounce(this.fetchUser, 800);
  }

  state = {
    data: [],
    value: [],
    fetching: false,
    
  };

  fetchUser = value => {
    let data = this.cache[value]
    if (data) return this.setState({ data, fetching: false });
    // console.log('fetching user', value);
    this.setState({ data: [], fetching: true });
    getList().then(results => {
      data = results.map(user => ({
        text: `${user.name.first} ${user.name.last}`,
        value: user.login.username,
      }));
      this.cache[value] = data;
      this.setState({ data, fetching: false });
    })
    return ''
  };

  handleChange = value => {
    this.setState({
      value,
      // data: [],
      fetching: false,
    });
  };

  render() {
    const { fetching, data, value } = this.state;
    return (<>
      <Select
        mode="multiple"
        labelInValue
        value={value}
        placeholder="Select users"
        notFoundContent={fetching ? <Spin size="small" /> : null}
        filterOption={false}
        onSearch={this.fetchUser}
        onChange={this.handleChange}
        style={selectStyle}
      >
        {data.map(d => (
          <Option key={d.value}>{d.text}</Option>
        ))}
      </Select>
    </>);
  }
}

export default Demo;

/**
 * 单选 输入 搜索
 * debouce 防抖函数的使用
 * notFoundContent={fetchingPending ? <Spin size="small" /> : null}
 * labelInValue
 * 
 */
function debounce(fn, wait = 300) {
  let timer = null;
  return function func(...args) {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args)
    }, wait);
  }
}

function getList() {
  const arr = [{ 'name': { 'title': 'Mr', 'first': 'Joe', 'last': 'Gilbert' }, 'login': { 'uuid': '846d256f-8804-4a14-a582-8158f881b283', 'username': 'lazycat559', 'password': 'fighting', 'salt': 'HHdqQgqk', 'md5': '314be100ace85e69b183ddf728a9f695', 'sha1': 'fc8ff2e58a025c739f6756dc03efd6a91b4f0f5f', 'sha256': 'd379dc905924674d6f3833ec3c43e7bc9027a091fc5758bb079b33817a547d6f' } }, { 'name': { 'title': 'Monsieur', 'first': 'Vincent', 'last': 'Brun' }, 'login': { 'uuid': 'f31d95ab-297e-429f-8a39-34f1973821ec', 'username': 'purplewolf194', 'password': 'anders', 'salt': '5WAa4wVg', 'md5': '4104cce4a48bbb27fa101aac88c2a0cc', 'sha1': '06a8ed95c9b87cf166e325e9a58928510aa9fcc0', 'sha256': '17eaff7038b1b72be4364c722a6413085559ce4d9758e3f275e79eaec2611eda' } }, { 'name': { 'title': 'Ms', 'first': 'Kimberly', 'last': 'Bryant' }, 'login': { 'uuid': 'e5c11ae1-6b80-4c7f-bef5-cbede43684a5', 'username': 'sadswan161', 'password': 'caligula', 'salt': 'PfQXSEmF', 'md5': '823eccb8005bbcf6a5a7cde693eea671', 'sha1': '76db404cad4f0696c3be3c1d5bdcd5ea093d2178', 'sha256': '6bc9bbfb836a1c0811389a33c843a95d2b5ffac2bc992d5d628b3220fa5f4abf' } }, { 'name': { 'title': 'Monsieur', 'first': 'Tino', 'last': 'Meunier' }, 'login': { 'uuid': '68c579d9-1cf8-428e-8a1b-cb7383bd1d50', 'username': 'lazybutterfly773', 'password': 'snapple', 'salt': 'kTXUcGGW', 'md5': '93d224fadfa95994b2e92f61c37d1b82', 'sha1': 'da1f8cb98b04f206139a81b48d80f2311ab1dad1', 'sha256': 'ff5a26107aa56dd1a897f6095692f89ad8eca9c7bd48815c0f3d74d76ca6fe98' } }, { 'name': { 'title': 'Mr', 'first': 'Imran', 'last': 'Haavik' }, 'login': { 'uuid': 'aa82b13b-396a-4c0e-83ff-41770d3ea702', 'username': 'happykoala485', 'password': 'robin1', 'salt': '33H7YWTC', 'md5': 'eb5e940535cca1f9636379c0d3ae5a8d', 'sha1': 'dd3dd99dec10dc76f70ba19e2d747ba00ca8a79e', 'sha256': '96fc1df9ca5769e55af2195c08aaebdf8cf21b73a4f6b811e952b355c5fdd35b' } }];
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(arr)
    }, 300);
  })
}
