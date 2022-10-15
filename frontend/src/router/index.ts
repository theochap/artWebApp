import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home.vue'
import LogInView from "../views/LogIn.vue"
import SignInView from "../views/SignIn.vue"
import AccountView from "../views/Account.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: "/login",
      name: "login",
      component: LogInView
    },
    {
      path: "/signin",
      name: "signin",
      component: SignInView
    },
    {
      path: "/account",
      name: "account",
      component: AccountView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/About.vue')
    }
  ]
})

export default router
