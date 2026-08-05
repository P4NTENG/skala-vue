<script setup>
import { PanelLeft } from '@lucide/vue'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useSidebar } from './use-sidebar'

const props = defineProps({
  class: { type: [Boolean, null, String, Object, Array], required: false },
})

const { toggleSidebar } = useSidebar()
</script>

<template>
  <Button
    data-slot="sidebar-trigger"
    variant="ghost"
    size="icon"
    :class="cn('size-7', props.class)"
    @click="toggleSidebar"
  >
    <PanelLeft :size="16" />
    <span class="sr-only">Toggle Sidebar</span>
  </Button>
</template>
