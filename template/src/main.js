import Vue from 'vue'
import App from './App'
// {{#router}}
import router from './router'
// {{/router}}

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  // {{#router}}
  router,
  // {{/router}}
  render: h => h(App)
})
