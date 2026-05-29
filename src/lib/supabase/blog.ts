import { createClient } from './server';

export interface BlogPost {
  id: string;
  slug: string;
  language: string;
  title: string;
  description: string | null;
  body_mdx: string;
  featured_image_url: string | null;
  keywords: string[] | null;
  product_refs: string[] | null;
  published_at: string | null;
  created_at: string;
}

export async function getPublishedPosts(language = 'en'): Promise<BlogPost[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id,slug,language,title,description,featured_image_url,keywords,product_refs,published_at,created_at')
    .eq('status', 'published')
    .eq('language', language)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('[blog] getPublishedPosts:', error.message);
    return [];
  }
  return (data ?? []) as BlogPost[];
}

export async function getPostBySlug(slug: string, language = 'en'): Promise<BlogPost | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .eq('language', language)
    .maybeSingle();

  if (error) {
    console.error('[blog] getPostBySlug:', error.message);
    return null;
  }
  return data as BlogPost | null;
}

/** Preview a post regardless of status (drafts included). Uses the service-role
 *  client because RLS hides drafts from the public anon client. Server-only. */
export async function getPreviewPostBySlug(slug: string, language = 'en'): Promise<BlogPost | null> {
  const { createAdminClient } = await import('./admin');
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('language', language)
    .maybeSingle();
  if (error) {
    console.error('[blog] getPreviewPostBySlug:', error.message);
    return null;
  }
  return data as BlogPost | null;
}

export async function getAllPublishedSlugs(): Promise<{ slug: string; language: string }[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .select('slug,language')
    .eq('status', 'published');

  if (error) return [];
  return (data ?? []) as { slug: string; language: string }[];
}
