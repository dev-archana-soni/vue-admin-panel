<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <div class="d-flex align-center mb-4">
          <div>
            <h1 class="text-h4">Roles Management</h1>
            <p class="text-medium-emphasis">Manage user roles and their permissions</p>
          </div>
          <v-spacer />
          <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreateDialog">
            Create Role
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Search and Filters -->
    <v-row>
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-text class="pa-4">
            <v-row align="center">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="searchQuery"
                  placeholder="Search roles..."
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  clearable
                />
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="statusFilter"
                  :items="statusOptions"
                  label="Status"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="3">
                <div class="text-body-2">
                  Total Roles: <strong>{{ filteredRoles.length }}</strong>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Roles Cards -->
    <v-row>
      <v-col v-for="role in filteredRoles" :key="role.id" cols="12" md="6" lg="4">
        <v-card elevation="2" :class="{ 'role-card-disabled': !role.active }">
          <v-card-title class="d-flex align-center pa-4">
            <v-icon :color="role.color" class="mr-3" size="large">{{ role.icon }}</v-icon>
            <div class="flex-grow-1">
              <div class="text-h6">{{ role.name }}</div>
              <v-chip size="x-small" :color="role.active ? 'success' : 'error'" class="mt-1">
                {{ role.active ? 'Active' : 'Inactive' }}
              </v-chip>
            </div>
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props" size="small" />
              </template>
              <v-list density="compact">
                <v-list-item @click="editRole(role)">
                  <template v-slot:prepend>
                    <v-icon size="small">mdi-pencil</v-icon>
                  </template>
                  <v-list-item-title>Edit</v-list-item-title>
                </v-list-item>
                <v-list-item @click="viewPermissions(role)">
                  <template v-slot:prepend>
                    <v-icon size="small">mdi-shield-key</v-icon>
                  </template>
                  <v-list-item-title>Permissions</v-list-item-title>
                </v-list-item>
                <v-list-item @click="duplicateRole(role)">
                  <template v-slot:prepend>
                    <v-icon size="small">mdi-content-copy</v-icon>
                  </template>
                  <v-list-item-title>Duplicate</v-list-item-title>
                </v-list-item>
                <v-divider />
                <v-list-item @click="toggleStatus(role)">
                  <template v-slot:prepend>
                    <v-icon size="small">{{ role.active ? 'mdi-cancel' : 'mdi-check-circle' }}</v-icon>
                  </template>
                  <v-list-item-title>{{ role.active ? 'Deactivate' : 'Activate' }}</v-list-item-title>
                </v-list-item>
                <v-list-item @click="confirmDelete(role)" :disabled="role.default">
                  <template v-slot:prepend>
                    <v-icon size="small" color="error">mdi-delete</v-icon>
                  </template>
                  <v-list-item-title class="text-error">Delete</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-card-title>

          <v-divider />

          <v-card-text class="pa-4">
            <div class="text-body-2 mb-3">{{ role.description }}</div>

            <div class="d-flex align-center mb-2">
              <v-icon size="small" class="mr-2">mdi-account-group</v-icon>
              <span class="text-body-2">
                <strong>{{ role.usersCount }}</strong> users assigned
              </span>
            </div>

            <div class="d-flex align-center mb-3">
              <v-icon size="small" class="mr-2">mdi-shield-check</v-icon>
              <span class="text-body-2">
                <strong>{{ role.permissionsCount }}</strong> permissions
              </span>
            </div>

            <v-divider class="my-3" />

            <div class="text-caption text-medium-emphasis mb-2">Key Permissions:</div>
            <div class="d-flex flex-wrap gap-1">
              <v-chip
                v-for="perm in role.keyPermissions"
                :key="perm"
                size="x-small"
                variant="outlined"
              >
                {{ perm }}
              </v-chip>
            </div>

            <div v-if="role.default" class="mt-3">
              <v-alert type="info" density="compact" variant="tonal">
                <span class="text-caption">Default role - Cannot be deleted</span>
              </v-alert>
            </div>
          </v-card-text>

          <v-divider />

          <v-card-actions class="pa-3">
            <v-btn variant="outlined" size="small" @click="viewPermissions(role)">
              Manage Permissions
            </v-btn>
            <v-spacer />
            <v-btn variant="text" size="small" @click="editRole(role)">
              Edit
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Create/Edit Role Dialog -->
    <v-dialog v-model="roleDialog" max-width="600" persistent>
      <v-card>
        <v-card-title class="d-flex align-center pa-4">
          <span class="text-h6">{{ editingRole ? 'Edit Role' : 'Create New Role' }}</span>
          <v-spacer />
          <v-btn icon="mdi-close" variant="text" size="small" @click="closeDialog" />
        </v-card-title>

        <v-divider />

        <v-card-text class="pa-4">
          <v-form ref="roleForm">
            <v-text-field
              v-model="roleData.name"
              label="Role Name"
              prepend-inner-icon="mdi-account-key"
              variant="outlined"
              density="comfortable"
              :rules="[rules.required]"
              class="mb-3"
            />

            <v-textarea
              v-model="roleData.description"
              label="Description"
              prepend-inner-icon="mdi-text"
              variant="outlined"
              rows="3"
              :rules="[rules.required]"
              class="mb-3"
            />

            <v-select
              v-model="roleData.icon"
              :items="iconOptions"
              label="Icon"
              prepend-inner-icon="mdi-emoticon"
              variant="outlined"
              density="comfortable"
              class="mb-3"
            >
              <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props">
                  <template v-slot:prepend>
                    <v-icon>{{ item.value }}</v-icon>
                  </template>
                </v-list-item>
              </template>
            </v-select>

            <v-select
              v-model="roleData.color"
              :items="colorOptions"
              label="Color"
              prepend-inner-icon="mdi-palette"
              variant="outlined"
              density="comfortable"
              class="mb-3"
            >
              <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props">
                  <template v-slot:prepend>
                    <v-avatar :color="item.value" size="24" />
                  </template>
                </v-list-item>
              </template>
            </v-select>

            <v-switch
              v-model="roleData.active"
              label="Active"
              color="primary"
              hide-details
            />
          </v-form>
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-4">
          <v-btn color="primary" @click="saveRole" :loading="saving">
            {{ editingRole ? 'Update' : 'Create' }}
          </v-btn>
          <v-btn variant="text" @click="closeDialog">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">Delete Role?</v-card-title>
        <v-card-text>
          Are you sure you want to delete the role "<strong>{{ roleToDelete?.name }}</strong>"?
          This action cannot be undone. All users with this role will need to be reassigned.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="error" @click="deleteRole">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const searchQuery = ref('')
const statusFilter = ref('all')
const roleDialog = ref(false)
const deleteDialog = ref(false)
const editingRole = ref(null)
const roleToDelete = ref(null)
const saving = ref(false)
const roleForm = ref(null)

const roleData = ref({
  name: '',
  description: '',
  icon: 'mdi-account',
  color: 'primary',
  active: true
})

const statusOptions = [
  { title: 'All Status', value: 'all' },
  { title: 'Active', value: 'active' },
  { title: 'Inactive', value: 'inactive' }
]

const iconOptions = [
  { title: 'Account', value: 'mdi-account' },
  { title: 'Shield', value: 'mdi-shield-account' },
  { title: 'Crown', value: 'mdi-crown' },
  { title: 'Star', value: 'mdi-star' },
  { title: 'Key', value: 'mdi-key' },
  { title: 'Badge', value: 'mdi-badge-account' }
]

const colorOptions = [
  { title: 'Primary', value: 'primary' },
  { title: 'Secondary', value: 'secondary' },
  { title: 'Success', value: 'success' },
  { title: 'Warning', value: 'warning' },
  { title: 'Error', value: 'error' },
  { title: 'Info', value: 'info' }
]

const rules = {
  required: value => !!value || 'This field is required'
}

const roles = ref([
  {
    id: 1,
    name: 'Super Administrator',
    description: 'Full system access with all permissions',
    icon: 'mdi-crown',
    color: 'error',
    usersCount: 2,
    permissionsCount: 48,
    active: true,
    default: true,
    keyPermissions: ['All Access', 'System Config', 'User Management']
  },
  {
    id: 2,
    name: 'Administrator',
    description: 'Administrative access to most system features',
    icon: 'mdi-shield-account',
    color: 'primary',
    usersCount: 5,
    permissionsCount: 35,
    active: true,
    default: true,
    keyPermissions: ['User Management', 'Content Management', 'Reports']
  },
  {
    id: 3,
    name: 'Manager',
    description: 'Can manage team members and view reports',
    icon: 'mdi-account-tie',
    color: 'info',
    usersCount: 12,
    permissionsCount: 22,
    active: true,
    default: false,
    keyPermissions: ['Team Management', 'Reports', 'Analytics']
  },
  {
    id: 4,
    name: 'Editor',
    description: 'Can create and edit content',
    icon: 'mdi-pencil',
    color: 'success',
    usersCount: 28,
    permissionsCount: 15,
    active: true,
    default: false,
    keyPermissions: ['Create Content', 'Edit Content', 'Media Upload']
  },
  {
    id: 5,
    name: 'Viewer',
    description: 'Read-only access to content',
    icon: 'mdi-eye',
    color: 'secondary',
    usersCount: 45,
    permissionsCount: 8,
    active: true,
    default: false,
    keyPermissions: ['View Content', 'View Reports']
  },
  {
    id: 6,
    name: 'Guest',
    description: 'Limited access for temporary users',
    icon: 'mdi-account-question',
    color: 'warning',
    usersCount: 10,
    permissionsCount: 5,
    active: false,
    default: false,
    keyPermissions: ['Basic Access', 'View Public']
  }
])

const filteredRoles = computed(() => {
  let filtered = [...roles.value]

  if (statusFilter.value === 'active') {
    filtered = filtered.filter(r => r.active)
  } else if (statusFilter.value === 'inactive') {
    filtered = filtered.filter(r => !r.active)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(r =>
      r.name.toLowerCase().includes(query) ||
      r.description.toLowerCase().includes(query)
    )
  }

  return filtered
})

const openCreateDialog = () => {
  editingRole.value = null
  roleData.value = {
    name: '',
    description: '',
    icon: 'mdi-account',
    color: 'primary',
    active: true
  }
  roleDialog.value = true
}

const editRole = (role) => {
  editingRole.value = role
  roleData.value = {
    name: role.name,
    description: role.description,
    icon: role.icon,
    color: role.color,
    active: role.active
  }
  roleDialog.value = true
}

const closeDialog = () => {
  roleDialog.value = false
  editingRole.value = null
  roleData.value = {
    name: '',
    description: '',
    icon: 'mdi-account',
    color: 'primary',
    active: true
  }
}

const saveRole = async () => {
  const { valid } = await roleForm.value.validate()
  if (!valid) return

  saving.value = true

  setTimeout(() => {
    if (editingRole.value) {
      Object.assign(editingRole.value, roleData.value)
    } else {
      roles.value.push({
        id: roles.value.length + 1,
        ...roleData.value,
        usersCount: 0,
        permissionsCount: 0,
        default: false,
        keyPermissions: []
      })
    }
    saving.value = false
    closeDialog()
  }, 500)
}

const viewPermissions = (role) => {
  router.push({ name: 'permissions', query: { roleId: role.id } })
}

const duplicateRole = (role) => {
  const newRole = {
    ...role,
    id: roles.value.length + 1,
    name: `${role.name} (Copy)`,
    usersCount: 0,
    default: false
  }
  roles.value.push(newRole)
}

const toggleStatus = (role) => {
  role.active = !role.active
}

const confirmDelete = (role) => {
  if (role.default) return
  roleToDelete.value = role
  deleteDialog.value = true
}

const deleteRole = () => {
  const index = roles.value.findIndex(r => r.id === roleToDelete.value.id)
  if (index !== -1) {
    roles.value.splice(index, 1)
  }
  deleteDialog.value = false
  roleToDelete.value = null
}
</script>

<style scoped>
.role-card-disabled {
  opacity: 0.6;
}

.gap-1 {
  gap: 4px;
}
</style>
