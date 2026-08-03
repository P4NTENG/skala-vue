<script setup>
import AuroraBackground from '@/components/inspira/AuroraBackground.vue'
import CardSpotlight from '@/components/inspira/CardSpotlight.vue'
import { RouterLink } from 'vue-router'
import { Icon } from '@iconify/vue'

defineOptions({
  name: 'HomePage',
})

const features = [
  {
    icon: 'lucide:graduation-cap',
    title: 'Vue Practices',
    description: 'Vue 디렉티브, 이벤트 핸들링, 폼 데이터 바인딩 등 핵심 개념 실습',
    to: '/practices',
  },
  {
    icon: 'lucide:cloud-sun',
    title: 'Weather Dashboard',
    description: '실시간 날씨 데이터를 시각화하는 인터랙티브 대시보드',
    to: '/weathers',
  },
  {
    icon: 'lucide:palette',
    title: 'UI Components',
    description: 'shadcn-vue + inspira-ui 기반의 모던 UI 컴포넌트 쇼케이스',
    to: '/about',
  },
]

const techStack = [
  { name: 'Vue 3', icon: 'logos:vue' },
  { name: 'Vite', icon: 'logos:vitejs' },
  { name: 'Tailwind CSS', icon: 'logos:tailwindcss-icon' },
  { name: 'shadcn-vue', icon: 'lucide:shapes' },
  { name: 'Pinia', icon: 'logos:pinia' },
  { name: 'Bun', icon: 'logos:bun' },
]
</script>

<template>
  <main>
    <!-- Hero Section with Aurora Background -->
    <AuroraBackground class="min-h-[90vh]">
      <div class="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <div class="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200/50 bg-emerald-50/80 px-4 py-1.5 text-sm font-medium text-emerald-700 backdrop-blur-sm dark:border-emerald-800/50 dark:bg-emerald-900/50 dark:text-emerald-300">
          <span class="relative flex size-2">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span class="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          SKALA Vue Lab
        </div>

        <h1 class="text-5xl font-bold tracking-tight text-slate-900 sm:text-7xl dark:text-white">
          Build
          <span class="bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
            Beautiful
          </span>
          Vue Apps
        </h1>

        <p class="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
          Vue 3 + shadcn-vue + inspira-ui 기반의 모던 UI 실습 프로젝트.
          컴포넌트 기반 개발과 애니메이션을 직접 경험해보세요.
        </p>

        <div class="mt-10 flex flex-wrap items-center justify-center gap-4">
          <RouterLink
            to="/practices"
            class="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-slate-800 hover:shadow-xl dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
          >
            <Icon icon="lucide:play" class="size-4" />
            시작하기
          </RouterLink>
          <a
            href="https://github.com/P4NTENG/skala-vue"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-700 backdrop-blur-sm transition-all hover:bg-white dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Icon icon="lucide:github" class="size-4" />
            GitHub
          </a>
        </div>
      </div>
    </AuroraBackground>

    <!-- Features Section -->
    <section class="bg-white py-24 dark:bg-slate-950">
      <div class="mx-auto max-w-6xl px-6">
        <div class="mb-16 text-center">
          <h2 class="text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">
            Explore the Lab
          </h2>
          <p class="mt-3 text-slate-500 dark:text-slate-400">
            주요 기능들을 둘러보세요
          </p>
        </div>

        <div class="grid gap-8 md:grid-cols-3">
          <RouterLink
            v-for="feature in features"
            :key="feature.title"
            :to="feature.to"
            class="block"
          >
            <CardSpotlight
              gradient-color="#10b981"
              :gradient-opacity="0.15"
              class="h-full border-emerald-100 dark:border-emerald-900/30"
            >
              <div class="flex h-full flex-col p-8">
                <div class="mb-5 flex size-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                  <Icon :icon="feature.icon" class="size-6" />
                </div>
                <h3 class="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                  {{ feature.title }}
                </h3>
                <p class="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  {{ feature.description }}
                </p>
                <div class="mt-auto pt-4">
                  <span class="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    Explore
                    <Icon icon="lucide:arrow-right" class="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </CardSpotlight>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Tech Stack Section -->
    <section class="border-t border-slate-100 bg-slate-50/50 py-20 dark:border-slate-800 dark:bg-slate-900/50">
      <div class="mx-auto max-w-4xl px-6 text-center">
        <h3 class="mb-10 text-sm font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Built with
        </h3>
        <div class="flex flex-wrap items-center justify-center gap-10">
          <div
            v-for="tech in techStack"
            :key="tech.name"
            class="flex flex-col items-center gap-2 text-slate-400 transition-colors hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
          >
            <Icon :icon="tech.icon" class="size-8" />
            <span class="text-xs font-medium">{{ tech.name }}</span>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
