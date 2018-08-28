import Vue from 'vue'
import App from './App.vue'
import '@/assets/styles/iconfont.css'
import '@/assets/styles/global.scss'
import router from './router'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

document.addEventListener("DOMContentLoaded", setFontSize);

window.addEventListener('resize', setFontSize)

function setFontSize() {
  const html = document.querySelector("html");
  let fontSize = window.innerWidth / 10;
  fontSize = fontSize > 50 ? 50 : fontSize;
  html.style.fontSize = fontSize + "px";
}