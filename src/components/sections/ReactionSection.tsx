"use client";

export default function ReactionSection() {
  return (
    <section id="reaction" className="snap-section flex items-center">
      <div className="relative z-10 max-w-5xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
        <div>
          <span className="text-label block mb-6">The Platform</span>
          <h2 className="text-headline mb-6" style={{ color: "var(--text-primary)" }}>
            The cell was never the point.
          </h2>
          <p className="text-subhead mb-6">
            Traditional fermentation wraps enzyme production inside a living
            organism — with all its growth phases, contamination risk, and
            metabolic overhead. tera strips that away.
          </p>
          <p className="text-subhead">
            Cell-free biomanufacturing isolates the enzymes that do the actual
            work, runs the reaction in a controlled vessel, and removes the
            biological bottleneck from scale-up entirely.
          </p>
        </div>
        <div
          className="glass rounded-2xl aspect-square flex items-center justify-center"
          style={{ minHeight: "320px" }}
        >
          <span className="text-label opacity-50">Bioreactor 3D — coming</span>
        </div>
      </div>
    </section>
  );
}
