'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useLocale } from 'next-intl';
import { X, RotateCcw, UserRound } from 'lucide-react';
import { useChatStream } from './useChatStream';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import WhatsAppLink from '@/components/analytics/WhatsAppLink';
import { submitQuickChatLead } from '@/app/actions/submit-quick-chat-lead';
import { trackChatbotStart, trackLeadSubmit } from '@/lib/analytics';

const OPEN_EVENT = 'open-deyu-chat';

/**
 * 客服头像 — 精致的耳麦工程师 illustration,符合 B2B 工业品调性。
 * 用 inline SVG 保证零额外请求 + 任意尺寸清晰。
 */
function SalesAvatar({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      {/* 头部 */}
      <circle cx="32" cy="28" r="14" fill="#FDE6D3" />
      {/* 头发 */}
      <path
        d="M18 26c0-8 6-14 14-14s14 6 14 14c0 1.5-.2 3-.6 4.4-2-2.4-5-4-8.4-4-3.8 0-7 1.8-9.2 4.6-1.2-1.4-2.8-2.4-4.6-3-3-.8-5.2 1-5.2 1V26z"
        fill="#1e3a8a"
      />
      {/* 眼睛 */}
      <ellipse cx="26" cy="29" rx="1.6" ry="2.2" fill="#0f172a" />
      <ellipse cx="38" cy="29" rx="1.6" ry="2.2" fill="#0f172a" />
      {/* 笑脸 */}
      <path
        d="M27 35c1.5 1.8 3.2 2.6 5 2.6s3.5-.8 5-2.6"
        stroke="#0f172a"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
      {/* 腮红 */}
      <circle cx="22" cy="34" r="2" fill="#fda4af" opacity="0.7" />
      <circle cx="42" cy="34" r="2" fill="#fda4af" opacity="0.7" />
      {/* 衬衫领 */}
      <path
        d="M16 56c0-7 7-12 16-12s16 5 16 12v8H16v-8z"
        fill="#1e3a8a"
      />
      <path d="M28 44l4 8 4-8" stroke="#fff" strokeWidth="1.5" fill="none" />
      {/* 耳麦头带 */}
      <path
        d="M18 26c0-8 6-14 14-14s14 6 14 14"
        stroke="#ea580c"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* 耳麦左耳罩 */}
      <rect x="14" y="24" width="5" height="8" rx="2" fill="#ea580c" />
      {/* 耳麦右耳罩 + 麦克风 */}
      <rect x="45" y="24" width="5" height="8" rx="2" fill="#ea580c" />
      <path d="M47 32c0 4-3 7-7 9" stroke="#ea580c" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="39" cy="42" r="2" fill="#ea580c" />
    </svg>
  );
}

export default function ChatWidget() {
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [showQuickContact, setShowQuickContact] = useState(false);
  const [hasFiredStartEvent, setHasFiredStartEvent] = useState(false);
  const { messages, streaming, send, reset } = useChatStream();

  /** Open the chat and fire the analytics event exactly once per session. */
  const openChat = (location: string) => {
    setOpen(true);
    if (!hasFiredStartEvent) {
      trackChatbotStart(location);
      setHasFiredStartEvent(true);
    }
  };

  // External components can open the chat via window event
  useEffect(() => {
    const onOpen = () => openChat('external');
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasFiredStartEvent]);

  const handleSend = (text: string) => {
    const referrerPage = typeof window !== 'undefined' ? window.location.pathname : undefined;
    send(text, referrerPage, locale);
  };

  return (
    <>
      {/* Floating "online sales assistant" pill */}
      {!open && (
        <div className="fixed bottom-6 end-6 z-50 flex flex-col items-end gap-2">
          {/* Hover preview bubble */}
          <div
            className={`bg-white rounded-2xl rounded-br-sm shadow-xl border border-slate-200 px-4 py-3 max-w-[260px] transition-all duration-300 ${
              hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
            }`}
          >
            <p className="text-sm font-semibold text-slate-900 mb-0.5">👋 Hi! Need help?</p>
            <p className="text-xs text-slate-600 leading-relaxed">
              I&apos;ll match you with the right DEYU machine in 5 minutes.
            </p>
          </div>

          {/* Main pill */}
          <button
            onClick={() => openChat('floating')}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="group relative bg-white hover:bg-slate-50 rounded-full shadow-xl hover:shadow-2xl border border-slate-200 pl-1.5 pr-5 py-1.5 flex items-center gap-3 transition-all duration-300 hover:-translate-y-0.5"
          >
            {/* Pulse ring around avatar */}
            <span className="absolute left-1.5 top-1.5 w-12 h-12 rounded-full bg-blue-500/30 animate-ping" />

            {/* Avatar */}
            <span className="relative w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-md overflow-hidden shrink-0">
              <SalesAvatar className="w-11 h-11 -mb-1" />
              {/* Green online dot */}
              <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-green-500 ring-2 ring-white" />
            </span>

            {/* Label */}
            <span className="text-left">
              <span className="block text-sm font-bold text-slate-900 leading-tight">Sales Assistant</span>
              <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Online · Replies in your language
              </span>
            </span>
          </button>
        </div>
      )}

      {/* Chat panel */}
      {open && (
        <div
          className="fixed z-50 bg-white shadow-2xl flex flex-col
                     inset-0 sm:inset-auto sm:bottom-6 sm:end-6 sm:w-[380px] sm:h-[600px] sm:max-h-[80vh]
                     sm:rounded-2xl overflow-hidden border border-slate-200"
        >
          <header className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between shrink-0">
            <div>
              <h3 className="font-semibold text-sm">DEYU Product Advisor</h3>
              <p className="text-[11px] text-blue-100">Ask about machines, materials, MOQ — anything.</p>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  onClick={() => {
                    setShowQuickContact(false);
                    reset();
                  }}
                  className="p-2 rounded-full hover:bg-blue-700 transition-colors"
                  aria-label="Start new conversation"
                  title="Start new conversation"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-full hover:bg-blue-700 transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </header>

          <ChatProgress messages={messages} onQuickContact={() => setShowQuickContact(true)} />

          {showQuickContact ? (
            <QuickContactPanel
              locale={locale}
              onClose={() => setShowQuickContact(false)}
              onSubmitted={() => {
                trackLeadSubmit({ source: 'website_chat_quick_contact' });
              }}
            />
          ) : (
            <ChatMessages messages={messages} streaming={streaming} />
          )}

          <WhatsAppLink
            location="chatbot"
            text="Hi%2C%20I%27d%20like%20to%20talk%20to%20someone%20at%20DEYU"
            className="block text-center text-[11px] text-slate-500 hover:text-green-600 py-2 border-t border-b border-slate-100 bg-slate-50"
          >
            💬 Prefer a human? Chat on WhatsApp
          </WhatsAppLink>

          <ChatInput onSend={handleSend} disabled={streaming || showQuickContact} />
        </div>
      )}
    </>
  );
}

function ChatProgress({
  messages,
  onQuickContact,
}: {
  messages: ReturnType<typeof useChatStream>['messages'];
  onQuickContact: () => void;
}) {
  const userTurns = messages.filter((m) => m.role === 'user').length;
  const usedRecommendation = messages.some((m) => m.toolNames?.includes('recommend_models'));
  const capturedLead = messages.some((m) => m.toolNames?.includes('capture_lead'));

  let step = 1;
  let label = 'Product fit';
  if (capturedLead) {
    step = 4;
    label = 'Contact saved';
  } else if (usedRecommendation || userTurns >= 3) {
    step = 3;
    label = 'Options';
  } else if (userTurns >= 1) {
    step = 2;
    label = 'Mold setup';
  }

  const percent = (step / 4) * 100;

  return (
    <div className="shrink-0 border-b border-slate-200 bg-white px-4 py-2.5">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>
              Step {step} of 4 · {label}
            </span>
            <span>{step < 4 ? '2-3 min left' : 'Done'}</span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-orange-500 transition-all" style={{ width: `${percent}%` }} />
          </div>
        </div>
        <button
          type="button"
          onClick={onQuickContact}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-orange-200 bg-orange-50 px-2.5 py-1.5 text-[11px] font-semibold text-orange-700 hover:bg-orange-100"
        >
          <UserRound className="h-3.5 w-3.5" />
          Leave contact
        </button>
      </div>
    </div>
  );
}

function QuickContactPanel({
  locale,
  onClose,
  onSubmitted,
}: {
  locale: string;
  onClose: () => void;
  onSubmitted: () => void;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const inputClass =
    'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const result = await submitQuickChatLead({
      name,
      email,
      phone,
      country,
      message,
      language: locale,
      source_page: typeof window !== 'undefined' ? window.location.pathname : undefined,
    });

    setSubmitting(false);
    if (!result.success) {
      setError('Please enter your name, email, and WhatsApp number.');
      return;
    }

    setSubmitted(true);
    onSubmitted();
  };

  if (submitted) {
    return (
      <div className="flex-1 overflow-y-auto bg-slate-50 p-4">
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-900">
          Thanks. The DEYU sales team will contact you within 24 hours.
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-4">
      <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-slate-900">Leave your contact</h4>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            Skip the full questionnaire. The DEYU sales team will review your note and follow up.
          </p>
        </div>

        <div className="space-y-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className={inputClass}
            required
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            className={inputClass}
            required
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="WhatsApp / phone"
            className={inputClass}
            required
          />
          <input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Country"
            className={inputClass}
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What machine or product are you interested in?"
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </div>

        {error && <p className="mt-3 text-xs text-red-600">{error}</p>}

        <div className="mt-4 flex gap-2">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 rounded-lg bg-orange-600 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-700 disabled:bg-orange-300"
          >
            {submitting ? 'Sending...' : 'Ask DEYU to contact me'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
}
