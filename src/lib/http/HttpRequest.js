import axios from 'axios'
import config from '@/config';
import interceptors from './interceptors';

const { 
  baseUrl, 
  requestTimeout: timeout, 
  TOKEN_KEY, 
  USER_ID_KEY 
} = config;

class HttpRequest {
  constructor() {
    // 由于登录为 其他网址 跳转并携带token 然后 app.js 代码执行 将 token 设置到 localStorage 此为前提 然后才是 页面内部的组件渲染 调用 http请求
    this.token = localStorage.getItem(TOKEN_KEY) 
    // this.userId = localStorage.getItem(USER_ID_KEY)
    
    // this._source = axios.CancelToken.source();
    this.xhr = axios.create(this.getInsideConfig())
    interceptors(this) 
  }

  getInsideConfig() {
    return {
      baseURL: baseUrl,
      timeout,
      // cancelToken: this._source.token,
      headers: {
        token: this.token
      },
      validateStatus: status => {
        return status >= 200 && status < 300;
      },
    }
  }

  // cancel() {
  //   this._source.cancel('request canceled by the user.');
  // }

  request(options) {
    this.userId || (this.userId = localStorage.getItem(USER_ID_KEY))
    return this.xhr(options)
  }
}

export default HttpRequest;
