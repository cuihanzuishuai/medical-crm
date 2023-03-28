import { defineComponent, ref, provide, onUnmounted } from 'vue'
import LayoutHeader from './LayoutHeader'
import LayoutSide from './LayoutSide'
import LayoutContent from './LayoutContent'
import routes from '@/routes'
import { getMenuList } from './util'
import classNames from '@/common/classNamesBind'
import styles from './style/index.module.scss'

const cx = classNames.bind(styles)

export default defineComponent({
    setup () {
        const collapsed = ref(true)

        const menus = getMenuList(routes, [])
        return () => {
            return (
                <div class={ cx('layout-main') }>
                    <LayoutSide menus={ menus } collapsed={ collapsed.value }/>
                    <div class={ cx('layout-main__prime') }>
                        <LayoutHeader/>
                        <div class={ cx('layout-main__content') }>
                            <LayoutContent/>
                        </div>
                    </div>
                </div>
            )
        }
    }
})
