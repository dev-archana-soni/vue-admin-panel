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
      <v-col cols="12">
        <div class="text-h5">Settings</div>
      </v-col>
    </v-row>

    <v-row>
      <!-- Settings Navigation -->
      <v-col cols="12" md="3">
        <v-card>
          <v-list density="compact" nav>
            <v-list-item
              v-for="item in settingsMenu"
              :key="item.id"
              @click="activeTab = item.id"
              :active="activeTab === item.id"
              :prepend-icon="item.icon"
              :title="item.title"
              color="primary"
            />
          </v-list>
        </v-card>
      </v-col>

      <!-- Settings Content -->
      <v-col cols="12" md="9">
        <!-- General Settings -->
        <v-card v-show="activeTab === 'general'" class="pa-6">
          <div class="text-h6 mb-4">General Settings</div>
          <v-form @submit.prevent="saveGeneralSettings">
            <v-row dense>
              <v-col cols="12">
                <v-switch
                  v-model="settings.general.notifications"
                  label="Enable Notifications"
                  color="primary"
                />
              </v-col>
              <v-col cols="12">
                <v-switch
                  v-model="settings.general.emailAlerts"
                  label="Email Alerts"
                  color="primary"
                />
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="settings.general.theme"
                  label="Theme"
                  :items="['light', 'dark', 'auto']"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="settings.general.language"
                  label="Language"
                  :items="['English', 'Spanish', 'French', 'German']"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>
              <v-col cols="12" class="d-flex gap-2">
                <v-btn color="primary" variant="flat" type="submit" :loading="savingSettings">
                  Save Changes
                </v-btn>
                <v-btn variant="outlined" @click="resetGeneralSettings">
                  Reset
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card>

        <!-- Privacy Settings -->
        <v-card v-show="activeTab === 'privacy'" class="pa-6">
          <div class="text-h6 mb-4">Privacy Settings</div>
          <v-form @submit.prevent="savePrivacySettings">
            <v-row dense>
              <v-col cols="12">
                <v-switch
                  v-model="settings.privacy.profileVisibility"
                  label="Make Profile Public"
                  color="primary"
                />
              </v-col>
              <v-col cols="12">
                <v-switch
                  v-model="settings.privacy.showOnlineStatus"
                  label="Show Online Status"
                  color="primary"
                />
              </v-col>
              <v-col cols="12">
                <v-switch
                  v-model="settings.privacy.allowMessages"
                  label="Allow Direct Messages"
                  color="primary"
                />
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="settings.privacy.dataCollection"
                  label="Data Collection"
                  :items="['minimal', 'standard', 'full']"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>
              <v-col cols="12" class="d-flex gap-2">
                <v-btn color="primary" variant="flat" type="submit" :loading="savingSettings">
                  Save Changes
                </v-btn>
                <v-btn variant="outlined" @click="resetPrivacySettings">
                  Reset
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card>

        <!-- Security Settings -->
        <v-card v-show="activeTab === 'security'" class="pa-6">
          <div class="text-h6 mb-4">Security Settings</div>
          <v-form @submit.prevent="saveSecuritySettings">
            <v-row dense>
              <v-col cols="12">
                <v-switch
                  v-model="settings.security.twoFactorAuth"
                  label="Two-Factor Authentication"
                  color="primary"
                />
              </v-col>
              <v-col cols="12">
                <v-switch
                  v-model="settings.security.loginNotifications"
                  label="Login Notifications"
                  color="primary"
                />
              </v-col>
              <v-col cols="12">
                <v-switch
                  v-model="settings.security.sessionTimeout"
                  label="Auto Logout on Inactivity"
                  color="primary"
                />
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="settings.security.sessionDuration"
                  label="Session Duration (minutes)"
                  :items="[15, 30, 60, 120, 240]"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>
              <v-col cols="12" class="d-flex gap-2">
                <v-btn color="primary" variant="flat" type="submit" :loading="savingSettings">
                  Save Changes
                </v-btn>
                <v-btn variant="outlined" @click="resetSecuritySettings">
                  Reset
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card>

        <!-- Account Settings -->
        <v-card v-show="activeTab === 'account'" class="pa-6">
          <div class="text-h6 mb-4">Account Settings</div>
          <v-form @submit.prevent="saveAccountSettings">
            <v-row dense>
              <v-col cols="12">
                <div class="text-subtitle-2 mb-2">Connected Accounts</div>
                <v-chip
                  v-for="account in settings.account.connectedAccounts"
                  :key="account"
                  closable
                  class="mr-2 mb-2"
                  @click:close="removeConnectedAccount(account)"
                >
                  {{ account }}
                </v-chip>
              </v-col>
              <v-col cols="12" class="d-flex gap-2">
                <v-btn color="primary" variant="flat" type="submit" :loading="savingSettings">
                  Save Changes
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
          <v-divider class="my-4" />
          <div class="text-subtitle-2 mb-4">Danger Zone</div>
          <v-btn color="error" variant="outlined" @click="showDeleteDialog = true">
            Delete Account
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- Delete Account Dialog -->
    <v-dialog v-model="showDeleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h6 bg-error text-white">Delete Account</v-card-title>
        <v-card-text class="pt-6">
          <p>Are you sure you want to delete your account?</p>
          <p class="text-caption text-medium-emphasis">This action is permanent and cannot be undone.</p>
          <v-text-field
            v-model="deleteConfirmation"
            label="Type 'DELETE' to confirm"
            variant="outlined"
            density="comfortable"
            class="mt-4"
          />
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="outlined" @click="showDeleteDialog = false">Cancel</v-btn>
          <v-btn
            color="error"
            variant="flat"
            @click="confirmDeleteAccount"
            :disabled="deleteConfirmation !== 'DELETE'"
            :loading="deletingAccount"
          >
            Delete Account
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from 'vuetify'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const theme = useTheme()
const { logout } = useAuth()

const activeTab = ref('general')
const loading = ref(false)
const savingSettings = ref(false)
const deletingAccount = ref(false)
const showDeleteDialog = ref(false)
const deleteConfirmation = ref('')
const successMessage = ref('')
const errorMessage = ref('')

const settingsMenu = [
  { id: 'general', title: 'General', icon: 'mdi-cog' },
  { id: 'privacy', title: 'Privacy', icon: 'mdi-shield-account' },
  { id: 'security', title: 'Security', icon: 'mdi-lock' },
  { id: 'account', title: 'Account', icon: 'mdi-account' }
]

const settings = ref({
  general: {
    notifications: true,
    emailAlerts: true,
    theme: 'auto',
    language: 'English'
  },
  privacy: {
    profileVisibility: false,
    showOnlineStatus: true,
    allowMessages: true,
    dataCollection: 'standard'
  },
  security: {
    twoFactorAuth: false,
    loginNotifications: true,
    sessionTimeout: true,
    sessionDuration: 60
  },
  account: {
    connectedAccounts: ['Google', 'GitHub']
  }
})

const generalSettingsBackup = ref(JSON.parse(JSON.stringify(settings.value.general)))
const privacySettingsBackup = ref(JSON.parse(JSON.stringify(settings.value.privacy)))
const securitySettingsBackup = ref(JSON.parse(JSON.stringify(settings.value.security)))

// Load settings from localStorage on mount
onMounted(() => {
  // Load theme
  const savedTheme = localStorage.getItem('theme') || 'auto'
  settings.value.general.theme = savedTheme
  
  // Load notifications preference
  const savedNotifications = localStorage.getItem('notifications')
  if (savedNotifications !== null) {
    settings.value.general.notifications = savedNotifications === 'true'
  }
  
  // Load email alerts preference
  const savedEmailAlerts = localStorage.getItem('emailAlerts')
  if (savedEmailAlerts !== null) {
    settings.value.general.emailAlerts = savedEmailAlerts === 'true'
  }
  
  // Load language preference
  const savedLanguage = localStorage.getItem('language')
  if (savedLanguage) {
    settings.value.general.language = savedLanguage
  }
  
  // Update backups with loaded values
  generalSettingsBackup.value = JSON.parse(JSON.stringify(settings.value.general))
})

// Watch theme changes and apply them immediately
watch(() => settings.value.general.theme, (newTheme) => {
  applyTheme(newTheme)
})

const applyTheme = (themeValue) => {
  if (themeValue === 'auto') {
    // Auto theme: detect system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    theme.global.name.value = prefersDark ? 'dark' : 'light'
  } else {
    theme.global.name.value = themeValue
  }
  localStorage.setItem('theme', themeValue)
}

const saveGeneralSettings = async () => {
  savingSettings.value = true
  try {
    // Save to localStorage
    localStorage.setItem('notifications', settings.value.general.notifications.toString())
    localStorage.setItem('emailAlerts', settings.value.general.emailAlerts.toString())
    localStorage.setItem('language', settings.value.general.language)
    applyTheme(settings.value.general.theme)
    
    console.log('Saving general settings:', settings.value.general)
    successMessage.value = 'General settings saved successfully'
    generalSettingsBackup.value = JSON.parse(JSON.stringify(settings.value.general))
    setTimeout(() => (successMessage.value = ''), 3000)
  } catch (error) {
    errorMessage.value = 'Failed to save general settings'
  } finally {
    savingSettings.value = false
  }
}// Save to localStorage
    localStorage.setItem('profileVisibility', settings.value.privacy.profileVisibility.toString())
    localStorage.setItem('showOnlineStatus', settings.value.privacy.showOnlineStatus.toString())
    localStorage.setItem('allowMessages', settings.value.privacy.allowMessages.toString())
    localStorage.setItem('dataCollection', settings.value.privacy.dataCollection)
    
    

const savePrivacySettings = async () => {
  savingSettings.value = true
  try {
    console.log('Saving privacy settings:', settings.value.privacy)
    successMessage.value = 'Privacy settings saved successfully'
    privacySettingsBackup.value = JSON.parse(JSON.stringify(settings.value.privacy))
    setTimeout(() => (successMessage.value = ''), 3000)
  } catch (error) {
    errorMessage.value = 'Failed to save privacy settings'
  } finally {
    savingSettings.value = false
  }// Save to localStorage
    localStorage.setItem('twoFactorAuth', settings.value.security.twoFactorAuth.toString())
    localStorage.setItem('loginNotifications', settings.value.security.loginNotifications.toString())
    localStorage.setItem('sessionTimeout', settings.value.security.sessionTimeout.toString())
    localStorage.setItem('sessionDuration', settings.value.security.sessionDuration.toString())
    
    
}

const saveSecuritySettings = async () => {
  savingSettings.value = true
  try {
    console.log('Saving security settings:', settings.value.security)
    successMessage.value = 'Security settings saved successfully'
    securitySettingsBackup.value = JSON.parse(JSON.stringify(settings.value.security))
    setTimeout(() => (successMessage.value = ''), 3000)
  } catch (error) {
    errorMessage.value = 'Failed to save security settings'
  } finally {
    savingSettings.value = false
  }
}

const saveAccountSettings = async () => {
  savingSettings.value = true
  try {
    console.log('Saving account settings:', settings.value.account)
    successMessage.value = 'Account settings saved successfully'
    setTimeout(() => (successMessage.value = ''), 3000)
  } catch (error) {
    errorMessage.value = 'Failed to save account settings'
  } finally {
    savingSettings.value = false
  }
}

const resetGeneralSettings = () => {
  settings.value.general = JSON.parse(JSON.stringify(generalSettingsBackup.value))
}

const resetPrivacySettings = () => {
  settings.value.privacy = JSON.parse(JSON.stringify(privacySettingsBackup.value))
}

const resetSecuritySettings = () => {
  settings.value.security = JSON.parse(JSON.stringify(securitySettingsBackup.value))
}

const removeConnectedAccount = (account) => {
  settings.value.account.connectedAccounts = settings.value.account.connectedAccounts.filter(a => a !== account)
}

const confirmDeleteAccount = async () => {
  deletingAccount.value = true
  try {
    // Simulate API call to delete account
    console.log('Deleting account...')
    await logout()
    router.push('/login')
  } catch (error) {
    errorMessage.value = 'Failed to delete account'
    deletingAccount.value = false
  }
}
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}
</style>
