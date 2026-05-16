import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative bg-[#0f172a] text-white overflow-hidden" style={{ minHeight: '60vh' }}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a8a] via-[#0f172a] to-[#0f172a]" />

      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#1e3a8a]/20 translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#ea580c]/10 -translate-x-1/3 translate-y-1/3" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#ea580c]/20 border border-[#ea580c]/30 text-orange-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-[#ea580c] animate-pulse" />
            ISO 9001 · CE Certified · 15+ Years Export Experience
          </div>

          {/* H1 */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Shoe Sole Injection{' '}
            <span className="text-[#ea580c]">Moulding Machines</span>
            <br />
            <span className="text-blue-200 text-3xl sm:text-4xl lg:text-5xl">
              Made in Wenzhou, China
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-blue-100 mb-8 max-w-2xl leading-relaxed">
            TPU · PVC · TR · Rubber — single color to four colors. Complete turnkey solutions
            for shoe factories across 15 countries. 15+ years of global export experience.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="bg-[#ea580c] hover:bg-orange-700 text-white font-semibold px-8 py-4 rounded-md transition-colors text-lg"
            >
              Get a Free Quote
            </Link>
            <Link
              href="/products"
              className="border-2 border-white/50 hover:border-white text-white font-semibold px-8 py-4 rounded-md transition-colors text-lg"
            >
              View All Machines
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/10">
            {[
              { value: '15+', label: 'Years Experience' },
              { value: '15', label: 'Countries Served' },
              { value: '100+', label: 'Machine Models Delivered' },
              { value: 'ISO·CE', label: 'Certified' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-[#ea580c]">{stat.value}</div>
                <div className="text-sm text-blue-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
