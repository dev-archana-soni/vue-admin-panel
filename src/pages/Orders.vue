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
          <v-icon size="large" class="mr-3">mdi-receipt-text</v-icon>
          <div>
            <div class="text-h5">Order Management</div>
            <div class="text-caption text-medium-emphasis">Track and manage customer orders</div>
          </div>
        </div>
      </v-col>
      <v-col cols="12" md="4" class="text-end">
        <v-btn color="primary" variant="flat" @click="openCreateDialog">
          <v-icon left>mdi-plus</v-icon>Add Order
        </v-btn>
      </v-col>
    </v-row>

    <v-card class="pa-4">
      <v-data-table
        :headers="headers"
        :items="orders"
        :loading="loading"
        class="elevation-0"
      >
        <template #item.status="{ item }">
          <v-chip size="small" :color="statusColor(item.status)" variant="flat">
            {{ formatStatus(item.status) }}
          </v-chip>
        </template>
        <template #item.totalAmount="{ item }">
          <span class="font-weight-bold text-success">₹{{ formatAmount(item.totalAmount) }}</span>
        </template>
        <template #item.createdAt="{ item }">
          {{ formatDate(item.createdAt) }}
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

    <v-dialog v-model="dialog" max-width="900px" persistent>
      <v-card>
        <v-card-title class="text-h6 bg-primary text-white pa-4">
          {{ isEditMode ? 'Edit Order' : 'Add Order' }}
        </v-card-title>
        <v-card-text class="pt-6 px-6">
          <v-alert v-if="dialogError" type="error" closable class="mb-4" @click:close="dialogError = ''">
            {{ dialogError }}
          </v-alert>

          <v-row dense>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.orderNumber"
                label="Order Number *"
                variant="outlined"
                density="comfortable"
                :error="!!formErrors.orderNumber"
                :error-messages="formErrors.orderNumber"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.customerName"
                label="Customer Name *"
                variant="outlined"
                density="comfortable"
                :error="!!formErrors.customerName"
                :error-messages="formErrors.customerName"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.customerEmail"
                label="Customer Email"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                v-model="form.status"
                :items="statusOptions"
                item-title="title"
                item-value="value"
                label="Status"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
          </v-row>

          <v-divider class="my-4" />

          <div class="text-subtitle-1 font-weight-medium mb-2">Order Items</div>
          <v-alert v-if="formErrors.items" type="warning" variant="tonal" class="mb-4">
            {{ formErrors.items }}
          </v-alert>

          <v-row v-for="(item, index) in form.items" :key="index" dense class="align-center">
            <v-col cols="12" md="5">
              <v-select
                v-model="item.productId"
                :items="products"
                item-title="name"
                item-value="id"
                label="Product *"
                variant="outlined"
                density="comfortable"
                @update:model-value="onProductChange(index)"
              />
            </v-col>
            <v-col cols="6" md="2">
              <v-text-field
                v-model.number="item.quantity"
                label="Qty *"
                type="number"
                min="1"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="6" md="2">
              <v-text-field
                v-model.number="item.price"
                label="Price"
                type="number"
                min="0"
                prefix="₹"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="10" md="2">
              <v-text-field
                :model-value="formatAmount(itemSubtotal(item))"
                label="Subtotal"
                readonly
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="2" md="1" class="text-end">
              <v-btn icon color="error" variant="text" @click="removeItem(index)" :disabled="form.items.length === 1">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-col>
          </v-row>

          <v-btn variant="outlined" class="mt-3" @click="addItem">
            <v-icon left>mdi-plus</v-icon>Add Item
          </v-btn>

          <v-divider class="my-4" />

          <v-row dense>
            <v-col cols="12" sm="6">
              <v-textarea
                v-model="form.notes"
                label="Notes"
                variant="outlined"
                density="comfortable"
                rows="2"
              />
            </v-col>
            <v-col cols="6" sm="3">
              <v-text-field
                v-model.number="form.tax"
                label="Tax"
                type="number"
                min="0"
                prefix="₹"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="6" sm="3">
              <v-text-field
                v-model.number="form.discount"
                label="Discount"
                type="number"
                min="0"
                prefix="₹"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
          </v-row>

          <v-row dense class="mt-2">
            <v-col cols="12" sm="4">
              <v-text-field
                :model-value="formatAmount(orderSubtotal)"
                label="Subtotal"
                readonly
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                :model-value="formatAmount(orderTotal)"
                label="Total"
                readonly
                variant="outlined"
                density="comfortable"
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
          <v-btn color="primary" variant="flat" @click="saveOrder" :loading="saving">
            {{ isEditMode ? 'Update Order' : 'Create Order' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h6 bg-error text-white">Confirm Delete</v-card-title>
        <v-card-text class="pt-6">
          <p>Are you sure you want to delete <strong>{{ deleteOrderNumber }}</strong>?</p>
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
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { ordersAPI, productsAPI } from '@/services/authService'

const { token } = useAuth()

const headers = [
  { title: 'Order #', key: 'orderNumber' },
  { title: 'Customer', key: 'customerName' },
  { title: 'Status', key: 'status' },
  { title: 'Items', key: 'itemsCount' },
  { title: 'Total', key: 'totalAmount' },
  { title: 'Created', key: 'createdAt' },
  { title: 'Actions', key: 'actions', sortable: false }
]

const statusOptions = [
  { title: 'Pending', value: 'pending' },
  { title: 'Processing', value: 'processing' },
  { title: 'Completed', value: 'completed' },
  { title: 'Cancelled', value: 'cancelled' }
]

const orders = ref([])
const products = ref([])
const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const dialog = ref(false)
const deleteDialog = ref(false)
const isEditMode = ref(false)
const dialogError = ref('')
const deleteOrderNumber = ref('')
const deleteOrderId = ref(null)

const form = ref({
  id: null,
  orderNumber: '',
  customerName: '',
  customerEmail: '',
  status: 'pending',
  items: [{ productId: null, quantity: 1, price: 0 }],
  tax: 0,
  discount: 0,
  notes: ''
})

const formErrors = ref({
  orderNumber: '',
  customerName: '',
  items: ''
})

const itemSubtotal = (item) => {
  const quantity = Number(item.quantity || 0)
  const price = Number(item.price || 0)
  return Number((quantity * price).toFixed(2))
}

const orderSubtotal = computed(() => {
  return form.value.items.reduce((sum, item) => sum + itemSubtotal(item), 0)
})

const orderTotal = computed(() => {
  const tax = Number(form.value.tax || 0)
  const discount = Number(form.value.discount || 0)
  return Math.max(orderSubtotal.value + tax - discount, 0)
})

const formatAmount = (value) => Number(value || 0).toFixed(2)

const formatDate = (value) => {
  if (!value) return '-'
  return new Date(value).toLocaleString()
}

const formatStatus = (value) => {
  const match = statusOptions.find(option => option.value === value)
  return match ? match.title : value
}

const statusColor = (value) => {
  switch (value) {
    case 'completed':
      return 'success'
    case 'processing':
      return 'info'
    case 'cancelled':
      return 'error'
    default:
      return 'warning'
  }
}

const fetchOrders = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    const response = await ordersAPI.getAllOrders(token.value)
    orders.value = response.orders || []
  } catch (error) {
    errorMessage.value = error.message || 'Failed to load orders'
    console.error('Fetch orders error:', error)
  } finally {
    loading.value = false
  }
}

const fetchProducts = async () => {
  try {
    const response = await productsAPI.getAllProducts(token.value)
    products.value = response.products || []
  } catch (error) {
    errorMessage.value = error.message || 'Failed to load products'
    console.error('Fetch products error:', error)
  }
}

const resetForm = () => {
  form.value = {
    id: null,
    orderNumber: '',
    customerName: '',
    customerEmail: '',
    status: 'pending',
    items: [{ productId: null, quantity: 1, price: 0 }],
    tax: 0,
    discount: 0,
    notes: ''
  }
  formErrors.value = { orderNumber: '', customerName: '', items: '' }
  dialogError.value = ''
}

const openCreateDialog = () => {
  isEditMode.value = false
  resetForm()
  dialog.value = true
}

const openEditDialog = (order) => {
  isEditMode.value = true
  form.value = {
    id: order.id,
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerEmail: order.customerEmail || '',
    status: order.status || 'pending',
    items: (order.items || []).map(item => ({
      productId: item.product,
      quantity: item.quantity,
      price: item.price
    })),
    tax: order.tax || 0,
    discount: order.discount || 0,
    notes: order.notes || ''
  }
  if (form.value.items.length === 0) {
    form.value.items = [{ productId: null, quantity: 1, price: 0 }]
  }
  formErrors.value = { orderNumber: '', customerName: '', items: '' }
  dialogError.value = ''
  dialog.value = true
}

const closeDialog = () => {
  dialog.value = false
  resetForm()
}

const addItem = () => {
  form.value.items.push({ productId: null, quantity: 1, price: 0 })
}

const removeItem = (index) => {
  if (form.value.items.length > 1) {
    form.value.items.splice(index, 1)
  }
}

const onProductChange = (index) => {
  const item = form.value.items[index]
  const product = products.value.find(p => p.id === item.productId)
  if (product && (!item.price || Number(item.price) === 0)) {
    item.price = product.price
  }
}

const validateForm = () => {
  formErrors.value = { orderNumber: '', customerName: '', items: '' }
  let valid = true

  if (!form.value.orderNumber) {
    formErrors.value.orderNumber = 'Order number is required'
    valid = false
  }

  if (!form.value.customerName) {
    formErrors.value.customerName = 'Customer name is required'
    valid = false
  }

  if (!Array.isArray(form.value.items) || form.value.items.length === 0) {
    formErrors.value.items = 'At least one item is required'
    valid = false
  }

  const invalidItem = form.value.items.some(item => !item.productId || Number(item.quantity) < 1 || Number(item.price) < 0)
  if (invalidItem) {
    formErrors.value.items = 'Each item needs a product, quantity, and valid price'
    valid = false
  }

  if (Number(form.value.tax) < 0 || Number(form.value.discount) < 0) {
    formErrors.value.items = 'Tax and discount must be valid numbers'
    valid = false
  }

  return valid
}

const buildPayload = () => ({
  orderNumber: form.value.orderNumber,
  customerName: form.value.customerName,
  customerEmail: form.value.customerEmail,
  status: form.value.status,
  items: form.value.items.map(item => ({
    product: item.productId,
    quantity: Number(item.quantity),
    price: Number(item.price)
  })),
  tax: Number(form.value.tax || 0),
  discount: Number(form.value.discount || 0),
  notes: form.value.notes
})

const saveOrder = async () => {
  if (!validateForm()) return

  saving.value = true
  dialogError.value = ''
  successMessage.value = ''

  try {
    const payload = buildPayload()
    if (isEditMode.value) {
      await ordersAPI.updateOrder(token.value, form.value.id, payload)
      successMessage.value = 'Order updated successfully'
    } else {
      await ordersAPI.createOrder(token.value, payload)
      successMessage.value = 'Order created successfully'
    }
    dialog.value = false
    await fetchOrders()
    resetForm()
  } catch (error) {
    dialogError.value = error.message || 'Failed to save order'
    console.error('Save order error:', error)
  } finally {
    saving.value = false
  }
}

const openDeleteDialog = (order) => {
  deleteOrderNumber.value = order.orderNumber
  deleteOrderId.value = order.id
  deleteDialog.value = true
}

const confirmDelete = async () => {
  if (!deleteOrderId.value) return
  deleting.value = true
  try {
    await ordersAPI.deleteOrder(token.value, deleteOrderId.value)
    successMessage.value = 'Order deleted successfully'
    await fetchOrders()
  } catch (error) {
    errorMessage.value = error.message || 'Failed to delete order'
    console.error('Delete order error:', error)
  } finally {
    deleteDialog.value = false
    deleteOrderId.value = null
    deleting.value = false
  }
}

onMounted(() => {
  fetchOrders()
  fetchProducts()
})
</script>
