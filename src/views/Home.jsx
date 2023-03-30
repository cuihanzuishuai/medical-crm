import { defineComponent } from 'vue'
import { Empty } from 'ant-design-vue'

export default defineComponent({
    setup () {
        return () => {
            return (
                <div style={ { height: '2000px' } }>
                    <Empty></Empty>
                </div>
            )
        }
    }
})
