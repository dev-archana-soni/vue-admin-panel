<template>
  <v-container fluid class="py-6">
    <v-card class="pa-8">
      <div class="text-h6 mb-2">{{ title }}</div>
      <div class="text-body-2 text-medium-emphasis">Placeholder page. Replace with actual content.</div>
    </v-card>
  </v-container>
</template>

<script setup>
const props = defineProps({ title: String })
</script>
