const advantages = [
  {
    icon: '🔬',
    title: 'TPU Replaces Rubber',
    description:
      'We lead the market shift from traditional rubber soles to high-performance TPU. TPU soles are lighter, more durable, and give your shoes a competitive edge.',
  },
  {
    icon: '🏭',
    title: 'Turnkey Factory Solutions',
    description:
      'We don\'t just sell machines — we deliver complete production lines. From injection machines to mixers, dryers and compressors, we set up your entire sole factory.',
  },
  {
    icon: '🌍',
    title: '15 Years · 15 Countries',
    description:
      'Since 2009, our machines have been running in shoe factories across Brazil, Turkey, India, Egypt, Nigeria and 10 more countries. Real factories, real production.',
  },
  {
    icon: '📜',
    title: 'ISO 9001 + CE Certified',
    description:
      'Our machines meet international quality standards. ISO 9001:2000 quality management and CE certification open the door to European and global markets.',
  },
];

export default function WhyDeyu() {
  return (
    <section className="py-16 lg:py-24 bg-[#f1f5f9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#0f172a] mb-4">
            Why Choose DEYU?
          </h2>
          <p className="text-lg text-[#64748b] max-w-2xl mx-auto">
            4 reasons why shoe factory owners from 15 countries trust DEYU machinery.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {advantages.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-[#e2e8f0]"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-lg font-semibold text-[#0f172a] mb-3">{item.title}</h3>
              <p className="text-sm text-[#64748b] leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
