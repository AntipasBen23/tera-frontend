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
        {/* Wordmark — gradient matching logo */}
        <div aria-label="tera">
          <span
            className="font-bold tracking-widest text-base select-none"
            style={{
              background: "linear-gradient(90deg, #00B8CC 0%, #44C038 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "0.22em",
            }}
          >
            tera
          </span>
        </div>

        {/* Right — Menu button (beyond-aero style) + theme toggle */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          <button
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all hover:opacity-80"
            style={{
              color: "var(--text-primary)",
              border: "1px solid rgba(238,242,247,0.2)",
              letterSpacing: "0.06em",
            }}
            aria-label="Menu"
          >
            {/* Grid icon */}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
              <rect x="0" y="0" width="5.5" height="5.5" rx="0.5" />
              <rect x="8.5" y="0" width="5.5" height="5.5" rx="0.5" />
              <rect x="0" y="8.5" width="5.5" height="5.5" rx="0.5" />
              <rect x="8.5" y="8.5" width="5.5" height="5.5" rx="0.5" />
            </svg>
            Menu
          </button>
        </div>
      </header>
    </>
  );
}
