export const menu = [
  { header: 'Apps' },
  { title: 'Dashboard', icon: 'mdi-view-dashboard', to: '/dashboard' },
  { title: 'Users', icon: 'mdi-account-multiple', to: '/users' },
  { title: 'User Groups', icon: 'mdi-account-group', to: '/user-groups' },
  { title: 'Categories', icon: 'mdi-shape', to: '/categories' },
  { title: 'Products', icon: 'mdi-package-variant-closed', to: '/products' },
  { title: 'Orders', icon: 'mdi-receipt-text', to: '/orders' },
  { title: 'Ecommerce', icon: 'mdi-storefront', to: '/ecommerce' },
  { title: 'Income', icon: 'mdi-cash-plus', to: '/income' },
  { title: 'Expense', icon: 'mdi-cash-minus', to: '/expense' },
  { title: 'Items', icon: 'mdi-package-variant', to: '/items' },
  { title: 'Monthly Items', icon: 'mdi-calendar-multiple', to: '/monthly-items' },
  { title: 'Chat', icon: 'mdi-chat', to: '/chat' },
  { title: 'Inbox', icon: 'mdi-email', to: '/mail' },
  { title: 'Media', icon: 'mdi-filmstrip', to: '/media' },
  { title: 'Send Mail', icon: 'mdi-email', to: '/media/send-mail' },
  { header: 'Extras' },
  {
    title: 'Pages', icon: 'mdi-file-document', children: [
      { title: '404', icon: 'mdi-alert-circle-outline', to: '/404-not-found' },
      { title: '403', icon: 'mdi-lock-alert', to: '/403' },
      { title: '500', icon: 'mdi-server-network-off', to: '/500' },
      { title: 'Profile', icon: 'mdi-account-circle', to: '/profile' }
    ]
  },
  { header: 'Security' },
  {
    title: 'Security Settings', icon: 'mdi-shield-lock', children: [
      { title: 'Roles', icon: 'mdi-shield-account', to: '/security/roles' },
      { title: 'Permissions', icon: 'mdi-shield-account', to: '/security/permissions' }
    ]
  }
]
