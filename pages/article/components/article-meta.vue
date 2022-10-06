<template>
  <div class="article-meta">
    <nuxt-link
      :to="{ name: 'profile', params: { username: article.author.username } }"
      ><img :src="article.author.image"
    /></nuxt-link>
    <div class="info">
      <nuxt-link
        :to="{ name: 'profile', params: { username: article.author.username } }"
        class="author"
        >{{ article.author.username }}</nuxt-link
      >
      <span class="date">{{ article.createAt | date() }}</span>
    </div>
    <!-- if is not logged-in user -->
    <!-- <template v-if="user.username !== article.author.username"> -->
    <template v-if="!user || user.username !== article.author.username">
      <button
        :disabled="isLoading"
        class="btn btn-sm btn-outline-secondary"
        :class="{ active: article.author.following }"
        @click="followAuthor">
        <template v-if="article.author.following">
          &nbsp; Unfollow {{ article.author.username }}
        </template>
        <template v-else>
          <i class="ion-plus-round"></i>
          &nbsp; Follow {{ article.author.username }}
        </template>
      </button>
      &nbsp;&nbsp;
      <button
        :disabled="isLoading"
        class="btn btn-sm btn-outline-primary"
        :class="{ active: article.author.following }"
        @click="favoritePost">
        <i class="ion-heart"></i>
        &nbsp; {{ article.favorited ? 'Unfavorite' : 'Favorite'}} Article <span class="counter">({{article.favoritesCount}})</span>
      </button>
    </template>

    <!-- if is logged-in user -->
    <template v-else>
      <button
        class="btn btn-sm btn-outline-secondary"
        @click.prevent="goArticleEditor">
        <i class="ion-edit"></i>
        &nbsp; Edit Article
      </button>
      &nbsp;&nbsp;
      <button
        class="btn btn-sm btn-outline-danger"
        @click="deleteArticle">
        <i class="ion-trash-a"></i>
        &nbsp; Delete Article
      </button>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { deleteArticle, addFavorite, deleteFavorite } from '../../../api/article'
import { followUser, unfollowUser } from '../../../api/profile'

export default {
  name: 'ArticleMeta',
  props: {
    article: {
      type: Object,
      required: true
    },
    isLoading: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    goArticleEditor () {
      this.$router.push({
        name: 'editor',
        params: {
          slug: this.article.slug
        }
      })
    },
    async deleteArticle () {
      await deleteArticle(this.article.slug)
      // delete success, go to profile
      this.$router.push({
        name: 'profile',
        params: {
          username: this.article.author.username
        }
      })
    },
    async followAuthor () {
      if (!this.user) {
        this.$router.push({
          name: 'login',
          query: {
            redirect: {
              name: 'article',
              params: {
                slug: this.article.slug
              }
            }
          }
          
        })
        return
      }
      const followOrNot = this.article.author.following ? unfollowUser : followUser
      await followOrNot(this.article.author.username)
      this.sendData()
    },
    async favoritePost () {
      if (!this.user) {
        this.$router.push({
          name: 'login',
          query: {
            redirect: {
              name: 'article',
              params: {
                slug: this.article.slug
              }
            }
          }
          
        })
        return
      }
      console.log('favorite...')
      const favoriteArticleOrNot = this.article.favorited ? deleteFavorite : addFavorite
      await favoriteArticleOrNot(this.article.slug)
      this.sendData()
    },
    sendData () {
      this.$emit('sendData', this.article.slug)
    }
  },
}
</script>

<style scoped></style>
