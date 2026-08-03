<script setup>
import { cn } from "@/lib/utils"
import { computed } from "vue"

const props = defineProps({
  radialGradient: { type: Boolean, default: true },
  class: { type: String, default: "" },
})

const styles = computed(() => ({
  "--aurora":
    "repeating-linear-gradient(100deg,#3b82f6_10%,#a5b4fc_15%,#93c5fd_20%,#ddd6fe_25%,#60a5fa_30%)",
  "--dark-gradient":
    "repeating-linear-gradient(100deg,#000_0%,#000_7%,transparent_10%,transparent_12%,#000_16%)",
  "--white-gradient":
    "repeating-linear-gradient(100deg,#fff_0%,#fff_7%,transparent_10%,transparent_12%,#fff_16%)",
  "--blue-300": "#93c5fd",
  "--blue-400": "#60a5fa",
  "--blue-500": "#3b82f6",
  "--indigo-300": "#a5b4fc",
  "--violet-200": "#ddd6fe",
  "--black": "#000",
  "--white": "#fff",
  "--transparent": "transparent",
  "--animate-aurora": "aurora 60s linear infinite",
}))
</script>

<template>
  <div
    :class="
      cn(
        'relative flex min-h-screen flex-col items-center justify-center bg-zinc-50 text-slate-950 dark:bg-zinc-900',
        props.class,
      )
    "
  >
    <div
      :style="styles"
      class="absolute inset-0 overflow-hidden"
    >
      <div
        :class="
          cn(
            'pointer-events-none absolute -inset-2.5 [background-image:var(--white-gradient),var(--aurora)] bg-[length:300%,200%] bg-[position:50%_50%,50%_50%] opacity-50 blur-[10px] invert filter will-change-transform after:animate-aurora after:absolute after:inset-0 after:[background-image:var(--white-gradient),var(--aurora)] after:bg-[length:200%,100%] after:mix-blend-difference after:content-[\'\'] dark:[background-image:var(--dark-gradient),var(--aurora)] dark:invert-0 after:dark:[background-image:var(--dark-gradient),var(--aurora)]',
            props.radialGradient &&
              'mask-image:[radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]',
          )
        "
      />
    </div>
    <slot />
  </div>
</template>
