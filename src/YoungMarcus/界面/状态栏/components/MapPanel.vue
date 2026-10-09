<template>
  <section class="map-panel">
    <header class="head">
      <h3 class="ym-title"><i class="fa-solid fa-map-location-dot" aria-hidden="true" /> 探索地图</h3>
      <button type="button" class="ym-sticker back" @click="$emit('close')">返回状态 ←</button>
    </header>

    <nav class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        class="tab"
        :class="{ on: active === tab.id }"
        @click="switchTab(tab.id)"
      >
        <i v-if="tab.icon" :class="tab.icon" aria-hidden="true" />
        {{ tab.label }}
      </button>
    </nav>

    <div v-if="active === '家附近' || active === '大学城'" class="map-stage ym-sheet">
      <div class="map" :style="{ backgroundImage: `url(${mapUrl})` }">
        <button
          v-for="(pin, i) in pins"
          :key="pin.name"
          type="button"
          class="pin"
          :class="{ here: isHere(pin.name), on: selected?.name === pin.name }"
          :style="{ left: pin.x + '%', top: pin.y + '%', '--d': `${(i % 5) * 0.4}s`, '--pc': pin.color }"
          @click="selected = pin"
        >
          <span class="dot" />
          <span class="label">{{ pin.name }}<em v-if="isHere(pin.name)">你在这里</em></span>
        </button>

        <div v-if="selected" class="info ym-sheet ym-tape" style="--tx: 30%; --ty: -10px; --tw: 52px">
          <button type="button" class="x" aria-label="关闭" @click="selected = null">×</button>
          <h4 class="ym-title">{{ selected.name }}</h4>
          <p>{{ selected.desc }}</p>
          <button type="button" class="ym-stamp go" @click="goTo(selected.name)">前往这里 →</button>
        </div>
      </div>
    </div>

    <div v-else class="list-stage ym-sheet ym-ruled">
      <ul v-if="listEntries.length">
        <li v-for="row in listEntries" :key="row.name">
          <b>{{ row.name }}</b>
          <span>{{ row.desc }}</span>
          <button type="button" class="ym-sticker go-sm" @click="goTo(row.name)">前往 →</button>
        </li>
      </ul>
      <p v-else class="empty">尚未解锁该区域的地点。</p>
    </div>

    <p class="hint"><i class="fa-solid fa-location-dot" aria-hidden="true" /> 点击地点，把目的地写进对话框。</p>
  </section>
</template>

<script setup lang="ts">
import { mapAsset, MAP_FILES } from '../../assets/maps';
import { useDataStore } from '../../store';

defineEmits<{ close: [] }>();
const store = useDataStore();
const tabs = [
  { id: '家附近', label: '家附近', icon: 'fa-solid fa-house' },
  { id: '大学城', label: '大学城', icon: 'fa-solid fa-graduation-cap' },
  { id: '外出', label: '外出', icon: '' },
  { id: '远行', label: '远行', icon: '' },
  { id: '旅途', label: '旅途', icon: '' },
] as const;

type TabId = (typeof tabs)[number]['id'];
type Pin = { name: string; x: number; y: number; desc: string; color: string };

const active = ref<TabId>((store.data.世界.当前区域 as TabId) || '大学城');
const selected = ref<Pin | null>(null);

function switchTab(id: TabId) {
  active.value = id;
  selected.value = null;
}

const mapUrl = computed(() => mapAsset(active.value === '家附近' ? MAP_FILES.home : MAP_FILES.city));

const C = { home: '#c0392b', life: '#2f6fb0', fun: '#7b4fa0', nature: '#2f8a5a', work: '#d08a2a' };

const HOME_PINS: Pin[] = [
  { name: '灯塔岬', x: 86, y: 5, desc: '镇北端的白色灯塔，风大，看海最开阔。', color: C.nature },
  { name: '教堂', x: 51, y: 28, desc: '白尖顶教堂，周日礼拜和社区活动都在这里。', color: C.fun },
  { name: '沙滩', x: 78, y: 31, desc: '小镇西边的海滩，夏天热闹，秋天安静。', color: C.nature },
  { name: '木栈道与码头', x: 88, y: 41, desc: '木栈道连着游艇港，傍晚有人钓鱼。', color: C.nature },
  { name: '邻居家', x: 25, y: 46, desc: '隔壁的邻居，常来借东西、聊两句。', color: C.life },
  { name: '小镇主街', x: 63, y: 48, desc: '餐馆、老电影院和小店都在这条街上。', color: C.work },
  { name: '健身房', x: 40, y: 52, desc: '镇上唯一的健身房，早晚人多。', color: C.fun },
  { name: '家', x: 16, y: 57, desc: '刚搬来的新家，纸箱还没拆完。', color: C.home },
  { name: '超市', x: 56, y: 63, desc: '大停车场的超市，日用品都能买到。', color: C.life },
  { name: '加油站', x: 88, y: 72, desc: '通往州际公路的加油站，24 小时营业。', color: C.work },
  { name: '海鸥湾社区学院', x: 50, y: 75, desc: '霍大附属的社区学院，走读生在这里上课。', color: C.life },
  { name: '社区公园', x: 22, y: 79, desc: '带池塘和凉亭的公园，遛狗跑步的好地方。', color: C.nature },
];

const CITY_PINS: Pin[] = [
  { name: 'High Tai大楼', x: 72, y: 10, desc: '东边老工业区的高楼，夜里灯火通明。', color: C.work },
  { name: '大学主楼', x: 53, y: 29, desc: '红砖钟楼，霍大的心脏。', color: C.life },
  { name: '酒吧街', x: 90, y: 30, desc: '下课后的去处，周末很吵。', color: C.fun },
  { name: '宿舍楼', x: 14, y: 39, desc: '大一新生的宿舍，走廊总有人放音乐。', color: C.home },
  { name: '大学图书馆', x: 66, y: 44, desc: '自习、借书、兼职助理都在这里。', color: C.life },
  { name: '商店街', x: 90, y: 48, desc: '咖啡店、书店和二手服装店。', color: C.work },
  { name: '学生活动中心', x: 73, y: 52, desc: '社团招新、食堂和活动海报墙。', color: C.fun },
  { name: '体育场', x: 20, y: 56, desc: '校队训练场，傍晚常有人夜跑。', color: C.nature },
  { name: '地铁站', x: 77, y: 68, desc: '高架地铁穿过校园，去市中心很方便。', color: C.work },
  { name: '博物馆', x: 10, y: 74, desc: '石柱门廊的老博物馆，学生免费。', color: C.fun },
  { name: '城市公园', x: 86, y: 83, desc: '带喷泉池塘的大公园，适合散步。', color: C.nature },
];

const pins = computed(() => (active.value === '家附近' ? HOME_PINS : CITY_PINS));

function isHere(name: string) {
  const here = store.data.世界.当前地点 || '';
  if (store.data.世界.当前区域 !== active.value || !here) return false;
  return here === name || name.includes(here) || here.includes(name);
}

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
  fillInput(`前往${name}`);
}
</script>

<style lang="scss" scoped>
.map-panel {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.head {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
}
.head h3 {
  font-size: 22px;
}
.head h3 i {
  font-size: 0.75em;
}
.back {
  padding: 4px 12px;
  font-size: 13px;
}

.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
.tab {
  font-family: var(--font-hand);
  font-size: 13px;
  font-weight: 700;
  color: var(--c-text);
  background-color: var(--c-surface-paper-warm);
  background-image: var(--img-grain);
  border: none;
  border-radius: 6px 6px 2px 2px;
  padding: 4px 12px;
  box-shadow: 1px 2px 0 rgba(60, 40, 20, 0.2);
}
.tab i {
  font-size: 11px;
}
.tab.on {
  background-color: var(--c-primary);
  color: var(--c-primary-ink);
}

.map-stage {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  padding: 7px;
  rotate: -0.4deg;
}
.map {
  position: relative;
  width: 100%;
  max-width: 460px;
  margin: 0 auto;
  aspect-ratio: 942 / 1670;
  background: #d9c7a8 center / 100% 100% no-repeat;
}

.pin {
  position: absolute;
  translate: -50% -100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: transparent;
  border: none;
  animation: ym-float 3s ease-in-out infinite;
  animation-delay: var(--d, 0s);
  z-index: 1;
}
.pin:hover,
.pin.on {
  z-index: 3;
}
.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #fff8, transparent 45%), var(--pc, #c0392b);
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.4);
  position: relative;
}
.dot::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 11px;
  width: 1.5px;
  height: 7px;
  translate: -50% 0;
  background: #555;
}
.label {
  order: -1;
  margin-bottom: 2px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: var(--font-hand);
  font-size: 12px;
  font-weight: 700;
  line-height: 1.2;
  white-space: nowrap;
  color: var(--c-text);
  background: rgba(246, 238, 220, 0.94);
  padding: 1px 6px;
  box-shadow: 1px 2px 3px rgba(40, 28, 18, 0.35);
  transition: transform 0.15s ease;
}
.label em {
  font-style: normal;
  font-size: 10px;
  color: var(--c-danger);
}
.pin:hover .label {
  transform: scale(1.08);
}
.pin.here .dot {
  box-shadow: 0 0 0 4px rgba(192, 57, 43, 0.35), 0 2px 3px rgba(0, 0, 0, 0.4);
}
.pin.on .label {
  background: var(--c-primary);
  color: var(--c-primary-ink);
}

.info {
  position: absolute;
  z-index: 5;
  left: 6%;
  right: 6%;
  bottom: 3%;
  padding: 12px 12px 10px;
  rotate: -1deg;
  box-shadow: var(--shadow-lift);
}
.info h4 {
  font-size: 20px;
}
.info p {
  font-family: var(--font-hand);
  font-size: 13px;
  margin: 2px 0 8px;
}
.info .x {
  position: absolute;
  right: 8px;
  top: 4px;
  border: none;
  background: transparent;
  font-size: 18px;
  color: var(--c-text-muted);
}
.go {
  padding: 6px 14px;
  font-size: 14px;
}

.list-stage {
  padding: 10px 12px 10px 40px;
  min-height: 140px;
}
.list-stage ul {
  list-style: none;
}
.list-stage li {
  display: flex;
  gap: 10px;
  align-items: center;
  min-height: 32px;
  font-family: var(--font-hand);
  font-size: 13px;
}
.list-stage li span {
  flex: 1;
  color: var(--c-text-muted);
}
.go-sm {
  padding: 2px 10px;
  font-size: 12px;
}
.empty {
  font-family: var(--font-hand);
  color: var(--c-text-muted);
  line-height: 32px;
}

.hint {
  align-self: center;
  font-family: var(--font-hand);
  font-size: 12.5px;
  background: var(--c-surface-paper-warm);
  padding: 3px 14px;
  box-shadow: var(--shadow-paper);
  rotate: 0.5deg;
}
</style>
