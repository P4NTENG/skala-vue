<script setup>
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'

defineOptions({
  name: 'AppTopBar',
})

const route = useRoute()
const practiceMenu = ref(null)
const weatherMenu = ref(null)
const mobileMenuOpen = ref(false)

const navigationItems = [
  { label: 'Home', to: '/', icon: 'lucide:home' },
  { label: 'About', to: '/about', icon: 'lucide:info' },
]

const practicePageModules = import.meta.glob('../../pages/practices/**/*.vue')
const practiceGroups = createPracticeGroups(Object.keys(practicePageModules))

const weatherPageModules = import.meta.glob('../../pages/weathers/*.vue')
const weatherPages = Object.keys(weatherPageModules)
  .map((pagePath) => {
    const fileName = pagePath.split('/').pop()?.replace(/\.vue$/, '')
    if (!fileName) return null
    return {
      label: formatPageLabel(fileName),
      to: `/weathers/${fileName}`,
    }
  })
  .filter((item) => item !== null)

function createPracticeGroups(pagePaths) {
  const groups = new Map()
  for (const pagePath of pagePaths) {
    const relativePath = pagePath.split('/pages/practices/')[1]?.replace(/\.vue$/, '')
    if (!relativePath || relativePath.includes('[')) continue
    const segments = relativePath.split('/')
    const groupName = segments.shift()
    const fileName = segments.at(-1)
    if (!groupName || !fileName) continue
    const routeSegments = fileName === 'index' ? [groupName, ...segments.slice(0, -1)] : [groupName, ...segments]
    const item = {
      label: fileName === 'index' ? 'Overview' : formatPageLabel(fileName),
      to: `/practices/${routeSegments.join('/')}`,
    }
    if (!groups.has(groupName)) groups.set(groupName, [])
    groups.get(groupName).push(item)
  }
  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([groupName, items]) => ({
      label: formatGroupLabel(groupName),
      description: `${items.length}개 실습`,
      items: items.sort((a, b) => a.label.localeCompare(b.label)),
    }))
}

function formatGroupLabel(value) {
  return value.split(/[-_.]+/).map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

function formatPageLabel(value) {
  return value.startsWith('v-') ? value : formatGroupLabel(value)
}

function closePracticeMenu() {
  practiceMenu.value?.removeAttribute('open')
  mobileMenuOpen.value = false
}

function closeWeatherMenu() {
  weatherMenu.value?.removeAttribute('open')
  mobileMenuOpen.value = false
}
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/80">
    <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
      <!-- Brand -->
      <RouterLink to="/" class="flex items-center gap-3 font-bold text-slate-900 no-underline dark:text-white">
        <div class="flex size-8 items-center justify-center rounded-lg bg-emerald-500 text-xs font-extrabold text-white">
          SV
        </div>
        <span class="text-sm tracking-tight">
          <span>SKALA</span>
          <span class="ml-1 text-slate-400 dark:text-slate-500">Vue Lab</span>
        </span>
      </RouterLink>

      <!-- Desktop Nav -->
      <nav class="hidden items-center gap-1 md:flex">
        <RouterLink
          v-for="item in navigationItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          :class="{ 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white': route.path === item.to }"
        >
          <Icon :icon="item.icon" class="size-4" />
          {{ item.label }}
        </RouterLink>

        <!-- Practices Dropdown -->
        <details ref="practiceMenu" class="relative">
          <summary class="flex cursor-pointer list-none items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            :class="{ 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white': route.path.startsWith('/practices/') }"
          >
            <Icon icon="lucide:book-open" class="size-4" />
            Practices
            <Icon icon="lucide:chevron-down" class="size-3.5 transition-transform group-open:rotate-180" />
          </summary>
          <div class="absolute right-0 top-full mt-2 w-[560px] rounded-xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-700 dark:bg-slate-900">
            <div class="mb-4 border-b border-slate-100 pb-3 dark:border-slate-800">
              <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Practice Library</p>
              <p class="mt-0.5 text-sm font-medium text-slate-900 dark:text-white">폴더별 실습 목록</p>
            </div>
            <div v-for="group in practiceGroups" :key="group.label" class="mb-4 last:mb-0">
              <div class="mb-2 flex items-center gap-2 border-l-2 border-emerald-500 pl-2">
                <strong class="text-sm font-semibold text-slate-900 dark:text-white">{{ group.label }}</strong>
                <span class="text-xs text-slate-400">{{ group.description }}</span>
              </div>
              <div class="grid grid-cols-2 gap-1">
                <RouterLink
                  v-for="item in group.items"
                  :key="item.to"
                  :to="item.to"
                  class="rounded-lg px-2.5 py-1.5 text-sm text-slate-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700 dark:text-slate-400 dark:hover:bg-emerald-900/20 dark:hover:text-emerald-400"
                  @click="closePracticeMenu"
                >
                  {{ item.label }}
                </RouterLink>
              </div>
            </div>
          </div>
        </details>

        <!-- Weather Dropdown -->
        <details ref="weatherMenu" class="relative">
          <summary class="flex cursor-pointer list-none items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            :class="{ 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white': route.path.startsWith('/weathers/') }"
          >
            <Icon icon="lucide:cloud" class="size-4" />
            Weather
            <Icon icon="lucide:chevron-down" class="size-3.5 transition-transform group-open:rotate-180" />
          </summary>
          <div class="absolute right-0 top-full mt-2 w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900">
            <RouterLink
              v-for="item in weatherPages"
              :key="item.to"
              :to="item.to"
              class="block rounded-lg px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700 dark:text-slate-400 dark:hover:bg-emerald-900/20 dark:hover:text-emerald-400"
              @click="closeWeatherMenu"
            >
              {{ item.label }}
            </RouterLink>
          </div>
        </details>
      </nav>

      <!-- Mobile Menu Toggle -->
      <button
        class="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 md:hidden dark:text-slate-400 dark:hover:bg-slate-800"
        @click="mobileMenuOpen = !mobileMenuOpen"
      >
        <Icon v-if="!mobileMenuOpen" icon="lucide:menu" class="size-5" />
        <Icon v-else icon="lucide:x" class="size-5" />
      </button>
    </div>

    <!-- Mobile Nav -->
    <div v-if="mobileMenuOpen" class="border-t border-slate-200 bg-white px-6 pb-6 pt-2 md:hidden dark:border-slate-800 dark:bg-slate-950">
      <RouterLink
        v-for="item in navigationItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400"
        @click="mobileMenuOpen = false"
      >
        <Icon :icon="item.icon" class="size-4" />
        {{ item.label }}
      </RouterLink>
      <RouterLink
        to="/practices"
        class="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400"
        @click="mobileMenuOpen = false"
      >
        <Icon icon="lucide:book-open" class="size-4" />
        Practices
      </RouterLink>
      <RouterLink
        to="/weathers"
        class="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400"
        @click="mobileMenuOpen = false"
      >
        <Icon icon="lucide:cloud" class="size-4" />
        Weather
      </RouterLink>
    </div>
  </header>
</template>
