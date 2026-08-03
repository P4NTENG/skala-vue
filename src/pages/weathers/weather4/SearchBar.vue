<script setup>
defineProps({
  modelValue: { type: String, default: '' },
})

const emit = defineEmits(['update-query'])
</script>

<template>
  <input
    :value="modelValue"
    type="text"
    placeholder="도시 이름을 입력하세요 (예: 서울, 부산)"
    class="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder-zinc-500 dark:focus:border-blue-600 dark:focus:ring-blue-900"
    @input="emit('update-query', $event.target.value)"
  />
</template>
