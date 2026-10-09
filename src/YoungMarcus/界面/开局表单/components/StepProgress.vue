<template>
  <div class="steps" role="navigation" aria-label="开局步骤">
    <div
      v-for="(step, index) in steps"
      :key="step.id"
      class="step"
      :class="{ active: model === step.id, done: model > step.id }"
    >
      <span class="dot">{{ index + 1 }}</span>
      <span class="label">{{ step.label }}</span>
      <span v-if="index < steps.length - 1" class="line" />
    </div>
  </div>
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
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px 4px 16px;
  flex-wrap: wrap;
}

.step {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--c-text-muted);
  position: relative;
}

.dot {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 2px solid var(--c-border);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  background: var(--c-surface-paper);
}

.label {
  font-size: 12px;
  white-space: nowrap;
}

.line {
  width: 28px;
  height: 2px;
  background: var(--c-border);
  margin: 0 4px;
}

.step.active .dot,
.step.done .dot {
  background: var(--c-accent);
  border-color: var(--c-accent);
  color: #fff;
}

.step.active .label {
  color: var(--c-text);
  font-weight: 700;
}

.step.done .line {
  background: var(--c-accent);
}
</style>
