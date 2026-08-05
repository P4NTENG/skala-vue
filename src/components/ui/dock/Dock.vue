<script setup>
import { cn } from '@/lib/utils'
import { computed, provide, ref } from 'vue'

import {
  DISTANCE_INJECTION_KEY,
  MAGNIFICATION_INJECTION_KEY,
  MOUSE_X_INJECTION_KEY,
  MOUSE_Y_INJECTION_KEY,
  ORIENTATION_INJECTION_KEY,
} from './injectionKeys'

const props = defineProps({
  class: {
    type: [Boolean, null, String, Object, Array],
    required: false,
    skipCheck: true,
  },
  magnification: { type: Number, required: false, default: 60 },
  distance: { type: Number, required: false, default: 140 },
  direction: { type: null, required: false, default: 'middle' },
  orientation: { type: null, required: false, default: 'horizontal' },
})

const dockRef = ref(null)
const mouseX = ref(Infinity)
const mouseY = ref(Infinity)
const magnification = computed(() => props.magnification)
const distance = computed(() => props.distance)

const dockClass = computed(() => ({
  'items-start': props.direction === 'top',
  'items-center': props.direction === 'middle',
  'items-end': props.direction === 'bottom',
}))

function onMouseMove(e) {
  requestAnimationFrame(() => {
    mouseX.value = e.pageX
    mouseY.value = e.pageY
  })
}

function onMouseLeave() {
  requestAnimationFrame(() => {
    mouseX.value = Infinity
    mouseY.value = Infinity
  })
}
provide(MOUSE_X_INJECTION_KEY, mouseX)
provide(MOUSE_Y_INJECTION_KEY, mouseY)
provide(ORIENTATION_INJECTION_KEY, props.orientation)
provide(MAGNIFICATION_INJECTION_KEY, magnification)
provide(DISTANCE_INJECTION_KEY, distance)
</script>

<template>
  <div
    ref="dockRef"
    :class="
      cn(
        `mx-auto mt-8 flex h-[58px] w-max gap-4 rounded-2xl border p-2 backdrop-blur-md transition-all supports-backdrop-blur:bg-white/10 supports-backdrop-blur:dark:bg-black/10`,
        orientation === 'vertical' && 'h-max w-[58px] flex-col',
        props.class,
        dockClass,
      )
    "
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
  >
    <slot />
  </div>
</template>
