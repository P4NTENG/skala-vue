<script setup>
import { cn } from "@inspira-ui/plugins";

const props = defineProps({
  class: {
    type: [Boolean, null, String, Object, Array],
    required: false,
    skipCheck: true,
  },
});
</script>

<template>
  <div
    :class="
      cn(
        `mx-auto grid max-w-7xl grid-cols-1 gap-4 md:auto-rows-[18rem] md:grid-cols-3`,
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
