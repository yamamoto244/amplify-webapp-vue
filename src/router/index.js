import Vue from 'vue'
import Router from 'vue-router'
import City from '@/components/City'
import Login from '@/components/Login'

import { AmplifyEventBus, AmplifyPlugin } from 'aws-amplify-vue'
import * as AmplifyModules from 'aws-amplify'

Vue.use(Router)
Vue.use(AmplifyPlugin, AmplifyModules)

let user

// ユーザー管理
getUser().then((user) => {
  if (user) {
    router.push({path: '/'})
  }
})

function getUser () {
  return Vue.prototype.$Amplify.Auth.currentAuthenticatedUser().then((data) => {
    if (data && data.signInUserSession) {
      return data
    }
  }).catch((e) => {
    return null
  })
}

// ログイン状態管理
AmplifyEventBus.$on('authState', async (state) => {
  if (state === 'signedOut') {
    user = null
    router.push({path: '/login'})
  } else if (state === 'signedIn') {
    user = await getUser()
    router.push({path: '/'})
  }
})

// ルーティング設定
const router = new Router({
  mode: 'history',
  routes: [
    {
      // ログインページ
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      // トップページ
      path: '/',
      name: 'City',
      component: City,
      meta: { requiresAuth: true }
    }
  ]
})

// リダイレクト設定
router.beforeResolve(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    user = await getUser()
    if (!user) {
      return next({
        path: '/login'
      })
    }
    return next()
  }
  return next()
})

export default router
