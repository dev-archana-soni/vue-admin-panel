<template>
  <v-container class="py-6" fluid>
    <v-progress-linear v-if="loading" indeterminate color="primary" />

    <v-alert v-if="successMessage" type="success" closable class="mb-4" @click:close="successMessage = ''">
      {{ successMessage }}
    </v-alert>

    <v-alert v-if="errorMessage" type="error" closable class="mb-4" @click:close="errorMessage = ''">
      {{ errorMessage }}
    </v-alert>

    <v-row class="mb-4">
      <v-col cols="12" md="8">
        <div class="d-flex align-center">
          <v-icon size="large" class="mr-3">mdi-package-variant-closed</v-icon>
          <div>
            <div class="text-h5">Products Management</div>
            <div class="text-caption text-medium-emphasis">Manage product catalog and stock</div>
          </div>
        </div>
      </v-col>
      <v-col cols="12" md="4" class="text-end">
        <v-btn color="primary" variant="flat" @click="openCreateDialog">
          <v-icon left>mdi-plus</v-icon>Add Product
        </v-btn>
      </v-col>
    </v-row>

    <v-card class="pa-4">
      <v-data-table
        :headers="headers"
        :items="products"
        :loading="loading"
        class="elevation-0"
      >
        <template #item.image="{ item }">
          <v-avatar size="36" rounded>
            <v-img v-if="item.images?.length" :src="item.images[0].url" />
            <v-icon v-else color="grey">mdi-image-off</v-icon>
          </v-avatar>
        </template>
        <template #item.price="{ item }">
          <span class="font-weight-bold text-success">₹{{ Number(item.price || 0).toFixed(2) }}</span>
        </template>
        <template #item.stock="{ item }">
          <v-chip size="small" color="info" variant="flat">
            {{ item.stock }}
          </v-chip>
        </template>
        <template #item.category="{ item }">
          <v-chip v-if="item.category" size="small" color="primary" variant="flat">
            {{ item.category?.name || 'N/A' }}
          </v-chip>
          <span v-else class="text-grey">No Category</span>
        </template>
        <template #item.actions="{ item }">
          <v-btn icon size="small" color="primary" @click.stop="openEditDialog(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon size="small" color="error" @click.stop="openDeleteDialog(item)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" max-width="720px" persistent>
      <v-card>
        <v-card-title class="text-h6 bg-primary text-white pa-4">
          {{ isEditMode ? 'Edit Product' : 'Add Product' }}
        </v-card-title>
        <v-card-text class="pt-6 px-6">
          <v-alert v-if="dialogError" type="error" closable class="mb-4" @click:close="dialogError = ''">
            {{ dialogError }}
          </v-alert>

          <v-row dense>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.name"
                label="Name *"
                variant="outlined"
                density="comfortable"
                :error="!!formErrors.name"
                :error-messages="formErrors.name"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.sku"
                label="SKU *"
                variant="outlined"
                density="comfortable"
                :error="!!formErrors.sku"
                :error-messages="formErrors.sku"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.price"
                label="Price *"
                type="number"
                variant="outlined"
                density="comfortable"
                prefix="₹"
                :error="!!formErrors.price"
                :error-messages="formErrors.price"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.stock"
                label="Stock *"
                type="number"
                variant="outlined"
                density="comfortable"
                :error="!!formErrors.stock"
                :error-messages="formErrors.stock"
              />
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="form.category"
                :items="categories"
                item-title="name"
                item-value="id"
                label="Category *"
                variant="outlined"
                density="comfortable"
                :error="!!formErrors.category"
                :error-messages="formErrors.category"
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
              <v-file-input
                v-model="form.images"
                label="Images"
                multiple
                show-size
                variant="outlined"
                density="comfortable"
                accept="image/*"
              />
            </v-col>
            <v-col cols="12" v-if="isEditMode && existingImages.length">
              <div class="text-caption text-medium-emphasis mb-2">Existing Images</div>
              <div class="d-flex flex-wrap" style="gap: 8px;">
                <v-avatar v-for="image in existingImages" :key="image.url" size="56" rounded>
                  <v-img :src="image.url" />
                </v-avatar>
              </div>
            </v-col>
            <v-col cols="12" v-if="isEditMode && existingImages.length">
              <v-switch
                v-model="form.replaceImages"
                label="Replace existing images with newly uploaded files"
                color="primary"
                inset
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="outlined" @click="closeDialog" :disabled="saving">
            Cancel
          </v-btn>
          <v-btn color="primary" variant="flat" @click="saveProduct" :loading="saving">
            {{ isEditMode ? 'Update Product' : 'Create Product' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h6 bg-error text-white">Confirm Delete</v-card-title>
        <v-card-text class="pt-6">
          <p>Are you sure you want to delete <strong>{{ deleteProductName }}</strong>?</p>
          <p class="text-caption text-medium-emphasis">This action cannot be undone.</p>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="outlined" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="error" variant="flat" @click="confirmDelete" :loading="deleting">
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
import { productsAPI, categoriesAPI } from '@/services/authService'

const { token } = useAuth()

const headers = [
  { title: 'Image', key: 'image', sortable: false },
  { title: 'Name', key: 'name' },
  { title: 'SKU', key: 'sku' },
  { title: 'Price', key: 'price' },
  { title: 'Stock', key: 'stock' },
  { title: 'Category', key: 'category' },
  { title: 'Actions', key: 'actions', sortable: false }
]

const products = ref([])
const categories = ref([])
const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const dialog = ref(false)
const deleteDialog = ref(false)
const isEditMode = ref(false)
const dialogError = ref('')
const deleteProductName = ref('')
const deleteProductId = ref(null)
const existingImages = ref([])

const form = ref({
  id: null,
  name: '',
  sku: '',
  price: 0,
  stock: 0,
  category: null,
  description: '',
  images: [],
  replaceImages: false
})

const formErrors = ref({
  name: '',
  sku: '',
  price: '',
  stock: '',
  category: ''
})

const fetchProducts = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    const response = await productsAPI.getAllProducts(token.value)
    products.value = response.products || []
  } catch (error) {
    errorMessage.value = error.message || 'Failed to load products'
    console.error('Fetch products error:', error)
  } finally {
    loading.value = false
  }
}

const fetchCategories = async () => {
  try {
    const response = await categoriesAPI.getAllCategories(token.value)
    categories.value = response.categories || []
  } catch (error) {
    errorMessage.value = error.message || 'Failed to load categories'
    console.error('Fetch categories error:', error)
  }
}

const resetForm = () => {
  form.value = {
    id: null,
    name: '',
    sku: '',
    price: 0,
    stock: 0,
    category: null,
    description: '',
    images: [],
    replaceImages: false
  }
  existingImages.value = []
  formErrors.value = { name: '', sku: '', price: '', stock: '', category: '' }
  dialogError.value = ''
}

const openCreateDialog = () => {
  isEditMode.value = false
  resetForm()
  dialog.value = true
}

const openEditDialog = (product) => {
  isEditMode.value = true
  form.value = {
    id: product.id,
    name: product.name,
    sku: product.sku,
    price: product.price,
    stock: product.stock,
    category: product.category?.id || null,
    description: product.description || '',
    images: [],
    replaceImages: false
  }
  existingImages.value = product.images || []
  formErrors.value = { name: '', sku: '', price: '', stock: '', category: '' }
  dialogError.value = ''
  dialog.value = true
}

const closeDialog = () => {
  dialog.value = false
  resetForm()
}

const validateForm = () => {
  formErrors.value = { name: '', sku: '', price: '', stock: '', category: '' }
  let valid = true

  if (!form.value.name) {
    formErrors.value.name = 'Name is required'
    valid = false
  }

  if (!form.value.sku) {
    formErrors.value.sku = 'SKU is required'
    valid = false
  }

  if (form.value.price === '' || Number(form.value.price) < 0) {
    formErrors.value.price = 'Valid price is required'
    valid = false
  }

  if (form.value.stock === '' || Number(form.value.stock) < 0) {
    formErrors.value.stock = 'Valid stock is required'
    valid = false
  }

  if (!form.value.category) {
    formErrors.value.category = 'Category is required'
    valid = false
  }

  return valid
}

const buildPayload = () => {
  const payload = new FormData()
  payload.append('name', form.value.name)
  payload.append('sku', form.value.sku)
  payload.append('price', form.value.price)
  payload.append('stock', form.value.stock)
  payload.append('category', form.value.category)
  payload.append('description', form.value.description || '')
  if (isEditMode.value) {
    payload.append('replaceImages', form.value.replaceImages ? '1' : '0')
  }
  form.value.images.forEach((file) => payload.append('images', file))
  return payload
}

const saveProduct = async () => {
  if (!validateForm()) return

  saving.value = true
  dialogError.value = ''
  successMessage.value = ''

  try {
    const payload = buildPayload()
    if (isEditMode.value) {
      await productsAPI.updateProduct(token.value, form.value.id, payload)
      successMessage.value = 'Product updated successfully'
    } else {
      await productsAPI.createProduct(token.value, payload)
      successMessage.value = 'Product created successfully'
    }
    dialog.value = false
    await fetchProducts()
    resetForm()
  } catch (error) {
    dialogError.value = error.message || 'Failed to save product'
    console.error('Save product error:', error)
  } finally {
    saving.value = false
  }
}

const openDeleteDialog = (product) => {
  deleteProductName.value = product.name
  deleteProductId.value = product.id
  deleteDialog.value = true
}

const confirmDelete = async () => {
  if (!deleteProductId.value) return
  deleting.value = true
  try {
    await productsAPI.deleteProduct(token.value, deleteProductId.value)
    successMessage.value = 'Product deleted successfully'
    await fetchProducts()
  } catch (error) {
    errorMessage.value = error.message || 'Failed to delete product'
    console.error('Delete product error:', error)
  } finally {
    deleteDialog.value = false
    deleteProductId.value = null
    deleting.value = false
  }
}

onMounted(() => {
  fetchProducts()
  fetchCategories()
})
</script>
