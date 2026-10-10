<template>
  <div class="panel ym-sheet">
    <h3 class="ym-title"><i class="fa-solid fa-briefcase" aria-hidden="true" /> 随身道具</h3>
    <ul v-if="items.length" class="items">
      <li v-for="it in items" :key="it.name">
        <button type="button" class="label" @click="onItem(it.name)">
          {{ it.name }}<b>×{{ it.数量 }}</b>
        </button>
        <p>{{ it.说明 || '—' }}</p>
      </li>
    </ul>
    <p v-else class="empty">口袋空空。</p>

    <div v-if="phoneOpen" class="phone ym-sheet ym-tape" style="--tx: 20%; --ty: -8px">
      <button type="button" class="x" @click="phoneOpen = false">×</button>
      <h4 class="ym-title"><i class="fa-solid fa-address-book" aria-hidden="true" /> 通讯录</h4>
      <ul class="contacts">
        <li v-for="p in contacts" :key="p.name">
          <span class="cname">{{ p.name }} · {{ p.关系 || p.身份 || '' }}</span>
          <span class="acts">
            <button type="button" class="ym-sticker tiny" @click="fillInput(`打电话给${p.name}`)">打电话</button>
            <button type="button" class="ym-sticker tiny" @click="fillInput(`发消息给${p.name}`)">发消息</button>
          </span>
        </li>
      </ul>
      <p v-if="!contacts.length" class="empty">通讯录为空。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../../store';
const store = useDataStore();

const items = computed(() => Object.entries(store.data.道具 || {}).map(([name, v]) => ({ name, ...v })));
const phoneOpen = ref(false);

const contacts = computed(() => {
  const roomie = store.data.日程.室友选择;
  const dormType = store.data.日程.宿舍?.房型 || '双人';
  return Object.entries(store.data.重要人物 || {})
    .map(([name, v]) => ({ name, ...v }))
    .filter(p => {
      if (p.name === 'Christian' || p.name === 'Marky') {
        if (dormType !== '双人') return false;
        return roomie === p.name;
      }
      return true;
    });
});

function onItem(name: string) {
  if (name.includes('手机')) {
    phoneOpen.value = !phoneOpen.value;
    return;
  }
}

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
      phoneOpen.value = false;
      return;
    }
  }
  void triggerSlash(`/echo severity=info ${text}`);
  toastr.info(`已生成：${text}`);
}
</script>

<style lang="scss" scoped>
.panel {
  min-height: 160px;
  height: 100%;
  padding: 10px 12px 12px;
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
.items {
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
  border: none;
  color: var(--c-text);
  box-shadow: 1px 1px 0 rgba(90, 65, 40, 0.25);
  cursor: pointer;
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
.items p {
  font-family: var(--font-hand);
  font-size: 12px;
  color: var(--c-text-muted);
  padding-left: 4px;
}
.tools {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.sheet {
  padding: 8px 10px 10px 28px;
  font-family: var(--font-hand);
  font-size: 13px;
}
.sheet h4 {
  font-size: 15px;
  margin-bottom: 4px;
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
}
.t {
  font-family: var(--font-latin);
  font-weight: 700;
  min-width: 42px;
}
small {
  color: var(--c-text-muted);
  font-size: 11.5px;
}
.job {
  margin-bottom: 4px;
}
.phone {
  position: relative;
  padding: 10px 12px;
}
.phone .x {
  position: absolute;
  right: 8px;
  top: 4px;
  border: none;
  background: transparent;
  font-size: 18px;
}
.phone ul.contacts {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0;
}
.phone li {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  align-items: center;
  font-family: var(--font-hand);
  font-size: 12.5px;
  padding: 5px 0;
  border-bottom: 1px solid rgba(90, 70, 40, 0.22);
}
.phone li:last-child {
  border-bottom: none;
}
.cname {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.acts {
  display: flex;
  gap: 4px;
}
.ym-sticker.tiny {
  padding: 2px 8px;
  font-size: 12px;
}
.empty {
  font-family: var(--font-hand);
  color: var(--c-text-muted);
}
</style>
