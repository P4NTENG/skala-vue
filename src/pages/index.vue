<script setup>
import { AuroraBackground } from "@/components/ui/aurora-background"

defineOptions({ name: "HomePage" })
</script>

<template>
  <AuroraBackground :radial-gradient="true">
    <div class="relative flex flex-col items-center justify-center gap-4 px-4">
      <div class="text-center text-3xl font-bold md:text-7xl dark:text-white">
        SKALA Front-end
      </div>
      <div class="py-4 text-base font-thin md:text-4xl dark:text-neutral-200">
        Vue 3 연습하기
      </div>
    </div>
  </AuroraBackground>
</template>
