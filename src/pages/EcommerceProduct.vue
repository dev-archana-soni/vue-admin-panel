<template>
  <v-container class="ecom-page" fluid>
    <div class="ecom-bg" />
    <EcommerceHeader 
      :show-extra-links="true"
    />

    <v-progress-linear v-if="loading" indeterminate color="primary" class="mt-4" />

    <v-alert v-if="errorMessage" type="error" closable class="mt-4 mb-4" @click:close="errorMessage = ''">
      {{ errorMessage }}
    </v-alert>

    <v-btn variant="text" class="mt-4 mb-4" to="/ecommerce">
      <v-icon left>mdi-arrow-left</v-icon>
      Back to Shop
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

          <v-btn variant="flat" color="primary" block size="large" to="/ecommerce">
            Continue Shopping
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <EcommerceFooter />
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { publicAPI } from '@/services/authService'
import EcommerceHeader from '@/components/EcommerceHeader.vue'
import EcommerceFooter from '@/components/EcommerceFooter.vue'

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

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=Space+Grotesk:wght@400;500;600&display=swap');

.ecom-page {
  --ecom-ink: #1f1a16;
  --ecom-muted: #6b5f56;
  --ecom-cream: #f7f2ea;
  --ecom-sand: #efe4d6;
  --ecom-coral: #ff6b4a;
  --ecom-forest: #1f6f5c;
  --ecom-card: #ffffff;
  position: relative;
  min-height: 100vh;
  padding: 32px 36px 48px;
  font-family: 'Space Grotesk', sans-serif;
  color: var(--ecom-ink);
}

.ecom-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 15% 20%, rgba(255, 219, 190, 0.6), transparent 45%),
    radial-gradient(circle at 80% 0%, rgba(175, 215, 206, 0.5), transparent 40%),
    linear-gradient(135deg, #fdf9f3 0%, #f4ebe0 45%, #fff 100%);
  z-index: 0;
}

.ecom-header,
.ecom-footer {
  position: relative;
  z-index: 1;
}

.ecom-header {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 24px;
  align-items: center;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 18px;
  backdrop-filter: blur(12px);
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-mark {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: var(--ecom-coral);
  color: #fff;
  font-weight: 700;
  display: grid;
  place-items: center;
  font-size: 18px;
}

.brand-title {
  font-family: 'Playfair Display', serif;
  font-size: 20px;
  font-weight: 600;
}

.brand-tag {
  font-size: 12px;
  color: var(--ecom-muted);
}

.ecom-nav {
  display: flex;
  gap: 20px;
  justify-content: center;
  color: var(--ecom-muted);
}

.ecom-link {
  font-size: 14px;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
}

.ecom-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.auth-buttons {
  display: flex;
  gap: 8px;
  align-items: center;
}

.ecom-footer {
  margin-top: 40px;
  padding: 24px;
  border-radius: 20px;
  background: rgba(31, 26, 22, 0.85);
  color: #fff;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.footer-title {
  font-family: 'Playfair Display', serif;
  font-size: 20px;
}

.footer-text {
  color: rgba(255, 255, 255, 0.7);
}

.footer-links {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  color: rgba(255, 255, 255, 0.7);
}

.footer-link {
  color: inherit;
  text-decoration: none;
}

.footer-link:hover {
  color: #fff;
}

.footer-meta {
  color: rgba(255, 255, 255, 0.7);
}

@media (max-width: 960px) {
  .ecom-header {
    grid-template-columns: 1fr;
    justify-items: start;
  }

  .ecom-nav {
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .ecom-actions {
    width: 100%;
  }
}

@media (max-width: 600px) {
  .ecom-page {
    padding: 20px 16px 32px;
  }

  .ecom-actions {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
