<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <form>
            <fieldset>
              <fieldset class="form-group">
                <input
                  v-model="article.title"
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="Article Title" />
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="article.description"
                  type="text"
                  class="form-control"
                  placeholder="What's this article about?" />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  v-model="article.body"
                  class="form-control"
                  rows="8"
                  placeholder="Write your article (in markdown)"></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="article.tagList"
                  type="text"
                  class="form-control"
                  placeholder="Enter tags" />
                <div class="tag-list"></div>
              </fieldset>
              <button
                class="btn btn-lg pull-xs-right btn-primary"
                type="button"
                @click="publishArticle">
                Publish Article
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createNewArticle, updateArticle, getArticleDetail } from '@/api/article'

export default {
  // 在路由匹配组件渲染之前会先执行中间件处理
  middleware: 'auth',
  name: 'EditorIndex',
  data() {
    return {
      article: {
        title: '',
        description: '',
        body: '',
        tagList: ''
      }
    }
  },
  async asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {
    const slug = params.slug
    if (!slug) {
      return
    }
    const { data } = await getArticleDetail(slug)
    return {
      article: data.article,
      slug
    }
  },
  methods: {
    async publishArticle () {
      console.log('publishing...')
      // 发布新文章或更新文章
      if (this.slug) {
        // 更新文章
        await updateArticle(this.slug, {article: this.article})
        this.$router.push({
          name: 'article',
          params: {
            slug: this.slug
          }
        })
      } else {
        // 发布文章
        const { data } = await createNewArticle({article: this.article})
        const { slug } = data.article
        this.$router.push({
          name: 'article',
          params: {
            slug
          }
        })
      }
      this.article.title = ''
      this.article.description = ''
      this.article.body = ''
      this.article.tagList = ''
    }
  }
}
</script>

<style scoped></style>
