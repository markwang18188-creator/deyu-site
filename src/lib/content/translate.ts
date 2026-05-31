import { createDeepSeek, DEEPSEEK_MODEL } from '@/lib/deepseek';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * Spanish translation pipeline for blog posts.
 *
 * Mirrors `generate.ts` patterns: real catalogue context-free (slugs in
 * links must remain identical), strict JSON output, drafts only — humans
 * publish from /admin/content.
 *
 * Why translate instead of regenerate per-language? One source of truth in
 * English keeps facts consistent. Translators (machine or human) get a known
 * canonical text. Cheap to iterate later if quality is off.
 */

const TRANSLATION_SYSTEM_PROMPT = `You are a senior translator localising B2B industrial machinery articles from English to Castilian/Latin-American neutral Spanish (es). The audience is footwear factory owners and machinery buyers in Latin America (Mexico, Colombia, Argentina, Chile, Peru) and Spain.

CRITICAL RULES:
- Translate naturally — preserve meaning and tone, not word order. Use industry-standard Spanish terminology for: shoe sole machinery, injection moulding, mould/molde, clamping force (fuerza de cierre), rotary disc (disco rotatorio), PVC/TPU/TPR (keep as-is, these are material codes), tonnage (tonelaje).
- PRESERVE EXACTLY: every Markdown link target. Specifically, links like \`[DY-1106](/products/dy-1106)\` — translate the visible text if appropriate, but NEVER change the URL slug. The slug is a routing key, not content.
- PRESERVE EXACTLY: every Markdown heading level (## stays ##, ### stays ###), bullet structure, table structure, code blocks.
- PRESERVE EXACTLY: product model numbers (DY-1106, DY-2216TR, etc.) and material codes (PVC, TPU, TPR, TR, EVA — though we don't make EVA, never mention).
- Translate alt-text inside image tags. Translate heading text. Translate body prose.
- DO NOT add new content, examples, or commentary. DO NOT remove sections. DO NOT shorten or expand significantly — target a similar word count to the source.
- DO NOT use overly formal "vosotros" — use neutral "ustedes" or impersonal forms appropriate for LATAM B2B audiences.

Return ONLY a JSON object with these fields:
{
  "title": "translated title, similar length to source",
  "description": "translated meta description, 140-160 chars",
  "body_mdx": "the full translated Markdown body",
  "keywords": ["3-5 Spanish keywords representing the same topics as source"]
}`;

export interface TranslateOutcome {
  ok: boolean;
  message: string;
  sourceId?: string;
  translatedId?: string;
  slug?: string;
  cached?: boolean;
}

/**
 * Translate one blog post from English to Spanish. Inserts the result as a
 * draft row keyed by `(slug, language='es')`. Idempotent: a second call with
 * the same `postId` returns the existing translation row without re-calling
 * the model.
 */
export async function translateBlogPostToSpanish(
  postId: string
): Promise<TranslateOutcome> {
  if (!postId) return { ok: false, message: 'postId required' };

  const supabase = createAdminClient();

  // 1) Load the English source.
  const { data: source, error: sourceErr } = await supabase
    .from('blog_posts')
    .select('id,slug,language,title,description,body_mdx,featured_image_url,keywords,product_refs,status')
    .eq('id', postId)
    .maybeSingle();

  if (sourceErr) return { ok: false, message: `source load failed: ${sourceErr.message}` };
  if (!source) return { ok: false, message: 'source not found' };
  if (source.language !== 'en') {
    return { ok: false, message: `source language is "${source.language}", expected "en"` };
  }

  // 2) Idempotency check — return existing ES row if any.
  const { data: existing } = await supabase
    .from('blog_posts')
    .select('id')
    .eq('slug', source.slug)
    .eq('language', 'es')
    .maybeSingle();

  if (existing) {
    return {
      ok: true,
      message: 'Spanish translation already exists',
      sourceId: source.id,
      translatedId: existing.id,
      slug: source.slug,
      cached: true,
    };
  }

  // 3) Call DeepSeek.
  const client = createDeepSeek();
  const userPrompt = `Translate the following English article to Spanish.

SOURCE TITLE: ${source.title}
SOURCE DESCRIPTION: ${source.description ?? '(none)'}
SOURCE BODY_MDX:
${source.body_mdx}

Return the JSON object now.`;

  let translation: { title: string; description: string; body_mdx: string; keywords?: string[] };
  try {
    const resp = await client.chat.completions.create({
      model: DEEPSEEK_MODEL,
      messages: [
        { role: 'system', content: TRANSLATION_SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 8000,
      temperature: 0.3, // low — translation should be deterministic
    });

    const raw = resp.choices[0]?.message?.content ?? '';
    translation = JSON.parse(raw);
  } catch (err) {
    return { ok: false, message: `model call failed: ${(err as Error).message}` };
  }

  if (!translation.title || !translation.body_mdx) {
    return { ok: false, message: 'model returned incomplete translation' };
  }

  // 4) Sanity check — slug-bearing links should still exist in the body
  //    untranslated. If the model touched a /products/<slug> URL it's a bug
  //    we want to know about (log, don't block — the draft is still
  //    reviewable by hand).
  const sourceSlugs = Array.from(source.body_mdx.matchAll(/\/products\/([a-z0-9-]+)/g))
    .map((m) => (m as RegExpMatchArray)[1]);
  const translatedSlugs = Array.from(translation.body_mdx.matchAll(/\/products\/([a-z0-9-]+)/g))
    .map((m) => (m as RegExpMatchArray)[1]);
  const missing = sourceSlugs.filter((s) => !translatedSlugs.includes(s));
  if (missing.length > 0) {
    console.warn(
      `[translate] slug drift on ${source.slug}: missing ${missing.join(', ')} in translated body`
    );
  }

  // 5) Insert the draft.
  const { data: inserted, error: insErr } = await supabase
    .from('blog_posts')
    .insert({
      slug: source.slug,
      language: 'es',
      title: translation.title.slice(0, 200),
      description: translation.description?.slice(0, 300) ?? null,
      body_mdx: translation.body_mdx,
      keywords: translation.keywords?.length ? translation.keywords : source.keywords,
      product_refs: source.product_refs,
      featured_image_url: source.featured_image_url,
      status: 'draft',
      translated_from: source.id,
    })
    .select('id')
    .single();

  if (insErr) return { ok: false, message: `insert failed: ${insErr.message}` };

  return {
    ok: true,
    message: 'Spanish draft created',
    sourceId: source.id,
    translatedId: inserted!.id,
    slug: source.slug,
    cached: false,
  };
}
