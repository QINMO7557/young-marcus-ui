<template>
  <aside class="note">
    <h3>今日状况</h3>
    <p>{{ store.data.世界.今日状况 || '（暂无记录）' }}</p>
  </aside>
</template>

<script setup lang="ts">
import { useDataStore } from '../../store';
const store = useDataStore();
</script>

<style lang="scss" scoped>
.note {
  background: var(--c-surface-note);
  border: 1px solid var(--c-border);
  box-shadow: var(--shadow-paper);
  padding: 10px 12px;
  min-height: 110px;
  transform: rotate(0.6deg);
}

h3 {
  font-size: 12px;
  margin-bottom: 6px;
}

p {
  font-size: 12px;
  white-space: pre-wrap;
}
</style>
