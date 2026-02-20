<template>
  <v-container class="ecom-legal-page" fluid>
    <div class="ecom-bg" />
    <EcommerceHeader 
      :show-back-button="true"
    />

    <main class="legal-content">
      <div class="legal-card">
        <div class="legal-eyebrow">Support</div>
        <h1 class="legal-title">We're here to help.</h1>
        <p class="legal-lede">
          Have questions or need assistance? We're ready to help you with your order or any concerns.
        </p>

        <section class="legal-section">
          <h2>Contact us</h2>
          <p>
            Email us at <a href="mailto:support@evercart.com" class="support-link">support@evercart.com</a> and 
            we'll respond within 24 hours.
          </p>
          <p>
            For urgent matters, call us at <strong>+91 98765 43210</strong> (Mon-Fri, 9 AM - 6 PM IST).
          </p>
        </section>

        <section class="legal-section">
          <h2>Frequently asked questions</h2>
          <div class="faq-item">
            <h3>How long does shipping take?</h3>
            <p>Standard delivery takes 3-5 business days. Express delivery is available for select locations.</p>
          </div>
          <div class="faq-item">
            <h3>Can I track my order?</h3>
            <p>Yes, you'll receive a tracking link via email once your order ships.</p>
          </div>
          <div class="faq-item">
            <h3>What payment methods do you accept?</h3>
            <p>We accept credit/debit cards, UPI, net banking, and digital wallets.</p>
          </div>
          <div class="faq-item">
            <h3>How do I cancel or modify my order?</h3>
            <p>Contact support within 2 hours of placing your order for cancellations or modifications.</p>
          </div>
        </section>

        <section class="legal-section">
          <h2>Order issues</h2>
          <ul>
            <li>Damaged or defective items? Contact us with photos for a quick replacement.</li>
            <li>Wrong item delivered? We'll arrange a pickup and send the correct one.</li>
            <li>Missing items? Let us know and we'll investigate immediately.</li>
          </ul>
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
  margin-bottom: 8px;
}

.legal-section ul {
  padding-left: 20px;
  color: var(--ecom-muted);
}

.support-link {
  color: var(--ecom-forest);
  text-decoration: none;
  font-weight: 600;
}

.support-link:hover {
  text-decoration: underline;
}

.faq-item {
  margin-top: 16px;
}

.faq-item h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 6px;
}

.faq-item p {
  color: var(--ecom-muted);
}

@media (max-width: 600px) {
  .ecom-legal-page {
    padding: 20px 16px 32px;
  }
}
</style>
