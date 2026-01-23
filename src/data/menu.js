export const menu = [
  { header: 'Apps' },
  { title: 'Dashboard', icon: 'mdi-view-dashboard', to: '/dashboard' },
  { title: 'Users', icon: 'mdi-account-multiple', to: '/users' },
  { title: 'User Groups', icon: 'mdi-account-group', to: '/user-groups' },
  { title: 'Categories', icon: 'mdi-shape', to: '/categories' },
  { title: 'Income', icon: 'mdi-cash-plus', to: '/income' },
  { title: 'Expense', icon: 'mdi-cash-minus', to: '/expense' },
  { title: 'Chat', icon: 'mdi-chat', to: '/chat' },
  { title: 'Inbox', icon: 'mdi-email', to: '/mail' },
  { title: 'Media', icon: 'mdi-filmstrip', to: '/media' },
  { header: 'Extras' },
  {
    title: 'Pages', icon: 'mdi-file-document', children: [
      { title: '404', to: '/404-not-found' },
      { title: '403', to: '/403' },
      { title: '500', to: '/500' },
      { title: 'Profile', to: '/profile' }
    ]
  }
  ,
  { header: 'Security' },
  {
    title: 'Security Settings', icon: 'mdi-shield-lock', children: [
      { title: 'Roles', to: '/security/roles' },
      { title: 'Permissions', to: '/security/permissions' }
    ]
  }
]
