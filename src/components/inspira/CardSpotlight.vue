<script setup>
import { cn } from "@/lib/utils"
import { computed, ref } from "vue"

const props = defineProps({
  class: { type: String, default: "" },
  slotClass: { type: String, default: "" },
  gradientSize: { type: Number, default: 200 },
  gradientColor: { type: String, default: "#262626" },
  gradientOpacity: { type: Number, default: 0.8 },
})

const mouseX = ref(-props.gradientSize * 10)
const mouseY = ref(-props.gradientSize * 10)

function handleMouseMove(e) {
  const target = e.currentTarget
  const rect = target.getBoundingClientRect()
  mouseX.value = e.clientX - rect.left
  mouseY.value = e.clientY - rect.top
}

function handleMouseLeave() {
  mouseX.value = -props.gradientSize * 10
  mouseY.value = -props.gradientSize * 10
}

const backgroundStyle = computed(() => {
  return `radial-gradient(
    circle at ${mouseX.value}px ${mouseY.value}px,
    ${props.gradientColor} 0%,
    rgba(0, 0, 0, 0) 70%
  )`
})
</script>

<template>
  <div
    :class="
      cn(
        'group relative flex size-full overflow-hidden rounded-xl border bg-neutral-100 text-black dark:bg-neutral-900 dark:text-white',
        props.class,
      )
    "
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <div :class="cn('relative z-10', props.slotClass)">
      <slot />
    </div>
    <div
      class="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      :style="{
        background: backgroundStyle,
        opacity: gradientOpacity,
      }"
    />
  </div>
</template>
