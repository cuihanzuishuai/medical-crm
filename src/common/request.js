import axios from 'axios'
import { baseURL } from '@/config'
import { getToken } from '@/common/auth'

function addErrorLog (err) {
    if (err) {
        const errorLog = {
            type: 'axios',
            code: err.status,
            mes: err.statusText,
            url: err.request.responseURL
        }
        console.log(errorLog)
    }
}

const instance = axios.create({
    baseURL: baseURL(),
    timeout: 5000 * 2,
    headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json'
    },
    validateStatus (status) {
        return status >= 200 && status < 300
    }
})

instance.interceptors.request.use(
    (config) => {
        const token = getToken()
        if (token) {
            config.headers['token'] = `${ token }`
        }
        return config
    },
    (err) => {
        return Promise.reject(err)
    }
)
instance.interceptors.response.use(
    (res) => {
        return res
    },
    (err) => {
        const data = err.response && err.response.data
        if (data && data.message) {
            err.message = data.message
        }
        // addErrorLog(err.response)
        return Promise.reject(err)
    }
)

export default instance
