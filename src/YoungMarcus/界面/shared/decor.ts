import { mapAsset } from '../assets/maps';

export const DECOR_FILES = {
  grain: 'paper_grain.webp',
  postcardHome: 'postcard_home.webp',
  postcardCity: 'postcard_city.webp',
} as const;

/** 把纸纹等装饰图写进 CSS 变量，CSS 里用 var(--img-grain) 引用（CDN 地址运行时决定）。 */
export function applyDecorVars(root: HTMLElement = document.documentElement) {
  root.style.setProperty('--img-grain', `url("${mapAsset(DECOR_FILES.grain)}")`);
}
