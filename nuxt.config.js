/**
 * Nuxt.js 配置文件
 */

module.exports = {
  target: 'static',
  router: {
    // 路由导航高亮: 精确匹配
    linkExactActiveClass: 'active',
    extendRoutes(routes, resolve) {
      // 清除 Nuxt.js 基于pages 目录生成的默认路由规则
      routes.splice(0)

      routes.push(
        ...[
          {
            path: '/',
            component: resolve(__dirname, 'pages/layout'),
            children: [
              {
                path: '', // 默认子路由
                name: 'home',
                component: resolve(__dirname, 'pages/home')
              },
              {
                path: '/login',
                name: 'login',
                component: resolve(__dirname, 'pages/login')
              },
              {
                path: '/register',
                name: 'register',
                component: resolve(__dirname, 'pages/login')
              },
              {
                path: '/profile/:username',
                name: 'profile',
                component: resolve(__dirname, 'pages/profile')
              },
              {
                path: '/settings',
                name: 'settings',
                component: resolve(__dirname, 'pages/settings')
              },
              {
                path: '/editor/:slug?',
                name: 'editor',
                component: resolve(__dirname, 'pages/editor')
              },
              {
                path: '/article/:slug',
                name: 'article',
                component: resolve(__dirname, 'pages/article')
              }
            ]
          }
        ]
      )
    }
  },
  plugins: ['~/plugins/request.js', '~/plugins/dayjs.js'],
  server: {
    host: 'localhost', // 本地环境
    // host: '0.0.0.0', //生产环境
    port: 3000
  }
}
