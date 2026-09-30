import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

function authorized(request: NextRequest): boolean {
  const secret = process.env.CONTENT_CRON_SECRET || process.env.CRON_SECRET;
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  return !!secret && token === secret;
}

export async function POST(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    slug?: string;
    language?: string;
  } | null;
  const slug = body?.slug;
  const language = body?.language || 'en';

  if (!slug || !/^[a-z0-9-]+$/.test(slug) || !/^[a-z]{2}$/.test(language)) {
    return NextResponse.json({ error: 'Invalid slug or language' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('blog_posts')
    .update({ status: 'published', published_at: now, updated_at: now })
    .eq('slug', slug)
    .eq('language', language)
    .eq('status', 'draft')
    .select('id,slug,language,published_at');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data || data.length !== 1) {
    return NextResponse.json(
      { error: `Expected one matching draft, found ${data?.length ?? 0}` },
      { status: 409 },
    );
  }

  await supabase
    .from('content_topics')
    .update({ status: 'published', updated_at: now })
    .eq('blog_post_id', data[0].id);

  revalidatePath('/[locale]/blog', 'page');
  revalidatePath('/[locale]/blog/[slug]', 'page');
  revalidatePath('/sitemap.xml');

  return NextResponse.json({ published: data[0] });
}
