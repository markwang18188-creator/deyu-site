'use client';

import { useEffect, useState } from 'react';
import { X, RotateCcw } from 'lucide-react';
import { useChatStream } from './useChatStream';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';

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
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { messages, streaming, send, reset } = useChatStream();

  // External components can open the chat via window event
  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  const handleSend = (text: string) => {
    const referrerPage = typeof window !== 'undefined' ? window.location.pathname : undefined;
    send(text, referrerPage);
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
            onClick={() => setOpen(true)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            aria-label="Open sales assistant chat"
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
                  onClick={reset}
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

          <ChatMessages messages={messages} streaming={streaming} />

          <a
            href="https://wa.me/8613615778781?text=Hi%2C%20I%27d%20like%20to%20talk%20to%20someone%20at%20DEYU"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center text-[11px] text-slate-500 hover:text-green-600 py-2 border-t border-b border-slate-100 bg-slate-50"
          >
            💬 Prefer a human? Chat on WhatsApp
          </a>

          <ChatInput onSend={handleSend} disabled={streaming} />
        </div>
      )}
    </>
  );
}
