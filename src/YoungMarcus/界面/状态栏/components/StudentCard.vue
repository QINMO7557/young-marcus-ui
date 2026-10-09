<template>
  <article class="id-card ym-sheet">
    <Paperclip class="clip" />
    <header>
      <div>
        <span class="ym-title">{{ idTitle }}</span>
        <small>{{ idSub }}</small>
      </div>
      <i class="stripes" aria-hidden="true" />
    </header>
    <div class="body">
      <div class="info">
        <p><span>姓名：</span><b>{{ store.data.主角.姓名 }}</b></p>
        <p><span>年龄：</span><b>{{ store.data.主角.年龄 }}</b></p>
        <p v-if="store.data.主角.身高"><span>身高：</span><b>{{ store.data.主角.身高 }}</b></p>
        <p class="bio">{{ store.data.主角.自述 || '在路上，遇见更好的自己。' }}</p>
      </div>
      <div class="stats">
        <div v-for="bar in bars" :key="bar.label" class="bar">
          <span>{{ bar.label }}</span>
          <div class="track"><i :style="{ width: bar.pct + '%', background: bar.color }" /></div>
          <em>{{ bar.text }}</em>
        </div>
        <div class="money"><span>金钱</span><b>$ {{ store.data.主角.金钱 }}</b></div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import Paperclip from '../../shared/Paperclip.vue';
import { useDataStore } from '../../store';

const store = useDataStore();

const isHome = computed(() => store.data.世界.主线 === '家里线');
const idTitle = computed(() => (isHome.value ? '居民卡' : '学生证'));
const idSub = computed(() =>
  isHome.value ? `GULLHAVEN · ${store.data.主角.身份 || '海鸥湾镇居民'}` : `STUDENT ID · ${store.data.主角.身份 || ''}`,
);

function pct(n: number, max = 100) {
  return Math.max(0, Math.min(100, Math.round((n / max) * 100)));
}

const bars = computed(() => {
  const p = store.data.主角;
  const staminaMax = Math.max(1, p.体力.上限);
  return [
    { label: '体力', pct: pct(p.体力.当前, staminaMax), text: `${p.体力.当前}/${staminaMax}`, color: '#6f9a5c' },
    { label: '魅力', pct: pct(p.魅力), text: String(p.魅力), color: '#c0605a' },
    { label: '智力', pct: pct(p.智力), text: String(p.智力), color: '#4f7aa6' },
    { label: '体能', pct: pct(p.体能), text: String(p.体能), color: '#d09a3e' },
  ];
});
</script>

<style lang="scss" scoped>
.id-card {
  border-radius: 6px;
  rotate: -0.6deg;
  overflow: visible;
  border: 1px solid rgba(47, 79, 104, 0.35);
}
.clip {
  left: 14px;
  top: -16px;
  rotate: -6deg;
}
header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 7px 12px 6px 34px;
  background-color: var(--c-surface-id);
  background-image: var(--img-grain);
  color: #f1ece0;
  border-radius: 6px 6px 0 0;
  overflow: hidden;
}
header .ym-title {
  color: #f6f0e2;
  font-size: 20px;
  margin-right: 8px;
}
header small {
  font-family: var(--font-latin);
  font-size: 10px;
  letter-spacing: 0.08em;
  opacity: 0.8;
}
.stripes {
  width: 46px;
  height: 100%;
  position: absolute;
  right: 0;
  top: 0;
  background: repeating-linear-gradient(120deg, transparent 0 6px, rgba(216, 181, 106, 0.55) 6px 10px);
}
.body {
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 10px;
  padding: 8px 12px 10px;
}
@media (max-width: 380px) {
  .body {
    grid-template-columns: 1fr;
  }
}
.info p {
  font-family: var(--font-hand);
  font-size: 13px;
  border-bottom: 1px solid var(--c-rule);
  padding: 2px 0;
}
.info span {
  color: var(--c-text-muted);
}
.info .bio {
  border: none;
  margin-top: 4px;
  font-size: 12px;
  line-height: 1.5;
  color: var(--c-text-muted);
}
.stats {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding-left: 10px;
  border-left: 1px dashed rgba(90, 65, 40, 0.3);
}
.bar {
  display: grid;
  grid-template-columns: 30px 1fr 44px;
  gap: 6px;
  align-items: center;
  font-family: var(--font-hand);
  font-size: 12px;
}
.bar em {
  font-style: normal;
  font-family: var(--font-latin);
  font-size: 11px;
  text-align: right;
  color: var(--c-text-muted);
}
.track {
  height: 8px;
  background: rgba(120, 95, 70, 0.15);
  border-radius: 999px;
  overflow: hidden;
  box-shadow: inset 0 1px 1px rgba(60, 40, 20, 0.2);
}
.track i {
  display: block;
  height: 100%;
  border-radius: 999px;
  transition: width 0.6s ease;
}
.money {
  display: flex;
  justify-content: space-between;
  margin-top: 2px;
  padding-top: 4px;
  border-top: 1px solid var(--c-rule);
  font-family: var(--font-hand);
  font-size: 13px;
}
.money b {
  font-family: var(--font-latin);
}
</style>
