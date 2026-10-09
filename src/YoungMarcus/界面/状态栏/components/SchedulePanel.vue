<template>
  <div class="panel">
    <h3>今日日程</h3>
    <ul v-if="items.length">
      <li v-for="item in items" :key="item.key" :class="{ done: item.是否完成 }">
        <span class="time">{{ item.时间 || '--:--' }}</span>
        <span class="content">{{ item.key }}{{ item.内容 ? ` · ${item.内容}` : '' }}</span>
        <span class="mark">{{ item.是否完成 ? '✓' : '○' }}</span>
      </li>
    </ul>
    <p v-else class="empty">今天还没有安排。</p>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../../store';
const store = useDataStore();

const items = computed(() =>
  Object.entries(store.data.日程.今日日程 || {}).map(([key, v]) => ({ key, ...v })),
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
  gap: 6px;
}
li {
  display: grid;
  grid-template-columns: 52px 1fr 18px;
  gap: 6px;
  font-size: 12px;
  padding-bottom: 4px;
  border-bottom: 1px dashed rgba(150, 120, 90, 0.35);
}
li.done .content {
  text-decoration: line-through;
  color: var(--c-text-muted);
}
.time {
  font-weight: 700;
  color: var(--c-primary);
}
.empty {
  color: var(--c-text-muted);
  font-size: 12px;
}
</style>
