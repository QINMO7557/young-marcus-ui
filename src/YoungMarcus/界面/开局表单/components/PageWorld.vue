<template>
  <section class="page-world">
    <span class="ym-stain stain-a" style="--s: 150px" aria-hidden="true" />
    <header class="hero ym-sheet">
      <h1 class="ym-title ym-underline">欢迎来到新的一页</h1>
      <p class="sub">—— 一个关于成长、家与远方的故事。</p>
    </header>

    <div class="layout">
      <article class="letter ym-sheet ym-ruled ym-tape" style="--tx: 14%; --tr: -8deg">
        <h2 class="ym-title ym-underline">致新来的你</h2>
        <p class="typewriter" :class="{ done: typedDone }" aria-live="polite">{{ displayed }}</p>
        <Postmark class="letter-mark" top="HALSTON" bottom="FALL · 01" />
      </article>

      <div class="postcards">
        <figure class="card ym-lift ym-wobble" style="--r: 3deg">
          <Paperclip class="clip" />
          <img :src="homeImg" alt="海鸥湾镇俯瞰插画" loading="lazy" />
          <figcaption><b>HOME</b> · 郊区小镇</figcaption>
        </figure>
        <div class="drive" aria-hidden="true">
          <svg viewBox="0 0 120 40" width="96" height="32">
            <path d="M8 6 C 40 2, 30 34, 70 28 S 108 20, 112 34" fill="none" stroke="#3a2a1f" stroke-width="1.6" stroke-dasharray="4 4" />
            <path d="M106 30 l6 4 l-1 -7" fill="none" stroke="#3a2a1f" stroke-width="1.6" />
          </svg>
          <span>约 <b>3</b> 小时车程</span>
        </div>
        <figure class="card ym-lift ym-wobble ym-tape" style="--r: -2.5deg; --d: 1.2s; --ty: -12px; --tr: 6deg">
          <img :src="cityImg" alt="霍尔斯顿市与大学城俯瞰插画" loading="lazy" />
          <figcaption><b>CITY</b> · 大学城</figcaption>
        </figure>
      </div>
    </div>

    <div class="notes">
      <aside class="tag green ym-lift ym-wobble ym-tape" style="--r: -2deg; --tw: 46px; --ty: -11px">
        <i class="fa-solid fa-tree" aria-hidden="true" />
        <span>开放式沙盒，<br />没有固定结局</span>
      </aside>
      <aside class="tag amber ym-lift ym-wobble ym-tape" style="--r: 1.5deg; --d: 0.8s; --tw: 46px; --ty: -11px">
        <i class="fa-solid fa-sun" aria-hidden="true" />
        <span>时间会流动，<br />四季与日夜</span>
      </aside>
      <aside class="tag coral ym-lift ym-wobble ym-tape" style="--r: -1deg; --d: 1.6s; --tw: 46px; --ty: -11px">
        <i class="fa-solid fa-user-group" aria-hidden="true" />
        <span>人会记住你，<br />关系慢慢变化</span>
      </aside>
    </div>

    <div class="actions">
      <button type="button" class="ym-stamp" @click="$emit('next')">下一步：建立档案 →</button>
    </div>
    <MapleLeaf class="leaf" :size="58" color="#c86a2c" />
  </section>
</template>

<script setup lang="ts">
import { mapAsset } from '../../assets/maps';
import MapleLeaf from '../../shared/MapleLeaf.vue';
import Paperclip from '../../shared/Paperclip.vue';
import Postmark from '../../shared/Postmark.vue';
import { DECOR_FILES } from '../../shared/decor';

defineEmits<{ next: [] }>();

const homeImg = mapAsset(DECOR_FILES.postcardHome);
const cityImg = mapAsset(DECOR_FILES.postcardCity);

const WORLD_TEXT =
  '美国东岸的海鸥湾镇，白围栏、枫树、木栈道和灯塔；三小时车程外是霍尔斯顿市，红砖校园和钟楼被摩天楼包围，地铁从楼群间穿过。你刚满十八岁，或者更大一点。今年秋天，你可以留在海边的新家，和家人、邻居一起过日子；也可以搬进城里的大学宿舍，开始一个人的生活。这里没有结局，只有你想过成什么样的日子。';

const displayed = ref('');
const typedDone = ref(false);
let timer: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  const reduce =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) {
    displayed.value = WORLD_TEXT;
    typedDone.value = true;
    return;
  }
  let i = 0;
  timer = setInterval(() => {
    i += 1;
    displayed.value = WORLD_TEXT.slice(0, i);
    if (i >= WORLD_TEXT.length) {
      typedDone.value = true;
      if (timer) clearInterval(timer);
    }
  }, 28);
});

onBeforeUnmount(() => {
  if (timer) clearInterval(timer);
});
</script>

<style lang="scss" scoped>
.page-world {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.stain-a {
  left: -30px;
  bottom: 30px;
}

.hero {
  padding: 14px 18px 12px;
  rotate: 0.4deg;
  border-radius: 2px;
}
.hero h1 {
  font-size: clamp(24px, 6vw, 34px);
}
.sub {
  margin-top: 4px;
  text-align: right;
  font-family: var(--font-hand);
  color: var(--c-text-muted);
  font-size: 13px;
}

.layout {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 18px;
  align-items: start;
}
@media (max-width: 460px) {
  .layout {
    grid-template-columns: 1fr;
  }
}

.letter {
  padding: 18px 16px 26px 40px;
  rotate: -1.2deg;
  min-height: 260px;
}
.letter h2 {
  font-size: 20px;
  margin-bottom: 10px;
}
.typewriter {
  position: relative;
  z-index: 1;
  min-height: 9em;
  white-space: pre-wrap;
  font-family: var(--font-hand);
  font-size: 14.5px;
  line-height: 32px;
  color: #3a2c22;
}
.typewriter:not(.done)::after {
  content: '▌';
  color: var(--c-primary);
  animation: blink 1s step-end infinite;
}
@keyframes blink {
  50% {
    opacity: 0;
  }
}
.letter-mark {
  right: -10px;
  bottom: -18px;
  rotate: -12deg;
  opacity: 0.6;
}

.postcards {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.card {
  position: relative;
  width: min(100%, 250px);
  background: #fbf8f1;
  padding: 8px 8px 6px;
  box-shadow: var(--shadow-paper);
}
.card img {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  filter: saturate(1.05) contrast(1.02);
}
.card .clip {
  right: 14px;
  top: -18px;
  rotate: 8deg;
}
.card figcaption {
  margin-top: 6px;
  font-family: var(--font-hand);
  font-size: 13px;
  letter-spacing: 0.06em;
}
.card figcaption b {
  font-family: var(--font-latin);
  letter-spacing: 0.12em;
}

.drive {
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: var(--font-hand);
  font-size: 13px;
  color: var(--c-text);
  rotate: -3deg;
}
.drive b {
  font-size: 17px;
}

.notes {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
@media (max-width: 460px) {
  .notes {
    grid-template-columns: 1fr;
  }
}

.tag {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 10px 12px;
  font-family: var(--font-hand);
  font-size: 13.5px;
  line-height: 1.45;
  color: #fbf3e2;
  background-image: var(--img-grain);
  border-radius: 3px;
  box-shadow: var(--shadow-paper);
}
.tag i {
  font-size: 20px;
  opacity: 0.9;
}
.tag.green {
  background-color: #5f7650;
}
.tag.amber {
  background-color: #c79a4a;
  color: #3a2a1f;
}
.tag.coral {
  background-color: #a8513c;
}

.actions {
  display: flex;
  justify-content: center;
  padding-top: 4px;
}

.leaf {
  right: -6px;
  bottom: -14px;
  rotate: 22deg;
}
</style>
