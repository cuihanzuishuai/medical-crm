import { defineComponent, ref, reactive } from 'vue'
import {
    Card,
    Table,
    Button,
    Input,
    message,
    Popconfirm,
    Modal,
    Form,
    Space,
    Select,
    Tag
} from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import TableSearch from '@/components/table-search'
import { requestUserList, requestUserCreate, requestUserChangeStatus } from '@/api/user'
import { RolesName } from '@/permission'
import classNames from '@/common/classNamesBind'
import styles from './style/index.module.scss'

const cx = classNames.bind(styles)

const FormItem = Form.Item

const StatusEnum = {
    1: {
        value: 1,
        label: '正常',
        color: 'blue'
    },
    2: {
        value: 2,
        label: '离职',
        color: 'red'
    }
}

const columns = [
    {
        title: '员工ID',
        dataIndex: 'user_id',
        key: 'user_id'
    },
    {
        title: '员工姓名',
        dataIndex: 'name',
        key: 'name'
    },
    {
        title: '员工电话',
        dataIndex: 'mobile',
        key: 'mobile'
    },
    {
        title: '角色权限',
        dataIndex: 'role',
        key: 'role'
    },
    {
        title: '在职状态',
        dataIndex: 'status',
        key: 'status'
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        width: '100px'
    }
]

const ModalForm = defineComponent({
    emits: ['finish'],
    setup (props, { expose, emit }) {
        const formRef = ref(null)

        const visible = ref(false)
        const loading = ref(false)

        const options = Object.keys(RolesName).map((key) => {
            return {
                value: key,
                label: RolesName[key]
            }
        })

        const formData = reactive({
            name: '',
            mobile: '',
            role: undefined
        })

        const rules = {
            name: [{
                required: true,
                message: '员工姓名不能为空'
            }],
            mobile: [{
                required: true,
                message: '员工电话不能为空'
            }],
            role: [{
                required: true,
                message: '角色权限不能为空'
            }]
        }

        function onCreateUser (values) {
            const data = {
                name: values.name,
                mobile: values.mobile,
                role: values.role
            }
            loading.value = true
            requestUserCreate(data)
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
            onCreateUser(values)
        }

        function onNumberInput (key) {
            return function (evt) {
                formData[key] = evt.target.value.replace(/[^\d--]/g, '')
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
                    title="添加员工"
                    v-model:visible={ visible.value }
                    confirmLoading={ loading.value }
                    onOk={ onFinish }
                    maskClosable={ false }
                >
                    <Form ref={ formRef } model={ formData } rules={ rules } validateTrigger={ ['blur'] }>
                        <FormItem label="员工姓名" name="name" { ...defaultFormItemConfig }>
                            <Input placeholder="请输入" v-model:value={ formData.name }/>
                        </FormItem>
                        <FormItem label="员工电话" name="mobile" { ...defaultFormItemConfig }>
                            <Input
                                placeholder="请输入"
                                v-model:value={ formData.mobile }
                                onChange={ onNumberInput('mobile') }
                            />
                        </FormItem>
                        <FormItem label="角色权限" name="role" { ...defaultFormItemConfig }>
                            <Select
                                placeholder="请选择"
                                v-model:value={ formData.role }
                                options={ options }
                                allowClear={ true }
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
        const loading = ref(false)
        const options = Object.keys(RolesName).map((key) => {
            return {
                value: key,
                label: RolesName[key]
            }
        })

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
            name: '', // 用户姓名
            mobile: '',  // 员工手机号
            role: undefined // 角色权限
        })

        getDataSource()

        function onNumberInput (key) {
            return function (evt) {
                formData[key] = evt.target.value.replace(/[^\d-]/g, '')
            }
        }

        function getDataSource () {
            const data = {
                name: formData.name,
                mobile: formData.mobile,
                role: formData.role,
                page: {
                    current_page: pagination.current,
                    page_size: pagination.pageSize
                }
            }
            loading.value = true
            requestUserList(data)
                .then((res) => {
                    dataSource.value = res.list
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

        function onUserChangeStatus (record) {
            return function () {
                const data = {
                    user_id: record.user_id
                }
                loading.value = true
                requestUserChangeStatus(data)
                    .then(() => {
                        message.success({
                            content: '操作成功'
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
            getDataSource()
        }

        function onChange (page) {
            pagination.current = page.current
            getDataSource()
        }

        function handleCreateUser () {
            modalFormRef.value && modalFormRef.value.show()
        }

        return () => {
            const searchOptions = [
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
                    label: '员工电话',
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
                    label: '角色权限',
                    name: 'role',
                    render () {
                        return (
                            <Select
                                placeholder="请选择"
                                v-model:value={ formData.role }
                                options={ options }
                                allowClear={ true }
                                getPopupContainer={ () => document.getElementById('viewContainer') }
                            />
                        )
                    }
                }
            ]

            const customRender = {
                role: (record) => {
                    return (
                        <span>{ RolesName[record.role] || '--' }</span>
                    )
                },
                status: (record) => {
                    const data = StatusEnum[record.status]
                    if (data) {
                        return (
                            <Tag color={ data.color }>{ data.label }</Tag>
                        )
                    }
                    return (
                        <span>--</span>
                    )
                },
                action: (record) => {
                    if (parseInt(record.status) === 1) {
                        return (
                            <Popconfirm
                                title="确定员工离职?"
                                placement="topRight"
                                onConfirm={ onUserChangeStatus(record) }
                                getPopupContainer={ () => document.getElementById('viewContainer') }
                            >
                                <a class={ cx('action') }>确认离职</a>
                            </Popconfirm>
                        )
                    }
                    return <span>--</span>
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
                                <div class={ cx('table-list-toolbar-title') }>员工列表</div>
                                <Space size={ 12 }>
                                    <Button type="primary" onClick={ handleCreateUser }>
                                        <PlusOutlined/>添加员工
                                    </Button>
                                </Space>
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
                </div>
            )
        }
    }
})
