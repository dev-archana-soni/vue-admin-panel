<template>
  <v-container class="py-6" fluid>
    <!-- Loading State -->
    <v-progress-linear v-if="loading" indeterminate color="primary"></v-progress-linear>

    <!-- Success Message -->
    <v-alert v-if="successMessage" type="success" closable class="mb-4" @click:close="successMessage = ''">
      {{ successMessage }}
    </v-alert>

    <!-- Error Message -->
    <v-alert v-if="errorMessage" type="error" closable class="mb-4" @click:close="errorMessage = ''">
      {{ errorMessage }}
    </v-alert>

    <v-row class="mb-4">
      <v-col cols="12" md="8">
        <div class="d-flex align-center">
          <v-icon size="large" class="mr-3">mdi-shield-account</v-icon>
          <div class="text-h5">Roles Management</div>
        </div>
      </v-col>
      <v-col cols="12" md="4" class="text-end">
        <v-btn color="primary" variant="flat" @click="openCreateDialog">
          <v-icon left>mdi-plus</v-icon>Add New Role
        </v-btn>
      </v-col>
    </v-row>

    <!-- Roles Table -->
    <v-card class="pa-4">
      <v-data-table
        :headers="headers"
        :items="roles"
        :loading="loading"
        class="elevation-0"
      >
        <template #column.name="{ column }">
          <div class="d-flex align-center gap-2">
            <v-icon size="small">mdi-shield</v-icon>
            {{ column.title }}
          </div>
        </template>
        <template #column.description="{ column }">
          <div class="d-flex align-center gap-2">
            <v-icon size="small">mdi-information</v-icon>
            {{ column.title }}
          </div>
        </template>
        <template #column.isActive="{ column }">
          <div class="d-flex align-center gap-2">
            <v-icon size="small">mdi-check-circle</v-icon>
            {{ column.title }}
          </div>
        </template>
        <template #item.isActive="{ item }">
          <v-chip :color="item.isActive ? 'success' : 'grey'" text-color="white" size="small">
            {{ item.isActive ? 'Active' : 'Inactive' }}
          </v-chip>
        </template>
        <template #item.actions="{ item }">
          <v-btn icon size="small" color="primary" @click.stop="editRole(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon size="small" color="error" @click.stop="deleteRoleDialog(item)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Create/Edit Role Dialog -->
    <v-dialog v-model="showDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h6 bg-primary text-white">
          {{ editingId ? 'Edit Role' : 'Add New Role' }}
        </v-card-title>
        <v-card-text class="pt-6">
          <!-- Dialog Error Messages -->
          <v-alert v-if="dialogError" type="error" closable class="mb-4" @click:close="dialogError = ''">
            {{ dialogError }}
          </v-alert>

          <v-row dense>
            <v-col cols="12">
              <v-text-field
                v-model="form.name"
                label="Role Name"
                variant="outlined"
                density="comfortable"
                :error="!!formErrors.name"
                :error-messages="formErrors.name"
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="form.description"
                label="Description"
                variant="outlined"
                density="comfortable"
                rows="3"
              />
            </v-col>
            <v-col cols="12">
              <v-switch
                v-model="form.isActive"
                label="Active"
                color="primary"
                hide-details
              />
            </v-col>
            <v-col cols="12">
              <div class="text-subtitle-2 mb-2">Permissions</div>
              <v-expansion-panels>
                <v-expansion-panel v-for="module in modulesWithPermissions" :key="module.id">
                  <template #title>
                    <v-icon size="small" class="mr-2">{{ module.icon || 'mdi-puzzle' }}</v-icon>
                    <strong>{{ module.displayName }}</strong>
                  </template>
                  <v-expansion-panel-text>
                    <v-row dense>
                      <v-col v-for="perm in module.permissions" :key="perm.id" cols="12" sm="6">
                        <v-checkbox
                          v-model="form.permissions"
                          :label="perm.name"
                          :value="perm.id"
                          density="comfortable"
                          hide-details
                        />
                      </v-col>
                    </v-row>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="outlined" @click="closeDialog">Cancel</v-btn>
          <v-btn color="primary" variant="flat" @click="saveRole" :loading="savingRole">
            {{ editingId ? 'Update' : 'Create' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="showDeleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h6 bg-error text-white">Confirm Delete</v-card-title>
        <v-card-text class="pt-6">
          <p>Are you sure you want to delete role <strong>{{ deleteRoleName }}</strong>?</p>
          <p class="text-caption text-medium-emphasis">This action cannot be undone.</p>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="outlined" @click="showDeleteDialog = false">Cancel</v-btn>
          <v-btn color="error" variant="flat" @click="confirmDelete" :loading="deletingRole">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { rolesAPI, modulesAPI, permissionsAPI } from '@/services/authService'

const { token } = useAuth()

const headers = [
  { title: 'Role Name', key: 'name', icon: 'mdi-shield' },
  { title: 'Description', key: 'description', icon: 'mdi-information' },
  { title: 'Status', key: 'isActive', icon: 'mdi-check-circle' },
  { title: 'Actions', key: 'actions', sortable: false }
]

const roles = ref([])
const modules = ref([])
const modulesWithPermissions = ref([])
const loading = ref(false)
const savingRole = ref(false)
const deletingRole = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const showDialog = ref(false)
const showDeleteDialog = ref(false)
const editingId = ref(null)
const deleteRoleName = ref('')
const deleteRoleId = ref(null)
const dialogError = ref('')

const form = ref({
  name: '',
  description: '',
  isActive: true,
  permissions: []
})

const formErrors = ref({
  name: ''
})

const fetchRoles = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    const response = await rolesAPI.getAllRoles(token.value)
    roles.value = response.roles
  } catch (error) {
    errorMessage.value = error.message || 'Failed to load roles'
    console.error('Fetch roles error:', error)
  } finally {
    loading.value = false
  }
}

const fetchModulesAndPermissions = async () => {
  try {
    const modulesResponse = await modulesAPI.getAllModules(token.value)
    const permissionsResponse = await permissionsAPI.getAllPermissions(token.value)
    
    modules.value = modulesResponse.modules
    const permissions = permissionsResponse.permissions
    
    // Group permissions by module
    modulesWithPermissions.value = modules.value.map(module => ({
      ...module,
      permissions: permissions.filter(p => p.module?.id === module.id)
    }))
  } catch (error) {
    console.error('Fetch modules/permissions error:', error)
  }
}

const validateForm = () => {
  formErrors.value = { name: '' }

  if (!form.value.name) {
    formErrors.value.name = 'Role name is required'
  }

  return !Object.values(formErrors.value).some(error => error)
}

const openCreateDialog = () => {
  editingId.value = null
  form.value = {
    name: '',
    description: '',
    isActive: true,
    permissions: []
  }
  dialogError.value = ''
  showDialog.value = true
}

const editRole = (role) => {
  editingId.value = role.id
  form.value = {
    name: role.name,
    description: role.description || '',
    isActive: role.isActive,
    permissions: role.permissions || []
  }
  dialogError.value = ''
  showDialog.value = true
}

const saveRole = async () => {
  if (!validateForm()) {
    return
  }

  savingRole.value = true
  dialogError.value = ''

  try {
    if (editingId.value) {
      await rolesAPI.updateRole(token.value, editingId.value, form.value)
      successMessage.value = 'Role updated successfully'
    } else {
      await rolesAPI.createRole(token.value, form.value)
      successMessage.value = 'Role created successfully'
    }
    await fetchRoles()
    closeDialog()
  } catch (error) {
    dialogError.value = error.message || 'Failed to save role'
    console.error('Save role error:', error)
  } finally {
    savingRole.value = false
  }
}

const deleteRoleDialog = (role) => {
  deleteRoleId.value = role.id
  deleteRoleName.value = role.name
  showDeleteDialog.value = true
}

const confirmDelete = async () => {
  deletingRole.value = true
  errorMessage.value = ''

  try {
    await rolesAPI.deleteRole(token.value, deleteRoleId.value)
    successMessage.value = 'Role deleted successfully'
    await fetchRoles()
    showDeleteDialog.value = false
  } catch (error) {
    errorMessage.value = error.message || 'Failed to delete role'
    console.error('Delete role error:', error)
  } finally {
    deletingRole.value = false
  }
}

const closeDialog = () => {
  showDialog.value = false
  editingId.value = null
  form.value = {
    name: '',
    description: '',
    isActive: true,
    permissions: []
  }
  dialogError.value = ''
}

onMounted(() => {
  if (token.value) {
    fetchRoles()
    fetchModulesAndPermissions()
  }
})
</script>

<style scoped>
:deep(.v-data-table) {
  cursor: pointer;
}

:deep(.v-data-table tbody tr:hover) {
  background-color: rgba(0, 0, 0, 0.02) !important;
}
</style>
