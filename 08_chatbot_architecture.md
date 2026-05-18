# 08 · AI 客服机器人 架构设计

> 基础: [sales_playbook.xml](src/data/chatbot/sales_playbook.xml) (Mark + Gemini 共同设计的 9 步销售剧本)
> 选型逻辑: [selection_matrix.ts](src/data/chatbot/selection_matrix.ts)
> 决策日期: 2026-05-18

---

## 设计原则

1. **不是聊天，是销售漏斗** — AI 走完 9 步要拿到结构化询盘报告
2. **不暴露成本** — 价格、加价幅度、利润逻辑全部内化
3. **不编内容** — 只用 products.ts 真实数据,不存在的型号不推荐
4. **多语言自动** — Claude 自动匹配客户语言(英/西/葡/土/阿/任意)
5. **数据沉淀** — 每段对话存 Supabase,自动推飞书给 Mark

---

## 系统组件

```
┌────────────────────────────────────────────────────────────┐
│  Frontend: src/components/chatbot/                          │
│  ├── ChatWidget.tsx       右下角浮动按钮 + 弹窗               │
│  ├── ChatMessages.tsx     对话气泡 + Markdown 渲染           │
│  └── ChatInput.tsx        输入框 + 发送                     │
└────────────────────────────────────────────────────────────┘
                              │
                              ▼ POST /api/chat
┌────────────────────────────────────────────────────────────┐
│  Backend: src/app/api/chat/route.ts                         │
│                                                              │
│  systemPrompt = readFile('sales_playbook.xml')               │
│                + productCatalogJSON                          │
│                + currentDateContext                          │
│                                                              │
│  tools = [                                                  │
│    recommend_models(materials, colors, moldConfig, ...),   │
│    get_product_details(slug),                              │
│    capture_lead({name, email, country, summary, ...}),     │
│    handoff_to_whatsapp(prefilled_message)                  │
│  ]                                                           │
│                                                              │
│  result = anthropic.messages.create({                       │
│    model: 'claude-haiku-4-5-20251001',  // 便宜+快           │
│    system: systemPrompt,                                    │
│    tools,                                                   │
│    messages: conversation                                   │
│  })                                                          │
└────────────────────────────────────────────────────────────┘
                              │
                              ▼ when AI calls capture_lead()
┌────────────────────────────────────────────────────────────┐
│  Lead Pipeline                                              │
│                                                              │
│  1. INSERT INTO supabase.leads (...)                        │
│     ↑ 共享数据库,~/CRMsystem/shoe-mach-crm/ 直接看到         │
│                                                              │
│  2. POST 飞书 webhook → Mark 手机秒收到富文本卡片            │
│     "🎯 新询盘 - 巴西客户 - DY-2220A - [WhatsApp 跳转]"     │
│                                                              │
│  3. AI 转告客户 "Mark 会在 24 小时内回复你"                 │
└────────────────────────────────────────────────────────────┘
```

---

## API: `POST /api/chat`

**Request:**
```json
{
  "sessionId": "uuid",        // 浏览器 localStorage 生成,跨刷新保持
  "message": "I need a machine for TPU soccer cleats",
  "history": [...]            // 完整对话历史
}
```

**Response:**
```json
{
  "reply": "Great! TPU soccer cleats need higher clamping force...",
  "toolCalls": [...],         // 调用了哪些工具
  "stage": 3,                 // 当前在 9 步的第几步
  "leadCaptured": false       // 是否已生成报告
}
```

---

## Supabase 表结构

```sql
CREATE TABLE chatbot_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_ip TEXT,
  visitor_country TEXT,       -- 用 Vercel Geo Header
  referrer_page TEXT,         -- 客户从哪个产品页打开的聊天
  started_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  stage INT DEFAULT 1,        -- 9 步走到第几步
  language TEXT,              -- 客户用什么语言
  lead_captured BOOLEAN DEFAULT FALSE
);

CREATE TABLE chatbot_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES chatbot_sessions(id),
  role TEXT,                  -- 'user' / 'assistant'
  content TEXT,
  tool_calls JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE leads (           -- 已有则复用 shoe-mach-crm 的同名表
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES chatbot_sessions(id),
  -- 9 步收集到的字段
  customer_name TEXT,
  customer_email TEXT,
  country TEXT,
  materials TEXT[],
  colors INT,
  mold_config TEXT,
  product_category TEXT,
  tonnage_recommendation INT,
  recommended_models TEXT[],  -- ['dual-color-rotary-sole-machine', ...]
  upgrades_discussed TEXT[],
  cooling_preference TEXT,
  port TEXT,
  payment_preference TEXT,
  full_summary TEXT,
  source TEXT DEFAULT 'website_chatbot',
  status TEXT DEFAULT 'new',  -- new / contacted / qualified / converted / lost
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 飞书 Webhook 集成

**Mark 一次性设置(2 分钟):**
1. 飞书 → 新建群"DEYU 询盘" → 群设置 → 群机器人 → 添加 → 自定义机器人
2. 复制 webhook URL,塞到 `.env.local`:
   ```
   FEISHU_LEAD_WEBHOOK=https://open.feishu.cn/open-apis/bot/v2/hook/xxx
   ```

**后端代码:**
```typescript
async function notifyFeishu(lead: Lead) {
  const card = {
    msg_type: 'interactive',
    card: {
      header: {
        title: { tag: 'plain_text', content: `🎯 新询盘 — ${lead.country}` },
        template: 'orange'
      },
      elements: [
        { tag: 'div', text: { tag: 'lark_md', content: 
          `**客户**: ${lead.customer_name}\n` +
          `**邮箱**: ${lead.customer_email}\n` +
          `**需求**: ${lead.materials.join('/')}, ${lead.colors} 色, ${lead.product_category}\n` +
          `**推荐机型**: ${lead.recommended_models.join(', ')}\n` +
          `**港口**: ${lead.port}\n`
        }},
        { tag: 'action', actions: [
          { tag: 'button', text: { content: '查看完整对话' },
            url: `https://deyusolemachine.com/admin/leads/${lead.id}`,
            type: 'default' },
          { tag: 'button', text: { content: '💬 联系客户' },
            url: `https://wa.me/?text=Hi ${lead.customer_name}, this is Mark from DEYU...`,
            type: 'primary' }
        ]}
      ]
    }
  };
  await fetch(process.env.FEISHU_LEAD_WEBHOOK!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(card)
  });
}
```

---

## 前端 UI

### 入口策略 (方案 B, 2026-05-18 决定)

**两个入口并存**:

1. **全站浮动聊天图标** (右下角)
   - 蓝色圆形 💬 按钮, 在现有 WhatsApp 浮动按钮**上方**
   - 出现在 deyusolemachine.com 所有页面
   - 客户主动点击才弹聊天 — 不自动弹出

2. **产品页 banner** (只在 `/products` 和 `/products/[slug]` 显示)
   - 位置: 产品列表页顶部 / 产品详情页 hero 下方
   - 文案: "🤖 Not sure which DEYU machine fits your production? Get a 5-minute AI-powered recommendation →"
   - 样式: 浅橙色背景, 橙色边框, 整体高度 ~60px (不抢戏)
   - 点击 banner 直接打开聊天窗

**为什么是 B 不是 A/C**:
- A (只浮动图标): 太被动, 客户发现率低
- C (替换 Send Enquiry 按钮): 风险高, 想填表单的客户会跳出
- B 在客户"求助心理"最强的产品页主动推, 其他页面不打扰

**不做的方案**:
- 不做 30 秒自动弹出 (打扰客户)
- 不替换现有的 Send Enquiry / WhatsApp 按钮 (多入口并存, 客户选)

### ChatWidget 弹窗本身

**首次打开**: 显示欢迎语 "Hi! I'm the DEYU product advisor. What type of shoe soles do you produce?"
**进度提示**: 顶部小进度条 "Question 3 of 9 · Mold configuration"
**快捷退出**: 任何时候可点 "💬 Chat with human on WhatsApp" 退出 AI 走人工

**响应式**:
- 桌面: 380×600px 弹窗
- 移动端: 全屏覆盖
- 暗色模式: 跟随系统

---

## 成本估算

| 项 | 用量 | 月成本 |
|---|---|---|
| Claude Haiku 4.5 API | 100 对话/月 × 平均 8 轮 × ~2000 token | ~$3-5 |
| Supabase Storage(对话日志) | 几 MB | 免费额度 |
| Vercel API routes | 全部走 Edge,~ms 级 | 免费额度 |
| 飞书机器人 | 无 | 免费 |
| **合计** | | **< $10/mo** |

每月 100 对话假设;如果实际有 500+ 对话/月,成本最多到 $20-30,远低于雇一个人工客服。

---

## 开发时间预估

| 阶段 | 工时 | 产出 |
|---|---|---|
| 后端 API + 工具集成 | 4h | `/api/chat` route + 4 个 tools |
| Supabase 表 + 飞书 webhook | 1h | DB schema + notification |
| 前端 ChatWidget | 3h | 浮动按钮 + 弹窗 + 消息渲染 |
| 系统 prompt 调优 | 2h | 跑测试 case,微调 XML |
| i18n + 移动端适配 | 1h | 5 语种 UI + 全屏移动 |
| 测试 (5 个典型客户场景) | 2h | 巴西凉鞋 / 印度拖鞋 / 土耳其运动鞋 / 等 |
| **合计** | **~13h** | **可上线 MVP** |

---

## 风险 & 缓解

| 风险 | 缓解 |
|---|---|
| AI 走偏话题,聊起天气 | system prompt 严格限定"只谈鞋底机器" |
| AI 编造不存在的型号 | 强制用 `recommend_models` 工具,返回值来自 products.ts |
| 客户用我们没数据的型号问问题 (比如 EVA) | 工具返回空时,AI 引导到 WhatsApp 真人 |
| 客户中途退出,数据丢失 | 每轮对话立即写 Supabase,可恢复 + 可手动跟进 |
| 价格被诱导泄露 | system prompt 红线: NO PRICING |

---

## 开发路线

**MVP (Week 1-2):**
- [ ] API route + tools
- [ ] Supabase 表 + 飞书通知
- [ ] ChatWidget UI (英文先行)
- [ ] 部署测试

**v1.1 (Week 3):**
- [ ] 5 语种 UI 翻译
- [ ] 移动端体验优化
- [ ] 管理后台 /admin/leads (列表 + 详情查看)

**v1.2 (Month 2):**
- [ ] 对话质量分析(Mark 看哪些询盘转化高)
- [ ] A/B 测试不同开场白
- [ ] 接入售后场景(故障诊断走另一个 prompt)

---

## 给 Mark 的 3 个待办

1. **创建飞书机器人** 并把 webhook URL 给我 (2 分钟)
2. **审一遍 selection_matrix.ts 的映射** — 比如"DY-2220A 推荐给 PVC 双色"对不对? (10 分钟)
3. **想几个真实客户场景** 让我用来测 AI 回答 — 比如"印度做安全鞋底,问哪台机器" (15 分钟)
