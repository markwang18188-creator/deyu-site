# CLAUDE.md

> Claude Code 启动本项目时自动读取此文件,作为项目背景。

## 项目身份

DEYU 独立站 —— 海外营销主战场,英文 + 多语种(西/葡/土/阿)。

域名:**deyusolemachine.com**
母品牌:Wenzhou Deyu Machinery Co., Ltd
业务:鞋底注射成型机 + 配套设备出口

## 工作流约定

**这是一个"PRD → Phase 执行"模式的项目**,不是"接到一句话就写"模式。

启动时:
1. 读 `00_PRD.md` 了解业务背景与需求
2. 读 `01_design_system.md` 了解视觉规范
3. 读 `02_information_architecture.md` 了解 URL / 页面结构
4. 读 `03_seo_strategy.md` 了解 SEO 要求
5. 读 `04_data_schema.md` 了解数据库设计
6. 读 `05_phase_plan.md` 严格按 Phase 顺序执行

**铁律:每个 Phase 完成后,必须暂停汇报,等用户确认再进下一阶段。**

## 隔壁项目关系

CRM 项目在:`~/CRMsystem/shoe-mach-crm/`

- 共享 Supabase 数据库
- 复用部分 TypeScript 类型
- 复用 shadcn 配色 token
- 但两个项目独立 git repo + 独立 Vercel 部署

如需要查看 CRM 现有代码作参考,可以读 `~/CRMsystem/shoe-mach-crm/` 下的相关文件。

## 技术栈(强制)

- Next.js 14 + App Router + TypeScript
- Tailwind CSS + shadcn/ui(Default style + Slate base)
- next-intl(多语种)
- Supabase(共享 CRM 数据库)
- 部署:Vercel
- DNS:Cloudflare

## 关键约束

1. **不挂具体价格** —— 所有产品页用 "Contact for Quote"
2. **不做注册 / 登录** —— B2B 询盘站
3. **不做 LinkedIn 分享** —— 用户个人不做 LinkedIn
4. **不擅自编造内容** —— 没素材的地方用占位符 + TODO,不要编客户名 / 数据
5. **不挂 Deyu 工厂内部敏感信息** —— 例:具体出厂价、配方、商业机密

## SEO 是第一公民

- 每个页面有完整的 metadata(title / description / OG)
- 全站 hreflang 正确
- 产品页 Schema.org Product 结构化数据
- URL 用关键词 slug,不用纯型号
- Lighthouse SEO 必须 100

## 设计第一原则

**呼吸感优先**。空一点没关系,塞太满才丢人。

参考印度代理 solemachine.in —— 我们要做得**比它好 10 倍**。它就是 IndiaMART 免费模板,堆产品图、塞关键词、视觉粗糙。我们要做现代 B2B 工业品该有的样子。

## 命令快捷参考

```bash
# 开发
npm run dev

# 构建
npm run build

# 类型生成(用于 Supabase types)
npm run db:types

# Lighthouse 本地测试
npx lighthouse http://localhost:3000 --view
```

## 部署流程

```
本地开发 → git push origin main → Vercel 自动构建 → 自动部署到 deyusolemachine.com
```

PR 工作流(可选):
```
feature branch → PR → Vercel preview deployment → review → merge to main → production deploy
```

## 一些用户偏好

- 用户名:Mark(王先生)
- 用户技术水平:能看懂代码,会用 Claude Code bypass mode,但不擅长复杂调试
- **遇到错误**:用户更喜欢 Claude Code 自己尝试解决,而不是把错误丢回给用户
- **遇到设计选择**:用户喜欢 Claude Code 给 2-3 个方案 + 推荐,而不是单方面决定
- **品牌对外口径**:网站和 AI 客服前台必须以 DEYU 公司品牌为主,不要突出 "Mark" 个人。对客文案统一使用 "DEYU sales team" / "our team" / "DEYU engineering team"; Mark 只可出现在内部注释、内部文档、飞书/邮件收件人等不对客户展示的位置。

## 报告语言

中文。代码注释也可以中文(简体)。
