"use client";

import { useActiveSection } from "@/hooks/useActiveSection";
import SectionIndicator from "./SectionIndicator";
import HeroSection from "./sections/HeroSection";
import ReactionSection from "./sections/ReactionSection";
import ReactorIntelSection from "./sections/ReactorIntelSection";
import ApplicationsSection from "./sections/ApplicationsSection";
import TeamSection from "./sections/TeamSection";
import InvestorsSection from "./sections/InvestorsSection";

const SECTION_COUNT = 6;

export default function SiteShell() {
  const { active, scrollTo } = useActiveSection(SECTION_COUNT);

  return (
    <>
      {/* Scroll container */}
      <div id="scroll-container">
        <HeroSection />
        <ReactionSection />
        <ReactorIntelSection />
        <ApplicationsSection />
        <TeamSection />
        <InvestorsSection />
      </div>

      {/* Fixed section indicator */}
      <SectionIndicator active={active} onChange={scrollTo} />

      {/* tera wordmark — fixed top-left */}
      <div
        className="fixed top-6 left-8 z-50 flex items-center gap-3"
        aria-label="tera"
      >
        <span
          className="text-mono font-semibold tracking-widest text-sm"
          style={{ color: "var(--text-primary)", letterSpacing: "0.25em" }}
        >
          tera
        </span>
        <span
          className="text-mono text-[0.55rem] px-2 py-0.5 rounded-full"
          style={{
            color: "var(--accent)",
            background: "var(--accent-dim)",
            border: "1px solid var(--border)",
            letterSpacing: "0.1em",
          }}
        >
          BETA
        </span>
      </div>
    </>
  );
}
