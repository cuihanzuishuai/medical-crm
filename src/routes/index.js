import LayoutMain from '@/layout'
import Error401 from '@/views/error-page/401'
import Error404 from '@/views/error-page/404'
import Error500 from '@/views/error-page/500'
// --
import Login from '@/views/login'
import Home from '@/views/Home'
// 市场模块
import ReportForm from '@/views/market/report-form'
import PatientInfo from '@/views/market/patient-info'
// 客服模块
import PatientRevisit from '@/views/customer/patient-revisit'
import AllocationTask from '@/views/customer/allocation-task'
import VisitRecord from '@/views/customer/visit-record'
// 工作量
import MarketStaff from '@/views/workload/market-staff'
import CustomerStaff from '@/views/workload/customer-staff'
// 财务模块
import MarketFormula from '@/views/finance/market-formula'
import PerformWage from '@/views/finance/perform-wage'
// 权限模块
import AddStaff from '@/views/permission/add-staff'
import AllocationRole from '@/views/permission/allocation-role'
import StaffManagement from '@/views/permission/staff-management'
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
        component: Login
    },
    {
        path: '/',
        name: '_home',
        component: LayoutMain,
        redirect: { name: 'report-form' },
        meta: {
            hideInMenu: true
        },
        children: [
            {
                path: 'home',
                name: 'home',
                meta: {
                    title: '首页',
                    icon: 'icon-shouye'
                },
                component: Home
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
                    title: '报单功能'
                },
                component: ReportForm
            },
            {
                path: 'patient-info',
                name: 'patient-info',
                meta: {
                    title: '患者信息'
                },
                component: PatientInfo
            }
        ]
    },
    {
        path: '/customer',
        name: 'customer',
        meta: {
            title: '客服模块',
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
                component: PatientRevisit
            },
            {
                path: 'allocation-task',
                name: 'allocation-task',
                meta: {
                    title: '任务分配'
                },
                component: AllocationTask
            },
            {
                path: 'visit-record',
                name: 'visit-record',
                meta: {
                    title: '回访记录'
                },
                component: VisitRecord
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
                component: MarketStaff
            },
            {
                path: 'customer-staff',
                name: 'customer-staff',
                meta: {
                    title: '客服部工作量'
                },
                component: CustomerStaff
            }
        ]
    },
    {
        path: '/finance',
        name: 'finance',
        meta: {
            title: '财务模块',
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
                component: MarketFormula
            },
            {
                path: 'perform-wage',
                name: 'perform-wage',
                meta: {
                    title: '工资绩效'
                },
                component: PerformWage
            }
        ]
    },
    {
        path: '/permission',
        name: 'permission',
        meta: {
            title: '权限模块',
            icon: 'icon-quanxian'
        },
        component: LayoutMain,
        children: [
            {
                path: 'add-staff',
                name: 'add-staff',
                meta: {
                    title: '添加员工'
                },
                component: AddStaff
            },
            {
                path: 'allocation-role',
                name: 'allocation-role',
                meta: {
                    title: '角色分配'
                },
                component: AllocationRole
            },
            {
                path: 'staff-management',
                name: 'staff-management',
                meta: {
                    title: '员工管理'
                },
                component: StaffManagement
            }
        ]
    },
    {
        path: '/401',
        name: 'error-401',
        meta: {
            hideInMenu: true
        },
        component: Error401
    },
    {
        path: '/500',
        name: 'error-500',
        meta: {
            hideInMenu: true
        },
        component: Error500
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'error-404',
        meta: {
            hideInMenu: true
        },
        component: Error404
    }
]

export default routes
