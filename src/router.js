import { createRouter, createWebHistory } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import { canTurnTo } from '@/layout/util'
import { getToken, removeToken } from '@/common/auth'
import { LOGIN_NAME, HOME_NAME } from '@/config'
import useUserinfo from '@/store/userinfo'
import routes from '@/routes'
import Loading from '@/components/loading'

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

function turnTo (to, next, access) {
    if (canTurnTo(to.name, routes, access)) {
        next()
    } else {
        next({ replace: true, name: 'error-401' })
    }
}

router.beforeEach((to, from, next) => {
    message.destroy()
    Modal.destroyAll()
    // --
    const userinfo = useUserinfo()
    const token = getToken()
    if (!token && to.name !== LOGIN_NAME) {
        next({ name: LOGIN_NAME })
    } else if (!token && to.name === LOGIN_NAME) {
        next()
    } else if (token && to.name === LOGIN_NAME) {
        next({ name: HOME_NAME })
    } else {
        if (userinfo.hasGetInfo) {
            turnTo(to, next, userinfo.access)
        } else {
            Loading()
            userinfo.getUserInfo()
                .then((access) => {
                    turnTo(to, next, access)
                })
                .catch((err) => {
                    removeToken()
                    Modal.error({
                        title: 'Error',
                        content: err.message,
                        onOk: () => {
                            next({ name: LOGIN_NAME })
                        }
                    })
                })
                .finally(() => {
                    Loading.destroy()
                })
        }
    }
})

export default router
