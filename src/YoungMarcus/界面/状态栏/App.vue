<template>
  <div class="status-root">
    <TopBar :map-open="showMap" @toggle-map="showMap = !showMap" />

    <div v-show="!collapsed" class="body ym-kraft">
      <MapPanel v-if="showMap" @close="showMap = false" />

      <template v-else>
        <div class="identity">
          <StudentCard />
          <TodayNote />
        </div>

        <div class="drawer">
          <nav class="tabs">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              type="button"
              class="tab"
              :class="{ on: activeTab === tab.id }"
              @click="activeTab = tab.id"
            >
              <i :class="tab.icon" aria-hidden="true" />
              {{ tab.label }}
            </button>
          </nav>

          <div class="panel-stage">
            <SchedulePanel v-if="activeTab === '日程'" />
            <PeoplePanel v-else-if="activeTab === '人物'" />
            <ItemsPanel v-else />
          </div>
        </div>
      </template>
    </div>

    <div class="footer">
      <button type="button" class="collapse ym-tape" style="--tw: 34px; --ty: -8px; --tr: 3deg" @click="collapsed = !collapsed">
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
  { id: '日程' as const, label: '日程', icon: 'fa-regular fa-calendar-check' },
  { id: '人物' as const, label: '人物', icon: 'fa-solid fa-user-group' },
  { id: '道具' as const, label: '道具', icon: 'fa-solid fa-briefcase' },
];
</script>

<style lang="scss" scoped>
.status-root {
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 4px 2px;
}

.body {
  border-radius: 6px;
  padding: 12px 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.identity {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
  gap: 12px;
  align-items: start;
}
@media (max-width: 520px) {
  .identity {
    grid-template-columns: 1fr;
  }
}

.tabs {
  display: flex;
  gap: 4px;
  padding-left: 8px;
}
.tab {
  position: relative;
  border: none;
  border-radius: 8px 8px 0 0;
  background: rgba(239, 226, 198, 0.65);
  padding: 5px 14px 4px;
  font-family: var(--font-hand);
  font-size: 13px;
  font-weight: 700;
  color: var(--c-text-muted);
  translate: 0 3px;
  transition: translate 0.15s ease;
}
.tab i {
  font-size: 11px;
  margin-right: 2px;
}
.tab:hover {
  translate: 0 0;
}
.tab.on {
  background: var(--c-surface-paper);
  color: var(--c-text);
  translate: 0 1px;
}

.panel-stage {
  width: 100%;
  aspect-ratio: 16 / 10;
  min-height: 180px;
  max-height: 420px;
  overflow: hidden;
}
.panel-stage > * {
  height: 100%;
  overflow: auto;
  overscroll-behavior: contain;
}

.footer {
  display: flex;
  justify-content: center;
}
.collapse {
  position: relative;
  font-family: var(--font-hand);
  font-size: 13px;
  font-weight: 700;
  color: var(--c-text);
  background-color: var(--c-surface-paper-warm);
  background-image: var(--img-grain);
  border: none;
  padding: 4px 18px;
  box-shadow: var(--shadow-paper);
  rotate: -1deg;
}
</style>
