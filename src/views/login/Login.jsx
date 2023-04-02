import { defineComponent, reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Form, Input, Checkbox, Button } from 'ant-design-vue'
import Icon from '@/components/icon'
import { HOME_NAME, recallExpires } from '@/config'
import { setToken, getCookie, setCookie, removeCookie, PASSWORD, USERNAME } from '@/common/auth'
import { requestLogin } from '@/api/user'
import { AesDecode, AesEncode } from '@/common/ase'
import classNames from '@/common/classNamesBind'
import styles from './style/index.module.scss'

const cx = classNames.bind(styles)

const FormItem = Form.Item
const InputPassword = Input.Password

const wrapperCol = {
    span: 24
}

export default defineComponent({
    setup () {
        const router = useRouter()

        const checked = ref(false)
        const loading = ref(false)

        const loginForm = reactive({
            username: '',
            password: ''
        })

        const errorType = ref(undefined)

        const rules = {
            username: [{
                required: true,
                message: '账号不能为空'
            }],
            password: [{
                required: true,
                message: '密码不能为空'
            }]
        }

        onMounted(() => {
            const username = getCookie(USERNAME)
            const password = getCookie(PASSWORD)
            if (username && password) {
                loginForm.username = AesDecode(username)
                loginForm.password = AesDecode(password)
                checked.value = true
            }
        })

        function onRecall (checked) {
            if (checked) {
                const username = getCookie(USERNAME)
                const password = getCookie(PASSWORD)
                const nextUsername = AesEncode(loginForm.username)
                const nextPassword = AesEncode(loginForm.password)
                if (username !== nextUsername && password !== nextPassword) {
                    setCookie(USERNAME, nextUsername, recallExpires)
                    setCookie(PASSWORD, nextPassword, recallExpires)
                }
            } else {
                removeCookie(USERNAME)
                removeCookie(PASSWORD)
            }
        }

        function onSubmit () {
            errorType.value = undefined
            const data = {
                mobile: loginForm.username,
                password: loginForm.password
            }
            loading.value = true
            requestLogin(data)
                .then((res) => {
                    if (res.token) {
                        onRecall(checked.value)
                        setToken(res.token)
                        router.push({ name: HOME_NAME })
                    } else {
                        errorType.value = '系统异常'
                    }
                })
                .catch((err) => {
                    errorType.value = err.message
                })
                .finally(() => {
                    loading.value = false
                })
        }

        return () => {
            const usernameSlots = {
                addonBefore: () => <Icon type="icon-yonghu"/>
            }
            const passwordSlots = {
                addonBefore: () => <Icon type="icon-mima"/>
            }

            return (
                <div class={ cx('login') }>
                    <div class={ cx('login-wrap') }>
                        <div class={ cx('title') }>
                            <div class={ cx('title__text') }>欢迎登陆</div>
                        </div>
                        <div class={ cx('form-wrap') }>
                            <Form model={ loginForm } rules={ rules } onFinish={ onSubmit }>
                                <FormItem name="username" wrapperCol={ wrapperCol }>
                                    <Input
                                        placeholder="请输入手机号"
                                        v-model:value={ loginForm.username }
                                        v-slots={ usernameSlots }
                                    />
                                </FormItem>
                                <FormItem name="password" wrapperCol={ wrapperCol }>
                                    <InputPassword
                                        placeholder="请输入密码"
                                        v-model:value={ loginForm.password }
                                        v-slots={ passwordSlots }
                                    />
                                </FormItem>
                                <div class={ cx('checked-wrap') }>
                                    <Checkbox v-model:checked={ checked.value }>记住账号</Checkbox>
                                    {/*<a href="http://www.baidu.com" target="_blank">忘记密码</a>*/ }
                                </div>
                                <FormItem wrapperCol={ wrapperCol } validateStatus="error" help={ errorType.value }>
                                    <Button type="primary" html-type="submit" block={ true } loading={ loading.value }>
                                        登录
                                    </Button>
                                </FormItem>
                            </Form>
                        </div>
                    </div>
                    {/*<div class={ cx('footer-wrap') }>*/ }
                    {/*    <div class={ cx('footer-wrap__text') }>*/ }
                    {/*        copyright@2019&nbsp;XX科技&nbsp;All&nbsp;Rights&nbsp;Reserved*/ }
                    {/*    </div>*/ }
                    {/*</div>*/ }
                </div>
            )
        }
    }
})
