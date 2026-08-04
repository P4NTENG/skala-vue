<script setup>
defineProps({
  className: { type: String, default: '' },
})
</script>

<template>
  <div
    :class="[
      'rounded-xl border border-zinc-100 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900',
      className,
    ]"
  >
    <slot />
  </div>
</template>
