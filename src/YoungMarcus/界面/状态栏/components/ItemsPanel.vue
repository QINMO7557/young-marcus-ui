<template>
  <div class="panel ym-sheet">
    <h3 class="ym-title"><i class="fa-solid fa-briefcase" aria-hidden="true" /> 随身道具</h3>
    <ul v-if="items.length">
      <li v-for="it in items" :key="it.name">
        <span class="label">{{ it.name }}<b>×{{ it.数量 }}</b></span>
        <p>{{ it.说明 || '—' }}</p>
      </li>
    </ul>
    <p v-else class="empty">口袋空空。</p>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../../store';
const store = useDataStore();

const items = computed(() => Object.entries(store.data.道具 || {}).map(([name, v]) => ({ name, ...v })));
</script>

<style lang="scss" scoped>
.panel {
  min-height: 130px;
  padding: 10px 12px 12px;
  border-radius: 0 3px 3px 3px;
}
h3 {
  font-size: 18px;
  margin-bottom: 8px;
}
h3 i {
  font-size: 0.8em;
}
ul {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 8px 12px;
}
li {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.label {
  align-self: flex-start;
  position: relative;
  font-family: var(--font-hand);
  font-size: 13.5px;
  font-weight: 700;
  background: #efe2c6;
  padding: 1px 10px 1px 16px;
  border-radius: 2px 10px 10px 2px;
  box-shadow: 1px 1px 0 rgba(90, 65, 40, 0.25);
}
.label::before {
  content: '';
  position: absolute;
  left: 5px;
  top: 50%;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  translate: 0 -50%;
  background: var(--c-surface-paper);
  box-shadow: inset 0 0 0 1px rgba(90, 65, 40, 0.5);
}
.label b {
  margin-left: 6px;
  font-family: var(--font-latin);
  color: var(--c-text-muted);
  font-size: 12px;
}
li p {
  font-family: var(--font-hand);
  font-size: 12px;
  color: var(--c-text-muted);
  padding-left: 4px;
}
.empty {
  font-family: var(--font-hand);
  color: var(--c-text-muted);
}
</style>
