/**
 * form fns
 * getFieldDecorator(key, option)(<Comp />)
 * getFieldsValue() 获取 数据状态
 * setFieldsValue() 设置 数据状态
 * resetFields()  重置状态
 * validateFields(['keyname'], {force: true} / (err, values) => {} )
 */

/**
 * 1. 输入url请求 执行 app.js 内部代码 (获取 url query参数中的token 存入redux、localstorage中) -- 触发时机为 第一次渲染页面 或则 刷新 
 * 2. path 匹配 react-router 渲染对应的组件 
 * 2.0 触发 modals/golbal.js 中的 subscribe 订阅的函数 
 * 2.1 SecurityLayout 权鉴  判断 redux 中是否存在个人信息 
 * 2.2 BasicLayout 管理系统 页面基本外框结构
 * 2.3 渲染对应的组件  / 重定向 /home 路径
 * 2.4 找不到则 匹配 404 NOT FOUND 组件
 */

/**
 * 1. 若相关组件没有调用 dispatch 对应的 modal 则 loading 中不存在 对应的 modal数据 
 * 2.1 loading.modal[namespace] / loading.effects['namespace/fn'] !== undefined 说明未被调用 dispatch
 * 2.2 typeof === 'boolean'  true ? 正在请求 : generate 函数 执行完成 
 * 2.3 用于判断数据是否请求完成 loading
 */

/**
 * 权鉴系统
 * 1 url 匹配路由 渲染 SecurityLayout组件 请求 用户信息(获取localstorage 中 token作为参数) 赋值 redux 和 localstorage 中 
 * 2 判断 redux中是否存在用户信息 如果没有 则重定向到 统一 登录 地址 ? q=directUrl
 * 3 登录 成功  跳转 redirectUrl?token=xxxx 
 * 4 请求 接口 返回 没有token 或者 token失效  清除 token及 并跳转的登录页  (axios interceptors response)
 */
