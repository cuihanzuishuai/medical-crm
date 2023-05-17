import { defineComponent, ref, reactive } from 'vue'
import {
    Card,
    Table,
    Input,
    DatePicker,
    message,
    Modal,
    Form,
    Select,
    Tag,
    Space,
    Divider
} from 'ant-design-vue'
import TableSearch from '@/components/table-search'
import TableDrawer from './TableDrawer'
import { requestCustomerServerList, requestCustomerServerResult } from '@/api/customer'
import { formatCurrency } from '@/util/format'
import dayjs from 'dayjs'
import classNames from '@/common/classNamesBind'
import styles from './style/index.module.scss'

const cx = classNames.bind(styles)

const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker
const TextArea = Input.TextArea

const FinishedEnum = {
    1: {
        value: 1,
        label: '已完成',
        color: 'blue'
    },
    2: {
        value: 2,
        label: '未完成',
        color: 'red'
    }
}

const columns = [
    {
        title: '顾客姓名',
        dataIndex: 'customer_name',
        key: 'customer_name'
    },
    {
        title: '顾客电话',
        dataIndex: 'customer_mobile',
        key: 'customer_mobile'
    },
    {
        title: '客服名称',
        dataIndex: 'name',
        key: 'name'
    },
    {
        title: '分配任务时间',
        dataIndex: 'distribute_time',
        key: 'distribute_time'
    },
    {
        title: '是否完成',
        dataIndex: 'is_finished',
        key: 'is_finished'
    },
    {
        title: '完成时间',
        dataIndex: 'finish_time',
        key: 'finish_time'
    },
    {
        title: '消费金额',
        dataIndex: 'customer_amount',
        key: 'customer_amount'
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        width: '160px'
    }
]

const ModalForm = defineComponent({
    emits: ['finish'],
    setup (props, { expose, emit }) {
        const formRef = ref(null)

        const visible = ref(false)
        const loading = ref(false)

        let recordData = null

        const formData = reactive({
            is_finished: undefined,
            desc: ''
        })

        const rules = {
            desc: [{
                required: true,
                message: '备注不能为空'
            }],
            is_finished: [{
                required: true,
                message: '是否完成不能为空'
            }]
        }

        function onCustomerServerResult (values) {
            const data = {
                task_id: recordData.task_id,
                desc: values.desc,
                is_finished: values.is_finished
            }
            loading.value = true
            requestCustomerServerResult(data)
                .then((res) => {
                    message.success({
                        content: '添加成功'
                    })
                    emit('finish')
                    visible.value = false
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

        async function onFinish () {
            const values = await formRef.value.validateFields()
            onCustomerServerResult(values)
        }

        function show (record) {
            recordData = record
            formRef.value && formRef.value.resetFields()
            visible.value = true
        }

        expose({
            show
        })

        return () => {
            const options = Object.keys(FinishedEnum).map((key) => {
                return FinishedEnum[key]
            })

            const defaultFormItemConfig = {
                labelCol: {
                    style: 'flex: 0 0 120px'
                },
                wrapperCol: {
                    style: 'max-width: calc(100% - 120px)'
                }
            }
            return (
                <Modal
                    title="回访登记"
                    v-model:visible={ visible.value }
                    confirmLoading={ loading.value }
                    onOk={ onFinish }
                    maskClosable={ false }
                >
                    <Form ref={ formRef } model={ formData } rules={ rules } validateTrigger={ ['blur'] }>
                        <FormItem label="是否完成" name="is_finished" { ...defaultFormItemConfig }>
                            <Select
                                placeholder="请选择"
                                v-model:value={ formData.is_finished }
                                options={ options }
                            />
                        </FormItem>
                        <FormItem label="备注" name="desc" { ...defaultFormItemConfig }>
                            <TextArea
                                placeholder="请输入"
                                v-model:value={ formData.desc }
                                autosize={ { minRows: 4, maxRows: 4 } }
                            />
                        </FormItem>
                    </Form>
                </Modal>
            )
        }
    }
})

export default defineComponent({
    setup () {
        const modalFormRef = ref(null)
        const tableDrawerRef = ref(null)

        const loading = ref(false)
        const dataSource = ref([])
        const pagination = reactive({
            showQuickJumper: false,
            showSizeChanger: false,
            current: 1,
            pageSize: 20,
            total: 0,
            showTotal: (total, range) => {
                return `共${ total }条`
            }
        })
        const formData = reactive({
            name: '', // 员工姓名
            mobile: '', // 员工手机号
            customer_mobile: '',  // 客户手机号
            is_finished: undefined, // 是否完成 0无 1 完成  2 未完成
            distribute_time: null, // 分配时间
            finish_time: null// 完成时间
        })

        getDataSource()

        function onNumberInput (key) {
            return function (evt) {
                formData[key] = evt.target.value.replace(/[^\d-]/g, '')
            }
        }

        function formatTime (value) {
            const timeStr = String(value)
            if ((timeStr.length === 13)) {
                return dayjs(value).format('YYYY/MM/DD')
            } else if (timeStr.length === 10) {
                return dayjs.unix(value).format('YYYY/MM/DD')
            }
            return '--'
        }

        function getStartAndEndTime (times) {
            const [startTime, endTime] = times || []
            return {
                startTime: startTime ? startTime.startOf('day').unix() : 0,
                endTime: endTime ? endTime.endOf('day').unix() : 0
            }
        }

        function getDataSource () {
            const distributeTime = getStartAndEndTime(formData.distribute_time)
            const finishTime = getStartAndEndTime(formData.finish_time)
            const data = {
                name: formData.name,
                mobile: formData.mobile,
                customer_mobile: formData.customer_mobile,
                is_finished: formData.is_finished || 0,
                distribute_start_time: distributeTime.startTime,
                distribute_end_time: distributeTime.endTime,
                finish_start_time: finishTime.startTime,
                finish_end_time: finishTime.endTime,
                page: {
                    current_page: pagination.current,
                    page_size: pagination.pageSize
                }
            }
            loading.value = true
            requestCustomerServerList(data)
                .then((res) => {
                    dataSource.value = res.list.map((item) => {
                        return {
                            ...item,
                            key: item.task_id
                        }
                    })
                    if (pagination.current === 1) {
                        pagination.total = res.page.total
                    }
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

        function onFinish () {
            pagination.current = 1
            pagination.total = 0
            getDataSource()
        }

        function onChange (page) {
            pagination.current = page.current
            getDataSource()
        }

        function onServerResult (record) {
            return function () {
                modalFormRef.value && modalFormRef.value.show(record)
            }
        }

        function onServerHistory (record) {
            return function () {
                tableDrawerRef.value && tableDrawerRef.value.show(record.history || [])
            }
        }

        return () => {
            const searchOptions = [
                {
                    label: '客户手机号',
                    name: 'customer_mobile',
                    render () {
                        return (
                            <Input
                                placeholder="请输入"
                                v-model:value={ formData.customer_mobile }
                                onChange={ onNumberInput('customer_mobile') }
                            />
                        )
                    }
                },
                {
                    label: '员工姓名',
                    name: 'name',
                    render () {
                        return (
                            <Input
                                placeholder="请输入"
                                v-model:value={ formData.name }
                            />
                        )
                    }
                },
                {
                    label: '员工手机号',
                    name: 'mobile',
                    render () {
                        return (
                            <Input
                                placeholder="请输入"
                                v-model:value={ formData.mobile }
                                onChange={ onNumberInput('mobile') }
                            />
                        )
                    }
                },
                {
                    label: '是否完成',
                    name: 'is_finished',
                    render () {
                        const options = Object.keys(FinishedEnum).map((key) => {
                            return FinishedEnum[key]
                        })
                        return (
                            <Select
                                placeholder="请选择"
                                v-model:value={ formData.is_finished }
                                options={ options }
                                getPopupContainer={ () => document.getElementById('viewContainer') }
                            />
                        )
                    }
                },
                {
                    label: '分配时间',
                    name: 'distribute_time',
                    render () {
                        return (
                            <RangePicker
                                v-model:value={ formData.distribute_time }
                                getPopupContainer={ () => document.getElementById('viewContainer') }
                            />
                        )
                    }
                },
                {
                    label: '完成时间',
                    name: 'finish_time',
                    render () {
                        return (
                            <RangePicker
                                v-model:value={ formData.finish_time }
                                getPopupContainer={ () => document.getElementById('viewContainer') }
                            />
                        )
                    }
                }
            ]

            const customRender = {
                distribute_time: (record) => {
                    return (
                        <span>{ formatTime(record.distribute_time) }</span>
                    )
                },
                is_finished: (record) => {
                    const data = FinishedEnum[record.is_finished]
                    if (data) {
                        return (
                            <Tag color={ data.color }>{ data.label }</Tag>
                        )
                    }
                    return <span>--</span>
                },
                finish_time: (record) => {
                    return (
                        <span>{ formatTime(record.finish_time) }</span>
                    )
                },
                customer_amount: (record) => {
                    return (
                        <span>{ formatCurrency(record.customer_amount / 100) }</span>
                    )
                },
                action: (record) => {
                    return (
                        <Space size={ 0 }>
                            <a class={ cx('action') } onClick={ onServerResult(record) }>回访</a>
                            <Divider type="vertical"/>
                            <a class={ cx('action') } onClick={ onServerHistory(record) }>回访历史</a>
                        </Space>
                    )
                }
            }

            const tableSlots = {
                bodyCell: ({ column, record }) => {
                    const render = customRender[column.key]
                    return render ? render(record) : record[column.key]
                }
            }

            return (
                <div class={ cx('view-wrap') }>
                    <TableSearch
                        loading={ loading.value }
                        options={ searchOptions }
                        model={ formData }
                        onFinish={ onFinish }
                    />
                    <Card bodyStyle={ { paddingTop: '0' } }>
                        <div class={ cx('table-list-toolbar') }>
                            <div class={ cx('table-list-toolbar-container') }>
                                <div class={ cx('table-list-toolbar-title') }>任务列表</div>
                            </div>
                        </div>
                        <Table
                            loading={ loading.value }
                            columns={ columns }
                            dataSource={ dataSource.value }
                            pagination={ pagination }
                            onChange={ onChange }
                            v-slots={ tableSlots }
                        />
                    </Card>
                    <ModalForm ref={ modalFormRef } onFinish={ onFinish }/>
                    <TableDrawer ref={ tableDrawerRef }/>
                </div>
            )
        }
    }
})
