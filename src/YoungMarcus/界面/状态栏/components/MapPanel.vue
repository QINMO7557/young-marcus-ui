<template>
  <section class="map-panel">
    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        class="tab"
        :class="{ on: active === tab.id }"
        @click="active = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <div v-if="active === '家附近' || active === '大学城'" class="map-stage">
      <div class="map" :style="{ backgroundImage: `url(${mapUrl})` }">
        <button
          v-for="pin in pins"
          :key="pin.name"
          type="button"
          class="pin"
          :style="{ left: pin.x, top: pin.y }"
          @click="goTo(pin.name)"
        >
          <span class="head" />
          <span class="label">{{ pin.name }}</span>
        </button>
      </div>
      <p class="hint">点击地点 → 填入「前往 X」到输入框</p>
    </div>

    <div v-else class="list-stage">
      <ul v-if="listEntries.length">
        <li v-for="row in listEntries" :key="row.name">
          <button type="button" @click="goTo(row.name)">前往 {{ row.name }}</button>
          <span>{{ row.desc }}</span>
        </li>
      </ul>
      <p v-else class="empty">尚未解锁该区域的地点。</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { mapAsset, MAP_FILES } from '../../assets/maps';
import { useDataStore } from '../../store';

const store = useDataStore();
const tabs = [
  { id: '家附近', label: '家附近' },
  { id: '大学城', label: '大学城' },
  { id: '外出', label: '外出' },
  { id: '远行', label: '远行' },
  { id: '旅途', label: '旅途' },
] as const;

type TabId = (typeof tabs)[number]['id'];
const active = ref<TabId>((store.data.世界.当前区域 as TabId) || '大学城');

const mapUrl = computed(() =>
  mapAsset(active.value === '家附近' ? MAP_FILES.home : MAP_FILES.city),
);

const HOME_PINS = [
  { name: '家', x: '42%', y: '58%' },
  { name: '主街', x: '55%', y: '40%' },
  { name: '码头', x: '30%', y: '72%' },
  { name: '灯塔', x: '22%', y: '28%' },
];

const CITY_PINS = [
  { name: '宿舍', x: '48%', y: '55%' },
  { name: '图书馆', x: '58%', y: '38%' },
  { name: '教学楼', x: '40%', y: '42%' },
  { name: '体育馆', x: '65%', y: '60%' },
];

const pins = computed(() => (active.value === '家附近' ? HOME_PINS : CITY_PINS));

const listEntries = computed(() => {
  if (active.value === '外出') {
    return Object.entries(store.data.地图解锁.外出 || {}).map(([name, desc]) => ({ name, desc }));
  }
  if (active.value === '远行') {
    return Object.entries(store.data.地图解锁.远行 || {}).map(([name, desc]) => ({ name, desc }));
  }
  if (active.value === '旅途') {
    return Object.entries(store.data.地图解锁.旅途 || {}).map(([name, v]) => ({
      name,
      desc: [v.季节或时间, v.备忘].filter(Boolean).join(' · ') || '去过',
    }));
  }
  return [];
});

function fillInput(text: string) {
  const docs: Document[] = [document];
  try {
    if (window.parent && window.parent.document) docs.push(window.parent.document);
  } catch {
    /* cross-origin */
  }
  for (const doc of docs) {
    const el = doc.querySelector('#send_textarea') as HTMLTextAreaElement | null;
    if (el) {
      el.value = text;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.focus();
      return true;
    }
  }
  void triggerSlash(`/echo severity=info ${text}`);
  toastr.info(`已生成：${text}（若未写入输入框，请手动粘贴）`);
  return false;
}

function goTo(name: string) {
  const text = `前往${name}`;
  fillInput(text);
}
</script>

<style lang="scss" scoped>
.map-panel {
  background: var(--c-surface-folder);
  border: 1px solid var(--c-border);
  box-shadow: var(--shadow-paper);
  padding: 8px;
}

.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 8px;
}

.tab {
  border: 1px solid var(--c-border);
  background: var(--c-surface-paper);
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 700;
}

.tab.on {
  background: var(--c-primary);
  color: #fff;
  border-color: var(--c-primary);
}

.map {
  position: relative;
  min-height: 280px;
  background: #d9c7a8 center / cover no-repeat;
  border-radius: 4px;
  overflow: hidden;
}

.pin {
  position: absolute;
  transform: translate(-50%, -100%);
  background: transparent;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.head {
  width: 14px;
  height: 14px;
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  background: #c45c4a;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

.label {
  background: rgba(255, 250, 240, 0.95);
  border: 1px solid var(--c-border);
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
}

.hint,
.empty {
  margin-top: 6px;
  font-size: 11px;
  color: var(--c-text-muted);
  text-align: center;
}

.list-stage ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.list-stage li {
  display: flex;
  gap: 10px;
  align-items: center;
  background: var(--c-surface-paper);
  border: 1px solid var(--c-border);
  padding: 6px 8px;
  font-size: 12px;
}

.list-stage button {
  border: 1px solid var(--c-primary);
  background: #fff;
  color: var(--c-primary);
  border-radius: 4px;
  padding: 3px 8px;
  font-weight: 700;
}
</style>
