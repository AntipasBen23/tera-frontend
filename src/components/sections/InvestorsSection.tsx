"use client";

const METRICS = [
  { key: "Cost per gram", value: "—", unit: "USD/g", note: "Projected at scale" },
  { key: "Time to purity", value: "—", unit: "hours", note: "vs. 72–120h fermentation" },
  { key: "Yield improvement", value: "15–30%", unit: "", note: "vs. baseline batch" },
  { key: "Batch throughput", value: "+20–40%", unit: "", note: "annually via RIP" },
];

export default function InvestorsSection() {
  return (
    <section id="investors" className="snap-section flex items-center">
      <div className="relative z-10 max-w-5xl mx-auto px-8 w-full">
        <span className="text-label block mb-6">Investors</span>
        <h2 className="text-headline mb-4" style={{ color: "var(--text-primary)" }}>
          Molecular Economics.
        </h2>
        <p className="text-subhead mb-12 max-w-xl">
          The platform is measured in cost per gram and time to purity — the
          two numbers that determine whether a bioprocess is commercially viable.
          tera optimises both, simultaneously.
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {METRICS.map((m) => (
            <div key={m.key} className="glass rounded-xl p-5">
              <div className="text-label mb-3" style={{ color: "var(--text-muted)" }}>
                {m.key}
              </div>
              <div
                className="text-headline mb-1"
                style={{ color: "var(--accent)", fontSize: "1.75rem" }}
              >
                {m.value}
                {m.unit && (
                  <span className="text-xs font-normal ml-1" style={{ color: "var(--text-muted)" }}>
                    {m.unit}
                  </span>
                )}
              </div>
              <div className="text-mono text-xs" style={{ color: "var(--text-muted)" }}>
                {m.note}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-4">
          <a
            href="#"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all"
            style={{ background: "var(--accent)", color: "var(--bg)" }}
          >
            Request Data Room
          </a>
          <a
            href="mailto:investors@terabio.com"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all glass"
            style={{ color: "var(--text-primary)", border: "1px solid var(--border)" }}
          >
            Contact Investor Relations
          </a>
        </div>

        <div className="mt-16 pt-8" style={{ borderTop: "1px solid var(--border)" }}>
          <p className="text-mono text-xs" style={{ color: "var(--text-muted)" }}>
            © {new Date().getFullYear()} tera Biosciences. Formerly Anzen Industries.
          </p>
        </div>
      </div>
    </section>
  );
}
