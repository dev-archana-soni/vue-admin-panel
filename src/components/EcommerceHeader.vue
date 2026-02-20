<template>
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
      <RouterLink to="/ecommerce/about" class="ecom-link">About Us</RouterLink>
      <RouterLink to="/ecommerce/support" class="ecom-link">Support</RouterLink>
      <span v-if="showExtraLinks" class="ecom-link">Collections</span>
      <span v-if="showExtraLinks" class="ecom-link">New In</span>
    </nav>
    <div class="ecom-actions">
      <v-text-field
        v-if="showSearch"
        :model-value="searchValue"
        @update:model-value="$emit('update:searchValue', $event)"
        density="compact"
        variant="solo"
        hide-details
        placeholder="Search products"
        prepend-inner-icon="mdi-magnify"
        class="ecom-search"
      />
      
      <div class="auth-buttons" v-if="!isAuthenticated">
        <v-btn variant="text" @click="$router.push('/ecommerce/login')">
          Sign In
        </v-btn>
        <v-btn variant="outlined" @click="$router.push('/ecommerce/register')">
          Join Now
        </v-btn>
      </div>
      <v-btn v-else variant="text" @click="$router.push('/ecommerce/account')">
        <v-icon left>mdi-account-circle</v-icon>
        {{ user?.name || 'My Account' }}
      </v-btn>
      
      <v-btn 
        v-if="showCart"
        color="primary" 
        variant="flat" 
        class="ecom-cart" 
        @click="$emit('open-cart')"
      >
        <v-icon left>mdi-cart</v-icon>
        Cart ({{ cartCount }})
      </v-btn>

      <v-btn 
        v-if="showBackButton"
        color="primary" 
        variant="flat" 
        @click="$router.push('/ecommerce')"
      >
        Back to shop
      </v-btn>
    </div>
  </header>
</template>

<script setup>
import { useAuth } from '@/composables/useAuth'

const { isAuthenticated, user } = useAuth()

defineProps({
  searchValue: {
    type: String,
    default: ''
  },
  cartCount: {
    type: Number,
    default: 0
  },
  showSearch: {
    type: Boolean,
    default: false
  },
  showCart: {
    type: Boolean,
    default: false
  },
  showExtraLinks: {
    type: Boolean,
    default: false
  },
  showBackButton: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:searchValue', 'open-cart'])
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=Space+Grotesk:wght@400;500;600&display=swap');

.ecom-header {
  position: relative;
  z-index: 1;
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
  background: #ff6b4a;
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
  color: #6b5f56;
}

.ecom-nav {
  display: flex;
  gap: 20px;
  justify-content: center;
  color: #6b5f56;
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

.ecom-search {
  max-width: 220px;
}

.ecom-cart {
  text-transform: none;
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
  .ecom-search {
    max-width: 100%;
  }

  .ecom-actions {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
