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
    this.userId = localStorage.getItem(USER_ID_KEY)
    this.token = localStorage.getItem(TOKEN_KEY)
    
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
    return this.xhr(options)
  }
}

export default HttpRequest;
