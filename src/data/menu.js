export const menu = [
  { header: 'Apps' },
  { title: 'Dashboard', icon: 'mdi-view-dashboard', to: '/dashboard' },
  { title: 'Users', icon: 'mdi-account-multiple', to: '/users' },
  { title: 'Chat', icon: 'mdi-chat', to: '/chat' },
  { title: 'Inbox', icon: 'mdi-email', to: '/mail' },
  { title: 'Media', icon: 'mdi-filmstrip', to: '/media' },
  {
    title: 'Widgets', icon: 'mdi-widgets', children: [
      { title: 'Social', to: '/widgets/social' },
      { title: 'Statistic', to: '/widgets/statistic' },
      { title: 'Chart', to: '/widgets/chart' },
      { title: 'List', to: '/widgets/list' }
    ]
  },
  { header: 'UI Elements' },
  {
    title: 'General', icon: 'mdi-tune', children: [
      { title: 'Alerts', to: '/components/alerts' },
      { title: 'Avatars', to: '/components/avatars' },
      { title: 'Badges', to: '/components/badges' },
      { title: 'Buttons', to: '/components/buttons' },
      { title: 'Cards', to: '/components/cards' },
      { title: 'Carousels', to: '/components/carousels' },
      { title: 'Chips', to: '/components/chips' },
      { title: 'Dialogs', to: '/components/dialogs' },
      { title: 'Icons', to: '/components/icons' },
      { title: 'Tables', to: '/components/tables' },
      { title: 'Parallax', to: '/components/parallax' },
      { title: 'Snackbar', to: '/components/snackbar' },
      { title: 'Progress', to: '/components/progress' },
      { title: 'Slider', to: '/components/sliders' },
      { title: 'Tooltip', to: '/components/tooltips' },
      { title: 'Pagination', to: '/components/paginations' },
      { title: 'Typography', to: '/components/typography' },
      { title: 'Color', to: '/components/color' }
    ]
  },
  {
    title: 'Pickers', icon: 'mdi-filter', children: [
      { title: 'Time picker', to: '/pickers/timepicker' },
      { title: 'Date picker', to: '/pickers/datepicker' }
    ]
  },
  {
    title: 'Layout', icon: 'mdi-view-quilt', children: [
      { title: 'Bottom panels', to: '/layout/bottom-sheets' },
      { title: 'Expansion panels', to: '/layout/expansion-panels' },
      { title: 'Footer', to: '/layout/footer' },
      { title: 'Lists', to: '/layout/lists' },
      { title: 'Jumbotrons', to: '/layout/jumbotrons' },
      { title: 'Menus', to: '/layout/menus' },
      { title: 'Tabs', to: '/layout/tabs' },
      { title: 'Toolbar', to: '/layout/toolbar' },
      { title: 'Timeline', to: '/layout/timeline' }
    ]
  },
  {
    title: 'Forms & Controls', icon: 'mdi-form-select', children: [
      { title: 'General', to: '/forms/basic' },
      { title: 'Selects', to: '/forms/selects' },
      { title: 'Selection Controls', to: '/forms/selection-controls' },
      { title: 'Text Fields', to: '/forms/text-fields' },
      { title: 'Steppers', to: '/forms/steppers' },
      { title: 'Editors', to: '/forms/editors' }
    ]
  },
  { header: 'Extras' },
  {
    title: 'Pages', icon: 'mdi-file-document', children: [
      { title: 'Login', to: '/login' },
      { title: 'Register', to: '/register' },
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
