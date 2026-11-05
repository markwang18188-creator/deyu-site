import type { Metadata } from 'next';
import NotificationSettingsPanel from '@/components/notifications/NotificationSettingsPanel';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '通知管理中心',
  description: '管理飞书自动通知的开启与关闭状态。',
  robots: { index: false, follow: false, nocache: true },
};

export default function NotificationSettingsPage() {
  return (
    <main className="min-h-[75vh] bg-slate-50">
      <NotificationSettingsPanel />
    </main>
  );
}
