<template>
  <svg class="ym-leaf" viewBox="0 0 100 100" :width="size" :height="size" aria-hidden="true">
    <path
      :fill="color"
      d="M50 4l7 18 10-6-3 20 15-9-2 10 14 2-11 12 6 6-20 4 2 10-15-7-2 22h-2l-2-22-15 7 2-10-20-4 6-6L9 39l14-2-2-10 15 9-3-20 10 6z"
    />
    <path d="M50 18v76M50 56l-22-14M50 56l22-14M50 72l-14-4M50 72l14-4" stroke="rgba(90,30,10,.45)" stroke-width="1.4" fill="none" />
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ size?: number; color?: string }>(), { size: 64, color: '#c4532c' });
</script>

<style scoped>
.ym-leaf {
  position: absolute;
  pointer-events: none;
  filter: drop-shadow(2px 3px 2px rgba(40, 20, 10, 0.3));
}
</style>
