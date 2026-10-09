<template>
  <svg class="ym-clip" viewBox="0 0 24 64" width="18" height="48" aria-hidden="true">
    <path
      d="M8 46V14a6 6 0 0 1 12 0v36a9 9 0 0 1-18 0V18"
      fill="none"
      stroke="url(#ymClipG)"
      stroke-width="2.6"
      stroke-linecap="round"
    />
    <defs>
      <linearGradient id="ymClipG" x1="0" x2="1">
        <stop offset="0" stop-color="#8d949b" />
        <stop offset=".5" stop-color="#e3e7ea" />
        <stop offset="1" stop-color="#7c838a" />
      </linearGradient>
    </defs>
  </svg>
</template>

<style scoped>
.ym-clip {
  position: absolute;
  z-index: 5;
  filter: drop-shadow(1px 2px 1px rgba(40, 28, 18, 0.35));
  pointer-events: none;
}
</style>
