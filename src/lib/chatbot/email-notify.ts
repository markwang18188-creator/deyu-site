import type { ChatbotLeadData } from '@/app/actions/submit-chatbot-lead';

/**
 * 备份邮件通知 —— 飞书机器人挂了 / 没看到 / 切了网络的兜底。
 *
 * 用 Resend API(https://resend.com)。不引入 SDK 走 fetch,保持 server
 * action 冷启动轻量。需要环境变量:
 *   RESEND_API_KEY      —— Resend 的 API Key
 *   LEAD_EMAIL_TO       —— 收件人(默认 markwang18188@gmail.com)
 *   LEAD_EMAIL_FROM     —— 发件人(必须是 Resend 验证过的域名,默认
 *                          'DEYU Website <leads@deyusolemachine.com>')
 * 任意一个缺失则跳过,不抛错,不影响 lead 写库 / 飞书通知主流程。
 */
export async function notifyEmail(
  lead: ChatbotLeadData & { id?: string }
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_EMAIL_TO || 'markwang18188@gmail.com';
  const from = process.env.LEAD_EMAIL_FROM || 'DEYU Website <leads@deyusolemachine.com>';

  if (!apiKey) {
    console.warn('[email-notify] RESEND_API_KEY not set — skipping email backup');
    return;
  }

  const whatsappNumber = process.env.DEYU_WHATSAPP_NUMBER || '8613615778781';
  const greeting = encodeURIComponent(
    `Hi ${lead.customer_name}, this is Mark from DEYU. I saw your enquiry about ${(lead.recommended_models || []).join(', ') || 'our machines'}. Happy to discuss your project.`
  );
  const waUrl = `https://wa.me/${whatsappNumber}?text=${greeting}`;

  const subject = `🎯 新询盘 · ${lead.country || '未知国家'} · ${lead.customer_name}`;

  const html = `
<!doctype html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background:#f8fafc; padding:24px; margin:0;">
  <table role="presentation" cellpadding="0" cellspacing="0" style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.08);">
    <tr>
      <td style="background:linear-gradient(135deg,#1e3a8a 0%,#ea580c 100%); padding:20px 24px; color:#fff;">
        <div style="font-size:12px; letter-spacing:2px; opacity:0.9;">DEYU SOLE MACHINE · NEW LEAD</div>
        <div style="font-size:22px; font-weight:700; margin-top:4px;">🎯 ${escapeHtml(lead.customer_name)} · ${escapeHtml(lead.country || '未知')}</div>
      </td>
    </tr>
    <tr>
      <td style="padding:24px;">
        <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%; font-size:14px; color:#0f172a;">
          ${row('客户', lead.customer_name)}
          ${row('邮箱', `<a href="mailto:${escapeAttr(lead.customer_email)}" style="color:#1e3a8a;">${escapeHtml(lead.customer_email)}</a>`)}
          ${lead.customer_phone ? row('电话/WhatsApp', escapeHtml(lead.customer_phone)) : ''}
          ${lead.company ? row('公司', escapeHtml(lead.company)) : ''}
          ${row('国家', lead.country || '—')}
          ${row('需求', `${(lead.materials || []).join('/') || '—'} · ${lead.colors ?? '?'} 色 · ${lead.product_category || '—'}`)}
          ${row('推荐机型', (lead.recommended_models || []).join(', ') || '—')}
          ${lead.tonnage_recommendation ? row('吨位', lead.tonnage_recommendation) : ''}
          ${lead.port ? row('港口', lead.port) : ''}
          ${lead.payment_preference ? row('付款方式', lead.payment_preference) : ''}
        </table>

        ${lead.full_summary ? `
        <div style="margin-top:20px; padding:14px 16px; background:#f1f5f9; border-left:3px solid #ea580c; border-radius:6px;">
          <div style="font-size:11px; font-weight:700; letter-spacing:1px; color:#64748b; margin-bottom:6px;">AI 摘要</div>
          <div style="font-size:13px; color:#334155; line-height:1.6; white-space:pre-wrap;">${escapeHtml(lead.full_summary)}</div>
        </div>` : ''}

        <div style="margin-top:24px; text-align:center;">
          <a href="${waUrl}" style="display:inline-block; background:#10b981; color:#fff; padding:11px 22px; border-radius:8px; text-decoration:none; font-weight:600; font-size:14px; margin:0 4px;">💬 WhatsApp 联系</a>
          <a href="mailto:${escapeAttr(lead.customer_email)}" style="display:inline-block; background:#1e3a8a; color:#fff; padding:11px 22px; border-radius:8px; text-decoration:none; font-weight:600; font-size:14px; margin:0 4px;">📧 回邮件</a>
        </div>

        <div style="margin-top:20px; padding-top:16px; border-top:1px solid #e2e8f0; font-size:11px; color:#94a3b8; text-align:center;">
          来自 deyusolemachine.com AI 询盘机器人 ${lead.id ? `· ID: <code style="font-family:monospace;">${escapeHtml(lead.id.slice(0, 8))}</code>` : ''}
          <br>同步备份至飞书机器人和 CRM 后台 /leads
        </div>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        html,
        reply_to: lead.customer_email,
      }),
    });
    if (!res.ok) {
      console.error('[email-notify] resend returned', res.status, await res.text());
    }
  } catch (err) {
    console.error('[email-notify] resend failed:', err);
  }
}

// ─── HTML helpers ────────────────────────────────────────────────────
function row(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:6px 0; color:#64748b; width:100px; vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:6px 0; color:#0f172a; font-weight:500;">${value}</td>
    </tr>`;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!)
  );
}

function escapeAttr(s: string): string {
  return escapeHtml(s);
}
