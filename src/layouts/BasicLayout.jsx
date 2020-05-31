import React, { Component } from 'react';
import { Link, router } from 'umi';
import ProLayout, { DefaultFooter } from '@ant-design/pro-layout';
import { connect } from 'dva';
import RightContent from '@/components/GlobalHeader/RightContent';
import HouseSwitch from '@/components/HouseSwitch';
import WareHouseModal from '@/components/WareHouseModal';


@connect(({ global, settings }) => ({
  collapsed: global.collapsed,
  settings,
}))

class BasicLayout extends Component {
  state = {};

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  handleMenuCollapse = payload => { // 修改 collapsed: bollean = true / false
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload,
    });
  }

  breadcrumbDataRender = (routes = []) => [ // 更新 面包屑
    {
      path: '/home',
      breadcrumbName: '首页',
    },
    ...routes,
  ]

  handleNav = path => { // 
    const { location: { pathname } } = this.props;
    pathname !== path && router.push(path)
  }

  render() {
    const { children, settings, collapsed } = this.props;

    return (
      <>
        <ProLayout
          menuHeaderRender={(logoDom, titleDom) => {
            return (
              <>
                <Link to="/">
                  {logoDom}
                  {titleDom}
                </Link>
                {collapsed || <HouseSwitch />}
              </>
            )
          }}

          onCollapse={this.handleMenuCollapse}

          rightContentRender={() => <RightContent />}


          breadcrumbRender={this.breadcrumbDataRender}

          itemRender={(route, params, routes) => { // 生成面包屑
            const first = routes.indexOf(route) === 0;
            return first ? (
              <Link to={route.path}>{route.breadcrumbName}</Link>
            ) : (
                <span>{route.breadcrumbName}</span>
              );
          }}


          menuItemRender={(menuItemProps, defaultDom) => { // pro 默认配置  存在疑问
            if (menuItemProps.isUrl || menuItemProps.children || !menuItemProps.path) {
              return defaultDom;
            }
            // return <div onClick={() => this.handleNav(menuItemProps.path)}>{defaultDom}</div>
            return <Link to={menuItemProps.path}>{defaultDom}</Link>;
          }}

          footerRender={() => (
            <DefaultFooter
              copyright="2020 杭州辛橙信息科技有限公司出品"
              links={[
                {
                  key: 'one',
                  title: '辛有志严选',
                  href: '/',
                  blankTarget: true,
                },
                {
                  key: 'two',
                  title: '辛橙WMS系统',
                  href: '/',
                  blankTarget: true,
                },
              ]}
            />
          )}

          {...this.props}
          {...settings}
        >
          {children}
        </ProLayout>
        <WareHouseModal />
      </>
    );
  }
}

export default BasicLayout;
