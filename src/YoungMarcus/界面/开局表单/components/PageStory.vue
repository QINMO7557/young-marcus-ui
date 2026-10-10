<template>
  <section class="page-story">
    <header class="hero">
      <h1 class="ym-title ym-underline"><i class="fa-solid fa-location-dot" aria-hidden="true" /> 开局地图</h1>
      <p class="sub">从这里出发，<br />去遇见你想要的故事。</p>
    </header>

    <div class="layout">
      <div class="map-wrap ym-sheet ym-tape" style="--tx: 88%; --ty: -8px; --tr: 30deg">
        <div class="map">
          <div class="canvas" :style="{ backgroundImage: `url(${overviewUrl})` }">
            <span class="place city">都 市</span>
            <span class="place town">郊区小镇</span>
            <span class="route">约 3 小时车程 <b>76</b></span>
            <button
              type="button"
              class="pin home"
              :class="{ on: draft.主线 === '家里线' }"
              title="01 家 · 家里线"
              @click="selectHome"
            >
              <i class="fa-solid fa-location-dot head" aria-hidden="true" />
              <span class="pin-label">01 家</span>
            </button>
            <button
              type="button"
              class="pin uni"
              :class="{ on: draft.主线 === '大学线' }"
              title="02 大学 · 大学线"
              @click="selectUni"
            >
              <i class="fa-solid fa-location-dot head" aria-hidden="true" />
              <span class="pin-label">02 大学</span>
            </button>
          </div>
          <svg class="compass" viewBox="0 0 60 60" width="46" height="46" aria-hidden="true">
            <circle cx="30" cy="30" r="20" fill="rgba(250,244,230,.7)" stroke="#3a2a1f" stroke-width="1" />
            <path d="M30 4 L34 30 L30 56 L26 30Z" fill="#3a2a1f" />
            <path d="M4 30 L30 26 L56 30 L30 34Z" fill="#6b5a48" />
            <text x="30" y="12" font-size="7" text-anchor="middle" fill="#fff">N</text>
          </svg>
        </div>
        <p class="map-hint">点图钉选择开局 · 或在下面自定义</p>
      </div>

      <div class="side-wrap">
      <Paperclip class="clip" />
      <aside class="side ym-sheet">
        <h2 class="ym-title"><i class="fa-solid fa-star" aria-hidden="true" /> 选择的开局</h2>

        <figure v-if="draft.主线 !== '自定义'" class="thumb">
          <img :src="thumbUrl" alt="" loading="lazy" />
        </figure>

        <template v-if="draft.主线 === '家里线'">
          <p class="tag"><i class="fa-solid fa-location-dot" aria-hidden="true" /> 01 家</p>
          <p class="meta">· 郊区小镇 · 家里线</p>
          <div class="field">
            <span>子路线</span>
            <div class="pills">
              <button
                type="button"
                class="ym-pill"
                :class="{ on: draft.家里线子路线 === '社区学院' }"
                @click="setHomeRoute('社区学院')"
              >
                社区学院
              </button>
              <button
                type="button"
                class="ym-pill"
                :class="{ on: draft.家里线子路线 === '工作' }"
                @click="setHomeRoute('工作')"
              >
                打工 / 工作
              </button>
            </div>
          </div>
        </template>

        <template v-else-if="draft.主线 === '大学线'">
          <p class="tag"><i class="fa-solid fa-location-dot" aria-hidden="true" /> 02 大学</p>
          <p class="meta">· 大城市 · 大学城</p>
          <label class="field">
            <span>专业</span>
            <select class="ym-line-input" :value="majorSelect" @change="onMajorSelect">
              <option v-for="m in majors" :key="m" :value="m">{{ m }}</option>
              <option value="__custom__">其他（自填）</option>
            </select>
            <input
              v-if="majorSelect === '__custom__'"
              v-model="draft.专业"
              class="ym-line-input"
              type="text"
              placeholder="填写专业"
            />
          </label>

          <div class="field">
            <span>宿舍房型</span>
            <div class="pills">
              <button
                v-for="r in dormTypes"
                :key="r"
                type="button"
                class="ym-pill"
                :class="{ on: draft.宿舍.房型 === r }"
                @click="setDormType(r)"
              >
                {{ r }}
              </button>
            </div>
          </div>

          <label class="field">
            <span>寝室类型</span>
            <select class="ym-line-input" :value="dormKindSelect" @change="onDormKindSelect">
              <option v-for="k in dormKinds" :key="k" :value="k">{{ k }}</option>
              <option value="__custom__">其他（自填）</option>
            </select>
            <input
              v-if="dormKindSelect === '__custom__'"
              v-model="draft.宿舍.寝室类型"
              class="ym-line-input"
              type="text"
              placeholder="如：学科·某某系"
            />
          </label>

          <label class="field">
            <span>氛围</span>
            <input v-model="draft.宿舍.氛围" class="ym-line-input" type="text" placeholder="如：走廊放音乐、箱子还没拆完" />
          </label>

          <label class="field">
            <span>带路人数</span>
            <input v-model.number="draft.宿舍.带路人数" class="ym-line-input short" type="number" min="0" max="20" />
          </label>

          <div v-if="draft.宿舍.房型 === '双人'" class="field">
            <span>室友三选（双人间）</span>
            <div class="pills">
              <button
                v-for="r in roommates"
                :key="r"
                type="button"
                class="ym-pill"
                :class="{ on: draft.室友选择 === r }"
                @click="draft.室友选择 = r"
              >
                {{ r }}
              </button>
            </div>
          </div>

          <div v-if="draft.宿舍.房型 === '双人' && draft.室友选择 === '自定义'" class="custom-roomie">
            <div class="row">
              <input v-model="draft.自定义室友.年级" class="ym-line-input" list="rm-grade" placeholder="年级" />
              <input v-model="draft.自定义室友.身份" class="ym-line-input" list="rm-role" placeholder="身份" />
            </div>
            <div class="row">
              <input v-model="draft.自定义室友.体型" class="ym-line-input" list="rm-body" placeholder="体型" />
              <input v-model="draft.自定义室友.气质" class="ym-line-input" list="rm-vibe" placeholder="气质" />
            </div>
            <div class="row">
              <input v-model="draft.自定义室友.取向" class="ym-line-input" list="rm-orient" placeholder="取向" />
              <input v-model="draft.自定义室友.社团" class="ym-line-input" list="rm-club" placeholder="社团（可自填）" />
            </div>
            <input v-model="draft.自定义室友.外貌关键词" class="ym-line-input" placeholder="外貌关键词" />
            <input
              :value="draft.自定义室友.性格.join('、')"
              class="ym-line-input"
              placeholder="性格（顿号分隔）"
              @input="onTraits"
            />
            <input v-model="draft.自定义室友.一句话" class="ym-line-input" placeholder="一句话印象" />
            <button type="button" class="ym-sticker small" @click="rollRoommate">🎲 骰子随机</button>
            <datalist id="rm-grade"><option v-for="x in pools.年级" :key="x" :value="x" /></datalist>
            <datalist id="rm-role"><option v-for="x in pools.身份" :key="x" :value="x" /></datalist>
            <datalist id="rm-body"><option v-for="x in pools.体型" :key="x" :value="x" /></datalist>
            <datalist id="rm-vibe"><option v-for="x in pools.气质" :key="x" :value="x" /></datalist>
            <datalist id="rm-orient"><option v-for="x in pools.取向" :key="x" :value="x" /></datalist>
            <datalist id="rm-club"><option v-for="x in pools.社团" :key="x" :value="x" /></datalist>
          </div>
        </template>

        <template v-else>
          <p class="tag"><i class="fa-solid fa-pen-nib" aria-hidden="true" /> 自定义开局</p>
          <p class="meta">写下你想要的开场，AI 会判断更接近家里线还是大学线。</p>
        </template>

        <label class="field desc">
          <span><i class="fa-solid fa-pen" aria-hidden="true" /> 开局描述（可编辑）</span>
          <textarea v-model="draft.开局描述" class="ym-ruled" rows="5" maxlength="800" placeholder="写下你想要的开局…" />
          <small>{{ draft.开局描述.length }}/800</small>
        </label>
      </aside>
      </div>
    </div>

    <div class="actions">
      <button type="button" class="ym-sticker" @click="$emit('back')">← 上一步</button>
      <button type="button" class="ym-sticker" :class="{ picked: draft.主线 === '自定义' }" @click="selectCustom">
        ＋ 自定义开局
      </button>
      <button type="button" class="ym-stamp" :disabled="!canSubmit || submitting" @click="submit">
        {{ submitting ? '提交中…' : '开始故事 →' }}
      </button>
    </div>
    <Postmark class="mark" top="ROAD TRIP" bottom="I-76" />
    <MapleLeaf class="leaf" :size="54" color="#b9472a" />
  </section>
</template>

<script setup lang="ts">
import { mapAsset, MAP_FILES } from '../../assets/maps';
import { DECOR_FILES } from '../../shared/decor';
import Paperclip from '../../shared/Paperclip.vue';
import MapleLeaf from '../../shared/MapleLeaf.vue';
import Postmark from '../../shared/Postmark.vue';

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
    社团: string;
    外貌关键词: string;
    一句话: string;
  };
  宿舍: {
    房型: '单人' | '双人' | '四人' | '八人';
    寝室类型: string;
    氛围: string;
    带路人数: number;
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
const thumbUrl = computed(() =>
  mapAsset(draft.value.主线 === '家里线' ? DECOR_FILES.postcardHome : DECOR_FILES.postcardCity),
);

const roommates = ['Christian', 'Marky', '自定义'] as const;
const majors = [
  '未定专业',
  '商科',
  '计算机',
  '工程',
  '理学',
  '人文',
  '社科',
  '传媒',
  '艺术',
  '教育',
  '体育',
  '医学预科',
];
const dormTypes = ['单人', '双人', '四人', '八人'] as const;
const dormKinds = [
  '混合',
  '学科·商科',
  '学科·计算机',
  '学科·工程',
  '学科·理学',
  '学科·人文',
  '学科·社科',
  '学科·传媒',
  '学科·艺术',
  '学科·体育',
];
const majorSelect = computed(() => (majors.includes(draft.value.专业) ? draft.value.专业 : '__custom__'));
const dormKindSelect = computed(() =>
  dormKinds.includes(draft.value.宿舍.寝室类型) ? draft.value.宿舍.寝室类型 : '__custom__',
);
function onMajorSelect(e: Event) {
  const v = (e.target as HTMLSelectElement).value;
  if (v === '__custom__') patch({ 专业: draft.value.专业 && !majors.includes(draft.value.专业) ? draft.value.专业 : '' });
  else patch({ 专业: v });
}
function onDormKindSelect(e: Event) {
  const v = (e.target as HTMLSelectElement).value;
  if (v === '__custom__') {
    const cur = draft.value.宿舍.寝室类型;
    patch({ 宿舍: { ...draft.value.宿舍, 寝室类型: dormKinds.includes(cur) ? '' : cur } });
  } else patch({ 宿舍: { ...draft.value.宿舍, 寝室类型: v } });
}
const pools = {
  年级: ['大一同届', '大二学长', '大三学长', '交换生'],
  身份: ['普通学生', '运动员', '社团干部', '艺术生', '理工宅', '兄弟会边缘'],
  体型: ['瘦弱', '偏瘦', '正常', '薄肌', '结实', '壮', '肌肉发达', '偏胖'],
  气质: ['开朗话多', '沉默冷淡', '洁癖整洁', '邋遢随性', '社牛', '社恐'],
  取向: ['男同', '双', '直男好奇', '未确定'],
  社团: ['无', '桌游社', '摄影社', '足球社', '合唱团', '志愿者协会', '电竞社'],
};

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
    专业: draft.value.专业 || '未定专业',
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

function setDormType(房型: '单人' | '双人' | '四人' | '八人') {
  const 带路人数 =
    房型 === '单人' ? 0 : 房型 === '双人' ? 1 : 房型 === '四人' ? 3 : 7;
  patch({
    宿舍: { ...draft.value.宿舍, 房型, 带路人数 },
    室友选择: 房型 === '双人' ? draft.value.室友选择 : draft.value.室友选择,
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
      社团: pick(['无', '桌游社', '摄影社', '足球社', '合唱团']),
      外貌关键词: pick(['短发深肤', '金棕卷发', '眼镜书卷气', '运动短寸']),
      一句话: pick(['看起来很好相处。', '有点难亲近，但靠谱。', '房间已经布置得很有生活感。']),
    },
  });
}

const canSubmit = computed(() => {
  if (!draft.value.开局描述.trim()) return false;
  if (draft.value.主线 === '家里线') return draft.value.家里线子路线 !== '无';
  if (draft.value.主线 === '大学线') {
    if (!draft.value.专业.trim()) return false;
    if (draft.value.宿舍.房型 === '双人' && !draft.value.室友选择) return false;
    return true;
  }
  return draft.value.主线 === '自定义';
});

function submit() {
  if (!canSubmit.value) return;
  emit('submit');
}
</script>

<style lang="scss" scoped>
.page-story {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 30px;
}

.hero {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 10px;
}
.hero h1 {
  font-size: clamp(22px, 5.5vw, 30px);
}
.hero i {
  font-size: 0.8em;
}
.sub {
  font-family: var(--font-hand);
  font-size: 13px;
  color: var(--c-text-muted);
  rotate: -3deg;
}

/* 两列等高：行高由左侧固定比例的地图决定，右侧面板绝对定位填满并内部滚动 */
.layout {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 14px;
  align-items: stretch;
}
.side-wrap {
  position: relative;
  min-height: 0;
  rotate: 1deg;
}
.side-wrap > .clip {
  right: 14px;
  top: -22px;
}
.side {
  position: absolute;
  inset: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: rgba(120, 90, 60, 0.45) transparent;
}
@media (max-width: 480px) {
  .layout {
    grid-template-columns: 1fr;
  }
  .side {
    position: relative;
    inset: auto;
    max-height: 560px;
  }
}

.map-wrap {
  padding: 8px 8px 6px;
  rotate: -0.8deg;
}
.map {
  position: relative;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  background: #d9c7a8;
}
/* 画布与底图同比例（941×1670），居中裁切，图钉以底图坐标定位 */
.canvas {
  position: absolute;
  left: 0;
  width: 100%;
  aspect-ratio: 941 / 1670;
  top: -13%;
  background: center / 100% 100% no-repeat;
}
.compass {
  position: absolute;
  left: 6px;
  top: 6px;
}

.place,
.route {
  position: absolute;
  font-family: var(--font-title);
  color: var(--c-text);
  background: rgba(246, 238, 220, 0.92);
  box-shadow: 1px 2px 4px rgba(40, 28, 18, 0.3);
  white-space: nowrap;
  pointer-events: none;
}
.place {
  font-size: 15px;
  padding: 2px 10px;
}
.place.city {
  left: 40%;
  top: 15%;
  rotate: -4deg;
}
.place.town {
  left: 4%;
  top: 75%;
  rotate: -6deg;
}
.route {
  left: 46%;
  top: 52%;
  font-family: var(--font-hand);
  font-size: 12px;
  padding: 1px 6px;
  rotate: 14deg;
}
.route b {
  display: inline-block;
  margin-left: 3px;
  padding: 0 4px;
  font-family: var(--font-latin);
  font-size: 10px;
  color: #fff;
  background: #2f4f88;
  border-radius: 3px 3px 8px 8px;
}

.pin {
  position: absolute;
  translate: -50% -100%;
  display: flex;
  align-items: center;
  gap: 2px;
  background: transparent;
  border: none;
  animation: ym-float 2.8s ease-in-out infinite;
}
.pin.home {
  left: 36%;
  top: 67%;
}
.pin.uni {
  left: 70%;
  top: 31%;
  animation-delay: 0.9s;
}
.pin .head {
  font-size: 28px;
  color: #c0392b;
  filter: drop-shadow(0 3px 2px rgba(0, 0, 0, 0.35));
  transition: transform 0.2s ease;
}
.pin-label {
  font-family: var(--font-hand);
  font-size: 13px;
  font-weight: 700;
  background: rgba(250, 244, 230, 0.95);
  padding: 1px 7px;
  box-shadow: 1px 2px 3px rgba(40, 28, 18, 0.3);
}
.pin:hover .head {
  transform: scale(1.15);
}
.pin.on .head {
  color: var(--c-primary);
}
.pin.on .pin-label {
  background: var(--c-primary);
  color: var(--c-primary-ink);
}

.map-hint {
  margin-top: 4px;
  font-family: var(--font-hand);
  font-size: 12px;
  color: var(--c-text-muted);
  text-align: center;
}

.side {
  padding: 16px 12px 12px;
}
.side h2 {
  font-size: 18px;
  margin-bottom: 8px;
}
.side h2 i {
  font-size: 0.75em;
}
.thumb {
  background: #fbf8f1;
  padding: 5px;
  box-shadow: var(--shadow-paper);
  rotate: -1.5deg;
  margin-bottom: 8px;
}
.thumb img {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}
.tag {
  font-family: var(--font-title);
  font-size: 17px;
  color: var(--c-danger);
}
.tag i {
  font-size: 0.85em;
}
.meta {
  font-family: var(--font-hand);
  font-size: 12.5px;
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
  font-family: var(--font-hand);
  font-size: 13.5px;
  font-weight: 700;
}
.field small {
  align-self: flex-end;
  font-size: 11px;
  color: var(--c-text-muted);
}
.desc textarea {
  width: 100%;
  resize: vertical;
  font-family: var(--font-hand);
  font-size: 13px;
  line-height: 32px;
  padding: 0 6px 0 36px;
  border: 1px solid rgba(150, 125, 95, 0.4);
  background-color: #fbf7ec;
  background-position: 0 0, 0 0, 0 0;
  outline: none;
}

.pills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
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
.ym-line-input.short {
  width: 72px;
  align-self: flex-start;
}
.ym-sticker.small {
  padding: 5px 10px;
  font-size: 13px;
}

.actions {
  position: relative;
  z-index: 2;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}
.ym-sticker.picked {
  background-color: #f6dc8a;
  border-color: var(--c-primary);
}

.mark {
  left: 2px;
  bottom: -6px;
  rotate: -10deg;
}
.leaf {
  right: -8px;
  bottom: -14px;
  rotate: 30deg;
}
</style>
