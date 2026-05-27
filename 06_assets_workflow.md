# 06 · 媒体素材工作流

> **视频处理(水印、字幕、BGM 混音)已搬到独立项目:**
> **`~/CRMsystem/deyu-media-studio/`**
>
> 网站这边只放网页直接显示的图片(logo、产品图、工厂图、OG 图等)。
> 视频处理脚本和水印素材一律去 Studio。

---

## Studio 常用命令

```bash
cd ~/CRMsystem/deyu-media-studio

# 视频加 DEYU 水印 + BGM
bash scripts/watermark.sh inbox/foo.mp4

# 中文视频自动配西/葡/土/阿/英字幕
bash scripts/subtitle.sh inbox/foo.mov es
bash scripts/subtitle.sh inbox/foo.mov pt
bash scripts/subtitle.sh inbox/foo.mov tr

# 详细见 ~/CRMsystem/deyu-media-studio/README.md
```

## 资产分工

| 类型 | 位置 | 说明 |
|---|---|---|
| 网页 logo / 工厂图 / 产品图 / 展会图 / OG 图 | `deyu-site/public/` | 网页直接展示 |
| 水印 logo / 扫光 / 文字 PNG | `deyu-media-studio/assets/logos/` | 视频用 |
| BGM mp3 (5 首工业风) | `deyu-media-studio/assets/bgm/` | 视频用 |
| 原视频(待处理) | `deyu-media-studio/inbox/` | gitignored |
| 成品视频 | `deyu-media-studio/output/` | gitignored |
| Whisper 模型 (1.5GB) | `~/.whisper-models/` | 共享 |
| DeepSeek API key | `deyu-media-studio/.env` | 翻译用 |

## 网站图片素材管理(原版本)

> 网页图怎么改、命名约定、何时换 Supabase 等——保留下面这个旧手册

---

# 图片素材管理工作流 (原版本,Mark 用)

## 目前网站上的图片来源

1. **branding/** — DEYU 官方品牌素材(logo / favicon / YouTube banner / 头像设计)
2. **public/** — 网站直接展示的图(产品图、工厂图、首页大图、OG 图)
3. **Supabase Storage `product-images/` bucket** — 远端备份,本地 dev 已不直接拉

## 改图的方式

- **加新图**: 把新图丢到 `public/` 对应子目录(`products/` `factory/` `exhibitions/`),代码引用相对路径 `/products/xxx.jpg`
- **换现有图**: 同名覆盖即可(下次 dev 重启或 next build 生效)
- **删图**: 从 `public/` 删 + 改引用代码

## 重要规则

- ❌ 不要把视频 / 大型媒体文件丢到 `deyu-site/public/`,去 Media Studio
- ✅ 网页图保持 .jpg/.png/.webp,单图 < 500KB(用 sharp / sips 压缩)
- ✅ 产品图统一 1600×1200 白底,gallery 引用同 slug
