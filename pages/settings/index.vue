<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>

          <form>
            <fieldset>
              <fieldset class="form-group">
                <input
                  v-model="user.image"
                  class="form-control"
                  type="text"
                  placeholder="URL of profile picture" />
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="user.username"
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Your Name" />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  v-model="user.bio"
                  class="form-control form-control-lg"
                  rows="8"
                  placeholder="Short bio about you"></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="user.email"
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Email" />
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="user.password"
                  class="form-control form-control-lg"
                  type="password"
                  placeholder="Password" />
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right" @click.prevent="updateSettings">
                Update Settings
              </button>
            </fieldset>
          </form>
          <button class="btn btn-danger" @click="logout">Or click here to logout</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrenUser, updateCurUserInfo } from '@/api/user'
// 仅在客户端加载 js-cookie 包
const Cookie = process.client ? require('js-cookie') : undefined

export default {
  middleware: 'auth',
  name: 'SettingsIndex',
  data() {
    return {
      user: {
        email: '',
        password: '',
        username: '',
        bio: '',
        image: ''
      }
    }
  },
  mounted() {
    this.getLoggedInUser()
  },
  methods: {
    async getLoggedInUser () {
      const { data } = await getCurrenUser()
      this.user = data.user
      console.log(data)
    },  
    async updateSettings () {
      // todo 表单校验
      const { data } = await updateCurUserInfo({user: this.user})
      console.log(data)
      this.$router.push({
        name: 'profile',
        params: {
          username: this.user.username
        }
      })
    },
    // logout
    logout () {
      console.log('logout...')
      Cookie.remove('user')
      this.$store.commit('setUser', null)
      this.$router.push({
        name: 'home',
      })
    }
  }
}
</script>

<style scoped></style>
