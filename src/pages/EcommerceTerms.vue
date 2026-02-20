<template>
  <v-container class="ecom-legal-page" fluid>
    <div class="ecom-bg" />
    <EcommerceHeader 
      :show-back-button="true"
    />

    <main class="legal-content">
      <div class="legal-card">
        <div class="legal-eyebrow">Terms</div>
        <h1 class="legal-title">Terms of service.</h1>
        <p class="legal-lede">
          By placing an order, you agree to the terms below. Please read them carefully.
        </p>

        <section class="legal-section">
          <h2>Orders</h2>
          <p>
            Orders are confirmed after payment is received. We reserve the right to cancel
            orders for inventory or payment issues.
          </p>
        </section>

        <section class="legal-section">
          <h2>Pricing</h2>
          <p>
            Prices are shown in INR and may change without notice. Promotions are time-limited
            and cannot be combined unless stated.
          </p>
        </section>

        <section class="legal-section">
          <h2>Liability</h2>
          <p>
            We are not responsible for indirect or incidental damages arising from use of
            the service.
          </p>
        </section>
      </div>
    </main>

    <EcommerceFooter />
  </v-container>
</template>

<script setup>
import EcommerceHeader from '@/components/EcommerceHeader.vue'
import EcommerceFooter from '@/components/EcommerceFooter.vue'
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=Space+Grotesk:wght@400;500;600&display=swap');

.ecom-legal-page {
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

.legal-content {
  margin-top: 28px;
}

.legal-card {
  max-width: 820px;
  margin: 0 auto;
  background: #fff;
  border-radius: 20px;
  padding: 32px 36px;
  box-shadow: 0 24px 40px rgba(31, 26, 22, 0.08);
}

.legal-eyebrow {
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 12px;
  color: var(--ecom-forest);
  font-weight: 600;
}

.legal-title {
  font-size: 32px;
  margin: 8px 0 12px;
}

.legal-lede {
  color: var(--ecom-muted);
  margin-bottom: 20px;
}

.legal-section {
  margin-top: 22px;
}

.legal-section h2 {
  font-size: 18px;
  margin-bottom: 8px;
}

.legal-section p {
  color: var(--ecom-muted);
}

@media (max-width: 600px) {
  .ecom-legal-page {
    padding: 20px 16px 32px;
  }
}
</style>
