import type { Metadata } from 'next';
import { revalidatePath } from 'next/cache';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { createAdminClient } from '@/lib/supabase/admin';
import { translateBlogPostToSpanish } from '@/lib/content/translate';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Content Review',
  robots: { index: false, follow: false },
};

function checkKey(key?: string): boolean {
  const secret = process.env.CONTENT_CRON_SECRET || process.env.CRON_SECRET;
  return !!secret && key === secret;
}

interface DraftRow {
  id: string;
  slug: string;
  language: string;
  title: string;
  description: string | null;
  body_mdx: string;
  keywords: string[] | null;
  product_refs: string[] | null;
  created_at: string;
  translated_from: string | null;
}

interface EnglishPublishedRow {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  published_at: string | null;
  has_es: boolean;
}

const LANG_LABEL: Record<string, { label: string; cls: string }> = {
  en: { label: 'EN', cls: 'bg-blue-50 text-[#1e3a8a]' },
  es: { label: 'ES', cls: 'bg-orange-50 text-[#ea580c]' },
  pt: { label: 'PT', cls: 'bg-emerald-50 text-emerald-700' },
  tr: { label: 'TR', cls: 'bg-red-50 text-red-700' },
  ar: { label: 'AR', cls: 'bg-purple-50 text-purple-700' },
};

/** Server action: flip a draft to published + revalidate the blog & sitemap. */
async function publishDraft(formData: FormData) {
  'use server';
  const key = formData.get('key')?.toString();
  if (!checkKey(key)) return;
  const id = formData.get('id')?.toString();
  if (!id) return;

  const supabase = createAdminClient();
  const now = new Date().toISOString();
  await supabase
    .from('blog_posts')
    .update({ status: 'published', published_at: now, updated_at: now })
    .eq('id', id);
  await supabase
    .from('content_topics')
    .update({ status: 'published', updated_at: now })
    .eq('blog_post_id', id);

  revalidatePath('/[locale]/blog', 'page');
  revalidatePath('/[locale]/blog/[slug]', 'page');
  revalidatePath('/sitemap.xml');
}

/** Server action: translate an English published post to Spanish (creates draft). */
async function translateToSpanish(formData: FormData) {
  'use server';
  const key = formData.get('key')?.toString();
  if (!checkKey(key)) return;
  const id = formData.get('id')?.toString();
  if (!id) return;
  await translateBlogPostToSpanish(id);
  revalidatePath('/[locale]/admin/content', 'page');
}

export default async function AdminContentPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>;
}) {
  const { key } = await searchParams;

  if (!checkKey(key)) {
    return (
      <main className="max-w-xl mx-auto px-4 py-24 text-center">
        <h1 className="text-xl font-bold text-[#0f172a]">Content Review</h1>
        <p className="mt-3 text-sm text-[#64748b]">
          Unauthorized. Append <code>?key=YOUR_SECRET</code> to the URL.
        </p>
      </main>
    );
  }

  const supabase = createAdminClient();

  // ── Drafts (any language) ──────────────────────────────────────────────
  const { data: draftData, error: draftErr } = await supabase
    .from('blog_posts')
    .select('id,slug,language,title,description,body_mdx,keywords,product_refs,created_at,translated_from')
    .eq('status', 'draft')
    .order('created_at', { ascending: false });
  const drafts = (draftData ?? []) as DraftRow[];

  // ── English published posts (so we can offer "translate to ES") ────────
  const { data: pubData } = await supabase
    .from('blog_posts')
    .select('id,slug,title,description,language,published_at,status')
    .eq('language', 'en')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  // ── ES rows (any status) — used to flag "already has Spanish" ──────────
  const { data: esData } = await supabase
    .from('blog_posts')
    .select('slug')
    .eq('language', 'es');
  const slugsWithEs = new Set((esData ?? []).map((r: { slug: string }) => r.slug));

  const englishPublished: EnglishPublishedRow[] = (pubData ?? []).map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    description: p.description,
    published_at: p.published_at,
    has_es: slugsWithEs.has(p.slug),
  }));

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold text-[#0f172a]">
        Content Review — {drafts.length} draft{drafts.length === 1 ? '' : 's'}
      </h1>
      <p className="mt-2 text-sm text-[#64748b]">
        Articles generated and translated by the pipeline. Review, then publish.
        Reject by deleting the row in Supabase.
      </p>

      {draftErr && (
        <p className="mt-6 text-sm text-red-600">Load error: {draftErr.message}</p>
      )}

      {drafts.length === 0 && !draftErr && (
        <p className="mt-10 text-[#64748b]">No drafts waiting. 🎉</p>
      )}

      <div className="mt-8 space-y-10">
        {drafts.map((d) => {
          const langMeta = LANG_LABEL[d.language] ?? { label: d.language.toUpperCase(), cls: 'bg-zinc-100 text-zinc-700' };
          return (
            <article
              key={d.id}
              className="border border-[#e2e8f0] rounded-xl p-6 bg-white shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded ${langMeta.cls}`}>
                      {langMeta.label}
                    </span>
                    {d.translated_from && (
                      <span className="text-[10px] text-[#94a3b8]">translated</span>
                    )}
                  </div>
                  <h2 className="text-lg font-bold text-[#0f172a] mt-1">{d.title}</h2>
                  <p className="text-xs text-[#94a3b8] mt-1">
                    /{d.language === 'en' ? '' : d.language + '/'}blog/{d.slug} · {new Date(d.created_at).toLocaleString('en-GB')}
                  </p>
                </div>
                <form action={publishDraft}>
                  <input type="hidden" name="id" value={d.id} />
                  <input type="hidden" name="key" value={key} />
                  <button
                    type="submit"
                    className="shrink-0 rounded-md bg-[#16a34a] hover:bg-[#15803d] text-white text-sm font-semibold px-4 py-2 transition-colors"
                  >
                    Publish
                  </button>
                </form>
              </div>

              {d.description && (
                <p className="mt-3 text-sm text-[#475569] italic">{d.description}</p>
              )}

              <div className="mt-2 flex flex-wrap gap-1.5">
                {(d.keywords ?? []).map((k) => (
                  <span
                    key={k}
                    className="text-[11px] bg-orange-50 text-[#ea580c] px-2 py-0.5 rounded-full"
                  >
                    {k}
                  </span>
                ))}
                {(d.product_refs ?? []).map((s) => (
                  <span
                    key={s}
                    className="text-[11px] bg-blue-50 text-[#1e3a8a] px-2 py-0.5 rounded-full"
                  >
                    → /products/{s}
                  </span>
                ))}
              </div>

              <details className="mt-4 group">
                <summary className="cursor-pointer text-sm font-semibold text-[#1e3a8a] select-none">
                  Preview article
                </summary>
                <div className="prose prose-slate max-w-none mt-4 prose-headings:text-[#0f172a] prose-a:text-[#1e3a8a]">
                  <MDXRemote source={d.body_mdx} />
                </div>
              </details>
            </article>
          );
        })}
      </div>

      {/* ─────────────────────────────────────────────────────────────────
          Spanish translation tray
          Shows every English published article with a one-click translate
          action (or a "✓ ES exists" badge when already done).
         ───────────────────────────────────────────────────────────────── */}
      <section className="mt-16 pt-10 border-t border-[#e2e8f0]">
        <h2 className="text-xl font-bold text-[#0f172a]">
          Spanish Translations · {englishPublished.filter((p) => !p.has_es).length} pending
        </h2>
        <p className="mt-2 text-sm text-[#64748b]">
          Click "翻译为西语" to create a Spanish draft for an English article.
          Drafts appear above for review before publishing.
        </p>

        <div className="mt-6 space-y-2">
          {englishPublished.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-3 p-3 rounded-lg border border-[#e2e8f0] bg-white"
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-[#0f172a] truncate">
                  {p.title}
                </div>
                <div className="text-xs text-[#94a3b8] mt-0.5 font-mono truncate">
                  /blog/{p.slug}
                </div>
              </div>
              {p.has_es ? (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-md shrink-0">
                  ✓ ES exists
                </span>
              ) : (
                <form action={translateToSpanish}>
                  <input type="hidden" name="id" value={p.id} />
                  <input type="hidden" name="key" value={key} />
                  <button
                    type="submit"
                    className="text-xs font-semibold bg-[#ea580c] hover:bg-[#c2410c] text-white px-3 py-1.5 rounded-md transition-colors shrink-0"
                  >
                    翻译为西语 →
                  </button>
                </form>
              )}
            </div>
          ))}
          {englishPublished.length === 0 && (
            <p className="text-sm text-[#94a3b8]">No published English articles yet.</p>
          )}
        </div>
      </section>
    </main>
  );
}
