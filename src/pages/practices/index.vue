<script setup>
import { RouterLink } from 'vue-router'
import { Icon } from '@iconify/vue'

defineOptions({ name: 'PracticesIndex' })

const modules = import.meta.glob('./**/*.vue', { eager: false })
const groups = new Map()

for (const path of Object.keys(modules)) {
  if (path.includes('/index.vue')) continue
  const parts = path.replace('./', '').split('/')
  const group = parts[0]
  const name = parts[parts.length - 1]?.replace('.vue', '') || ''
  if (!group || !name) continue

  if (!groups.has(group)) groups.set(group, [])
  groups.get(group).push({
    path: `/practices/${group}/${name}`,
    name: formatName(name),
  })
}

function formatName(v) {
  return v.split(/[-_.]+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}
</script>

<template>
  <div class="min-h-[100dvh] bg-white pt-24 pb-24 dark:bg-zinc-950">
    <div class="mx-auto max-w-2xl px-6">
      <h1 class="text-3xl font-bold text-zinc-900 dark:text-white">실습 목록</h1>
      <p class="mt-2 text-zinc-500 dark:text-zinc-400">Vue 3 핵심 개념별 실습 페이지입니다.</p>

      <div class="mt-10 space-y-8">
        <section v-for="[group, items] in [...groups.entries()].sort()" :key="group">
          <h2 class="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">
            {{ formatName(group) }}
          </h2>
          <div class="space-y-2">
            <RouterLink
              v-for="item in items.sort((a, b) => a.name.localeCompare(b.name))"
              :key="item.path"
              :to="item.path"
              class="flex items-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50/50 px-4 py-3 text-zinc-700 transition-all duration-300 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-300 dark:hover:border-blue-800 dark:hover:bg-blue-950 dark:hover:text-blue-400"
            >
              <Icon icon="solar:document-linear" class="size-4 shrink-0 text-zinc-400" />
              <span class="text-sm font-medium">{{ item.name }}</span>
              <Icon icon="solar:arrow-right-linear" class="ml-auto size-3.5 text-zinc-300" />
            </RouterLink>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
