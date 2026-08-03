<script setup>
defineProps({
  city: { type: Object, required: true },
})

const emit = defineEmits(['select-card', 'click-detail'])
</script>

<template>
  <button
    class="flex w-full items-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3 text-left transition-all hover:border-blue-200 hover:bg-blue-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-800 dark:hover:bg-blue-950"
    @click="emit('select-card', city)"
    @dblclick="emit('click-detail', city)"
  >
    <span class="text-lg font-semibold text-zinc-800 dark:text-white">{{ city.name }}</span>
    <span class="text-sm text-zinc-500 dark:text-zinc-400">{{ city.temp }}°C</span>
    <span class="text-xs text-zinc-400 dark:text-zinc-500">{{ city.description }}</span>
    <span
      class="ml-auto rounded-full bg-zinc-200 px-3 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300"
    >
      {{ city.status }}
    </span>
  </button>
</template>
