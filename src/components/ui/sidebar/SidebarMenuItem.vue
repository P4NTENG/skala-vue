<script setup>
import { cn } from '@/lib/utils'

const props = defineProps({
  class: { type: [Boolean, null, String, Object, Array], required: false },
})
</script>

<template>
  <li data-slot="sidebar-menu-item" :class="cn('group/menu-item relative list-none', props.class)">
    <slot />
  </li>
</template>
