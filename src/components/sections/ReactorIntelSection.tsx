"use client";

const METRICS = [
  { value: "20–40%", label: "more batches annually" },
  { value: "15–30%", label: "higher yields" },
  { value: "Real-time", label: "anomaly detection" },
];

const SENSORS = [
  "Temperature",
  "pH",
  "Pressure",
  "Flow rate",
  "Enzyme activity",
  "Substrate",
  "Yield",
  "Oxygen",
];

export default function ReactorIntelSection() {
  return (
    <section id="reactor-intel" className="snap-section flex items-center">
      <div className="relative z-10 max-w-5xl mx-auto px-8 w-full">
        <span className="text-label block mb-6">Reactor Intelligence Platform</span>
        <h2 className="text-headline mb-4" style={{ color: "var(--text-primary)" }}>
          The batch knows what it needs.
          <br />
          We make it tell you.
        </h2>
        <p className="text-subhead mb-12 max-w-xl">
          A digital twin runs alongside every production run — monitoring eight
          live data streams, forecasting enzyme deactivation before it happens,
          and surfacing exactly what to adjust and when.
        </p>

        <div className="grid grid-cols-3 gap-4 mb-12">
          {METRICS.map((m) => (
            <div key={m.label} className="glass rounded-xl p-6">
              <div
                className="text-headline glow mb-1"
                style={{ color: "var(--accent)", fontSize: "2rem" }}
              >
                {m.value}
              </div>
              <div className="text-subhead text-sm">{m.label}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {SENSORS.map((s) => (
            <span
              key={s}
              className="text-mono px-3 py-1 rounded-full text-xs"
              style={{
                background: "var(--accent-dim)",
                color: "var(--accent)",
                border: "1px solid var(--border)",
              }}
            >
              ● {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
