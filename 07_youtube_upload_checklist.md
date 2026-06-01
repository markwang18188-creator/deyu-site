# 07 · YouTube 上传 Checklist (19 视频)

> 频道: **DEYU Machinery** · 默认上传 → **Private (私密)** → 你审核 → 改 **Public** → 把视频 ID 发我，我集成到产品页

---

## ⛔ 版权防踩坑 · 三条铁律(读完再开始)

第一批 19 视频里 3 个 Shorts 因 BGM 被 Content ID 认领 + 时长超 60s 被
**直接禁播**。原因 + 防范固化在下面三条,做新一批前请逐条对照。

### 1 · BGM 只能用 YouTube Audio Library 标 "无需署名" 的曲目

`deyu-media-studio/assets/bgm/` 是 BGM 池,`watermark.sh` 自动按视频名
哈希分配。**池里只允许放 YouTube Audio Library 的"无需署名"曲目**。

- Pixabay CC0 / 各种"免版权"网站 ≠ 100% 安全(上传者可能本就没合法权
  利,或被第三方后期注册到 Content ID)。
- 唯一确定干净的源:`studio.youtube.com/.../music`,筛选"归属类型 = 无
  需署名"。
- 详情看 `deyu-media-studio/assets/bgm/README.md`。

### 2 · Shorts 渲染务必 `SHORTS=1`,卡到 ≤58 秒

YouTube 隐藏规则:
- **Shorts > 60 秒 + 含 Content ID 认领 = 直接禁播**(我们踩到的)
- Shorts < 60 秒 + 含认领 = 只是分成归对方,视频还能播

所以做 Shorts 时:

```bash
SHORTS=1 bash scripts/watermark.sh inbox/      # 整批输出截到 58s
```

输出文件名会加 `-short` 后缀,跟横屏版可以共存。横屏长视频不需要
`SHORTS` 参数,因为横屏没有 60s 红线。

### 3 · 每批先发 1 个 Unlisted,等 10 分钟看 `/copyright` 干净再批量公开

即使 BGM 池都是 YT Audio Library,也建议**最保险**:

1. 第一个视频上传时设 **不公开 (Unlisted)**,不是 Public
2. 等 5–10 分钟,让 YouTube Content ID 跑完扫描
3. 打开 `https://studio.youtube.com/video/<id>/copyright`
4. **没有 Content ID 主张** → 改成 Public,后续 18 个按相同模板批量公开
5. **有主张** → 先不公开,去 `/copyright` 点 "采取行动 → 替换歌曲",换
   一首 YT Audio Library 里的曲子保存,再公开

万一已公开后才发现被认领,想保留 URL / 评论 / 观看数:
- 进 `/copyright` 用 "替换歌曲"(YouTube 自动处理,几分钟到几小时生
  效),原 URL 不变
- 但 Shorts 如果已经因为 >60s + 认领被禁播,在替换歌曲生效前都是禁播状
  态。所以**事前 SHORTS=1 截到 58s 才是根本解**

---

## 📋 统一视频说明(通用文案 · 直接复制)

> **今后所有 YouTube 视频默认用这一段**(不绑定具体机型,介绍公司+产品全线)。
> 特定机型的视频如需更精准描述,可在这段前面再加 1-2 句该机型特点;但默认这段即可。

```
DEYU — professional manufacturer of shoe sole injection moulding machines, based in Wenzhou, China. Since 2009 we have supplied PVC, TPR, TPU and TR sole production machines to footwear factories in 30+ countries.

🔹 Single & dual color sole injection machines
🔹 Rotary disc & slide-type configurations (12 / 16 / 20 / 24 stations)
🔹 Materials: PVC · TPR · TPU · TR
🔹 Servo energy-saving · CE & ISO 9001

Whether you produce slippers, sandals, sports shoes or work boots, DEYU can match a machine to your output and budget.

👉 Explore all machines: https://deyusolemachine.com/products
💬 WhatsApp: +86 136 1577 8781

#shoemachinery #soleinjection #footwearmachine #DEYU #shoemaking
```

**上传每个视频时记得:**
- 观众设置选 **"不,内容不是面向儿童的"**
- 竖屏(Shorts)视频标题末尾加 `#Shorts`

---

## 🎯 双轨上传策略

19 个视频按比例分两路上传:

### A. 9 个横屏 → YouTube 普通视频 + Facebook 视频帖

| 文件 | 分辨率 |
|---|---|
| `1102_TPU.mp4` | 1280×720 |
| `1106_autoopen.mp4` | 1920×1080 |
| `1110_bottomsole.mp4` | 1920×1080 |
| `1124_blowPVCsole.mp4` | 960×544 |
| `2212_TPU.mp4` | 1920×1080 |
| `2212_bottomsole.mp4` | 1920×1080 |
| `2220_birkensole.mp4` | 1920×1080 |
| `3324.mp4` | 1280×720 |
| `1108_autoopen.mov` | 1920×1080 |

- 上传到 YouTube Studio 默认视频流程
- 标题模板:`<Model> <Material> Sole Injection Moulding Machine | <Feature> | DEYU`
- 上传后给我标准 11 字符 ID,我填到 `products.ts` 的 **`youtubeId`** 字段
- 这些是 SEO 主力,Google "DY-XXXX demo" 搜索会命中

### B. 10 个竖屏 → YouTube Shorts + Facebook Reels

| 文件 | 分辨率 | 时长 |
|---|---|---|
| `1106-H_dumbbell.mp4` | 540×960 | 43s |
| `1108_africa.mp4` | 720×1280 | 73s |
| `1124_slipper.mp4` | 720×1280 | 16s |
| `2220_TPU_1080P.mp4` | 1080×1920 | – |
| `2224_crocs.mp4` | 368×656 | 67s |
| `simple mould open.mp4` | 544×960 | 32s |
| `1106_blowPVC.mov` | 1080×1906 | 46s |
| `2102_TPU.mov` | 1080×1920 | 70s |
| `DY150.mov` | 1080×1920 | – |
| `2220_20stations.MOV` | 1080×1920 (旋转) | 52s |

- 上传时 YouTube **自动识别为 Shorts**(竖屏 + ≤3 分钟)
- 标题末尾加 `#Shorts` 强化分类
- 描述里加产品页链接引流(`https://deyusolemachine.com/products/<slug>`)
- 上传后给我 Shorts 的 11 字符 ID,我填到 **`youtubeShortsId`** 字段
- 这些是流量主力,新频道算法重点推

### 优势对比

| 视频类型 | YouTube 算法 | SEO 抓取 | 嵌入产品页 |
|---|---|---|---|
| 横屏常规 | 长尾搜索友好 | ✅ 抓 | 16:9 主播放器(已实现) |
| 竖屏 Shorts | 新频道推送力度大 | ⚠️ 弱(Shorts 不被 Google 主搜抓) | 9:16 "Quick Demo" 区(已实现) |

两种格式都上传 = **两种流量同时拿到**。

### 同步到 Facebook

- 横屏 → Facebook 视频帖(同标题/描述)
- 竖屏 → Facebook Reels(同 hashtag)
- 同一份素材双平台 = 一次素材二次曝光

---

## 📦 已上传 YouTube ID 映射(2026-05-27 抓取)

| 视频文件 | YouTube ID | 产品 slug | 类型 |
|---|---|---|---|
| 1102 TPU | `RGE2Fic2bno` | two-station-slide-sole-machine | 横屏 |
| 1106 autoopen | `ydUyUriENNc` | pvc-six-station-rotary-machine | 横屏 |
| 1106 blowPVC (mov) | `YBxiP73CjEY` | pvc-six-station-rotary-machine | Shorts |
| 1106-H dumbbell | `RURcmgsGn1c` | industrial-parts-six-station-machine | Shorts |
| 1108 autoopen (mov) | `W0pUaiwUrsE` | (DY-1108, 无专属页) | 横屏 |
| 1108 africa | `vkDSJiMSumQ` | (DY-1108, 无专属页) | Shorts |
| 1110 bottomsole | `KTeKE31yU0U` | (DY-1110, 无专属页) | 横屏 |
| 1124 blowPVCsole | `lrGZTA-dOwc` | air-blowing-injection-machine | 横屏 |
| 1124 slipper | `rS8-gVn3_4E` | air-blowing-injection-machine | Shorts |
| 2102 TPU (mov) | `evtp7L0z_vE` | (DY-2102, 无专属页) | Shorts |
| 2212 TPU | `CXLqefs4EAk` | tpu-tr-dual-color-12-station | 横屏 |
| 2212 bottomsole | `XbzQjkF_T1g` | tpu-tr-dual-color-12-station (备用) | 横屏 |
| 2220 TPU 1080P | `kNTBYCSFngs` | dual-color-rotary-sole-machine | Shorts |
| 2220 (.MOV) | `TGtQfx-byvs` | dual-color-rotary-sole-machine (备用) | Shorts |
| 2220 birkensole | `uNTZLSCJAko` | dual-color-rotary-sole-machine | 横屏 |
| 2224 crocs | `3P8OJKui39s` | dual-color-air-blowing-machine | Shorts |
| 3324 | `mercLlSpiJI` | three-color-three-head-flexible-machine | 横屏 |
| DY150 | `7cMchkNhq4U` | tpu-tr-vertical-injection-machine | Shorts |
| simple mould open | `hyh6-x8BsC0` | (通用,不绑产品页) | Shorts |

**已集成到 products.ts 的 9 个产品**:
- DY-1102 / DY-1106 / DY-1106-S / DY-1124B / DY-2212TPU/TR / DY-2220A / DY-2224B / DY-150 / DY-3324A

**未集成**(原因):
- DY-1108 / DY-1110 / DY-2102 — 没对应产品页
- simple mould open — 通用机构演示,不绑产品
- 1106 blowPVC 已分配给 DY-1106 的 Shorts 位
- 2212 bottomsole + 2220 (.MOV) + 2220 (.MOV rotated) — 已有同产品的优选视频,这些是备用

**状态**:全部 19 个视频在 YouTube 为**草稿/私密**。Mark 审核后改公开(`https://studio.youtube.com/channel/UCXL5jRUy1O-VzuQyLW_TNTw/videos`)产品页视频立即生效。

---

## 📋 上传流程（每个视频)

1. [YouTube Studio](https://studio.youtube.com) → **创建** → **上传视频**
2. 拖入 NAS 的视频文件
3. **标题**：直接复制下面的 ⌨ Title
4. **描述**：直接复制下面的 ⌨ Description
5. **缩略图**：用 Supabase 上对应产品图（链接在每条最下方）— 你下载后上传
6. **播放列表**: 加入对应分类列表(`Single Color` / `Dual Color` / `Multi Color` / `Air Blowing` / `Industrial Parts`)
7. **受众**: 不专门针对儿童
8. **可见性**：⚠️ **Private (私密)**
9. **发布**
10. 视频上传完 → 你回放检查 → OK 后改成 **Public** → 把 URL 里 `?v=` 后那串 ID 发我

---

## ⚙️ 频道层面一次性设置 (Phase A)

| 项 | 推荐值 |
|---|---|
| 频道名 | `DEYU Machinery` |
| 用户名 (@handle) | `@deyumachinery` |
| 频道描述 (About) | 见下方频道描述模板 |
| 关键词 (Channel Keywords) | `shoe sole machine, sole injection machine, PVC TPU TR sole moulding, shoe machinery manufacturer, footwear machine, rotary disc sole machine` |
| 频道头像 (800×800) | 用 logo11.png 居中放在白底圆形 |
| 频道 Banner (2560×1440, 安全区 1546×423) | 蓝底 + Logo + 标语 `Shoe Sole Injection Moulding Machines · Made in Wenzhou, China · Exported to 30+ Countries` |
| 链接 | 官网 https://deyusolemachine.com + WhatsApp https://wa.me/8613615778781 |
| 国家 | China |
| 联系邮箱 | info@wzdeyu.cn |

### 频道描述模板（复制到 About）

```
DEYU (Wenzhou Deyu Machinery Co., Ltd) is a leading manufacturer of shoe sole injection moulding machines based in Wenzhou, China — the footwear machinery capital of China.

Since 2009, we have specialized in:
🔹 Single-color, dual-color and multi-color sole injection machines
🔹 PVC, TPR, TPU and rubber sole production
🔹 Air-blowing slipper & sandal machines
🔹 Industrial moulding (dumbbells, weight plates, car cushions)

ISO 9001 & CE certified. Exporting to 30+ countries across South America, Middle East, Africa, South Asia and Southeast Asia.

This channel features:
✅ Live machine operation footage
✅ Production line demonstrations
✅ Real customer sites (Africa, Brazil, India, Turkey, etc.)
✅ Tutorials on sole production

Website: https://deyusolemachine.com
WhatsApp / Telegram: +86 136 1577 8781
Email: info@wzdeyu.cn
```

---

# 🎬 19 视频上传清单

> 每条 entry 给出：📁 文件名 | 🔗 对应产品 | 🖼 缩略图 URL | ⌨ Title | ⌨ Description | 🏷 Tags

---

## 1️⃣ 1102_single color_2 stations_TPU.mp4

🔗 **对应产品**: [DY-1102 — Two-Station Slide Sole Machine](https://deyusolemachine.com/products/two-station-slide-sole-machine)
🖼 **缩略图**: https://lrlqtkaxakuobqrsotjl.supabase.co/storage/v1/object/public/product-images/dy-1102.jpg

⌨ **Title**:
```
DY-1102 Single Color TPU Sole Injection Moulding Machine | 2 Station Slide Type | DEYU
```

⌨ **Description**:
```
Watch the DY-1102 2-station slide-type single-color sole injection machine running TPU material at the DEYU factory in Wenzhou, China.

🔹 Model: DY-1102
🔹 Stations: 2 (slide type)
🔹 Material: PVC / TPR / TPU
🔹 Application: Flat soles, casual footwear, OEM production
🔹 Power: Low energy consumption
🔹 Cert: CE & ISO 9001

This entry-level slide-type machine is ideal for small to medium shoe factories that need reliable single-color sole production without the complexity of a rotary line.

👉 Full specs & enquiry: https://deyusolemachine.com/products/two-station-slide-sole-machine
💬 WhatsApp: +86 136 1577 8781
✉️ Email: info@wzdeyu.cn

#shoesolemachine #soleinjectionmachine #TPUsole #DEYU #shoemachinery
```

🏷 **Tags**: `shoe sole machine, TPU sole, 2 station slide, sole injection moulding, DY-1102, DEYU machinery, shoe machine manufacturer, single color sole, Wenzhou shoe machine, footwear machinery`

---

## 2️⃣ 1106-H_single color_6stations_dumbbel.mp4

🔗 **对应产品**: [DY-1106-S — Industrial Parts 6-Station Machine](https://deyusolemachine.com/products/industrial-parts-six-station-machine)
🖼 **缩略图**: https://lrlqtkaxakuobqrsotjl.supabase.co/storage/v1/object/public/product-images/dy-1106h.jpg

⌨ **Title**:
```
DY-1106H 6-Station Rotary Machine for Dumbbell & Weight Plate Production | DEYU Industrial
```

⌨ **Description**:
```
Watch the DY-1106-H 6-station rotary injection machine producing rubber/PVC-coated dumbbells in the DEYU factory.

🔹 Model: DY-1106-H (heavy-duty variant)
🔹 Stations: 6 rotary disc
🔹 Application: Dumbbells, barbell weight plates, automotive seat cushions
🔹 Material: PVC / TPR / TPU / rubber
🔹 Heavy-duty mould clamping system
🔹 Cert: CE certified

Adapted from our standard 6-station sole machine, the DY-1106-H is purpose-built for industrial parts requiring high clamping force. Popular with fitness equipment manufacturers worldwide.

👉 Full specs: https://deyusolemachine.com/products/industrial-parts-six-station-machine
💬 WhatsApp: +86 136 1577 8781

#dumbbellmachine #industrialinjection #rubbermoulding #weightplate #DEYU
```

🏷 **Tags**: `dumbbell production, weight plate machine, industrial injection, PVC moulding, 6 station rotary, DY-1106H, DEYU, rubber coated dumbbell, fitness equipment machine`

---

## 3️⃣ 1106_1color_6stations_autoopen_blowPVC.mov

🔗 **对应产品**: [DY-1106 — 6-Station Water-Cooling Rotary PVC Machine](https://deyusolemachine.com/products/pvc-six-station-rotary-machine)
🖼 **缩略图**: https://lrlqtkaxakuobqrsotjl.supabase.co/storage/v1/object/public/product-images/dy-1106.jpg

⌨ **Title**:
```
DY-1106 PVC Air-Blow Sole Injection — 6 Station Auto Mould Open | DEYU Wenzhou
```

⌨ **Description**:
```
DY-1106 6-station water-cooling rotary machine producing PVC air-blow soles with automatic mould opening at the DEYU factory in Wenzhou.

🔹 Model: DY-1106
🔹 Stations: 6 rotary disc
🔹 Material: PVC (air-blow variant)
🔹 Feature: Automatic mould opening, water-cooling system
🔹 Application: Lightweight soles, sample making, small-batch
🔹 Cert: CE & ISO 9001

The air-blow PVC technique creates lightweight, hollow-structure soles with significant material savings — ideal for slippers, sandals and low-cost casual footwear.

👉 Full specs: https://deyusolemachine.com/products/pvc-six-station-rotary-machine
💬 WhatsApp: +86 136 1577 8781

#PVCsole #airblowsole #6station #DEYU #shoemachinery
```

🏷 **Tags**: `PVC sole machine, air blow sole, 6 station rotary, DY-1106, auto mould open, lightweight sole, slipper machine, DEYU, sole injection`

---

## 4️⃣ 1106_single color_6stations_autoopen.mp4

🔗 **对应产品**: 同 #3 — DY-1106 (备用视频，建议作为播放列表里的第二条)
🖼 **缩略图**: 同上

⌨ **Title**:
```
DY-1106 Single Color 6-Station Rotary Sole Machine with Auto Mould Open | DEYU
```

⌨ **Description**:
```
DY-1106 6-station rotary disc sole injection machine running single-color PVC with automatic mould opening — demonstration video from DEYU factory.

🔹 Model: DY-1106
🔹 Stations: 6 rotary
🔹 Material: PVC / TPR / TPU
🔹 Cooling: Water-cooling system
🔹 Mould: Quick-change, auto open
🔹 Cert: CE & ISO 9001

Perfect for sample making, small-batch production, and mould testing. Compact footprint suits factories where floor space is limited.

👉 Full specs: https://deyusolemachine.com/products/pvc-six-station-rotary-machine
💬 WhatsApp: +86 136 1577 8781

#shoesolemachine #6station #PVCsole #DEYU
```

🏷 **Tags**: `6 station rotary, sole injection moulding, PVC TPR TPU, DY-1106, auto mould open, DEYU shoe machinery, sample production`

---

## 5️⃣ 1108_1 color_8stations_autoopen.mov

⚠ DY-1108 不在当前 products.ts 里 — 这是 8 工位变体，建议作为**通用频道展示**视频（不绑特定产品页）

🖼 **缩略图建议**: 用 dy-1106.jpg 临时（同系列外形相近）

⌨ **Title**:
```
DY-1108 8-Station Rotary Sole Injection Machine with Auto Mould Open | DEYU Demo
```

⌨ **Description**:
```
DY-1108 8-station rotary disc sole injection machine demonstration — single color, automatic mould opening, suitable for medium-volume sole production.

🔹 Model: DY-1108
🔹 Stations: 8 rotary
🔹 Material: PVC / TPR / TPU
🔹 Feature: Auto mould opening, water-cooling
🔹 Cert: CE & ISO 9001

The DY-1108 sits between our DY-1106 (6-station) and DY-1110 (10-station) in our single-color rotary range — offering a balance of output and footprint. Contact DEYU for full specifications.

👉 Browse all single-color machines: https://deyusolemachine.com/products?category=single-color
💬 WhatsApp: +86 136 1577 8781
✉️ info@wzdeyu.cn

#8station #soleinjection #DEYU #shoemachinery
```

🏷 **Tags**: `8 station rotary, sole machine, DY-1108, auto mould open, single color sole, DEYU, shoe machinery, sole injection moulding`

---

## 6️⃣ 1108_1 color_8stations_autoopen_africa.mp4

⚠ 同 #5,但是**非洲客户现场实拍**(标题加 "Customer Site" 增加信任)
🖼 **缩略图建议**: 用 dy-1106.jpg

⌨ **Title**:
```
DY-1108 8-Station Sole Machine in Production — African Customer Site | DEYU
```

⌨ **Description**:
```
DEYU DY-1108 8-station sole injection machine running at a customer factory in Africa. Single-color rotary disc with automatic mould opening.

🔹 Model: DY-1108
🔹 Stations: 8 rotary
🔹 Customer location: Africa (factory floor footage)
🔹 Material: PVC / TPR
🔹 Auto mould opening + water cooling

DEYU has installed machines across Nigeria, Egypt, Morocco and other African markets. This footage was taken at an active production line operating in daily shifts.

👉 Discover our export track record: https://deyusolemachine.com/cases
💬 WhatsApp: +86 136 1577 8781

#africashoefactory #soleinjection #DY1108 #DEYU
```

🏷 **Tags**: `Africa shoe factory, sole machine Africa, 8 station rotary, customer site, DEYU export, shoe machinery Africa, sole injection`

---

## 7️⃣ 1110_1 color_10stations_bottomsole.mp4

⚠ DY-1110 不在 products.ts (10 工位变体)
🖼 **缩略图建议**: 用 dy-1120.jpg

⌨ **Title**:
```
DY-1110 10-Station Single Color Bottom Sole Injection Machine | DEYU Wenzhou
```

⌨ **Description**:
```
DEYU DY-1110 10-station rotary disc machine producing bottom soles in single color — high-output configuration for medium-large shoe factories.

🔹 Model: DY-1110
🔹 Stations: 10 rotary
🔹 Application: Bottom soles for sports/casual shoes
🔹 Material: PVC / TPR / TPU
🔹 Servo energy-saving option available

The 10-station configuration delivers ~50% higher output than 6-station while keeping a manageable footprint. Often chosen by factories scaling from sampling to series production.

👉 Browse our rotary range: https://deyusolemachine.com/products?category=single-color
💬 WhatsApp: +86 136 1577 8781

#bottomsole #10station #soleinjection #DEYU
```

🏷 **Tags**: `10 station rotary, bottom sole machine, DY-1110, sole injection moulding, single color, high output sole machine, DEYU`

---

## 8️⃣ 1124_1 color_24stations_blowPVCsole.mp4

🔗 **对应产品**: [DY-1124B — Air-Blowing Injection Machine](https://deyusolemachine.com/products/air-blowing-injection-machine)
🖼 **缩略图**: https://lrlqtkaxakuobqrsotjl.supabase.co/storage/v1/object/public/product-images/dy-1124.jpg

⌨ **Title**:
```
DY-1124 24-Station PVC Air-Blow Sole Machine — Lightweight Slipper Production | DEYU
```

⌨ **Description**:
```
DY-1124 high-output 24-station rotary disc machine producing lightweight PVC air-blow soles for slippers and sandals at the DEYU factory.

🔹 Model: DY-1124B
🔹 Stations: 24 rotary
🔹 Type: Air-blowing injection
🔹 Material: PVC (lightweight foam structure)
🔹 Output: High-volume slipper / sandal production
🔹 Material savings: Significant vs. solid sole

The air-blowing technique injects air during the moulding cycle to create hollow-structure soles — reducing material cost while keeping comfort. Essential for low-cost slipper and sandal lines.

👉 Full specs: https://deyusolemachine.com/products/air-blowing-injection-machine
💬 WhatsApp: +86 136 1577 8781

#airblowsole #slippermachine #PVCsole #24station #DEYU
```

🏷 **Tags**: `air blow sole, PVC slipper machine, 24 station rotary, DY-1124, sole injection, lightweight sole, slipper production, DEYU`

---

## 9️⃣ 1124_single color_24stations_slipper.mp4

🔗 **对应产品**: 同 #8 — DY-1124B (备用视频，slipper 实拍)
🖼 **缩略图**: 同上

⌨ **Title**:
```
DY-1124 Air-Blow Slipper Sole Production — 24 Stations in Action | DEYU
```

⌨ **Description**:
```
Live footage of DEYU DY-1124 24-station air-blow injection machine producing slipper soles in single color. The rotating disc allows continuous demoulding and production.

🔹 Model: DY-1124B
🔹 Stations: 24 rotary
🔹 Cycle: Continuous slipper sole demoulding
🔹 Material: PVC air-blow
🔹 Ideal for: Beach slippers, indoor slippers, sandals

👉 Full specs: https://deyusolemachine.com/products/air-blowing-injection-machine
💬 WhatsApp: +86 136 1577 8781

#slippersole #airblow #DY1124 #DEYU #shoemachinery
```

🏷 **Tags**: `slipper sole production, air blow sole, PVC slipper, 24 station rotary, DY-1124, DEYU, shoe machinery, sole injection`

---

## 🔟 2102_2 color_2stations_TPU.mov

⚠ DY-2102 不在 products.ts — 2 工位双色 TPU 变体
🖼 **缩略图建议**: 用 dy-1102.jpg (单色版本) 或 dy-2212t.jpg (双色)

⌨ **Title**:
```
DY-2102 Two Color TPU Sole Injection Machine — 2 Station Compact Design | DEYU
```

⌨ **Description**:
```
DEYU DY-2102 2-station two-color TPU sole injection machine — compact dual-color design suitable for small-batch premium sole production and prototyping.

🔹 Model: DY-2102
🔹 Stations: 2 (slide type)
🔹 Colors: 2 (dual-color)
🔹 Material: TPU (high-performance)
🔹 Application: Sample making, premium TPU soles
🔹 Compact footprint

Perfect for shoe brands developing two-color TPU sole samples or running small-batch premium lines.

👉 Browse our dual-color range: https://deyusolemachine.com/products?category=dual-color
💬 WhatsApp: +86 136 1577 8781

#TPUsole #dualcolor #2stationslide #DEYU
```

🏷 **Tags**: `TPU sole machine, 2 color injection, 2 station slide, DY-2102, dual color sole, sample machine, DEYU`

---

## 1️⃣1️⃣ 2212_2 color_12stations_TPU.mp4

🔗 **对应产品**: [DY-2212TPU/TR — 12-Station Dual Color](https://deyusolemachine.com/products/tpu-tr-dual-color-12-station)
🖼 **缩略图**: https://lrlqtkaxakuobqrsotjl.supabase.co/storage/v1/object/public/product-images/dy-2212t.jpg

⌨ **Title**:
```
DY-2212 12-Station TPU/TR Two Color Rotary Sole Machine | DEYU Wenzhou
```

⌨ **Description**:
```
DY-2212TPU/TR 12-station rotary disc machine producing dual-color TPU/TR soles at the DEYU factory in Wenzhou, China.

🔹 Model: DY-2212TPU/TR
🔹 Stations: 12 rotary
🔹 Colors: 2
🔹 Material: TPU / TR
🔹 Cooling: Water-cooling system
🔹 Servo drive: Energy-saving
🔹 Cert: CE & ISO 9001

Optimized for technical TPU/TR dual-color soles common in running shoes, trail shoes, and high-performance casual footwear.

👉 Full specs: https://deyusolemachine.com/products/tpu-tr-dual-color-12-station
💬 WhatsApp: +86 136 1577 8781

#TPUsole #dualcolor #12station #DY2212 #DEYU
```

🏷 **Tags**: `TPU sole machine, TR sole, 2 color injection, 12 station rotary, DY-2212, dual color sole, running shoe sole, DEYU`

---

## 1️⃣2️⃣ 2212_2 color_12stations_bottomsole.mp4

🔗 **对应产品**: 同 #11 — DY-2212TPU/TR (备用，实拍 bottom sole)
🖼 **缩略图**: 同上

⌨ **Title**:
```
DY-2212 Two Color Bottom Sole Production — 12 Station Rotary | DEYU
```

⌨ **Description**:
```
DEYU DY-2212 12-station rotary disc producing dual-color bottom soles. Watch the rotary motion and dual injection heads alternating between color stations.

🔹 Model: DY-2212TPU/TR
🔹 Stations: 12 rotary
🔹 Output: ~60-80 pairs/hour (depending on mould cavities)
🔹 Material: TPU / TR
🔹 Application: Bottom soles, sports footwear

👉 Full specs: https://deyusolemachine.com/products/tpu-tr-dual-color-12-station
💬 WhatsApp: +86 136 1577 8781

#bottomsole #dualcolor #12station #DEYU #shoemachinery
```

🏷 **Tags**: `bottom sole production, 2 color sole, 12 station rotary, DY-2212, TPU TR sole, DEYU`

---

## 1️⃣3️⃣ 2220_2 color_20stations_TPU_1080P.mp4

🔗 **对应产品**: [DY-2220A — Dual Color Rotary](https://deyusolemachine.com/products/dual-color-rotary-sole-machine) (或 DY-2216TR/TPU)
🖼 **缩略图**: https://lrlqtkaxakuobqrsotjl.supabase.co/storage/v1/object/public/product-images/dy-2220.jpg

⌨ **Title**:
```
DY-2220 20-Station Two Color TPU Rotary Sole Machine [1080P HD] | DEYU
```

⌨ **Description**:
```
🎬 1080P high-definition footage of the DEYU DY-2220 20-station rotary disc dual-color TPU sole injection moulding machine in full production.

🔹 Model: DY-2220A
🔹 Stations: 20 rotary
🔹 Colors: 2 (dual injection heads)
🔹 Material: TPU
🔹 Production: 60-80 pairs/hour
🔹 Power: ~35kW
🔹 Cert: CE & ISO 9001

The 20-station configuration delivers premium output for dual-color TPU sole production — favored by sports shoe brands and high-volume OEMs.

👉 Full specs: https://deyusolemachine.com/products/dual-color-rotary-sole-machine
💬 WhatsApp: +86 136 1577 8781

#TPUsole #dualcolor #20station #DY2220 #DEYU #1080p
```

🏷 **Tags**: `TPU sole machine, 2 color injection, 20 station rotary, DY-2220, dual color sole, sports shoe sole, DEYU, premium sole machine`

---

## 1️⃣4️⃣ 2220_2color_20stations_.MOV

🔗 **对应产品**: 同 #13 — DY-2220A (备用)
🖼 **缩略图**: 同上

⌨ **Title**:
```
DY-2220 20-Station Two Color Sole Injection Moulding Machine | DEYU Live
```

⌨ **Description**:
```
DEYU DY-2220 20-station dual-color rotary sole injection machine running live. Two injection heads, water-cooling mould system, servo energy-saving drive.

🔹 Model: DY-2220A
🔹 Stations: 20 rotary
🔹 Colors: 2 (PVC / TPR / TPU)
🔹 Output: 60-80 pairs/hour

👉 Full specs: https://deyusolemachine.com/products/dual-color-rotary-sole-machine
💬 WhatsApp: +86 136 1577 8781

#dualcolor #soleinjection #DY2220 #DEYU
```

🏷 **Tags**: `2 color sole, 20 station rotary, DY-2220, dual color sole machine, DEYU, sole injection moulding`

---

## 1️⃣5️⃣ 2220_2color_20stations_birkensole.mp4

🔗 **对应产品**: 同 #13 — DY-2220A (实拍 Birkenstock 风格凉鞋底)
🖼 **缩略图**: 同上

⌨ **Title**:
```
DY-2220 Dual Color Sandal Sole Production — Birkenstock-Style Soles | DEYU
```

⌨ **Description**:
```
DEYU DY-2220 20-station dual-color rotary machine producing Birkenstock-style cork/contoured sandal soles. Two-tone design, premium aesthetic, high-volume output.

🔹 Model: DY-2220A
🔹 Stations: 20 rotary
🔹 Application: Premium sandal soles, two-tone fashion soles
🔹 Material: PVC / TPR / TPU
🔹 Output: 60-80 pairs/hour

If you produce Birkenstock-style sandals or any contoured two-tone sole, the DY-2220 is the right machine. Contact us for mould compatibility.

👉 Full specs: https://deyusolemachine.com/products/dual-color-rotary-sole-machine
💬 WhatsApp: +86 136 1577 8781

#sandalsole #birkenstock #dualcolor #DY2220 #DEYU
```

🏷 **Tags**: `Birkenstock sole, sandal sole machine, 2 color sole, 20 station rotary, DY-2220, dual color sandal, DEYU`

---

## 1️⃣6️⃣ 2224_2 color_24stations_crocs.mp4

🔗 **对应产品**: [DY-2224B — Dual Color Air-Blowing](https://deyusolemachine.com/products/dual-color-air-blowing-machine)
🖼 **缩略图**: https://lrlqtkaxakuobqrsotjl.supabase.co/storage/v1/object/public/product-images/dy-2220-s.jpg

⌨ **Title**:
```
DY-2224 24-Station Two Color Air-Blow Machine — Crocs-Style Sandal Production | DEYU
```

⌨ **Description**:
```
DEYU DY-2224 24-station dual-color air-blow injection machine producing Crocs-style sandals with two-color injection. Lightweight EVA/PVC structure.

🔹 Model: DY-2224B
🔹 Stations: 24 rotary
🔹 Type: Air-blowing (lightweight)
🔹 Colors: 2 (dual injection heads)
🔹 Application: Crocs-style sandals, fashion slippers, two-tone beach footwear
🔹 Cert: CE & ISO 9001

The 24-station air-blow dual-color combo is ideal for casual sandal brands wanting two-tone designs without sacrificing the lightweight comfort of air-blow moulding.

👉 Full specs: https://deyusolemachine.com/products/dual-color-air-blowing-machine
💬 WhatsApp: +86 136 1577 8781

#crocsproduction #sandalsole #dualcolor #airblow #DY2224 #DEYU
```

🏷 **Tags**: `Crocs sole machine, sandal production, 2 color air blow, 24 station rotary, DY-2224, dual color sandal, DEYU`

---

## 1️⃣7️⃣ 3324_3 color_24stations.mp4

⚠ DY-3324 不在 products.ts — 3 色 24 工位变体（功能上接近 DY-3124C 或更大）
🖼 **缩略图建议**: 用 dy-3124.jpg

⌨ **Title**:
```
DY-3324 Three Color 24-Station Rotary Sole Injection Machine | DEYU Multi-Color
```

⌨ **Description**:
```
DEYU DY-3324 high-output 24-station rotary disc machine with THREE-color injection capability. Create complex multi-color sole designs at scale.

🔹 Model: DY-3324
🔹 Stations: 24 rotary
🔹 Colors: 3 (multi-color injection)
🔹 Material: PVC / TPR / TPU
🔹 Application: Premium fashion soles, designer footwear, multi-color sport soles
🔹 Cert: CE & ISO 9001

This is one of our largest multi-color configurations — capable of producing complex three-color sole patterns at high volumes for brand-name OEM contracts.

👉 Browse our multi-color range: https://deyusolemachine.com/products?category=multi-color
💬 WhatsApp: +86 136 1577 8781

#multicolor #3color #24station #DY3324 #DEYU
```

🏷 **Tags**: `3 color sole, multi color injection, 24 station rotary, DY-3324, fashion sole machine, designer sole, DEYU`

---

## 1️⃣8️⃣ DY150_2 color_2stations_.mov

🔗 **对应产品**: [DY-150 — Vertical TR/TPU](https://deyusolemachine.com/products/tpu-tr-vertical-injection-machine)
🖼 **缩略图**: https://lrlqtkaxakuobqrsotjl.supabase.co/storage/v1/object/public/product-images/dy-150.jpg

⌨ **Title**:
```
DY-150 Vertical Two Color TR/TPU Sole Injection Machine — 2 Stations | DEYU
```

⌨ **Description**:
```
DEYU DY-150 vertical two-color TR/TPU sole injection machine in operation. Compact vertical layout, dual-color capability, perfect for small factories and sample production.

🔹 Model: DY-150
🔹 Stations: 2 (vertical)
🔹 Layout: Vertical (space-saving)
🔹 Colors: 1-2
🔹 Material: TR / TPU
🔹 Application: Small production runs, TR/TPU sample making
🔹 Easy operation, low maintenance

The vertical DY-150 takes ~50% less floor space than horizontal equivalents — ideal for factories where production floor is tight.

👉 Full specs: https://deyusolemachine.com/products/tpu-tr-vertical-injection-machine
💬 WhatsApp: +86 136 1577 8781

#verticalmachine #TPUsole #TRsole #DY150 #DEYU
```

🏷 **Tags**: `vertical sole machine, TR TPU sole, 2 color sole, DY-150, compact sole machine, vertical injection, DEYU`

---

## 1️⃣9️⃣ simple mould open.mp4

⚠ 这看起来是**通用机构演示**视频(模具打开动作),建议作为**频道展示**或**技术解说**用途

🖼 **缩略图建议**: 用展会图 exhibition-07.jpg(客户操作模具的那张)

⌨ **Title**:
```
How a Shoe Sole Mould Opens — Auto Mould Opening Mechanism Explained | DEYU
```

⌨ **Description**:
```
Close-up demonstration of DEYU's automatic mould opening mechanism. Watch how the sole mould releases the finished part cleanly without operator intervention — a key feature across our rotary disc and slide machines.

🔹 Topic: Auto mould opening mechanism
🔹 Applies to: DY-1102H, DY-1106, DY-1108, DY-2220 and other DEYU models with auto-open
🔹 Benefit: Faster cycle time + reduced operator labor + cleaner demoulding

Auto mould opening is what makes high-station rotary machines viable at production scale. Manual demoulding at 20+ stations would require too many operators.

👉 See machines with this feature: https://deyusolemachine.com/products
💬 WhatsApp: +86 136 1577 8781

#shoemould #automouldopen #soleinjection #howitworks #DEYU
```

🏷 **Tags**: `shoe mould opening, auto mould open, sole injection mechanism, shoe machinery tutorial, how it works, DEYU, mould demoulding`

---

# ✅ 上传后流程

每上传一个并审核通过后,把下面这条填好发给我:

```
视频文件: 1102_single color_2 stations_TPU.mp4
YouTube 视频 ID: dQw4w9WgXcQ        ← 这是从 https://www.youtube.com/watch?v=dQw4w9WgXcQ 复制的
对应产品 slug: two-station-slide-sole-machine
```

或者更简单:**把每个视频的 YouTube URL 列一份发我**,我自己拆解 ID + 匹配产品。

我会:
1. 把 `videoUrl: 'https://www.youtube.com/embed/<VIDEO_ID>'` 加到 products.ts 对应产品
2. 产品详情页 "Watch It in Action" 区块自动出现视频
3. About 页可选加 "Latest from Our Channel" 嵌入最近视频

---

# 📦 播放列表建议(在 YouTube Studio 里创建)

按产品类型建播放列表,自动归类:

| 播放列表名 | 包含视频 # |
|---|---|
| Single Color Sole Machines | 1, 3, 4, 5, 6, 7 |
| Dual Color Sole Machines | 10, 11, 12, 13, 14, 15, 18 |
| Multi Color Sole Machines | 17 |
| Air-Blow Slipper/Sandal Machines | 8, 9, 16 |
| Industrial Parts (Dumbbells & More) | 2 |
| How It Works (Tutorials) | 19 |

---

# 🎯 上传后建议优先做的事

1. **置顶视频**: 选第 13 个(DY-2220 1080P HD) 作为频道置顶 — 画质最高、最能体现实力
2. **Featured Channel Trailer**: 用第 19 个(简单模具打开) 作为给未订阅用户看的频道介绍
3. **每个视频加 End Screen**: 引导观看下一个视频 + 订阅按钮
4. **Cards 卡片**: 视频中段插入产品官网链接卡片
