<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'

defineOptions({ name: 'AppTopBar' })

const route = useRoute()
const isDark = ref(false)
const isExpanded = ref(false)
const navRef = ref(null)

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

function handleClickOutside(e) {
  if (navRef.value && !navRef.value.contains(e.target)) {
    isExpanded.value = false
  }
}

function handleKeydown(e) {
  if (e.key === 'Escape') {
    isExpanded.value = false
  }
}

function handleRouteChange() {
  isExpanded.value = false
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
  document.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside)
  document.removeEventListener('keydown', handleKeydown)
})

initTheme()
</script>

<style scoped>
.dynamic-island {
  transition:
    padding 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    gap 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.nav-items {
  display: grid;
  grid-template-columns: 0fr;
  opacity: 0;
  transition:
    grid-template-columns 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.nav-items.expanded {
  grid-template-columns: 1fr;
  opacity: 1;
}

.nav-items-inner {
  overflow: hidden;
  white-space: nowrap;
}

@media (max-width: 767px) {
  .desktop-nav {
    display: none !important;
  }
}

@media (min-width: 768px) {
  .mobile-nav {
    display: none !important;
  }
}
</style>

<template>
  <!-- Desktop: Dynamic Island -->
  <header class="desktop-nav fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4">
    <nav
      ref="navRef"
      role="navigation"
      aria-label="Main navigation"
      class="flex items-center rounded-full border border-white/[0.08] bg-black/40 backdrop-blur-xl dynamic-island"
      :class="isExpanded ? 'gap-2 px-2 py-1.5' : 'gap-0 px-4 py-2'"
      @mouseenter="isExpanded = true"
      @mouseleave="isExpanded = false"
      tabindex="0"
      @focus="isExpanded = true"
      @blur="isExpanded = false"
    >
      <!-- Brand pill -->
      <RouterLink
        to="/"
        class="flex items-center gap-2 rounded-full px-3 py-1.5 no-underline shrink-0 transition-colors duration-200 hover:bg-white/[0.06]"
        @click="handleRouteChange"
      >
        <div
          class="flex size-6 items-center justify-center rounded-full bg-blue-500 text-[10px] font-extrabold text-white shrink-0"
        >
          SV
        </div>
        <span class="text-sm font-semibold text-white/90 whitespace-nowrap">SKALA</span>
      </RouterLink>

      <!-- Expanded items wrapper -->
      <div class="nav-items" :class="{ expanded: isExpanded }">
        <div class="nav-items-inner flex items-center">
          <!-- Separator -->
          <div class="w-px h-5 bg-white/[0.1] shrink-0 mx-2" />

          <!-- Nav links -->
          <RouterLink
            to="/"
            class="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium no-underline transition-colors duration-200 shrink-0"
            :class="
              route.path === '/'
                ? 'text-blue-400 bg-blue-500/10'
                : 'text-white/50 hover:text-white/80 hover:bg-white/[0.06]'
            "
            @click="handleRouteChange"
          >
            <Icon icon="solar:home-2-bold-duotone" class="size-4" />
            <span>Home</span>
          </RouterLink>

          <RouterLink
            to="/practices"
            class="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium no-underline transition-colors duration-200 shrink-0"
            :class="
              route.path.startsWith('/practices')
                ? 'text-blue-400 bg-blue-500/10'
                : 'text-white/50 hover:text-white/80 hover:bg-white/[0.06]'
            "
            @click="handleRouteChange"
          >
            <Icon icon="solar:atom-bold-duotone" class="size-4" />
            <span>Practices</span>
          </RouterLink>

          <RouterLink
            to="/weathers"
            class="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium no-underline transition-colors duration-200 shrink-0"
            :class="
              route.path.startsWith('/weathers')
                ? 'text-blue-400 bg-blue-500/10'
                : 'text-white/50 hover:text-white/80 hover:bg-white/[0.06]'
            "
            @click="handleRouteChange"
          >
            <Icon icon="solar:cloud-bold-duotone" class="size-4" />
            <span>Weathers</span>
          </RouterLink>

          <RouterLink
            to="/about"
            class="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium no-underline transition-colors duration-200 shrink-0"
            :class="
              route.path.startsWith('/about')
                ? 'text-blue-400 bg-blue-500/10'
                : 'text-white/50 hover:text-white/80 hover:bg-white/[0.06]'
            "
            @click="handleRouteChange"
          >
            <Icon icon="solar:info-circle-bold-duotone" class="size-4" />
            <span>About</span>
          </RouterLink>

          <!-- Separator -->
          <div class="w-px h-5 bg-white/[0.1] shrink-0 mx-1" />

          <!-- Theme toggle -->
          <button
            @click="toggleTheme"
            class="flex items-center justify-center rounded-full p-2 text-white/50 hover:text-amber-400 hover:bg-white/[0.06] transition-colors duration-200 shrink-0"
            :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            <Icon
              :icon="isDark ? 'solar:sun-bold-duotone' : 'solar:moon-bold-duotone'"
              class="size-4"
            />
          </button>

          <!-- GitHub link -->
          <a
            href="https://github.com/P4NTENG/skala-vue"
            target="_blank"
            rel="noopener"
            class="flex items-center justify-center rounded-full p-2 text-white/50 hover:text-white/80 hover:bg-white/[0.06] transition-colors duration-200 shrink-0"
            aria-label="GitHub repository"
          >
            <Icon icon="mdi:github" class="size-4" />
          </a>
        </div>
      </div>
    </nav>
  </header>

  <!-- Mobile: Bottom bar -->
  <nav
    class="mobile-nav fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-4 px-4"
    role="navigation"
    aria-label="Main navigation"
  >
    <div
      class="flex items-center gap-1 rounded-2xl border border-white/[0.08] bg-black/60 backdrop-blur-xl px-2 py-2"
    >
      <RouterLink
        to="/"
        class="flex items-center justify-center rounded-xl p-2 transition-colors duration-200"
        :class="route.path === '/' ? 'text-blue-400 bg-blue-500/10' : 'text-white/50'"
        @click="handleRouteChange"
      >
        <Icon icon="solar:home-2-bold-duotone" class="size-5" />
      </RouterLink>

      <RouterLink
        to="/practices"
        class="flex items-center justify-center rounded-xl p-2 transition-colors duration-200"
        :class="
          route.path.startsWith('/practices') ? 'text-blue-400 bg-blue-500/10' : 'text-white/50'
        "
        @click="handleRouteChange"
      >
        <Icon icon="solar:atom-bold-duotone" class="size-5" />
      </RouterLink>

      <RouterLink
        to="/weathers"
        class="flex items-center justify-center rounded-xl p-2 transition-colors duration-200"
        :class="
          route.path.startsWith('/weathers') ? 'text-blue-400 bg-blue-500/10' : 'text-white/50'
        "
        @click="handleRouteChange"
      >
        <Icon icon="solar:cloud-bold-duotone" class="size-5" />
      </RouterLink>

      <RouterLink
        to="/about"
        class="flex items-center justify-center rounded-xl p-2 transition-colors duration-200"
        :class="route.path.startsWith('/about') ? 'text-blue-400 bg-blue-500/10' : 'text-white/50'"
        @click="handleRouteChange"
      >
        <Icon icon="solar:info-circle-bold-duotone" class="size-5" />
      </RouterLink>

      <div class="w-px h-5 bg-white/[0.08] mx-0.5" />

      <button
        @click="toggleTheme"
        class="flex items-center justify-center rounded-xl p-2 text-white/50"
        :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
      >
        <Icon
          :icon="isDark ? 'solar:sun-bold-duotone' : 'solar:moon-bold-duotone'"
          class="size-5 text-amber-400"
        />
      </button>

      <a
        href="https://github.com/P4NTENG/skala-vue"
        target="_blank"
        rel="noopener"
        class="flex items-center justify-center rounded-xl p-2 text-white/50"
        aria-label="GitHub repository"
      >
        <Icon icon="mdi:github" class="size-5" />
      </a>
    </div>
  </nav>
</template>
