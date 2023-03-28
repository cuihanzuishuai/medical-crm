import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Space, Button } from 'ant-design-vue'
import classNames from '@/common/classNamesBind'
import styles from './style/index.module.scss'

const cx = classNames.bind(styles)

export default defineComponent({
    props: {
        src: {
            type: String,
            default: ''
        },
        code: {
            type: Number,
            default: 0
        },
        desc: {
            type: String,
            default: ''
        }
    },
    setup (props) {
        const router = useRouter()
        const second = ref(5)
        let timer = null

        function backHome () {
            router.replace({ name: homeName })
        }

        function backPrev () {
            router.go(-1)
        }

        onMounted(() => {
            timer = setInterval(() => {
                if (second.value === 0) {
                    backPrev()
                } else {
                    second.value--
                }
            }, 1000)
        })

        onBeforeUnmount(() => {
            clearInterval(timer)
        })

        return () => {
            return (
                <div class={ cx('error-page') }>
                    <div class={ cx('content-con') }>
                        <img class={ cx('error-img') } src={ props.src } alt={ props.code }/>
                        <div class={ cx('text-con') }>
                            <div class={cx('text-code')}>{ props.code }</div>
                            <div class={cx('text-desc')}>{ props.desc }</div>
                        </div>
                        <Space class={ cx('back-btn-group') } size={ 10 }>
                            <Button onClick={ backHome }>返回首页</Button>
                            <Button onClick={ backPrev }>返回上一页({ second.value }s)</Button>
                        </Space>
                    </div>
                </div>
            )
        }
    }
})
