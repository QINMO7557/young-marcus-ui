<template>
  <article class="id-card">
    <header>
      <span>{{ idTitle }}</span>
      <small>STUDENT / ID</small>
    </header>
    <div class="body">
      <div class="name-row">
        <strong>{{ store.data.主角.姓名 }}</strong>
        <span>{{ store.data.主角.年龄 }} 岁</span>
      </div>
      <p class="bio">{{ store.data.主角.自述 || '——' }}</p>
      <div class="bars">
        <div v-for="bar in bars" :key="bar.label" class="bar">
          <span>{{ bar.label }}</span>
          <div class="track"><i :style="{ width: bar.pct + '%', background: bar.color }" /></div>
          <em>{{ bar.pct }}%</em>
        </div>
      </div>
      <div class="money">金钱 ${{ store.data.主角.金钱 }}</div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { useDataStore } from '../../store';

const store = useDataStore();

const idTitle = computed(() => {
  if (store.data.世界.主线 === '家里线') return store.data.主角.身份 || '海鸥湾镇居民';
  return '学生证';
});

function pct(n: number, max = 100) {
  return Math.max(0, Math.min(100, Math.round((n / max) * 100)));
}

const bars = computed(() => {
  const p = store.data.主角;
  const staminaMax = Math.max(1, p.体力.上限);
  return [
    { label: '体力', pct: pct(p.体力.当前, staminaMax), color: 'var(--c-stamina)' },
    { label: '魅力', pct: pct(p.魅力), color: 'var(--c-charm)' },
    { label: '智力', pct: pct(p.智力), color: 'var(--c-intel)' },
    { label: '体能', pct: pct(p.体能), color: 'var(--c-phys)' },
  ];
});
</script>

<style lang="scss" scoped>
.id-card {
  background: var(--c-surface-id);
  border: 1px solid var(--c-border);
  box-shadow: var(--shadow-paper);
  overflow: hidden;
}

header {
  background: #4a6f95;
  color: #f4f8fc;
  padding: 6px 10px;
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  font-size: 12px;
}

.body {
  padding: 10px;
}

.name-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.bio {
  font-size: 12px;
  color: var(--c-text-muted);
  margin-bottom: 8px;
}

.bars {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.bar {
  display: grid;
  grid-template-columns: 32px 1fr 36px;
  gap: 6px;
  align-items: center;
  font-size: 11px;
}

.track {
  height: 7px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid var(--c-border);
  border-radius: 999px;
  overflow: hidden;
}

.track i {
  display: block;
  height: 100%;
}

.money {
  margin-top: 8px;
  font-weight: 700;
  font-size: 12px;
}
</style>
