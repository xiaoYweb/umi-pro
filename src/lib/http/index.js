import Toast from '@/lib/Toast';
import HttpRequest from './HttpRequest';

const http = new HttpRequest()

export const get = (url, params) => {
  const options = {
    method: 'get',
    url,
    params
  }
  return http.request(options)
}

export const post = (url, data) => {
  const options = {
    method: 'post',
    url,
    data
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
  return http.request(options).then(res => {
    return res
  }).catch(err => {
    return Promise.reject(err)
  }).finally(() => {
    Toast.loaded();
  })
}
