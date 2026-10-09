<template>
  <div class="desk">
    <div class="desk-photo" aria-hidden="true" />
    <MapleLeaf class="desk-leaf" :size="78" color="#b9472a" />
    <div class="folder">
      <div class="tab">
        <span class="ym-title">角色卡</span>
        <small>· 开局设置 ·</small>
      </div>
      <div class="folder-body ym-kraft">
        <StepProgress v-model="step" />
        <PageWorld v-if="step === 1" @next="step = 2" />
        <PageProfile v-else-if="step === 2" v-model="profile" @back="step = 1" @next="step = 3" />
        <PageStory
          v-else
          v-model="story"
          :submitting="submitting"
          @back="step = 2"
          @submit="onSubmit"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';
import PageProfile, { type ProfileForm } from './components/PageProfile.vue';
import PageStory, { type StoryDraft } from './components/PageStory.vue';
import PageWorld from './components/PageWorld.vue';
import StepProgress from './components/StepProgress.vue';
import MapleLeaf from '../shared/MapleLeaf.vue';
import { mapAsset } from '../assets/maps';
import { DECOR_FILES } from '../shared/decor';
import { formatHeightCm, parseHeightCm } from '../shared/height';

const deskPhoto = `url("${mapAsset(DECOR_FILES.postcardCity)}")`;

const store = useDataStore();
const step = ref(1);
const submitting = ref(false);

const profile = ref<ProfileForm>({
  姓名: store.data.主角.姓名 || 'Marcus',
  年龄: Math.max(18, store.data.主角.年龄 || 18),
  身高: parseHeightCm(store.data.主角.身高),
  体型: store.data.主角.体型 || '正常',
  体型备注: store.data.主角.体型备注 || '',
  外貌: store.data.主角.外貌 || '',
  爱好: [...(store.data.主角.爱好 || [])].slice(0, 3),
  喜欢的类型: store.data.主角.喜欢的类型 || '',
  性格: store.data.主角.性格 || '',
  自述: store.data.主角.自述 || '',
});

const story = ref<StoryDraft>({
  主线: store.data.世界.主线 || '大学线',
  家里线子路线: store.data.世界.家里线子路线 || '无',
  专业: store.data.世界.专业 || '未定通识',
  开局描述: store.data.世界.开局描述摘要 || '',
  室友选择: store.data.日程.室友选择 || 'Christian',
  自定义室友: { ...store.data.日程.自定义室友 },
});

function buildIdentityMessage(): string {
  const p = profile.value;
  const s = story.value;
  const lines = [
    `【开局确认】`,
    `姓名：${p.姓名}｜年龄：${p.年龄}｜身高：${formatHeightCm(p.身高)}｜体型：${p.体型}${p.体型备注 ? `（${p.体型备注}）` : ''}`,
    `外貌：${p.外貌 || '（未填）'}`,
    `爱好：${p.爱好.join('、') || '（未填）'}`,
    `喜欢的类型：${p.喜欢的类型 || '（未填）'}`,
    `性格：${p.性格 || '（未填）'}`,
    `自述：${p.自述 || '（未填）'}`,
    `主线：${s.主线}${s.主线 === '家里线' ? `／子路线：${s.家里线子路线}` : ''}`,
  ];
  if (s.主线 === '大学线') {
    lines.push(`专业：${s.专业}｜室友：${s.室友选择}`);
    if (s.室友选择 === '自定义') {
      const r = s.自定义室友;
      lines.push(
        `自定义室友：${[r.年级, r.身份, r.体型, r.气质, r.取向, r.院系].filter(Boolean).join('／')}｜性格：${r.性格.join('、') || '无'}｜外貌：${r.外貌关键词 || '无'}｜印象：${r.一句话 || '无'}`,
      );
    }
  }
  lines.push(`开局描述：${s.开局描述}`);
  lines.push('请根据以上设定，生成叙事式第一幕，并更新相关变量。');
  return lines.join('\n');
}

async function onSubmit() {
  if (submitting.value) return;
  submitting.value = true;
  try {
    const p = profile.value;
    const s = story.value;

    store.data.主角.姓名 = p.姓名.trim();
    store.data.主角.年龄 = Math.max(18, Math.floor(Number(p.年龄) || 18));
    store.data.主角.身高 = formatHeightCm(p.身高);
    store.data.主角.体型 = p.体型;
    store.data.主角.体型备注 = p.体型备注.trim();
    store.data.主角.外貌 = p.外貌.trim();
    store.data.主角.爱好 = p.爱好.slice(0, 3);
    store.data.主角.喜欢的类型 = p.喜欢的类型.trim();
    store.data.主角.性格 = p.性格.trim();
    store.data.主角.自述 = p.自述.trim();

    store.data.世界.主线 = s.主线;
    store.data.世界.家里线子路线 = s.主线 === '家里线' ? s.家里线子路线 : '无';
    store.data.世界.专业 = s.主线 === '大学线' ? s.专业.trim() || '未定通识' : store.data.世界.专业;
    store.data.世界.开局描述摘要 = s.开局描述.trim().slice(0, 500);

    if (s.主线 === '大学线') {
      store.data.日程.室友选择 = s.室友选择;
      store.data.日程.自定义室友 = { ...s.自定义室友 };
      store.data.世界.当前区域 = '大学城';
      store.data.世界.当前地点 = '宿舍';
      store.data.主角.身份 = '霍大大一';
    } else if (s.主线 === '家里线') {
      store.data.世界.当前区域 = '家附近';
      store.data.世界.当前地点 = '家';
      store.data.主角.身份 =
        s.家里线子路线 === '社区学院' ? '社区学院走读生' : '暂缓入学·打工中';
    }

    store.data.世界.日期 = store.data.世界.日期 || '9/1';
    store.data.世界.星期 = store.data.世界.星期 || '周一';
    store.data.世界.季节 = '秋';

    const message = buildIdentityMessage();
    await createChatMessages([{ role: 'user', message }]);
    await triggerSlash('/trigger');
  } catch (err) {
    console.error(err);
    toastr.error('提交开局失败，请查看控制台');
  } finally {
    submitting.value = false;
  }
}
</script>

<style lang="scss" scoped>
.desk {
  position: relative;
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
  padding: 14px 10px 18px;
  border-radius: 6px;
  background-color: var(--c-surface-desk);
  background-image:
    var(--img-grain),
    repeating-linear-gradient(
      92deg,
      rgba(0, 0, 0, 0.1) 0 2px,
      transparent 2px 9px,
      rgba(255, 220, 170, 0.05) 9px 11px,
      transparent 11px 23px
    ),
    linear-gradient(180deg, #5a3a26, #3e2618);
  overflow: hidden;
}

.desk-photo {
  position: absolute;
  right: 6%;
  top: -18px;
  width: 150px;
  height: 92px;
  background: v-bind(deskPhoto) center / cover;
  border: 6px solid #f4eee2;
  border-bottom-width: 14px;
  rotate: 5deg;
  box-shadow: var(--shadow-paper);
  opacity: 0.95;
}

.desk-leaf {
  right: -14px;
  bottom: -10px;
  rotate: -28deg;
  z-index: 6;
}

.folder {
  position: relative;
  z-index: 2;
}

.tab {
  position: relative;
  display: inline-flex;
  align-items: baseline;
  gap: 8px;
  margin-left: 10px;
  padding: 7px 22px 6px 16px;
  background-color: var(--c-surface-folder);
  background-image: var(--img-grain);
  border-radius: 10px 18px 0 0;
  box-shadow: inset 0 1px 0 rgba(255, 240, 210, 0.4);
}
.tab .ym-title {
  font-size: 20px;
}
.tab small {
  font-family: var(--font-hand);
  color: var(--c-text-muted);
  font-size: 12px;
}

.folder-body {
  position: relative;
  border-radius: 0 8px 8px 8px;
  padding: 12px 12px 22px;
}
</style>
