// token过期时间 默认一天
export const cookieExpires = 1

// icon 在线地址
export const scriptUrl = '//at.alicdn.com/t/c/font_3980375_ek7nt4um40m.js'

// 首页
export const HOME_NAME = 'home'

// 登录页
export const LOGIN_NAME = 'login'

// 环境变量
const ENV_OBJ = {
    development: {
        baseURL: ''
    },
    test: {
        baseURL: ''
    },
    prod: {
        baseURL: ''
    }
}

const VITE_VUE_APP_ENV = import.meta.env.VITE_VUE_APP_ENV
const ENV_TARGET = ENV_OBJ[VITE_VUE_APP_ENV]

export function baseURL () {
    return ENV_TARGET.baseURL
}

