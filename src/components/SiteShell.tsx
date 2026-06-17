"use client";

import { useState, useCallback } from "react";
import { useActiveSection } from "@/hooks/useActiveSection";
import Preloader from "./Preloader";
import SectionIndicator from "./SectionIndicator";
import ThemeToggle from "./ThemeToggle";
import HeroSection from "./sections/HeroSection";
import ReactionSection from "./sections/ReactionSection";
import ReactorIntelSection from "./sections/ReactorIntelSection";
import ApplicationsSection from "./sections/ApplicationsSection";
import TeamSection from "./sections/TeamSection";
import InvestorsSection from "./sections/InvestorsSection";

const SECTION_COUNT = 6;

export default function SiteShell() {
  const [loaded, setLoaded] = useState(false);
  const onPreloaderDone = useCallback(() => setLoaded(true), []);
  const { active, scrollTo } = useActiveSection(SECTION_COUNT);

  return (
    <>
      {/* Preloader */}
      {!loaded && <Preloader onComplete={onPreloaderDone} />}

      {/* Scroll container */}
      <div
        id="scroll-container"
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      >
        <HeroSection />
        <ReactionSection />
        <ReactorIntelSection />
        <ApplicationsSection />
        <TeamSection />
        <InvestorsSection />
      </div>

      {/* Fixed section indicator — hidden on mobile */}
      <div className="hidden md:block">
        <SectionIndicator active={active} onChange={scrollTo} />
      </div>

      {/* Fixed header strip */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5">
        {/* Wordmark */}
        <div className="flex items-center gap-3" aria-label="tera">
          <span
            className="text-mono font-semibold text-sm"
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

        {/* Right controls */}
        <div className="flex items-center gap-4">
          {/* Mobile section counter */}
          <span
            className="md:hidden text-mono text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            {String(active + 1).padStart(2, "0")} / {String(SECTION_COUNT).padStart(2, "0")}
          </span>

          <ThemeToggle />
        </div>
      </header>
    </>
  );
}
