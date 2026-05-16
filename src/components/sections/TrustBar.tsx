const trustItems = [
  { icon: '🏆', label: 'ISO 9001:2000', sub: 'Quality Certified' },
  { icon: '✅', label: 'CE Certified', sub: 'EU Market Ready' },
  { icon: '📅', label: '15+ Years', sub: 'Export Experience' },
  { icon: '🌍', label: '15 Countries', sub: 'Customers Worldwide' },
  { icon: '🏭', label: 'Factory Direct', sub: 'Wenzhou, China' },
];

export default function TrustBar() {
  return (
    <section className="bg-[#f1f5f9] border-y border-[#e2e8f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-10">
          {trustItems.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <div className="font-semibold text-[#0f172a] text-sm">{item.label}</div>
                <div className="text-xs text-[#64748b]">{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
