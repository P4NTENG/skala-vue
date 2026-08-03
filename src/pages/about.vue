<script setup>
import CardSpotlight from '@/components/inspira/CardSpotlight.vue'

defineOptions({
  name: 'AboutView',
})

const highlights = [
  {
    title: 'Composable Architecture',
    description: '컴포넌트 조합과 Composition API로 유연한 UI를 구축합니다.',
  },
  {
    title: 'Modern Design System',
    description: 'shadcn-vue와 inspira-ui로 세련된 디자인 시스템을 활용합니다.',
  },
  {
    title: 'Animation First',
    description: '인터랙티브한 애니메이션으로 생동감 있는 사용자 경험을 제공합니다.',
  },
]
</script>

<template>
  <div class="min-h-screen bg-white py-24 dark:bg-slate-950">
    <div class="mx-auto max-w-4xl px-6">
      <!-- Header -->
      <div class="mb-20 text-center">
        <span class="mb-4 inline-block text-sm font-semibold uppercase tracking-widest text-emerald-500">
          About
        </span>
        <h1 class="text-4xl font-bold text-slate-900 sm:text-5xl dark:text-white">
          SKALA Vue Lab
        </h1>
        <p class="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-500 dark:text-slate-400">
          Vue 3 생태계의 최신 기술 스택을 실험하고 학습하는 개인 연구소입니다.
          컴포넌트 기반 개발, 상태 관리, 애니메이션 등 실제 프로덕션에서
          활용할 수 있는 패턴을 연구합니다.
        </p>
      </div>

      <!-- Highlights -->
      <div class="grid gap-6 md:grid-cols-3">
        <CardSpotlight
          v-for="item in highlights"
          :key="item.title"
          gradient-color="#10b981"
          :gradient-opacity="0.12"
          class="border-emerald-100 dark:border-emerald-900/30"
        >
          <div class="p-8">
            <h3 class="mb-3 text-lg font-semibold text-slate-900 dark:text-white">
              {{ item.title }}
            </h3>
            <p class="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              {{ item.description }}
            </p>
          </div>
        </CardSpotlight>
      </div>

      <!-- Tech details -->
      <div class="mt-20 rounded-2xl border border-slate-200 bg-slate-50/50 p-10 dark:border-slate-800 dark:bg-slate-900/50">
        <h2 class="mb-6 text-2xl font-bold text-slate-900 dark:text-white">
          Tech Stack
        </h2>
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="flex items-start gap-3">
            <div class="mt-0.5 size-1.5 rounded-full bg-emerald-500" />
            <div>
              <strong class="text-sm font-semibold text-slate-900 dark:text-white">Vue 3 + Composition API</strong>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">반응형 상태 관리와 컴포저블 패턴</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="mt-0.5 size-1.5 rounded-full bg-emerald-500" />
            <div>
              <strong class="text-sm font-semibold text-slate-900 dark:text-white">Tailwind CSS v4 + shadcn-vue</strong>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">유틸리티 퍼스트 CSS + 헤드리스 UI</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="mt-0.5 size-1.5 rounded-full bg-emerald-500" />
            <div>
              <strong class="text-sm font-semibold text-slate-900 dark:text-white">Inspira UI</strong>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">애니메이션 & 인터랙티브 컴포넌트</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="mt-0.5 size-1.5 rounded-full bg-emerald-500" />
            <div>
              <strong class="text-sm font-semibold text-slate-900 dark:text-white">Pinia + Vue Router</strong>
              <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">상태 관리 & 파일 기반 라우팅</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
