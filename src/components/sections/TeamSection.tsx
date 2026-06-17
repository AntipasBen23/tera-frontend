"use client";

import dynamic from "next/dynamic";

const ParticleFieldCanvas = dynamic(
  () => import("@/components/three/ParticleFieldCanvas"),
  { ssr: false }
);

const TEAM = [
  {
    name: "Amy Locks",
    role: "Chief Executive Officer",
    initials: "AL",
    bio: "Founder with a background in biochemistry and deep-tech commercialisation. Focused on translating cell-free biology from lab to industrial scale.",
    links: [],
  },
  {
    name: "Pedro Lovatt Garcia",
    role: "Chief Technology Officer",
    initials: "PG",
    bio: "Architect of the Reactor Intelligence Platform. Specialist in process systems engineering, digital twins, and enzyme kinetics at industrial scale.",
    links: [],
  },
];

const ADVISORS = [
  "Scientific advisory board covering enzymology, bioprocess engineering, and AI-guided molecular discovery.",
  "California-based facility with pilot-scale cell-free bioreactor capability.",
];

export default function TeamSection() {
  return (
    <section
      id="team"
      className="snap-section relative flex items-center overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      {/* Particle field — full-bleed background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <ParticleFieldCanvas />
      </div>

      {/* Light vignette so text reads against particles */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, var(--bg) 100%)",
        }}
      />

      <div className="relative z-20 max-w-5xl mx-auto px-8 w-full">
        <span className="text-label block mb-6">Team</span>
        <h2
          className="text-headline mb-12"
          style={{ color: "var(--text-primary)" }}
        >
          Built by people who've
          <br />
          done this before.
        </h2>

        {/* Leadership */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
          {TEAM.map((member) => (
            <div key={member.name} className="glass rounded-2xl p-7">
              {/* Avatar */}
              <div
                className="w-14 h-14 rounded-full mb-5 flex items-center justify-center text-base font-semibold"
                style={{
                  background: "var(--accent-dim)",
                  color: "var(--accent)",
                  border: "1px solid var(--border)",
                  letterSpacing: "0.05em",
                }}
              >
                {member.initials}
              </div>

              <h3
                className="font-semibold mb-1 text-base"
                style={{ color: "var(--text-primary)" }}
              >
                {member.name}
              </h3>
              <p
                className="text-label mb-4"
                style={{ color: "var(--accent)", fontSize: "0.6rem" }}
              >
                {member.role}
              </p>
              <p className="text-subhead text-sm">{member.bio}</p>
            </div>
          ))}
        </div>

        {/* Scientific team / location note */}
        <div
          className="glass rounded-2xl p-6 flex flex-col sm:flex-row gap-6 items-start"
          style={{ borderColor: "var(--border)" }}
        >
          {ADVISORS.map((note, i) => (
            <div key={i} className="flex gap-3 items-start flex-1">
              <span
                className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full"
                style={{ background: "var(--accent)" }}
              />
              <p className="text-subhead text-sm">{note}</p>
            </div>
          ))}
        </div>

        {/* Location */}
        <div
          className="mt-8 flex items-center gap-2"
          style={{ color: "var(--text-muted)" }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="5.5" r="2" stroke="currentColor" strokeWidth="1.2" />
            <path
              d="M7 1C4.5 1 2.5 3 2.5 5.5C2.5 9 7 13 7 13C7 13 11.5 9 11.5 5.5C11.5 3 9.5 1 7 1Z"
              stroke="currentColor"
              strokeWidth="1.2"
            />
          </svg>
          <span className="text-mono text-xs">California, United States</span>
        </div>
      </div>
    </section>
  );
}
