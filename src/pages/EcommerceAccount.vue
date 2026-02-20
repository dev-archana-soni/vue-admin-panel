<template>
  <v-container class="ecom-auth-page" fluid>
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
        <RouterLink to="/ecommerce/about" class="ecom-link">About Us</RouterLink>
        <RouterLink to="/ecommerce/support" class="ecom-link">Support</RouterLink>
      </nav>
      <div class="ecom-actions">
        <v-btn variant="text" @click="handleLogout">
          Sign Out
        </v-btn>
      </div>
    </header>

    <main class="account-content">
      <div class="account-card">
        <div class="account-eyebrow">My Account</div>
        <h1 class="account-title">{{ profile.name }}</h1>
        <p class="account-lede">{{ profile.email }}</p>

        <v-alert v-if="errorMessage" type="error" closable class="mb-4" @click:close="errorMessage = ''">
          {{ errorMessage }}
        </v-alert>

        <v-alert v-if="successMessage" type="success" closable class="mb-4" @click:close="successMessage = ''">
          {{ successMessage }}
        </v-alert>

        <v-tabs v-model="activeTab" class="mb-4">
          <v-tab value="profile">Profile</v-tab>
          <v-tab value="password">Password</v-tab>
        </v-tabs>

        <v-window v-model="activeTab">
          <!-- Profile Tab -->
          <v-window-item value="profile">
            <v-form @submit.prevent="handleUpdateProfile">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="profileForm.firstName"
                    label="First Name"
                    variant="outlined"
                    density="comfortable"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="profileForm.lastName"
                    label="Last Name"
                    variant="outlined"
                    density="comfortable"
                  />
                </v-col>
              </v-row>

              <v-text-field
                v-model="profileForm.phone"
                label="Phone Number"
                variant="outlined"
                density="comfortable"
                class="mb-3"
              />

              <v-textarea
                v-model="profileForm.address"
                label="Address"
                variant="outlined"
                density="comfortable"
                rows="3"
                class="mb-3"
              />

              <v-file-input
                v-model="profileForm.imageFile"
                label="Profile Picture"
                variant="outlined"
                density="comfortable"
                accept="image/*"
                prepend-icon=""
                prepend-inner-icon="mdi-camera"
                class="mb-4"
              />

              <v-img
                v-if="profile.image"
                :src="profile.image"
                max-width="120"
                max-height="120"
                class="mb-4 rounded"
              />

              <v-btn
                type="submit"
                color="primary"
                variant="flat"
                block
                size="large"
                :loading="submittingProfile"
              >
                Update Profile
              </v-btn>
            </v-form>
          </v-window-item>

          <!-- Password Tab -->
          <v-window-item value="password">
            <v-form @submit.prevent="handleUpdatePassword">
              <v-text-field
                v-model="passwordForm.currentPassword"
                label="Current Password *"
                type="password"
                variant="outlined"
                density="comfortable"
                :error="!!passwordErrors.currentPassword"
                :error-messages="passwordErrors.currentPassword"
                class="mb-3"
              />

              <v-text-field
                v-model="passwordForm.newPassword"
                label="New Password *"
                type="password"
                variant="outlined"
                density="comfortable"
                :error="!!passwordErrors.newPassword"
                :error-messages="passwordErrors.newPassword"
                class="mb-3"
              />

              <v-text-field
                v-model="passwordForm.confirmPassword"
                label="Confirm New Password *"
                type="password"
                variant="outlined"
                density="comfortable"
                :error="!!passwordErrors.confirmPassword"
                :error-messages="passwordErrors.confirmPassword"
                class="mb-4"
              />

              <v-btn
                type="submit"
                color="primary"
                variant="flat"
                block
                size="large"
                :loading="submittingPassword"
              >
                Change Password
              </v-btn>
            </v-form>
          </v-window-item>
        </v-window>
      </div>
    </main>

    <footer class="ecom-footer">
      <div>
        <div class="footer-title">Evercart</div>
        <div class="footer-text">Reliable commerce for teams that move fast.</div>
      </div>
      <div class="footer-links">
        <span>Shipping</span>
        <RouterLink class="footer-link" to="/ecommerce/returns">Returns</RouterLink>
        <RouterLink class="footer-link" to="/ecommerce/privacy">Privacy</RouterLink>
        <RouterLink class="footer-link" to="/ecommerce/terms">Terms</RouterLink>
        <RouterLink class="footer-link" to="/ecommerce/support">Support</RouterLink>
      </div>
      <div class="footer-meta">© 2026 Evercart Studio</div>
    </footer>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { clearAuth, getProfile, updateProfile, updatePassword } = useAuth()

const activeTab = ref('profile')
const profile = ref({
  name: '',
  email: '',
  firstName: '',
  lastName: '',
  phone: '',
  address: '',
  image: ''
})

const profileForm = ref({
  firstName: '',
  lastName: '',
  phone: '',
  address: '',
  imageFile: []
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordErrors = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const errorMessage = ref('')
const successMessage = ref('')
const submittingProfile = ref(false)
const submittingPassword = ref(false)

const loadProfile = async () => {
  try {
    const response = await getProfile()
    profile.value = response.user
    profileForm.value = {
      firstName: response.user.firstName || '',
      lastName: response.user.lastName || '',
      phone: response.user.phone || '',
      address: response.user.address || '',
      imageFile: []
    }
  } catch (error) {
    errorMessage.value = 'Failed to load profile'
  }
}

const handleUpdateProfile = async () => {
  submittingProfile.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const formData = new FormData()
    formData.append('firstName', profileForm.value.firstName)
    formData.append('lastName', profileForm.value.lastName)
    formData.append('phone', profileForm.value.phone)
    formData.append('address', profileForm.value.address)
    
    if (profileForm.value.imageFile && profileForm.value.imageFile.length > 0) {
      formData.append('image', profileForm.value.imageFile[0])
    }

    const response = await updateProfile(formData)
    profile.value = response.user
    successMessage.value = 'Profile updated successfully'
  } catch (error) {
    errorMessage.value = error.message || 'Failed to update profile'
  } finally {
    submittingProfile.value = false
  }
}

const validatePasswordForm = () => {
  passwordErrors.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }

  let valid = true

  if (!passwordForm.value.currentPassword) {
    passwordErrors.value.currentPassword = 'Current password is required'
    valid = false
  }

  if (!passwordForm.value.newPassword || passwordForm.value.newPassword.length < 6) {
    passwordErrors.value.newPassword = 'New password must be at least 6 characters'
    valid = false
  }

  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordErrors.value.confirmPassword = 'Passwords do not match'
    valid = false
  }

  return valid
}

const handleUpdatePassword = async () => {
  if (!validatePasswordForm()) return

  submittingPassword.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    await updatePassword(
      passwordForm.value.currentPassword,
      passwordForm.value.newPassword,
      passwordForm.value.confirmPassword
    )
    successMessage.value = 'Password changed successfully'
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  } catch (error) {
    errorMessage.value = error.message || 'Failed to change password'
  } finally {
    submittingPassword.value = false
  }
}

const handleLogout = () => {
  clearAuth()
  router.push('/ecommerce')
}

onMounted(() => {
  loadProfile()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=Space+Grotesk:wght@400;500;600&display=swap');

.ecom-auth-page {
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
.account-content,
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

.account-content {
  margin-top: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.account-card {
  max-width: 640px;
  width: 100%;
  background: #fff;
  border-radius: 20px;
  padding: 32px 36px;
  box-shadow: 0 24px 40px rgba(31, 26, 22, 0.08);
}

.account-eyebrow {
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 12px;
  color: var(--ecom-forest);
  font-weight: 600;
}

.account-title {
  font-size: 28px;
  margin: 8px 0 4px;
}

.account-lede {
  color: var(--ecom-muted);
  margin-bottom: 20px;
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
  .ecom-auth-page {
    padding: 20px 16px 32px;
  }

  .account-card {
    padding: 24px 20px;
  }
}
</style>
