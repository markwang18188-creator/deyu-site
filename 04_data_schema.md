# DEYU 独立站 · 数据 Schema

## 一、与 CRM 的关系

**关键决策:独立站和 CRM 共享同一个 Supabase 项目。**

理由:
- 独立站收到的询盘直接进 CRM 的 `leads` 表,无需中间件
- CRM 现有的 Gmail 同步 + drip campaign 自动覆盖独立站询盘
- 共享设计 token、Supabase RLS 策略、用户认证

**操作上,两个 Next.js 项目共用一组 Supabase 环境变量。**

## 二、新增表(独立站需要)

### `briefs`(简报表 · 电饭锅核心)

```sql
CREATE TABLE briefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  raw_input TEXT NOT NULL,              -- 用户原始输入(文字 / 语音转录)
  scene TEXT,                            -- 场景(展会 / 工厂 / 客户现场)
  machine TEXT,                          -- 机型
  numbers JSONB,                         -- 关键参数 {"production":"200/h","weight":"0.6"}
  selling_points TEXT[],                 -- 卖点数组
  target_market TEXT,                    -- 目标市场
  source_folder_url TEXT,                -- NAS / Drive 素材文件夹链接
  status TEXT DEFAULT 'draft',           -- draft / processing / ready / published / archived
  ai_summary TEXT,                       -- AI 提炼的核心信息
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ
);

CREATE INDEX idx_briefs_status ON briefs(status);
CREATE INDEX idx_briefs_created ON briefs(created_at DESC);
```

### `assets`(原始素材表)

```sql
CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brief_id UUID REFERENCES briefs(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,                -- Drive / R2 上的 URL
  file_type TEXT,                        -- video / image / audio
  file_size_bytes BIGINT,
  duration_seconds INT,                  -- 视频时长
  ai_description TEXT,                   -- AI 看图 / 看视频生成的描述
  ai_tags TEXT[],                        -- AI 自动打标
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_assets_brief ON assets(brief_id);
```

### `outputs`(生成的内容)

```sql
CREATE TABLE outputs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brief_id UUID REFERENCES briefs(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,                -- youtube / facebook / instagram / tiktok / blog
  language TEXT NOT NULL,                -- en / es / pt / tr / ar
  content_type TEXT,                     -- post / video / article
  title TEXT,
  body TEXT,                             -- 正文 / 描述
  hashtags TEXT[],
  media_url TEXT,                        -- 配图 / 视频 URL
  status TEXT DEFAULT 'pending',         -- pending / approved / scheduled / published / rejected
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  platform_post_id TEXT,                 -- 发布后平台返回的 ID(用于后续抓取数据)
  review_notes TEXT,                     -- 审核备注
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_outputs_status ON outputs(status);
CREATE INDEX idx_outputs_brief ON outputs(brief_id);
CREATE INDEX idx_outputs_scheduled ON outputs(scheduled_at) WHERE status = 'scheduled';
```

### `blog_posts`(独立站博客文章 · 镜像)

电饭锅产出的博客文章既写入 outputs 表(用于审核 / 调度),也镜像到 blog_posts 表(用于站点 SEO + 检索)。

```sql
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  output_id UUID REFERENCES outputs(id),
  slug TEXT UNIQUE NOT NULL,
  language TEXT NOT NULL,                -- en / es / pt / tr / ar
  title TEXT NOT NULL,
  description TEXT,                      -- SEO meta description
  body_mdx TEXT NOT NULL,                -- MDX 格式
  featured_image_url TEXT,
  keywords TEXT[],                       -- 主关键词
  product_refs TEXT[],                   -- 引用的产品 slug
  status TEXT DEFAULT 'draft',           -- draft / published
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_lang ON blog_posts(language);
CREATE INDEX idx_blog_posts_published ON blog_posts(published_at DESC) WHERE status = 'published';
```

## 三、复用 CRM 现有表

### `leads`(询盘表 · 已存在,扩展字段)

独立站询盘表单提交,写入此表。如已存在,补充以下字段:

```sql
ALTER TABLE leads ADD COLUMN IF NOT EXISTS source TEXT;
-- 'website-contact' / 'whatsapp-direct' / 'blog-cta' / 'product-page' / 'home-cta'

ALTER TABLE leads ADD COLUMN IF NOT EXISTS source_page TEXT;
-- 具体来源页面 URL,例:/products/tpu-dual-color-injection-machine

ALTER TABLE leads ADD COLUMN IF NOT EXISTS source_brief_id UUID REFERENCES briefs(id);
-- 如果是博客文章 / 社媒导流来的,关联到对应简报

ALTER TABLE leads ADD COLUMN IF NOT EXISTS machine_interest TEXT;
-- 询盘表单里勾选的机型

ALTER TABLE leads ADD COLUMN IF NOT EXISTS country_iso TEXT;
-- 国家代码 ISO 3166-1 alpha-2,例:BR / TR / IN

ALTER TABLE leads ADD COLUMN IF NOT EXISTS language TEXT;
-- 询盘时所在的站点语言,例:en / es / pt
```

## 四、归因模型(询盘从哪儿来)

询盘提交时,前端自动填充以下字段:

```typescript
{
  source: 'website-contact' | 'home-cta' | 'product-page' | 'blog-cta',
  source_page: typeof window !== 'undefined' ? window.location.pathname : '',
  source_brief_id: searchParams.get('brief'),  // UTM 参数,从博客 / 社媒带过来
  language: locale,  // next-intl 当前语言
  country_iso: detectFromIP(),  // Cloudflare 自带的 CF-IPCountry header
}
```

这样数据反过来回答:
- 哪条简报 → 哪些社媒帖子 → 哪些访客 → 哪些询盘 → 哪些成单?
- 哪个产品页转化率最高?
- 哪个语言版本带来最多询盘?
- 哪些国家流量最值钱?

**飞轮的核心闭环。**

## 五、RLS(行级安全)策略

```sql
-- 询盘表:任何人可写(公开表单),只有认证用户可读
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert leads"
  ON leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can read leads"
  ON leads FOR SELECT
  TO authenticated
  USING (true);

-- briefs / assets / outputs:只有认证用户(即你自己)可读写
ALTER TABLE briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE outputs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner full access on briefs"
  ON briefs FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 同样的策略复制到 assets / outputs

-- blog_posts:任何人可读已发布的,只有认证用户可写
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published posts"
  ON blog_posts FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "Authenticated full access on blog_posts"
  ON blog_posts FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
```

## 六、TypeScript 类型生成

执行命令(在 CRM 项目里):

```bash
npm run db:types
```

会更新 `~/CRMsystem/shoe-mach-crm/types/database.ts`。独立站直接复制 / 引用这个类型文件。

## 七、产品数据(暂时 hardcode,不入数据库)

产品数据先用 TypeScript 数组定义在 `data/products.ts`:

```typescript
export interface Product {
  slug: string;              // SEO slug,主访问路径
  modelSlug: string;         // 型号 slug,alias
  model: string;             // 型号显示
  name: string;              // 英文名称(从目录 PDF 抽)
  category: 'single-color' | 'dual-color' | 'multi-color' | 'air-blowing' | 'industrial';
  shortDescription: string;
  features: string[];        // 主要特点
  specifications: Record<string, string>;  // 参数表
  applications: string[];    // 应用场景
  mainImage: string;
  gallery: string[];
  videoUrl?: string;
  brochurePdfUrl?: string;
}

export const products: Product[] = [
  {
    slug: 'tpu-dual-color-injection-machine',
    modelSlug: 'dy-2216tr-tpu',
    model: 'DY-2216TR/TPU',
    name: 'Full Automatic Rotary Type Two Color TPU Sole Injection Moulding Machine',
    category: 'dual-color',
    // ... 详见 00_PRD.md 的产品清单
  },
  // ... 其他 14 个产品
];
```

**理由:产品数据相对稳定,半年改一次,放数据库反而麻烦。等真要做产品后台管理时再迁移。**
