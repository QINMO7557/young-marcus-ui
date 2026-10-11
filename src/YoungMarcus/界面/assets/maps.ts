/**
 * 地图底图 URL。
 * - 本地预览：在正则 HTML 里先设 window.__YM_ASSET_BASE__ = 'http://localhost:5500/dist/YoungMarcus/界面/assets'
 * - 生产：推到 GitHub 后用 jsdelivr（testingcf 镜像），默认 CDN 指向 QINMO7557/young-marcus-ui。
 */
declare global {
  interface Window {
    __YM_ASSET_BASE__?: string;
  }
}

const CDN_DEFAULT =
  'https://testingcf.jsdelivr.net/gh/QINMO7557/young-marcus-ui@v1.0.8/dist/YoungMarcus/界面/assets';

export function getAssetBase(): string {
  if (typeof window !== 'undefined' && window.__YM_ASSET_BASE__) {
    return window.__YM_ASSET_BASE__.replace(/\/$/, '');
  }
  try {
    const host = window.location.hostname;
    const port = window.location.port;
    if (host === 'localhost' || host === '127.0.0.1') {
      const origin = `${window.location.protocol}//${window.location.host}`;
      // Live Server 直接打开 dist 时
      if (port === '5500' || port === '5501' || port === '8080') {
        return `${origin}/dist/YoungMarcus/界面/assets`;
      }
    }
  } catch {
    /* ignore */
  }
  return CDN_DEFAULT;
}

export function mapAsset(filename: string): string {
  return `${getAssetBase()}/${filename}`;
}

export const MAP_FILES = {
  overview: 'map_overview.webp',
  home: 'map_home.webp',
  city: 'map_city.webp',
  thumbHome: 'thumb_home.webp',
  thumbCity: 'thumb_city.webp',
} as const;
