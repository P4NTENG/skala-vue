<script setup>
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'

defineOptions({ name: 'AppTopBar' })

const route = useRoute()
const practiceMenu = ref(null)
const weatherMenu = ref(null)
const mobileMenuOpen = ref(false)

// Dark mode toggle
const isDark = ref(false)

function initTheme() {
  const stored = localStorage.getItem('theme')
  if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }
}

function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

initTheme()

const links = [
  { label: '실습실', to: '/practices', icon: 'solar:atom-linear' },
  { label: '날씨', to: '/weathers', icon: 'solar:cloud-rain-linear' },
  { label: '정보', to: '/about', icon: 'solar:info-circle-linear' },
]

const practicePageModules = import.meta.glob('../../pages/practices/**/*.vue')
const practiceGroups = createPracticeGroups(Object.keys(practicePageModules))

const weatherPageModules = import.meta.glob('../../pages/weathers/*.vue')
const weatherPages = Object.keys(weatherPageModules)
  .map((p) => {
    const f = p.split('/').pop()?.replace('.vue', '')
    return f ? { label: formatLabel(f), to: `/weathers/${f}` } : null
  })
  .filter(Boolean)

function createPracticeGroups(paths) {
  const groups = new Map()
  for (const p of paths) {
    const rel = p.split('/pages/practices/')[1]?.replace('.vue', '')
    if (!rel || rel.includes('[')) continue
    const segs = rel.split('/')
    const grp = segs.shift()
    const fn = segs.at(-1)
    if (!grp || !fn) continue
    const routeSegs = fn === 'index' ? [grp, ...segs.slice(0, -1)] : [grp, ...segs]
    groups.set(grp, [...(groups.get(grp) || []), {
      label: fn === 'index' ? '개요' : formatLabel(fn),
      to: `/practices/${routeSegs.join('/')}`,
    }])
  }
  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([g, items]) => ({ label: formatLabel(g), count: items.length, items }))
}

function formatLabel(v) { return v.split(/[-_.]+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') }
function closeMenus() { practiceMenu.value?.removeAttribute('open'); weatherMenu.value?.removeAttribute('open'); mobileMenuOpen.value = false }
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-40 flex justify-center pt-4 px-4">
    <!-- Floating glass pill -->
    <nav class="flex items-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.04] px-2 py-2 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
      <!-- Brand -->
      <RouterLink to="/" class="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold text-[#FAFAFA] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-white/[0.06]">
        <div class="flex size-7 items-center justify-center rounded-full bg-[#3B82F6] text-[10px] font-extrabold text-white">SV</div>
        <span class="hidden sm:inline">SKALA</span>
      </RouterLink>

      <div class="mx-1 h-5 w-px bg-white/[0.08]" />

      <!-- Nav links -->
      <RouterLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        :class="route.path.startsWith(link.to) ? 'bg-white/[0.08] text-[#FAFAFA]' : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]'"
      >
        <Icon :icon="link.icon" class="size-3.5" />
        <span class="hidden sm:inline">{{ link.label }}</span>
      </RouterLink>

      <div class="mx-0.5 h-5 w-px bg-white/[0.08]" />

      <!-- Practices dropdown -->
      <details ref="practiceMenu" class="relative">
        <summary
          class="flex cursor-pointer list-none items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          :class="route.path.startsWith('/practices') ? 'bg-white/[0.08] text-[#FAFAFA]' : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]'"
        >
          <Icon icon="solar:atom-linear" class="size-3.5" />
          <span class="hidden sm:inline">실습실</span>
        </summary>
        <div
          class="absolute left-0 top-full mt-3 w-[520px] rounded-2xl border border-white/[0.08] bg-[#18181B]/95 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
        >
          <p class="mb-3 text-[11px] font-semibold uppercase tracking-widest text-white/25 break-keep-all">
            연구 영역
          </p>
          <div v-for="group in practiceGroups" :key="group.label" class="mb-3 last:mb-0">
            <div class="mb-2 flex items-center gap-2">
              <div class="h-4 w-0.5 rounded-full bg-[#3B82F6]" />
              <strong class="text-sm font-semibold text-[#FAFAFA]">{{ group.label }}</strong>
              <span class="text-xs text-white/25">{{ group.count }}개 항목</span>
            </div>
            <div class="grid grid-cols-2 gap-0.5">
              <RouterLink
                v-for="item in group.items"
                :key="item.to"
                :to="item.to"
                class="rounded-lg px-2 py-1.5 text-sm text-white/50 transition-all duration-300 hover:bg-white/[0.06] hover:text-white/80"
                @click="closeMenus"
              >
                {{ item.label }}
              </RouterLink>
            </div>
          </div>
        </div>
      </details>

      <!-- Weather dropdown -->
      <details ref="weatherMenu" class="relative">
        <summary
          class="flex cursor-pointer list-none items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          :class="route.path.startsWith('/weathers') ? 'bg-white/[0.08] text-[#FAFAFA]' : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]'"
        >
          <Icon icon="solar:cloud-rain-linear" class="size-3.5" />
          <span class="hidden sm:inline">날씨</span>
        </summary>
        <div
          class="absolute left-0 top-full mt-3 w-48 rounded-2xl border border-white/[0.08] bg-[#18181B]/95 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
        >
          <RouterLink
            v-for="item in weatherPages"
            :key="item.to"
            :to="item.to"
            class="block rounded-lg px-3 py-2 text-sm text-white/50 transition-all duration-300 hover:bg-white/[0.06] hover:text-white/80"
            @click="closeMenus"
          >
            {{ item.label }}
          </RouterLink>
        </div>
      </details>

      <div class="mx-0.5 h-5 w-px bg-white/[0.08]" />

      <!-- Theme toggle -->
      <button
        class="rounded-full p-1.5 text-white/50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-white/[0.06] hover:text-white"
        @click="toggleTheme"
        :title="isDark ? '라이트 모드로 전환' : '다크 모드로 전환'"
      >
        <Icon :icon="isDark ? 'solar:sun-linear' : 'solar:moon-linear'" class="size-4" />
      </button>

      <!-- Mobile menu toggle -->
      <button
        class="ml-1 rounded-full p-1.5 text-white/50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-white/[0.06] hover:text-white md:hidden"
        @click="mobileMenuOpen = !mobileMenuOpen"
      >
        <Icon :icon="mobileMenuOpen ? 'solar:close-circle-linear' : 'solar:menu-dots-linear'" class="size-5" />
      </button>
    </nav>

    <!-- Mobile dropdown -->
    <div
      v-if="mobileMenuOpen"
      class="absolute top-full left-4 right-4 mt-3 rounded-2xl border border-white/[0.08] bg-[#18181B]/95 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-2xl md:hidden"
    >
      <RouterLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium text-white/70 transition-all duration-300 hover:bg-white/[0.05] hover:text-white"
        @click="mobileMenuOpen = false"
      >
        <Icon :icon="link.icon" class="size-4" />
        {{ link.label }}
      </RouterLink>

      <!-- Mobile: Practices sub-items -->
      <div class="mt-2 border-t border-white/[0.06] pt-3">
        <p class="mb-2 px-4 text-[11px] font-semibold uppercase tracking-widest text-white/20 break-keep-all">연구 영역</p>
        <div v-for="group in practiceGroups" :key="group.label">
          <p class="px-4 py-1 text-xs font-semibold text-white/40">{{ group.label }}</p>
          <RouterLink
            v-for="item in group.items"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-2 rounded-lg px-4 py-2 pl-8 text-sm text-white/50 transition-all duration-300 hover:bg-white/[0.05] hover:text-white/80"
            @click="mobileMenuOpen = false"
          >
            {{ item.label }}
          </RouterLink>
        </div>
      </div>

      <!-- Mobile: Weather sub-items -->
      <div class="mt-2 border-t border-white/[0.06] pt-3">
        <p class="mb-1 px-4 text-[11px] font-semibold uppercase tracking-widest text-white/20 break-keep-all">날씨</p>
        <RouterLink
          v-for="item in weatherPages"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-white/50 transition-all duration-300 hover:bg-white/[0.05] hover:text-white/80"
          @click="mobileMenuOpen = false"
        >
          {{ item.label }}
        </RouterLink>
      </div>
    </div>
  </header>
</template>
