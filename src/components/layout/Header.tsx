'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Menu, X, Phone } from 'lucide-react';
import { products } from '@/data/products';
import LanguageSwitcher from './LanguageSwitcher';

const productGroups = [
  {
    key: 'injection_machines',
    items: products.filter((p) =>
      ['single-color', 'dual-color', 'multi-color'].includes(p.category)
    ).slice(0, 6),
  },
  {
    key: 'air_blowing',
    items: products.filter((p) => p.category === 'air-blowing'),
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
    { label: t('about'), href: '/about', hasMega: false },
    { label: t('contact'), href: '/contact', hasMega: false },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#1e3a8a] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="bg-[#ea580c] text-white font-bold text-xl px-3 py-1 rounded-md">
              DY
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-lg leading-tight">DEYU</div>
              <div className="text-xs text-blue-200 leading-tight">SHOE-MAKING MACHINERY</div>
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
                  <button className="px-4 py-2 text-sm font-medium hover:text-orange-300 transition-colors flex items-center gap-1">
                    {link.label}
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </button>

                  {megaOpen && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-[640px] bg-white text-gray-900 shadow-xl rounded-b-lg border-t-2 border-[#ea580c] p-6 grid grid-cols-3 gap-6">
                      {productGroups.map((group) => (
                        <div key={group.key}>
                          <h3 className="text-xs font-bold text-[#1e3a8a] uppercase tracking-wide mb-3 border-b pb-2">
                            {t(group.key as 'injection_machines' | 'air_blowing' | 'industrial_parts')}
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

          {/* Right: Language switcher + WhatsApp + Mobile menu */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <a
              href="https://wa.me/8613615778781"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 bg-[#ea580c] hover:bg-orange-700 text-white text-sm font-semibold px-4 py-2 rounded-md transition-colors"
            >
              <Phone className="w-4 h-4" />
              {t('whatsapp')}
            </a>

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
            <a
              href="https://wa.me/8613615778781"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center justify-center gap-2 bg-[#ea580c] text-white text-sm font-semibold px-4 py-3 rounded-md"
            >
              <Phone className="w-4 h-4" />
              {t('whatsapp_us')}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
