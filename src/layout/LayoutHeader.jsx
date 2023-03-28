import { defineComponent, inject } from 'vue'
import classNames from '@/common/classNamesBind'
import styles from './style/header.module.scss'

const cx = classNames.bind(styles)

export default defineComponent({
    setup() {
        return () => {
            return (
                <div class={cx('layout-header')}>111</div>
            )
        }
    }
})
