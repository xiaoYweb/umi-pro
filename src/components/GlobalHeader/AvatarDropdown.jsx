import React, { Component } from 'react';
import { Avatar, Icon, Menu, Spin } from 'antd';
import { connect } from 'dva';
import { router } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';


class AvatarDropdown extends Component {
  onMenuClick = event => {
    const { key } = event;

    if (key === 'logout') {
      const { dispatch } = this.props;
      if (dispatch) {
        dispatch({
          type: 'user/logout',
        });
      }

      return;
    }
    router.push(`/account/${key}`);
  };

  render() {
    const { currentUser, menu } = this.props;

    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        {menu && (
          <Menu.Item key="center">
            <Icon type="user" />
            <span>个人中心</span>
          </Menu.Item>
        )}
        {menu && (
          <Menu.Item key="settings">
            <Icon type="setting" />
            <span>个人设置</span>
          </Menu.Item>
        )}
        {menu && <Menu.Divider />}

        <Menu.Item key="logout">
          <Icon type="logout" />
          <span>退出登录</span>
        </Menu.Item>
      </Menu>
    );

    return currentUser && currentUser.empName ? (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar size="small" className={styles.avatar} src="" alt="avatar" />
          <span className={styles.name}>{currentUser.empName}</span>
        </span>
      </HeaderDropdown>
    ) : (
      <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
    );
  }
}

export default connect(({ user }) => ({
  currentUser: user.currentUser,
  menu: false,
}))(AvatarDropdown);
