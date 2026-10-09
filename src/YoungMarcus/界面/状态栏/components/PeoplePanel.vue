<template>
  <div class="panel ym-sheet">
    <h3 class="ym-title"><i class="fa-solid fa-user-group" aria-hidden="true" /> 身边的人</h3>
    <div v-if="people.length" class="grid">
      <article
        v-for="(p, i) in people"
        :key="p.name"
        class="polaroid ym-lift ym-tape"
        :style="{ '--r': `${tilt(i)}deg`, '--tw': '40px', '--ty': '-9px' }"
      >
        <div class="photo" :style="{ background: avatarBg(p.name) }">
          <span>{{ p.name.slice(0, 1) }}</span>
        </div>
        <p class="cap">{{ p.name }} · {{ p.关系 || p.身份 || '——' }}</p>
        <p class="heart"><i class="fa-solid fa-heart" aria-hidden="true" /> {{ p.好感 }}</p>
        <p class="meta">{{ p.当前状态 || p.性格 || p.外貌 || '暂无更多信息' }}</p>
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

const tilt = (i: number) => [-2.5, 1.8, -1, 2.4, -1.8][i % 5];

const PALETTE = [
  ['#e6a868', '#5c7f99'],
  ['#c9806a', '#3f4f63'],
  ['#9fae7c', '#4e5d3c'],
  ['#d7b56d', '#7b4f32'],
  ['#a7b8c8', '#4b3a52'],
];
function avatarBg(name: string) {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const [a, b] = PALETTE[h % PALETTE.length]!;
  return `linear-gradient(170deg, ${a}, ${b})`;
}
</script>

<style lang="scss" scoped>
.panel {
  min-height: 130px;
  padding: 10px 12px 14px;
  border-radius: 0 3px 3px 3px;
}
h3 {
  font-size: 18px;
  margin-bottom: 12px;
}
h3 i {
  font-size: 0.8em;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(118px, 150px));
  justify-content: start;
  gap: 14px 12px;
}
.polaroid {
  position: relative;
  background: #fbf8f1;
  padding: 6px 6px 8px;
  box-shadow: var(--shadow-paper);
}
.photo {
  aspect-ratio: 4 / 3;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 0 18px rgba(0, 0, 0, 0.25);
}
.photo span {
  font-family: var(--font-latin);
  font-size: 24px;
  color: rgba(255, 250, 240, 0.85);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}
.cap {
  margin-top: 5px;
  font-family: var(--font-hand);
  font-size: 13px;
  text-align: center;
  font-weight: 700;
}
.heart {
  text-align: center;
  color: #c0505a;
  font-size: 12px;
  font-family: var(--font-latin);
}
.meta {
  margin-top: 3px;
  font-family: var(--font-hand);
  font-size: 11.5px;
  color: var(--c-text-muted);
  line-height: 1.45;
}
.promises {
  margin-top: 4px;
  padding-left: 14px;
  font-family: var(--font-hand);
  font-size: 11px;
}
.empty {
  font-family: var(--font-hand);
  color: var(--c-text-muted);
}
</style>
