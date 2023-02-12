import { createApp } from 'vue'
import App from '@/App.vue'
import routers from '@/routers'
import { loadAllPlugins } from '@/plugins'

import { createPinia } from "pinia"
const pinia = createPinia();

const app = createApp(App)

app
.use(pinia)
.use(routers)
.mount('#app')

// 加载所有插件
loadAllPlugins(app)