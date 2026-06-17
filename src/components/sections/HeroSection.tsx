"use client";

export default function HeroSection() {
  return (
    <section id="hero" className="snap-section flex items-center justify-center">
      <div className="relative z-10 max-w-3xl px-8 text-center">
        <span className="text-label block mb-6">Cell-Free Biomanufacturing</span>
        <h1 className="text-display mb-6" style={{ color: "var(--text-primary)" }}>
          From First Principles.
        </h1>
        <p className="text-subhead max-w-xl mx-auto mb-10">
          tera re-imagines how powerful molecules from nature are made —
          building directly from the chemistry up, without the cell.
        </p>
        <button
          onClick={() => {
            const container = document.getElementById("scroll-container");
            if (container) container.scrollTop = container.clientHeight;
          }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all"
          style={{
            background: "var(--accent)",
            color: "var(--bg)",
          }}
        >
          Explore the Platform
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1v12M1 7l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </section>
  );
}
