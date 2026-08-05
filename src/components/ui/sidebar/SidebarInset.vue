<script setup>
import { cn } from '@/lib/utils'

const props = defineProps({
  class: { type: [Boolean, null, String, Object, Array], required: false },
})
</script>

<template>
  <div
    data-slot="sidebar-inset"
    :class="
      cn(
        'relative flex h-full flex-1 flex-col bg-background',
        'peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
