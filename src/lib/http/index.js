import Toast from '@/lib/Toast';
import HttpRequest from './HttpRequest';

const http = new HttpRequest()

export const get = (url, params) => {
  const options = {
    method: 'get',
    url,
    params
  }
  return http.request(options).then(thenCallback)
}

export const post = (url, data, config) => {
  const options = {
    method: 'post',
    url,
    data,
    ...config
  }
  return http.request(options).then(thenCallback)
}

export const requestExcel = (url, data) => {
  const options = {
    method: 'post',
    url,
    data,
    responseType: 'blob'
  }
  return http.request(options)
}

export const requestWithSpin = (url, params) => {
  const options = {
    method: 'get',
    url,
    params
  }
  Toast.loading();
  return http.request(options).then(thenCallback).finally(() => {
    Toast.loaded();
  })
}

function thenCallback(res) {
  const { status, message } = res;
  if (!status) {
    Toast.error(message)
    return Promise.reject(message)
  }
  return res
}
