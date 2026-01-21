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
        <div class="text-h5">Users Management</div>
      </v-col>
      <v-col cols="12" md="4" class="text-end">
        <v-btn color="primary" variant="flat" @click="openCreateDialog">
          <v-icon left>mdi-plus</v-icon>Add New User
        </v-btn>
      </v-col>
    </v-row>

    <!-- Users Table -->
    <v-card class="pa-4">
      <v-data-table
        :headers="headers"
        :items="users"
        :loading="loading"
        class="elevation-0"
        @click:row="editUser"
      >
        <template #item.role="{ item }">
          <v-chip :color="getRoleColor(item.role?.name || item.role)" text-color="white" size="small">
            {{ item.role?.name || item.role }}
          </v-chip>
        </template>
        <template #item.actions="{ item }">
          <v-btn icon size="small" color="primary" @click.stop="editUser(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon size="small" color="error" @click.stop="deleteUserDialog(item)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Create/Edit User Dialog -->
    <v-dialog v-model="showDialog" max-width="600px">
      <v-card>
        <v-card-title class="text-h6 bg-primary text-white">
          {{ editingId ? 'Edit User' : 'Add New User' }}
        </v-card-title>
        <v-card-text class="pt-6">
          <!-- Dialog Error Messages -->
          <v-alert v-if="dialogError" type="error" closable class="mb-4" @click:close="dialogError = ''">
            {{ dialogError }}
          </v-alert>

          <v-row dense>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.name"
                label="Full Name"
                variant="outlined"
                density="comfortable"
                :error="!!formErrors.name"
                :error-messages="formErrors.name"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.email"
                label="Email"
                type="email"
                variant="outlined"
                density="comfortable"
                :error="!!formErrors.email"
                :error-messages="formErrors.email"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.firstName"
                label="First Name"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.lastName"
                label="Last Name"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.phone"
                label="Phone"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                v-model="form.role"
                label="Role"
                :items="roles"
                item-title="name"
                item-value="id"
                variant="outlined"
                density="comfortable"
                :error="!!formErrors.role"
                :error-messages="formErrors.role"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="form.address"
                label="Address"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col v-if="!editingId" cols="12">
              <v-text-field
                v-model="form.password"
                label="Password"
                type="password"
                variant="outlined"
                density="comfortable"
                hint="Minimum 6 characters"
                :error="!!formErrors.password"
                :error-messages="formErrors.password"
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="outlined" @click="closeDialog">Cancel</v-btn>
          <v-btn color="primary" variant="flat" @click="saveUser" :loading="savingUser">
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
          <p>Are you sure you want to delete <strong>{{ deleteUserName }}</strong>?</p>
          <p class="text-caption text-medium-emphasis">This action cannot be undone.</p>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="outlined" @click="showDeleteDialog = false">Cancel</v-btn>
          <v-btn color="error" variant="flat" @click="confirmDelete" :loading="deletingUser">
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
import { usersAPI } from '@/services/authService'

const { token } = useAuth()

const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Email', key: 'email' },
  { title: 'Phone', key: 'phone' },
  { title: 'Role', key: 'role' },
  { title: 'Actions', key: 'actions', sortable: false }
]

const users = ref([])
const roles = ref([])
const loading = ref(false)
const savingUser = ref(false)
const deletingUser = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const showDialog = ref(false)
const showDeleteDialog = ref(false)
const editingId = ref(null)
const deleteUserName = ref('')
const deleteUserId = ref(null)
const dialogError = ref('')

const form = ref({
  name: '',
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  phone: '',
  address: '',
  role: null
})

const formErrors = ref({
  name: '',
  email: '',
  password: '',
  role: ''
})

const fetchUsers = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    const response = await usersAPI.getAllUsers(token.value)
    users.value = response.users
  } catch (error) {
    errorMessage.value = error.message || 'Failed to load users'
    console.error('Fetch users error:', error)
  } finally {
    loading.value = false
  }
}

const fetchRoles = async () => {
  try {
    const response = await usersAPI.getAvailableRoles(token.value)
    console.log('Roles API Response:', response)
    roles.value = response.roles || []
    console.log('Roles value set to:', roles.value)
  } catch (error) {
    console.error('Fetch roles error:', error)
    errorMessage.value = 'Failed to load roles'
  }
}

const validateForm = () => {
  formErrors.value = { name: '', email: '', password: '', role: '' }

  if (!form.value.name) {
    formErrors.value.name = 'Full name is required'
  }

  if (!form.value.email) {
    formErrors.value.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    formErrors.value.email = 'Invalid email format'
  }

  if (!editingId.value) {
    if (!form.value.password) {
      formErrors.value.password = 'Password is required'
    } else if (form.value.password.length < 6) {
      formErrors.value.password = 'Password must be at least 6 characters'
    }
  }

  if (!form.value.role) {
    formErrors.value.role = 'Role is required'
  }

  return !Object.values(formErrors.value).some(error => error)
}

const openCreateDialog = () => {
  editingId.value = null
  form.value = {
    name: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    role: null
  }
  dialogError.value = ''
  showDialog.value = true
}

const editUser = (user) => {
  editingId.value = user.id
  form.value = {
    name: user.name,
    email: user.email,
    password: '',
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    phone: user.phone || '',
    address: user.address || '',
    role: user.role?.id || user.role
  }
  dialogError.value = ''
  showDialog.value = true
}

const saveUser = async () => {
  if (!validateForm()) {
    return
  }

  savingUser.value = true
  dialogError.value = ''

  const payload = {
    name: form.value.name,
    email: form.value.email,
    firstName: form.value.firstName,
    lastName: form.value.lastName,
    phone: form.value.phone,
    address: form.value.address,
    role: form.value.role
  }

  if (!editingId.value) {
    payload.password = form.value.password
  }

  try {
    if (editingId.value) {
      await usersAPI.updateUser(token.value, editingId.value, payload)
      successMessage.value = 'User updated successfully'
    } else {
      await usersAPI.createUser(token.value, payload)
      successMessage.value = 'User created successfully'
    }
    await fetchUsers()
    closeDialog()
  } catch (error) {
    dialogError.value = error.message || 'Failed to save user'
    console.error('Save user error:', error)
  } finally {
    savingUser.value = false
  }
}

const deleteUserDialog = (user) => {
  deleteUserId.value = user.id
  deleteUserName.value = user.name
  showDeleteDialog.value = true
}

const confirmDelete = async () => {
  deletingUser.value = true
  errorMessage.value = ''

  try {
    await usersAPI.deleteUser(token.value, deleteUserId.value)
    successMessage.value = 'User deleted successfully'
    await fetchUsers()
    showDeleteDialog.value = false
  } catch (error) {
    errorMessage.value = error.message || 'Failed to delete user'
    console.error('Delete user error:', error)
  } finally {
    deletingUser.value = false
  }
}

const closeDialog = () => {
  showDialog.value = false
  editingId.value = null
  form.value = {
    name: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    role: null
  }
  dialogError.value = ''
}

const getRoleColor = (role) => {
  const colors = {
    admin: 'red',
    moderator: 'orange',
    user: 'blue'
  }
  return colors[role] || 'grey'
}

onMounted(() => {
  if (token.value) {
    fetchUsers()
    fetchRoles()
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
