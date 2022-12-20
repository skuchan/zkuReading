import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
      }
    ]
  },

]
//异步加载的组件,控制权限的方法，比如说管理员才能访问的路由
export const asyncRoutes = [
  {
    path: '/book',
    name: 'book',
    component: Layout,
    redirect: '/book/create',
    meta: { title: '图书管理', icon: 'documentation', roles: ['admin', 'editor'] },
    children: [
      {
        path: '/book/create',
        component: () => import('@/views/book/create.vue'),
        name: 'bookCreate',
        meta: { title: '上传图书', icon: 'edit', roles: ['admin'] }
      },
      {
        path: '/book/edit/:fileName',
        component: () => import('@/views/book/edit.vue'),
        name: 'bookEdit',
        hidden: true,
        meta: { title: '编辑图书', icon: 'edit', roles: ['admin'],activeMenu:'/book/list'}
      },
      {
        name: 'booklist',
        path: '/book/list',
        component: () => import('@/views/book/list.vue'),
        meta: { title: '图书列表', icon: 'list', roles: ['editor'] }
      },
    ]
  }
  ,
  {
    path: '/error',
    component: Layout,
    redirect: 'noRedirect',
    name: 'ErrorPages',
    meta: {
      title: 'Error Pages',
      icon: '404'
    },
    children: [
      {
        path: '401',
        component: () => import('@/views/error-page/401'),
        name: 'Page401',
        meta: { title: '401', noCache: true }
      },
      {
        path: '404',
        component: () => import('@/views/error-page/404'),
        name: 'Page404',
        meta: { title: '404', noCache: true }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
