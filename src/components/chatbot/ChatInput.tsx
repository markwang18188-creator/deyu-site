'use client';

import { useState, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';

interface Props {
  onSend: (text: string) => void;
  disabled: boolean;
}

export default function ChatInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState('');

  const submit = () => {
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue('');
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="border-t bg-white p-3">
      <div className="flex items-end gap-2">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Type your message…"
          rows={1}
          disabled={disabled}
          className="flex-1 resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-50 disabled:text-slate-400 max-h-32"
          style={{ minHeight: '40px' }}
        />
        <button
          onClick={submit}
          disabled={disabled || !value.trim()}
          className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed shrink-0 transition-colors"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
      <p className="text-[10px] text-slate-400 mt-2 text-center">
        AI advisor · DEYU sales team follows up within 24h
      </p>
    </div>
  );
}
