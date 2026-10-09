/** 身高统一用厘米：表单里是数字，写入 MVU 时存为 "175 cm" 字符串（schema 里身高是 string）。 */
export const HEIGHT_MIN = 140;
export const HEIGHT_MAX = 220;
export const HEIGHT_DEFAULT = 175;

/** 兼容旧值：'175 cm' / '175' / `5'10"` → 175 */
export function parseHeightCm(raw: unknown): number {
  if (typeof raw === 'number' && Number.isFinite(raw)) return clampHeight(raw);
  const s = String(raw ?? '').trim();
  const imperial = s.match(/(\d)\s*['’′]\s*(\d{1,2})?/);
  if (imperial && !/cm/i.test(s)) {
    const ft = Number(imperial[1]);
    const inch = Number(imperial[2] || 0);
    return clampHeight(Math.round((ft * 12 + inch) * 2.54));
  }
  const num = s.match(/\d+(\.\d+)?/);
  if (num) return clampHeight(Math.round(Number(num[0])));
  return HEIGHT_DEFAULT;
}

export function clampHeight(n: number): number {
  return Math.min(HEIGHT_MAX, Math.max(HEIGHT_MIN, Math.round(n)));
}

export function isHeightValid(n: unknown): boolean {
  const v = Number(n);
  return Number.isFinite(v) && v >= HEIGHT_MIN && v <= HEIGHT_MAX;
}

export function formatHeightCm(n: unknown): string {
  const v = Number(n);
  return `${Number.isFinite(v) ? clampHeight(v) : HEIGHT_DEFAULT} cm`;
}
