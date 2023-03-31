import { createApp } from 'vue'
import Root from '@/App'
import router from '@/router'
import pinia from '@/store'
// -- plugin
import plugin from '@/plugin'
// -- images
import preloader from '@/config/preloader'
import preloaderList from '@/config/preloaderList'
// -- css
import '@/assets/css/base.css'
import '@/assets/css/transition.scss'

const app = createApp(Root)
app.use(plugin)
app.use(router)
app.use(pinia)

void async function () {
    await preloader(preloaderList)
    app.mount('#app')
}()
