/* eslint-disable no-param-reassign */
import axios from 'axios'
import Toast from '@/lib/Toast';
import tools from '@/utils/tools';

const HTTP_STATUS_TEXT = {
  401: '您还没有登录', // 您还没有登录
  403: '没有权限访问', // 没有权限访问
  404: '请求资源不存在', // 请求资源不存在
  502: '服务端出现了问题', // 服务端出现了问题
}

function interceptors(instance) {
  const { xhr, userId: operator } = instance;
  xhr.interceptors.request.use(requestConfig => {
    const { method } = requestConfig;

    const re = /put|post|patch/; // 这3中请求方式 使用data字段
    // get post 请求参数中加入 这个operator 操作人 参数
    if (re.test(method)) {
      requestConfig.data = { ...requestConfig.data, operator } // 可能为 undefined 为此需如此赋值
    } else {
      requestConfig.params = { ...requestConfig.params, operator }
    }

    return requestConfig
  }, err => {
    Toast.notice({
      msg: '请求发生未知错误',
      desc: '这可能是个兼容问题，请升级您的浏览器',
      type: 'error',
    });
    return Promise.reject(err)
  })

  xhr.interceptors.response.use(res => {
    return res.data
  }, err => {
    const { response } = err;
    if (axios.isCancel(err)) {
      Toast.notice({
        msg: '请求被取消',
        desc: err.message || '您取消了这次网络请求',
      })
    } else if (response && response.status) {
      const { status, statusText, config: { url } } = response;
      if (status === 401) {
        tools.clearSession();
        tools.toLogin();
      }
      const errorText = HTTP_STATUS_TEXT[status] || statusText;

      Toast.notice({
        msg: `请求错误 [${status}: ${url}]`,
        desc: errorText,
        type: 'error',
      });
    } else if (!response) { // 跨域错误 或者 访问不存在的服务
      Toast.notice({
        msg: '网络异常',
        desc: '您的网络发生异常，无法连接服务器',
        type: 'error',
      });
    }

    return Promise.reject(err)
  })
}

export default interceptors;

/**
 * const HTTP_STATUS = {
    SUCCESS: 200,
    CREATED: 201,
    ACCEPTED: 202,
    CLIENT_ERROR: 400,
    AUTHENTICATE: 401, // 您还没有登录
    FORBIDDEN: 403, // 没有权限访问
    NOT_FOUND: 404, // 请求资源不存在
    SERVER_ERROR: 500,
    BAD_GATEWAY: 502, // 服务端出现了问题
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504,
  };
 */

/**
 * post put patch --- data
 * other          --- params
 */
