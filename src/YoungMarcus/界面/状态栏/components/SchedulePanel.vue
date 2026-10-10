<template>
  <div class="panel ym-sheet">
    <h3 class="ym-title"><i class="fa-regular fa-calendar-check" aria-hidden="true" /> 今日日程</h3>
    <ul v-if="items.length">
      <li v-for="item in items" :key="item.key" :class="{ done: item.是否完成 }">
        <span class="time">{{ item.时间 || '--:--' }}</span>
        <span class="content">
          {{ item.key }}<small v-if="item.内容 || item.地点"> · {{ [item.内容, item.地点].filter(Boolean).join(' @ ') }}</small>
        </span>
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
  Object.entries(store.data.日程.今日日程 || {})
    .map(([key, v]) => ({ key, ...v }))
    .sort((a, b) => (a.时间 || '').localeCompare(b.时间 || '')),
);
</script>

<style lang="scss" scoped>
.panel {
  min-height: 160px;
  height: 100%;
  padding: 10px 14px 12px 34px;
  background-image:
    radial-gradient(circle at 12px 50%, #7a5a3a 0 4px, transparent 4.5px),
    var(--img-grain),
    repeating-linear-gradient(transparent 0 31px, var(--c-rule) 31px 32px);
  background-size: 24px 26px, auto, auto;
  background-repeat: repeat-y, repeat, repeat;
  background-position: 0 6px, 0 0, 0 8px;
  border-radius: 0 3px 3px 3px;
}
h3 {
  font-size: 18px;
  margin-bottom: 4px;
}
h3 i {
  font-size: 0.8em;
}
ul {
  list-style: none;
}
li {
  display: grid;
  grid-template-columns: 52px 1fr 20px;
  gap: 8px;
  align-items: center;
  min-height: 32px;
  font-family: var(--font-hand);
  font-size: 14px;
}
li small {
  color: var(--c-text-muted);
  font-size: 12px;
}
li.done .content {
  text-decoration: line-through;
  text-decoration-color: rgba(58, 42, 31, 0.6);
  color: var(--c-text-muted);
}
.time {
  font-family: var(--font-latin);
  font-weight: 700;
}
.mark {
  font-size: 16px;
  color: var(--c-primary);
}
.empty {
  font-family: var(--font-hand);
  color: var(--c-text-muted);
  line-height: 32px;
}
</style>
