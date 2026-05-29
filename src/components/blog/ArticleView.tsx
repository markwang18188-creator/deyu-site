import type { ReactNode } from 'react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { Link } from '@/i18n/navigation';
import { getProductBySlug } from '@/data/products';
import type { BlogPost } from '@/lib/supabase/blog';

/** Custom MDX renderers. Images become centred, size-capped figures with a
 *  caption taken from the alt text — important because troubleshooting photos
 *  are portrait phone shots that look bad stretched full-width. Spans (not
 *  <figure>) keep the markup valid inside MDX's auto-wrapped <p>. */
/** One image inside a Split cell: fixed-height box (so paired images line up
 *  to equal height) with a neutral backdrop; image is contained, never cropped
 *  awkwardly, and the box fills the row so there are no big blank gaps. */
function SplitImage({ src, cap }: { src: string; cap?: string }) {
  return (
    <figure className="m-0">
      <div className="h-64 md:h-72 rounded-xl ring-1 ring-slate-200 shadow-md bg-slate-100 overflow-hidden flex items-center justify-center">
        <img
          src={src}
          alt={cap ?? ''}
          loading="lazy"
          className="max-h-full max-w-full w-auto object-contain"
        />
      </div>
      {cap && (
        <figcaption className="text-[12px] leading-snug text-slate-500 mt-2 italic">
          {cap}
        </figcaption>
      )}
    </figure>
  );
}

/** Two-column row: text on one side, image(s) on the other, vertically centred
 *  so a short paragraph sits level with its image instead of leaving a big void.
 *  `side` controls which side the image is on (alternate for rhythm). Up to two
 *  images render at equal height. Stacks to one column on mobile. */
function Split({
  children,
  img,
  cap,
  img2,
  cap2,
  side = 'right',
}: {
  children: ReactNode;
  img: string;
  cap?: string;
  img2?: string;
  cap2?: string;
  side?: 'left' | 'right';
}) {
  const media = (
    <div className={`not-prose grid ${img2 ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}>
      <SplitImage src={img} cap={cap} />
      {img2 && <SplitImage src={img2} cap={cap2} />}
    </div>
  );
  const text = (
    <div className="min-w-0 [&>:first-child]:mt-0 [&_h2]:mt-0 [&_h3]:mt-0">{children}</div>
  );
  return (
    <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-center my-10">
      {side === 'left' ? (
        <>
          {media}
          {text}
        </>
      ) : (
        <>
          {text}
          {media}
        </>
      )}
    </div>
  );
}

const mdxComponents = {
  Split,
  // Fallback for any stray standalone markdown image (centred, contained).
  img: (props: { src?: string; alt?: string }) => (
    <span className="block my-8">
      <img
        src={props.src}
        alt={props.alt ?? ''}
        loading="lazy"
        className="block mx-auto rounded-xl shadow-md ring-1 ring-slate-200 max-h-[440px] w-auto object-contain bg-slate-50"
      />
      {props.alt && (
        <span className="block text-center text-[12px] leading-snug text-slate-500 mt-2 italic">
          {props.alt}
        </span>
      )}
    </span>
  ),
};

function readingTime(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export default function ArticleView({
  post,
  preview = false,
}: {
  post: BlogPost;
  preview?: boolean;
}) {
  const related = (post.product_refs ?? [])
    .map((s) => getProductBySlug(s))
    .filter(Boolean);
  const mins = readingTime(post.body_mdx);
  const date = post.published_at ? new Date(post.published_at) : null;
  const category = post.keywords?.[0];

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    image: post.featured_image_url
      ? `https://deyusolemachine.com${post.featured_image_url}`
      : undefined,
    datePublished: post.published_at,
    author: {
      '@type': 'Organization',
      name: 'Wenzhou Deyu Machinery Co., Ltd',
      url: 'https://deyusolemachine.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'DEYU',
      url: 'https://deyusolemachine.com',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {preview && (
        <div className="bg-amber-400 text-amber-950 text-center text-sm font-semibold py-2">
          Draft preview — not published. This is exactly how it will look live.
        </div>
      )}

      {/* Breadcrumb */}
      <div className="bg-[#f8fafc] border-b border-[#e2e8f0]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="text-xs text-[#64748b]">
            <Link href="/" className="hover:text-[#1e3a8a]">Home</Link>
            <span className="mx-2 text-[#cbd5e1]">/</span>
            <Link href="/blog" className="hover:text-[#1e3a8a]">Blog</Link>
            <span className="mx-2 text-[#cbd5e1]">/</span>
            <span className="text-[#334155]">{category ?? 'Article'}</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-2">
          {category && (
            <span className="inline-block text-xs font-bold uppercase tracking-[0.15em] text-[#ea580c] bg-orange-50 px-3 py-1 rounded-full">
              {category}
            </span>
          )}
          <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold tracking-tight text-[#0f172a] mt-5 leading-[1.15]">
            {post.title}
          </h1>
          <div className="mt-5 flex items-center gap-3 text-sm text-[#64748b]">
            <span className="font-medium text-[#334155]">DEYU Engineering Team</span>
            {date && (
              <>
                <span className="text-[#cbd5e1]">·</span>
                <span>
                  {date.toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </>
            )}
            <span className="text-[#cbd5e1]">·</span>
            <span>{mins} min read</span>
          </div>
          <div className="mt-6 h-1 w-16 rounded-full bg-[#ea580c]" />
        </div>
      </header>

      {/* Body */}
      <article className="bg-white pb-16">
        <div
          className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-8
            prose prose-lg prose-slate max-w-none
            prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-[#0f172a] prose-headings:clear-both
            prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:text-[#1e3a8a]
            prose-p:text-[#334155] prose-p:leading-[1.8]
            prose-a:text-[#1e3a8a] prose-a:font-medium prose-a:no-underline hover:prose-a:underline
            prose-strong:text-[#0f172a]
            prose-li:text-[#334155] prose-li:marker:text-[#ea580c]
            prose-hr:border-[#e2e8f0]"
        >
          <MDXRemote source={post.body_mdx} components={mdxComponents} />
        </div>
      </article>

      {/* Related products */}
      {related.length > 0 && (
        <section className="py-14 bg-[#f8fafc] border-t border-[#e2e8f0]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-lg font-bold text-[#0f172a] mb-6">Related machines</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {related.map((p) =>
                p ? (
                  <Link
                    key={p.slug}
                    href={`/products/${p.slug}` as '/products/[slug]'}
                    className="group bg-white border border-[#e2e8f0] rounded-xl p-5 hover:border-[#ea580c]/40 hover:shadow-md transition-all"
                  >
                    <p className="text-xs font-bold text-[#ea580c] mb-1">{p.model}</p>
                    <p className="text-sm font-semibold text-[#0f172a] leading-snug group-hover:text-[#1e3a8a]">
                      {p.name}
                    </p>
                  </Link>
                ) : null
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
