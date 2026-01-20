<template>
  <v-container class="fill-height d-flex align-center justify-center" fluid>
    <v-card class="pa-8" max-width="480">
      <div class="text-h5 mb-6">Create Account</div>

      <!-- Error Alert -->
      <v-alert v-if="errorMessage" type="error" variant="tonal" class="mb-4" closable @input="errorMessage = ''">
        {{ errorMessage }}
      </v-alert>

      <!-- Success Alert -->
      <v-alert v-if="successMessage" type="success" variant="tonal" class="mb-4" closable @input="successMessage = ''">
        {{ successMessage }}
      </v-alert>

      <v-row dense>
        <v-col cols="12">
          <v-text-field
            v-model="form.name"
            label="Full Name"
            variant="outlined"
            density="comfortable"
            :error="!!formErrors.name"
            :error-messages="formErrors.name"
            @blur="validateField('name')"
            @input="clearFieldError('name')"
          />
        </v-col>
      </v-row>

      <v-text-field
        v-model="form.email"
        label="Email"
        type="email"
        prepend-inner-icon="mdi-email"
        variant="outlined"
        density="comfortable"
        class="mb-2"
        :error="!!formErrors.email"
        :error-messages="formErrors.email"
        @blur="validateField('email')"
        @input="clearFieldError('email')"
      />

      <v-text-field
        v-model="form.password"
        label="Password"
        :type="showPassword ? 'text' : 'password'"
        prepend-inner-icon="mdi-lock"
        :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append-inner="showPassword = !showPassword"
        variant="outlined"
        density="comfortable"
        class="mb-2"
        :error="!!formErrors.password"
        :error-messages="formErrors.password"
        @blur="validateField('password')"
        @input="clearFieldError('password')"
      />

      <v-text-field
        v-model="form.confirmPassword"
        label="Confirm Password"
        :type="showConfirmPassword ? 'text' : 'password'"
        prepend-inner-icon="mdi-lock"
        :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append-inner="showConfirmPassword = !showConfirmPassword"
        variant="outlined"
        density="comfortable"
        class="mb-4"
        :error="!!formErrors.confirmPassword"
        :error-messages="formErrors.confirmPassword"
        @blur="validateField('confirmPassword')"
        @input="clearFieldError('confirmPassword')"
      />

      <v-checkbox v-model="form.terms" class="mb-4">
        <template #label>
          <span class="text-body-2">I agree to the <a href="#" class="text-primary">Terms & Conditions</a></span>
        </template>
      </v-checkbox>
      <p v-if="formErrors.terms" class="text-error text-body-2 mb-3">{{ formErrors.terms }}</p>

      <v-btn
        block
        color="primary"
        class="mb-3"
        @click="onSubmit"
        :loading="isLoading"
        :disabled="isLoading"
      >
        {{ isLoading ? 'Registering...' : 'Register' }}
      </v-btn>

      <div class="text-center text-body-2">
        Already have an account? <router-link to="/login" class="text-primary">Sign in</router-link>
      </div>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { register } = useAuth()

const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  terms: false
})

const formErrors = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  terms: ''
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// Validation rules
const validators = {
  name: (value) => {
    if (!value) return 'Name is required'
    if (value.length < 2) return 'Name must be at least 2 characters'
    return true
  },
  email: (value) => {
    if (!value) return 'Email is required'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value) || 'Email must be valid'
  },
  password: (value) => {
    if (!value) return 'Password is required'
    if (value.length < 6) return 'Password must be at least 6 characters'
    return true
  },
  confirmPassword: (value) => {
    if (!value) return 'Please confirm your password'
    if (value !== form.value.password) return 'Passwords do not match'
    return true
  },
  terms: (value) => {
    return value === true || 'You must agree to Terms & Conditions'
  }
}

// Validation functions
const validateField = (field) => {
  const validator = validators[field]
  if (validator) {
    const result = validator(form.value[field])
    formErrors.value[field] = result === true ? '' : result
  }
}

const clearFieldError = (field) => {
  formErrors.value[field] = ''
}

const validateForm = () => {
  let isValid = true
  Object.keys(validators).forEach((field) => {
    validateField(field)
    if (formErrors.value[field]) isValid = false
  })
  return isValid
}

const onSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    await register(form.value.email, form.value.password, form.value.name)
    successMessage.value = 'Registration successful! Redirecting...'

    // Redirect to dashboard after a short delay
    setTimeout(() => {
      router.push('/dashboard')
    }, 1000)
  } catch (error) {
    errorMessage.value = error.message || 'Registration failed. Please try again.'
    console.error('Registration error:', error)
  } finally {
    isLoading.value = false
  }
}
</script>
