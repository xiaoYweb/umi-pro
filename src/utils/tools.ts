/**
 * 工具库
 * @author zhanghy
 * @version 1.1.1
 */
import accounting from 'accounting';
import md5 from 'blueimp-md5';
import config from '@/config';

const { TOKEN_KEY, WAREHOUSE_ID_KEY, authUrl, USER_ID_KEY } = config;

accounting.settings = {
  currency: {
    symbol: '¥', // default currency symbol is '$'
    format: '%s%v', // controls output: %s = symbol, %v = value/number (can be object: see below)
    decimal: '.', // decimal point separator
    thousand: '', // thousands separator
    precision: 2, // decimal places
  },
  number: {
    precision: 2, // default precision on numbers is 0
    thousand: '',
    decimal: '.',
  },
};
const pattern = /(\w+)\[(\d+)\]/;

export interface TimeDate {
  over: boolean;
  day: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default {
  /**
   * 字符串url编码
   * @param {String} str
   * @return {String}
   */
  encode(str: string): string {
    try {
      return encodeURIComponent(str);
    } catch (e) {
      return str;
    }
  },

  /**
   * 字符串url解码
   * @param {String} str
   * @return {String}
   */
  decode(str: string): string {
    try {
      return decodeURIComponent(str.replace(/\+/g, ' '));
    } catch (e) {
      return str;
    }
  },

  /**
   * 字符串base64加密
   * @param {String} str
   * @return {String}
   */
  base64Encode(str: string): string {
    str = this.encode(str);
    try {
      return btoa(str);
    } catch (e) {
      return str;
    }
  },

  /**
   * 字符串base64解密
   * @param {String} str
   * @return {String}
   */
  base64Decode(str: string): string {
    try {
      str = atob(str);
      return this.decode(str);
    } catch (e) {
      return str;
    }
  },

  /**
   * 将手机号中间4位隐藏
   * @param {String} phone
   * @return {String}
   */
  hidePhone(phone: string): string {
    if (/^1\d{10}$/.test(phone)) {
      return phone.replace(phone.substr(3, 4), '****');
    }

    return phone;
  },

  /**
   * 格式化金币，分转换为元
   * @param {number} price
   * @return {string}
   */
  formatPrice(price: number): string {
    price /= 100;
    return accounting.formatMoney(price);
  },

  /**
   * 格式化分为元并保留2位小数
   * @param {number} num
   * @return {string}
   */
  formatNumber(num: number): string {
    num /= 100;
    return accounting.formatNumber(num);
  },

  formatSales(count: number): string {
    if (count >= 10000) {
      count /= 10000;
      return accounting.formatMoney(count, 'w', 1, '', '.', '%v%s');
    }
    return String(count);
  },

  formatDate(date?: number|Date, fmt = 'YYYY-mm-dd HH:MM:SS'): string {
    if (!(date instanceof Date)) {
      date = date ? new Date(date) : new Date();
    }

    const opt = {
      'Y+': date.getFullYear().toString(), // 年
      'm+': (date.getMonth() + 1).toString(), // 月
      'd+': date.getDate().toString(), // 日
      'H+': date.getHours().toString(), // 时
      'M+': date.getMinutes().toString(), // 分
      'S+': date.getSeconds().toString(), // 秒
      'q+': Math.floor((date.getMonth() + 3) / 3).toString(), // 季度
      's': date.getMilliseconds().toString(), // 毫秒
    };
    for (const k in opt) {
      const ret = new RegExp(`(${k})`).exec(fmt);
      if (ret) {
        fmt = fmt.replace(ret[1], ret[1].length === 1 ? opt[k] : opt[k].padStart(ret[1].length, '0'));
      }
    }

    return fmt;
  },

  countdown(time: number|Date, callback?: (date: TimeDate) => void): any {
    if (time instanceof Date) {
      time = time.getTime() - Date.now();
    }

    let timeout: any;
    const interval = 1000;
    let start = Date.now();
    const counter = () => {
      const date: TimeDate = {
        over: <number>time <= 0,
        day: Math.floor(Math.abs(<number>time) / 1000 / 60 / 60 / 24), // 日
        hours: Math.floor(Math.abs(<number>time) / 1000 / 60 / 60 % 24), // 时
        minutes: Math.floor(Math.abs(<number>time) / 1000 / 60 % 60), // 分
        seconds: Math.floor(Math.abs(<number>time) / 1000 % 60), // 秒
      };
      if (callback) {
        callback(date);
        if (!date.over) {
          (<number>time) -= interval;
          const _interval = interval - Date.now() + start;
          start += interval;
          timeout = setTimeout(counter, _interval < 0 ? 0 : _interval);
        }
      }
      return date;
    }

    let result: any = counter();
    if (callback) {
      result = () => {
        clearTimeout(timeout);
        timeout = undefined;
      }
    }

    return result;
  },

  subLen(str: string, len: number): string {
    let newLength = 0;
    let newStr = '';
    const chineseRegex = /[^\x00-\xff]/g;
    let singleChar = '';
    const strLength = str.replace(chineseRegex, '**').length;
    for (let i = 0; i < strLength; i++) {
      singleChar = str.charAt(i).toString();
      if (singleChar.match(chineseRegex) != null) {
        newLength += 2;
      } else {
        newLength++;
      }
      if (newLength > len) {
        break;
      }
      newStr += singleChar;
    }

    if (strLength > len) {
      newStr += '...';
    }
    return newStr;
  },

  /**
   * 将查询字符串转换为key/value对象
   * @param {String} str
   * @return {Object}
   */
  parse(str: string): { [key: string]: string|string[] } {
    str = str.trim();
    if (str === '') return {};
    if (str.charAt(0) === '?') str = str.slice(1);

    const obj = {};
    const pairs = str.split('&');
    for (let i = 0; i < pairs.length; i++) {
      const parts = pairs[i].split('=');
      const key = this.decode(parts[0]);
      const m = pattern.exec(key);

      if (m) {
        obj[m[1]] = obj[m[1]] || [];
        obj[m[1]][m[2]] = this.decode(parts[1]);
        continue;
      }

      obj[parts[0]] = parts[1] === null
        ? ''
        : this.decode(parts[1]);
    }

    return obj;
  },

  /**
   * 将对象转换为查询字符串
   * @param {object} obj
   * @return {String}
   */
  stringify(obj: object): string {
    if (!obj || !Object.keys(obj).length) return '';
    const pairs: Array<string> = [];

    for (const key in obj) {
      const value = obj[key];

      if (this.toType(value) === 'array') {
        for (let i = 0; i < value.length; i++) {
          const arrStr = `${this.encode(`${key}[${i}]`)}=${this.encode(value[i])}`;
          pairs.push(arrStr);
        }
        continue;
      }

      const str = `${this.encode(key)}=${this.encode(value)}`;
      pairs.push(str);
    }

    return pairs.join('&');
  },

  /**
   * 通过对象原型判断数据类型
   * @param {Any} obj
   * @return {String}
   */
  toType(obj: any): string {
    return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()
  },

  /**
   * 跳转登录
   */
  toLogin(): void {
    let url = window.location.href;
    url = this.encode(url);
    window.location.href = `${authUrl}gaia/#/user/login?redirect=${url}`;
  },

  /**
   * 清理本地用户数据
   */
  clearSession(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(WAREHOUSE_ID_KEY);
    localStorage.removeItem(USER_ID_KEY);
  },

  /**
   * 根据规则生成业务签名
   * @param {object} params
   * @param {number} timestamp
   * @return {string}
   */
  generateSign(params: object, timestamp: number): string {
    const data = { ...params, timestamp };
    let str = '';
    Object.keys(data).sort().forEach(key => {
      str += key + JSON.stringify(data[key]);
    });

    return md5(`${timestamp}${md5(str)}${timestamp}`);
  },

  /**
   * 过滤数据中的空值
   * @param {object} params
   * @return {object}
   */
  filterNull(params: object): object {
    if (Array.isArray(params)) {
      params = params.filter((obj, index, arr) => {
        if (obj == null) {
          return false;
        }
        if (typeof obj === 'string') {
          obj = obj.trim();
          if (obj === '') {
            return false;
          }
        } else if (typeof obj === 'object') {
          obj = this.filterNull(obj);
          const len = obj.hasOwnProperty('length') ? obj.length : Object.keys(obj).length;
          if (len === 0) {
            return false;
          }
        }

        arr[index] = obj;
        return true;
      });
    } else {
      for (const key in params) {
        if (params[key] == null) {
          delete params[key];
        } else if (typeof params[key] === 'string') {
          params[key] = params[key].trim();
          if (params[key] === '') {
            delete params[key];
          }
        } else if (typeof params[key] === 'object') {
          params[key] = this.filterNull(params[key]);
          const len = Object.prototype.hasOwnProperty.call(params[key], 'length')
            ? params[key].length
            : Object.keys(params[key]).length;
          if (len === 0) {
            delete params[key];
          }
        }
      }
    }

    return params;
  },

  /**
   * 函数节流
   * @param {Function} func
   * @param {Number} wait
   * @param {Object} options -- leading = false | trailing = false
   * @return {Function}
   */
  throttle(func: any, wait: number, options: { leading?: boolean, trailing?: boolean } = {}): any {
    let result: any;
    let prev = 0;
    let timeout: NodeJS.Timeout | null;
    let args: any[] | null;
    let ctx: null;

    const later = () => {
      prev = options.leading === false ? 0 : Date.now();
      result = func.apply(ctx, args);
      timeout = args = ctx = null;
    };

    const throttled = function throttled(...arrs: any[]) {
      const now = Date.now();
      if (!prev && options.leading === false) {
        prev = now;
      }
      const remaining = wait - (now - prev);
      args = arrs;
      // @ts-ignore
      ctx = this;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        prev = now;
        result = func.apply(ctx, args);
        if (!timeout) {
          args = ctx = null;
        }
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };

    throttled.cancel = () => {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      prev = 0;
      args = ctx = null;
    };

    return throttled;
  },

  /**
   * 函数防抖
   * @param {Function} func
   * @param {Number} wait
   * @param {Boolean} immediate
   * @return {Function}
   */
  debounce(func: any, wait: number, immediate?: boolean): any {
    let result: any;
    let timeout: NodeJS.Timeout | null;

    const debounced = function debounced(...args: any[]) {
      if (timeout) {
        clearTimeout(timeout);
      }
      if (immediate) {
        const callNow = !timeout;
        timeout = setTimeout(() => {
          timeout = null;
        }, wait);
        if (callNow) {
          // @ts-ignore
          result = func.apply(this, args);
        }
      } else {
        timeout = setTimeout(() => {
          // @ts-ignore
          result = func.apply(this, args);
          timeout = null;
        }, wait);
      }

      return result;
    };

    debounced.cancel = () => {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
    };

    return debounced;
  },
}
