<template>
  <v-container class="ecom-legal-page" fluid>
    <div class="ecom-bg" />
    <EcommerceHeader 
      :show-back-button="true"
    />

    <main class="legal-content">
      <div class="legal-card">
        <div class="legal-eyebrow">Returns</div>
        <h1 class="legal-title">Easy returns, no stress.</h1>
        <p class="legal-lede">
          We want you to love every order. If something isn’t right, you can return
          eligible items within 7 days of delivery.
        </p>

        <section class="legal-section">
          <h2>Return eligibility</h2>
          <ul>
            <li>Items must be unused, in original packaging.</li>
            <li>Include the invoice or order confirmation email.</li>
            <li>Digital goods and final-sale items are not returnable.</li>
          </ul>
        </section>

        <section class="legal-section">
          <h2>How to start a return</h2>
          <ol>
            <li>Contact support with your order number.</li>
            <li>We’ll share a prepaid pickup label (if eligible).</li>
            <li>Once received and inspected, we process refunds in 3-5 business days.</li>
          </ol>
        </section>

        <section class="legal-section">
          <h2>Refunds</h2>
          <p>
            Refunds are issued to the original payment method. Shipping fees are non-refundable
            unless the return is due to our error.
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

.legal-section ul,
.legal-section ol {
  padding-left: 20px;
  color: var(--ecom-muted);
}

@media (max-width: 600px) {
  .ecom-legal-page {
    padding: 20px 16px 32px;
  }
}
</style>
