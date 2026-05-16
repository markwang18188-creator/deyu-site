# DEYU 独立站 · 设计系统

## 一、品牌资产

### Logo

沿用现有 DEYU logo(参考 `assets-ref/brand_logo.png`)。

特征:
- 主体:橙色 "DY" 字母 + 圆角矩形包围
- 蓝色 "鑫德裕" 中文(国际版可隐藏中文,只留 DEYU 英文)
- 副标:"SHOE-MAKING MACHINERY"

### 品牌色

```css
/* 主色 */
--deyu-blue:    #1e3a8a;    /* 深蓝,主品牌色,标题/按钮/导航 */
--deyu-blue-light: #3b82f6;  /* 浅蓝,链接/次级按钮 */
--deyu-orange:  #ea580c;    /* 橙色,强调色,CTA 按钮 / Logo */

/* 中性色 */
--neutral-900:  #0f172a;    /* 正文文字 */
--neutral-700:  #334155;    /* 次级文字 */
--neutral-500:  #64748b;    /* 弱文字 */
--neutral-200:  #e2e8f0;    /* 分割线 */
--neutral-100:  #f1f5f9;    /* 卡片背景 */
--white:        #ffffff;    /* 主背景 */

/* 状态色(用于表单提示) */
--success:      #16a34a;
--warning:      #ca8a04;
--error:        #dc2626;
```

### 配色应用规则

- **主背景**:白色 (#ffffff)
- **导航 / footer**:深蓝 (--deyu-blue)
- **CTA 按钮**(主):橙色 (--deyu-orange),例:"Request Quote"、"Contact Us"
- **CTA 按钮**(次):深蓝边框 (--deyu-blue),例:"Learn More"、"Download Catalog"
- **链接**:浅蓝 (--deyu-blue-light),hover 加下划线
- **信任标志条**(ISO / CE / 15 国服务):浅灰背景 (--neutral-100)

---

## 二、字体

### 主字体

- **西文(en/es/pt/tr)**:Inter(Google Fonts,通过 next/font 加载)
- **阿拉伯文**:Noto Sans Arabic(Google Fonts)
- **回退**:system-ui, -apple-system, sans-serif

### 字号尺度

```
text-xs:   12px  - 辅助信息、面包屑
text-sm:   14px  - 次级文字
text-base: 16px  - 正文(默认)
text-lg:   18px  - 强调正文
text-xl:   20px  - 卡片标题
text-2xl:  24px  - 小标题
text-3xl:  30px  - 区块标题
text-4xl:  36px  - 页面标题
text-5xl:  48px  - 首页 hero(桌面端)
text-6xl:  60px  - 首页 hero(大屏)
```

### 字重

- 400 - 正文
- 500 - 强调
- 600 - 小标题、按钮
- 700 - 区块标题、Hero 主标

---

## 三、间距系统

按 Tailwind 默认间距(4px 基础),关键节奏:

- **组件内 padding**:`p-4` (16px) ~ `p-6` (24px)
- **卡片间距**:`gap-6` (24px) ~ `gap-8` (32px)
- **段落间距**:`space-y-4` (16px) ~ `space-y-6` (24px)
- **区块间距**(section 之间):`py-16` (64px) ~ `py-24` (96px)

**铁律**:呼吸感优先,宁可空,不要塞。

---

## 四、组件风格

### Cards(产品卡片)

- 白色背景,1px 浅灰边框
- 圆角:`rounded-lg` (8px)
- Hover:轻微 shadow + 边框变深蓝
- 图片占满顶部 16:9
- 内容区 `p-6`,标题 + 描述 + "Learn More" 链接

### Buttons

- **Primary**:`bg-deyu-orange text-white px-6 py-3 rounded-md font-semibold hover:bg-orange-700`
- **Secondary**:`border-2 border-deyu-blue text-deyu-blue px-6 py-3 rounded-md font-semibold hover:bg-deyu-blue hover:text-white`
- **Tertiary**(纯链接):`text-deyu-blue-light underline hover:text-deyu-blue`

### Forms

- Input:`border border-neutral-300 rounded-md px-4 py-3 focus:ring-2 focus:ring-deyu-blue focus:border-transparent`
- Label:`text-sm font-medium text-neutral-700 mb-2`
- Error message:`text-sm text-error mt-1`

### Navigation

- 桌面:水平横排,深蓝背景白字
- 移动:汉堡菜单 → 全屏 drawer
- 当前页面下划线橙色

---

## 五、布局

### 容器宽度

- 主内容容器:`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- 窄内容容器(博客 / 长文):`max-w-3xl`
- 全宽 hero / banner:`w-full`

### 响应式断点

按 Tailwind 默认:
- `sm`: 640px (手机横屏)
- `md`: 768px (平板)
- `lg`: 1024px (桌面)
- `xl`: 1280px (大屏)

**移动优先**:所有样式先写移动端,然后用 sm: md: lg: 递进加宽屏样式。

---

## 六、图片处理

- 全部用 `next/image`
- 产品图:WebP 格式,1600px 宽度足够,自动响应式
- 工厂实景图:同上
- Logo:SVG
- 默认 `loading="lazy"`,首屏图片用 `priority`

---

## 七、shadcn/ui 配置

初始化命令:
```bash
npx shadcn-ui@latest init
```

选项:
- TypeScript: Yes
- Style: **Default**(不是 New York)
- Base color: **Slate**
- CSS variables: **Yes**

然后在 `globals.css` 把 primary 改成 DEYU 蓝、accent 改成 DEYU 橙。

### 需要的组件

```bash
npx shadcn-ui@latest add button card input label textarea select \
  badge separator sheet navigation-menu dropdown-menu \
  toast alert dialog form
```

---

## 八、阿拉伯语 RTL 支持

- `<html dir="rtl" lang="ar">` 当语言为阿语时
- 用 Tailwind 的 `rtl:` 修饰符处理特殊样式
- 阿语字体改用 Noto Sans Arabic
- 数字保持西方阿拉伯数字(0-9),不用东方阿拉伯数字
