<script setup>
import { SingularityBackground } from '@/components/ui/bg-singularity'
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
  <div class="relative min-h-[100dvh] bg-white dark:bg-zinc-950">
    <SingularityBackground
      class="!absolute inset-0 z-0"
      :hue="0.6"
      :speed="0.3"
      :mouse-sensitivity="0.3"
      :interactive="false"
    />

    <div class="relative z-10 mx-auto max-w-2xl px-6 pt-24 pb-24">
      <h1 class="text-3xl font-bold text-zinc-900 dark:text-white">날씨 대시보드</h1>
      <p class="mt-2 text-zinc-500 dark:text-zinc-400">실시간 날씨 데이터 시각화 페이지입니다.</p>

      <div class="mt-8 space-y-2">
        <RouterLink
          v-for="page in pages"
          :key="page.path"
          :to="page.path"
          class="flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-300 border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-600 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-300 dark:hover:border-white/[0.15] dark:hover:bg-white/[0.08] dark:hover:text-white"
        >
          <Icon icon="solar:cloud-linear" class="size-4 shrink-0 text-zinc-400 dark:text-zinc-500" />
          {{ page.name }}
          <Icon icon="solar:arrow-right-linear" class="ml-auto size-3.5 text-zinc-300 dark:text-zinc-600" />
        </RouterLink>
      </div>
    </div>
  </div>
</template>
