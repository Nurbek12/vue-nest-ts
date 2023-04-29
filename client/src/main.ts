import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'
import App from './App.vue'
import routes from './routes'
import vuetify from './plugins/vuetify'

createApp(App)
    .use(createPinia())
    .use(vuetify)
    .use(routes)
    .mount('#app')