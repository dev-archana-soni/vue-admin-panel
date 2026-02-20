<template>
  <v-navigation-drawer :model-value="isOpen" @update:model-value="$emit('update:isOpen', $event)" location="right" temporary width="420">
    <div class="px-4 py-4">
      <div class="d-flex align-center justify-space-between mb-2">
        <div class="text-h6">Cart</div>
        <v-btn icon variant="text" @click="$emit('update:isOpen', false)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>

      <v-alert v-if="items.length === 0" type="info" variant="tonal" class="mb-4">
        Your cart is empty.
      </v-alert>

      <v-card v-for="item in items" :key="item.id" class="mb-3" variant="outlined">
        <v-card-text>
          <div class="d-flex align-center">
            <v-avatar size="48" rounded class="mr-3">
              <v-img :src="item.image || '/m.png'" />
            </v-avatar>
            <div class="flex-grow-1">
              <div class="text-subtitle-2 font-weight-medium">{{ item.name }}</div>
              <div class="text-caption text-medium-emphasis">₹{{ formatAmount(item.price) }}</div>
            </div>
            <v-btn icon variant="text" color="error" @click="$emit('remove-item', item.id)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </div>

          <div class="d-flex align-center justify-space-between mt-3">
            <div class="d-flex align-center">
              <v-btn icon variant="outlined" size="small" @click="$emit('decrease-quantity', item.id)">
                <v-icon>mdi-minus</v-icon>
              </v-btn>
              <div class="mx-3">{{ item.quantity }}</div>
              <v-btn
                icon
                variant="outlined"
                size="small"
                :disabled="item.quantity >= item.stock"
                @click="$emit('increase-quantity', item.id)"
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
        <span class="text-subtitle-1">₹{{ formatAmount(subtotal) }}</span>
      </div>
      <div class="d-flex align-center justify-space-between mb-4">
        <span class="text-medium-emphasis">Items</span>
        <span>{{ itemCount }}</span>
      </div>

      <v-btn
        block
        color="primary"
        variant="flat"
        :disabled="items.length === 0"
        @click="$emit('checkout')"
      >
        <v-icon left>mdi-check</v-icon>
        Checkout
      </v-btn>
    </div>
  </v-navigation-drawer>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  items: {
    type: Array,
    default: () => []
  }
})

defineEmits(['update:isOpen', 'remove-item', 'decrease-quantity', 'increase-quantity', 'checkout'])

const formatAmount = (value) => Number(value || 0).toFixed(2)

const subtotal = computed(() => {
  return props.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

const itemCount = computed(() => {
  return props.items.reduce((sum, item) => sum + item.quantity, 0)
})
</script>

<style scoped>
</style>
