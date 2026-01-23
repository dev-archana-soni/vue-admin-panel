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

    <v-row>
      <v-col cols="12" md="4">
        <v-card class="pa-6 d-flex flex-column align-center">
          <v-avatar size="96" class="mb-4">
            <v-img :src="imagePreview || profile.image || 'https://cdn.vuetifyjs.com/images/john.jpg'" alt="Profile" />
          </v-avatar>
          <div v-if="isEditing" class="mb-3">
            <v-file-input
              v-model="selectedImage"
              label="Upload Avatar"
              accept="image/*"
              prepend-icon="mdi-camera"
              @change="onImageSelected"
              variant="outlined"
              density="comfortable"
              class="mt-2"
              clearable
            />
          </div>
          <div class="text-h6">{{ profile.name }}</div>
          <div class="text-body-2 text-medium-emphasis mb-4">{{ profile.role }}</div>
          <v-btn 
            size="small" 
            variant="text" 
            color="primary" 
            class="mb-3"
            @click="showPasswordDialog = true"
          >
            Update Password
          </v-btn>
          <v-btn color="primary" variant="flat" @click="isEditing = !isEditing">
            {{ isEditing ? 'Cancel' : 'Edit Profile' }}
          </v-btn>
        </v-card>
      </v-col>
      <v-col cols="12" md="8">
        <v-card class="pa-6">
          <div class="text-subtitle-1 mb-4">Account Details</div>
          <v-row dense>
            <v-col cols="12" sm="6">
              <v-text-field 
                label="First name" 
                v-model="form.firstName" 
                :readonly="!isEditing" 
                variant="outlined" 
                density="comfortable" 
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field 
                label="Last name" 
                v-model="form.lastName" 
                :readonly="!isEditing" 
                variant="outlined" 
                density="comfortable" 
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field 
                label="Email" 
                v-model="profile.email" 
                readonly 
                variant="outlined" 
                density="comfortable" 
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field 
                label="Phone" 
                v-model="form.phone" 
                :readonly="!isEditing" 
                variant="outlined" 
                density="comfortable" 
              />
            </v-col>
            <v-col cols="12">
              <v-text-field 
                label="Address" 
                v-model="form.address" 
                :readonly="!isEditing" 
                variant="outlined" 
                density="comfortable" 
              />
            </v-col>
            <v-col cols="12" v-if="isEditing" class="d-flex gap-2">
              <v-btn color="success" variant="flat" @click="updateProfile" :loading="updating">
                Save Changes
              </v-btn>
              <v-btn variant="outlined" @click="resetForm">
                Reset
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- Password Update Dialog -->
    <v-dialog v-model="showPasswordDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h6 bg-primary text-white">Update Password</v-card-title>
        <v-card-text class="pt-6">
          <!-- Password Dialog Errors -->
          <v-alert v-if="passwordErrors" type="error" closable class="mb-4" @click:close="passwordErrors = ''">
            {{ passwordErrors }}
          </v-alert>

          <!-- Password Dialog Success -->
          <v-alert v-if="passwordSuccess" type="success" closable class="mb-4" @click:close="passwordSuccess = ''">
            {{ passwordSuccess }}
          </v-alert>

          <v-row dense>
            <v-col cols="12">
              <v-text-field
                v-model="passwordForm.currentPassword"
                label="Current Password"
                type="password"
                variant="outlined"
                density="comfortable"
                :error="!!passwordFieldErrors.currentPassword"
                :error-messages="passwordFieldErrors.currentPassword"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="passwordForm.newPassword"
                label="New Password"
                type="password"
                variant="outlined"
                density="comfortable"
                hint="Minimum 6 characters"
                :error="!!passwordFieldErrors.newPassword"
                :error-messages="passwordFieldErrors.newPassword"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="passwordForm.confirmPassword"
                label="Confirm Password"
                type="password"
                variant="outlined"
                density="comfortable"
                :error="!!passwordFieldErrors.confirmPassword"
                :error-messages="passwordFieldErrors.confirmPassword"
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="outlined" @click="closePasswordDialog">Cancel</v-btn>
          <v-btn color="primary" variant="flat" @click="handlePasswordUpdate" :loading="updatingPassword">
            Update Password
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { authAPI } from '@/services/authService'

const { token, user } = useAuth()

const profile = ref({
  id: '',
  name: '',
  email: '',
  role: '',
  firstName: '',
  lastName: '',
  phone: '',
  address: '',
  image: ''
})

const form = ref({
  firstName: '',
  lastName: '',
  phone: '',
  address: ''
})

const selectedImage = ref(null)
const imagePreview = ref(null)

const isEditing = ref(false)
const loading = ref(false)
const updating = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const showPasswordDialog = ref(false)
const updatingPassword = ref(false)
const passwordErrors = ref('')
const passwordSuccess = ref('')

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordFieldErrors = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const fetchProfile = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    const response = await authAPI.fetchProfile(token.value)
    console.log('Fetched profile data:', response.user)
    console.log('Profile image URL:', response.user.image)
    profile.value = response.user
    form.value = {
      firstName: response.user.firstName || '',
      lastName: response.user.lastName || '',
      phone: response.user.phone || '',
      address: response.user.address || ''
    }
  } catch (error) {
    errorMessage.value = error.message || 'Failed to load profile'
    console.error('Fetch profile error:', error)
  } finally {
    loading.value = false
  }
}

const updateProfile = async () => {
  updating.value = true
  errorMessage.value = ''
  successMessage.value = ''
  try {
    const formData = new FormData()
    formData.append('firstName', form.value.firstName)
    formData.append('lastName', form.value.lastName)
    formData.append('phone', form.value.phone)
    formData.append('address', form.value.address)
    
    // v-file-input returns a File object directly (not an array) when not using 'multiple'
    if (selectedImage.value) {
      // Normalize to array format to handle both single file and array cases
      const files = Array.isArray(selectedImage.value) 
        ? selectedImage.value 
        : [selectedImage.value]
      
      if (files.length > 0 && files[0] instanceof File) {
        console.log('Adding image to profile payload:', files[0])
        formData.append('image', files[0])
      } else {
        console.log('No valid file object found in profile')
      }
    }

    const response = await authAPI.updateProfile(token.value, formData)
    console.log('Update profile response:', response)
    console.log('Updated image URL:', response.user?.image)
    profile.value = response.user
    
    // Update the preview with the saved image URL from backend
    if (response.user && response.user.image) {
      profile.value.image = response.user.image
      console.log('Profile image updated to:', profile.value.image)
    }
    
    imagePreview.value = null
    selectedImage.value = null
    isEditing.value = false
    successMessage.value = response.message || 'Profile updated successfully'
  } catch (error) {
    errorMessage.value = error.message || 'Failed to update profile'
    console.error('Update profile error:', error)
  } finally {
    updating.value = false
  }
}

const resetForm = () => {
  form.value = {
    firstName: profile.value.firstName || '',
    lastName: profile.value.lastName || '',
    phone: profile.value.phone || '',
    address: profile.value.address || ''
  }
  selectedImage.value = null
  imagePreview.value = null
  isEditing.value = false
}

const validatePasswordForm = () => {
  passwordFieldErrors.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }

  if (!passwordForm.value.currentPassword) {
    passwordFieldErrors.value.currentPassword = 'Current password is required'
  }

  if (!passwordForm.value.newPassword) {
    passwordFieldErrors.value.newPassword = 'New password is required'
  } else if (passwordForm.value.newPassword.length < 6) {
    passwordFieldErrors.value.newPassword = 'Password must be at least 6 characters'
  }

  if (!passwordForm.value.confirmPassword) {
    passwordFieldErrors.value.confirmPassword = 'Please confirm your password'
  } else if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordFieldErrors.value.confirmPassword = 'Passwords do not match'
  }

  return !Object.values(passwordFieldErrors.value).some(error => error)
}

const onImageSelected = () => {
  console.log('Image selected in profile:', selectedImage.value)

  // v-file-input can provide a single File or an array; normalize to the first file
  const files = Array.isArray(selectedImage.value)
    ? selectedImage.value
    : selectedImage.value
      ? [selectedImage.value]
      : []

  if (!files.length) {
    imagePreview.value = null
    return
  }

  const file = files[0]
  console.log('File details:', {
    name: file.name,
    type: file.type,
    size: file.size
  })
  
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target.result
    console.log('Image preview set in profile')
  }
  reader.readAsDataURL(file)
}

const handlePasswordUpdate = async () => {
  if (!validatePasswordForm()) {
    return
  }

  updatingPassword.value = true
  passwordErrors.value = ''
  passwordSuccess.value = ''

  try {
    const response = await authAPI.updatePassword(token.value, {
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword,
      confirmPassword: passwordForm.value.confirmPassword
    })
    passwordSuccess.value = response.message || 'Password updated successfully'
    resetPasswordForm()
    setTimeout(() => {
      closePasswordDialog()
    }, 1500)
  } catch (error) {
    passwordErrors.value = error.message || 'Failed to update password'
    console.error('Update password error:', error)
  } finally {
    updatingPassword.value = false
  }
}

const resetPasswordForm = () => {
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  passwordFieldErrors.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
}

const closePasswordDialog = () => {
  showPasswordDialog.value = false
  resetPasswordForm()
  passwordErrors.value = ''
  passwordSuccess.value = ''
}

onMounted(() => {
  if (token.value) {
    fetchProfile()
  }
})
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}
</style>
