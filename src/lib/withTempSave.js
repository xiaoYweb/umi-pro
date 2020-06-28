import React from 'react';

function func(Comp) {
  class WrapComponent {
    componentWillUnmount() {

    }

    render() {
      return <Comp {...this.props} />
    }
  }
  return WrapComponent
}

export default func;
