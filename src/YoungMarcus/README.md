# YoungMarcus 前端界面

- `界面/开局表单/`：三页开局（认识世界 / 建立档案 / 故事起点）
- `界面/状态栏/`：顶栏 + 学生证 + 今日状况 + 日程/人物/道具 + 地图面板
- `界面/store.ts`：共用 `defineMvuDataStore(Schema)`
- `schema.ts`：与 `cards/YoungMarcus/schema.ts` 同步
- `界面/assets/`：地图 webp（构建后同步到 `dist/YoungMarcus/界面/assets/`）

## 构建

需要 **Node ≥ 22**（建议 24，与模板 CI 一致；`fs.globSync` 依赖）。

```bash
pnpm build
# 或
pnpm watch
```

产物：

- `dist/YoungMarcus/界面/开局表单/index.html`
- `dist/YoungMarcus/界面/状态栏/index.html`
- `dist/YoungMarcus/界面/assets/*.webp`

## 预览

1. Live Server 根目录 = `tavern_helper_template`
2. 正则临时改为加载 `http://localhost:5500/dist/YoungMarcus/界面/.../index.html`
3. 设置 `window.__YM_ASSET_BASE__ = 'http://localhost:5500/dist/YoungMarcus/界面/assets'`
4. 酒馆助手勾选「允许监听」

详见 `cards/YoungMarcus/正则/前端界面说明草稿.md`。
