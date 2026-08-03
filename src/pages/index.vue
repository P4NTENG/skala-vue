<script setup>
import { AuroraBackground } from "@/components/ui/aurora-background"

defineOptions({ name: "HomePage" })
</script>

<template>
  <AuroraBackground :radial-gradient="true">
    <div class="relative flex flex-col items-center justify-center gap-4 px-4">
      <div class="text-center text-3xl font-bold md:text-7xl dark:text-white">
        Background lights are cool you know.
      </div>
      <div class="py-4 text-base font-extralight md:text-4xl dark:text-neutral-200">
        And this, is chemical burn.
      </div>
      <button
        class="w-fit rounded-full bg-black px-4 py-2 text-white dark:bg-white dark:text-black"
      >
        Burn it now
      </button>
    </div>
  </AuroraBackground>
</template>
