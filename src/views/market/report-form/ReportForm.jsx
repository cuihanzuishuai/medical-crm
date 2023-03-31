import { defineComponent, ref, reactive } from 'vue'
import { Card, Table, Button, Input, DatePicker, Checkbox, message } from 'ant-design-vue'
import TableSearch from '@/components/table-search'
import { requestReportList } from '@/api/report'
import { formatCurrency } from '@/util/format'
import classNames from '@/common/classNamesBind'
import styles from './style/index.module.scss'
import dayjs from 'dayjs'

const cx = classNames.bind(styles)

const RangePicker = DatePicker.RangePicker

const columns = [
    {
        title: '员工名称',
        dataIndex: 'user_name',
        key: 'user_name'
    },
    {
        title: '预期到达时间',
        dataIndex: 'except_arrive_time',
        key: 'except_arrive_time'
    },
    {
        title: '客户电话',
        dataIndex: 'consumer_mobile',
        key: 'consumer_mobile'
    },
    {
        title: '客户名称',
        dataIndex: 'consumer_name',
        key: 'consumer_name'
    },
    {
        title: '是否匹配',
        dataIndex: 'is_match',
        key: 'is_match'
    },
    {
        title: '客户到达时间',
        dataIndex: 'actual_arrive_time',
        key: 'actual_arrive_time'
    },
    {
        title: '消费金额',
        dataIndex: 'consumer_amount',
        key: 'consumer_amount'
    },
    {
        title: '创建时间',
        dataIndex: 'create_time',
        key: 'create_time'
    }
]

export default defineComponent({
    setup () {
        const loading = ref(false)

        const dataSource = ref([])

        const formData = reactive({
            consumer_mobile: '', // 客户电话
            creat_time: null, // 报单开始时间 // 报单结束时间
            user_id: '',  // 员工id
            user_name: '', // 员工姓名
            is_match: false // 是否匹配
        })

        getDataSource(formData)

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

        function getDataSource (values) {
            const time = getStartAndEndTime(values.creat_time)
            const data = {
                consumer_mobile: values.consumer_mobile,
                create_start_time: time.startTime,// 报单开始时间
                creat_end_time: time.endTime, // 报单结束时间
                user_id: values.user_id ? parseInt(values.user_id) : 0,  // 员工id
                user_name: values.user_name, // 员工姓名
                is_match: values.is_match ? 1 : 0 // 是否匹配
            }
            loading.value = true
            requestReportList(data)
                .then((res) => {
                    dataSource.value = res.list
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

        function onFinish (values) {
            getDataSource(values)
        }

        return () => {
            const searchOptions = [
                {
                    label: '报单时间',
                    name: 'creat_time',
                    render () {
                        return <RangePicker v-model:value={ formData.creat_time }/>
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
                        return <Input placeholder="请输入" v-model:value={ formData.user_name }/>
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
                        return <Checkbox v-model:checked={ formData.is_match }/>
                    }
                }
            ]

            const customRender = {
                except_arrive_time: (record) => {
                    return <span>{ formatTime(record.except_arrive_time) }</span>
                },
                actual_arrive_time: (record) => {
                    return <span>{ formatTime(record.actual_arrive_time) }</span>
                },
                create_time: (record) => {
                    return <span>{ formatTime(record.create_time) }</span>
                },
                consumer_amount: (record) => {
                    return <span>{ formatCurrency(record.consumer_amount / 100) }</span>
                },
                is_match: (record) => {
                    return <span>{ record.is_match ? '是' : '否' }</span>
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
                            v-slots={ tableSlots }
                        />
                    </Card>
                </div>
            )
        }
    }
})
