import '@/assets/base.css'
import '@/assets/global.scss'

import { createPinia } from 'pinia'
import { createApp } from 'vue'

import i18n from '@/plugins/i18n/entry'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(i18n)
app.use(createPinia())
app.use(router)
app.mount('#app')
