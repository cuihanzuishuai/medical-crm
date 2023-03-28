import Cookies from 'js-cookie'
import { cookieExpires } from '@/config'

// token
export const TOKEN_KEY = 'token'

export function setToken (token) {
    Cookies.set(TOKEN_KEY, token, { expires: cookieExpires || 1 })
}

export function getToken () {
    const token = Cookies.get(TOKEN_KEY)
    if (token) {
        return token
    } else {
        return undefined
    }
}

export function removeToken () {
    Cookies.remove(TOKEN_KEY)
}
