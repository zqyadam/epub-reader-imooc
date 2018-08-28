import Vue from 'vue'
import App from './App.vue'
// 引入iconfont图标字体
import '@/assets/styles/iconfont.css'
import '@/assets/styles/global.scss'
import router from './router'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

// DOM加载完成时调整字体大小
document.addEventListener("DOMContentLoaded", setFontSize);

// 窗口大小改变时调整字体大小
window.addEventListener('resize', setFontSize)

function setFontSize() {
  const html = document.querySelector("html");
  let fontSize = window.innerWidth / 10;
  fontSize = fontSize > 50 ? 50 : fontSize;
  html.style.fontSize = fontSize + "px";
}