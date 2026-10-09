<template>
  <section class="page-world">
    <header class="hero">
      <h1>欢迎来到新的一页</h1>
      <p class="sub">一个关于成长、家与远方的故事。</p>
    </header>

    <div class="layout">
      <article class="letter paper">
        <h2>致新来的你</h2>
        <p class="typewriter" :class="{ done: typedDone }" aria-live="polite">{{ displayed }}</p>
      </article>

      <div class="postcards">
        <figure class="card wobble" style="--r: -3deg">
          <div class="photo home-photo" />
          <figcaption>HOME · 郊区小镇</figcaption>
        </figure>
        <div class="dash">约 3 小时车程</div>
        <figure class="card wobble" style="--r: 2.5deg">
          <div class="photo city-photo" />
          <figcaption>CITY · 大学城</figcaption>
        </figure>
      </div>
    </div>

    <div class="notes">
      <aside class="sticky green wobble" style="--r: -2deg">开放沙盒，没有固定结局</aside>
      <aside class="sticky yellow wobble" style="--r: 1.5deg">时间流动，四季与昼夜更替</aside>
      <aside class="sticky coral wobble" style="--r: -1deg">人们会记得你，关系慢慢变化</aside>
    </div>

    <div class="actions">
      <button type="button" class="btn-primary" @click="$emit('next')">下一步：建立档案 →</button>
    </div>
  </section>
</template>

<script setup lang="ts">
defineEmits<{ next: [] }>();

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
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.hero h1 {
  font-family: var(--font-hand);
  font-size: 1.55rem;
  color: var(--c-primary);
}

.sub {
  color: var(--c-text-muted);
  margin-top: 4px;
}

.layout {
  display: grid;
  grid-template-columns: 1.2fr 0.9fr;
  gap: 14px;
}

@media (max-width: 720px) {
  .layout {
    grid-template-columns: 1fr;
  }
}

.paper {
  background: var(--c-surface-paper);
  border: 1px solid var(--c-border);
  box-shadow: var(--shadow-paper);
  padding: 14px 16px;
  border-radius: 2px;
  position: relative;
}

.paper::before {
  content: '';
  position: absolute;
  inset: 8px auto auto 0;
  width: 100%;
  height: calc(100% - 16px);
  background-image: repeating-linear-gradient(
    transparent,
    transparent 27px,
    rgba(120, 150, 190, 0.22) 28px
  );
  pointer-events: none;
  opacity: 0.55;
}

.letter h2 {
  font-size: 1rem;
  margin-bottom: 8px;
  position: relative;
  z-index: 1;
}

.typewriter {
  position: relative;
  z-index: 1;
  min-height: 8.5em;
  white-space: pre-wrap;
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

.postcards {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.card {
  width: min(100%, 220px);
  background: #fff;
  padding: 8px 8px 12px;
  box-shadow: var(--shadow-paper);
  transform: rotate(var(--r, 0deg));
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.card:hover {
  transform: rotate(var(--r, 0deg)) translateY(-6px) scale(1.02);
  box-shadow: var(--shadow-lift);
  z-index: 2;
}

.photo {
  height: 110px;
  border-radius: 2px;
  background-size: cover;
  background-position: center;
}

.home-photo {
  background-image: linear-gradient(160deg, #c97b4a, #e8c07a 40%, #6d9a78 75%);
}

.city-photo {
  background-image: linear-gradient(160deg, #4a6078, #8aa0b8 35%, #c45c4a 70%, #2a3545);
}

.card figcaption {
  margin-top: 8px;
  font-size: 12px;
  font-weight: 700;
  text-align: center;
}

.dash {
  font-size: 11px;
  color: var(--c-text-muted);
  border-left: 2px dashed var(--c-border);
  padding-left: 8px;
  align-self: flex-start;
  margin-left: 24px;
}

.notes {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

@media (max-width: 720px) {
  .notes {
    grid-template-columns: 1fr;
  }
}

.sticky {
  padding: 12px 10px;
  font-size: 12px;
  box-shadow: var(--shadow-paper);
  transform: rotate(var(--r, 0deg));
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.sticky:hover {
  transform: rotate(var(--r, 0deg)) translateY(-5px);
  box-shadow: var(--shadow-lift);
}

.sticky.green {
  background: var(--c-surface-note-green);
}
.sticky.yellow {
  background: var(--c-surface-note);
}
.sticky.coral {
  background: var(--c-surface-note-coral);
}

.wobble {
  animation: wobble 3.6s ease-in-out infinite;
}

@keyframes wobble {
  0%,
  100% {
    translate: 0 0;
  }
  50% {
    translate: 0 -2px;
  }
}

.actions {
  display: flex;
  justify-content: center;
  padding-top: 8px;
}

.btn-primary {
  background: var(--c-primary);
  color: #f7f2e8;
  border: 2px solid #1f3d31;
  padding: 10px 18px;
  border-radius: 4px;
  font-weight: 700;
  letter-spacing: 0.02em;
  box-shadow: 2px 3px 0 rgba(30, 40, 30, 0.25);
}

.btn-primary:hover {
  background: var(--c-primary-soft);
}
</style>
