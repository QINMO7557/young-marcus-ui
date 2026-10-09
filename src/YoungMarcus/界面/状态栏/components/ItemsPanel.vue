<template>
  <div class="panel">
    <h3>随身道具</h3>
    <ul v-if="items.length">
      <li v-for="it in items" :key="it.name">
        <strong>{{ it.name }}</strong>
        <span>×{{ it.数量 }}</span>
        <p>{{ it.说明 || '—' }}</p>
      </li>
    </ul>
    <p v-else class="empty">口袋空空。</p>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../../store';
const store = useDataStore();

const items = computed(() =>
  Object.entries(store.data.道具 || {}).map(([name, v]) => ({ name, ...v })),
);
</script>

<style lang="scss" scoped>
.panel {
  background: var(--c-surface-paper);
  border: 1px solid var(--c-border);
  padding: 10px 12px;
  min-height: 140px;
}
h3 {
  font-size: 13px;
  margin-bottom: 8px;
}
ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
li {
  border-bottom: 1px dashed rgba(150, 120, 90, 0.35);
  padding-bottom: 6px;
  font-size: 12px;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 2px 8px;
}
li p {
  grid-column: 1 / -1;
  color: var(--c-text-muted);
  font-size: 11px;
}
.empty {
  color: var(--c-text-muted);
  font-size: 12px;
}
</style>
