import type { ChatbotLeadData } from '@/app/actions/submit-chatbot-lead';

export async function notifyFeishu(
  lead: ChatbotLeadData & { id?: string; session_id?: string }
): Promise<void> {
  const webhook = process.env.FEISHU_LEAD_WEBHOOK;
  if (!webhook) {
    console.warn('[feishu] FEISHU_LEAD_WEBHOOK not set — skipping notification');
    return;
  }

  const whatsappNumber = process.env.DEYU_WHATSAPP_NUMBER || '8613615778781';
  const greeting = encodeURIComponent(
    `Hi ${lead.customer_name}, this is Mark from DEYU. I saw your enquiry about ${(lead.recommended_models || []).join(', ') || 'our machines'}. Happy to discuss your project.`
  );
  const waUrl = `https://wa.me/${whatsappNumber}?text=${greeting}`;

  const card = {
    msg_type: 'interactive',
    card: {
      header: {
        title: {
          tag: 'plain_text',
          content: `🎯 新询盘 — ${lead.country || '未知国家'} — ${lead.customer_name}`,
        },
        template: 'orange',
      },
      elements: [
        {
          tag: 'div',
          text: {
            tag: 'lark_md',
            content:
              `**客户**: ${lead.customer_name}\n` +
              `**邮箱**: ${lead.customer_email}\n` +
              (lead.customer_phone ? `**电话**: ${lead.customer_phone}\n` : '') +
              (lead.company ? `**公司**: ${lead.company}\n` : '') +
              `**国家**: ${lead.country || '—'}\n` +
              `**需求**: ${(lead.materials || []).join('/') || '—'} · ${lead.colors ?? '?'} 色 · ${lead.product_category || '—'}\n` +
              `**推荐机型**: ${(lead.recommended_models || []).join(', ') || '—'}\n` +
              (lead.tonnage_recommendation ? `**吨位**: ${lead.tonnage_recommendation}\n` : '') +
              (lead.port ? `**港口**: ${lead.port}\n` : '') +
              (lead.payment_preference ? `**付款**: ${lead.payment_preference}\n` : ''),
          },
        },
        {
          tag: 'div',
          text: { tag: 'lark_md', content: `**摘要**: ${lead.full_summary || '—'}` },
        },
        {
          tag: 'action',
          actions: [
            {
              tag: 'button',
              text: { tag: 'plain_text', content: '💬 WhatsApp 联系客户' },
              url: waUrl,
              type: 'primary',
            },
            {
              tag: 'button',
              text: { tag: 'plain_text', content: '📧 发邮件' },
              url: `mailto:${lead.customer_email}`,
              type: 'default',
            },
          ],
        },
      ],
    },
  };

  try {
    const res = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(card),
    });
    if (!res.ok) {
      console.error('[feishu] webhook returned', res.status, await res.text());
    }
  } catch (err) {
    console.error('[feishu] webhook failed:', err);
  }
}
