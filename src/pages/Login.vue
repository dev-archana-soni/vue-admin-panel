<template>
  <v-container class="fill-height d-flex align-center justify-center" fluid>
    <v-card class="pa-8" max-width="420">
      <div class="text-h5 mb-6">Sign in</div>

      <!-- Error Alert -->
      <v-alert v-if="errorMessage" type="error" variant="tonal" class="mb-4" closable @input="errorMessage = ''">
        {{ errorMessage }}
      </v-alert>

      <!-- Success Alert -->
      <v-alert v-if="successMessage" type="success" variant="tonal" class="mb-4" closable @input="successMessage = ''">
        {{ successMessage }}
      </v-alert>

      <!-- Email Field with Validation -->
      <v-text-field
        v-model="email"
        label="Email"
        type="email"
        prepend-inner-icon="mdi-email"
        variant="outlined"
        density="comfortable"
        class="mb-4"
        :error="!!emailError"
        :error-messages="emailError"
        @blur="validateEmail"
        @input="emailError = ''"
      />

      <!-- Password Field with Validation -->
      <v-text-field
        v-model="password"
        label="Password"
        :type="showPassword ? 'text' : 'password'"
        prepend-inner-icon="mdi-lock"
        :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append-inner="showPassword = !showPassword"
        variant="outlined"
        density="comfortable"
        class="mb-6"
        :error="!!passwordError"
        :error-messages="passwordError"
        @blur="validatePassword"
        @input="passwordError = ''"
      />

      <!-- Submit Button -->
      <v-btn
        block
        color="primary"
        class="mb-3"
        @click="onSubmit"
        :loading="isLoading"
        :disabled="isLoading"
      >
        {{ isLoading ? 'Signing in...' : 'Login' }}
      </v-btn>

      <div class="text-center text-body-2">
        Don't have an account? <router-link to="/register" class="text-primary">Register</router-link>
      </div>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { login } = useAuth()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const emailError = ref('')
const passwordError = ref('')

// Validation rules
const isValidEmail = (value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(value) || 'Email must be valid'
}

const isValidPassword = (value) => {
  return value.length >= 6 || 'Password must be at least 6 characters'
}

// Validation functions
const validateEmail = () => {
  if (!email.value) {
    emailError.value = 'Email is required'
    return false
  }
  const result = isValidEmail(email.value)
  emailError.value = result === true ? '' : result
  return result === true
}

const validatePassword = () => {
  if (!password.value) {
    passwordError.value = 'Password is required'
    return false
  }
  const result = isValidPassword(password.value)
  passwordError.value = result === true ? '' : result
  return result === true
}

const validateForm = () => {
  const emailValid = validateEmail()
  const passwordValid = validatePassword()
  return emailValid && passwordValid
}

const onSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    await login(email.value, password.value)
    successMessage.value = 'Login successful! Redirecting...'
    
    // Redirect to dashboard after a short delay
    setTimeout(() => {
      router.push('/dashboard')
    }, 1000)
  } catch (error) {
    errorMessage.value = error.message || 'Login failed. Please try again.'
    console.error('Login error:', error)
  } finally {
    isLoading.value = false
  }
}
</script>
