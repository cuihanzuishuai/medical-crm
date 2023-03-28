// token过期时间 默认一天
export const cookieExpires = 1

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

