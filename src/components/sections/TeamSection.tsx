"use client";

const TEAM = [
  {
    name: "Amy Locks",
    role: "Chief Executive Officer",
    bio: "Founder with a background in biochemistry and deep-tech commercialisation. Previously at the intersection of synthetic biology and industrial chemistry.",
  },
  {
    name: "Pedro Lovatt Garcia",
    role: "Chief Technology Officer",
    bio: "Architect of the Reactor Intelligence Platform. Specialist in process systems engineering, digital twins, and enzyme kinetics at industrial scale.",
  },
];

export default function TeamSection() {
  return (
    <section id="team" className="snap-section flex items-center">
      <div className="relative z-10 max-w-5xl mx-auto px-8 w-full">
        <span className="text-label block mb-6">Team</span>
        <h2 className="text-headline mb-12" style={{ color: "var(--text-primary)" }}>
          Built by people who've
          <br />
          done this before.
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {TEAM.map((member) => (
            <div key={member.name} className="glass rounded-xl p-8">
              <div
                className="w-16 h-16 rounded-full mb-4 flex items-center justify-center text-2xl font-semibold"
                style={{
                  background: "var(--accent-dim)",
                  color: "var(--accent)",
                  border: "1px solid var(--border)",
                }}
              >
                {member.name.charAt(0)}
              </div>
              <h3 className="text-base font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                {member.name}
              </h3>
              <p className="text-label mb-4" style={{ color: "var(--accent)", fontSize: "0.6rem" }}>
                {member.role}
              </p>
              <p className="text-subhead text-sm">{member.bio}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3" style={{ color: "var(--text-muted)" }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1.5C5.5 1.5 2.5 3 2.5 7c0 3 2 5 5.5 7C13 12 13.5 10 13.5 7c0-4-3-5.5-5.5-5.5z" stroke="currentColor" strokeWidth="1.2" />
          </svg>
          <span className="text-mono text-xs">California, United States</span>
        </div>
      </div>
    </section>
  );
}
