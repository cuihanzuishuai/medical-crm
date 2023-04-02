import { defineComponent, ref, reactive } from 'vue'
import {
    Card,
    Table,
    Button,
    Input,
    DatePicker,
    message,
    Popconfirm,
    Modal,
    Form,
    Space,
    Select,
    Tooltip,
    Tag,
    Upload,
    Spin
} from 'ant-design-vue'
import { UploadOutlined, PlusOutlined } from '@ant-design/icons-vue'
import TableSearch from '@/components/table-search'
import { requestReportList, requestReportRecover, requestReportCreate, requestReportImport } from '@/api/report'
import { requestCustomerServerDistribute } from '@/api/customer'
import { requestUserList } from '@/api/user'
import { debounce } from 'lodash-es'
import { formatCurrency } from '@/util/format'
import dayjs from 'dayjs'
import hasAccess from '@/permission/hasAccess'
import * as Role from '@/permission'
import classNames from '@/common/classNamesBind'
import styles from './style/index.module.scss'

const cx = classNames.bind(styles)

const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker

const MatchEnum = {
    1: {
        value: 1,
        label: '是',
        color: 'blue'
    },
    2: {
        value: 2,
        label: '否',
        color: 'red'
    }
}

const RelationTaskEnum = {
    1: {
        value: 1,
        label: '是',
        color: 'blue'
    },
    2: {
        value: 2,
        label: '否',
        color: 'red'
    }
}

const columns = [
    {
        index: 1,
        title: '客户姓名',
        dataIndex: 'consumer_name',
        key: 'consumer_name'
    },
    {
        index: 2,
        title: '客户电话',
        dataIndex: 'consumer_mobile',
        key: 'consumer_mobile'
    },
    {
        index: 3,
        title: '预期到访时间',
        dataIndex: 'except_arrive_time',
        key: 'except_arrive_time'
    },
    {
        index: 4,
        title: '到访时间',
        dataIndex: 'actual_arrive_time',
        key: 'actual_arrive_time'
    },
    {
        index: 5,
        title: '是否匹配',
        dataIndex: 'is_match',
        key: 'is_match'
    },
    {
        index: 6,
        title: '员工名称',
        dataIndex: 'user_name',
        key: 'user_name'
    },
    {
        index: 7,
        title: '创建时间',
        dataIndex: 'create_time',
        key: 'create_time'
    },
    {
        index: 10,
        title: '消费金额',
        dataIndex: 'consumer_amount',
        key: 'consumer_amount'
    },
    {
        index: 11,
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        width: '80px'
    }
]

const permissionColumns = [
    {
        index: 8,
        title: '是否分配',
        dataIndex: 'relation_task',
        key: 'relation_task'
    },
    {
        index: 9,
        title: '客服名称',
        dataIndex: 'relation_task_username',
        key: 'relation_task_username'
    }
]

const ModalForm = defineComponent({
    emits: ['finish'],
    setup (props, { expose, emit }) {
        const formRef = ref(null)

        const visible = ref(false)
        const loading = ref(false)

        const formData = reactive({
            consumer_mobile: '',
            consumer_name: '',
            except_arrive_time: null
        })

        const rules = {
            consumer_mobile: [{
                required: true,
                message: '客户电话不能为空'
            }],
            consumer_name: [{
                required: true,
                message: '客户姓名不能为空'
            }],
            except_arrive_time: [{
                required: true,
                message: '预期到访时间不能为空'
            }]
        }

        function onCreateReport (values) {
            const data = {
                consumer_mobile: values.consumer_mobile,
                consumer_name: values.consumer_name,
                expect_arrive_time: values.except_arrive_time ? values.except_arrive_time.unix() : 0
            }
            loading.value = true
            requestReportCreate(data)
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
            onCreateReport(values)
        }

        function onNumberInput (key) {
            return function (evt) {
                formData[key] = evt.target.value.replace(/[^\d-]/g, '')
            }
        }

        function show () {
            formRef.value && formRef.value.resetFields()
            visible.value = true
        }

        expose({
            show
        })

        return () => {
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
                    title="报单登记"
                    v-model:visible={ visible.value }
                    confirmLoading={ loading.value }
                    onOk={ onFinish }
                    maskClosable={ false }
                >
                    <Form ref={ formRef } model={ formData } rules={ rules } validateTrigger={ ['blur'] }>
                        <FormItem label="客户姓名" name="consumer_name" { ...defaultFormItemConfig }>
                            <Input placeholder="请输入" v-model:value={ formData.consumer_name }/>
                        </FormItem>
                        <FormItem label="客户电话" name="consumer_mobile" { ...defaultFormItemConfig }>
                            <Input
                                placeholder="请输入"
                                v-model:value={ formData.consumer_mobile }
                                onChange={ onNumberInput('consumer_mobile') }
                            />
                        </FormItem>
                        <FormItem label="预期到访时间" name="except_arrive_time" { ...defaultFormItemConfig }>
                            <DatePicker showTime={ true } v-model:value={ formData.except_arrive_time }/>
                        </FormItem>
                    </Form>
                </Modal>
            )
        }
    }
})

const ModalSearch = defineComponent({
    emits: ['finish'],
    setup (props, { expose, emit }) {
        const formRef = ref(null)
        const visible = ref(false)
        const loading = ref(false)

        const searching = ref(false)
        const options = ref([])

        let reportIds = null

        const formData = reactive({
            user_id: undefined
        })

        const rules = {
            user_id: [{
                required: true,
                message: '员工不能为空'
            }]
        }

        const onSearch = debounce(function onSearch (value) {
            if (!value) return
            const data = {
                name: value,
                page: {
                    current_page: 1,
                    page_size: 10
                }
            }
            searching.value = true
            requestUserList(data)
                .then((res) => {
                    options.value = res.list.map((item) => {
                        return {
                            value: item.user_id,
                            label: `${ item.name }(${ item.mobile })`
                        }
                    })
                })
                .finally(() => {
                    searching.value = false
                })
        }, 300)

        function customerServerDistribute (values) {
            const data = {
                user_id: values.user_id,
                report_ids: [...reportIds]
            }
            loading.value = true
            requestCustomerServerDistribute(data)
                .then((res) => {
                    message.success({
                        content: '操作成功'
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
            customerServerDistribute(values)
        }

        function show (list) {
            reportIds = list
            visible.value = true
        }

        expose({
            show
        })

        return () => {
            const selectSlots = {
                notFoundContent: () => {
                    return <Spin size="small"/>
                }
            }

            return (
                <Modal
                    title="任务分配"
                    v-model:visible={ visible.value }
                    confirmLoading={ loading.value }
                    onOk={ onFinish }
                    maskClosable={ false }
                >
                    <Form ref={ formRef } model={ formData } rules={ rules } validateTrigger={ ['blur'] }>
                        <FormItem name="user_id">
                            <Select
                                placeholder="搜索员工姓名"
                                showArrow={ false }
                                showSearch={ true }
                                filterOption={ false }
                                v-model:value={ formData.user_id }
                                options={ options.value }
                                onSearch={ onSearch }
                                notFoundContent={ searching.value ? undefined : null }
                                v-slots={ searching.value ? selectSlots : undefined }
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
        const modalSearchRef = ref(null)
        const modalFormRef = ref(null)

        const loading = ref(false)
        const dataSource = ref([])
        const rowSelection = reactive({
            selectedRowKeys: [],
            getCheckboxProps: (record) => {
                return {
                    disabled: !!record.relation_task
                }
            },
            onChange: onSelectChange
        })
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
            consumer_mobile: '', // 客户电话
            creat_time: null, // 报单开始时间 // 报单结束时间
            user_id: '',  // 员工id
            user_name: '', // 员工姓名
            is_match: undefined // 是否匹配
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
                return dayjs(value).format('YYYY.MM.DD HH:mm')
            } else if (timeStr.length === 10) {
                return dayjs.unix(value).format('YYYY.MM.DD HH:mm')
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

        function onSelectChange (selectedRowKeys) {
            rowSelection.selectedRowKeys = selectedRowKeys
        }

        function getDataSource () {
            const time = getStartAndEndTime(formData.creat_time)
            const data = {
                consumer_mobile: formData.consumer_mobile,
                create_start_time: time.startTime,// 报单开始时间
                creat_end_time: time.endTime, // 报单结束时间
                user_id: formData.user_id ? parseInt(formData.user_id) : 0,  // 员工id
                user_name: formData.user_name, // 员工姓名
                is_match: formData.is_match || 0, // 是否匹配
                relation_task: hasAccess([Role.Admin, Role.RoleCustomManager]),
                page: {
                    current_page: pagination.current,
                    page_size: pagination.pageSize
                }
            }
            loading.value = true
            requestReportList(data)
                .then((res) => {
                    dataSource.value = res.list.map((item) => {
                        return {
                            ...item,
                            key: item.id
                        }
                    })
                    console.log(dataSource.value)
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

        function onDelete (record) {
            return function () {
                const data = {
                    id: record.id
                }
                loading.value = true
                requestReportRecover(data)
                    .then(() => {
                        message.success({
                            content: '撤销成功'
                        })
                        onFinish()
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
        }

        function onFinish () {
            pagination.current = 1
            pagination.total = 0
            rowSelection.selectedRowKeys = []
            getDataSource()
        }

        function onChange (page) {
            pagination.current = page.current
            rowSelection.selectedRowKeys = []
            getDataSource()
        }

        function onServerDistribute () {
            modalSearchRef.value && modalSearchRef.value.show(rowSelection.selectedRowKeys)
        }

        function handleCreateRequest () {
            modalFormRef.value && modalFormRef.value.show()
        }

        function onUploadReportChange (evt) {
            requestReportImport(evt.file)
                .then(() => {
                    message.success({
                        content: '上传成功'
                    })
                    onFinish()
                })
                .catch((err) => {
                    message.error({
                        content: err.message
                    })
                })
        }

        return () => {
            const searchOptions = [
                {
                    label: '报单时间',
                    name: 'creat_time',
                    render () {
                        return (
                            <RangePicker
                                v-model:value={ formData.creat_time }
                                getPopupContainer={ () => document.getElementById('viewContainer') }
                            />
                        )
                    }
                },
                {
                    label: '客户电话',
                    name: 'consumer_mobile',
                    render () {
                        return (
                            <Input
                                placeholder="请输入"
                                v-model:value={ formData.consumer_mobile }
                                onChange={ onNumberInput('consumer_mobile') }
                            />
                        )
                    }
                },
                {
                    label: '员工姓名',
                    name: 'user_name',
                    render () {
                        return (
                            <Input placeholder="请输入" v-model:value={ formData.user_name }/>
                        )
                    }
                },
                {
                    label: '员工ID',
                    name: 'user_id',
                    render () {
                        return (
                            <Input
                                placeholder="请输入"
                                v-model:value={ formData.user_id }
                                onChange={ onNumberInput('user_id') }
                            />
                        )
                    }
                },
                {
                    label: '是否匹配',
                    name: 'is_match',
                    render () {
                        const options = Object.keys(MatchEnum).map((key) => {
                            return MatchEnum[key]
                        })
                        return (
                            <Select
                                placeholder="请选择"
                                v-model:value={ formData.is_match }
                                options={ options }
                                getPopupContainer={ () => document.getElementById('viewContainer') }
                            />
                        )
                    }
                }
            ]

            const customRender = {
                except_arrive_time: (record) => {
                    return (
                        <span>{ formatTime(record.except_arrive_time) }</span>
                    )
                },
                actual_arrive_time: (record) => {
                    return (
                        <span>{ formatTime(record.actual_arrive_time) }</span>
                    )
                },
                create_time: (record) => {
                    return (
                        <span>{ formatTime(record.create_time) }</span>
                    )
                },
                consumer_amount: (record) => {
                    if (record.is_match) {
                        return (
                            <span>{ formatCurrency(record.consumer_amount / 100) }</span>
                        )
                    }
                    return <span>--</span>
                },
                is_match: (record) => {
                    const data = MatchEnum[record.is_match] || (record.is_match ? MatchEnum['1'] : MatchEnum['2'])
                    if (data) {
                        return (
                            <Tag color={ data.color }>{ data.label }</Tag>
                        )
                    }
                    return <span>--</span>
                },
                relation_task: (record) => {
                    const data = RelationTaskEnum[record.relation_task] || (record.relation_task ? RelationTaskEnum['1'] : RelationTaskEnum['2'])
                    if (data) {
                        return (
                            <Tag color={ data.color }>{ data.label }</Tag>
                        )
                    }
                    return <span>--</span>
                },
                action: (record) => {
                    return (
                        <Popconfirm
                            title="确定要撤销?"
                            placement="topRight"
                            onConfirm={ onDelete(record) }
                            getPopupContainer={ () => document.getElementById('viewContainer') }
                        >
                            <a class={ cx('action') }>撤销</a>
                        </Popconfirm>
                    )
                }
            }

            const tableSlots = {
                bodyCell: ({ column, record }) => {
                    const render = customRender[column.key]
                    return render ? render(record) : record[column.key]
                }
            }

            const hasPermission = hasAccess([Role.Admin, Role.RoleCustomManager])

            const tableColumns = hasPermission ? (
                [...columns, ...permissionColumns].sort((a, b) => a.index - b.index)
            ) : columns

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
                                <div class={ cx('table-list-toolbar-title') }>报单列表</div>
                                <Space size={ 12 }>
                                    <Button type="primary" onClick={ handleCreateRequest }>
                                        <PlusOutlined/>报单登记
                                    </Button>
                                    {
                                        hasPermission ? (
                                            <Button
                                                type="primary"
                                                disabled={ rowSelection.selectedRowKeys.length === 0 }
                                                onClick={ onServerDistribute }
                                            >
                                                任务分配
                                            </Button>
                                        ) : null
                                    }
                                    <Tooltip getPopupContainer={ () => document.getElementById('viewContainer') }>
                                        { {
                                            title: () => <span>上传报单</span>,
                                            default: () => (
                                                <Upload
                                                    onChange={ onUploadReportChange }
                                                    fileList={ [] }
                                                    beforeUpload={ () => false }
                                                >
                                                    <UploadOutlined class={ cx('upload') }/>
                                                </Upload>
                                            )
                                        } }
                                    </Tooltip>
                                </Space>
                            </div>
                        </div>
                        <Table
                            loading={ loading.value }
                            columns={ tableColumns }
                            dataSource={ dataSource.value }
                            pagination={ pagination }
                            rowSelection={ hasPermission ? rowSelection : false }
                            onChange={ onChange }
                            v-slots={ tableSlots }
                        />
                    </Card>
                    <ModalSearch ref={ modalSearchRef } onFinish={ onFinish }/>
                    <ModalForm ref={ modalFormRef } onFinish={ onFinish }/>
                </div>
            )
        }
    }
})
