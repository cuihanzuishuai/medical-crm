import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { Dropdown, Avatar } from 'ant-design-vue'
import { UserOutlined } from '@ant-design/icons-vue'
import Icon from '@/components/icon'
import { removeToken } from '@/common/auth'
import { LOGIN_NAME } from '@/config'
import useUserinfo from '@/store/userinfo'
import classNames from '@/common/classNamesBind'
import styles from './style/index.module.scss'

const cx = classNames.bind(styles)

export default defineComponent({
    setup () {
        const router = useRouter()
        const userinfo = useUserinfo()

        function handleLogOut () {
            removeToken()
            router.push({ name: LOGIN_NAME })
        }

        return () => {
            const dropdownSlots = {
                default: () => {
                    const avatarSlots = {
                        icon: () => <UserOutlined/>
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
                            <div class={ cx('item__text', 'no-style') }>{ userinfo.name || '--' }</div>
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
