import { defineComponent, ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Form, Input, Button, message, Modal } from 'ant-design-vue'
import { requestUserChangePasswd } from '@/api/user'
import { LOGIN_NAME } from '@/config'
import classNames from '@/common/classNamesBind'
import styles from './style/index.module.scss'
import { removeToken } from '@/common/auth'

const cx = classNames.bind(styles)

const FormItem = Form.Item
const InputPassword = Input.Password

const defaultFormItemConfig = {
    labelCol: {
        style: 'flex: 0 0 84px'
    },
    wrapperCol: {
        style: 'max-width: calc(100% - 84px)'
    }
}

export default defineComponent({
    setup () {
        const router = useRouter()

        const loading = ref(false)

        const formData = reactive({
            old_passwd: '',
            new_passwd: ''
        })

        const rules = {
            old_passwd: [{
                required: true,
                message: '请输入旧密码'
            }],
            new_passwd: [{
                required: true,
                message: '请输入新密码'
            }]
        }

        function onSubmit () {
            const data = {
                old_passwd: formData.old_passwd,
                new_passwd: formData.new_passwd
            }
            loading.value = true
            requestUserChangePasswd(data)
                .then(() => {
                    Modal.success({
                        title: 'Success',
                        content: '修改成功，请重新登录',
                        onOk: () => {
                            removeToken()
                            router.replace({ name: LOGIN_NAME })
                        }
                    })
                })
                .catch((err) => {
                    message.error({
                        content: err.message
                    })
                })
                .finally(() => {
                    loading.value = false
                })
        }

        return () => {
            return (
                <div class={ cx('security') }>
                    <div class={ cx('form-wrap') }>
                        <Form model={ formData } rules={ rules } onFinish={ onSubmit }>
                            <FormItem label="旧密码" name="old_passwd" { ...defaultFormItemConfig }>
                                <InputPassword
                                    placeholder="请输入旧密码"
                                    visibilityToggle={ false }
                                    v-model:value={ formData.old_passwd }
                                />
                            </FormItem>
                            <FormItem label="新密码" name="new_passwd" { ...defaultFormItemConfig }>
                                <InputPassword
                                    placeholder="请输入新密码"
                                    visibilityToggle={ true }
                                    v-model:value={ formData.new_passwd }
                                />
                            </FormItem>
                            <Button type="primary" html-type="submit" block={ true } loading={ loading.value }>
                                修改密码
                            </Button>
                        </Form>
                    </div>
                </div>
            )
        }
    }
})
