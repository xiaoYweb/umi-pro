import React, { Component } from 'react';
import { connect } from 'dva';
import { PageLoading } from '@ant-design/pro-layout';
import tools from '@/utils/tools';


@connect(({ user, loading }) => ({
  loading,
  currentUser: user.currentUser,
}))

class SecurityLayout extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isMouted: false
    }
  }

  componentDidMount() {
    this.setState({ isMouted: true })
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
    }
  }

  render() {
    const { isMouted } = this.state;

    const { children, location, loading, currentUser } = this.props;
    
    const hasGotUserInfo = loading.effects['user/fetchCurrent']; // 确保获取用户信息 后 在 做redirect判断
    // 你可以把它替换成你自己的登录认证规则（比如判断 token 是否存在）
    const isLogin = currentUser && (currentUser.employeeId || currentUser.userId);

    if (!isMouted || hasGotUserInfo) {
      return <PageLoading />;
    }
    if (!isLogin && location.pathname !== '/user/login') {
      tools.toLogin();
      return null;
    }
    return children;
  }
}

export default SecurityLayout;
