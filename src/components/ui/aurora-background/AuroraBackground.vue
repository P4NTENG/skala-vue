<script setup>
import { cn } from '@/lib/utils'
import { computed, ref, watch } from 'vue'

const props = defineProps({
  radialGradient: { type: Boolean, required: false, default: true },
  class: { type: String, required: false },
  status: { type: String, required: false, default: '맑음' },
})

const colorSets = {
  맑음: ['#f59e0b', '#fbbf24', '#fcd34d', '#fef3c7', '#f59e0b'],
  비: ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#3b82f6'],
  구름: ['#94a3b8', '#cbd5e1', '#64748b', '#e2e8f0', '#94a3b8'],
}

const currentColors = ref([...colorSets['맑음']])
let animFrame = null

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return { r, g, b }
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map((x) => Math.round(x).toString(16).padStart(2, '0')).join('')
}

function lerp(a, b, t) {
  return a + (b - a) * t
}

watch(
  () => props.status,
  (newStatus) => {
    const target = colorSets[newStatus] || colorSets['맑음']
    const start = currentColors.value.map((c) => hexToRgb(c))
    const end = target.map((c) => hexToRgb(c))
    const duration = 1500
    const startTime = performance.now()

    if (animFrame) cancelAnimationFrame(animFrame)

    function animate(now) {
      const elapsed = now - startTime
      const t = Math.min(elapsed / duration, 1)
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2

      currentColors.value = start.map((s, i) =>
        rgbToHex(
          lerp(s.r, end[i].r, eased),
          lerp(s.g, end[i].g, eased),
          lerp(s.b, end[i].b, eased),
        ),
      )

      if (t < 1) {
        animFrame = requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  },
)

const styles = computed(() => {
  const c = currentColors.value
  return {
    '--aurora': `repeating-linear-gradient(100deg,${c[0]}_10%,${c[1]}_15%,${c[2]}_20%,${c[3]}_25%,${c[4]}_30%)`,
    '--dark-gradient':
      'repeating-linear-gradient(100deg,#000_0%,#000_7%,transparent_10%,transparent_12%,#000_16%)',
    '--white-gradient':
      'repeating-linear-gradient(100deg,#fff_0%,#fff_7%,transparent_10%,transparent_12%,#fff_16%)',
    '--blue-300': c[2],
    '--blue-400': c[1],
    '--blue-500': c[0],
    '--indigo-300': c[3],
    '--violet-200': c[3],
    '--black': '#000',
    '--white': '#fff',
    '--transparent': 'transparent',
    '--animate-aurora': 'aurora 60s linear infinite',
  }
})
</script>

<template>
  <div
    v-bind="props"
    :class="
      cn(
        'transition-bg relative flex h-screen flex-col items-center justify-center bg-zinc-50 text-slate-950 dark:bg-zinc-900',
        props.class,
      )
    "
  >
    <div :style="styles" class="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        :class="
          cn(
            'after:animate-aurora pointer-events-none absolute -inset-2.5 [background-image:var(--white-gradient),var(--aurora)] bg-size-[300%,200%] bg-position-[50%_50%,50%_50%] opacity-50 blur-[10px] invert filter will-change-transform [--aurora:repeating-linear-gradient(100deg,var(--blue-500)_10%,var(--indigo-300)_15%,var(--blue-300)_20%,var(--violet-200)_25%,var(--blue-400)_30%)] [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)] [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)] after:absolute after:inset-0 after:[background-image:var(--white-gradient),var(--aurora)] after:bg-size-[200%,100%] after:bg-fixed after:mix-blend-difference after:content-[\'\'] dark:[background-image:var(--dark-gradient),var(--aurora)] dark:invert-0 after:dark:[background-image:var(--dark-gradient),var(--aurora)]',
            props.radialGradient &&
              'mask-[radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]',
          )
        "
      />
    </div>
    <div class="relative z-10 w-full">
      <slot />
    </div>
  </div>
</template>
