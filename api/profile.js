/**
 * profile请求模块
 */

import { request } from '@/plugins/request'

// 获取用户profile
export const getProfile = username => {
  return request({
    method: 'GET',
    url: `/profiles/${username}`
  })
}

// Follow a user by username
export const followUser = username => {
  return request({
    method: 'POST',
    url: `/profiles/${username}/follow`
  })
}

// Unfollow a user by username
export const unfollowUser = username => {
  return request({
    method: 'DELETE',
    url: `/profiles/${username}/follow`
  })
}
