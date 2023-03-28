import { defineComponent, reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Form, Input, Checkbox, Button } from 'ant-design-vue'
import Icon from '@/components/icon'
import { localCache, LOCAL_USERNAME, LOCAL_PASSWORD } from '@/common/storage'
import { setToken } from '@/common/auth'
import classNames from '@/common/classNamesBind'
import styles from './style/index.module.scss'

const cx = classNames.bind(styles)

const FormItem = Form.Item
const InputPassword = Input.Password

const WRAPPER_COL = {
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
            const username = localCache.get(LOCAL_USERNAME)
            const password = localCache.get(LOCAL_PASSWORD)
            if (username && password) {
                loginForm.username = username
                loginForm.password = password
                checked.value = true
            }
        })

        function onRecall () {
            localCache.set(LOCAL_USERNAME, loginForm.username)
            localCache.set(LOCAL_PASSWORD, loginForm.password)
        }

        function onSubmit () {
            const data = {
                username: loginForm.username,
                password: loginForm.password
            }
            console.log('登录')
            console.log(data)
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
                                <FormItem name="username" wrapperCol={ WRAPPER_COL }>
                                    <Input
                                        placeholder="请输入用户名"
                                        v-model:value={ loginForm.username }
                                        v-slots={ usernameSlots }
                                    />
                                </FormItem>
                                <FormItem name="password" wrapperCol={ WRAPPER_COL }>
                                    <InputPassword
                                        placeholder="请输入密码"
                                        v-model:value={ loginForm.password }
                                        v-slots={ passwordSlots }
                                    />
                                </FormItem>
                                <div class={ cx('checked-wrap') }>
                                    <Checkbox v-model:checked={ checked.value }>记住账号</Checkbox>
                                    <a href="http://www.baidu.com" target="_blank">忘记密码</a>
                                </div>
                                <FormItem wrapperCol={ WRAPPER_COL } validateStatus="error" help={ errorType.value }>
                                    <Button type="primary" html-type="submit" block={ true }>登录</Button>
                                </FormItem>
                            </Form>
                        </div>
                    </div>
                    <div class={ cx('footer-wrap') }>
                        <div
                            class={ cx('footer-wrap__text') }>copyright@2019&nbsp;XX科技&nbsp;All&nbsp;Rights&nbsp;Reserved
                        </div>
                    </div>
                </div>
            )
        }
    }
})
