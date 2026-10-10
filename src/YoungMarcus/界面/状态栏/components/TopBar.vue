<template>
  <div class="topbar ym-sheet ym-tape" style="--tx: 4%; --ty: -6px; --tr: -35deg; --tw: 40px">
    <span class="item">
      <i class="fa-regular fa-calendar" aria-hidden="true" />
      {{ dateText }}
    </span>
    <span class="sep" />
    <span class="item">
      <i class="fa-solid fa-location-dot" aria-hidden="true" />
      {{ store.data.世界.当前区域 }} · {{ store.data.世界.当前地点 }}
    </span>
    <span class="sep" />
    <span class="item">
      <i :class="weatherIcon" aria-hidden="true" />
      {{ store.data.世界.天气 }}
    </span>
    <button type="button" class="map-btn" :class="{ on: mapOpen }" @click="$emit('toggle-map')">
      <i :class="mapOpen ? 'fa-solid fa-id-card' : 'fa-solid fa-map-location-dot'" aria-hidden="true" />
      {{ mapOpen ? '状态' : '地图' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../../store';

defineProps<{ mapOpen?: boolean }>();
defineEmits<{ 'toggle-map': [] }>();
const store = useDataStore();

const dateText = computed(() => {
  const w = store.data.世界;
  const clock = w.时刻 || '';
  const slot = w.时段 || '';
  return clock ? `${w.日期} ${w.星期} · ${clock}` : `${w.日期} ${w.星期} · ${slot}`;
});

const WEATHER_ICONS: Record<string, string> = {
  晴: 'fa-solid fa-sun',
  多云: 'fa-solid fa-cloud-sun',
  阴: 'fa-solid fa-cloud',
  小雨: 'fa-solid fa-cloud-rain',
  暴雨: 'fa-solid fa-cloud-showers-heavy',
  小雪: 'fa-regular fa-snowflake',
  大雪: 'fa-solid fa-snowflake',
  雾: 'fa-solid fa-smog',
  大风: 'fa-solid fa-wind',
};
const weatherIcon = computed(() => WEATHER_ICONS[store.data.世界.天气] ?? 'fa-solid fa-cloud-sun');
</script>

<style lang="scss" scoped>
.topbar {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 10px;
  align-items: center;
  padding: 7px 10px 7px 14px;
  font-family: var(--font-hand);
  font-size: 13px;
  font-weight: 700;
  border-radius: 2px;
}
.item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}
.item i {
  color: var(--c-text-muted);
}
.sep {
  width: 1px;
  height: 14px;
  background: rgba(90, 65, 40, 0.35);
}
.map-btn {
  margin-left: auto;
  font-family: var(--font-hand);
  font-size: 13px;
  font-weight: 700;
  color: var(--c-primary-ink);
  background: var(--c-primary);
  border: none;
  border-radius: 4px;
  padding: 3px 10px;
  box-shadow: inset 0 0 0 1.5px rgba(244, 236, 217, 0.45), 1px 2px 0 rgba(30, 20, 10, 0.25);
  transition: transform 0.15s ease;
}
.map-btn:hover {
  transform: translateY(-1px) rotate(-1deg);
}
.map-btn.on {
  background: var(--c-accent);
  color: #3a2a1f;
}
</style>
