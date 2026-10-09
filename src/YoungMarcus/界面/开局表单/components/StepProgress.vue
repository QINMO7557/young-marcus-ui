<template>
  <nav class="steps ym-sheet ym-tape" style="--tx: 8%; --ty: -9px; --tr: -38deg; --tw: 60px" aria-label="开局步骤">
    <template v-for="(step, index) in steps" :key="step.id">
      <div class="step" :class="{ active: model === step.id, done: model > step.id }">
        <span class="dot">{{ index + 1 }}</span>
        <span class="label">{{ step.label }}</span>
      </div>
      <span v-if="index < steps.length - 1" class="line" :class="{ done: model > step.id }" />
    </template>
  </nav>
</template>

<script setup lang="ts">
const model = defineModel<number>({ required: true });

const steps = [
  { id: 1, label: '认识世界' },
  { id: 2, label: '建立档案' },
  { id: 3, label: '故事起点' },
];
</script>

<style lang="scss" scoped>
.steps {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 12px 14px 10px;
  margin-bottom: 14px;
  border-radius: 3px;
  rotate: -0.3deg;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-width: 64px;
}

.dot {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1.6px solid rgba(90, 70, 50, 0.55);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-latin);
  font-size: 15px;
  color: var(--c-text-muted);
  background: rgba(255, 252, 244, 0.7);
  transition: background 0.3s ease, color 0.3s ease;
}

.label {
  font-family: var(--font-hand);
  font-size: 13px;
  color: var(--c-text-muted);
  white-space: nowrap;
}

.line {
  flex: 1;
  max-width: 120px;
  height: 2px;
  margin-top: 15px;
  background: rgba(150, 125, 95, 0.4);
}
.line.done {
  background: var(--c-accent);
}

.step.active .dot,
.step.done .dot {
  background: radial-gradient(circle at 35% 30%, var(--c-accent-soft), var(--c-accent));
  border-color: #8f6d2a;
  color: #fff8e6;
  box-shadow: 0 0 0 3px rgba(184, 145, 63, 0.22);
}

.step.active .label {
  color: var(--c-text);
  font-weight: 700;
}
</style>
