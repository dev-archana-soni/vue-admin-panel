<template>
  <v-container class="py-6" fluid>
    <v-progress-linear v-if="loading" indeterminate color="primary" />

    <v-alert v-if="errorMessage" type="error" closable class="mb-4" @click:close="errorMessage = ''">
      {{ errorMessage }}
    </v-alert>

    <v-btn variant="text" class="mb-4" to="/ecommerce">
      <v-icon left>mdi-arrow-left</v-icon>
      Back to Ecommerce
    </v-btn>

    <v-row v-if="product" dense>
      <v-col cols="12" md="6">
        <v-card>
          <v-carousel hide-delimiters height="360">
            <v-carousel-item
              v-for="(image, index) in productImages"
              :key="`${image.url || image}-${index}`"
            >
              <v-img :src="image.url || image" height="360" cover />
            </v-carousel-item>
          </v-carousel>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="pa-4">
          <div class="text-h5 font-weight-medium mb-1">{{ product.name }}</div>
          <div class="text-caption text-medium-emphasis mb-3">SKU: {{ product.sku }}</div>

          <div class="d-flex align-center justify-space-between mb-3">
            <div class="text-h6 text-success">₹{{ formatAmount(product.price) }}</div>
            <v-chip size="small" :color="product.stock > 0 ? 'info' : 'error'" variant="flat">
              {{ product.stock > 0 ? `${product.stock} in stock` : 'Out of stock' }}
            </v-chip>
          </div>

          <div class="text-body-2 mb-4">
            {{ product.description || 'No description available.' }}
          </div>

          <v-divider class="my-4" />

          <div class="text-caption text-medium-emphasis">Category</div>
          <div class="text-subtitle-2 mb-3">{{ product.category?.name || 'Uncategorized' }}</div>

          <v-btn variant="outlined" to="/ecommerce">
            Continue shopping
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { publicAPI } from '@/services/authService'

const route = useRoute()
const loading = ref(false)
const errorMessage = ref('')
const product = ref(null)

const formatAmount = (value) => Number(value || 0).toFixed(2)

const productImages = computed(() => {
  if (product.value?.images?.length) {
    return product.value.images
  }
  return ['/m.png']
})

const fetchProduct = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    const response = await publicAPI.getPublicProductById(route.params.id)
    product.value = response.product || null
  } catch (error) {
    errorMessage.value = error.message || 'Failed to load product'
    console.error('Fetch product error:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProduct()
})
</script>
