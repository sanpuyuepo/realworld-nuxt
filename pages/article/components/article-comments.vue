<template>
  <div>
    <form class="card comment-form">
      <div class="card-block">
        <textarea
          v-model="comment.body"
          class="form-control"
          placeholder="Write a comment..."
          rows="3"></textarea>
      </div>
      <div class="card-footer">
        <img
          :src="user.image"
          class="comment-author-img" />
        <button class="btn btn-sm btn-primary" @click.prevent="postComment">Post Comment</button>
      </div>
    </form>

    <div
      class="card"
      v-for="comment in comments"
      :key="comment.id">
      <div class="card-block">
        <p class="card-text">
          {{ comment.body }}
        </p>
      </div>
      <div class="card-footer">
        <nuxt-link
          :to="{
            name: 'profile',
            params: { username: comment.author.username }
          }"
          class="comment-author">
          <img
            :src="comment.author.image"
            class="comment-author-img" />
        </nuxt-link>
        &nbsp;
        <nuxt-link
          :to="{
            name: 'profile',
            params: { username: comment.author.username }
          }"
          class="comment-author">
          {{ comment.author.username }}
        </nuxt-link>
        <span class="date-posted">{{ comment.createdAt | date() }}</span>
        <span class="mod-options">
          <i v-if="user.username === article.author.username" class="ion-trash-a" @click.prevent="deleteComment(comment.id)"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { getArticleComments, createArticleComment, deleteArticleComment } from '@/api/article'
import { mapState } from 'vuex'

export default {
  name: 'ArticleComments',
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      comments: [], // 文章评论
      comment: {
        body: ''
      }
    }
  },
  mounted() {
    this.getComments()
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    async getComments() {
      const { data } = await getArticleComments(this.article.slug)
      this.comments = data.comments
    },
    async postComment () {
      await createArticleComment(this.article.slug, {comment: this.comment})
      this.comment.body = ''
      this.getComments()
    },
    async deleteComment (id) {
      await deleteArticleComment(this.article.slug, id)
      this.getComments()
    }
  }
}
</script>

<style scoped></style>
