import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Facebook, Youtube } from 'lucide-react';

const SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/profile.php?id=100092413230082',
  youtube: 'https://www.youtube.com/@deyumachinery', // TODO: confirm exact handle after channel creation
};

export default async function Footer() {
  const t = await getTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0f172a] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
                  <Facebook className="w-4 h-4 fill-white text-white" />
                </a>
                <a
                  href={SOCIAL_LINKS.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="DEYU on YouTube"
                  className="w-9 h-9 flex items-center justify-center rounded-md bg-[#1e293b] hover:bg-[#FF0000] transition-colors"
                >
                  <Youtube className="w-4 h-4 fill-white text-white" />
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

      {/* WhatsApp floating button */}
      <a
        href="https://wa.me/8613615778781"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 end-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg transition-colors"
        aria-label="WhatsApp"
      >
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </footer>
  );
}
