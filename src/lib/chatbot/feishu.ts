import type { ChatbotLeadData } from '@/app/actions/submit-chatbot-lead';

export interface NotifyResult {
  ok: boolean;
  channel: 'feishu';
  skipped?: boolean;
  error?: string;
}

export async function notifyFeishu(
  lead: ChatbotLeadData & { id?: string; session_id?: string }
): Promise<NotifyResult> {
  const webhook = process.env.FEISHU_LEAD_WEBHOOK;
  if (!webhook) {
    console.warn('[feishu] FEISHU_LEAD_WEBHOOK not set — skipping notification');
    return { ok: false, channel: 'feishu', skipped: true, error: 'webhook_not_configured' };
  }

  const customerWhatsApp = buildCustomerWhatsAppUrl(lead);
  const emailUrl = `mailto:${lead.customer_email}`;
  const followUpText = encodeURIComponent(
    `Hi ${lead.customer_name}, this is the DEYU sales team. We saw your enquiry about ${(lead.recommended_models || []).join(', ') || 'our machines'}. Happy to discuss your project.`
  );
  const actions = [];
  if (customerWhatsApp) {
    actions.push({
      tag: 'button',
      text: { tag: 'plain_text', content: '💬 WhatsApp 联系客户' },
      url: `${customerWhatsApp}${customerWhatsApp.includes('?') ? '&' : '?'}text=${followUpText}`,
      type: 'primary',
    });
  }
  actions.push({
    tag: 'button',
    text: { tag: 'plain_text', content: '📧 发邮件' },
    url: emailUrl,
    type: customerWhatsApp ? 'default' : 'primary',
  });

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
          actions,
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
      const text = await res.text();
      console.error('[feishu] webhook returned', res.status, text);
      return { ok: false, channel: 'feishu', error: `http_${res.status}` };
    }
    return { ok: true, channel: 'feishu' };
  } catch (err) {
    console.error('[feishu] webhook failed:', err);
    return {
      ok: false,
      channel: 'feishu',
      error: err instanceof Error ? err.message : 'unknown_error',
    };
  }
}

function buildCustomerWhatsAppUrl(lead: ChatbotLeadData): string | null {
  const raw = lead.customer_phone?.trim();
  if (!raw) return null;
  const normalized = raw.replace(/[^\d+]/g, '');
  const digits = normalized.startsWith('+')
    ? normalized.slice(1).replace(/\D/g, '')
    : normalized.replace(/\D/g, '');
  if (digits.length < 8) return null;
  return `https://wa.me/${digits}`;
}
