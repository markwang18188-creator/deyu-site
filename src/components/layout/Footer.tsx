import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

const SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/profile.php?id=100092413230082',
  youtube: 'https://www.youtube.com/@deyumachinery', // TODO: confirm exact handle after channel creation
};

// Brand icons inlined (lucide-react removed social brand icons due to trademark)
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white" aria-hidden="true">
    <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white" aria-hidden="true">
    <path d="M21.582 6.186a2.506 2.506 0 0 0-1.768-1.768C18.254 4 12 4 12 4s-6.254 0-7.814.418A2.506 2.506 0 0 0 2.418 6.186C2 7.746 2 12 2 12s0 4.254.418 5.814a2.506 2.506 0 0 0 1.768 1.768C5.746 20 12 20 12 20s6.254 0 7.814-.418a2.506 2.506 0 0 0 1.768-1.768C22 16.254 22 12 22 12s0-4.254-.418-5.814ZM10 15.464V8.536L16 12l-6 3.464Z" />
  </svg>
);

export default async function Footer() {
  const t = await getTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-[#0f172a] text-white overflow-hidden">
      {/* 装饰光斑 */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Brand row */}
        <div className="flex items-center gap-4 mb-10 pb-8 border-b border-[#1e293b]">
          <Image
            src="/deyu-mark.png"
            alt="DEYU"
            width={310}
            height={380}
            className="h-10 w-auto brightness-0 invert"
          />
          <div className="h-8 w-px bg-white/20" />
          <div>
            <div className="text-xl font-bold tracking-wide">DEYU</div>
            <div className="text-[10px] text-blue-200 tracking-[0.2em] uppercase font-medium">
              Shoe-Making Machinery
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Products */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-blue-300 mb-4">
              {t('products_title')}
            </h3>
            <ul className="space-y-2 text-sm text-[#94a3b8]">
              {[
                ['single_color', '/products?category=single-color'],
                ['dual_color', '/products?category=dual-color'],
                ['multi_color', '/products?category=multi-color'],
                ['air_blowing', '/products?category=air-blowing'],
                ['industrial', '/products?category=industrial'],
                ['equipment', '/equipment'],
              ].map(([key, href]) => (
                <li key={key}>
                  <Link href={href as '/products'} className="hover:text-white transition-colors">
                    {t(key as 'single_color')}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-blue-300 mb-4">
              {t('company_title')}
            </h3>
            <ul className="space-y-2 text-sm text-[#94a3b8]">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  {t('about')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  {t('contact_link')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  {t('privacy')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-blue-300 mb-4">
              {t('resources_title')}
            </h3>
            <ul className="space-y-2 text-sm text-[#94a3b8]">
              <li>
                <a
                  href="/deyu-catalogue.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  {t('catalogue')}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-blue-300 mb-4">
              {t('contact_title')}
            </h3>
            <ul className="space-y-3 text-sm text-[#94a3b8]">
              <li>
                <a
                  href="https://wa.me/8613615778781"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  {t('whatsapp')}: +86 136 1577 8781
                </a>
              </li>
              <li>
                <a href="mailto:info@wzdeyu.cn" className="hover:text-white transition-colors">
                  {t('email')}: info@wzdeyu.cn
                </a>
              </li>
              <li>{t('address')}</li>
              <li>
                <a
                  href="https://wzdeyu.cn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  wzdeyu.cn
                </a>
              </li>
            </ul>

            {/* Social links */}
            <div className="mt-5">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-300 mb-3">
                {t('follow_us')}
              </p>
              <div className="flex items-center gap-3">
                <a
                  href={SOCIAL_LINKS.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="DEYU on Facebook"
                  className="w-9 h-9 flex items-center justify-center rounded-md bg-[#1e293b] hover:bg-[#1877F2] transition-colors"
                >
                  <FacebookIcon />
                </a>
                <a
                  href={SOCIAL_LINKS.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="DEYU on YouTube"
                  className="w-9 h-9 flex items-center justify-center rounded-md bg-[#1e293b] hover:bg-[#FF0000] transition-colors"
                >
                  <YoutubeIcon />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#1e293b] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748b]">
          <p>{t('copyright', { year })}</p>
          <p>{t('tagline')}</p>
        </div>
      </div>

    </footer>
  );
}
