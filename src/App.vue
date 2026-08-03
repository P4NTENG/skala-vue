<script setup>
import { RouterView } from 'vue-router'
import AppTopBar from '@/components/layout/AppTopBar.vue'
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-slate-950">
    <AppTopBar />
    <RouterView />
  </div>
</template>
