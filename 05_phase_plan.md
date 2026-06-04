# DEYU 独立站 · Phase 执行计划

> Claude Code 看到 `BLUEPRINT.md` / `00_PRD.md` 时,从 Phase 1 开始,**每完成一个 Phase 主动汇报并暂停**,等用户确认再进下一阶段。

---

## Phase 1 · 项目初始化(约 30 分钟)

**目标**:把空的 Next.js + Tailwind + shadcn 跑起来,推 GitHub。

执行步骤:

1. 在当前目录执行:
   ```bash
   npx create-next-app@latest . --typescript --tailwind --app --src-dir --import-alias "@/*"
   ```
   选项:
   - ESLint: Yes
   - Tailwind: Yes(已勾选)
   - src/ 目录: Yes
   - App Router: Yes
   - Turbopack: Yes
   - Import alias: 默认 `@/*`

2. 初始化 shadcn:
   ```bash
   npx shadcn@latest init
   ```
   选项:
   - Style: Default
   - Base color: Slate
   - CSS variables: Yes

3. 装上基础组件:
   ```bash
   npx shadcn@latest add button card input label textarea select badge separator sheet dropdown-menu form
   ```

4. 装核心依赖:
   ```bash
   npm install next-intl @hookform/resolvers react-hook-form zod \
     @supabase/ssr @supabase/supabase-js lucide-react clsx tailwind-merge
   ```

5. 装 next-sitemap(SEO 用):
   ```bash
   npm install --save-dev next-sitemap
   ```

6. 把 `01_design_system.md` 里的颜色变量加到 `src/app/globals.css`(覆盖 shadcn 默认 primary / accent)

7. 初始化 Git:
   ```bash
   git init
   git add .
   git commit -m "chore: initial project setup with next.js, tailwind, shadcn"
   ```

8. 在 GitHub 上**让用户创建一个空 repo**,名字 `deyu-site`,**Claude 暂停**,等用户给 URL。
   - 用户提供 URL 后:
     ```bash
     git remote add origin <repo-url>
     git branch -M main
     git push -u origin main
     ```

9. **暂停,提醒用户**:
   - 把项目连到 Vercel(用户去 vercel.com 操作)
   - 配置 Vercel 环境变量(暂时空着,Phase 4 才用到)
   - 配置 Cloudflare DNS,把 `deyusolemachine.com` CNAME 到 Vercel

---

## Phase 2 · 静态骨架(约 2-3 小时)

**目标**:所有页面路由跑通,内容是占位符 lorem ipsum,设计风格正确。

执行步骤:

1. **建 `src/data/products.ts`** —— 从 `00_PRD.md` 复制 15+ 产品数据
2. **建 `src/components/layout/Header.tsx`** —— 顶部导航 + Mega Menu + Language Switcher + WhatsApp 按钮
3. **建 `src/components/layout/Footer.tsx`** —— 四列 Footer
4. **建 `src/components/sections/Hero.tsx`** —— 首页 Hero
5. **建 `src/components/sections/TrustBar.tsx`** —— ISO/CE/15 国信任标志条
6. **建 `src/components/sections/ProductCategoryGrid.tsx`** —— 首页 4 列产品分类
7. **建 `src/components/sections/WhyDeyu.tsx`** —— 4 个优势区块
8. **建 `src/components/sections/GlobalMap.tsx`** —— 全球客户地图(用 SVG 世界地图,15 国高亮)
9. **建 `src/components/sections/CtaSection.tsx`** —— 通用 CTA 区
10. **建 `src/app/page.tsx`** —— 首页,组装上面所有 section
11. **建 `src/app/products/page.tsx`** —— 产品总览
12. **建 `src/app/products/[slug]/page.tsx`** —— 产品详情,用 `generateStaticParams`
13. **建 `src/app/about/page.tsx`** —— 关于页
14. **建 `src/app/contact/page.tsx`** —— 联系页(表单 Phase 4 才接逻辑)
15. **建 `src/app/thank-you/page.tsx`** —— 询盘成功页

**质量门**:
- 所有页面 Lighthouse SEO ≥ 95
- 所有页面有 metadata(title / description)
- 移动端布局正确
- 风格与 `01_design_system.md` 一致

完成后 commit:
```bash
git add . && git commit -m "feat(phase-2): static skeleton with all routes" && git push
```

**暂停,等用户审阅 Vercel 预览部署**。

---

## Phase 3 · 多语种(约 2 小时)

**目标**:5 语种全站可切换。

执行步骤:

1. 配置 `next-intl` 中间件:
   ```typescript
   // src/middleware.ts
   import createMiddleware from 'next-intl/middleware';
   export default createMiddleware({
     locales: ['en', 'es', 'pt', 'tr', 'ar'],
     defaultLocale: 'en',
     localePrefix: 'as-needed',  // 英文不加 /en/ 前缀
   });
   ```

2. 路由改造为 `[locale]` 嵌套:
   ```
   src/app/[locale]/page.tsx
   src/app/[locale]/products/...
   ```

3. 建 `messages/` 目录,5 个 JSON 文件:
   - `en.json`(基准)
   - `es.json` `pt.json` `tr.json` `ar.json`

4. 抽出所有 UI 文案为 `t('key')` 调用

5. 阿语 RTL 支持:
   ```tsx
   <html dir={locale === 'ar' ? 'rtl' : 'ltr'} lang={locale}>
   ```

6. Header 加 Language Switcher 组件,实现路径前缀切换

7. 实现 hreflang 标签:
   ```typescript
   alternates: {
     canonical: '...',
     languages: { en, es, pt, tr, ar },
   }
   ```

**注意**:
- URL slug 不翻译(保持英文 SEO 词)
- 产品参数表只翻译标签,不翻译数字单位
- 首批文案翻译用 DeepSeek 自动批量做,后续用户人工校对

完成后 commit + push,**暂停**等用户验证。

---

## Phase 4 · 询盘表单 + Supabase(约 1-2 小时)

**目标**:Contact 页表单工作,询盘写入 Supabase。

前置条件:用户在 Vercel 配好 Supabase 环境变量。

执行步骤:

1. 用户提供 Supabase URL + anon key,加到 `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```

2. **暂停**,提醒用户在 Supabase 控制台执行 `04_data_schema.md` 里的 SQL:
   - 扩展 `leads` 表字段
   - 建 `briefs` `assets` `outputs` `blog_posts` 四张表
   - 设置 RLS 策略

3. 用户确认 SQL 执行成功后,继续:

4. 建 `src/lib/supabase/server.ts` 和 `src/lib/supabase/client.ts`(复用 CRM 项目同款代码)

5. 建 Server Action `src/app/actions/submit-lead.ts`:
   ```typescript
   'use server'
   export async function submitLead(formData: FormData) {
     // Zod 校验
     // 写入 leads 表
     // 加 source 字段
     // 触发邮件通知(占位)
     // 返回成功 / 失败
   }
   ```

6. Contact 页表单接入 React Hook Form + Zod + Server Action

7. 产品详情页加"Get Quote"按钮,跳 `/contact?machine=DY-2216TR/TPU`,自动预填机型

8. 实现归因:URL 参数 `?brief=...` 自动写入 `source_brief_id`

9. 测试:本地填表 → Supabase 表看到记录 → 跳 thank-you 页

完成后 commit + push,**暂停**等用户测试。

---

## Phase 5 · SEO + 部署优化(约 1 小时)

**目标**:Lighthouse 全绿,Vercel 生产环境上线。

执行步骤:

1. 配置 `next-sitemap`:
   ```javascript
   // next-sitemap.config.js
   module.exports = {
     siteUrl: 'https://deyusolemachine.com',
     generateRobotsTxt: true,
     alternateRefs: [
       { href: 'https://deyusolemachine.com', hreflang: 'en' },
       { href: 'https://deyusolemachine.com/es', hreflang: 'es' },
       // ...
     ],
   }
   ```

2. `package.json` 加 postbuild hook:
   ```json
   "postbuild": "next-sitemap"
   ```

3. 每个产品页加 Schema.org Product 结构化数据(JSON-LD)

4. 首页加 Schema.org Organization 结构化数据

5. 全站加 BreadcrumbList 结构化数据

6. 图片优化检查:
   - 所有 `<img>` 替换为 `<Image>`
   - 首屏图片加 `priority`
   - 非首屏图片 `loading="lazy"`(默认)

7. 字体优化:
   ```typescript
   import { Inter } from 'next/font/google';
   const inter = Inter({ subsets: ['latin'] });
   ```

8. 跑 Lighthouse 测试,确保:
   - Performance ≥ 90
   - SEO = 100
   - Best Practices ≥ 95
   - Accessibility ≥ 90

9. Vercel 生产部署 + Cloudflare DNS 切换到 `deyusolemachine.com`

10. 验证生产环境所有页面正常。

**网站上线完成!**

---

## Phase 7 · 模具品类 Catalog(待Mark素材交付,边交付边上)

**目标**: 在网站现有 4 个机器品类外,引入"模具"作为独立产品大类,扩展 SEO 关键词面 + 开辟模具销售渠道。

**架构原则**: 模具产品复用 `Product` interface 与 `/products/<slug>` 路由 — sitemap / hreflang / Schema.org 全部自动接入,无需新建路由或 schema。

### 已完成的脚手架(2026-06-04)
- ✅ `ProductCategory` enum 加 `'moulds'`
- ✅ `categoryLabels.moulds = 'Shoe Sole Moulds'`
- ✅ 3 个种子产品条目:`tpu-sole-mould-rotary` / `one-piece-shoe-mould` / `vertical-injection-sole-mould`(均带 TODO 占位规格)
- ✅ products 列表页过滤增加 'Moulds' pill
- ✅ 首页 ProductCategoryGrid 加模具卡片
- ✅ Header 巨型菜单加第三组 "Moulds"
- ✅ 5 语种 i18n key(nav + productGrid)
- ✅ 西语产品翻译(es.json) 3 条
- ✅ `public/products/moulds/placeholder.svg` 占位图
- ✅ 02_IA / 03_SEO 文档同步更新

### Mark 需交付的素材(每个模具一份)
- [ ] 模具型号 / 内部 SKU
- [ ] 顶视图 + 侧视图照片(纯白底,kebab-case 命名匹配 slug,放 `public/products/moulds/<slug>.jpg`)
- [ ] 兼容机型清单
- [ ] 型腔数(2/4/6 cavities)
- [ ] 适配鞋号范围(EUR 36-46 etc.)
- [ ] 材质(P20 / S136 / NAK80 / 718H?)
- [ ] 表面处理(硬铬 / 氮化 / 其他)
- [ ] 标准交期
- [ ] (可选)出货价格区间 — 决定是否公开

### 完成标准
- Lighthouse SEO 仍 100
- 5 语种 `/products?category=moulds` 均可访问
- sitemap 自动包含 `/products/<mould-slug>` 各 locale 变体
- 每个模具产品至少有 1 张纯白底照片(替换 placeholder.svg)
- 至少 5 个模具型号上线

### 暂不做(后续可再议)
- 模具页 ↔ 机器页交叉链接(等两边目录都成熟后再说)
- 专门的 `/products/moulds` landing page(目录满 5+ 条目再考虑)
- 模具相关博客内容(SEO 加成,但属于 Phase 6 范畴)
- Chatbot 推荐模具(selection_matrix 暂不扩展)

---

## Phase 6 · 内容填充 + 后续扩展(异步进行)

这一阶段**不需要 Claude Code 频繁操作**,主要是用户提供素材 + 电饭锅产出内容。

任务清单:

- [ ] 用户上传真实产品图(替换占位图)
- [ ] 用户上传工厂实景图(关于页 + 首页)
- [ ] 用户上传 logo 高清版
- [ ] 用户提供首页背景视频(等电饭锅产出第一批后)
- [ ] 翻译文案人工校对(5 种语言)
- [ ] 客户案例页 `/cases` 上线
- [ ] 博客系统接通(电饭锅产出 MDX → 自动 commit → Vercel 自动部署)
- [ ] 接 Google Search Console + Bing Webmaster
- [ ] 接 Google Analytics 4(可选 Plausible / Umami 隐私友好替代)
- [ ] WhatsApp Business 国际化资料申请
- [ ] 提交主要 B2B 行业目录

---

## 跨 Phase 工作规范

### Git Commit Convention

```
feat(phase-2): add product detail page with specs table
fix(seo): correct hreflang on Spanish product pages
refactor(layout): extract trust bar to component
docs: update PRD with new product DY-3220C variants
```

### 每个 Phase 完成时的汇报模板

```markdown
## Phase N 完成报告

### 完成的内容
- [...]

### 测试状态
- 本地 dev 服务器:✅ 正常
- 构建:✅ 通过
- Lighthouse:Performance XX / SEO XX

### 用户需要做的事
- [ ] 在 GitHub 创建 repo / 添加远程
- [ ] 在 Vercel 配置环境变量 XX
- [ ] 在 Supabase 执行 SQL

### 下一阶段建议
- 进入 Phase N+1?
- 还是回头修改 / 调整这一阶段的某些东西?
```

### 全过程禁止

- ❌ 不擅自加 LinkedIn / 注册登录 / 购物车功能
- ❌ 不擅自挂具体价格
- ❌ 不擅自改产品型号或参数
- ❌ 不在博客 / 案例页随便编客户名
- ❌ 不在没有素材的地方编内容

如果用户没提供某个素材,**用占位符 + TODO 注释,不要编**。
