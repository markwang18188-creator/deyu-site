/**
 * 统一的转化事件埋点封装。
 *
 * 同时打到:
 *  - Google Analytics 4 (gtag) — 用于看趋势 / 设转化目标 / 接 Google Ads
 *  - Microsoft Clarity — 用 setTag,可以在 session 录像里按事件过滤
 *  - Vercel Analytics — 已经全自动收 page-view,这里不重复发
 *
 * 没装(env 变量空)就静默跳过。生产环境之外可加 console.debug 看埋点是否
 * 被触发到位。
 */

type GtagEventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (command: string, eventName: string, params?: GtagEventParams) => void;
    clarity?: (command: 'set' | 'identify' | 'consent', ...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/**
 * 发一条自定义事件。
 *
 * `name` 用 snake_case 跟 GA4 推荐事件名风格保持一致。常用约定:
 *  - `whatsapp_click`        WhatsApp 按钮点击
 *  - `chatbot_start`         聊天机器人打开
 *  - `chatbot_message_sent`  用户在聊天里发了消息(可选,非必填)
 *  - `generate_lead`         询盘提交成功(GA4 推荐事件,可标记为转化)
 *  - `quote_request`         向 Contact 页提交报价请求
 *
 * `params` 任意键值,GA4 自定义维度可在控制台后续注册。常用字段:
 *  - location:  按钮所在位置 ('header' | 'product_detail' | 'chatbot' | 'footer')
 *  - machine:   涉及的产品 slug 或 model
 *  - country:   询盘国家
 *  - source:    询盘来源 ('website_chatbot' | 'contact_form' | 'whatsapp')
 */
export function trackEvent(name: string, params: GtagEventParams = {}): void {
  if (typeof window === 'undefined') return;

  // GA4
  try {
    window.gtag?.('event', name, params);
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.debug('[analytics] gtag failed', err);
    }
  }

  // Clarity — setTag 在录像上打标签,后续可按标签过滤回放
  try {
    window.clarity?.('set', name, JSON.stringify(params));
  } catch {
    /* clarity 没装,静默 */
  }

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.debug('[analytics]', name, params);
  }
}

/** 短便捷:WhatsApp 按钮点击 */
export const trackWhatsAppClick = (location: string, machine?: string) =>
  trackEvent('whatsapp_click', { location, machine });

/** 短便捷:Chatbot 启动(首次打开) */
export const trackChatbotStart = (location: string = 'floating') =>
  trackEvent('chatbot_start', { location });

/** 短便捷:询盘提交成功 — GA4 推荐事件名,后台可一键标为转化 */
export const trackLeadSubmit = (params: {
  source: string;
  country?: string;
  machine?: string;
  value?: number; // 估值,有就传,后续做 ROI 用
}) => trackEvent('generate_lead', params);
