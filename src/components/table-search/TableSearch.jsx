import { defineComponent, ref, computed } from 'vue'
import { Form, Row, Col, Input, Space, Button } from 'ant-design-vue'
import useMediaQuery from '@/use/useMediaQuery'
import classNames from '@/common/classNamesBind'
import styles from './style/index.module.scss'

const FormItem = Form.Item

const cx = classNames.bind(styles)

const defaultColConfig = {
    xs: 24,
    sm: 24,
    md: 12,
    lg: 12,
    xl: 8,
    xxl: 6
}

function getOffset (length, span) {
    const cols = 24 / span
    return (cols - 1 - (length % cols)) * span
}

const defaultFormItemConfig = {
    labelCol: {
        style: 'flex: 0 0 120px'
    },
    wrapperCol: {
        style: 'max-width: calc(100% - 120px)'
    }
}

export default defineComponent({
    props: {
        model: {
            type: Object,
            default: () => ({})
        },
        rules: {
            type: Object,
            default: () => ({})
        },
        options: {
            type: Array,
            default: () => ([])
        },
        loading: {
            type: Boolean,
            default: false
        }
    },
    emits: ['finish', 'reset'],
    setup (props, { emit }) {
        const formRef = ref(null)

        const windowSize = useMediaQuery()
        const colSize = computed(() => {
            return defaultColConfig[windowSize.value]
        })

        function onFinish (values) {
            emit('finish', values)
        }

        function onReset () {
            formRef.value && formRef.value.resetFields()
            emit('reset')
        }

        return () => {
            const offset = getOffset(props.options.length, colSize.value)

            const formItemProps = {
                colon: false,
                labelAlign: 'right',
                ...defaultFormItemConfig
            }

            return (
                <div class={ cx('table-search') }>
                    <Form ref={ formRef } model={ props.model } rules={ props.rules } onFinish={ onFinish }>
                        <Row gutter={ 16 } justify="start">
                            {
                                props.options.map((item) => {
                                    return (
                                        <Col { ...defaultColConfig } key={ item.name }>
                                            <FormItem label={ item.label } name={ item.name } { ...formItemProps }>
                                                { item.render() }
                                            </FormItem>
                                        </Col>
                                    )
                                })
                            }
                            <Col { ...defaultColConfig } offset={ offset } key="option" class={ cx('option-col') }>
                                <FormItem>
                                    <Space>
                                        <Button onClick={ onReset }>重置</Button>
                                        <Button type="primary" htmlType="submit" loading={ props.loading }>查询</Button>
                                    </Space>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </div>
            )
        }
    }
})
