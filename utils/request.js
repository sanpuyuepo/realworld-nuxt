/**
 * 基于 axios 二次封装请求模块
 */

import axios from 'axios'

const request = axios.create({
  baseURL: 'https://conduit.productionready.io/api'
})

// 请求拦截器
// Add a request interceptor
request.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

// 响应拦截器

export default request
