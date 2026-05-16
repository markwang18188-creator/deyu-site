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

## 工作并行规则

如果用户启用 multi-agent:
- Builder 和 Reviewer **不能同时改同一个文件**
- Translator 只能改 `messages/*.json`,不能改组件代码
- Designer 只能改 `tailwind.config.ts` 和 globals.css,不能改业务逻辑
- 所有 agent **都不能改** `00-05.md` 这 6 个 PRD 文档(只能读)。修改 PRD 必须由用户主动操作。
