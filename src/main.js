import { createApp } from 'vue'
import Root from '@/App'
import router from '@/router'
// --
import '@/assets/css/base.css'
import '@/assets/css/transition.scss'

const app = createApp(Root)
app.use(router)
app.mount('#app')
