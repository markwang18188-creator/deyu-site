'use client';

import { Bot } from 'lucide-react';

export default function ChatbotBanner() {
  const openChat = () => {
    window.dispatchEvent(new Event('open-deyu-chat'));
  };

  return (
    <button
      onClick={openChat}
      className="w-full bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-xl px-4 py-3 flex items-center justify-between gap-3 text-left transition-colors group"
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center shrink-0">
          <Bot className="w-5 h-5" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">
            Not sure which DEYU machine fits your production?
          </p>
          <p className="text-xs text-slate-600 truncate">
            Get a 5-minute AI-powered recommendation tailored to your materials, colors, and volume.
          </p>
        </div>
      </div>
      <span className="text-orange-600 font-semibold text-sm group-hover:translate-x-1 transition-transform shrink-0">
        →
      </span>
    </button>
  );
}
