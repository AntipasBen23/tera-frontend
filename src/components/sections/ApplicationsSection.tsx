"use client";

const INDUSTRIES = [
  {
    name: "Cosmetics",
    molecule: "Hyaluronic acid, retinol precursors",
    color: "var(--accent)",
  },
  {
    name: "Fragrance",
    molecule: "Santalol, musks, ambergris analogues",
    color: "var(--violet)",
  },
  {
    name: "Food",
    molecule: "Vanillin, steviol glycosides, rare sugars",
    color: "var(--gold)",
  },
  {
    name: "Pharmaceuticals",
    molecule: "Cannabinoids, alkaloids, antibiotics",
    color: "var(--accent)",
  },
  {
    name: "Critical Minerals",
    molecule: "Bioleaching enzymes for rare earth extraction",
    color: "var(--violet)",
  },
];

export default function ApplicationsSection() {
  return (
    <section id="applications" className="snap-section flex items-center">
      <div className="relative z-10 max-w-5xl mx-auto px-8 w-full">
        <span className="text-label block mb-6">Applications</span>
        <h2 className="text-headline mb-4" style={{ color: "var(--text-primary)" }}>
          1% of nature's molecules are in use.
          <br />
          We're after the other 99.
        </h2>
        <p className="text-subhead mb-12 max-w-xl">
          AI-guided enzyme discovery unlocks bioactive molecules that have
          never reached industrial production — across five industries already
          in development.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {INDUSTRIES.map((ind) => (
            <div key={ind.name} className="glass rounded-xl p-6">
              <span
                className="text-label block mb-3"
                style={{ color: ind.color }}
              >
                {ind.name}
              </span>
              <p className="text-subhead text-sm">{ind.molecule}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
