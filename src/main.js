import Vue from 'vue'
import App from './App'
import router from './router'
import Amplify from 'aws-amplify'
import awsExports from './aws-exports'
import { components, AmplifyPlugin } from 'aws-amplify-vue'

Vue.config.productionTip = false

Vue.use(AmplifyPlugin, Amplify)

Amplify.configure(awsExports)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App,
    ...components
  },
  template: '<App/>'
})
