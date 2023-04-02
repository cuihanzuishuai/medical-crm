import { defineComponent, ref } from 'vue'
import { Drawer, Table } from 'ant-design-vue'
import dayjs from 'dayjs'

const columns = [
    {
        title: '客服ID',
        dataIndex: 'user_id',
        key: 'user_id'
    },
    {
        title: '客服名称',
        dataIndex: 'name',
        key: 'name'
    },
    {
        title: '时间',
        dataIndex: 'time',
        key: 'time'
    },
    {
        title: '备注',
        dataIndex: 'desc',
        key: 'desc'
    }
]

export default defineComponent({
    setup (props, { expose }) {
        const visible = ref(false)

        const dataSource = ref([])

        function formatTime (value) {
            const timeStr = String(value)
            if ((timeStr.length === 13)) {
                return dayjs(value).format('YYYY.MM.DD HH:mm')
            } else if (timeStr.length === 10) {
                return dayjs.unix(value).format('YYYY.MM.DD HH:mm')
            }
            return '--'
        }

        function show (list) {
            dataSource.value = list || []
            visible.value = true
        }

        expose({
            show
        })

        return () => {
            const customRender = {
                time: (record) => {
                    return (
                        <span>{ formatTime(record.time) }</span>
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
                <Drawer
                    title="回访历史"
                    v-model:visible={ visible.value }
                    placement="right"
                    size="large"
                >
                    <Table
                        columns={ columns }
                        dataSource={ dataSource.value }
                        pagination={ false }
                        v-slots={ tableSlots }
                    />
                </Drawer>
            )
        }
    }
})
