# B2B 目录引流战役 — 执行手册

> **新对话框接手指引**:读完本文件即可独立执行。这是 DEYU 在免费 B2B 目录平台
> 留资引流的战役蓝图 + 内容包目录。主攻**南美市场**(西语 + 葡语)。

## 背景

DEYU 已有独立站 SEO、Facebook、YouTube 三条引流。本战役开第四条**低成本渠道**:
在免费 B2B 目录平台留下公司 + 产品信息。素材几乎全现成 —— 23 个产品、西语翻译全套、
20 张白底图、12 个 YouTube 视频、公司资料齐全。

## 操作模式(安全红线 —— 不可逾越)

执行 AI **不能**:注册账号、输密码、过验证码、擅自点"提交/发布"。
因此**每个平台**的工作流固定为:
1. **Mark** 注册账号 + 登录(处理验证码)
2. **AI** 通过 Chrome MCP 把公司/产品信息逐字段填进表单
3. **Mark** 在最终"提交/发布"那一下确认点击

内容包(本目录)先做好,填表时直接取用。

## 已确认的 4 个决策
- 分工:Mark 注册+登录 → AI 填表 → Mark 提交
- 市场:**南美优先**(西语 + 葡语)
- 价格:全部 **"Contact for Quote" / 询盘**,不挂数字
- 工作区:本 `b2b-outreach/` 目录,纳入 git 版本管理

---

## 目录结构

```
b2b-outreach/
├── README.md            # 本文件:战役总览 + 操作模式 + 执行步骤
├── 00_company_profile.md# 公司"About"样板(EN/ES/PT)+ 联系块 + 认证 + 出口国清单
├── 01_platforms.md      # 平台清单:URL/语言/免费额度/优先级/注册备注/状态
├── 02_listings/         # 每个产品的 listing 文案(EN/ES/PT)可直接粘贴
│   ├── _template.md     # B2B 平台常见字段结构
│   └── <slug>.md        # 优先 8 个旗舰产品先做
├── 03_tracker.md        # 平台×产品进度表
└── assets/asset_map.md  # 产品→图片路径 + YouTube 链接,填表时秒取
```

## 数据源(全在本仓库内)
- 产品规格/特性/应用:`src/data/products.ts`(23 个产品)
- 西语翻译(现成):`src/data/translations/products.es.json`
- 产品图(白底):`public/products/*.jpg`(20 张)+ `public/products/moulds/`
- 视频映射:`07_youtube_upload_checklist.md`
- 公司 About 文案(英文成品):`messages/en.json` 的 `about` 段
- 公司背景:`00_PRD.md`;YouTube 频道描述模板:`07_youtube_upload_checklist.md`

## 公司核心信息(填表常用)
- 公司全名:Wenzhou Deyu Machinery Co., Ltd / 品牌 DEYU
- 网站:deyusolemachine.com
- WhatsApp:+86 136 1577 8781 · 邮箱:info@wzdeyu.cn
- 地址:Wenzhou, Zhejiang, China · 成立:2009
- 认证:ISO 9001 + CE · 出口 15+ 国(巴西/阿根廷/墨西哥/哥伦比亚等)

---

## 平台清单(web 研究已确认真实,执行时再核对各家最新免费额度)

### 南美专属(优先批)
| 平台 | URL | 语言 | 免费额度 | 优先级 |
|---|---|---|---|---|
| **B2Brazil** | b2brazil.com | 葡/英/西 | 免费 5 产品,23 万企业,**有鞋类+机械专版** | 🥇 先做 |
| **QuimiNet** | quiminet.com | 西语 | 免费注册,20k+ 买家/月,拉美最大,20 年 | 🥈 |
| **Solostocks** | solostocks.com | 西/葡 | 免费基础 listing | 🥉 |

### 全球英文(第二批,扩覆盖)
| 平台 | URL | 备注 |
|---|---|---|
| Made-in-China | made-in-china.com | 中国出口商主场,免费基础店铺 |
| EC21 | ec21.com | 全球老牌,免费会员 |
| TradeWheel / TradeKey / ExportHub | — | 全球英文,免费 listing |
| Kompass | kompass.com | 全球企业目录,免费基础档案 |

## 首批优先产品(8 个有视频的旗舰款 — listing 最强)
DY-2220A(双色转盘)· DY-1106 家族(单色转盘)· DY-1124B(吹气拖鞋)·
DY-2212(双色 12 工位)· DY-3324(多色)· DY-1102(入门 TPU)·
DY-150(立式)· DY-2224B(双色吹气)
每个出 EN/ES/PT 三语 listing + 指定图片文件名 + YouTube 链接。

---

## 执行步骤

1. ✅ 建目录骨架 + 本 README(已完成 2026-06-05)
2. ⬜ 核实平台清单 —— WebFetch 每个平台注册/免费页,填实 `01_platforms.md`
3. ⬜ 写 `00_company_profile.md` —— EN 复用现成 + 生成 ES(从已有翻译)+ PT
4. ⬜ 写首批 8 个产品 listing(`02_listings/<slug>.md`)—— 三语标题/关键词/描述/
   规格表/应用/"Contact for Quote"/联系块/图片名/视频链接
5. ⬜ 建 `assets/asset_map.md` —— 产品→图片路径 + YouTube URL 映射
6. ⬜ 建 `03_tracker.md` 空表
7. ⬜ 进入实操循环(每平台):Mark 注册登录 → AI 驱动 Chrome MCP 填表(逐字段
   征得授权)→ Mark 点提交 → 更新 tracker

## 验证
- 内容包:所有 `02_listings/*.md` 三语齐全、价格均"Contact for Quote"、图片名能在
  `public/products/` 找到、YouTube 链接可打开
- `01_platforms.md` 每个平台免费额度是实测值(标注核对日期)
- 实操:每发布一个,在 `03_tracker.md` 记平台/产品/日期/listing URL
- 2-4 周后回看哪些平台带来询盘,据此决定下一批投哪里
