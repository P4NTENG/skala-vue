<script setup>
import { cn } from "@inspira-ui/plugins";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { onMounted, onUnmounted, ref } from "vue";

const props = defineProps({
  class: {
    type: [Boolean, null, String, Object, Array],
    required: false,
    skipCheck: true,
  },
  containerClass: {
    type: [Boolean, null, String, Object, Array],
    required: false,
    skipCheck: true,
  },
  duration: { type: Number, required: false, default: 0.6 },
  delay: { type: Number, required: false, default: 0.2 },
  stagger: { type: Number, required: false, default: 0.1 },
});

gsap.registerPlugin(SplitText);

const textContainer = ref(null);
let split;

onMounted(() => {
  if (!textContainer.value) return;

  gsap.set(textContainer.value, { opacity: 1 });

  SplitText.create(textContainer.value, {
    type: "words,lines",
    linesClass: "line",
    autoSplit: true,
    mask: "lines",
    onSplit: (splitText) => {
      split = gsap.from(splitText.lines, {
        duration: props.duration,
        delay: props.delay,
        yPercent: 100,
        opacity: 0,
        stagger: props.stagger,
        ease: "expo.out",
      });
    },
  });
});

onUnmounted(() => {
  split?.kill();
});
</script>

<template>
  <div :class="cn(`overflow-hidden`, props.containerClass)">
    <div ref="textContainer" :class="[props.class]">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.line {
  overflow: hidden;
}
</style>
