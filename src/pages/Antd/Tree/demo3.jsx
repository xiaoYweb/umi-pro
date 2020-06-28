import React from 'react';
import { Tree, Button } from 'antd';
import { connect } from 'dva';

const { TreeNode } = Tree;

@connect(({ loading, tree }) => ({ loading, ...tree }))

class Demo extends React.Component {
  state = {
    checkedKeys: ['141102'],
    text: '',
  };

  componentDidMount() {
    this.requestLocations()
  }

  requestLocations = () => {
    this.props.dispatch({ type: 'tree/requestLocations' })
  }

  onCheck = (checkedKeys, r) => {
    console.log('onCheck', r);
    this.setState({ checkedKeys }, () => {
      this.mapLocationSelectToText()
    });
  };

  mapLocationSelectToText = () => {
    let { locations } = this.props;
    locations = deepClone(locations)
    const res = this.retFilterLocations(locations)
    const text = this.mapFilterLocationsToString(res)
    // console.log('filter res', checkedKeys, res, text)
    this.setState({ text })
  }

  // 省市区 value 为 6 位 每2位分别代表 省市区
  // antd 选择 时 会返回 对应打钩的keys 数组[] 若叶子节点全选了 父节点的value也会被选择 放入数组
  // 需求 浙江省（绍兴市（上虞区、嵊州市）、金华市（兰溪市、义乌市）、江苏省 -- 叶子节点全选省略叶子节点显示
  retFilterLocations = locations => { // 过滤已选择的 省市区
    const { checkedKeys } = this.state;
    if (checkedKeys.length === 0) return [];
    return locations.filter(province => {
      const { value: provinceKey, children: cities } = province;
      if (checkedKeys.includes(provinceKey)) {
        province.isAll = true;
        return true;
      }
      province.isAll = false;
      const hasCity = checkedKeys.map(key => {
        return key.substr(0, 2).padEnd(6, '0');
      }).includes(provinceKey)
      if (hasCity) {
        province.children = cities.filter(city => {
          const { value: cityKey, children: areas } = city;
          if (checkedKeys.includes(cityKey)) {
            city.isAll = true
            return true
          }
          city.isAll = false
          const hasArea = checkedKeys.map(key => {
            return key.substr(0, 4).padEnd(6, '0');
          }).includes(cityKey)
          if (hasArea) {
            city.children = areas.filter(({ value: areakey }) => checkedKeys.includes(areakey))
            return true
          }
          return false
        })
        return true
      }
      return false
    })
  }

  mapFilterLocationsToString = locations => {
    return locations.map(province => {
      const { label: provinceName, children: cities } = province;
      if (province.isAll) return provinceName
      if (cities) {
        const retCities = cities.map(city => {
          const { label: cityName, children: areas } = city;
          if (city.isAll) return cityName
          if (areas) {
            const retAreas = areas.map(({ label }) => label)

            return `${cityName} (${retAreas.join('、')})`
          }
          return cityName
        })

        return `${provinceName} (${retCities.join('、')})`
      }
      return provinceName
    }).join('、')
  }

  renderTreeNodes = data => data.map(item => {
    if (item.children) {
      return (
        <TreeNode title={item.title} key={item.key} dataRef={item}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode key={item.key} {...item} />;
  });

  renderLocationNodes = locations => locations.map(item => {
    const { label, value, children } = item;
    return children
      ? <TreeNode title={label} key={value} dataRef={item}>
        {this.renderLocationNodes(children)}
      </TreeNode>
      : <TreeNode title={label} key={value} />;
  })

  render() {
    const { text } = this.state;
    const { locations = [] } = this.props;
    return (
      <div>
        <Button onClick={this.mapLocationSelectToText}>Button</Button>
        <div>{text}</div>
        <Tree
          checkable
          onCheck={this.onCheck}
          checkedKeys={this.state.checkedKeys}
        >
          {this.renderLocationNodes(locations)}
        </Tree>
      </div>
    );
  }
}

export default Demo;

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj))
}
