import { defineComponent } from 'vue'
import { Empty, DatePicker, Spin, message } from 'ant-design-vue'

export default defineComponent({
    setup () {
        message.success('This is a success message')
        return () => {
            return (
                <div style={ { height: '2000px' } }>
                    <Empty></Empty>
                    <Spin spinning={ true } size="large">
                        <DatePicker picker="week"></DatePicker>
                    </Spin>
                </div>
            )
        }
    }
})
