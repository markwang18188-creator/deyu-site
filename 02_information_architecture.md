# DEYU 独立站 · 信息架构

## 一、URL 结构总览

```
deyusolemachine.com (英文,默认)
│
├── /                                            首页
│
├── /products/                                   产品总览
│   ├── /tpu-dual-color-injection-machine        产品详情(关键词 slug)
│   ├── /pvc-single-color-machine
│   ├── /automatic-mold-opening-machine
│   ├── /multi-color-rotary-machine
│   ├── /air-blowing-injection-machine           吹气类
│   ├── /industrial-parts-machines               工业件(新探索)
│   └── /[model-slug]                            按型号访问,例: /dy-2216tr-tpu
│
├── /equipment/                                  配套设备
│   └── /[equipment-slug]                        例: /hopper-dryer
│
├── /cases/                                      客户案例(Phase 6 才做)
│   └── /[case-slug]
│
├── /blog/                                       博客 SEO(Phase 6+)
│   └── /[post-slug]
│
├── /about/                                      关于我们
├── /contact/                                    联系页 + 询盘表单
├── /thank-you/                                  询盘成功跳转
│
└── /api/                                        API 路由
    └── /lead                                    询盘提交 endpoint
```

## 二、多语种结构

英文是默认语言(无前缀)。其他语言用子目录:

```
deyusolemachine.com/                  英文默认
deyusolemachine.com/es/               西班牙语
deyusolemachine.com/pt/               葡萄牙语
deyusolemachine.com/tr/               土耳其语
deyusolemachine.com/ar/               阿拉伯语
```

所有页面在所有语言下都存在。例如:
- `deyusolemachine.com/products/tpu-dual-color-injection-machine`
- `deyusolemachine.com/es/products/tpu-dual-color-injection-machine`

注:URL slug 不翻译(保持英文 SEO 词),只翻译页面内容。

## 三、导航结构

### 主导航(顶部)

```
[DEYU Logo]   Products   Equipment   About   Contact   [Language ▼]   [WhatsApp]
```

Products 鼠标 hover 出大菜单(Mega Menu):

```
┌─────────────────────────────────────────────────────────┐
│ INJECTION MACHINES        │  AIR BLOWING                 │
│  · TPU Dual Color         │   · Single Color             │
│  · PVC Single Color       │   · Dual Color               │
│  · Multi Color Rotary     │   · Three Color Mixed        │
│  · Auto Mold Opening      │                              │
│                            │  INDUSTRIAL PARTS            │
│  ALL MODELS →             │   · Dumbbells / Plates       │
│                            │   · Car Seat Cushions       │
└─────────────────────────────────────────────────────────┘
```

### Footer

四列布局:

| Products | Company | Resources | Contact |
|---|---|---|---|
| All Machines | About Us | Catalog Download | WhatsApp: +86-13615778781 |
| Equipment | Certifications | Blog (Coming Soon) | Email: [email] |
| Industrial Parts | Markets Served | Privacy Policy | Address: Wenzhou, China |
| New Models | History | Terms | [Social Icons] |

底部一行:`© 2026 Wenzhou Deyu Machinery Co., Ltd. All rights reserved. | wzdeyu.cn (Chinese)`

## 四、页面布局规范

### 首页(/)

```
┌──────────────────────────────────────────────────────┐
│  [Nav Bar]                                            │
├──────────────────────────────────────────────────────┤
│                                                       │
│  HERO 区(60vh)                                        │
│  ┌──────────────────────────────────────────────┐   │
│  │  H1: Shoe Sole Injection Moulding Machines    │   │
│  │  H2: Made in Wenzhou China · 15+ Years        │   │
│  │       ISO9001 + CE Certified                  │   │
│  │  [Get Quote] [Download Catalog]                │   │
│  └──────────────────────────────────────────────┘   │
│  (背景:工厂实景图,初版用静态图,后期接电饭锅视频)  │
│                                                       │
├──────────────────────────────────────────────────────┤
│  信任标志条                                            │
│  [ISO9001]  [CE]  [15+ Years]  [15 Countries Served] │
├──────────────────────────────────────────────────────┤
│  产品分类卡片(4 列 / 移动端 1 列)                     │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐       │
│  │TPU Dual│ │PVC     │ │Multi   │ │Air     │       │
│  │Color   │ │Single  │ │Color   │ │Blowing │       │
│  │        │ │Color   │ │Rotary  │ │        │       │
│  └────────┘ └────────┘ └────────┘ └────────┘       │
├──────────────────────────────────────────────────────┤
│  Why DEYU(4 个优势)                                   │
│  · TPU Replaces Rubber                                │
│  · Turnkey Factory Solutions                         │
│  · 15 Years 15 Countries                             │
│  · ISO + CE Certified                                │
├──────────────────────────────────────────────────────┤
│  全球客户地图                                          │
│  [世界地图 SVG,标记 15 个国家]                       │
├──────────────────────────────────────────────────────┤
│  Latest from Blog(占位,Phase 6 后接入)               │
├──────────────────────────────────────────────────────┤
│  CTA 区:Need a Custom Quote?                         │
│  [WhatsApp] [Contact Form]                            │
├──────────────────────────────────────────────────────┤
│  [Footer]                                             │
└──────────────────────────────────────────────────────┘
```

### 产品总览页(/products/)

```
[Page Title: All Products]
[Filter: All / Single Color / Dual Color / Multi Color / Air Blowing / Industrial]
[Grid:每个产品一张卡片,4 列网格]
[CTA: 不知道选哪个?Contact for Recommendation]
```

### 产品详情页(/products/[slug])

```
┌──────────────────────────────────────────────────────┐
│  [面包屑] Home > Products > TPU Dual Color           │
├──────────────────────────────────────────────────────┤
│  左侧(60%)               │  右侧(40%)                │
│  [主图 / 视频缩略图]     │  H1: TPU Dual Color ...   │
│  [图片轮播]              │  Model: DY-2216TR/TPU     │
│  (4-6 张产品图)         │                            │
│                          │  Key Features (3-5 个):   │
│                          │  · 16 stations            │
│                          │  · Production: 60-80      │
│                          │    pairs/hour             │
│                          │  · Servo energy saving 30%│
│                          │                            │
│                          │  [Contact for Quote] (橙色)│
│                          │  [Download Spec PDF]       │
├──────────────────────────────────────────────────────┤
│  Tabs: [Specifications] [Applications] [Videos]      │
│        [Related Cases] [FAQ]                          │
│                                                       │
│  Specifications:                                      │
│  [参数表格,从目录 PDF 抽出]                          │
├──────────────────────────────────────────────────────┤
│  适合什么样的工厂?                                     │
│  [文字 + 应用场景图片]                                │
├──────────────────────────────────────────────────────┤
│  视频演示(占位,后期由电饭锅产出)                     │
├──────────────────────────────────────────────────────┤
│  Related Models(同类型机器推荐)                       │
├──────────────────────────────────────────────────────┤
│  CTA 重复出现:Get Quote                                │
└──────────────────────────────────────────────────────┘
```

### 关于页(/about/)

```
- 标题区:About Wenzhou Deyu Machinery
- 工厂介绍:1996+ 创立(15 年以上,具体年份用户确认)
- 工厂实景图墙(8 张大图)
- 历史时间线
- 资质证书墙(ISO9001 + CE + 实用新型专利证书,从目录 PDF 抽)
- 全球客户地图(再次出现,加深印象)
- 团队照片(可选,可隐去人脸)
- CTA: Visit Our Factory(联系参观)
```

### 联系页(/contact/)

```
左侧:                                右侧:
联系信息                              询盘表单
- WhatsApp: +86-13615778781          - Name *
- Email: [email]                      - Email *
- Address: Wenzhou, China            - WhatsApp / Phone
- Working Hours                       - Country
                                      - Company name
[工厂地图(可选)]                    - Machine model interested (dropdown)
                                      - Production capacity requirement
                                      - Message *
                                      [Submit]
```

## 五、动态路由设计

### 产品页(双 URL 策略)

每个产品支持两个 URL,但 canonical 指向"关键词 slug":

```typescript
// data/products.ts
export const products = [
  {
    slug: 'tpu-dual-color-injection-machine',  // 主 SEO slug
    modelSlug: 'dy-2216tr-tpu',                // 型号 alias
    model: 'DY-2216TR/TPU',
    name: 'Full Automatic Rotary Type Two Color TPU Sole Injection Moulding Machine',
    // ...
  }
]

// app/products/[slug]/page.tsx
// 同时响应 /products/tpu-dual-color-injection-machine 和 /products/dy-2216tr-tpu
// 后者重定向到前者(SEO 集中)
```

## 六、SEO 重要标签

每个页面必须包含:

```typescript
export const metadata: Metadata = {
  title: '...',                        // 65 字符以内
  description: '...',                  // 155 字符以内
  alternates: {
    canonical: 'https://deyusolemachine.com/...',
    languages: {
      'en': 'https://deyusolemachine.com/...',
      'es': 'https://deyusolemachine.com/es/...',
      'pt': 'https://deyusolemachine.com/pt/...',
      'tr': 'https://deyusolemachine.com/tr/...',
      'ar': 'https://deyusolemachine.com/ar/...',
    },
  },
  openGraph: {
    title: '...',
    description: '...',
    images: ['/og-images/...'],
    type: 'website',
  },
}
```
