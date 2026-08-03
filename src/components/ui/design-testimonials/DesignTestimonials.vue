<script setup>
import {
  AnimatePresence,
  Motion,
} from "motion-v"
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from "vue"

const {
  title = "날씨",
  testimonials,
  duration = 4000,
  selected = -1,
} = defineProps({
  title: { type: String, required: false, default: "날씨" },
  duration: { type: Number, required: false, default: 4000 },
  testimonials: { type: Array, required: true },
  selected: { type: Number, required: false, default: -1 },
});

const activeIndex = ref(0)
const current = computed(() => testimonials[activeIndex.value])

const weatherGradient = computed(() => {
  const s = current.value?.status || '맑음'
  if (s === '맑음') return 'bg-linear-to-b from-sky-400/30 via-sky-300/20 to-transparent'
  if (s === '비') return 'bg-linear-to-b from-blue-700/30 via-blue-500/20 to-transparent'
  return 'bg-linear-to-b from-slate-500/30 via-slate-400/20 to-transparent'
})

const auroraColors = computed(() => {
  const s = current.value?.status || '맑음'
  if (s === '맑음') return 'repeating-linear-gradient(100deg,#fbbf24_10%,#f59e0b_15%,#fcd34d_20%,#fef3c7_25%,#fbbf24_30%)'
  if (s === '비') return 'repeating-linear-gradient(100deg,#60a5fa_10%,#93c5fd_15%,#3b82f6_20%,#bfdbfe_25%,#60a5fa_30%)'
  return 'repeating-linear-gradient(100deg,#94a3b8_10%,#cbd5e1_15%,#64748b_20%,#e2e8f0_25%,#94a3b8_30%)'
})

const emit = defineEmits(['update:active'])

function goNext() {
  activeIndex.value = (activeIndex.value + 1) % testimonials.length
  emit('update:active', activeIndex.value)
}
function goPrev() {
  activeIndex.value = (activeIndex.value - 1 + testimonials.length) % testimonials.length
  emit('update:active', activeIndex.value)
}

let timer = null
onMounted(() => { timer = window.setInterval(goNext, duration) })
onBeforeUnmount(() => { if (timer) window.clearInterval(timer) })

watch(() => selected, (idx) => {
  if (idx >= 0 && idx < testimonials.length) {
    if (timer) window.clearInterval(timer)
    activeIndex.value = idx
    emit('update:active', idx)
    timer = window.setInterval(goNext, duration)
  }
})
</script>

<template>
  <div class="flex items-center justify-center px-4 pt-10 pb-4">
    <div class="relative w-full max-w-xl overflow-hidden rounded-[2rem] backdrop-blur-xl" :class="weatherGradient" style="box-shadow: 0 0 0 1px rgba(255,255,255,0.08)">
      <!-- Aurora overlay -->
      <div
        class="pointer-events-none absolute inset-0 opacity-20 blur-xl"
        :style="{
          background: auroraColors,
          backgroundSize: '300% 200%',
        }"
      />

      <!-- Card content -->
      <div class="relative z-10 p-6 text-white">
        <!-- Top: city + nav -->
        <div class="flex items-center justify-between">
          <AnimatePresence mode="wait">
            <Motion
              :key="activeIndex"
              as="div"
              :initial="{ opacity: 0, y: -10 }"
              :animate="{ opacity: 1, y: 0 }"
              :exit="{ opacity: 0, y: 10 }"
              :transition="{ duration: 0.3 }"
            >
              <p class="text-sm font-medium opacity-80">{{ current?.company }}</p>
              <p class="text-xs opacity-50">{{ current?.role }}</p>
            </Motion>
          </AnimatePresence>

          <div class="flex gap-2">
            <button class="flex size-8 items-center justify-center rounded-full bg-white/15 transition-colors hover:bg-white/25" @click="goPrev">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8L10 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <button class="flex size-8 items-center justify-center rounded-full bg-white/15 transition-colors hover:bg-white/25" @click="goNext">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
          </div>
        </div>

        <!-- Temperature -->
        <div class="mt-6">
          <AnimatePresence mode="wait">
            <Motion
              :key="activeIndex"
              as="div"
              :initial="{ opacity: 0, scale: 0.9 }"
              :animate="{ opacity: 1, scale: 1 }"
              :exit="{ opacity: 0, scale: 1.1 }"
              :transition="{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }"
            >
              <span class="text-7xl font-thin tracking-tighter">{{ current?.quote }}</span>
            </Motion>
          </AnimatePresence>
        </div>

        <!-- Bottom: description + high/low -->
        <div class="mt-4 flex items-center justify-between">
          <AnimatePresence mode="wait">
            <Motion
              :key="activeIndex"
              as="p"
              class="text-xs opacity-60"
              :initial="{ opacity: 0 }"
              :animate="{ opacity: 1 }"
              :transition="{ delay: 0.2 }"
            >
              {{ current?.description || current?.quote }}
            </Motion>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <Motion
              :key="activeIndex"
              as="span"
              class="text-sm opacity-70"
              :initial="{ opacity: 0 }"
              :animate="{ opacity: 1 }"
              :transition="{ delay: 0.2 }"
            >
              {{ current?.author }}
            </Motion>
          </AnimatePresence>
        </div>
      </div>

      <!-- Dots -->
      <div class="relative z-10 flex justify-center gap-1.5 pb-4">
        <span
          v-for="(_, i) in testimonials"
          :key="i"
          class="size-1.5 rounded-full transition-all duration-300"
          :class="i === activeIndex ? 'bg-white w-4' : 'bg-white/30'"
        />
      </div>
    </div>
  </div>
</template>
