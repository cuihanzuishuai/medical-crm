import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { Dropdown, Avatar } from 'ant-design-vue'
import { UserOutlined } from '@ant-design/icons-vue'
import Icon from '@/components/icon'
import { removeToken } from '@/common/auth'
import { LOGIN_NAME } from '@/config'
import classNames from '@/common/classNamesBind'
import styles from './style/index.module.scss'

const cx = classNames.bind(styles)

export default defineComponent({
    setup () {
        const router = useRouter()

        function handleLogOut () {
            removeToken()
            router.push({ name: LOGIN_NAME })
        }

        return () => {
            const dropdownSlots = {
                default: () => {
                    const outlinedStyles = {
                        transform: 'translateX(1px)'
                    }
                    const avatarSlots = {
                        icon: () => <UserOutlined style={ outlinedStyles }/>
                    }
                    return (
                        <div class={ cx('avatar-wrap') }>
                            <Avatar v-slots={ avatarSlots } size={ 28 }/>
                            <Icon class={ cx('down-icon') } type="icon-dropdown"/>
                        </div>
                    )
                },
                overlay: () => {
                    return (
                        <div class={ cx('user-card') }>
                            <div class={ cx('item__text') } onClick={ handleLogOut }>退出登录</div>
                        </div>
                    )
                }
            }

            return (
                <div class={ cx('user-avatar') }>
                    <Dropdown placement="bottom" v-slots={ dropdownSlots }/>
                </div>
            )
        }
    }
})
