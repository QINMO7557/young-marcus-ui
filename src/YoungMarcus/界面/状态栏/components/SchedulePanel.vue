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

    <div class="cards">
      <button type="button" class="card" :class="{ open: showSchedule }" @click="showSchedule = !showSchedule">
        <span><i class="fa-solid fa-book" aria-hidden="true" /> 完整课表</span>
        <span class="chev">{{ showSchedule ? '收起' : '展开' }}</span>
      </button>
      <div v-if="showSchedule" class="sheet ym-ruled">
        <template v-if="weekDays.length">
          <div v-for="day in weekDays" :key="day" class="day">
            <b>{{ day }}</b>
            <ul>
              <li v-for="c in coursesOf(day)" :key="c.name">
                <span class="t">{{ c.开始时刻 }}</span>
                {{ c.name }}
                <small>{{ [c.地点, c.教师].filter(Boolean).join(' · ') }} · {{ c.时长分钟 }}min</small>
              </li>
            </ul>
          </div>
        </template>
        <p v-else class="empty blank">（暂无课表）</p>
      </div>

      <button type="button" class="card" :class="{ open: showJob }" @click="showJob = !showJob">
        <span><i class="fa-solid fa-briefcase" aria-hidden="true" /> 打工表</span>
        <span class="chev">{{ showJob ? '收起' : '展开' }}</span>
      </button>
      <div v-if="showJob" class="sheet ym-ruled">
        <template v-if="store.data.日程.兼职岗位 && store.data.日程.兼职岗位 !== '无'">
          <p class="job">岗位：{{ store.data.日程.兼职岗位 }}</p>
          <ul v-if="jobToday.length">
            <li v-for="j in jobToday" :key="j.key">
              <span class="t">{{ j.时间 }}</span> {{ j.key }}
              <small>{{ [j.内容, j.地点].filter(Boolean).join(' · ') }}</small>
            </li>
          </ul>
          <p v-else class="empty blank">今日日程里没有打工相关项。</p>
        </template>
        <p v-else class="empty blank">（暂无打工）</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../../store';
const store = useDataStore();

const showSchedule = ref(false);
const showJob = ref(false);

const items = computed(() =>
  Object.entries(store.data.日程.今日日程 || {})
    .map(([key, v]) => ({ key, ...v }))
    .sort((a, b) => (a.时间 || '').localeCompare(b.时间 || '')),
);

const weekOrder = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] as const;
const weekDays = computed(() => weekOrder.filter(d => Object.keys(store.data.日程.课表?.[d] || {}).length));

function coursesOf(day: string) {
  const rec = store.data.日程.课表?.[day as keyof typeof store.data.日程.课表] || {};
  return Object.entries(rec)
    .map(([name, v]) => ({ name, ...v }))
    .sort((a, b) => (a.开始时刻 || '').localeCompare(b.开始时刻 || ''));
}

const jobToday = computed(() =>
  Object.entries(store.data.日程.今日日程 || {})
    .map(([key, v]) => ({ key, ...v }))
    .filter(x => /打工|兼职|班次|岗位/.test(x.key + (x.内容 || '')))
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
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow: auto;
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
.empty.blank {
  line-height: 1.4;
  min-height: 1.4em;
  padding: 4px 0;
}
.cards {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 8px;
  padding-right: 4px;
}
.card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: none;
  background: rgba(239, 226, 198, 0.55);
  padding: 7px 10px;
  border-radius: 3px;
  font-family: var(--font-hand);
  font-size: 13.5px;
  color: var(--c-text);
  box-shadow: 1px 1px 0 rgba(60, 40, 20, 0.12);
  cursor: pointer;
  text-align: left;
}
.card.open {
  background: var(--c-primary);
  color: var(--c-primary-ink);
}
.card .chev {
  font-size: 12px;
  opacity: 0.85;
}
.sheet {
  padding: 8px 10px 10px 8px;
  font-family: var(--font-hand);
  font-size: 13px;
  margin-bottom: 2px;
}
.day {
  margin-bottom: 6px;
}
.day ul {
  list-style: none;
  padding-left: 4px;
}
.day li,
.sheet > ul li {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 8px;
  align-items: baseline;
  min-height: 28px;
  grid-template-columns: none;
}
.t {
  font-family: var(--font-latin);
  font-weight: 700;
  min-width: 42px;
}
.job {
  margin-bottom: 4px;
}
</style>
