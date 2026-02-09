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
      <v-col cols="12" md="6">
        <div class="d-flex align-center">
          <v-icon size="large" class="mr-3">mdi-lock-multiple</v-icon>
          <div class="text-h5">Modules & Permissions</div>
        </div>
      </v-col>
      <v-col cols="12" md="6" class="text-end">
        <v-btn color="primary" variant="flat" @click="showModuleDialog = true" class="mr-2">
          <v-icon left>mdi-plus</v-icon>Add Module
        </v-btn>
        <v-btn color="success" variant="flat" @click="showPermissionDialog = true">
          <v-icon left>mdi-plus</v-icon>Add Permission
        </v-btn>
      </v-col>
    </v-row>

    <!-- Modules & Permissions Table -->
    <v-card class="pa-4">
      <v-expansion-panels>
        <v-expansion-panel v-for="module in modules" :key="module.id">
          <template #title>
            <div class="d-flex align-center justify-space-between w-100">
              <div class="d-flex align-center flex-grow-1">
                <v-icon size="small" class="mr-2">{{ module.icon || 'mdi-puzzle' }}</v-icon>
                <strong>{{ module.displayName }}</strong>
                <v-chip v-if="!module.isActive" size="small" color="grey" text-color="white" class="ml-2">
                  Inactive
                </v-chip>
              </div>
              <div class="d-flex gap-2" @click.stop>
                <v-btn icon size="x-small" color="primary" @click.stop="editModule(module)" variant="text">
                  <v-icon size="small">mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon size="x-small" color="error" @click.stop="deleteModuleDialog(module)" variant="text">
                  <v-icon size="small">mdi-delete</v-icon>
                </v-btn>
              </div>
            </div>
          </template>
          <v-expansion-panel-text>
            <v-divider class="mb-4"></v-divider>
            <div class="text-subtitle-2 mb-2">Permissions in this module:</div>
            <v-row dense>
              <v-col v-if="getModulePermissions(module.id).length === 0" cols="12">
                <p class="text-medium-emphasis">No permissions in this module</p>
              </v-col>
              <v-col v-for="perm in getModulePermissions(module.id)" :key="perm.id" cols="12" sm="6" md="4">
                <v-card variant="outlined" class="pa-2">
                  <div class="d-flex justify-space-between align-center">
                    <div>
                      <strong>{{ perm.name }}</strong>
                      <p class="text-caption text-medium-emphasis mt-1">{{ perm.description }}</p>
                      <v-chip 
                        v-if="perm.isActive" 
                        size="small" 
                        color="success" 
                        text-color="white"
                      >
                        Active
                      </v-chip>
                      <v-chip 
                        v-else 
                        size="small" 
                        color="grey" 
                        text-color="white"
                      >
                        Inactive
                      </v-chip>
                    </div>
                    <div>
                      <v-btn icon size="x-small" color="primary" @click="editPermission(perm)">
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>
                      <v-btn icon size="x-small" color="error" @click="deletePermissionDialog(perm)">
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </div>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>

    <!-- Create/Edit Module Dialog -->
    <v-dialog v-model="showModuleDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h6 bg-primary text-white">
          {{ editingModuleId ? 'Edit Module' : 'Add New Module' }}
        </v-card-title>
        <v-card-text class="pt-6">
          <v-alert v-if="moduleDialogError" type="error" closable class="mb-4" @click:close="moduleDialogError = ''">
            {{ moduleDialogError }}
          </v-alert>

          <v-row dense>
            <v-col cols="12">
              <v-text-field
                v-model="moduleForm.name"
                label="Module Name"
                placeholder="e.g. users"
                variant="outlined"
                density="comfortable"
                :error="!!moduleFormErrors.name"
                :error-messages="moduleFormErrors.name"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="moduleForm.displayName"
                label="Display Name"
                placeholder="e.g. Users"
                variant="outlined"
                density="comfortable"
                :error="!!moduleFormErrors.displayName"
                :error-messages="moduleFormErrors.displayName"
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="moduleForm.description"
                label="Description"
                variant="outlined"
                density="comfortable"
                rows="2"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="moduleForm.icon"
                label="Icon"
                placeholder="e.g. mdi-account-multiple"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12">
              <v-switch
                v-model="moduleForm.isActive"
                label="Active"
                color="primary"
                hide-details
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="outlined" @click="closeModuleDialog">Cancel</v-btn>
          <v-btn color="primary" variant="flat" @click="saveModule" :loading="savingModule">
            {{ editingModuleId ? 'Update' : 'Create' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Create/Edit Permission Dialog -->
    <v-dialog v-model="showPermissionDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h6 bg-success text-white">
          {{ editingPermissionId ? 'Edit Permission' : 'Add New Permission' }}
        </v-card-title>
        <v-card-text class="pt-6">
          <v-alert v-if="permDialogError" type="error" closable class="mb-4" @click:close="permDialogError = ''">
            {{ permDialogError }}
          </v-alert>

          <v-row dense>
            <v-col cols="12">
              <v-select
                v-model="permForm.module"
                label="Module"
                :items="modules"
                item-title="displayName"
                item-value="id"
                variant="outlined"
                density="comfortable"
                :error="!!permFormErrors.module"
                :error-messages="permFormErrors.module"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="permForm.name"
                label="Permission Name"
                placeholder="e.g. users.view"
                variant="outlined"
                density="comfortable"
                :error="!!permFormErrors.name"
                :error-messages="permFormErrors.name"
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="permForm.description"
                label="Description"
                variant="outlined"
                density="comfortable"
                rows="2"
              />
            </v-col>
            <v-col cols="12">
              <v-switch
                v-model="permForm.isActive"
                label="Active"
                color="primary"
                hide-details
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="outlined" @click="closePermissionDialog">Cancel</v-btn>
          <v-btn color="success" variant="flat" @click="savePermission" :loading="savingPermission">
            {{ editingPermissionId ? 'Update' : 'Create' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Module Confirmation -->
    <v-dialog v-model="showDeleteModuleDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h6 bg-error text-white">Confirm Delete Module</v-card-title>
        <v-card-text class="pt-6">
          <p>Are you sure you want to delete module <strong>{{ deleteModuleName }}</strong>?</p>
          <p class="text-caption text-medium-emphasis">This will also delete all permissions in this module.</p>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="outlined" @click="showDeleteModuleDialog = false">Cancel</v-btn>
          <v-btn color="error" variant="flat" @click="confirmDeleteModule" :loading="deletingModule">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Permission Confirmation -->
    <v-dialog v-model="showDeletePermDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h6 bg-error text-white">Confirm Delete Permission</v-card-title>
        <v-card-text class="pt-6">
          <p>Are you sure you want to delete permission <strong>{{ deletePermName }}</strong>?</p>
          <p class="text-caption text-medium-emphasis">This action cannot be undone.</p>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="outlined" @click="showDeletePermDialog = false">Cancel</v-btn>
          <v-btn color="error" variant="flat" @click="confirmDeletePermission" :loading="deletingPermission">
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
import { modulesAPI, permissionsAPI } from '@/services/authService'

const { token } = useAuth()

const modules = ref([])
const permissions = ref([])
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// Module management
const showModuleDialog = ref(false)
const showDeleteModuleDialog = ref(false)
const editingModuleId = ref(null)
const deleteModuleId = ref(null)
const deleteModuleName = ref('')
const savingModule = ref(false)
const deletingModule = ref(false)
const moduleDialogError = ref('')

const moduleForm = ref({
  name: '',
  displayName: '',
  description: '',
  icon: '',
  isActive: true
})

const moduleFormErrors = ref({
  name: '',
  displayName: ''
})

// Permission management
const showPermissionDialog = ref(false)
const showDeletePermDialog = ref(false)
const editingPermissionId = ref(null)
const deletePermissionId = ref(null)
const deletePermName = ref('')
const savingPermission = ref(false)
const deletingPermission = ref(false)
const permDialogError = ref('')

const permForm = ref({
  name: '',
  module: null,
  description: '',
  isActive: true
})

const permFormErrors = ref({
  name: '',
  module: ''
})

const fetchModules = async () => {
  try {
    const response = await modulesAPI.getAllModules(token.value)
    modules.value = response.modules
    console.log('Modules loaded:', modules.value)
  } catch (error) {
    console.error('Fetch modules error:', error)
    errorMessage.value = error.message || 'Failed to load modules'
  }
}

const fetchPermissions = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    const response = await permissionsAPI.getAllPermissions(token.value)
    permissions.value = response.permissions
    console.log('Permissions loaded:', permissions.value)
  } catch (error) {
    errorMessage.value = error.message || 'Failed to load permissions'
    console.error('Fetch permissions error:', error)
  } finally {
    loading.value = false
  }
}

const getModulePermissions = (moduleId) => {
  // console.log('Getting permissions for module:', moduleId)
  const filtered = permissions.value.filter(p => {
    // console.log('Checking permission:', p.name, 'module ID:', p.module?.id, 'against:', moduleId)
    return p.module?.id === moduleId
  })
  // console.log('Filtered permissions:', filtered)
  return filtered
}

const validateModuleForm = () => {
  moduleFormErrors.value = { name: '', displayName: '' }

  if (!moduleForm.value.name) {
    moduleFormErrors.value.name = 'Module name is required'
  }

  if (!moduleForm.value.displayName) {
    moduleFormErrors.value.displayName = 'Display name is required'
  }

  return !Object.values(moduleFormErrors.value).some(error => error)
}

const validatePermissionForm = () => {
  permFormErrors.value = { name: '', module: '' }

  if (!permForm.value.name) {
    permFormErrors.value.name = 'Permission name is required'
  }

  if (!permForm.value.module) {
    permFormErrors.value.module = 'Module is required'
  }

  return !Object.values(permFormErrors.value).some(error => error)
}

const editModule = (module) => {
  editingModuleId.value = module.id
  moduleForm.value = {
    name: module.name,
    displayName: module.displayName,
    description: module.description || '',
    icon: module.icon || '',
    isActive: module.isActive
  }
  moduleDialogError.value = ''
  showModuleDialog.value = true
}

const saveModule = async () => {
  if (!validateModuleForm()) return

  savingModule.value = true
  moduleDialogError.value = ''

  try {
    if (editingModuleId.value) {
      await modulesAPI.updateModule(token.value, editingModuleId.value, moduleForm.value)
      successMessage.value = 'Module updated successfully'
    } else {
      await modulesAPI.createModule(token.value, moduleForm.value)
      successMessage.value = 'Module created successfully'
    }
    await fetchModules()
    closeModuleDialog()
  } catch (error) {
    moduleDialogError.value = error.message || 'Failed to save module'
  } finally {
    savingModule.value = false
  }
}

const closeModuleDialog = () => {
  showModuleDialog.value = false
  editingModuleId.value = null
  moduleForm.value = {
    name: '',
    displayName: '',
    description: '',
    icon: '',
    isActive: true
  }
  moduleDialogError.value = ''
}

const deleteModuleDialog = (module) => {
  deleteModuleId.value = module.id
  deleteModuleName.value = module.displayName
  showDeleteModuleDialog.value = true
}

const confirmDeleteModule = async () => {
  deletingModule.value = true
  errorMessage.value = ''

  try {
    await modulesAPI.deleteModule(token.value, deleteModuleId.value)
    successMessage.value = 'Module deleted successfully'
    await fetchModules()
    await fetchPermissions()
    showDeleteModuleDialog.value = false
  } catch (error) {
    errorMessage.value = error.message || 'Failed to delete module'
  } finally {
    deletingModule.value = false
  }
}

const editPermission = (perm) => {
  editingPermissionId.value = perm.id
  permForm.value = {
    name: perm.name,
    module: perm.module?.id,
    description: perm.description || '',
    isActive: perm.isActive
  }
  permDialogError.value = ''
  showPermissionDialog.value = true
}

const savePermission = async () => {
  if (!validatePermissionForm()) return

  savingPermission.value = true
  permDialogError.value = ''

  try {
    if (editingPermissionId.value) {
      await permissionsAPI.updatePermission(token.value, editingPermissionId.value, permForm.value)
      successMessage.value = 'Permission updated successfully'
    } else {
      await permissionsAPI.createPermission(token.value, permForm.value)
      successMessage.value = 'Permission created successfully'
    }
    await fetchPermissions()
    closePermissionDialog()
  } catch (error) {
    permDialogError.value = error.message || 'Failed to save permission'
  } finally {
    savingPermission.value = false
  }
}

const closePermissionDialog = () => {
  showPermissionDialog.value = false
  editingPermissionId.value = null
  permForm.value = {
    name: '',
    module: null,
    description: '',
    isActive: true
  }
  permDialogError.value = ''
}

const deletePermissionDialog = (perm) => {
  deletePermissionId.value = perm.id
  deletePermName.value = perm.name
  showDeletePermDialog.value = true
}

const confirmDeletePermission = async () => {
  deletingPermission.value = true
  errorMessage.value = ''

  try {
    await permissionsAPI.deletePermission(token.value, deletePermissionId.value)
    successMessage.value = 'Permission deleted successfully'
    await fetchPermissions()
    showDeletePermDialog.value = false
  } catch (error) {
    errorMessage.value = error.message || 'Failed to delete permission'
  } finally {
    deletingPermission.value = false
  }
}

onMounted(() => {
  if (token.value) {
    fetchModules()
    fetchPermissions()
  }
})
</script>

<style scoped>
:deep(.v-expansion-panel) {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

:deep(.v-expansion-panel__title) {
  padding: 0 !important;
}

.d-flex.align-center.justify-space-between {
  width: 100%;
  padding: 12px 16px;
}

.gap-2 {
  gap: 8px;
}

/* Show buttons on hover */
.v-expansion-panel:hover .d-flex.gap-2 {
  opacity: 1;
}
</style>
