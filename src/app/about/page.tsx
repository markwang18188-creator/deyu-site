import type { Metadata } from 'next';
import CtaSection from '@/components/sections/CtaSection';

export const metadata: Metadata = {
  title: 'About DEYU | Shoe Sole Injection Moulding Machine Manufacturer Since 2009',
  description:
    'Wenzhou Deyu Machinery Co., Ltd — 15+ years manufacturing shoe sole injection moulding machines. ISO 9001 & CE certified. Trusted by factories in 15 countries.',
};

const milestones = [
  { year: '2009', event: 'Founded in Wenzhou, China' },
  { year: '2011', event: 'First export to South America (Brazil)' },
  { year: '2014', event: 'ISO 9001:2000 quality certification obtained' },
  { year: '2016', event: 'CE certification for European market compliance' },
  { year: '2019', event: 'Expanded product line to TPU machines — leading the rubber-to-TPU transition' },
  { year: '2024', event: 'Machines running in 15 countries across 5 continents' },
];

const stats = [
  { value: '15+', label: 'Years of Export Experience' },
  { value: '15', label: 'Countries Served' },
  { value: '18+', label: 'Machine Models' },
  { value: '100%', label: 'Factory Direct' },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <div className="bg-[#1e3a8a] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">
            About Wenzhou Deyu Machinery
          </h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">
            Since 2009, we have been manufacturing high-precision shoe sole injection moulding machines in Wenzhou — the global capital of shoe manufacturing.
          </p>
        </div>
      </div>

      {/* Stats */}
      <section className="py-12 bg-white border-b border-[#e2e8f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-4xl font-bold text-[#1e3a8a] mb-2">{s.value}</div>
                <div className="text-sm text-[#64748b]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our story */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#0f172a] mb-6">Our Story</h2>
          <div className="prose prose-slate max-w-none text-[#475569] space-y-4 text-base leading-relaxed">
            <p>
              Wenzhou Deyu Machinery Co., Ltd was founded in 2009 in Wenzhou, Zhejiang Province — a city that produces more than 70% of China's footwear exports and is home to the world's most concentrated ecosystem of shoe machinery manufacturers.
            </p>
            <p>
              We specialize in the design and manufacture of shoe sole injection moulding machines: from entry-level 2-station machines to high-output 20-station rotary lines, from single-color PVC machines to precision dual and multi-color TPU systems.
            </p>
            <p>
              Our focus since 2019 has been the transition from traditional rubber and PVC sole production to high-performance TPU. TPU soles are lighter, more durable, and more environmentally responsible — and our machines are at the forefront of this industry shift.
            </p>
            <p>
              We are ISO 9001:2000 certified and CE certified, ensuring that our machines meet international quality and safety standards for export to Europe, the Americas, Africa and Asia.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-[#f1f5f9]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#0f172a] mb-10 text-center">
            Company Milestones
          </h2>
          <div className="space-y-6">
            {milestones.map((m) => (
              <div key={m.year} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-16 text-right">
                  <span className="text-[#1e3a8a] font-bold text-sm">{m.year}</span>
                </div>
                <div className="flex-shrink-0 w-px bg-[#e2e8f0] self-stretch relative">
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#1e3a8a] rounded-full" />
                </div>
                <div className="pb-6">
                  <p className="text-[#334155] text-sm leading-relaxed">{m.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#0f172a] mb-4">
            Certifications
          </h2>
          <p className="text-[#64748b] mb-10">
            Our machines meet international quality and safety standards for global export.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {['ISO 9001:2000', 'CE Certified'].map((cert) => (
              <div
                key={cert}
                className="bg-[#f1f5f9] border border-[#e2e8f0] rounded-xl px-10 py-8 flex flex-col items-center gap-3"
              >
                <div className="text-4xl">🏆</div>
                <div className="font-bold text-[#0f172a]">{cert}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-[#94a3b8] mt-6">
            {/* TODO: Add certificate scan images once available */}
            Certificate scan images — coming soon
          </p>
        </div>
      </section>

      <CtaSection
        title="Visit Our Factory"
        subtitle="We welcome factory visits. Tell us your schedule and we will arrange a tour of our production facility in Wenzhou."
      />
    </>
  );
}
