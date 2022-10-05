<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">{{ isLogin ? 'Sign in' : 'Sign up' }}</h1>
          <p class="text-xs-center">
            <!-- <a href="">Have an account?</a> -->
            <nuxt-link
              v-if="isLogin"
              to="/register"
              >Need an account?</nuxt-link
            >
            <nuxt-link
              v-else
              to="/login"
              >Have an account?</nuxt-link
            >
          </p>

          <ul class="error-messages">
            <template v-for="(messages, field) in errors">
              <!-- <li
                v-for="(message, index) in messages"
                :key="index">
                {{ field }} {{ message }}
              </li> -->
              <li>{{field}} {{messages}}</li>
            </template>
          </ul>

          <form @submit.prevent="onSubmit">
            <fieldset
              v-if="!isLogin"
              class="form-group">
              <input
                required
                v-model="user.username"
                class="form-control form-control-lg"
                type="text"
                placeholder="Your Name" />
            </fieldset>
            <fieldset class="form-group">
              <input
                required
                v-model="user.email"
                class="form-control form-control-lg"
                type="email"
                placeholder="Email" />
            </fieldset>
            <fieldset class="form-group">
              <input
                required
                minlength="8"
                v-model="user.password"
                class="form-control form-control-lg"
                type="password"
                placeholder="Password" />
            </fieldset>
            <button class="btn btn-lg btn-primary pull-xs-right">
              {{ isLogin ? 'Sign in' : 'Sign up' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { login, register } from '@/api/user'

// 仅在客户端加载 js-cookie 包
const Cookie = process.client ? require('js-cookie') : undefined

export default {
  middleware: 'notAuth',
  name: 'LoginIndex',
  computed: {
    isLogin() {
      return this.$route.name === 'login'
    }
  },
  data() {
    return {
      user: {
        email: '',
        password: ''
      },
      errors: {} // 错误信息
    }
  },
  methods: {
    async onSubmit() {
      try {
        const { data } = this.isLogin
          ? await login({
              user: this.user
            })
          : await register({
              user: this.user
            })

        // todo 保存用户登录状态
        this.$store.commit('setUser', data.user)
        // 为了防止刷新页面数据丢失, 需要数据持久化处理,
        // 因为需要客户端和服务端都能拿到数据, 所以使用 cookie: 客户端刷新后 vuex 容器中state会丢失, 需要通过服务端设置
        // js-cookie: A simple, lightweight JavaScript API for handling cookies.
        // 设置完成后可以在浏览器的调试工具-application-Cookie 中看到设置的cookie
        Cookie.set('user', JSON.stringify(data.user))
        // 跳转首页
        this.$router.push('/')
      } catch (error) {
        this.errors = error.response.data.errors
      }
    }
  }
}
</script>

<style scoped></style>
