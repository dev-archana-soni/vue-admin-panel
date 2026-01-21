import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import Dashboard from '@/pages/Dashboard.vue'
import Login from '@/pages/Login.vue'
import Register from '@/pages/Register.vue'
import NotFound from '@/pages/NotFound.vue'
import ServerError from '@/pages/ServerError.vue'
import Profile from '@/pages/Profile.vue'
import Users from '@/pages/Users.vue'
import Placeholder from '@/pages/Placeholder.vue'
import Alerts from '../components/Alerts.vue'
import ChatDemo from '@/pages/ChatDemo.vue'
import Inbox from '@/pages/Inbox.vue'
import Media from '@/pages/Media.vue'
import Roles from '@/pages/security/Roles.vue'
import Permissions from '@/pages/security/Permissions.vue'

const placeholder = (path, title, name) => ({ path, name: name || path, component: Placeholder, props: { title } })

const routes = [
  { path: '/', redirect: { name: 'dashboard' } },
  { path: '/dashboard', name: 'dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/login', name: 'login', component: Login, meta: { public: true } },
  { path: '/register', name: 'register', component: Register, meta: { public: true } },
  { path: '/profile', name: 'profile', component: Profile, meta: { requiresAuth: true } },
  { path: '/users', name: 'users', component: Users, meta: { requiresAuth: true } },
  // Apps
  { path: '/chat', name: 'chat', component: ChatDemo, meta: { requiresAuth: true } },
  { path: '/mail', name: 'mail', component: Inbox, meta: { requiresAuth: true } },
  { path: '/media', name: 'media', component: Media, meta: { requiresAuth: true } },
  // Widgets
  placeholder('/widgets/social', 'Widgets - Social'),
  placeholder('/widgets/statistic', 'Widgets - Statistic'),
  placeholder('/widgets/chart', 'Widgets - Chart'),
  placeholder('/widgets/list', 'Widgets - List'),
  // UI General
  { path: '/components/alerts', name: 'alerts', component: Alerts, meta: { requiresAuth: true } },
  placeholder('/components/avatars', 'Avatars'),
  placeholder('/components/badges', 'Badges'),
  placeholder('/components/buttons', 'Buttons'),
  placeholder('/components/cards', 'Cards'),
  placeholder('/components/carousels', 'Carousels'),
  placeholder('/components/chips', 'Chips'),
  placeholder('/components/dialogs', 'Dialogs'),
  placeholder('/components/icons', 'Icons'),
  placeholder('/components/tables', 'Data Tables'),
  placeholder('/components/parallax', 'Parallax'),
  placeholder('/components/snackbar', 'Snackbar'),
  placeholder('/components/progress', 'Progress'),
  placeholder('/components/sliders', 'Slider'),
  placeholder('/components/tooltips', 'Tooltip'),
  placeholder('/components/paginations', 'Pagination'),
  placeholder('/components/typography', 'Typography'),
  placeholder('/components/color', 'Color'),
  // Pickers
  placeholder('/pickers/timepicker', 'Time picker'),
  placeholder('/pickers/datepicker', 'Date picker'),
  // Layout
  placeholder('/layout/bottom-sheets', 'Bottom panels'),
  placeholder('/layout/expansion-panels', 'Expansion panels'),
  placeholder('/layout/footer', 'Footer'),
  placeholder('/layout/lists', 'Lists'),
  placeholder('/layout/jumbotrons', 'Jumbotrons'),
  placeholder('/layout/menus', 'Menus'),
  placeholder('/layout/tabs', 'Tabs'),
  placeholder('/layout/toolbar', 'Toolbar'),
  placeholder('/layout/timeline', 'Timeline'),
  // Forms
  placeholder('/forms/basic', 'Forms - General'),
  placeholder('/forms/selects', 'Forms - Selects'),
  placeholder('/forms/selection-controls', 'Forms - Selection Controls'),
  placeholder('/forms/text-fields', 'Forms - Text Fields'),
  placeholder('/forms/steppers', 'Forms - Steppers'),
  placeholder('/forms/editors', 'Forms - Editors'),
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
router.beforeEach((to, from, next) => {
  const { isAuthenticated } = useAuth()

  // If route requires auth and user is not authenticated
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    return next({ name: 'login', query: { redirect: to.fullPath } })
  }

  // If user is logged in and trying to access login/register, redirect to dashboard
  if ((to.name === 'login' || to.name === 'register') && isAuthenticated.value) {
    return next({ name: 'dashboard' })
  }

  next()
})

export default router
