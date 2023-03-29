import { h } from 'vue'
import { Spin } from 'ant-design-vue'
import { LoadingOutlined } from '@ant-design/icons-vue'

export default {
    install (app, options) {
        Spin.setDefaultIndicator({
            indicator: h(LoadingOutlined)
        })
    }
}
