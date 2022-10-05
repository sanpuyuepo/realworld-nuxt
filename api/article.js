/**
 * 文章请求模块
 */

import { request } from '@/plugins/request'

// 获取公共文章
export const getArticles = params => {
  return request({
    method: 'GET',
    url: '/articles',
    params
  })
}

// 获取订阅的用户的文章列表
export const getFeedArticles = params => {
  return request({
    method: 'GET',
    url: `/articles/feed`,
    params
  })
}

// 文章点赞
export const addFavorite = slug => {
  return request({
    method: 'POST',
    url: `/articles/${slug}/favorite`
  })
}

// 取消点赞
export const deleteFavorite = slug => {
  return request({
    method: 'DELETE',
    url: `/articles/${slug}/favorite`
  })
}

// 获取文章详情
export const getArticleDetail = slug => {
  return request({
    method: 'GET',
    url: `/articles/${slug}`
  })
}

// 获取文章评论
export const getArticleComments = slug => {
  return request({
    method: 'GET',
    url: `/articles/${slug}/comments`
  })
}

// Create a comment for an article. Auth is required
export const createArticleComment = (slug, data) => {
  return request({
    method: 'POST',
    url: `/articles/${slug}/comments`,
    data
  })
}

// Delete a comment for an article. Auth is required
export const deleteArticleComment = (slug, id) => {
  return request({
    method: 'DELETE',
    url: `/articles/${slug}/comments/${id}`
  })
}

// Create an article. Auth is required
export const createNewArticle = data => {
  return request({
    method: 'POST',
    url: '/articles',
    data
  })
}

// Update an article. Auth is required
export const updateArticle = (slug, data) => {
  return request({
    method: 'PUT',
    url: `/articles/${slug}`,
    data
  })
}

// Delete an article. Auth is required
export const deleteArticle = slug => {
  return request({
    method: 'DELETE',
    url: `/articles/${slug}`
  })
}
