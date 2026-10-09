<template>
  <section class="page-story">
    <header class="hero">
      <h1>故事从哪里开始？</h1>
      <p class="sub">在总览地图上选一个起点，或自定义开局。</p>
    </header>

    <div class="layout">
      <div class="map-wrap paper">
        <div class="map" :style="{ backgroundImage: `url(${overviewUrl})` }">
          <button
            type="button"
            class="pin home"
            :class="{ on: draft.主线 === '家里线' }"
            title="01 家"
            @click="selectHome"
          >
            <span class="pin-head">01</span>
            <span class="pin-label">家 · 郊区小镇</span>
          </button>
          <button
            type="button"
            class="pin uni"
            :class="{ on: draft.主线 === '大学线' }"
            title="02 大学"
            @click="selectUni"
          >
            <span class="pin-head">02</span>
            <span class="pin-label">大学 · 都市</span>
          </button>
        </div>
        <p class="map-hint">约 3 小时车程 · 76 号公路</p>
      </div>

      <aside class="side paper">
        <h2>★ 选择的开局</h2>

        <template v-if="draft.主线 === '家里线'">
          <p class="tag">01 家 · 家里线</p>
          <div class="field">
            <span>子路线</span>
            <div class="pills">
              <button
                type="button"
                class="pill"
                :class="{ on: draft.家里线子路线 === '社区学院' }"
                @click="setHomeRoute('社区学院')"
              >
                社区学院
              </button>
              <button
                type="button"
                class="pill"
                :class="{ on: draft.家里线子路线 === '工作' }"
                @click="setHomeRoute('工作')"
              >
                打工 / 工作
              </button>
            </div>
          </div>
        </template>

        <template v-else-if="draft.主线 === '大学线'">
          <p class="tag">02 大学 · 大学线</p>
          <label class="field">
            <span>专业</span>
            <input v-model="draft.专业" type="text" list="majors" placeholder="自选或从建议中选" />
            <datalist id="majors">
              <option v-for="m in majors" :key="m" :value="m" />
            </datalist>
          </label>

          <div class="field">
            <span>室友三选</span>
            <div class="pills">
              <button
                type="button"
                class="pill"
                :class="{ on: draft.室友选择 === 'Christian' }"
                @click="draft.室友选择 = 'Christian'"
              >
                Christian
              </button>
              <button
                type="button"
                class="pill"
                :class="{ on: draft.室友选择 === 'Marky' }"
                @click="draft.室友选择 = 'Marky'"
              >
                Marky
              </button>
              <button
                type="button"
                class="pill"
                :class="{ on: draft.室友选择 === '自定义' }"
                @click="draft.室友选择 = '自定义'"
              >
                自定义
              </button>
            </div>
          </div>

          <div v-if="draft.室友选择 === '自定义'" class="custom-roomie">
            <div class="row">
              <input v-model="draft.自定义室友.年级" placeholder="年级" />
              <input v-model="draft.自定义室友.身份" placeholder="身份" />
            </div>
            <div class="row">
              <input v-model="draft.自定义室友.体型" placeholder="体型" />
              <input v-model="draft.自定义室友.气质" placeholder="气质" />
            </div>
            <div class="row">
              <input v-model="draft.自定义室友.取向" placeholder="取向" />
              <input v-model="draft.自定义室友.院系" placeholder="院系" />
            </div>
            <input v-model="draft.自定义室友.外貌关键词" placeholder="外貌关键词" />
            <input
              :value="draft.自定义室友.性格.join('、')"
              placeholder="性格（顿号分隔）"
              @input="onTraits"
            />
            <input v-model="draft.自定义室友.一句话" placeholder="一句话印象" />
            <button type="button" class="btn-dashed" @click="rollRoommate">🎲 骰子随机</button>
          </div>
        </template>

        <template v-else>
          <p class="tag">自定义开局</p>
          <p class="hint">写下你想要的开场，AI 会判断更接近家里线还是大学线。</p>
        </template>

        <label class="field">
          <span>开局描述（可编辑）</span>
          <textarea v-model="draft.开局描述" rows="7" maxlength="800" placeholder="写下你想要的开局…" />
          <small>{{ draft.开局描述.length }}/800</small>
        </label>
      </aside>
    </div>

    <div class="actions">
      <button type="button" class="btn-ghost" @click="$emit('back')">← 上一步</button>
      <button type="button" class="btn-dashed" @click="selectCustom">+ 自定义开局</button>
      <button type="button" class="btn-primary" :disabled="!canSubmit || submitting" @click="submit">
        {{ submitting ? '提交中…' : '开始故事 →' }}
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { mapAsset, MAP_FILES } from '../../assets/maps';

export type StoryDraft = {
  主线: '家里线' | '大学线' | '自定义';
  家里线子路线: '社区学院' | '工作' | '无';
  专业: string;
  开局描述: string;
  室友选择: 'Christian' | 'Marky' | '自定义';
  自定义室友: {
    年级: string;
    身份: string;
    体型: string;
    气质: string;
    取向: string;
    性格: string[];
    院系: string;
    外貌关键词: string;
    一句话: string;
  };
};

const props = defineProps<{
  modelValue: StoryDraft;
  submitting?: boolean;
}>();
const emit = defineEmits<{
  'update:modelValue': [StoryDraft];
  back: [];
  submit: [];
}>();

const draft = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v),
});

const overviewUrl = computed(() => mapAsset(MAP_FILES.overview));

const majors = ['历史', '文学', '商科', '计算机', '传媒', '体育管理', '艺术', '心理学', '未定通识'];

const DEFAULT_HOME_COLLEGE =
  '9 月 1 日清晨，搬到海鸥湾镇后不久。Milo 抢着浴室要去社区学院上课，餐桌上是你的社区学院课表（霍大附属）。爸爸匆匆去新公司报到。你住在家里走读，周末也可以坐巴士进城看看大学城。隔壁邻居刚好来敲门借牛奶。';

const DEFAULT_HOME_WORK =
  '9 月 1 日清晨，搬到海鸥湾镇后的第一个工作日。爸爸匆匆准备去新公司报到，Milo 抢浴室去上课，厨房里还堆着没拆完的纸箱。你推迟了入学，这一年打算先打工——镇上店铺，或进城找工作甚至租房。隔壁的邻居刚好来敲门借牛奶。';

const DEFAULT_UNI =
  '开学周的报到日。你已选定专业，课表刚生成，并完成室友选择。爸爸和 Milo 开了 3 小时车把你送到霍大宿舍楼下，帮你把箱子搬上楼后告别。下周一第一节课，听说原来的教授出了车祸，换了个新来的代课老师。校园里也在招图书馆助理和家教兼职。';

function patch(partial: Partial<StoryDraft>) {
  emit('update:modelValue', { ...draft.value, ...partial });
}

function selectHome() {
  const route = draft.value.家里线子路线 === '无' ? '社区学院' : draft.value.家里线子路线;
  patch({
    主线: '家里线',
    家里线子路线: route,
    开局描述: route === '工作' ? DEFAULT_HOME_WORK : DEFAULT_HOME_COLLEGE,
  });
}

function selectUni() {
  patch({
    主线: '大学线',
    家里线子路线: '无',
    专业: draft.value.专业 || '未定通识',
    开局描述: DEFAULT_UNI,
  });
}

function selectCustom() {
  patch({
    主线: '自定义',
    家里线子路线: '无',
    开局描述: draft.value.主线 === '自定义' ? draft.value.开局描述 : '',
  });
}

function setHomeRoute(route: '社区学院' | '工作') {
  patch({
    主线: '家里线',
    家里线子路线: route,
    开局描述: route === '工作' ? DEFAULT_HOME_WORK : DEFAULT_HOME_COLLEGE,
  });
}

function onTraits(e: Event) {
  const v = (e.target as HTMLInputElement).value;
  patch({
    自定义室友: {
      ...draft.value.自定义室友,
      性格: v
        .split(/[、,，]/)
        .map(s => s.trim())
        .filter(Boolean),
    },
  });
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function rollRoommate() {
  patch({
    室友选择: '自定义',
    自定义室友: {
      年级: pick(['大二', '大三', '大四', '研一']),
      身份: pick(['普通学生', '社团骨干', '运动员', '图书馆助理']),
      体型: pick(['偏瘦', '正常', '薄肌', '结实', '壮']),
      气质: pick(['温柔', '不羁', '沉稳', '阳光', '冷淡']),
      取向: pick(['同性恋', '双性恋', '异性恋', '探索中']),
      性格: pick([
        ['话多', '热心'],
        ['沉默', '观察力强'],
        ['直率', '护短'],
      ]),
      院系: pick(['商学院', '文学院', '理工', '体育', '艺术']),
      外貌关键词: pick(['短发深肤', '金棕卷发', '眼镜书卷气', '运动短寸']),
      一句话: pick(['看起来很好相处。', '有点难亲近，但靠谱。', '房间已经布置得很有生活感。']),
    },
  });
}

const canSubmit = computed(() => {
  if (!draft.value.开局描述.trim()) return false;
  if (draft.value.主线 === '家里线') return draft.value.家里线子路线 !== '无';
  if (draft.value.主线 === '大学线') return !!draft.value.专业.trim() && !!draft.value.室友选择;
  return draft.value.主线 === '自定义';
});

function submit() {
  if (!canSubmit.value) return;
  emit('submit');
}
</script>

<style lang="scss" scoped>
.page-story {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.hero h1 {
  font-size: 1.35rem;
  color: var(--c-primary);
}
.sub {
  color: var(--c-text-muted);
  font-size: 12px;
}

.layout {
  display: grid;
  grid-template-columns: 1.25fr 0.95fr;
  gap: 12px;
}

@media (max-width: 820px) {
  .layout {
    grid-template-columns: 1fr;
  }
}

.paper {
  background: var(--c-surface-paper);
  border: 1px solid var(--c-border);
  box-shadow: var(--shadow-paper);
  padding: 10px;
}

.map {
  position: relative;
  min-height: 320px;
  border-radius: 4px;
  background: #d9c7a8 center / cover no-repeat;
  overflow: hidden;
}

.map-hint {
  margin-top: 6px;
  font-size: 11px;
  color: var(--c-text-muted);
  text-align: center;
}

.pin {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: transparent;
  border: none;
  color: var(--c-text);
}

.pin.home {
  left: 18%;
  bottom: 22%;
}
.pin.uni {
  right: 16%;
  top: 18%;
}

.pin-head {
  width: 34px;
  height: 34px;
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  background: #c45c4a;
  color: #fff;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.25);
}

.pin-head {
  font-size: 12px;
  line-height: 1;
}

.pin-label {
  background: rgba(255, 250, 240, 0.92);
  border: 1px solid var(--c-border);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
}

.pin.on .pin-head {
  background: var(--c-primary);
  outline: 2px solid var(--c-accent);
}

.side h2 {
  font-size: 0.95rem;
  margin-bottom: 8px;
}

.tag {
  font-weight: 700;
  margin-bottom: 8px;
}

.hint {
  font-size: 12px;
  color: var(--c-text-muted);
  margin-bottom: 8px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 10px;
}
.field > span {
  font-size: 12px;
  font-weight: 700;
  color: var(--c-text-muted);
}

input,
textarea {
  border: 1px solid var(--c-border);
  background: rgba(255, 255, 255, 0.8);
  border-radius: 4px;
  padding: 7px 9px;
}

.pills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.pill {
  border: 1px solid var(--c-border);
  background: #fff;
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 12px;
}
.pill.on {
  background: var(--c-primary);
  color: #fff;
  border-color: var(--c-primary);
}

.custom-roomie {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 10px;
}
.custom-roomie .row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.btn-primary,
.btn-ghost,
.btn-dashed {
  padding: 9px 14px;
  border-radius: 4px;
  font-weight: 700;
}
.btn-primary {
  background: var(--c-primary);
  color: #f7f2e8;
  border: 2px solid #1f3d31;
}
.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.btn-ghost {
  background: transparent;
  border: 1px solid var(--c-border);
}
.btn-dashed {
  background: #fff;
  border: 1.5px dashed var(--c-primary);
  color: var(--c-primary);
}
</style>
