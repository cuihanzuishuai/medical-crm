import { defineComponent, inject } from 'vue'
import classNames from '@/common/classNamesBind'
import styles from './style/content.module.scss'

const cx = classNames.bind(styles)

export default defineComponent({
    setup() {
        return () => {
            return (
                <div class={cx('layout-content')}>111</div>
            )
        }
    }
})
