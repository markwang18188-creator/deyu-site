'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { BellRing, Check, LoaderCircle, LockKeyhole, LogOut, Save, X } from 'lucide-react';

type NotificationKey =
  | 'daily_world_news'
  | 'boc_usd_rate'
  | 'company_buyback'
  | 'insider_increase'
  | 'fund_self_purchase'
  | 'major_state_funds'
  | 'system_failure_alerts';

type Settings = Record<NotificationKey, boolean>;

interface SettingsResponse {
  settings: Settings;
  updatedAt: string;
}

const ROWS: Array<{
  key: NotificationKey;
  name: string;
  description: string;
  frequency: string;
  level: '常规' | '重要' | '最高';
}> = [
  {
    key: 'daily_world_news',
    name: '世界财经与重大新闻早报',
    description: '前一日世界财经、国际重大新闻及中文摘要',
    frequency: '每天 07:30',
    level: '常规',
  },
  {
    key: 'boc_usd_rate',
    name: '中国银行美元现汇买入价',
    description: '中行官方报价、发布时间及现汇卖出价',
    frequency: '每天 07:30',
    level: '常规',
  },
  {
    key: 'company_buyback',
    name: '上市公司股份回购',
    description: '回购方案、首次实施、金额调整及完成公告',
    frequency: '每 5 分钟',
    level: '重要',
  },
  {
    key: 'insider_increase',
    name: '高管及重要股东增持',
    description: '董事、高管、控股股东和实际控制人增持',
    frequency: '每 5 分钟',
    level: '重要',
  },
  {
    key: 'fund_self_purchase',
    name: '基金公司自购',
    description: '公募或基金公司使用自有资金申购旗下基金、ETF',
    frequency: '每 5 分钟',
    level: '重要',
  },
  {
    key: 'major_state_funds',
    name: '国家级大资金入市',
    description: '央行、汇金、国家队及长期资金3000亿元以上安排',
    frequency: '每 5 分钟',
    level: '最高',
  },
  {
    key: 'system_failure_alerts',
    name: '系统运行失败告警',
    description: '数据源、摘要或发送服务连续失败时提醒',
    frequency: '异常时',
    level: '重要',
  },
];

const STORAGE_KEY = 'deyu-notification-settings-password';

async function requestSettings(password: string, init?: RequestInit): Promise<SettingsResponse> {
  const response = await fetch('/api/notification-settings', {
    ...init,
    headers: {
      Authorization: `Bearer ${password}`,
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  });
  if (response.status === 401) throw new Error('密码不正确');
  if (!response.ok) throw new Error('设置服务暂时不可用，请稍后重试');
  return response.json() as Promise<SettingsResponse>;
}

export default function NotificationSettingsPanel() {
  const [password, setPassword] = useState('');
  const [settings, setSettings] = useState<Settings | null>(null);
  const [savedSettings, setSavedSettings] = useState<Settings | null>(null);
  const [updatedAt, setUpdatedAt] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const dirty = useMemo(
    () => !!settings && !!savedSettings && JSON.stringify(settings) !== JSON.stringify(savedSettings),
    [settings, savedSettings],
  );

  async function loadWithPassword(candidate: string) {
    setLoading(true);
    setError('');
    try {
      const document = await requestSettings(candidate);
      setPassword(candidate);
      setSettings(document.settings);
      setSavedSettings(document.settings);
      setUpdatedAt(document.updatedAt);
      window.localStorage.setItem(STORAGE_KEY, candidate);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : '无法登录');
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) void loadWithPassword(stored);
    else setLoading(false);
  }, []);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password.trim()) await loadWithPassword(password.trim());
  }

  async function handleSave() {
    if (!settings) return;
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const document = await requestSettings(password, {
        method: 'PUT',
        body: JSON.stringify({ settings }),
      });
      setSettings(document.settings);
      setSavedSettings(document.settings);
      setUpdatedAt(document.updatedAt);
      setMessage('设置已保存，VPS 下一轮运行时生效。');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : '保存失败');
    } finally {
      setSaving(false);
    }
  }

  function logout() {
    window.localStorage.removeItem(STORAGE_KEY);
    setPassword('');
    setSettings(null);
    setSavedSettings(null);
    setMessage('');
    setError('');
  }

  if (loading) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center text-slate-500">
        <LoaderCircle className="mr-2 size-5 animate-spin" /> 正在读取设置…
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md items-center px-4 py-12">
        <div className="w-full rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-blue-950 text-white">
            <LockKeyhole className="size-7" />
          </div>
          <h1 className="mt-5 text-center text-2xl font-bold text-slate-950">通知管理中心</h1>
          <p className="mt-2 text-center text-sm leading-6 text-slate-500">
            输入管理密码后，在手机上勾选需要保留的飞书通知。
          </p>
          <form onSubmit={handleLogin} className="mt-7 space-y-4">
            <label className="block text-sm font-semibold text-slate-700" htmlFor="notification-password">
              管理密码
            </label>
            <input
              id="notification-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
              placeholder="请输入密码"
              required
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              className="h-12 w-full rounded-xl bg-blue-950 font-semibold text-white transition active:scale-[0.99]"
            >
              登录管理
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
        <div className="bg-gradient-to-br from-blue-950 to-blue-800 px-5 py-7 text-white sm:px-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-blue-200">
                <BellRing className="size-4" /> 飞书通知
              </div>
              <h1 className="mt-2 text-2xl font-bold sm:text-3xl">通知管理中心</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100">
                勾选代表继续接收，取消勾选代表停止。修改后请点击底部“保存设置”。
              </p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="flex shrink-0 items-center gap-1 rounded-lg border border-white/20 px-3 py-2 text-xs font-semibold text-white/90"
            >
              <LogOut className="size-3.5" /> 退出
            </button>
          </div>
        </div>

        <div className="hidden grid-cols-[minmax(0,1fr)_130px_110px] border-b border-slate-200 bg-slate-50 px-8 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 sm:grid">
          <span>通知内容</span><span>检查频率</span><span className="text-center">接收</span>
        </div>

        <div className="divide-y divide-slate-100">
          {ROWS.map((row) => {
            const enabled = settings[row.key];
            return (
              <label
                key={row.key}
                className="grid cursor-pointer grid-cols-[1fr_auto] gap-4 px-5 py-5 transition hover:bg-slate-50 sm:grid-cols-[minmax(0,1fr)_130px_110px] sm:items-center sm:px-8"
              >
                <span>
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-900">{row.name}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${row.level === '最高' ? 'bg-red-100 text-red-700' : row.level === '重要' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                      {row.level}
                    </span>
                  </span>
                  <span className="mt-1 block text-sm leading-5 text-slate-500">{row.description}</span>
                  <span className="mt-2 block text-xs font-medium text-slate-400 sm:hidden">{row.frequency}</span>
                </span>
                <span className="hidden text-sm font-medium text-slate-600 sm:block">{row.frequency}</span>
                <span className="flex items-center justify-end gap-2 sm:justify-center">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={enabled}
                    onChange={() => setSettings({ ...settings, [row.key]: !enabled })}
                  />
                  <span className={`flex size-11 items-center justify-center rounded-xl border-2 transition ${enabled ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300 bg-white text-slate-400'}`}>
                    {enabled ? <Check className="size-6 stroke-[3]" /> : <X className="size-6" />}
                  </span>
                </span>
              </label>
            );
          })}
        </div>

        <div className="sticky bottom-0 border-t border-slate-200 bg-white/95 px-5 py-5 backdrop-blur sm:px-8">
          {message && <p className="mb-3 text-sm font-medium text-emerald-700">{message}</p>}
          {error && <p className="mb-3 text-sm font-medium text-red-600">{error}</p>}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-400">
              上次保存：{updatedAt ? new Date(updatedAt).toLocaleString('zh-CN') : '—'}
            </p>
            <button
              type="button"
              onClick={handleSave}
              disabled={!dirty || saving}
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 font-bold text-white transition disabled:cursor-not-allowed disabled:bg-slate-300 active:scale-[0.99]"
            >
              {saving ? <LoaderCircle className="size-5 animate-spin" /> : <Save className="size-5" />}
              {saving ? '正在保存…' : dirty ? '保存设置' : '设置已同步'}
            </button>
          </div>
        </div>
      </div>
      <p className="mt-5 text-center text-xs leading-5 text-slate-400">
        关闭某类提醒后，系统仍会记录已发现事件；重新开启时不会补发关闭期间的旧消息。
      </p>
    </div>
  );
}
