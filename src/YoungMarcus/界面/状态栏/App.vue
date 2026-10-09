<template>
  <div class="status-root">
    <TopBar @toggle-map="showMap = !showMap" />

    <div v-show="!collapsed" class="body">
      <MapPanel v-if="showMap" />

      <template v-else>
        <div class="identity">
          <StudentCard />
          <TodayNote />
        </div>

        <nav class="tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            type="button"
            class="tab"
            :class="{ on: activeTab === tab.id }"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </nav>

        <SchedulePanel v-if="activeTab === '日程'" />
        <PeoplePanel v-else-if="activeTab === '人物'" />
        <ItemsPanel v-else />
      </template>
    </div>

    <div class="footer">
      <button type="button" class="collapse" @click="collapsed = !collapsed">
        {{ collapsed ? '展开 ▼' : '收起 ▲' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import ItemsPanel from './components/ItemsPanel.vue';
import MapPanel from './components/MapPanel.vue';
import PeoplePanel from './components/PeoplePanel.vue';
import SchedulePanel from './components/SchedulePanel.vue';
import StudentCard from './components/StudentCard.vue';
import TodayNote from './components/TodayNote.vue';
import TopBar from './components/TopBar.vue';

const collapsed = useLocalStorage('ym:status:collapsed', false);
const showMap = useLocalStorage('ym:status:showMap', false);
const activeTab = useLocalStorage<'日程' | '人物' | '道具'>('ym:status:tab', '日程');

const tabs = [
  { id: '日程' as const, label: '日程' },
  { id: '人物' as const, label: '人物' },
  { id: '道具' as const, label: '道具' },
];
</script>

<style lang="scss" scoped>
.status-root {
  max-width: 760px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.body {
  background:
    radial-gradient(circle at 10% 0%, rgba(180, 90, 40, 0.07), transparent 35%),
    var(--c-surface-folder);
  border: 1px solid var(--c-border);
  box-shadow: var(--shadow-paper);
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.identity {
  display: grid;
  grid-template-columns: 1.2fr 0.9fr;
  gap: 8px;
}

@media (max-width: 640px) {
  .identity {
    grid-template-columns: 1fr;
  }
}

.tabs {
  display: flex;
  gap: 4px;
}

.tab {
  flex: 1;
  border: 1px solid var(--c-border);
  background: rgba(255, 255, 255, 0.55);
  padding: 6px;
  font-weight: 700;
  font-size: 12px;
}

.tab.on {
  background: var(--c-primary);
  color: #fff;
  border-color: var(--c-primary);
}

.footer {
  display: flex;
  justify-content: center;
}

.collapse {
  border: 1px solid var(--c-border);
  background: var(--c-surface-paper);
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  box-shadow: var(--shadow-paper);
}
</style>
