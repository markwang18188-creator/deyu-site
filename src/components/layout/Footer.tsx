import Link from 'next/link';

const footerLinks = {
  Products: [
    { label: 'All Machines', href: '/products' },
    { label: 'Single Color', href: '/products?category=single-color' },
    { label: 'Dual Color', href: '/products?category=dual-color' },
    { label: 'Multi Color', href: '/products?category=multi-color' },
    { label: 'Air Blowing', href: '/products?category=air-blowing' },
    { label: 'Industrial Parts', href: '/products?category=industrial' },
    { label: 'Equipment', href: '/equipment' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Certifications', href: '/about#certifications' },
    { label: 'Markets Served', href: '/about#markets' },
    { label: 'Factory History', href: '/about#history' },
  ],
  Resources: [
    { label: 'Catalog Download', href: '/assets-ref/Deyu machinery-2026-3-20.pdf' },
    { label: 'Blog (Coming Soon)', href: '#' },
    { label: 'Privacy Policy', href: '/privacy' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#1e3a8a] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1-3: Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-bold uppercase tracking-wider text-blue-200 mb-4">
                {title}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-blue-100 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Column 4: Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-blue-200 mb-4">
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-blue-100">
              <li>
                <a
                  href="https://wa.me/8613615778781"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-start gap-2"
                >
                  <span className="font-medium text-white">WhatsApp:</span>
                  +86-136-1577-8781
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@deyusolemachine.com"
                  className="hover:text-white transition-colors flex items-start gap-2"
                >
                  <span className="font-medium text-white">Email:</span>
                  info@deyusolemachine.com
                </a>
              </li>
              <li>
                <span className="font-medium text-white">Address:</span>
                <br />
                Wenzhou, Zhejiang, China
              </li>
              <li>
                <span className="font-medium text-white">Hours:</span>
                <br />
                Mon–Sat 9:00–18:00 CST
              </li>
            </ul>

            {/* Social */}
            <div className="flex gap-3 mt-4">
              <a
                href="https://facebook.com/profile.php?id=100092413230082"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-blue-700 rounded flex items-center justify-center hover:bg-blue-600 transition-colors text-xs font-bold"
                aria-label="Facebook"
              >
                f
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-blue-700 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-blue-300">
          <p>© 2026 Wenzhou Deyu Machinery Co., Ltd. All rights reserved.</p>
          <a
            href="https://wzdeyu.cn"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            wzdeyu.cn (Chinese Site)
          </a>
        </div>
      </div>

      {/* WhatsApp floating button */}
      <a
        href="https://wa.me/8613615778781"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-colors"
        aria-label="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </footer>
  );
}
