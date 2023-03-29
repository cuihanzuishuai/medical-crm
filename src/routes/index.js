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
        redirect: { name: 'home' },
        children: [
            {
                path: 'home',
                name: 'home',
                meta: {
                    title: '首页',
                    icon: 'icon-yonghu'
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
            icon: 'icon-yonghu'
        },
        component: LayoutMain,
        children: [
            {
                path: 'level-1',
                name: 'level-1',
                meta: {
                    title: '报单功能',
                    icon: 'icon-yonghu'
                },
                component: () => import('@/views/Home')
            },
            {
                path: 'level-2',
                name: 'level-2',
                meta: {
                    title: '患者信息',
                    icon: 'icon-yonghu'
                },
                component: () => import('@/views/Home')
            }
        ]
    },
    {
        path: '/customer',
        name: 'customer',
        meta: {
            title: '客服模块',
            icon: 'icon-yonghu'
        },
        component: LayoutMain,
        children: [
            {
                path: 'level-1',
                name: 'level-1',
                meta: {
                    title: '待复诊患者',
                    icon: 'icon-yonghu'
                },
                component: () => import('@/views/Home')
            },
            {
                path: 'level-2',
                name: 'level-2',
                meta: {
                    title: '任务分配',
                    icon: 'icon-yonghu'
                },
                component: () => import('@/views/Home')
            },
            {
                path: 'level-2',
                name: 'level-2',
                meta: {
                    title: '回访记录',
                    icon: 'icon-yonghu'
                },
                component: () => import('@/views/Home')
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
