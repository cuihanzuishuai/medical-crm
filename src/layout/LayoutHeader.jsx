import { defineComponent } from 'vue'
import UserAvatar from './components/user-avatar'
import Fullscreen from './components/fullscreen'
import Icon from '@/components/icon'
import classNames from '@/common/classNamesBind'
import styles from './style/header.module.scss'

const cx = classNames.bind(styles)

export default defineComponent({
    props: {
        collapsed: {
            type: Boolean,
            default: false
        }
    },
    emits: ['change'],
    setup (props, { emit }) {
        function handleCollapseClick () {
            emit('change', !props.collapsed)
        }

        return () => {
            const collapseClassNames = cx('collapse__icon', {
                'collapse__icon-down': props.collapsed
            })

            return (
                <div class={ cx('layout-header') }>
                    <div class={ cx('layout-header__left') }>
                        <div class={ cx('collapse') } onClick={ handleCollapseClick }>
                            <Icon class={ collapseClassNames } type="icon-caidan"/>
                        </div>
                    </div>
                    <div class={ cx('layout-header__right') }>
                        <Fullscreen/>
                        <UserAvatar/>
                    </div>
                </div>
            )
        }
    }
})
