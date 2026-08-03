<script setup>
import { RouterView } from 'vue-router'
import AppTopBar from '@/components/layout/AppTopBar.vue'
</script>

<template>
  <div class="min-h-[100dvh] bg-white text-slate-950 dark:bg-zinc-950 dark:text-zinc-50">
    <AppTopBar />
    <RouterView />
  </div>
</template>
