import { defineComponent, ref } from 'vue'
// import { BackTop } from 'ant-design-vue'
import { RouterView } from 'vue-router'
import classNames from '@/common/classNamesBind'
import styles from './style/content.module.scss'

const cx = classNames.bind(styles)

export default defineComponent({
    setup () {
        const spaceRef = ref(null)

        return () => {
            return (
                <div class={ cx('layout-content') }>
                    <div class={ cx('content-space') } ref={ spaceRef }>
                        <div id="viewContainer" class={cx('view-container')}>
                            <div class={ cx('content__fill') }/>
                            <div class={ cx('content__view') }>
                                <RouterView/>
                            </div>
                            {/*<BackTop target={ () => spaceRef.value }/>*/}
                            <div class={ cx('content__fill') }/>
                        </div>
                    </div>
                </div>
            )
        }
    }
})
