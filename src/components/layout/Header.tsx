'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Menu, X, MapPin, ShieldCheck, Phone, Mail, MessageCircle } from 'lucide-react';
import { products } from '@/data/products';
import LanguageSwitcher from './LanguageSwitcher';
import WhatsAppLink from '@/components/analytics/WhatsAppLink';

const productGroups = [
  {
    key: 'injection_machines',
    items: products.filter((p) =>
      ['single-color', 'dual-color', 'multi-color'].includes(p.category)
    ).slice(0, 6),
  },
  {
    key: 'industrial_parts',
    items: products.filter((p) => p.category === 'industrial'),
  },
];

export default function Header() {
  const t = useTranslations('nav');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);

  const navLinks = [
    { label: t('products'), href: '/products', hasMega: true },
    { label: t('blog'), href: '/blog', hasMega: false },
    { label: t('cases'), href: '/cases', hasMega: false },
    { label: t('about'), href: '/about', hasMega: false },
    { label: t('contact'), href: '/contact', hasMega: false },
  ];

  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* Top info bar — hidden on mobile to keep header compact */}
      <div className="hidden md:block bg-[#0f172a] text-[#cbd5e1] text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-9">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#ea580c]" />
              {t('address')}
            </span>
            <span className="hidden lg:flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#ea580c]" />
              {t('certifications')}
            </span>
          </div>
          <div className="flex items-center gap-5">
            <a
              href="tel:+8613615778781"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#ea580c]" />
              +86 136 1577 8781
            </a>
            <a
              href="mailto:info@wzdeyu.cn"
              className="hidden lg:flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#ea580c]" />
              info@wzdeyu.cn
            </a>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="bg-[#1e3a8a] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-4 sm:gap-5 flex-shrink-0 group"
          >
            {/* DY mark icon (cropped clean from full wordmark) */}
            <Image
              src="/deyu-mark.png"
              alt="DEYU"
              width={310}
              height={380}
              priority
              className="h-12 sm:h-14 w-auto brightness-0 invert group-hover:opacity-90 transition-opacity"
            />

            {/* Divider */}
            <div className="h-10 sm:h-12 w-px bg-white/30" />

            {/* English wordmark — bigger & airier */}
            <div className="leading-none">
              <div className="text-2xl sm:text-3xl font-bold tracking-wide text-white">DEYU</div>
              <div className="text-[10px] sm:text-[11px] text-blue-200 mt-2 tracking-[0.2em] uppercase font-medium whitespace-nowrap">
                Shoe-Making Machinery
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) =>
              link.hasMega ? (
                <div
                  key="products"
                  className="relative"
                  onMouseEnter={() => setMegaOpen(true)}
                  onMouseLeave={() => setMegaOpen(false)}
                >
                  <Link
                    href="/products"
                    onClick={() => setMegaOpen(false)}
                    className="px-4 py-2 text-sm font-medium hover:text-orange-300 transition-colors flex items-center gap-1"
                  >
                    {link.label}
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </Link>

                  {megaOpen && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-[520px] bg-white text-gray-900 shadow-xl rounded-b-lg border-t-2 border-[#ea580c] p-6 grid grid-cols-2 gap-6">
                      {productGroups.map((group) => (
                        <div key={group.key}>
                          <h3 className="text-xs font-bold text-[#1e3a8a] uppercase tracking-wide mb-3 border-b pb-2">
                            {t(group.key as 'injection_machines' | 'industrial_parts')}
                          </h3>
                          <ul className="space-y-1">
                            {group.items.map((product) => (
                              <li key={product.slug}>
                                <Link
                                  href={`/products/${product.slug}`}
                                  className="text-sm text-gray-700 hover:text-[#ea580c] transition-colors block py-0.5"
                                >
                                  {product.model}
                                </Link>
                              </li>
                            ))}
                          </ul>
                          {group.key === 'injection_machines' && (
                            <Link
                              href="/products"
                              className="text-xs font-semibold text-[#ea580c] hover:underline mt-2 block"
                            >
                              {t('all_models')}
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href as '/about' | '/contact'}
                  className="px-4 py-2 text-sm font-medium hover:text-orange-300 transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Right: Language switcher + WhatsApp + Send Enquiry + Mobile menu */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <WhatsAppLink
              location="header"
              ariaLabel="WhatsApp"
              className="hidden sm:flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe57] text-white text-sm font-semibold px-3 py-2 rounded-md transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden xl:inline">{t('whatsapp')}</span>
            </WhatsAppLink>
            <Link
              href="/contact"
              className="hidden sm:flex items-center gap-2 bg-[#c2410c] hover:bg-[#9a3412] text-white text-sm font-semibold px-4 py-2 rounded-md transition-colors"
            >
              <Mail className="w-4 h-4" />
              {t('send_enquiry')}
            </Link>

            <button
              className="lg:hidden p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#1e3a8a] border-t border-blue-700 px-4 pb-4">
          <nav className="flex flex-col gap-1 pt-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href as '/products' | '/about' | '/contact'}
                className="py-3 text-sm font-medium border-b border-blue-700 hover:text-orange-300"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <WhatsAppLink
              location="header_mobile"
              className="mt-3 flex items-center justify-center gap-2 bg-[#25D366] text-white text-sm font-semibold px-4 py-3 rounded-md"
            >
              <MessageCircle className="w-4 h-4" />
              {t('whatsapp_us')}
            </WhatsAppLink>
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 bg-[#c2410c] hover:bg-[#9a3412] text-white text-sm font-semibold px-4 py-3 rounded-md transition-colors"
            >
              <Mail className="w-4 h-4" />
              {t('send_enquiry')}
            </Link>

            {/* Contact info on mobile (replaces top info bar) */}
            <div className="mt-4 pt-4 border-t border-blue-700 text-xs text-blue-200 space-y-2">
              <a href="tel:+8613615778781" className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#ea580c]" />
                +86 136 1577 8781
              </a>
              <a href="mailto:info@wzdeyu.cn" className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#ea580c]" />
                info@wzdeyu.cn
              </a>
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#ea580c]" />
                {t('address')}
              </p>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
