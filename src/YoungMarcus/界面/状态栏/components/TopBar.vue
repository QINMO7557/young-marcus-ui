<template>
  <div class="topbar">
    <span class="item">
      <i class="fa-solid fa-calendar-days" aria-hidden="true" />
      {{ dateText }}
    </span>
    <span class="item">
      <i class="fa-solid fa-location-dot" aria-hidden="true" />
      {{ store.data.世界.当前区域 }} · {{ store.data.世界.当前地点 }}
    </span>
    <span class="item">
      <i class="fa-solid fa-cloud-sun" aria-hidden="true" />
      {{ store.data.世界.天气 }}
    </span>
    <button type="button" class="map-btn" @click="$emit('toggle-map')">
      <i class="fa-solid fa-map" aria-hidden="true" />
      地图
    </button>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../../store';

defineEmits<{ 'toggle-map': [] }>();
const store = useDataStore();

const dateText = computed(() => {
  const w = store.data.世界;
  return `${w.日期} ${w.星期} · ${w.时段}`;
});
</script>

<style lang="scss" scoped>
.topbar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 14px;
  align-items: center;
  background: var(--c-surface-paper);
  border: 1px solid var(--c-border);
  box-shadow: var(--shadow-paper);
  padding: 8px 10px;
  font-size: 12px;
  font-weight: 600;
}

.item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--c-text);
}

.map-btn {
  margin-left: auto;
  border: 1px solid var(--c-border);
  background: var(--c-surface);
  border-radius: 4px;
  padding: 3px 8px;
  font-size: 12px;
  font-weight: 700;
}

.map-btn:hover {
  background: var(--c-primary);
  color: #fff;
  border-color: var(--c-primary);
}
</style>
