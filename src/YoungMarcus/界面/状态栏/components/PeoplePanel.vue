<template>
  <div class="panel ym-sheet">
    <h3 class="ym-title"><i class="fa-solid fa-user-group" aria-hidden="true" /> 身边的人</h3>
    <div v-if="people.length" class="list">
      <button
        v-for="p in people"
        :key="p.name"
        type="button"
        class="row"
        :class="{ on: detail?.name === p.name }"
        @click="detail = detail?.name === p.name ? null : p"
      >
        <span class="name">{{ p.name }} · {{ p.关系 || p.身份 || '——' }}</span>
        <span class="heart"><i class="fa-solid fa-heart" aria-hidden="true" /> {{ displayAff(p.好感) }}</span>
      </button>
    </div>
    <p v-else class="empty">还没有记入重要人物。</p>

    <aside v-if="detail" class="detail ym-sheet ym-tape" style="--tx: 12%; --ty: -8px; --tw: 44px">
      <button type="button" class="x" aria-label="关闭" @click="detail = null">×</button>
      <h4 class="ym-title">{{ detail.name }}</h4>
      <p class="line"><b>关系</b>{{ detail.关系 || '—' }} · {{ detail.身份 || '—' }}</p>
      <p class="line"><b>好感</b>{{ displayAff(detail.好感) }} · {{ detail.对你态度 || '普通' }} · {{ detail.关系意向 || '可攻略' }}</p>
      <p v-if="detail.爱好" class="line"><b>爱好</b>{{ detail.爱好 }}</p>
      <p v-if="detail.常去地点" class="line"><b>常去</b>{{ detail.常去地点 }}</p>
      <p v-if="detail.工作地点" class="line"><b>工作</b>{{ detail.工作地点 }}</p>
      <p v-if="detail.家庭住址" class="line"><b>住址</b>{{ detail.家庭住址 }}</p>
      <p class="line"><b>状态</b>{{ detail.当前状态 || '—' }}</p>
      <p v-if="detail.性格" class="line"><b>性格</b>{{ detail.性格 }}</p>
      <p v-if="detail.外貌" class="line"><b>外貌</b>{{ detail.外貌 }}</p>
      <p class="line muted">日常互动计数 {{ detail.日常互动计数 ?? 0 }}/5</p>
      <ul v-if="Object.keys(detail.约定 || {}).length" class="promises">
        <li v-for="(val, key) in detail.约定" :key="String(key)">{{ key }}：{{ val }}</li>
      </ul>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../../store';
const store = useDataStore();

type Person = {
  name: string;
  身份?: string;
  关系?: string;
  好感?: number;
  外貌?: string;
  性格?: string;
  爱好?: string;
  常去地点?: string;
  工作地点?: string;
  家庭住址?: string;
  对你态度?: string;
  关系意向?: string;
  日常互动计数?: number;
  当前状态?: string;
  约定?: Record<string, string>;
  来源?: string;
};

const detail = ref<Person | null>(null);

const people = computed(() => {
  const roomie = store.data.日程.室友选择;
  const dormType = store.data.日程.宿舍?.房型 || '双人';
  const entries = Object.entries(store.data.重要人物 || {}).map(([name, v]) => ({ name, ...v })) as Person[];
  return entries.filter(p => {
    if (p.name === 'Christian' || p.name === 'Marky') {
      if (dormType !== '双人') return false;
      return roomie === p.name;
    }
    return true;
  });
});

function displayAff(n?: number) {
  if (n == null) return 0;
  return Number.isInteger(n) ? n : Math.round(n * 10) / 10;
}
</script>

<style lang="scss" scoped>
.panel {
  min-height: 160px;
  height: 100%;
  padding: 10px 12px 14px;
  border-radius: 0 3px 3px 3px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
h3 {
  font-size: 18px;
}
h3 i {
  font-size: 0.8em;
}
.list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
  flex: 1;
  min-height: 0;
}
.row {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  align-items: center;
  text-align: left;
  border: none;
  background: rgba(239, 226, 198, 0.45);
  padding: 6px 10px;
  font-family: var(--font-hand);
  font-size: 13.5px;
  color: var(--c-text);
  border-radius: 3px;
  box-shadow: 1px 1px 0 rgba(60, 40, 20, 0.12);
}
.row.on {
  background: var(--c-primary);
  color: var(--c-primary-ink);
}
.row.on .heart {
  color: #fff;
}
.name {
  font-weight: 700;
}
.heart {
  font-family: var(--font-latin);
  font-size: 12px;
  color: #c0505a;
  white-space: nowrap;
}
.detail {
  position: relative;
  padding: 10px 12px 12px;
  rotate: -0.5deg;
}
.detail h4 {
  font-size: 18px;
  margin-bottom: 4px;
}
.detail .x {
  position: absolute;
  right: 8px;
  top: 4px;
  border: none;
  background: transparent;
  font-size: 18px;
  color: var(--c-text-muted);
}
.line {
  font-family: var(--font-hand);
  font-size: 12.5px;
  line-height: 1.55;
}
.line b {
  display: inline-block;
  min-width: 2.6em;
  margin-right: 6px;
  color: var(--c-text-muted);
  font-weight: 700;
}
.line.muted {
  color: var(--c-text-muted);
  font-size: 11.5px;
}
.promises {
  margin-top: 4px;
  padding-left: 14px;
  font-family: var(--font-hand);
  font-size: 11.5px;
}
.empty {
  font-family: var(--font-hand);
  color: var(--c-text-muted);
}
</style>
