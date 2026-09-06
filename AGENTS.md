# AGENTS.md

> 给 Claude Code 的 multi-agent 工作分工建议。本项目用单 agent 串行也完全可以,这份文件主要用于大型重构 / 性能优化阶段。

## 推荐角色分工(可选)

### 🏗️ Builder Agent · 构建工

负责:
- Phase 1-5 的主体开发
- 新功能 feature 开发
- 写组件 / 写页面 / 写 Server Action

启动 prompt:
```
你是 deyu-site 的 Builder。读完 00-05.md 所有 PRD 文档后,
从用户指定的 Phase 开始执行。每完成一个 Phase 暂停汇报。
```

### 🔍 Reviewer Agent · 评审员

负责:
- 代码质量审查
- 安全审查(SQL 注入 / XSS / 敏感信息泄露)
- SEO 完整性审查
- 性能 review(bundle size / lighthouse)

启动条件:每个 Phase 完成后,Builder 主动调用 Reviewer 走一遍。

### 🎨 Designer Agent · 设计师

负责:
- 视觉风格调整
- 交互细节优化
- 响应式 breakpoint 调优
- 暗色模式(本项目不做,占位)

启动条件:Phase 2 完成后用户提出视觉调整需求时。

### 🌍 Translator Agent · 翻译官

负责:
- 5 语种文案翻译(en → es / pt / tr / ar)
- 调用 DeepSeek API 批量翻译
- 阿语 RTL 测试

启动条件:Phase 3 多语种阶段。

### 📊 SEO Agent · SEO 工程师

负责:
- meta 标签优化
- 结构化数据(Schema.org)
- sitemap / robots.txt
- hreflang 正确性
- 内链建设

启动条件:Phase 5,以及每次新增博客文章时。

## Single-Agent Fallback(默认)

**如果用户不指定 multi-agent**,Claude Code 单 agent 串行执行所有 Phase 即可。
这是默认模式。

## DEYU 网站长期内容准则

### 品牌与文案

- 网站对外以 DEYU / Wenzhou Deyu Machinery Co., Ltd. 为主体,不要在客户可见文案中突出 Mark 个人姓名或个人角色。
- Blog 默认使用简洁、技术、工程化语气:结论清楚,条件和限制说准确,避免冗长口语化和过度销售感。

### 产品图片规范

新增或替换产品图片时:
- 优先使用白底或干净浅色背景,让机器主体清楚可辨认。
- 产品列表图片要和现有卡片视觉比例一致,不要只按原图比例直接放入。
- 主体应居中或略偏视觉中心,左右留白均衡;不能出现一边空很多、另一边像被硬切掉的效果。
- 机器要尽量完整,尤其旋转盘、机脚、料斗、操作台等关键结构不要被突兀裁切。
- 如果原图是宽幅机器,可以适度裁掉空白,但要先对照相邻产品卡片预览,确保视觉大小统一。
- 产品详情图和列表图共用同一资产时,优先兼顾列表页统一性,同时保证详情页不丢失关键信息。
- 调整后要检查本地或线上产品列表,以相邻产品卡片为参照确认图片大小、居中和边缘裁切。

## 工作并行规则

如果用户启用 multi-agent:
- Builder 和 Reviewer **不能同时改同一个文件**
- Translator 只能改 `messages/*.json`,不能改组件代码
- Designer 只能改 `tailwind.config.ts` 和 globals.css,不能改业务逻辑
- 所有 agent **都不能改** `00-05.md` 这 6 个 PRD 文档(只能读)。修改 PRD 必须由用户主动操作。
