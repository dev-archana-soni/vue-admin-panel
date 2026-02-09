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
          <v-icon size="large" class="mr-3">mdi-shape</v-icon>
          <div>
            <div class="text-h5">Categories Management</div>
            <div class="text-caption text-medium-emphasis">Manage income and expense categories</div>
          </div>
        </div>
      </v-col>
      <v-col cols="12" md="4" class="text-end">
        <v-btn color="primary" variant="flat" @click="openCreateDialog">
          <v-icon left>mdi-plus</v-icon>Add New Category
        </v-btn>
      </v-col>
    </v-row>

    <!-- Categories Table -->
    <v-card class="pa-4">
      <v-data-table
        :headers="headers"
        :items="categories"
        :loading="loading"
        class="elevation-0"
      >
        <template #item.icon="{ item }">
          <v-avatar :color="item.color" size="32">
            <v-icon color="white">{{ item.icon }}</v-icon>
          </v-avatar>
        </template>
        <template #item.type="{ item }">
          <v-chip :color="item.type === 'income' ? 'success' : 'error'" text-color="white" size="small">
            {{ item.type }}
          </v-chip>
        </template>
        <template #item.isActive="{ item }">
          <v-chip :color="item.isActive ? 'success' : 'grey'" text-color="white" size="small">
            {{ item.isActive ? 'Active' : 'Inactive' }}
          </v-chip>
        </template>
        <template #item.actions="{ item }">
          <v-btn icon size="small" color="primary" @click.stop="editCategory(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon size="small" color="error" @click.stop="deleteCategoryDialog(item)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Create/Edit Category Dialog -->
    <v-dialog v-model="showDialog" max-width="600px" persistent>
      <v-card>
        <v-card-title class="text-h6 bg-primary text-white pa-4">
          {{ editingId ? 'Edit Category' : 'Add New Category' }}
        </v-card-title>
        <v-card-text class="pt-6 px-6">
          <!-- Dialog Error Messages -->
          <v-alert v-if="dialogError" type="error" closable class="mb-4" @click:close="dialogError = ''">
            {{ dialogError }}
          </v-alert>

          <v-row dense>
            <v-col cols="12">
              <v-text-field
                v-model="form.name"
                label="Category Name *"
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
                rows="2"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                v-model="form.type"
                label="Type *"
                :items="['income', 'expense']"
                variant="outlined"
                density="comfortable"
                :error="!!formErrors.type"
                :error-messages="formErrors.type"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                v-model="form.isActive"
                label="Status"
                :items="[{ title: 'Active', value: true }, { title: 'Inactive', value: false }]"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                v-model="form.icon"
                label="Icon"
                :items="iconOptions"
                variant="outlined"
                density="comfortable"
              >
                <template #item="{ item, props }">
                  <v-list-item v-bind="props">
                    <template #prepend>
                      <v-icon>{{ item.value }}</v-icon>
                    </template>
                  </v-list-item>
                </template>
                <template #selection="{ item }">
                  <v-icon class="mr-2">{{ item.value }}</v-icon>
                  {{ item.title }}
                </template>
              </v-select>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.color"
                label="Color"
                variant="outlined"
                density="comfortable"
                type="color"
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="outlined" @click="closeDialog" :disabled="savingCategory">
            Cancel
          </v-btn>
          <v-btn color="primary" variant="flat" @click="saveCategory" :loading="savingCategory">
            {{ editingId ? 'Update Category' : 'Create Category' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="showDeleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h6 bg-error text-white">Confirm Delete</v-card-title>
        <v-card-text class="pt-6">
          <p>Are you sure you want to delete <strong>{{ deleteCategoryName }}</strong>?</p>
          <p class="text-caption text-medium-emphasis">This action cannot be undone.</p>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="outlined" @click="showDeleteDialog = false">Cancel</v-btn>
          <v-btn color="error" variant="flat" @click="confirmDelete" :loading="deletingCategory">
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
import { categoriesAPI } from '@/services/authService'

const { token } = useAuth()

const headers = [
  { title: 'Icon', key: 'icon', sortable: false },
  { title: 'Name', key: 'name' },
  { title: 'Description', key: 'description' },
  { title: 'Type', key: 'type' },
  { title: 'Status', key: 'isActive' },
  { title: 'Actions', key: 'actions', sortable: false }
]

const iconOptions = [
  { title: 'Tag', value: 'mdi-tag' },
  { title: 'Food', value: 'mdi-food' },
  { title: 'Shopping', value: 'mdi-cart' },
  { title: 'Transport', value: 'mdi-car' },
  { title: 'Home', value: 'mdi-home' },
  { title: 'Health', value: 'mdi-hospital' },
  { title: 'Entertainment', value: 'mdi-movie' },
  { title: 'Education', value: 'mdi-school' },
  { title: 'Bills', value: 'mdi-file-document' },
  { title: 'Salary', value: 'mdi-cash' },
  { title: 'Gift', value: 'mdi-gift' },
  { title: 'Investment', value: 'mdi-chart-line' }
]

const categories = ref([])
const loading = ref(false)
const savingCategory = ref(false)
const deletingCategory = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const showDialog = ref(false)
const showDeleteDialog = ref(false)
const editingId = ref(null)
const deleteCategoryName = ref('')
const deleteCategoryId = ref(null)
const dialogError = ref('')

const form = ref({
  name: '',
  description: '',
  type: 'expense',
  icon: 'mdi-tag',
  color: '#2196F3',
  isActive: true
})

const formErrors = ref({
  name: '',
  type: ''
})

const fetchCategories = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    const response = await categoriesAPI.getAllCategories(token.value)
    categories.value = response.categories
  } catch (error) {
    errorMessage.value = error.message || 'Failed to load categories'
    console.error('Fetch categories error:', error)
  } finally {
    loading.value = false
  }
}

const validateForm = () => {
  formErrors.value = { name: '', type: '' }

  if (!form.value.name) {
    formErrors.value.name = 'Category name is required'
  }

  if (!form.value.type) {
    formErrors.value.type = 'Type is required'
  }

  return !Object.values(formErrors.value).some(error => error)
}

const openCreateDialog = () => {
  editingId.value = null
  form.value = {
    name: '',
    description: '',
    type: 'expense',
    icon: 'mdi-tag',
    color: '#2196F3',
    isActive: true
  }
  dialogError.value = ''
  showDialog.value = true
}

const editCategory = (category) => {
  editingId.value = category.id
  form.value = {
    name: category.name,
    description: category.description || '',
    type: category.type,
    icon: category.icon || 'mdi-tag',
    color: category.color || '#2196F3',
    isActive: category.isActive
  }
  dialogError.value = ''
  showDialog.value = true
}

const saveCategory = async () => {
  if (!validateForm()) {
    return
  }

  savingCategory.value = true
  dialogError.value = ''

  const payload = {
    name: form.value.name,
    description: form.value.description,
    type: form.value.type,
    icon: form.value.icon,
    color: form.value.color,
    isActive: form.value.isActive
  }

  try {
    if (editingId.value) {
      await categoriesAPI.updateCategory(token.value, editingId.value, payload)
      successMessage.value = 'Category updated successfully'
    } else {
      await categoriesAPI.createCategory(token.value, payload)
      successMessage.value = 'Category created successfully'
    }
    await fetchCategories()
    closeDialog()
  } catch (error) {
    dialogError.value = error.message || 'Failed to save category'
    console.error('Save category error:', error)
  } finally {
    savingCategory.value = false
  }
}

const deleteCategoryDialog = (category) => {
  deleteCategoryId.value = category.id
  deleteCategoryName.value = category.name
  showDeleteDialog.value = true
}

const confirmDelete = async () => {
  deletingCategory.value = true
  errorMessage.value = ''

  try {
    await categoriesAPI.deleteCategory(token.value, deleteCategoryId.value)
    successMessage.value = 'Category deleted successfully'
    await fetchCategories()
    showDeleteDialog.value = false
  } catch (error) {
    errorMessage.value = error.message || 'Failed to delete category'
    console.error('Delete category error:', error)
  } finally {
    deletingCategory.value = false
  }
}

const closeDialog = () => {
  showDialog.value = false
  editingId.value = null
  form.value = {
    name: '',
    description: '',
    type: 'expense',
    icon: 'mdi-tag',
    color: '#2196F3',
    isActive: true
  }
  dialogError.value = ''
}

onMounted(() => {
  if (token.value) {
    fetchCategories()
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
