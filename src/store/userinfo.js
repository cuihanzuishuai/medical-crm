import { defineStore } from 'pinia'

const useUserinfo = defineStore('userinfo', {
    state: () => {
        return {
            // 有无用户数据
            hasGetInfo: false,
            // 用户权限信息
            access: []
        }
    },
    actions: {
        getUserInfo () {
            return new Promise((resolve, reject) => {
                console.log(this)
                resolve()
            })
        }
    }
})

export default useUserinfo
