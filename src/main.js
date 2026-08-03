import './assets/main.css'
import '@mdi/font/css/materialdesignicons.css'
import '@fontsource/geist-sans/100.css'
import '@fontsource/geist-sans/200.css'
import '@fontsource/geist-sans/400.css'
import '@fontsource/geist-sans/700.css'
import '@fontsource/geist-sans/900.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
