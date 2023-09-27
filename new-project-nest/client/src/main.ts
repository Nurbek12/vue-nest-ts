import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import routes from './routes'
import vuetify from './plugins/vuetify'

createApp(App)
    .use(vuetify)
    .use(routes)
    .use(createPinia())
    .mount('#app')