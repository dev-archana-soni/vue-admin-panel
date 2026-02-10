import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import Dashboard from '@/pages/Dashboard.vue'
import Login from '@/pages/Login.vue'
import Register from '@/pages/Register.vue'
import NotFound from '@/pages/NotFound.vue'
import ServerError from '@/pages/ServerError.vue'
import Profile from '@/pages/Profile.vue'
import Settings from '@/pages/Settings.vue'
import Users from '@/pages/Users.vue'
import Placeholder from '@/pages/Placeholder.vue'
import ChatDemo from '@/pages/ChatDemo.vue'
import Inbox from '@/pages/Inbox.vue'
import Media from '@/pages/Media.vue'
import SendMail from '@/pages/SendMail.vue'
import Roles from '@/pages/security/Roles.vue'
import Permissions from '@/pages/security/Permissions.vue'
import UserGroups from '@/pages/UserGroups.vue'
import Categories from '@/pages/Categories.vue'
import Products from '@/pages/Products.vue'
import Orders from '@/pages/Orders.vue'
import Ecommerce from '@/pages/Ecommerce.vue'
import EcommerceProduct from '@/pages/EcommerceProduct.vue'
import Income from '@/pages/Income.vue'
import Expense from '@/pages/Expense.vue'
import Items from '@/pages/Items.vue'
import MonthlyItems from '@/pages/MonthlyItems.vue'

const placeholder = (path, title, name) => ({ path, name: name || path, component: Placeholder, props: { title } })

const routes = [
  { path: '/', redirect: { name: 'dashboard' } },
  { path: '/dashboard', name: 'dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/login', name: 'login', component: Login, meta: { public: true } },
  { path: '/register', name: 'register', component: Register, meta: { public: true } },
  { path: '/profile', name: 'profile', component: Profile, meta: { requiresAuth: true } },
  { path: '/settings', name: 'settings', component: Settings, meta: { requiresAuth: true } },
  { path: '/users', name: 'users', component: Users, meta: { requiresAuth: true } },
  { path: '/user-groups', name: 'user-groups', component: UserGroups, meta: { requiresAuth: true } },
  { path: '/categories', name: 'categories', component: Categories, meta: { requiresAuth: true } },
  { path: '/products', name: 'products', component: Products, meta: { requiresAuth: true } },
  { path: '/orders', name: 'orders', component: Orders, meta: { requiresAuth: true } },
  { path: '/ecommerce', name: 'ecommerce', component: Ecommerce, meta: { public: true } },
  { path: '/ecommerce/product/:id', name: 'ecommerce-product', component: EcommerceProduct, meta: { public: true } },
  { path: '/income', name: 'income', component: Income, meta: { requiresAuth: true } },
  { path: '/expense', name: 'expense', component: Expense, meta: { requiresAuth: true } },
  { path: '/items', name: 'items', component: Items, meta: { requiresAuth: true } },
  { path: '/monthly-items', name: 'monthly-items', component: MonthlyItems, meta: { requiresAuth: true } },
  // Apps
  { path: '/chat', name: 'chat', component: ChatDemo, meta: { requiresAuth: true } },
  { path: '/mail', name: 'mail', component: Inbox, meta: { requiresAuth: true } },
  { path: '/media', name: 'media', component: Media, meta: { requiresAuth: true } },
  { path: '/media/send-mail', name: 'send-mail', component: SendMail, meta: { requiresAuth: true } },
  // Security
  { path: '/security/roles', name: 'roles', component: Roles, meta: { requiresAuth: true } },
  { path: '/security/permissions', name: 'permissions', component: Permissions, meta: { requiresAuth: true } },
  // Errors
  { path: '/404-not-found', name: 'not-found', component: NotFound, meta: { public: true } },
  placeholder('/403', 'Access Denied', 'access-denied'),
  { path: '/500', name: 'server-error', component: ServerError, meta: { public: true } },
  { path: '/:pathMatch(.*)*', redirect: { name: 'not-found' } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Route guard for authentication
router.beforeEach(async (to, from, next) => {
  const { isAuthenticated, ensureSession } = useAuth()

  // If route requires auth and user is not authenticated
  if (to.meta.requiresAuth) {
    const ok = await ensureSession()
    if (!ok) {
      return next({ name: 'login', query: { redirect: to.fullPath } })
    }
  }

  // If user is logged in and trying to access login/register, redirect to dashboard
  if (to.name === 'login' || to.name === 'register') {
    const ok = await ensureSession()
    if (ok) {
      return next({ name: 'dashboard' })
    }
  }

  next()
})

export default router
