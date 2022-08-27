import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import io from '@/commons/socket/weapp.socket.io.js'

Vue.config.productionTip = false
Vue.prototype.socket = io('http://10.163.252.185:8082')
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif