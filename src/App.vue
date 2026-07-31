<script setup>
import { RouterView } from 'vue-router'
import AppTopBar from '@/components/layout/AppTopBar.vue'
</script>

<template>
  <VApp>
    <div class="app-shell">
      <AppTopBar />

      <div class="app-content">
        <RouterView />
      </div>
    </div>
  </VApp>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
}

.app-content {
  width: min(100% - 2rem, 1280px);
  margin: 0 auto;
  padding: 2.5rem 0;
}

@media (max-width: 720px) {
  .app-content {
    padding: 1.5rem 0;
  }
}
</style>
