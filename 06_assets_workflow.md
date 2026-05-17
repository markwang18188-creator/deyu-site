# 06 · 图片素材管理工作流

> 给 Mark 用 — 如何告诉 Claude "改哪张图"

## 目前网站上的图片来源

| 类型 | 数据源 | Supabase 路径 |
|---|---|---|
| 产品白底图(18 个机型) | [src/data/products.ts](src/data/products.ts) `mainImage` | `product-images/dy-*.{jpg,png}` |
| Header Logo | [src/components/layout/Header.tsx](src/components/layout/Header.tsx) | `product-images/deyu-logo.png` |
| About 页 "Our Factory"(3 张厂房) | [src/app/[locale]/about/page.tsx](src/app/[locale]/about/page.tsx) `factoryHighlights` | `product-images/factory/*.jpg` |
| Cases 页(展会+客户+车间+发货) | [src/data/gallery.ts](src/data/gallery.ts) `gallery` 数组 | `product-images/exhibitions/*.jpg` |

---

## 怎么告诉 Claude 你要改哪张?

**每张图都有一个稳定 `id`**(在 gallery.ts 里),对话中直接引用 id 就能精确定位:

✅ **好的指代方式**:
- 「`tradeshow-3d-display` 这张换成 NAS 里的 xxx.jpg」
- 「`customer-pink-shirt-mold` 这张去掉,不太合适」
- 「在 customer 分类下新加一张,放在 NAS 的 ...」
- 「Header 的 logo 想换新版」
- 「About 页 `workshop-01` 换成新的车间图」

✅ **也可以用描述**:
- 「那张足球鞋鞋底的图」 → Claude 在 manifest 里看到 caption "Soccer Cleat Soles" 就能找到
- 「带 3D 屏幕的那个展台」 → 对应 `tradeshow-3d-display`

❌ **不好的指代方式**:
- 「Cases 页第 5 张」(顺序可能变)
- 「左下角那张」(响应式布局会变)

---

## 常见操作

### 1️⃣ 增加一张新图(展会/车间/客户/发货)

**你要做的**:把图放进 NAS,告诉 Claude 三件事:
- 文件名 (例: `2024-canton-fair.jpg`)
- 分类 (`tradeshow` / `customer` / `workshop` / `shipment` / `product`)
- 简短描述 (例: "Canton Fair 2024 Booth")

**Claude 会**:上传到 Supabase + 在 `gallery.ts` 加一条 entry。

### 2️⃣ 替换某张图

**你说**:「`tradeshow-deyu-2220a-booth` 这张换成 NAS 里的新图 xxx.jpg」

**Claude 会**:用同文件名覆盖上传(Supabase 缓存会自动刷新)或换 `filename` 字段。

### 3️⃣ 删掉某张图

**你说**:「把 `product-soccer-cleat-soles` 从 Cases 页去掉」

**Claude 会**:在 manifest 里把那条加上 `published: false`(保留 entry,以后随时恢复),或直接删除。

### 4️⃣ 改文案/分类

**你说**:「`tradeshow-3d-display` 的 caption 改成 'Canton Fair 2024 — DY-2220A Demo'」

**Claude 会**:直接改 `gallery.ts` 里那条 entry 的 caption/location/year 字段。

### 5️⃣ 重新分组/排序

如果你觉得 Cases 页区块顺序要调,或者要拆出新分类(比如把 "shipment" 拆成"国内发货/海外发货"),告诉 Claude 即可,Cases 页是 manifest-driven 的,改一处就全网生效。

---

## 关于"工厂图" vs "Cases 图"

| 用途 | 在哪里 | 来源 |
|---|---|---|
| About 页顶部 3 张正式厂房图 | About 页 `factoryHighlights`(代码硬编码) | `product-images/factory/` |
| Cases 页"In Production"分类 | gallery.ts `workshop`/`customer` 分类 | `product-images/exhibitions/` |

**两者分开**的原因:About 页用的是"端庄正式的厂房代表照"(3 张精选),Cases 页是"丰富的现场画面"(可以多)。

要把某张 Cases 里的车间图升级到 About 页,告诉 Claude id 即可,Claude 会把文件复制到 `factory/` 目录并替换 About 页配置。

---

## 关于视频

视频不上传到 Supabase(成本高、加载慢),用 YouTube + iframe 嵌入。

**新增视频流程**:
1. 你在 DEYU YouTube 频道上传视频
2. 给 Claude 视频 ID 或 embed URL,以及对应哪个产品 slug
3. Claude 把 `videoUrl: 'https://www.youtube.com/embed/VIDEO_ID'` 加到 `products.ts` 对应产品上
4. 产品详情页会自动出现 "Watch It in Action" 区块
