# DEYU 独立站项目框架

> 本文件夹是给 Claude Code 的"圣旨包"。把整个 `deyu-site/` 文件夹放进 `~/CRMsystem/` 与现有 `shoe-mach-crm/` 并列,然后启动 Claude Code 即可开干。

## 📁 文件夹结构

```
deyu-site/
├── README.md                          ← 你正在读
├── CLAUDE.md                          ← Claude Code 启动时自动读
├── AGENTS.md                          ← Multi-agent 配置(可选)
│
├── 00_PRD.md                          ← 产品需求文档(核心)
├── 01_design_system.md                ← 设计系统(配色 / 字体 / 间距)
├── 02_information_architecture.md     ← 信息架构 + 路由
├── 03_seo_strategy.md                 ← SEO 多语种关键词策略
├── 04_data_schema.md                  ← Supabase 表结构
├── 05_phase_plan.md                   ← Phase 1-6 执行计划
│
├── designs/                           ← 设计稿(后续填充)
└── assets-ref/                        ← 参考素材(后续填充)
```

## 🚀 启动步骤

### Step 1: 把这个文件夹放到正确位置

```bash
# 在 Mac 终端执行
cd ~/CRMsystem
# 把整个 deyu-site/ 文件夹放到这里,与 shoe-mach-crm/ 平级
```

完成后结构应该长这样:

```
~/CRMsystem/
├── shoe-mach-crm/                     ← 已有的 CRM 项目
└── deyu-site/                         ← 新加的独立站项目
    ├── README.md
    ├── CLAUDE.md
    ├── 00_PRD.md
    ...
```

### Step 2: 启动 Claude Code

```bash
cd ~/CRMsystem/deyu-site
claude --dangerously-skip-permissions
```

### Step 3: 喂给它的第一句话

```
读这个文件夹里所有 .md 文件,从 05_phase_plan.md 的 Phase 1 开始执行。
每完成一个 Phase 暂停汇报,等我确认再进下一阶段。
```

然后 Claude Code 就开始干活了。

## 📋 前置准备清单

在 Claude Code 开干**之前**,你需要先准备好:

- [ ] **域名**:`deyusolemachine.com` 已通过 Cloudflare 注册
- [ ] **GitHub 账号**:登录状态,准备创建新 repo
- [ ] **Vercel 账号**:登录状态,准备连 GitHub
- [ ] **Supabase 项目**:可以复用 CRM 的同一个项目,或新建一个

Claude Code 跑到需要这些的时候会暂停问你。

## 🎯 Phase 总览

| Phase | 内容 | 大致时长 | 用户参与度 |
|-------|------|---------|----------|
| 1 | 项目初始化 | 30 分钟 | 中(需创 GitHub repo + Vercel) |
| 2 | 静态骨架 | 2-3 小时 | 低(几乎全自动) |
| 3 | 多语种 | 2 小时 | 低 |
| 4 | 询盘表单 | 1-2 小时 | 中(需执行 Supabase SQL) |
| 5 | SEO + 部署 | 1 小时 | 中(DNS 切换) |
| 6 | 内容填充 | 持续进行 | 高(用户提供素材) |

**Phase 1-5 全部跑完 = MVP 上线**,大约一个工作日。

## 🔗 与其他项目的关系

```
~/CRMsystem/
├── shoe-mach-crm/      ← 现有 CRM(客户管理 / 简报录入入口)
└── deyu-site/          ← 新建独立站(海外营销门面)
                          ↓ 询盘
                          ↓
                       共享 Supabase 数据库
                          ↑
                          ↑ 客户管理
                       shoe-mach-crm/
```

**不要碰**的项目:
- `~/CRMsystem/shoe-mach-crm/` —— 已有 CRM,独立站只读取它的 Supabase schema 信息,不修改其代码
- `~/Sites/` 等其他目录 —— 与本项目无关

## ❓ 常见问题

**Q: 我可以中途修改 PRD 吗?**
A: 可以,但要主动跟 Claude Code 说"我改了 00_PRD.md,请重新读一遍"。Claude Code 不会自动检测文件变化。

**Q: Phase 间可以并行吗?**
A: 不建议。每个 Phase 依赖前面的成果,串行最稳。

**Q: 出错了怎么办?**
A: 把错误信息发给 Claude Code,让它自己尝试解决。它会读 docs / 跑命令 / 改代码。

**Q: 我可以跳过 Phase 吗?**
A: 不建议跳过,但可以加速。例如 Phase 2-3 可以连续做,中间不必停。

## 📞 项目参考

- 工厂中文官网:wzdeyu.cn
- 工厂 Facebook:facebook.com/profile.php?id=100092413230082
- 印度代理参考站(对标):solemachine.in
- 公司目录 PDF:见 `assets-ref/Deyu_catalog_2026-3-20.pdf`(待用户放入)
