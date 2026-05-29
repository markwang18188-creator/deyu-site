import { createDeepSeek, DEEPSEEK_MODEL } from '@/lib/deepseek';
import { createAdminClient } from '@/lib/supabase/admin';
import { products } from '@/data/products';

/**
 * SEO article generator ("电饭锅").
 *
 * Pulls one pending topic from `content_topics`, asks DeepSeek to write a
 * 1500-2500 word English MDX article, and inserts it into `blog_posts` as a
 * DRAFT (status='draft'). A human approves it via /admin/content before it
 * goes live — we never auto-publish, per the "do not fabricate" rule.
 *
 * Guardrails against fabrication:
 *  - The model is given the REAL product catalog (slugs/models/categories) and
 *    told to only link to those slugs.
 *  - product_refs returned by the model are filtered against real slugs.
 *  - The prompt forbids inventing numeric specs, prices, or customer names.
 */

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 70);
}

interface GeneratedArticle {
  slug?: string;
  title: string;
  description: string;
  body_mdx: string;
  keywords?: string[];
  product_refs?: string[];
}

export interface GenerateOutcome {
  ok: boolean;
  message: string;
  topicId?: string;
  slug?: string;
  blogPostId?: string;
}

const SYSTEM_PROMPT = `You are an SEO content writer for DEYU (Wenzhou Deyu Machinery Co., Ltd), a Chinese manufacturer of shoe sole injection moulding machines (PVC, TPR, TPU, TR materials; single/dual/multi colour; rotary disc and slide types; air-blowing machines).

Write a long-form, genuinely useful B2B article in ENGLISH for an audience of footwear factory owners and machinery buyers (India, Brazil, Vietnam, Turkey, Middle East, etc.).

STRICT RULES:
- 1500-2500 words. Helpful, specific, not fluffy.
- Target exactly ONE primary keyword (given by the user) — use it in the title, the first paragraph, and a few headings naturally. Do NOT keyword-stuff.
- Output GitHub-flavoured Markdown / MDX in the "body_mdx" field. Use ## and ### headings, bullet lists, and at most one Markdown table. Do NOT include an H1 (the page renders the title separately). Do NOT include front-matter.
- Internal links: you may ONLY link to product pages using the EXACT slugs from the provided catalog, formatted as [DY-XXXX](/products/<slug>). Insert 2-4 such internal links where relevant. Never invent a slug.
- DO NOT invent numeric specifications, prices, production rates, certifications, or customer names. Speak about specs in general terms unless the catalog summary states them. DEYU does NOT make EVA machines — never mention EVA.
- End with a short call-to-action paragraph inviting the reader to request a quote (link to /contact or /products).

Return ONLY a JSON object with these fields:
{
  "slug": "kebab-case-url-slug (<=70 chars, no leading/trailing dash)",
  "title": "SEO title <= 60 chars including the keyword",
  "description": "meta description, 140-160 chars, includes the keyword",
  "body_mdx": "the full Markdown article body",
  "keywords": ["primary keyword", "2-4 related terms"],
  "product_refs": ["slugs you linked to"]
}`;

export async function generateOneArticle(): Promise<GenerateOutcome> {
  const supabase = createAdminClient();

  // 1) Claim the oldest pending topic.
  const { data: topics, error: topicErr } = await supabase
    .from('content_topics')
    .select('id, keyword, intent, target_product_slug')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
    .limit(1);

  if (topicErr) return { ok: false, message: `topic query failed: ${topicErr.message}` };
  if (!topics || topics.length === 0) return { ok: false, message: 'no pending topics' };

  const topic = topics[0];
  await supabase
    .from('content_topics')
    .update({ status: 'generating', updated_at: new Date().toISOString() })
    .eq('id', topic.id);

  try {
    // 2) Real product catalog (slugs the model is allowed to link to).
    const catalog = products.map((p) => ({
      slug: p.slug,
      model: p.model,
      category: p.category,
      summary: p.shortDescription,
    }));

    // 3) Generate.
    const client = createDeepSeek();
    const userPrompt = `PRIMARY KEYWORD: "${topic.keyword}"
SEARCH INTENT: ${topic.intent ?? 'informational'}

PRODUCT CATALOG (only link to these exact slugs):
${JSON.stringify(catalog, null, 2)}

Write the article now and return the JSON object.`;

    const resp = await client.chat.completions.create({
      model: DEEPSEEK_MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 8000,
      temperature: 0.7,
    });

    const raw = resp.choices[0]?.message?.content ?? '';
    let article: GeneratedArticle;
    try {
      article = JSON.parse(raw) as GeneratedArticle;
    } catch {
      throw new Error('model did not return valid JSON');
    }
    if (!article.title || !article.body_mdx) {
      throw new Error('model returned incomplete article');
    }

    // 4) Validate product_refs against real slugs (drop any hallucinated slug).
    const realSlugs = new Set(products.map((p) => p.slug));
    const validRefs = (article.product_refs ?? []).filter((s) => realSlugs.has(s));

    // 5) Ensure a unique slug.
    let slug = slugify(article.slug || article.title);
    if (!slug) slug = slugify(topic.keyword);
    const { data: clash } = await supabase
      .from('blog_posts')
      .select('slug')
      .eq('slug', slug)
      .maybeSingle();
    if (clash) slug = `${slug}-${Date.now().toString(36).slice(-4)}`;

    // 6) Insert as DRAFT.
    const { data: post, error: insErr } = await supabase
      .from('blog_posts')
      .insert({
        slug,
        language: 'en',
        title: article.title.slice(0, 200),
        description: article.description?.slice(0, 300) ?? null,
        body_mdx: article.body_mdx,
        keywords: article.keywords?.length ? article.keywords : [topic.keyword],
        product_refs: validRefs,
        status: 'draft',
      })
      .select('id')
      .single();

    if (insErr) throw new Error(`blog insert failed: ${insErr.message}`);

    // 7) Mark topic drafted + link.
    await supabase
      .from('content_topics')
      .update({
        status: 'drafted',
        blog_post_id: post.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', topic.id);

    return {
      ok: true,
      message: `drafted "${article.title}"`,
      topicId: topic.id,
      slug,
      blogPostId: post.id as string,
    };
  } catch (err) {
    // Revert topic so it can be retried next run.
    await supabase
      .from('content_topics')
      .update({ status: 'pending', updated_at: new Date().toISOString() })
      .eq('id', topic.id);
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, message, topicId: topic.id };
  }
}
