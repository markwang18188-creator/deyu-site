const countries = [
  'Brazil', 'Argentina', 'Mexico', 'Colombia',
  'Russia', 'Turkey', 'Morocco', 'India',
  'Pakistan', 'Iran', 'Bangladesh', 'Vietnam',
  'Egypt', 'Nigeria', "Côte d'Ivoire",
];

export default function GlobalMap() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#0f172a] mb-4">
            Trusted by Factories in 15 Countries
          </h2>
          <p className="text-lg text-[#64748b]">
            Our machines are running 24/7 in shoe factories across South America, the Middle East,
            Africa, South Asia and Southeast Asia.
          </p>
        </div>

        {/* World map placeholder */}
        <div className="relative bg-[#f1f5f9] rounded-xl overflow-hidden mb-8" style={{ height: '320px' }}>
          <div className="absolute inset-0 flex items-center justify-center text-[#64748b]">
            {/* TODO: Replace with real SVG world map highlighting the 15 countries */}
            <div className="text-center">
              <div className="text-6xl mb-4">🌍</div>
              <p className="text-lg font-medium">Global Customer Map</p>
              <p className="text-sm text-[#94a3b8] mt-1">15 countries · 5 continents</p>
            </div>
          </div>
        </div>

        {/* Country list */}
        <div className="flex flex-wrap justify-center gap-3">
          {countries.map((country) => (
            <span
              key={country}
              className="bg-[#1e3a8a] text-white text-sm font-medium px-4 py-2 rounded-full"
            >
              {country}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
