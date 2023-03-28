import { createRouter, createWebHistory } from 'vue-router'
import { canTurnTo } from '@/layout/util'
import { getToken, removeToken } from '@/common/auth'
import { LOGIN_NAME, HOME_NAME } from '@/config'
import useUserinfo from '@/store/userinfo'
import routes from '@/routes'

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

router.beforeEach((to, from, next) => {
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
            if (canTurnTo(to.name, routes, userinfo.access)) {
                next()
            } else {
                next({ replace: true, name: 'error-401' })
            }
        } else {
            userinfo.getUserInfo()
                .then(() => {

                })
                .catch(() => {

                })
        }
    }
})

export default router
