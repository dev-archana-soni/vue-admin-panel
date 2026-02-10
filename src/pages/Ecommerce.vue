<template>
  <v-container class="ecom-page" fluid>
    <div class="ecom-bg" />
    <header class="ecom-header">
      <div class="brand">
        <div class="brand-mark">E</div>
        <div>
          <div class="brand-title">Evercart</div>
          <div class="brand-tag">Everyday essentials, curated</div>
        </div>
      </div>
      <nav class="ecom-nav">
        <RouterLink to="/ecommerce" class="ecom-link">Shop</RouterLink>
        <span class="ecom-link">Collections</span>
        <span class="ecom-link">New In</span>
        <span class="ecom-link">Support</span>
      </nav>
      <div class="ecom-actions">
        <v-text-field
          v-model="search"
          density="compact"
          variant="solo"
          hide-details
          placeholder="Search products"
          prepend-inner-icon="mdi-magnify"
          class="ecom-search"
        />
        <v-btn color="primary" variant="flat" class="ecom-cart" @click="cartOpen = true">
          <v-icon left>mdi-cart</v-icon>
          Cart ({{ cartItemCount }})
        </v-btn>
      </div>
    </header>

    <section class="ecom-hero">
      <div>
        <div class="hero-kicker">Fresh arrivals</div>
        <h1>Shop the newest drops for your daily workflow.</h1>
        <p>Discover premium supplies, gadgets, and essentials designed to keep your day moving.</p>
        <div class="hero-cta">
          <v-btn color="primary" variant="flat" @click="scrollToCatalog">
            Browse catalog
          </v-btn>
          <v-btn variant="outlined">View offers</v-btn>
        </div>
      </div>
      <div class="hero-card">
        <div class="hero-label">Curated box</div>
        <div class="hero-title">Starter Kit</div>
        <div class="hero-desc">Top rated picks bundled with seasonal savings.</div>
        <div class="hero-meta">From ₹1,499</div>
      </div>
    </section>
    <v-progress-linear v-if="loading" indeterminate color="primary" />

    <v-alert v-if="errorMessage" type="error" closable class="mb-4" @click:close="errorMessage = ''">
      {{ errorMessage }}
    </v-alert>

    <section class="ecom-body" id="catalog">
      <aside class="ecom-sidebar">
        <div class="sidebar-card">
          <div class="sidebar-title">Filters</div>
          <v-select
            v-model="categoryFilter"
            :items="categoryOptions"
            item-title="title"
            item-value="value"
            label="Category"
            variant="outlined"
            density="comfortable"
          />
          <v-select
            v-model="sortBy"
            :items="sortOptions"
            item-title="title"
            item-value="value"
            label="Sort by"
            variant="outlined"
            density="comfortable"
          />
        </div>
        <div class="sidebar-card">
          <div class="sidebar-title">Why Evercart</div>
          <ul class="sidebar-list">
            <li>Free delivery over ₹999</li>
            <li>7-day easy returns</li>
            <li>Verified supplier network</li>
          </ul>
        </div>
        <div class="sidebar-card promo">
          <div class="promo-title">Pro member</div>
          <div class="promo-text">Extra 10% off on your first order.</div>
          <v-btn color="primary" variant="flat">Join now</v-btn>
        </div>
      </aside>

      <section class="ecom-catalog">
        <div class="catalog-header">
          <div>
            <div class="catalog-title">Featured products</div>
            <div class="catalog-sub">Handpicked for high performance</div>
          </div>
          <div class="catalog-meta">{{ filteredProducts.length }} items</div>
        </div>

        <v-row>
          <v-col v-for="product in filteredProducts" :key="product.id" cols="12" sm="6" md="4" lg="3">
            <v-card class="product-card h-100 d-flex flex-column">
              <v-img
                :src="product.images?.[0]?.url || '/m.png'"
                height="180"
                cover
              />
              <v-card-title class="text-subtitle-1 font-weight-medium">
                <RouterLink class="product-link" :to="`/ecommerce/product/${product.id}`">
                  {{ product.name }}
                </RouterLink>
              </v-card-title>
              <v-card-subtitle class="text-caption">
                {{ product.category?.name || 'Uncategorized' }}
              </v-card-subtitle>
              <v-card-text class="pt-2">
                <div class="d-flex align-center justify-space-between">
                  <div class="text-h6 text-success">₹{{ formatAmount(product.price) }}</div>
                  <v-chip size="small" :color="product.stock > 0 ? 'info' : 'error'" variant="flat">
                    {{ product.stock > 0 ? `${product.stock} in stock` : 'Out of stock' }}
                  </v-chip>
                </div>
                <div class="text-caption text-medium-emphasis mt-2">SKU: {{ product.sku }}</div>
              </v-card-text>
              <v-spacer />
              <v-card-actions class="px-4 pb-4">
                <v-btn
                  block
                  color="primary"
                  variant="flat"
                  :disabled="product.stock <= 0"
                  @click="addToCart(product)"
                >
                  <v-icon left>mdi-cart-plus</v-icon>
                  Add to cart
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>

          <v-col v-if="!loading && filteredProducts.length === 0" cols="12">
            <v-alert type="info" variant="tonal">
              No products found for the current filters.
            </v-alert>
          </v-col>
        </v-row>
      </section>
    </section>

    <v-navigation-drawer v-model="cartOpen" location="right" temporary width="420">
      <div class="px-4 py-4">
        <div class="d-flex align-center justify-space-between mb-2">
          <div class="text-h6">Cart</div>
          <v-btn icon variant="text" @click="cartOpen = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>

        <v-alert v-if="cartItems.length === 0" type="info" variant="tonal" class="mb-4">
          Your cart is empty.
        </v-alert>

        <v-card v-for="item in cartItems" :key="item.id" class="mb-3" variant="outlined">
          <v-card-text>
            <div class="d-flex align-center">
              <v-avatar size="48" rounded class="mr-3">
                <v-img :src="item.image || '/m.png'" />
              </v-avatar>
              <div class="flex-grow-1">
                <div class="text-subtitle-2 font-weight-medium">{{ item.name }}</div>
                <div class="text-caption text-medium-emphasis">₹{{ formatAmount(item.price) }}</div>
              </div>
              <v-btn icon variant="text" color="error" @click="removeFromCart(item.id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>

            <div class="d-flex align-center justify-space-between mt-3">
              <div class="d-flex align-center">
                <v-btn icon variant="outlined" size="small" @click="decreaseQty(item.id)">
                  <v-icon>mdi-minus</v-icon>
                </v-btn>
                <div class="mx-3">{{ item.quantity }}</div>
                <v-btn
                  icon
                  variant="outlined"
                  size="small"
                  :disabled="item.quantity >= item.stock"
                  @click="increaseQty(item.id)"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </div>
              <div class="text-subtitle-2">₹{{ formatAmount(item.price * item.quantity) }}</div>
            </div>
          </v-card-text>
        </v-card>

        <v-divider class="my-4" />

        <div class="d-flex align-center justify-space-between mb-2">
          <span class="text-medium-emphasis">Subtotal</span>
          <span class="text-subtitle-1">₹{{ formatAmount(cartSubtotal) }}</span>
        </div>
        <div class="d-flex align-center justify-space-between mb-4">
          <span class="text-medium-emphasis">Items</span>
          <span>{{ cartItemCount }}</span>
        </div>

        <v-btn
          block
          color="primary"
          variant="flat"
          :disabled="cartItems.length === 0"
          @click="openCheckout"
        >
          <v-icon left>mdi-check</v-icon>
          Checkout
        </v-btn>
      </div>
    </v-navigation-drawer>

    <v-dialog v-model="checkoutDialog" max-width="720px" persistent>
      <v-card>
        <v-card-title class="text-h6 bg-primary text-white pa-4">
          Checkout Details
        </v-card-title>
        <v-card-text class="pt-6 px-6">
          <v-alert v-if="checkoutError" type="error" closable class="mb-4" @click:close="checkoutError = ''">
            {{ checkoutError }}
          </v-alert>

          <v-row dense>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="checkoutForm.name"
                label="Full Name *"
                variant="outlined"
                density="comfortable"
                :error="!!checkoutErrors.name"
                :error-messages="checkoutErrors.name"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="checkoutForm.email"
                label="Email *"
                variant="outlined"
                density="comfortable"
                :error="!!checkoutErrors.email"
                :error-messages="checkoutErrors.email"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="checkoutForm.phone"
                label="Phone *"
                variant="outlined"
                density="comfortable"
                :error="!!checkoutErrors.phone"
                :error-messages="checkoutErrors.phone"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="checkoutForm.postalCode"
                label="Postal Code *"
                variant="outlined"
                density="comfortable"
                :error="!!checkoutErrors.postalCode"
                :error-messages="checkoutErrors.postalCode"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="checkoutForm.address"
                label="Address *"
                variant="outlined"
                density="comfortable"
                :error="!!checkoutErrors.address"
                :error-messages="checkoutErrors.address"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="checkoutForm.city"
                label="City *"
                variant="outlined"
                density="comfortable"
                :error="!!checkoutErrors.city"
                :error-messages="checkoutErrors.city"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="checkoutForm.state"
                label="State"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="checkoutForm.notes"
                label="Order Notes"
                variant="outlined"
                density="comfortable"
                rows="2"
              />
            </v-col>
          </v-row>

          <v-divider class="my-4" />
          <div class="d-flex align-center justify-space-between">
            <span class="text-medium-emphasis">Order Total</span>
            <span class="text-h6 text-success">₹{{ formatAmount(cartSubtotal) }}</span>
          </div>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="outlined" @click="closeCheckout" :disabled="submittingCheckout">
            Cancel
          </v-btn>
          <v-btn color="primary" variant="flat" @click="submitCheckout" :loading="submittingCheckout">
            Place Order
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <footer class="ecom-footer">
      <div>
        <div class="footer-title">Evercart</div>
        <div class="footer-text">Reliable commerce for teams that move fast.</div>
      </div>
      <div class="footer-links">
        <span>Shipping</span>
        <span>Returns</span>
        <span>Privacy</span>
        <span>Terms</span>
      </div>
      <div class="footer-meta">© 2026 Evercart Studio</div>
    </footer>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { publicAPI } from '@/services/authService'

const loading = ref(false)
const errorMessage = ref('')
const products = ref([])
const categories = ref([])

const search = ref('')
const categoryFilter = ref('all')
const sortBy = ref('newest')

const cartOpen = ref(false)
const cartItems = ref([])
const checkoutDialog = ref(false)
const submittingCheckout = ref(false)
const checkoutError = ref('')
const checkoutForm = ref({
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  postalCode: '',
  notes: ''
})
const checkoutErrors = ref({
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postalCode: ''
})

const sortOptions = [
  { title: 'Newest', value: 'newest' },
  { title: 'Price: Low to High', value: 'price-asc' },
  { title: 'Price: High to Low', value: 'price-desc' },
  { title: 'Name: A to Z', value: 'name-asc' }
]

const formatAmount = (value) => Number(value || 0).toFixed(2)

const categoryOptions = computed(() => ([
  { title: 'All Categories', value: 'all' },
  ...categories.value.map(category => ({ value: category.id, title: category.name }))
]))

const filteredProducts = computed(() => {
  const query = search.value.trim().toLowerCase()
  let list = products.value.filter(product => {
    const matchesSearch = !query || product.name?.toLowerCase().includes(query) || product.sku?.toLowerCase().includes(query)
    const matchesCategory = categoryFilter.value === 'all' || product.category?.id === categoryFilter.value
    return matchesSearch && matchesCategory
  })

  switch (sortBy.value) {
    case 'price-asc':
      list = [...list].sort((a, b) => Number(a.price) - Number(b.price))
      break
    case 'price-desc':
      list = [...list].sort((a, b) => Number(b.price) - Number(a.price))
      break
    case 'name-asc':
      list = [...list].sort((a, b) => a.name.localeCompare(b.name))
      break
    default:
      list = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      break
  }

  return list
})

const cartItemCount = computed(() => cartItems.value.reduce((sum, item) => sum + item.quantity, 0))
const cartSubtotal = computed(() => cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0))

const fetchProducts = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    const response = await publicAPI.getPublicProducts()
    products.value = response.products || []
  } catch (error) {
    errorMessage.value = error.message || 'Failed to load products'
    console.error('Fetch products error:', error)
  } finally {
    loading.value = false
  }
}

const scrollToCatalog = () => {
  const target = document.getElementById('catalog')
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const fetchCategories = async () => {
  try {
    const response = await publicAPI.getPublicCategories()
    categories.value = response.categories || []
  } catch (error) {
    errorMessage.value = error.message || 'Failed to load categories'
    console.error('Fetch categories error:', error)
  }
}

const addToCart = (product) => {
  const existing = cartItems.value.find(item => item.id === product.id)
  if (existing) {
    if (existing.quantity < product.stock) {
      existing.quantity += 1
    }
    return
  }

  cartItems.value.push({
    id: product.id,
    name: product.name,
    price: Number(product.price || 0),
    image: product.images?.[0]?.url || '',
    stock: product.stock,
    quantity: 1
  })
}

const removeFromCart = (id) => {
  cartItems.value = cartItems.value.filter(item => item.id !== id)
}

const increaseQty = (id) => {
  const item = cartItems.value.find(entry => entry.id === id)
  if (item && item.quantity < item.stock) {
    item.quantity += 1
  }
}

const decreaseQty = (id) => {
  const item = cartItems.value.find(entry => entry.id === id)
  if (item && item.quantity > 1) {
    item.quantity -= 1
  }
}

const resetCheckout = () => {
  checkoutForm.value = {
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    notes: ''
  }
  checkoutErrors.value = {
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  }
  checkoutError.value = ''
}

const openCheckout = () => {
  if (cartItems.value.length === 0) return
  cartOpen.value = false
  resetCheckout()
  checkoutDialog.value = true
}

const closeCheckout = () => {
  checkoutDialog.value = false
}

const validateCheckout = () => {
  checkoutErrors.value = {
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  }

  let valid = true
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!checkoutForm.value.name) {
    checkoutErrors.value.name = 'Full name is required'
    valid = false
  }

  if (!checkoutForm.value.email || !emailPattern.test(checkoutForm.value.email)) {
    checkoutErrors.value.email = 'Valid email is required'
    valid = false
  }

  if (!checkoutForm.value.phone) {
    checkoutErrors.value.phone = 'Phone number is required'
    valid = false
  }

  if (!checkoutForm.value.address) {
    checkoutErrors.value.address = 'Address is required'
    valid = false
  }

  if (!checkoutForm.value.city) {
    checkoutErrors.value.city = 'City is required'
    valid = false
  }

  if (!checkoutForm.value.postalCode) {
    checkoutErrors.value.postalCode = 'Postal code is required'
    valid = false
  }

  return valid
}

const submitCheckout = async () => {
  if (!validateCheckout()) return

  submittingCheckout.value = true
  checkoutError.value = ''

  try {
    await new Promise(resolve => setTimeout(resolve, 600))
    checkoutDialog.value = false
    alert('Checkout submitted. Order creation will be wired next.')
  } catch (error) {
    checkoutError.value = error.message || 'Checkout failed'
  } finally {
    submittingCheckout.value = false
  }
}

onMounted(() => {
  fetchProducts()
  fetchCategories()
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
.ecom-hero,
.ecom-body,
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

.ecom-search {
  max-width: 220px;
}

.ecom-cart {
  text-transform: none;
}

.ecom-hero {
  margin-top: 28px;
  padding: 28px 32px;
  background: linear-gradient(120deg, rgba(31, 111, 92, 0.12), rgba(255, 107, 74, 0.08));
  border-radius: 24px;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 24px;
  align-items: center;
}

.ecom-hero h1 {
  font-family: 'Playfair Display', serif;
  font-size: 36px;
  margin: 8px 0 10px;
}

.hero-kicker {
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 12px;
  color: var(--ecom-forest);
  font-weight: 600;
}

.hero-cta {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.hero-card {
  background: var(--ecom-card);
  padding: 24px;
  border-radius: 18px;
  box-shadow: 0 20px 40px rgba(31, 26, 22, 0.08);
}

.hero-label {
  font-size: 12px;
  color: var(--ecom-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.hero-title {
  font-size: 22px;
  font-weight: 600;
  margin: 8px 0;
}

.hero-desc {
  color: var(--ecom-muted);
}

.hero-meta {
  margin-top: 12px;
  font-weight: 600;
  color: var(--ecom-forest);
}

.ecom-body {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 24px;
  margin-top: 30px;
}

.ecom-sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sidebar-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 18px;
  padding: 18px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.sidebar-title {
  font-weight: 600;
  margin-bottom: 12px;
}

.sidebar-list {
  padding-left: 18px;
  margin: 0;
  color: var(--ecom-muted);
}

.promo {
  background: linear-gradient(140deg, rgba(255, 107, 74, 0.15), rgba(31, 111, 92, 0.1));
}

.promo-title {
  font-weight: 600;
  margin-bottom: 6px;
}

.promo-text {
  color: var(--ecom-muted);
  margin-bottom: 12px;
}

.catalog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.catalog-title {
  font-family: 'Playfair Display', serif;
  font-size: 22px;
}

.catalog-sub {
  color: var(--ecom-muted);
}

.catalog-meta {
  color: var(--ecom-muted);
}

.product-card {
  border-radius: 16px;
  overflow: hidden;
}

.product-link {
  text-decoration: none;
  color: inherit;
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

  .ecom-hero {
    grid-template-columns: 1fr;
  }

  .ecom-body {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .ecom-page {
    padding: 20px 16px 32px;
  }

  .ecom-search {
    max-width: 100%;
  }

  .ecom-actions {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
