'use client';

import { useEffect, useRef } from 'react';
import type { ChatMessage } from './useChatStream';

interface Props {
  messages: ChatMessage[];
  streaming: boolean;
}

export default function ChatMessages({ messages, streaming }: Props) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
        <div className="bg-white rounded-2xl rounded-tl-sm p-3 max-w-[85%] shadow-sm text-sm">
          <p className="font-medium text-slate-900 mb-1">Hi! I&apos;m DEYU&apos;s product advisor.</p>
          <p className="text-slate-700">
            What type of shoe soles do you produce? (e.g. PVC/TPR sandals, TPU football cleats,
            dual-color slippers, TR work-shoe outsoles)
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
      {messages.map((msg, i) => (
        <MessageBubble key={i} message={msg} />
      ))}
      {streaming &&
        messages[messages.length - 1]?.role === 'assistant' &&
        !messages[messages.length - 1]?.content && <TypingIndicator />}
      <div ref={endRef} />
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={
          isUser
            ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm p-3 max-w-[85%] text-sm whitespace-pre-wrap shadow-sm'
            : 'bg-white text-slate-900 rounded-2xl rounded-tl-sm p-3 max-w-[85%] text-sm whitespace-pre-wrap shadow-sm'
        }
      >
        {renderContent(message.content)}
        {message.toolNames && message.toolNames.length > 0 && (
          <p className="text-[10px] mt-2 text-slate-400 italic">
            {message.toolNames.map(prettyTool).join(' · ')}
          </p>
        )}
      </div>
    </div>
  );
}

function prettyTool(name: string): string {
  switch (name) {
    case 'recommend_models':
      return '🔍 Matching models';
    case 'get_product_details':
      return '📋 Loading specs';
    case 'capture_lead':
      return '✅ Saving enquiry';
    case 'handoff_to_whatsapp':
      return '💬 Connecting to WhatsApp';
    default:
      return name;
  }
}

// Render content with auto-linked URLs and basic markdown bold/links.
function renderContent(text: string) {
  const parts: Array<string | { url: string; label: string }> = [];
  const regex = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)|(https?:\/\/[^\s)]+)/g;
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    if (match[1] && match[2]) parts.push({ url: match[2], label: match[1] });
    else if (match[3]) parts.push({ url: match[3], label: match[3] });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));

  return parts.map((p, i) =>
    typeof p === 'string' ? (
      <span key={i}>{renderBold(p)}</span>
    ) : (
      <a
        key={i}
        href={p.url}
        target="_blank"
        rel="noopener noreferrer"
        className="underline text-blue-600 hover:text-blue-700 break-all"
      >
        {p.label}
      </a>
    )
  );
}

function renderBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith('**') && p.endsWith('**') ? (
      <strong key={i}>{p.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{p}</span>
    )
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-white rounded-2xl rounded-tl-sm p-3 shadow-sm flex gap-1">
        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
      </div>
    </div>
  );
}
