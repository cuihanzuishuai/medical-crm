import { defineComponent } from 'vue'
import { Empty, DatePicker } from 'ant-design-vue'

export default defineComponent({
    setup () {
        return () => {
            return (
                <div style={{ height: '2000px' }}>
                    <DatePicker picker="week"></DatePicker>
                    <Empty></Empty>
                </div>
            )
        }
    }
})
