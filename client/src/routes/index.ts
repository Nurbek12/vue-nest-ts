import { createRouter, createWebHashHistory, RouteRecordRaw, 
    NavigationGuardNext } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import store from '../store'

const beforeEnter = (to: any, __: any, next: NavigationGuardNext) => {
    console.log(store().token);
    
    const { user, logged } = store()
    if(!logged) next('/login')
    if(((user as any).role === 'user')&&!['/myorders', '/profile', '/chat'].includes(to.path)) next('/myorders')
    else next()
    // next()
}

const routes: RouteRecordRaw[] = [
    { path: '/', component: Dashboard, beforeEnter },
    { path: '/products', component: () => import('../views/admin/Products.vue'), beforeEnter },
    { path: '/orders', component: () => import('../views/admin/Orders.vue'), beforeEnter },
    { path: '/clients', component: () => import('../views/admin/Clients.vue'), beforeEnter },
    { path: '/categoies', component: () => import('../views/admin/Categories.vue'), beforeEnter },
    { path: '/chat', component: () => import('../views/Chat.vue'), beforeEnter },
    { path: '/myorders', component: () => import('../views/MyOrders.vue'), beforeEnter },
    { path: '/storage', component: () => import('../views/admin/Storage.vue'), beforeEnter },
    { path: '/profile', component: () => import('../views/Profile.vue'), beforeEnter },
    { path: '/login', component: () => import('../views/Login.vue') },
]

export default createRouter({
    history: createWebHashHistory(),
    routes
})