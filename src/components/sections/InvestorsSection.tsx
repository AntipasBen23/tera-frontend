"use client";

import MolecularEconomicsChart from "@/components/MolecularEconomicsChart";

const KPI_CARDS = [
  {
    key: "Cost per gram",
    value: "3.1",
    unit: "USD/g",
    note: "Projected at scale with RIP",
    accent: "var(--accent)",
  },
  {
    key: "Time to purity",
    value: "18",
    unit: "hours",
    note: "vs. 72–120h for fermentation",
    accent: "var(--accent)",
  },
  {
    key: "Yield uplift",
    value: "+30%",
    unit: "",
    note: "High end of RIP-driven range",
    accent: "var(--violet)",
  },
  {
    key: "Throughput",
    value: "+40%",
    unit: "",
    note: "More batches annually vs. baseline",
    accent: "var(--violet)",
  },
];

export default function InvestorsSection() {
  return (
    <section
      id="investors"
      className="snap-section flex items-center overflow-hidden"
      style={{ background: "var(--bg-section)" }}
    >
      <div className="relative z-10 max-w-6xl mx-auto px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
        {/* Left — chart */}
        <div>
          <span className="text-label block mb-6">Investors</span>
          <h2
            className="text-headline mb-6"
            style={{ color: "var(--text-primary)" }}
          >
            Molecular Economics.
          </h2>
          <p className="text-subhead mb-8 max-w-md">
            Cost per gram and time to purity determine whether a bioprocess is
            commercially viable. tera optimises both — simultaneously.
            Hover any data point to inspect it.
          </p>

          <div className="glass rounded-2xl p-6">
            <MolecularEconomicsChart />
          </div>
        </div>

        {/* Right — KPIs + CTA */}
        <div>
          <div className="grid grid-cols-2 gap-4 mb-8 mt-16">
            {KPI_CARDS.map((k) => (
              <div key={k.key} className="glass rounded-xl p-5">
                <div
                  className="text-mono text-[0.6rem] uppercase tracking-widest mb-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  {k.key}
                </div>
                <div
                  className="font-semibold mb-1 glow"
                  style={{ color: k.accent, fontSize: "1.6rem", lineHeight: 1 }}
                >
                  {k.value}
                  {k.unit && (
                    <span
                      className="text-xs font-normal ml-1"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {k.unit}
                    </span>
                  )}
                </div>
                <div
                  className="text-mono text-[0.6rem]"
                  style={{ color: "var(--text-muted)", lineHeight: 1.5 }}
                >
                  {k.note}
                </div>
              </div>
            ))}
          </div>

          {/* CTA block */}
          <div className="flex flex-col gap-3 mb-12">
            <a
              href="#"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-medium transition-all hover:scale-105"
              style={{
                background: "var(--accent)",
                color: "var(--bg)",
                boxShadow: "0 0 20px var(--accent-glow)",
              }}
            >
              Request Data Room
            </a>
            <a
              href="mailto:investors@terabio.com"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-medium glass transition-all hover:scale-105"
              style={{
                color: "var(--text-primary)",
                border: "1px solid var(--border)",
              }}
            >
              Contact Investor Relations
            </a>
          </div>

          {/* Footer */}
          <div
            className="pt-6"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <p
              className="text-mono text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              © {new Date().getFullYear()} tera Biosciences, Inc.
              <br />
              Formerly Anzen Industries · California, USA
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
