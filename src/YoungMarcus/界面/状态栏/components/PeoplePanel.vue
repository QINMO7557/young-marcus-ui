<template>
  <div class="panel">
    <h3>身边的人</h3>
    <div v-if="people.length" class="grid">
      <article v-for="p in people" :key="p.name" class="card">
        <header>
          <strong>{{ p.name }}</strong>
          <span>{{ p.关系 || p.身份 || '——' }}</span>
        </header>
        <div class="heart">
          <i class="fa-solid fa-heart" aria-hidden="true" />
          {{ p.好感 }}
        </div>
        <p class="meta">{{ p.当前状态 || p.外貌 || p.性格 || '暂无更多信息' }}</p>
        <ul v-if="Object.keys(p.约定 || {}).length" class="promises">
          <li v-for="(val, key) in p.约定" :key="String(key)">{{ key }}：{{ val }}</li>
        </ul>
      </article>
    </div>
    <p v-else class="empty">还没有记入重要人物。</p>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../../store';
const store = useDataStore();

const people = computed(() =>
  Object.entries(store.data.重要人物 || {}).map(([name, v]) => ({ name, ...v })),
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
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 8px;
}
.card {
  background: #fff;
  border: 1px solid var(--c-border);
  padding: 8px;
  box-shadow: var(--shadow-paper);
}
header {
  display: flex;
  justify-content: space-between;
  gap: 6px;
  font-size: 12px;
  margin-bottom: 4px;
}
.heart {
  color: var(--c-heart);
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 4px;
}
.meta {
  font-size: 11px;
  color: var(--c-text-muted);
}
.promises {
  margin-top: 4px;
  padding-left: 14px;
  font-size: 11px;
}
.empty {
  color: var(--c-text-muted);
  font-size: 12px;
}
</style>
