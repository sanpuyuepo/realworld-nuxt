/**
 * 用户请求模块
 */

// import request from '@/utils/request.js'
import { request } from '@/plugins/request'

// login
export const login = data => {
  return request({
    method: 'POST',
    url: '/users/login',
    data
  })
}

// register
export const register = data => {
  return request({
    method: 'POST',
    url: '/users',
    data
  })
}

// Gets the currently logged-in user
export const getCurrenUser = () => {
  return request({
    method: 'GET',
    url: '/user'
  })
}

// Updated user information for current user
export const updateCurUserInfo = data => {
  return request({
    method: 'PUT',
    url: '/user',
    data
  })
}

