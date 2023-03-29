import { defineComponent } from 'vue'
import { Spin } from 'ant-design-vue'
import classNames from '@/common/classNamesBind'
import styles from './style/index.module.scss'

const cx = classNames.bind(styles)

export default defineComponent({
    props: {
        ...Spin.props
    },
    setup (props) {
        return () => {
            return (
                <div class={ cx('loading') }>
                    <Spin { ...props }>
                        <div class={ cx('loading-container') }/>
                    </Spin>
                </div>
            )
        }
    }
})
