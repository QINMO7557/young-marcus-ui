<template>
  <section class="page-profile">
    <header class="hero">
      <h1>这一次，你是谁？</h1>
    </header>

    <div class="layout">
      <article class="paper form">
        <h2>个人档案</h2>

        <label class="field">
          <span>姓名</span>
          <input v-model="form.姓名" type="text" maxlength="40" placeholder="请输入你的名字" />
        </label>

        <label class="field">
          <span>年龄</span>
          <input v-model.number="form.年龄" type="number" min="18" max="99" placeholder="18+" />
          <small v-if="ageError" class="err">{{ ageError }}</small>
        </label>

        <label class="field">
          <span>身高</span>
          <input v-model="form.身高" type="text" placeholder="如 5'10&quot; 或 178cm" />
        </label>

        <div class="field">
          <span>体型</span>
          <div class="pills">
            <button
              v-for="opt in bodyOptions"
              :key="opt"
              type="button"
              class="pill"
              :class="{ on: form.体型 === opt }"
              @click="form.体型 = opt"
            >
              {{ opt }}
            </button>
          </div>
          <input v-model="form.体型备注" type="text" class="mt" placeholder="体型备注（可选）" />
        </div>

        <label class="field">
          <span>外貌</span>
          <textarea v-model="form.外貌" rows="2" placeholder="黑发、棕眼……" />
        </label>
      </article>

      <aside class="note">
        <h2>关于我</h2>

        <div class="field">
          <span>爱好（最多 3 个）</span>
          <div class="pills">
            <button
              v-for="h in hobbyPool"
              :key="h"
              type="button"
              class="pill"
              :class="{ on: form.爱好.includes(h) }"
              @click="toggleHobby(h)"
            >
              {{ h }}
            </button>
            <button type="button" class="pill dashed" @click="addCustomHobby">+ 自定义</button>
          </div>
        </div>

        <label class="field">
          <span>喜欢的类型</span>
          <input v-model="form.喜欢的类型" type="text" placeholder="自填，如：可靠的年长者" />
        </label>

        <label class="field">
          <span>性格</span>
          <input v-model="form.性格" type="text" placeholder="请输入你的性格特点" />
        </label>

        <label class="field">
          <span>一句话自述</span>
          <input v-model="form.自述" type="text" maxlength="80" placeholder="可选" />
        </label>
      </aside>
    </div>

    <div class="actions">
      <button type="button" class="btn-ghost" @click="$emit('back')">← 上一步</button>
      <button type="button" class="btn-dashed" :disabled="aiBusy" @click="aiFill">
        {{ aiBusy ? '补全中…' : '✨ AI 帮我补全' }}
      </button>
      <button type="button" class="btn-primary" :disabled="!!ageError || !form.姓名.trim()" @click="goNext">
        下一步：故事起点 →
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
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
  身高: string;
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
const aiBusy = ref(false);

const ageError = computed(() => {
  const age = Number(form.value.年龄);
  if (!Number.isFinite(age) || age < 18) return '年龄须 ≥ 18';
  return '';
});

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
    if (!form.value.身高.trim()) defaults.身高 = `5'10"`;
    patch(defaults);
    toastr.success('已用占位文案补全空字段（正式版将接 AI）');
  } finally {
    aiBusy.value = false;
  }
}

function goNext() {
  if (ageError.value || !form.value.姓名.trim()) return;
  emit('next');
}

</script>

<style lang="scss" scoped>
.page-profile {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.hero h1 {
  font-size: 1.35rem;
  color: var(--c-primary);
}

.layout {
  display: grid;
  grid-template-columns: 1.15fr 0.95fr;
  gap: 12px;
}

@media (max-width: 720px) {
  .layout {
    grid-template-columns: 1fr;
  }
}

.paper,
.note {
  background: var(--c-surface-paper);
  border: 1px solid var(--c-border);
  box-shadow: var(--shadow-paper);
  padding: 14px;
}

.note {
  background: var(--c-surface-note);
  transform: rotate(0.4deg);
}

h2 {
  font-size: 0.95rem;
  margin-bottom: 10px;
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
  background: rgba(255, 255, 255, 0.75);
  border-radius: 4px;
  padding: 7px 9px;
  outline: none;
}

input:focus,
textarea:focus {
  border-color: var(--c-primary);
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
  border-color: var(--c-primary);
  color: #fff;
}

.pill.dashed {
  border-style: dashed;
}

.mt {
  margin-top: 6px;
}

.err {
  color: var(--c-danger);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  padding-top: 4px;
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
