<template>
  <v-container class="ecom-legal-page" fluid>
    <div class="ecom-bg" />
    <EcommerceHeader 
      :show-back-button="true"
    />

    <main class="legal-content">
      <div class="legal-card">
        <div class="legal-eyebrow">About Us</div>
        <h1 class="legal-title">Building better commerce experiences.</h1>
        <p class="legal-lede">
          Evercart is your trusted partner for everyday essentials, curated with care and delivered with speed.
        </p>

        <section class="legal-section">
          <h2>Our mission</h2>
          <p>
            We believe shopping should be simple, reliable, and delightful. That's why we've built a 
            platform that brings you quality products, transparent pricing, and exceptional service.
          </p>
        </section>

        <section class="legal-section">
          <h2>What makes us different</h2>
          <ul>
            <li>Carefully curated catalog of premium products</li>
            <li>Fast, reliable delivery within 3-5 business days</li>
            <li>Transparent pricing with no hidden fees</li>
            <li>7-day easy returns on all eligible items</li>
            <li>Responsive customer support via email and phone</li>
          </ul>
        </section>

        <section class="legal-section">
          <h2>Our story</h2>
          <p>
            Founded in 2024, Evercart started with a simple idea: make daily shopping effortless for 
            busy professionals and teams. What began as a small collection of office supplies has grown 
            into a comprehensive marketplace serving thousands of customers across India.
          </p>
        </section>

        <section class="legal-section">
          <h2>Get in touch</h2>
          <p>
            Have questions or feedback? We'd love to hear from you. Reach out to us at 
            <a href="mailto:hello@evercart.com" class="about-link">hello@evercart.com</a> or visit our 
            <RouterLink to="/ecommerce/support" class="about-link">Support page</RouterLink>.
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
  position: relative;
  z-index: 1;
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

.about-link {
  color: var(--ecom-forest);
  text-decoration: none;
  font-weight: 600;
}

.about-link:hover {
  text-decoration: underline;
}

@media (max-width: 600px) {
  .ecom-legal-page {
    padding: 20px 16px 32px;
  }
}
</style>
