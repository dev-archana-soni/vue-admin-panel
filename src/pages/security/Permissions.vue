<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <div class="d-flex align-center mb-4">
          <div>
            <h1 class="text-h4">Permissions Management</h1>
            <p class="text-medium-emphasis">Configure role-based permissions</p>
          </div>
          <v-spacer />
          <v-btn variant="outlined" prepend-icon="mdi-arrow-left" @click="$router.back()" class="mr-2">
            Back
          </v-btn>
          <v-btn color="primary" prepend-icon="mdi-content-save" @click="savePermissions">
            Save Changes
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Role Selector -->
    <v-row>
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-text class="pa-4">
            <v-row align="center">
              <v-col cols="12" md="4">
                <v-select
                  v-model="selectedRole"
                  :items="roles"
                  item-title="name"
                  item-value="id"
                  label="Select Role"
                  prepend-inner-icon="mdi-account-key"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  return-object
                >
                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props">
                      <template v-slot:prepend>
                        <v-icon :color="item.raw.color">{{ item.raw.icon }}</v-icon>
                      </template>
                    </v-list-item>
                  </template>
                </v-select>
              </v-col>
              <v-col cols="12" md="8" v-if="selectedRole">
                <div class="d-flex align-center">
                  <v-icon :color="selectedRole.color" class="mr-3" size="large">
                    {{ selectedRole.icon }}
                  </v-icon>
                  <div>
                    <div class="text-subtitle-1 font-weight-medium">{{ selectedRole.name }}</div>
                    <div class="text-caption text-medium-emphasis">{{ selectedRole.description }}</div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Permissions Grid -->
    <v-row v-if="selectedRole">
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title class="d-flex align-center pa-4">
            <span class="text-h6">Permission Categories</span>
            <v-spacer />
            <v-btn-group density="compact">
              <v-btn @click="selectAll" variant="outlined" size="small">
                Select All
              </v-btn>
              <v-btn @click="deselectAll" variant="outlined" size="small">
                Deselect All
              </v-btn>
            </v-btn-group>
          </v-card-title>

          <v-divider />

          <v-expansion-panels variant="accordion" multiple>
            <v-expansion-panel
              v-for="category in permissionCategories"
              :key="category.id"
            >
              <v-expansion-panel-title>
                <div class="d-flex align-center w-100">
                  <v-icon :color="category.color" class="mr-3">{{ category.icon }}</v-icon>
                  <div class="flex-grow-1">
                    <span class="text-subtitle-1 font-weight-medium">{{ category.name }}</span>
                    <div class="text-caption text-medium-emphasis">{{ category.description }}</div>
                  </div>
                  <v-chip size="small" :color="getPermissionCountColor(category)">
                    {{ getSelectedCount(category) }}/{{ category.permissions.length }}
                  </v-chip>
                </div>
              </v-expansion-panel-title>

              <v-expansion-panel-text>
                <v-row>
                  <v-col
                    v-for="permission in category.permissions"
                    :key="permission.id"
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-card variant="outlined" class="permission-card">
                      <v-card-text class="pa-3">
                        <div class="d-flex align-center">
                          <v-checkbox
                            v-model="selectedPermissions"
                            :value="permission.id"
                            hide-details
                            density="compact"
                            color="primary"
                          />
                          <div class="flex-grow-1 ml-2">
                            <div class="text-body-2 font-weight-medium">{{ permission.name }}</div>
                            <div class="text-caption text-medium-emphasis">{{ permission.description }}</div>
                          </div>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>
      </v-col>
    </v-row>

    <!-- Empty State -->
    <v-row v-else>
      <v-col cols="12">
        <v-card elevation="2" class="pa-12 text-center">
          <v-icon size="100" color="grey-lighten-2">mdi-shield-key-outline</v-icon>
          <div class="text-h6 text-medium-emphasis mt-4">Select a Role</div>
          <div class="text-caption text-medium-emphasis">
            Choose a role from the dropdown above to manage its permissions
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Summary Card -->
    <v-row v-if="selectedRole">
      <v-col cols="12">
        <v-card elevation="2" color="primary" variant="tonal">
          <v-card-text class="pa-4">
            <v-row align="center">
              <v-col cols="12" md="8">
                <div class="text-h6">Permission Summary</div>
                <div class="text-body-2 mt-2">
                  <strong>{{ selectedPermissions.length }}</strong> permissions selected out of
                  <strong>{{ totalPermissions }}</strong> available
                </div>
              </v-col>
              <v-col cols="12" md="4" class="text-right">
                <v-progress-circular
                  :model-value="permissionPercentage"
                  :size="80"
                  :width="8"
                  color="primary"
                >
                  {{ permissionPercentage }}%
                </v-progress-circular>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Save Confirmation Dialog -->
    <v-dialog v-model="saveDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">Save Permissions?</v-card-title>
        <v-card-text>
          Are you sure you want to save the permission changes for the role
          "<strong>{{ selectedRole?.name }}</strong>"?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="saveDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="confirmSave" :loading="saving">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success Snackbar -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000">
      {{ snackbarMessage }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const selectedRole = ref(null)
const selectedPermissions = ref([])
const saveDialog = ref(false)
const saving = ref(false)
const snackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('success')

const roles = ref([
  {
    id: 1,
    name: 'Super Administrator',
    description: 'Full system access with all permissions',
    icon: 'mdi-crown',
    color: 'error'
  },
  {
    id: 2,
    name: 'Administrator',
    description: 'Administrative access to most system features',
    icon: 'mdi-shield-account',
    color: 'primary'
  },
  {
    id: 3,
    name: 'Manager',
    description: 'Can manage team members and view reports',
    icon: 'mdi-account-tie',
    color: 'info'
  },
  {
    id: 4,
    name: 'Editor',
    description: 'Can create and edit content',
    icon: 'mdi-pencil',
    color: 'success'
  },
  {
    id: 5,
    name: 'Viewer',
    description: 'Read-only access to content',
    icon: 'mdi-eye',
    color: 'secondary'
  }
])

const permissionCategories = ref([
  {
    id: 1,
    name: 'User Management',
    description: 'Manage users, roles, and permissions',
    icon: 'mdi-account-group',
    color: 'primary',
    permissions: [
      { id: 'user.view', name: 'View Users', description: 'View user list and details' },
      { id: 'user.create', name: 'Create Users', description: 'Add new users to the system' },
      { id: 'user.edit', name: 'Edit Users', description: 'Modify user information' },
      { id: 'user.delete', name: 'Delete Users', description: 'Remove users from the system' },
      { id: 'user.assign-role', name: 'Assign Roles', description: 'Assign roles to users' },
      { id: 'user.reset-password', name: 'Reset Password', description: 'Reset user passwords' }
    ]
  },
  {
    id: 2,
    name: 'Content Management',
    description: 'Create, edit, and publish content',
    icon: 'mdi-file-document-edit',
    color: 'success',
    permissions: [
      { id: 'content.view', name: 'View Content', description: 'View all content' },
      { id: 'content.create', name: 'Create Content', description: 'Create new content' },
      { id: 'content.edit', name: 'Edit Content', description: 'Modify existing content' },
      { id: 'content.delete', name: 'Delete Content', description: 'Remove content' },
      { id: 'content.publish', name: 'Publish Content', description: 'Publish content to public' },
      { id: 'content.unpublish', name: 'Unpublish Content', description: 'Remove content from public' }
    ]
  },
  {
    id: 3,
    name: 'Media Library',
    description: 'Manage media files and uploads',
    icon: 'mdi-image-multiple',
    color: 'purple',
    permissions: [
      { id: 'media.view', name: 'View Media', description: 'View media library' },
      { id: 'media.upload', name: 'Upload Media', description: 'Upload new media files' },
      { id: 'media.edit', name: 'Edit Media', description: 'Modify media metadata' },
      { id: 'media.delete', name: 'Delete Media', description: 'Remove media files' },
      { id: 'media.organize', name: 'Organize Media', description: 'Create folders and organize' }
    ]
  },
  {
    id: 4,
    name: 'Reports & Analytics',
    description: 'Access reports and analytics',
    icon: 'mdi-chart-line',
    color: 'info',
    permissions: [
      { id: 'reports.view', name: 'View Reports', description: 'Access all reports' },
      { id: 'reports.export', name: 'Export Reports', description: 'Export reports as files' },
      { id: 'analytics.view', name: 'View Analytics', description: 'Access analytics dashboard' },
      { id: 'analytics.advanced', name: 'Advanced Analytics', description: 'Access advanced analytics' }
    ]
  },
  {
    id: 5,
    name: 'System Settings',
    description: 'Configure system settings',
    icon: 'mdi-cog',
    color: 'warning',
    permissions: [
      { id: 'settings.view', name: 'View Settings', description: 'View system settings' },
      { id: 'settings.edit', name: 'Edit Settings', description: 'Modify system settings' },
      { id: 'settings.security', name: 'Security Settings', description: 'Configure security settings' },
      { id: 'settings.integrations', name: 'Manage Integrations', description: 'Configure third-party integrations' },
      { id: 'settings.backup', name: 'Backup & Restore', description: 'Manage system backups' }
    ]
  },
  {
    id: 6,
    name: 'Communication',
    description: 'Messaging and email features',
    icon: 'mdi-email',
    color: 'blue',
    permissions: [
      { id: 'chat.access', name: 'Access Chat', description: 'Use chat features' },
      { id: 'chat.admin', name: 'Chat Admin', description: 'Manage chat settings' },
      { id: 'email.send', name: 'Send Emails', description: 'Send emails to users' },
      { id: 'email.templates', name: 'Manage Templates', description: 'Create and edit email templates' }
    ]
  },
  {
    id: 7,
    name: 'Audit & Logs',
    description: 'View system logs and audit trails',
    icon: 'mdi-file-clock',
    color: 'orange',
    permissions: [
      { id: 'audit.view', name: 'View Audit Logs', description: 'Access audit trail' },
      { id: 'audit.export', name: 'Export Logs', description: 'Export audit logs' },
      { id: 'logs.system', name: 'System Logs', description: 'View system logs' },
      { id: 'logs.error', name: 'Error Logs', description: 'View error logs' }
    ]
  },
  {
    id: 8,
    name: 'API Access',
    description: 'API and integration permissions',
    icon: 'mdi-api',
    color: 'teal',
    permissions: [
      { id: 'api.access', name: 'API Access', description: 'Access API endpoints' },
      { id: 'api.keys', name: 'Manage API Keys', description: 'Create and manage API keys' },
      { id: 'api.webhooks', name: 'Manage Webhooks', description: 'Configure webhooks' }
    ]
  }
])

const totalPermissions = computed(() => {
  return permissionCategories.value.reduce((sum, cat) => sum + cat.permissions.length, 0)
})

const permissionPercentage = computed(() => {
  if (totalPermissions.value === 0) return 0
  return Math.round((selectedPermissions.value.length / totalPermissions.value) * 100)
})

const getSelectedCount = (category) => {
  return category.permissions.filter(p => selectedPermissions.value.includes(p.id)).length
}

const getPermissionCountColor = (category) => {
  const selected = getSelectedCount(category)
  const total = category.permissions.length
  const percentage = (selected / total) * 100

  if (percentage === 100) return 'success'
  if (percentage >= 50) return 'warning'
  if (percentage > 0) return 'info'
  return 'grey'
}

const selectAll = () => {
  selectedPermissions.value = permissionCategories.value.flatMap(cat =>
    cat.permissions.map(p => p.id)
  )
}

const deselectAll = () => {
  selectedPermissions.value = []
}

const savePermissions = () => {
  if (!selectedRole.value) return
  saveDialog.value = true
}

const confirmSave = () => {
  saving.value = true

  setTimeout(() => {
    saving.value = false
    saveDialog.value = false
    snackbarMessage.value = 'Permissions saved successfully!'
    snackbarColor.value = 'success'
    snackbar.value = true
  }, 1000)
}

// Watch for role changes
watch(selectedRole, (newRole) => {
  if (!newRole) return

  // Load role's current permissions
  // In a real app, this would fetch from an API
  if (newRole.id === 1) {
    // Super Admin - all permissions
    selectAll()
  } else if (newRole.id === 2) {
    // Admin - most permissions
    selectedPermissions.value = permissionCategories.value.flatMap(cat =>
      cat.permissions.slice(0, Math.ceil(cat.permissions.length * 0.8)).map(p => p.id)
    )
  } else if (newRole.id === 3) {
    // Manager - moderate permissions
    selectedPermissions.value = [
      'user.view', 'user.edit',
      'content.view', 'content.create', 'content.edit',
      'media.view', 'media.upload',
      'reports.view', 'analytics.view',
      'chat.access'
    ]
  } else if (newRole.id === 4) {
    // Editor - content focused
    selectedPermissions.value = [
      'content.view', 'content.create', 'content.edit', 'content.publish',
      'media.view', 'media.upload', 'media.edit',
      'chat.access'
    ]
  } else {
    // Viewer - minimal permissions
    selectedPermissions.value = [
      'user.view',
      'content.view',
      'media.view',
      'reports.view',
      'chat.access'
    ]
  }
})

// Check if coming from roles page with roleId query param
if (route.query.roleId) {
  const roleId = parseInt(route.query.roleId)
  const role = roles.value.find(r => r.id === roleId)
  if (role) {
    selectedRole.value = role
  }
}
</script>

<style scoped>
.permission-card {
  transition: all 0.2s ease;
}

.permission-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
