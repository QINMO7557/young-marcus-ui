<template>
  <aside class="note ym-sheet ym-tape" style="--tx: 70%; --ty: -10px; --tr: 8deg; --tw: 56px">
    <h3 class="ym-title ym-underline">今日状况</h3>
    <p>{{ store.data.世界.今日状况 || '（暂无记录）' }}</p>
    <MapleLeaf class="leaf" :size="34" color="#cf7a2c" />
  </aside>
</template>

<script setup lang="ts">
import MapleLeaf from '../../shared/MapleLeaf.vue';
import { useDataStore } from '../../store';
const store = useDataStore();
</script>

<style lang="scss" scoped>
.note {
  /* 高度随内容，不跟学生证拉伸；内容过长时内部滚动 */
  align-self: start;
  min-height: 84px;
  padding: 12px 14px 22px;
  background-color: var(--c-surface-note);
  background-image:
    var(--img-grain),
    radial-gradient(ellipse at 90% 100%, rgba(170, 120, 40, 0.2), transparent 60%);
  rotate: 1.4deg;
  margin-top: 4px;
}
h3 {
  font-size: 18px;
  margin-bottom: 6px;
}
p {
  font-family: var(--font-hand);
  font-size: 13px;
  line-height: 1.7;
  white-space: pre-wrap;
  max-height: 150px;
  overflow-y: auto;
  scrollbar-width: thin;
}
.leaf {
  right: 6px;
  bottom: 4px;
  rotate: -20deg;
  opacity: 0.85;
}
</style>
