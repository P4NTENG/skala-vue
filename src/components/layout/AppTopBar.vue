<script setup>
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import { Dock, DockIcon } from '@/components/ui/dock'

defineOptions({ name: 'AppTopBar' })

const route = useRoute()
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
</script>

<template>
  <div>
    <!-- Minimal top brand bar -->
    <header class="fixed top-0 left-0 right-0 z-40 flex justify-center pt-4 px-4 pointer-events-none">
      <RouterLink
        to="/"
        class="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-black/40 px-4 py-2 backdrop-blur-xl text-sm font-semibold text-white/90 no-underline transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-black/50"
      >
        <div class="flex size-6 items-center justify-center rounded-full bg-blue-500 text-[10px] font-extrabold text-white">SV</div>
        SKALA
      </RouterLink>
    </header>

    <!-- macOS Dock at bottom -->
    <div class="fixed bottom-0 left-0 right-0 z-40 flex justify-center pb-4 px-4 pointer-events-none">
      <Dock
        class="pointer-events-auto !border-white/[0.08] !bg-black/60 !backdrop-blur-xl"
        :magnification="55"
        :distance="120"
      >
        <RouterLink to="/" custom v-slot="{ href, navigate }">
          <a :href="href" @click="navigate" class="rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
            <DockIcon>
              <Icon
                icon="solar:home-2-bold-duotone"
                class="size-8"
                :style="{ color: route.path === '/' ? '#3B82F6' : '#94A3B8' }"
              />
            </DockIcon>
          </a>
        </RouterLink>

        <RouterLink to="/practices" custom v-slot="{ href, navigate }">
          <a :href="href" @click="navigate">
            <DockIcon>
              <Icon
                icon="solar:atom-bold-duotone"
                class="size-8"
                :style="{ color: route.path.startsWith('/practices') ? '#3B82F6' : '#94A3B8' }"
              />
            </DockIcon>
          </a>
        </RouterLink>

        <RouterLink to="/weathers" custom v-slot="{ href, navigate }">
          <a :href="href" @click="navigate">
            <DockIcon>
              <Icon
                icon="solar:cloud-bold-duotone"
                class="size-8"
                :style="{ color: route.path.startsWith('/weathers') ? '#3B82F6' : '#94A3B8' }"
              />
            </DockIcon>
          </a>
        </RouterLink>

        <RouterLink to="/about" custom v-slot="{ href, navigate }">
          <a :href="href" @click="navigate">
            <DockIcon>
              <Icon
                icon="solar:info-circle-bold-duotone"
                class="size-8"
                :style="{ color: route.path.startsWith('/about') ? '#3B82F6' : '#94A3B8' }"
              />
            </DockIcon>
          </a>
        </RouterLink>

        <div class="mx-0.5 w-px bg-white/[0.08]" />

        <button @click="toggleTheme">
          <DockIcon>
            <Icon
              :icon="isDark ? 'solar:sun-bold-duotone' : 'solar:moon-bold-duotone'"
              class="size-7"
              style="color: #F59E0B"
            />
          </DockIcon>
        </button>

        <a href="https://github.com/P4NTENG/skala-vue" target="_blank" rel="noopener">
          <DockIcon>
            <Icon icon="mdi:github" class="size-7" style="color: #94A3B8" />
          </DockIcon>
        </a>
      </Dock>
    </div>
  </div>
</template>
