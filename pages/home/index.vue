<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">miura conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li
                v-if="user"
                class="nav-item">
                <nuxt-link
                  class="nav-link"
                  exact
                  :class="{ active: tab === 'your_feed' }"
                  :to="{ name: 'home', query: { tab: 'your_feed' } }"
                  >Your Feed</nuxt-link
                >
              </li>
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  exact
                  :class="{ active: tab === 'global_feed' }"
                  :to="{ name: 'home', query: { tab: 'global_feed' } }"
                  >Global Feed</nuxt-link
                >
              </li>
              <li
                v-if="tag"
                class="nav-item">
                <nuxt-link
                  class="nav-link"
                  exact
                  :class="{ active: tab === 'tag' }"
                  :to="{ name: 'home', query: { tab: 'tag', tag: tag } }"
                  >#{{ tag }}</nuxt-link
                >
              </li>
            </ul>
          </div>

          <template v-if="articles.length">
            <div
              v-for="article in articles"
              :key="article.slug"
              class="article-preview">
              <div class="article-meta">
                <nuxt-link
                  :to="{
                    name: 'profile',
                    params: { username: article.author.username }
                  }"
                  ><img :src="article.author.image"
                /></nuxt-link>
                <div class="info">
                  <nuxt-link
                    class="author"
                    :to="{
                      name: 'profile',
                      params: { username: article.author.username }
                    }"
                    >{{ article.author.username }}</nuxt-link
                  >
                  <span class="date">{{ article.createdAt | date() }}</span>
                </div>
                <button
                  class="btn btn-outline-primary btn-sm pull-xs-right"
                  :class="{ active: article.favorited }"
                  @click="onFavorite(article)"
                  :disabled="article.favoriteDisabled">
                  <i class="ion-heart"></i>{{ article.favoritesCount }}
                </button>
              </div>
              <nuxt-link
                :to="{
                  name: 'article',
                  params: {
                    slug: article.slug
                  }
                }"
                class="preview-link">
                <h1>{{ article.title }}</h1>
                <p>{{ article.description }}</p>
                <span>Read more...</span>
              </nuxt-link>
            </div>
          </template>

          <template v-else>
            <div>
              <p>No articles are here... yet.</p>
            </div>
          </template>
          

          <!-- 分页 -->
          <nav>
            <ul class="pagination">
              <li
                class="page-item"
                v-for="item in totalPage"
                :key="item">
                <nuxt-link
                  :to="{
                    name: 'home',
                    query: {
                      page: item
                    }
                  }"
                  class="page-link"
                  :class="{
                    active: item === page
                  }"
                  >{{ item }}</nuxt-link
                >
              </li>
            </ul>
          </nav>
        </div>
        <!-- tags -->
        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div class="tag-list">
              <nuxt-link
                v-for="tag in tags"
                :key="tag"
                :to="{
                  name: 'home',
                  query: {
                    tag: tag,
                    tab: 'tag'
                  }
                }"
                class="tag-pill tag-default"
                >{{ tag }}</nuxt-link
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getArticles,
  getFeedArticles,
  addFavorite,
  deleteFavorite
} from '../../api/article'
import { getTags } from '@/api/tag'

import { mapState } from 'vuex'

export default {
  name: 'HomeIndex',
  async asyncData({ query, store }) {
    const page = Number.parseInt(query.page) || 1
    const limit = 20
    const { tag } = query
    const tab = query.tab || 'global_feed'
    const loadArticles =
      store.state.user && tab === 'your_feed' ? getFeedArticles : getArticles
    const [articleRes, tagRes] = await Promise.all([
      loadArticles({
        limit,
        offset: (page - 1) * limit,
        tag
      }),
      getTags()
    ])
    const { articles, articlesCount } = articleRes.data
    const { tags } = tagRes.data

    articles.forEach(article => (article.favoriteDisabled = false))

    return {
      articles,
      articlesCount,
      limit,
      page,
      tags,
      tag,
      tab
    }
  },
  computed: {
    totalPage() {
      return Math.ceil(this.articlesCount / this.limit)
    },
    ...mapState(['user'])
  },
  watchQuery: ['page', 'tag', 'tab'],
  methods: {
    async onFavorite(article) {
      // 判断用户是否登录，没有登录则不能点赞
      if (!this.user) {
        // 跳转到登录页
        this.$router.push({
          name: 'login'
        })
        return
      }
      article.favoriteDisabled = true
      if (article.favorited) {
        // 取消点赞
        await deleteFavorite(article.slug)
        article.favorited = false
        article.favoritesCount -= 1
      } else {
        // 添加点赞
        await addFavorite(article.slug)
        article.favorited = true
        article.favoritesCount += 1
      }
      article.favoriteDisabled = false
    }
  }
}
</script>

<style scoped></style>
