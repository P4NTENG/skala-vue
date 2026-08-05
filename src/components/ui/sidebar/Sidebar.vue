<script setup>
import { cn } from '@/lib/utils'
import { useSidebar } from './use-sidebar'

const props = defineProps({
  side: { type: String, required: false, default: 'left' },
  variant: { type: String, required: false, default: 'sidebar' },
  collapsible: { type: String, required: false, default: 'offcanvas' },
  class: { type: [Boolean, null, String, Object, Array], required: false },
})

const { state } = useSidebar()
</script>

<template>
  <aside
    data-slot="sidebar"
    :data-side="side"
    :data-variant="variant"
    :data-collapsible="collapsible === 'offcanvas' ? 'none' : collapsible"
    :data-state="state"
    :class="
      cn(
        'group/sidebar-wrapper has-[[data-variant=inset]]:bg-sidebar flex h-full shrink-0 flex-col bg-sidebar text-sidebar-foreground',
        props.class,
      )
    "
    :style="{
      '--sidebar-width': '16rem',
      '--sidebar-width-icon': '3rem',
      width:
        collapsible === 'icon' && state === 'collapsed'
          ? 'var(--sidebar-width-icon)'
          : 'var(--sidebar-width)',
      transition: 'width 200ms cubic-bezier(0.16,1,0.3,1)',
    }"
  >
    <slot />
  </aside>
</template>
