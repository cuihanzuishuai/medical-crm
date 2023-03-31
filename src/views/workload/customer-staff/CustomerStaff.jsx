import { defineComponent, reactive, ref } from 'vue'
import {
    Card,
    Input,
    message,
    Table
} from 'ant-design-vue'
import TableSearch from '@/components/table-search'
import { requestStatisticsCustomer } from '@/api/statistics'
import classNames from '@/common/classNamesBind'
import styles from './style/index.module.scss'

const cx = classNames.bind(styles)

const columns = [
    {
        title: '员工姓名',
        dataIndex: 'user_name',
        key: 'user_name'
    },
    {
        title: '员工手机号',
        dataIndex: 'user_mobile',
        key: 'user_mobile'
    },
    {
        title: '总任务数',
        dataIndex: 'total_num',
        key: 'total_num'
    },
    {
        title: '完成任务数',
        dataIndex: 'finish_num',
        key: 'finish_num'
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
            mobile: '', // 员工手机号
            name: '' // 员工姓名
        })

        getDataSource()

        function onNumberInput (key) {
            return function (evt) {
                formData[key] = evt.target.value.replace(/[^\d]/g, '')
            }
        }

        function getDataSource () {
            const data = {
                mobile: formData.mobile,
                name: formData.name,
                page: {
                    current_page: pagination.current,
                    page_size: pagination.pageSize
                }
            }
            loading.value = true
            requestStatisticsCustomer(data)
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

        function onFinish () {
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
                    label: '员工姓名',
                    name: 'name',
                    render () {
                        return (
                            <Input placeholder="请输入" v-model:value={ formData.name }/>
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
                }
            ]

            return (
                <div class={ cx('view-wrap') }>
                    <TableSearch
                        loading={ loading.value }
                        options={ searchOptions }
                        model={ formData }
                        onFinish={ onFinish }
                    />
                    <Card bodyStyle={ { paddingTop: '0' } }>
                        <div className={ cx('table-list-toolbar') }>
                            <div className={ cx('table-list-toolbar-container') }>
                                <div className={ cx('table-list-toolbar-title') }>工作量列表</div>
                            </div>
                        </div>
                        <Table
                            loading={ loading.value }
                            columns={ columns }
                            dataSource={ dataSource.value }
                            pagination={ pagination }
                            onChange={ onChange }
                        />
                    </Card>
                </div>
            )
        }
    }
})
