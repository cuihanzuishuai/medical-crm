import { defineComponent, ref, reactive } from 'vue'
import { Card, Table, Button, Input, DatePicker, Checkbox, message, Popconfirm } from 'ant-design-vue'
import TableSearch from '@/components/table-search'
import { requestReportList, requestReportRecover } from '@/api/report'
import { formatCurrency } from '@/util/format'
import classNames from '@/common/classNamesBind'
import styles from './style/index.module.scss'
import dayjs from 'dayjs'

const cx = classNames.bind(styles)

const RangePicker = DatePicker.RangePicker

const columns = [
    {
        title: '客户名称',
        dataIndex: 'consumer_name',
        key: 'consumer_name'
    },
    {
        title: '客户电话',
        dataIndex: 'consumer_mobile',
        key: 'consumer_mobile'
    },
    {
        title: '预期到达时间',
        dataIndex: 'except_arrive_time',
        key: 'except_arrive_time'
    },
    {
        title: '客户到达时间',
        dataIndex: 'actual_arrive_time',
        key: 'actual_arrive_time'
    },
    {
        title: '员工名称',
        dataIndex: 'user_name',
        key: 'user_name'
    },
    {
        title: '创建时间',
        dataIndex: 'create_time',
        key: 'create_time'
    },
    {
        title: '是否匹配',
        dataIndex: 'is_match',
        key: 'is_match'
    },
    {
        title: '消费金额',
        dataIndex: 'consumer_amount',
        key: 'consumer_amount'
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        width: '80px'
    }
]

export default defineComponent({
    setup () {
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
            consumer_mobile: '', // 客户电话
            creat_time: null, // 报单开始时间 // 报单结束时间
            user_id: '',  // 员工id
            user_name: '', // 员工姓名
            is_match: false // 是否匹配
        })

        getDataSource()

        function onNumberInput (key) {
            return function (evt) {
                formData[key] = evt.target.value.replace(/[^\d]/g, '')
            }
        }

        function formatTime (value) {
            return dayjs.unix(value).format('YYYY-MM-DD HH:mm:ss')
        }

        function getStartAndEndTime (times) {
            const [startTime, endTime] = times || []
            return {
                startTime: startTime ? startTime.startOf('day').unix() : 0,
                endTime: endTime ? endTime.endOf('day').unix() : 0
            }
        }

        function getDataSource () {
            const time = getStartAndEndTime(formData.creat_time)
            const data = {
                consumer_mobile: formData.consumer_mobile,
                create_start_time: time.startTime,// 报单开始时间
                creat_end_time: time.endTime, // 报单结束时间
                user_id: formData.user_id ? parseInt(formData.user_id) : 0,  // 员工id
                user_name: formData.user_name, // 员工姓名
                is_match: formData.is_match ? 1 : 0, // 是否匹配
                page: {
                    current_page: pagination.current,
                    page_size: pagination.pageSize
                }
            }
            loading.value = true
            requestReportList(data)
                .then((res) => {
                    dataSource.value = res.list
                    pagination.total = res.page.total
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
                        pagination.current = 1
                        pagination.total = 0
                        getDataSource()
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

        function onFinish (values) {
            pagination.current = 1
            pagination.total = 0
            getDataSource()
        }

        function onChange (page) {
            pagination.current = page.current
            getDataSource()
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
                                getPopupContainer={ () => document.getElementById('ContentView') }
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
                    label: '员工id',
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
                        return (
                            <Checkbox v-model:checked={ formData.is_match }/>
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
                    return (
                        <span>{ formatCurrency(record.consumer_amount / 100) }</span>
                    )
                },
                is_match: (record) => {
                    return (
                        <span>{ record.is_match ? '是' : '否' }</span>
                    )
                },
                action: (record) => {
                    return (
                        <Popconfirm
                            title="确定要撤销?"
                            onConfirm={ onDelete(record) }
                            getPopupContainer={ () => document.getElementById('ContentView') }
                        >
                            <a>撤销</a>
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
                                <Button type="primary">报单登记</Button>
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
                </div>
            )
        }
    }
})
