<template>
  <div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img
              :src="profile.image"
              class="user-img" />
            <h4>{{ profile.username }}</h4>
            <p>{{ profile.bio }}</p>

            <button v-if="isSameUser" class="btn btn-sm btn-outline-secondary action-btn" @click.prevent="editProfile">
              <i class="ion-gear-a"></i>
              &nbsp; Edit Profile Settings
            </button>
            <button v-else class="btn btn-sm btn-outline-secondary action-btn" @click.prevent="followTheUser">
              <i class="ion-plus-round"></i>
              &nbsp; follow xxx
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  exact
                  :class="{ active: tab === 'my_articles' }"
                  :to="{ name: 'profile', query: { tab: 'my_articles' } }"
                  >My Articles</nuxt-link
                >
              </li>
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  exact
                  :class="{ active: tab === 'favorited' }"
                  :to="{ name: 'profile', query: { tab: 'favorited' } }"
                  >Favorited Articles</nuxt-link
                >
              </li>
            </ul>
          </div>

          <template v-if="articlesCount > 0">
             <div class="article-preview" v-for="article in articles" :key="article.slug">
              <div class="article-meta">
                <nuxt-link to="">
                  <img :src="article.author.image" />
                </nuxt-link>
                <div class="info">
                  <nuxt-link to="" class="author">{{article.author.username}}</nuxt-link>
                  <span class="date">{{article.createAt | date()}}</span>
                </div>
                <button class="btn btn-outline-primary btn-sm pull-xs-right">
                  <i class="ion-heart"></i> {{article.favoritesCount}}
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
          <nav v-if="totalPage > 1">
            <ul class="pagination">
              <li
                class="page-item"
                v-for="item in totalPage"
                :key="item">
                <nuxt-link
                  :to="{
                    name: 'profile',
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
      </div>
    </div>
  </div>
</template>

<script>
import { getProfile, followUser, unfollowUser } from '@/api/profile'
import { getArticles } from '@/api/article'

export default {
  middleware: 'auth',
  name: 'UserProfile',
  async asyncData({ params, query, store }) {
    const username = params.username
    const loggedUser = store.state.user.username
    const page = Number.parseInt(query.page) || 1
    const limit = 20
    const tab = query.tab || 'my_articles'
    const queryParams = tab === 'favorited' ? 'favorited' : 'author'
    const [profileRes, articleRes] = await Promise.all([getProfile(username), getArticles({
        limit,
        offset: (page - 1) * limit,
        [queryParams]: username
    })])
    const {profile} = profileRes.data
    const {articles, articlesCount} = articleRes.data
    return {
      profile,
      articles,
      articlesCount,
      limit,
      page,
      tab,
      loggedUser,
      username
    }
  },
  computed: {
    totalPage() {
      return Math.ceil(this.articlesCount / this.limit)
    },
    isSameUser () {
      return this.loggedUser === this.username
    }
  },
  watchQuery: ['page', 'tab'],
  methods: {
    editProfile () {
      this.$router.push({
        name: 'settings',
      })
    },
    followTheUser () {
      console.log('following...')
    },
    unfollowTheUser () {
      console.log('unfollow')
    }
  }
}
</script>

<style scoped></style>
