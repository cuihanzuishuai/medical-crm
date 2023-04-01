import LayoutMain from '@/layout'

/**
 * meta: {
 *  title: 导航栏title
 *  icon: 导航栏icon
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  access: (null) 可访问该页面的权限数组 当前路由设置的权限会影响子路由
 * }
 */

const routes = [
    {
        path: '/login',
        name: 'login',
        meta: {
            hideInMenu: true
        },
        component: () => import('@/views/login')
    },
    {
        path: '/',
        name: '_home',
        component: LayoutMain,
        redirect: { name: 'report-form' },
        meta: {
            hideInMenu: true,
        },
        children: [
            {
                path: 'home',
                name: 'home',
                meta: {
                    title: '首页',
                    icon: 'icon-shouye',
                    hideInMenu: true,
                },
                component: () => import('@/views/Home')
            }
        ]
    },
    {
        path: '/market',
        name: 'market',
        meta: {
            title: '市场模块',
            icon: 'icon-shichang'
        },
        component: LayoutMain,
        children: [
            {
                path: 'report-form',
                name: 'report-form',
                meta: {
                    title: '报单登记'
                },
                component: () => import('@/views/market/report-form')
            },
            {
                path: 'patient-info',
                name: 'patient-info',
                meta: {
                    title: '患者信息'
                },
                component: () => import('@/views/market/patient-info')
            }
        ]
    },
    {
        path: '/customer',
        name: 'customer',
        meta: {
            title: '客服',
            icon: 'icon-kefu'
        },
        component: LayoutMain,
        children: [
            {
                path: 'patient-revisit',
                name: 'patient-revisit',
                meta: {
                    title: '待复诊患者'
                },
                component: () => import('@/views/customer/patient-revisit')
            },
            {
                path: 'allocation-task',
                name: 'allocation-task',
                meta: {
                    title: '任务分配'
                },
                component: () => import('@/views/customer/allocation-task')
            },
            {
                path: 'visit-record',
                name: 'visit-record',
                meta: {
                    title: '回访记录'
                },
                component: () => import('@/views/customer/visit-record')
            }
        ]
    },
    {
        path: '/workload',
        name: 'workload',
        meta: {
            title: '工作量',
            icon: 'icon-gongzuoliang'
        },
        component: LayoutMain,
        children: [
            {
                path: 'market-staff',
                name: 'market-staff',
                meta: {
                    title: '市场部工作量'
                },
                component: () => import('@/views/workload/market-staff')
            },
            {
                path: 'customer-staff',
                name: 'customer-staff',
                meta: {
                    title: '客服部工作量'
                },
                component: () => import('@/views/workload/customer-staff')
            }
        ]
    },
    {
        path: '/finance',
        name: 'finance',
        meta: {
            title: '财务管理',
            icon: 'icon-caiwu'
        },
        component: LayoutMain,
        children: [
            {
                path: 'market-formula',
                name: 'market-formula',
                meta: {
                    title: '计算公式'
                },
                component: () => import('@/views/finance/market-formula')
            },
            {
                path: 'perform-wage',
                name: 'perform-wage',
                meta: {
                    title: '工资绩效'
                },
                component: () => import('@/views/finance/perform-wage')
            }
        ]
    },
    {
        path: '/permission',
        name: 'permission',
        meta: {
            title: '权限管理',
            icon: 'icon-quanxian'
        },
        component: LayoutMain,
        children: [
            {
                path: 'staff-management',
                name: 'staff-management',
                meta: {
                    title: '员工管理'
                },
                component: () => import('@/views/permission/staff-management')
            },
            {
                path: 'allocation-role',
                name: 'allocation-role',
                meta: {
                    title: '角色分配'
                },
                component: () => import('@/views/permission/allocation-role')
            }
        ]
    },
    {
        path: '/401',
        name: 'error-401',
        meta: {
            hideInMenu: true
        },
        component: () => import('@/views/error-page/401')
    },
    {
        path: '/500',
        name: 'error-500',
        meta: {
            hideInMenu: true
        },
        component: () => import('@/views/error-page/500')
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'error-404',
        meta: {
            hideInMenu: true
        },
        component: () => import('@/views/error-page/404')
    }
]

export default routes
