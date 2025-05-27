import { createApp } from 'vue'
import App from './App.vue'
import emotes from './utils/emotes'
import { createWebHashHistory, createRouter } from 'vue-router'
import Chat from './components/Chat.vue'
import MainENG from './eng.vue'

const app = createApp(App)

const routes = [
  { path: '/chat', component: Chat },
  { path: '/', component: MainENG },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

app.directive('emotes', {
  mounted(el, binding) {
    el.innerHTML = emotes.ParseEmotes(el.innerHTML, binding.value)
  },
})

app.directive('bits', {
  mounted(el, binding) {
    el.innerHTML = emotes.ParseBits(el.innerHTML, binding.value)
  },
})

app.use(router).mount('#app')
