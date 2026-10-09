<template>
  <section class="page-profile">
    <header class="hero">
      <h1 class="ym-title ym-underline"><i class="fa-solid fa-location-dot" aria-hidden="true" /> 这一次，你是谁？</h1>
    </header>

    <div class="layout">
      <article class="card ym-sheet ym-ruled ym-tape" style="--tx: 18%; --tr: -6deg">
        <h2 class="ym-title">个人档案</h2>

        <label class="row">
          <span>姓名：</span>
          <input v-model="form.姓名" class="ym-line-input" type="text" maxlength="40" placeholder="请输入你的名字" />
        </label>

        <label class="row">
          <span>年龄：</span>
          <input
            v-model.number="form.年龄"
            class="ym-line-input short"
            type="number"
            min="18"
            max="99"
            placeholder="18+"
          />
          <small class="hint">（18 岁及以上）</small>
        </label>
        <small v-if="ageError" class="err">{{ ageError }}</small>

        <label class="row">
          <span>身高：</span>
          <span class="unit-wrap">
            <input
              v-model.number="form.身高"
              class="ym-line-input short"
              type="number"
              inputmode="numeric"
              :min="HEIGHT_MIN"
              :max="HEIGHT_MAX"
              step="1"
              :placeholder="`如 ${HEIGHT_DEFAULT}`"
            />
            <em class="unit">cm</em>
          </span>
          <small class="hint">（{{ HEIGHT_MIN }}–{{ HEIGHT_MAX }}）</small>
        </label>
        <small v-if="heightError" class="err">{{ heightError }}</small>

        <div class="row top">
          <span>体型：</span>
          <div class="pills">
            <button
              v-for="opt in bodyOptions"
              :key="opt"
              type="button"
              class="ym-pill"
              :class="{ on: form.体型 === opt }"
              @click="patch({ 体型: opt })"
            >
              {{ opt }}
            </button>
          </div>
        </div>
        <label class="row">
          <span>备注：</span>
          <input v-model="form.体型备注" class="ym-line-input" type="text" placeholder="体型备注（可选）" />
        </label>

        <label class="row top">
          <span>外貌：</span>
          <textarea
            v-model="form.外貌"
            class="ym-line-input"
            rows="2"
            placeholder="请输入你的外貌特征（如：黑发、棕眼等）"
          />
        </label>
      </article>

      <aside class="note ym-sheet">
        <Paperclip class="clip" />
        <h2 class="ym-title ym-underline">关于我</h2>

        <div class="field">
          <span>爱好：<small>（最多 3 个）</small></span>
          <div class="pills">
            <button
              v-for="h in hobbyPool"
              :key="h"
              type="button"
              class="ym-pill"
              :class="{ on: form.爱好.includes(h) }"
              @click="toggleHobby(h)"
            >
              {{ h }}
            </button>
            <button
              v-for="h in customHobbies"
              :key="'c-' + h"
              type="button"
              class="ym-pill on"
              @click="toggleHobby(h)"
            >
              {{ h }} ×
            </button>
            <button type="button" class="ym-pill dashed" @click="addCustomHobby">+ 自定义</button>
          </div>
        </div>

        <label class="field">
          <span>喜欢的类型：</span>
          <input v-model="form.喜欢的类型" class="ym-line-input" type="text" placeholder="自填，如：可靠的年长者" />
        </label>

        <label class="field">
          <span>性格：</span>
          <input v-model="form.性格" class="ym-line-input" type="text" placeholder="请输入你的性格特点" />
        </label>

        <label class="field">
          <span>一句话自述：<small>（可选）</small></span>
          <input v-model="form.自述" class="ym-line-input" type="text" maxlength="80" placeholder="请输入你想说的一句话" />
        </label>
        <MapleLeaf class="note-leaf" :size="40" color="#d07a2e" />
      </aside>
    </div>

    <div class="actions">
      <button type="button" class="ym-sticker" @click="$emit('back')">← 上一步</button>
      <button type="button" class="ym-sticker" :disabled="aiBusy" @click="aiFill">
        {{ aiBusy ? '补全中…' : '✦ AI 帮我补全' }}
      </button>
      <button type="button" class="ym-stamp" :disabled="!canNext" @click="goNext">下一步：故事起点 →</button>
    </div>

    <div class="ticket" aria-hidden="true">
      <div class="t-main">
        <b>HALSTON</b>
        <small>GENERAL ADMISSION</small>
        <span>★ ADMIT ONE ★</span>
      </div>
      <div class="t-stub">No.0901</div>
    </div>
    <span class="ym-stain stain" style="--s: 130px" aria-hidden="true" />
  </section>
</template>

<script setup lang="ts">
import { HEIGHT_DEFAULT, HEIGHT_MAX, HEIGHT_MIN, isHeightValid } from '../../shared/height';
import Paperclip from '../../shared/Paperclip.vue';
import MapleLeaf from '../../shared/MapleLeaf.vue';

const bodyOptions = [
  '瘦弱',
  '偏瘦',
  '正常',
  '薄肌',
  '结实',
  '壮',
  '肌肉发达',
  '偏胖',
  '壮实成熟',
] as const;

type Body = (typeof bodyOptions)[number];

export type ProfileForm = {
  姓名: string;
  年龄: number;
  /** 厘米，140–220；提交时写成 "175 cm" */
  身高: number;
  体型: Body;
  体型备注: string;
  外貌: string;
  爱好: string[];
  喜欢的类型: string;
  性格: string;
  自述: string;
};

const props = defineProps<{ modelValue: ProfileForm }>();
const emit = defineEmits<{ 'update:modelValue': [ProfileForm]; next: []; back: [] }>();

const form = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v),
});

const hobbyPool = ['健身', '游戏', '读书', '跑步', '音乐', '摄影', '做饭', '电影', '旅行'];
const customHobbies = computed(() => form.value.爱好.filter(h => !hobbyPool.includes(h)));
const aiBusy = ref(false);

const ageError = computed(() => {
  const age = Number(form.value.年龄);
  if (!Number.isFinite(age) || age < 18) return '年龄须 ≥ 18';
  return '';
});

const heightError = computed(() =>
  isHeightValid(form.value.身高) ? '' : `身高请填 ${HEIGHT_MIN}–${HEIGHT_MAX} cm`,
);

const canNext = computed(() => !ageError.value && !heightError.value && !!form.value.姓名.trim());

function patch(partial: Partial<ProfileForm>) {
  emit('update:modelValue', { ...form.value, ...partial });
}

function toggleHobby(h: string) {
  const list = [...form.value.爱好];
  const i = list.indexOf(h);
  if (i >= 0) list.splice(i, 1);
  else if (list.length < 3) list.push(h);
  else {
    toastr.warning('爱好最多选择 3 个');
    return;
  }
  patch({ 爱好: list });
}

function addCustomHobby() {
  if (form.value.爱好.length >= 3) {
    toastr.warning('爱好最多选择 3 个');
    return;
  }
  const name = window.prompt('自定义爱好');
  if (!name?.trim()) return;
  patch({ 爱好: [...form.value.爱好, name.trim()].slice(0, 3) });
}

async function aiFill() {
  aiBusy.value = true;
  try {
    // 占位：后续可接 generate / generateRaw 补全空字段
    const defaults: Partial<ProfileForm> = {};
    if (!form.value.外貌.trim()) defaults.外貌 = '短发，浅棕眼睛，表情有点拘谨';
    if (!form.value.性格.trim()) defaults.性格 = '温和、观察力强，偶尔别扭';
    if (!form.value.自述.trim()) defaults.自述 = '想把日子过成自己喜欢的样子';
    if (!form.value.喜欢的类型.trim()) defaults.喜欢的类型 = '靠谱、会照顾人的类型';
    if (form.value.爱好.length === 0) defaults.爱好 = ['读书', '音乐'];
    if (!isHeightValid(form.value.身高)) defaults.身高 = HEIGHT_DEFAULT;
    patch(defaults);
    toastr.success('已用占位文案补全空字段（正式版将接 AI）');
  } finally {
    aiBusy.value = false;
  }
}

function goNext() {
  if (!canNext.value) return;
  emit('next');
}

</script>

<style lang="scss" scoped>
.page-profile {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 54px;
}

.hero h1 {
  font-size: clamp(22px, 5.5vw, 30px);
}
.hero i {
  font-size: 0.8em;
  color: var(--c-text);
}

.layout {
  display: grid;
  grid-template-columns: 1.2fr 0.9fr;
  gap: 16px;
  align-items: start;
}
@media (max-width: 520px) {
  .layout {
    grid-template-columns: 1fr;
  }
}

.card {
  padding: 18px 16px 18px 40px;
  rotate: -0.8deg;
}
.card h2 {
  font-size: 22px;
  margin-bottom: 8px;
  padding-bottom: 4px;
  border-bottom: 2px solid rgba(70, 100, 150, 0.45);
}

.row {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  min-height: 32px;
  margin-bottom: 4px;
  flex-wrap: wrap;
}
.row.top {
  align-items: flex-start;
}
.row > span:first-child {
  flex: 0 0 auto;
  font-family: var(--font-hand);
  font-size: 15px;
  font-weight: 700;
  padding-bottom: 4px;
  min-width: 3.4em;
}
.row > .ym-line-input,
.row > .pills {
  flex: 1 1 140px;
}
.row.top > span:first-child {
  padding-top: 4px;
}
textarea.ym-line-input {
  resize: vertical;
  line-height: 1.6;
}

.short {
  width: 76px !important;
  flex: 0 0 auto !important;
}
.unit-wrap {
  display: inline-flex;
  align-items: flex-end;
  gap: 4px;
}
.unit {
  font-family: var(--font-latin);
  font-style: normal;
  font-size: 14px;
  color: var(--c-text-muted);
  padding-bottom: 4px;
}
.hint {
  font-family: var(--font-hand);
  font-size: 12px;
  color: var(--c-text-muted);
  padding-bottom: 5px;
}
.err {
  display: block;
  margin: -2px 0 4px 3.8em;
  color: var(--c-danger);
  font-size: 12px;
}

input[type='number']::-webkit-inner-spin-button {
  opacity: 0.4;
}

.pills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.note {
  padding: 22px 14px 18px;
  background-color: var(--c-surface-note);
  background-image:
    var(--img-grain),
    linear-gradient(180deg, rgba(255, 255, 255, 0.2), transparent 30%),
    radial-gradient(ellipse at 90% 100%, rgba(170, 120, 40, 0.18), transparent 60%);
  rotate: 1.6deg;
  margin-top: 10px;
  box-shadow: 2px 6px 14px rgba(40, 28, 18, 0.25);
}
.note .clip {
  right: 18px;
  top: -24px;
}
.note h2 {
  font-size: 20px;
  margin-bottom: 10px;
}
.note-leaf {
  right: 6px;
  bottom: 4px;
  rotate: -15deg;
  opacity: 0.85;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 12px;
}
.field > span {
  font-family: var(--font-hand);
  font-size: 14px;
  font-weight: 700;
}
.field small {
  font-weight: normal;
  color: var(--c-text-muted);
}

.actions {
  position: relative;
  z-index: 2;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  padding-top: 4px;
}

.ticket {
  position: absolute;
  left: -4px;
  bottom: -8px;
  display: flex;
  rotate: -8deg;
  font-family: var(--font-latin);
  color: #2f4f68;
  filter: drop-shadow(1px 3px 3px rgba(30, 20, 10, 0.3));
  pointer-events: none;
}
.t-main,
.t-stub {
  background-color: #e9e1cc;
  background-image: var(--img-grain);
}
.t-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px 14px;
  border: 1.5px solid rgba(47, 79, 104, 0.6);
  outline: 3px solid #e9e1cc;
  border-right: 2px dashed rgba(47, 79, 104, 0.5);
  line-height: 1.2;
}
.t-main b {
  font-size: 14px;
  letter-spacing: 0.12em;
}
.t-main small {
  font-size: 7px;
  letter-spacing: 0.1em;
}
.t-main span {
  font-size: 8px;
  margin-top: 2px;
}
.t-stub {
  writing-mode: vertical-rl;
  font-size: 9px;
  padding: 4px 3px;
  border: 1.5px solid rgba(47, 79, 104, 0.6);
  border-left: none;
}

.stain {
  left: 40%;
  bottom: -40px;
}
</style>
