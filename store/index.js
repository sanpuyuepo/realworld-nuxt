const cookieParser = process.server ? require('cookieparser') : undefined

// 在服务端渲染期间运行的都是同一个实例
// 为了防止数据冲突, 务必要把 state 定义成函数, 类似Vue组件中的data选项
export const state = () => {
  return {
    // 当前登录用户状态
    user: null
  }
}

export const mutations = {
  setUser(state, data) {
    state.user = data
  }
}

export const actions = {
  // 会在服务端渲染期间自动调用
  // 作用: 初始化容器数据, 传递给客户端使用
  nuxtServerInit({ commit }, { req }) {
    let user = null
    if (req.headers.cookie) {
      const parsed = cookieParser.parse(req.headers.cookie)
      try {
        user = JSON.parse(parsed.user)
      } catch (error) {
        // invalid cookie found
        console.log(error)
      }
    }
    // 提交 mutation 修改 state 状态
    commit('setUser', user)
  }
}
