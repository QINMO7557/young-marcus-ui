<template>
  <svg class="ym-postmark" viewBox="0 0 150 80" :width="width" aria-hidden="true">
    <g fill="none" :stroke="color" stroke-width="2">
      <circle cx="40" cy="40" r="32" />
      <circle cx="40" cy="40" r="25" stroke-width="1" />
      <path d="M78 22q9-6 18 0t18 0 18 0M78 34q9-6 18 0t18 0 18 0M78 46q9-6 18 0t18 0 18 0M78 58q9-6 18 0t18 0 18 0" />
    </g>
    <text x="40" y="36" text-anchor="middle" :fill="color" font-size="9" font-weight="700" letter-spacing="1">{{ top }}</text>
    <text x="40" y="50" text-anchor="middle" :fill="color" font-size="8">{{ bottom }}</text>
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ top?: string; bottom?: string; color?: string; width?: number }>(), {
  top: 'GULLHAVEN',
  bottom: 'SEP · 01',
  color: 'rgba(160, 60, 50, 0.55)',
  width: 120,
});
</script>

<style scoped>
.ym-postmark {
  position: absolute;
  pointer-events: none;
  font-family: Georgia, serif;
}
</style>
