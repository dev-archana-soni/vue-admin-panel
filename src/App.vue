<template>
  <v-app>
    <v-navigation-drawer v-if="!isPublicPage" v-model="drawer" app :width="260">
      <div class="d-flex align-center px-4 py-3">
        <v-avatar size="32" class="mr-3">
          <v-img :src="userProfile.image || '/m.png'" :alt="userProfile.name || 'User'" />
        </v-avatar>
        <span class="text-subtitle-1 font-weight-medium">{{ userProfile.name || 'User' }} ({{ userProfile.role || 'Loading...' }})</span>
      </div>
      <v-divider />
      <v-list density="compact" nav>
        <template v-for="(item, idx) in menu" :key="idx">
          <!-- Vuetify 3 replaced v-subheader with v-list-subheader -->
          <v-list-subheader v-if="item.header">{{ item.header }}</v-list-subheader>
          <v-divider v-else-if="item.divider" />
          <v-list-group
            v-else-if="item.children"
            :prepend-icon="item.icon"
          >
            <template v-slot:activator="{ props }">
              <v-list-item
                v-bind="props"
                :title="item.title"
                density="comfortable"
              />
            </template>
            <v-list-item
              v-for="child in item.children"
              :key="child.to"
              :to="child.to"
              :title="child.title"
              color="primary"
              density="comfortable"
            />
          </v-list-group>
          <v-list-item
            v-else
            :to="item.to"
            :prepend-icon="item.icon"
            :title="item.title"
            color="primary"
            density="comfortable"
          />
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar v-if="!isPublicPage" app flat color="primary" density="comfortable" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title>{{ userProfile.name || 'User' }} ({{ userProfile.role || 'Loading...' }})</v-toolbar-title>
      <v-spacer />
      <v-btn :icon="theme.global.current.value.dark ? 'mdi-white-balance-sunny' : 'mdi-weather-night'" variant="text" @click="toggleTheme" class="mr-1" />
      <v-btn icon="mdi-bell-outline" variant="text" class="mr-1" />
      <v-menu transition="fade-transition" offset="8">
        <template #activator="{ props }">
          <v-btn icon variant="text" v-bind="props">
            <v-avatar size="28">
              <v-img :src="userProfile.image || 'https://cdn.vuetifyjs.com/images/john.jpg'" alt="User" />
            </v-avatar>
          </v-btn>
        </template>
        <v-list density="compact">
          <v-list-item to="/profile" title="Profile" prepend-icon="mdi-account-circle" />
          <v-list-item to="/settings" title="Settings" prepend-icon="mdi-cog-outline" />
          <v-divider />
          <v-list-item title="Logout" prepend-icon="mdi-logout" @click="handleLogout" />
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <v-container v-if="!isPublicPage" fluid class="py-6">
        <router-view />
      </v-container>
      <router-view v-else />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTheme } from 'vuetify'
import { useAuth } from '@/composables/useAuth'
import { authAPI } from '@/services/authService'
import { menu } from './data/menu'

const drawer = ref(true)
const theme = useTheme()
const route = useRoute()
const router = useRouter()
const { logout, token } = useAuth()

const userProfile = ref({
  name: '',
  image: '',
  role: ''
})

const publicRoutes = ['/login', '/register', '/404-not-found', '/403', '/500']
const isPublicPage = computed(() => publicRoutes.includes(route.path))

const fetchUserProfile = async () => {
  if (!token.value || isPublicPage.value) return
  
  try {
    const response = await authAPI.fetchProfile(token.value)
    userProfile.value = response.user
    console.log('Header: User profile loaded', userProfile.value.image)
  } catch (error) {
    console.error('Failed to load user profile in header:', error)
  }
}

const toggleTheme = () => {
  const newTheme = theme.global.current.value.dark ? 'light' : 'dark'
  theme.global.name.value = newTheme
  localStorage.setItem('theme', newTheme)
}

const handleLogout = async () => {
  await logout()
  router.push('/login')
}

// Fetch profile when component mounts
onMounted(() => {
  fetchUserProfile()
})

// Fetch profile when navigating to non-public pages
watch(() => route.path, () => {
  if (!isPublicPage.value && token.value) {
    fetchUserProfile()
  }
})
</script>

<style scoped>
.v-navigation-drawer .v-list-item {
  min-height: 38px;
}

.v-navigation-drawer .v-list-subheader {
  font-size: 12px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  padding-top: 16px;
  padding-bottom: 8px;
}

.v-navigation-drawer .v-list-group {
  --prepend-width: 40px;
}
</style>
