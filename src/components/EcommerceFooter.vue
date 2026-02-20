<template>
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
</template>

<script setup>
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=Space+Grotesk:wght@400;500;600&display=swap');

.ecom-footer {
  position: relative;
  z-index: 1;
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
</style>
