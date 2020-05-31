import { get, post } from '@/lib/http';

/**
 * 获取登录员工信息
 */
export async function queryCurrent() { // 获取个人信息
  return get('usercenter/operate/get');
}

/**
 * 运营后台登录
 * @param params
 */
export async function goLogin(params) {
  return post('usercenter/operate/login', params);
}

/**
 * 运营后台手机登录
 * @param params
 */
export async function goMobileLogin(params) {
  return post('usercenter/operate/phone/login', params);
}

/**
 * 运营后台登出
 */
export async function goLogout() { // 账号登出
  return get('usercenter/operate/logout');
}

/**
 * 模糊查询员工信息
 * @param keyword
 */
export async function queryContacter(keyword) {
  return post('usercenter/employee/find', {
    keyword,
  });
}
