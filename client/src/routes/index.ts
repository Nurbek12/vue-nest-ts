import { createRouter, createWebHistory, RouteRecordRaw, 
    NavigationGuardNext } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import store from '../store'
const { user, logged } = store()

const beforeEnter = (to: any, __: any, next: NavigationGuardNext) => {
    // console.log(_);
    
    if(!logged) next('/login')
    if(((user as any).role === 'user')&&!['/myorders', '/profile', '/chat'].includes(to.path)) next('/myorders')
    else next()
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
    history: createWebHistory(),
    routes
})

// import { createRouter, createWebHistory } from "vue-router";
// import HomeView from "../views/HomeView.vue";

// const router = createRouter({
//   history: createWebHistory(import.meta.env.BASE_URL),
//   routes: [
//     {
//       path: "/",
//       name: "home",
//       component: HomeView,
//     },
//     {
//       path: "/register",
//       name: "Register",
//       component: () => import("../views/RegisterView.vue"),
//     },
//     {
//       path: "/login",
//       name: "Login",
//       component: () => import("../views/LoginView.vue"),
//     },
//     {
//       path: "/product/:productID",
//       name: "Product",
//       component: () => import("../views/ProductView.vue"),
//     },
//     {
//       path: "/shop/:shopID",
//       name: "Shop",
//       component: () => import("../views/ShopView.vue"),
//     },
//     {
//       path: "/category/:categoryID",
//       name: "Category",
//       component: () => import("../views/CategoryView.vue"),
//     },
//     {
//       path: "/cart",
//       name: "Cart",
//       component: () => import("../views/CartView.vue"),
//     },
//     {
//       path: "/checkout",
//       name: "CheckOut",
//       component: () => import("../views/CheckOutView.vue"),
//     },
//     {
//       path: "/profile",
//       name: "Profile",
//       component: () => import("../views/UserProfileView.vue"),
//     },
//     {
//       path: "/dashboard",
//       name: "Dashboard",
//       component: () => import("../views/DashboardView.vue"),
//     },
//     {
//       path: "/admin",
//       component: () => import("../views/admin/AdminView.vue"),
//       children: [
//         {
//           path: "",
//           name: "AdminHome",
//           component: () => import("../views/admin/AdminHome.vue"),
//         },
//         {
//           path: "users",
//           name: "AdminUsers",
//           component: () => import("../views/admin/AdminUsers.vue"),
//         },
//         {
//           path: "shops",
//           name: "AdminShops",
//           component: () => import("../views/admin/AdminShops.vue"),
//         },
//         {
//           path: "products",
//           name: "AdminProducts",
//           component: () => import("../views/admin/AdminProducts.vue"),
//         },
//       ],
//     },
//   ],
// });

// export default router;