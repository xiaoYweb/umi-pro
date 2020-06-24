import React from 'react';
import { Divider } from 'antd';
import Wrap from '@/components/Wrap';
import Demo1 from './demo1';
import Demo2 from './demo2';
import Demo3 from './demo3';
import Demo4 from './demo4';
import Demo5 from './demo5';
import Demo15 from './demo15';

class SelectComp extends React.Component {
  state = {}

  render() {
    return (
      <Wrap>
        <Demo1 />
        <Divider dashed />
        <Demo2 />
        <Divider dashed />
        <Demo3 />
        <Divider dashed />
        <Demo4 />
        <Divider dashed />
        <Demo5 />
        <Divider dashed />
        <Demo15 />
        <Divider dashed />
      </Wrap>);
  }
}

export default SelectComp;
