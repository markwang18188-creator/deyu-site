import 'server-only';
import { createAdminClient } from '@/lib/supabase/admin';

export interface SharedKnowledgeEntry {
  id: string;
  title: string;
  category: string;
  content: string;
  keywords: string[];
  enabled: boolean;
  source?: string;
  updatedAt?: string;
}

export interface SharedKnowledgeDocument {
  version: 1;
  revision: string;
  updatedAt: string;
  entries: SharedKnowledgeEntry[];
}

const BUCKET = 'deyu-system-config';
const OBJECT_PATH = 'ai-assistant/shared-knowledge.json';
const MAX_ENTRIES = 300;

function cleanText(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export function validateSharedKnowledge(value: unknown): SharedKnowledgeDocument | null {
  if (!value || typeof value !== 'object') return null;
  const input = value as { entries?: unknown; revision?: unknown; updatedAt?: unknown };
  if (!Array.isArray(input.entries) || input.entries.length > MAX_ENTRIES) return null;
  const entries: SharedKnowledgeEntry[] = [];
  for (const raw of input.entries) {
    if (!raw || typeof raw !== 'object') return null;
    const item = raw as Record<string, unknown>;
    const id = cleanText(item.id, 120);
    const title = cleanText(item.title, 120);
    const content = cleanText(item.content, 6000);
    if (!id || !title || !content) return null;
    entries.push({
      id,
      title,
      category: cleanText(item.category, 80) || '其他',
      content,
      keywords: Array.isArray(item.keywords)
        ? item.keywords.map((keyword) => cleanText(keyword, 80)).filter(Boolean).slice(0, 40)
        : [],
      enabled: item.enabled !== false,
      source: cleanText(item.source, 120) || undefined,
      updatedAt: cleanText(item.updatedAt, 50) || undefined,
    });
  }
  return {
    version: 1,
    revision: cleanText(input.revision, 100) || crypto.randomUUID(),
    updatedAt: cleanText(input.updatedAt, 50) || new Date().toISOString(),
    entries,
  };
}

async function ensureBucket(): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.storage.createBucket(BUCKET, {
    public: false,
    fileSizeLimit: 2 * 1024 * 1024,
    allowedMimeTypes: ['application/json'],
  });
  if (error && !/already exists|duplicate/i.test(error.message)) {
    throw new Error(`Unable to create knowledge storage: ${error.message}`);
  }
}

export async function readSharedKnowledge(): Promise<SharedKnowledgeDocument> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.storage.from(BUCKET).download(OBJECT_PATH);
  if (!error && data) {
    const parsed = validateSharedKnowledge(JSON.parse(await data.text()));
    if (parsed) return parsed;
  }
  return { version: 1, revision: 'empty', updatedAt: '', entries: [] };
}

export async function writeSharedKnowledge(
  document: SharedKnowledgeDocument,
): Promise<SharedKnowledgeDocument> {
  await ensureBucket();
  const normalized = validateSharedKnowledge(document);
  if (!normalized) throw new Error('Invalid shared knowledge document');
  const supabase = createAdminClient();
  const { error } = await supabase.storage.from(BUCKET).upload(
    OBJECT_PATH,
    JSON.stringify(normalized, null, 2),
    { contentType: 'application/json', upsert: true },
  );
  if (error) throw new Error(`Unable to save shared knowledge: ${error.message}`);
  return normalized;
}

export function formatSharedKnowledgeForPrompt(document: SharedKnowledgeDocument): string {
  const enabled = document.entries.filter((entry) => entry.enabled);
  if (!enabled.length) return '';
  return JSON.stringify(
    enabled.map(({ title, category, content, keywords, source }) => ({
      title,
      category,
      content,
      keywords,
      source,
    })),
  );
}
