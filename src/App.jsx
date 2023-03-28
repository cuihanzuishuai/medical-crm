import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'
import { ConfigProvider } from 'ant-design-vue'
import dayjs from 'dayjs'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')

export default defineComponent({
    setup () {
        return () => {
            return (
                <ConfigProvider locale={ zhCN }>
                    <RouterView/>
                </ConfigProvider>
            )
        }
    }
})
