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
        <v-btn variant="outlined" @click="$router.push('/ecommerce/register')">
          Join Now
        </v-btn>
      </div>
    </header>

    <main class="auth-content">
      <div class="auth-card">
        <div class="auth-eyebrow">Welcome Back</div>
        <h1 class="auth-title">Sign in to your account</h1>
        <p class="auth-lede">
          Continue shopping with exclusive member benefits.
        </p>

        <v-alert v-if="errorMessage" type="error" closable class="mb-4" @click:close="errorMessage = ''">
          {{ errorMessage }}
        </v-alert>

        <v-form @submit.prevent="handleLogin">
          <v-text-field
            v-model="form.email"
            label="Email *"
            type="email"
            variant="outlined"
            density="comfortable"
            :error="!!formErrors.email"
            :error-messages="formErrors.email"
            class="mb-3"
          />
          <v-text-field
            v-model="form.password"
            label="Password *"
            type="password"
            variant="outlined"
            density="comfortable"
            :error="!!formErrors.password"
            :error-messages="formErrors.password"
            class="mb-4"
          />

          <v-btn
            type="submit"
            color="primary"
            variant="flat"
            block
            size="large"
            :loading="submitting"
          >
            Sign In
          </v-btn>
        </v-form>

        <div class="auth-footer">
          Don't have an account?
          <RouterLink to="/ecommerce/register" class="auth-link">Join now</RouterLink>
        </div>
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { login } = useAuth()

const form = ref({
  email: '',
  password: ''
})

const formErrors = ref({
  email: '',
  password: ''
})

const errorMessage = ref('')
const submitting = ref(false)

const validateForm = () => {
  formErrors.value = {
    email: '',
    password: ''
  }

  let valid = true
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!form.value.email || !emailPattern.test(form.value.email)) {
    formErrors.value.email = 'Valid email is required'
    valid = false
  }

  if (!form.value.password) {
    formErrors.value.password = 'Password is required'
    valid = false
  }

  return valid
}

const handleLogin = async () => {
  if (!validateForm()) return

  submitting.value = true
  errorMessage.value = ''

  try {
    await login(form.value.email, form.value.password)
    router.push('/ecommerce')
  } catch (error) {
    errorMessage.value = error.message || 'Login failed'
  } finally {
    submitting.value = false
  }
}
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
.auth-content,
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

.auth-content {
  margin-top: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.auth-card {
  max-width: 480px;
  width: 100%;
  background: #fff;
  border-radius: 20px;
  padding: 32px 36px;
  box-shadow: 0 24px 40px rgba(31, 26, 22, 0.08);
}

.auth-eyebrow {
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 12px;
  color: var(--ecom-forest);
  font-weight: 600;
}

.auth-title {
  font-size: 28px;
  margin: 8px 0 6px;
}

.auth-lede {
  color: var(--ecom-muted);
  margin-bottom: 20px;
}

.auth-footer {
  text-align: center;
  margin-top: 20px;
  color: var(--ecom-muted);
}

.auth-link {
  color: var(--ecom-forest);
  text-decoration: none;
  font-weight: 600;
}

.auth-link:hover {
  text-decoration: underline;
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
}
</style>
