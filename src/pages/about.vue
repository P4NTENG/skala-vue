<script setup>
import { CardSpotlight } from '@/components/ui/card-spotlight'
import { Icon } from '@iconify/vue'

defineOptions({ name: 'AboutView' })

const principles = [
  {
    icon: 'solar:lightbulb-bolt-linear',
    title: '이해를 위해 만듭니다',
    description: '이곳의 모든 컴포넌트는 무언가를 배웠기 때문에 존재합니다. 복사-붙여넣기 없이, 각 파일을 직접 작성하고, 깨뜨리고, 고쳤습니다.',
  },
  {
    icon: 'solar:layers-minimalistic-linear',
    title: '반복을 위해 설계합니다',
    description: 'shadcn-vue가 기본 구조를, inspira-ui가 개성을 더합니다. 구조와 즐거움을 위한 두 가지 도구가 함께 작동합니다.',
  },
  {
    icon: 'solar:rocket-linear',
    title: '작동하는 것만 배포합니다',
    description: '이곳은 포트폴리오가 아닌, 실제로 작동하는 실험실입니다. 사이트의 모든 요소가 컴파일되고, 실행되며, 실제 데이터에 반응합니다.',
  },
]

const techStack = [
  { name: 'Vue 3', detail: 'Composition API + script setup' },
  { name: 'Tailwind CSS v4', detail: 'utility-first CSS' },
  { name: 'shadcn-vue', detail: 'headless component primitives' },
  { name: 'inspira-ui', detail: 'animation & interaction' },
  { name: 'Pinia', detail: 'state management' },
  { name: 'Vue Router', detail: 'SPA routing' },
]
</script>

<template>
  <div class="min-h-[100dvh] bg-[#0A0A10] text-[#FAFAFA] py-24 md:py-32">
    <div class="mx-auto max-w-5xl px-6">
      <!-- Hero -->
      <header class="mb-24 md:mb-32">
        <span class="inline-block rounded-full border border-white/[0.06] bg-white/[0.03] px-4 py-1.5 text-xs font-medium tracking-wider text-[#3B82F6] break-keep-all">
          연구실 소개
        </span>
        <h1 class="mt-6 text-4xl font-bold leading-tight tracking-tight md:text-5xl break-keep-all">
          Vue 3 연구 공간
        </h1>
        <p class="mt-5 max-w-2xl text-lg leading-relaxed text-white/55 md:text-xl break-keep-all">
          SKALA Vue Lab은 실제 사용 사례를 통해 Vue 패턴을 검증하는 개인 연구실입니다. 튜토리얼이나 보일러플레이트가 아닌, 직접 작성하고 테스트한 코드만 남깁니다.
        </p>
      </header>

      <!-- Principles — zig-zag layout -->
      <section class="space-y-6">
        <CardSpotlight
          v-for="(principle, i) in principles"
          :key="principle.title"
          gradient-color="#3B82F6"
          :gradient-opacity="0.08"
          class="overflow-hidden"
          :class="i % 2 === 1 ? 'md:ml-16' : 'md:mr-16'"
          style="border-color: rgba(255,255,255,0.06); background: rgba(255,255,255,0.02)"
        >
          <div class="flex flex-col gap-5 p-6 md:flex-row md:items-start md:p-8 lg:p-10">
            <!-- Icon block -->
            <div
              class="flex size-12 shrink-0 items-center justify-center rounded-xl"
              :style="{ background: 'rgba(59,130,246,0.1)', color: '#60A5FA' }"
            >
              <Icon :icon="principle.icon" class="size-6" />
            </div>
            <!-- Text -->
            <div class="min-w-0">
              <h3 class="text-lg font-semibold text-[#FAFAFA] md:text-xl break-keep-all">
                {{ principle.title }}
              </h3>
              <p class="mt-2 text-sm leading-relaxed text-white/50 md:text-base break-keep-all">
                {{ principle.description }}
              </p>
            </div>
          </div>
        </CardSpotlight>
      </section>

      <!-- Tech stack -->
      <section class="mt-24 md:mt-32">
        <h2 class="mb-2 text-sm font-semibold uppercase tracking-[0.15em] text-[#3B82F6] break-keep-all">
          기술 스택
        </h2>
        <p class="mb-10 text-2xl font-bold tracking-tight md:text-3xl break-keep-all">
          실험대 위 도구들
        </p>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="tech in techStack"
            :key="tech.name"
            class="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] px-5 py-4 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-white/[0.12] hover:bg-white/[0.04]"
          >
            <div class="flex size-2 shrink-0 rounded-full bg-[#3B82F6]" />
            <div class="min-w-0">
              <span class="text-sm font-semibold text-[#FAFAFA]">{{ tech.name }}</span>
              <span class="ml-2 text-xs text-white/35 break-keep-all">{{ tech.detail }}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
