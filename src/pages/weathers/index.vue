<script setup>
import { RouterLink } from 'vue-router'
import { Icon } from '@iconify/vue'

defineOptions({ name: 'WeathersIndex' })

const modules = import.meta.glob('./*.vue', { eager: false })
const pages = Object.keys(modules)
  .filter(p => !p.includes('/index.vue'))
  .map(p => ({
    path: p.replace('./', '/weathers/').replace('.vue', ''),
    name: p.split('/').pop()?.replace('.vue', '') || '',
  }))
  .sort((a, b) => a.name.localeCompare(b.name))
</script>

<template>
  <div class="min-h-[100dvh] bg-white pt-24 pb-24 dark:bg-zinc-950">
    <div class="mx-auto max-w-2xl px-6">
      <h1 class="text-3xl font-bold text-zinc-900 dark:text-white">날씨 대시보드</h1>
      <p class="mt-2 text-zinc-500 dark:text-zinc-400">실시간 날씨 데이터 시각화 페이지입니다.</p>

      <div class="mt-8 space-y-2">
        <RouterLink
          v-for="page in pages"
          :key="page.path"
          :to="page.path"
          class="flex items-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50/50 px-4 py-3 text-zinc-700 transition-all duration-300 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-600 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-300 dark:hover:border-sky-800 dark:hover:bg-sky-950 dark:hover:text-sky-400"
        >
          <Icon icon="solar:cloud-linear" class="size-4 shrink-0 text-zinc-400" />
          <span class="text-sm font-medium">{{ page.name }}</span>
          <Icon icon="solar:arrow-right-linear" class="ml-auto size-3.5 text-zinc-300" />
        </RouterLink>
      </div>
    </div>
  </div>
</template>
