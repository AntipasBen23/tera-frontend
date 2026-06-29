"use client";

import { useState, useCallback, useEffect } from "react";
import { useActiveSection } from "@/hooks/useActiveSection";
import Preloader from "./Preloader";
import SectionIndicator from "./SectionIndicator";
import HeroSection from "./sections/HeroSection";
import ReactionSection from "./sections/ReactionSection";
import ReactorIntelSection from "./sections/ReactorIntelSection";
import ApplicationsSection from "./sections/ApplicationsSection";
import TeamSection from "./sections/TeamSection";
import InvestorsSection from "./sections/InvestorsSection";

const SECTION_COUNT = 6;

const NAV_LINKS = [
  { label: "Platform",     section: 1 },
  { label: "Technology",   section: 2 },
  { label: "Applications", section: 3 },
  { label: "Team",         section: 4 },
  { label: "Investors",    section: 5 },
];

export default function SiteShell() {
  const [loaded, setLoaded]       = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [theme, setTheme]         = useState<"dark" | "light">("dark");
  const onPreloaderDone = useCallback(() => setLoaded(true), []);
  const { active, scrollTo }      = useActiveSection(SECTION_COUNT);

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme") as "dark" | "light";
    if (current) setTheme(current);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
  };

  const handleNavClick = (section: number) => {
    scrollTo(section);
    setMenuOpen(false);
  };

  return (
    <>
      {/* Preloader */}
      {!loaded && <Preloader onComplete={onPreloaderDone} />}

      {/* Scroll container */}
      <div
        id="scroll-container"
        style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.4s ease" }}
      >
        <HeroSection />
        <ReactionSection />
        <ReactorIntelSection />
        <ApplicationsSection />
        <TeamSection />
        <InvestorsSection />
      </div>

      {/* Fixed section indicator */}
      <div className="hidden md:block">
        <SectionIndicator active={active} onChange={scrollTo} />
      </div>

      {/* Circular pulsing theme toggle — sits on center horizontal grid line */}
      <button
        onClick={toggleTheme}
        className="fixed z-50 hidden md:flex items-center group"
        style={{ right: "110px", top: "52%", transform: "translateY(-50%)" }}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      >
        {/* Hover label — appears to the left */}
        <span
          className="mr-4 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap select-none"
          style={{ color: "var(--text-secondary)", letterSpacing: "0.06em" }}
        >
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </span>

        {/* Core dot + 4 staggered pulsing rings */}
        <span className="relative flex items-center justify-center w-2 h-2">
          <span className="absolute inset-0 rounded-full" style={{ border: "1px solid rgba(255,255,255,0.5)",  animation: "radarPing 2.4s ease-out infinite", animationDelay: "0s"   }} />
          <span className="absolute inset-0 rounded-full" style={{ border: "1px solid rgba(255,255,255,0.4)",  animation: "radarPing 2.4s ease-out infinite", animationDelay: "0.6s"  }} />
          <span className="absolute inset-0 rounded-full" style={{ border: "1px solid rgba(255,255,255,0.3)",  animation: "radarPing 2.4s ease-out infinite", animationDelay: "1.2s"  }} />
          <span className="absolute inset-0 rounded-full" style={{ border: "1px solid rgba(255,255,255,0.2)",  animation: "radarPing 2.4s ease-out infinite", animationDelay: "1.8s"  }} />
          {/* Core circle */}
          <span className="relative block w-2 h-2 rounded-full bg-white/85" />
        </span>
      </button>

      {/* Logo — shares left column with hero content */}
      <div className="fixed z-50" style={{ left: "72px", top: "55px" }} aria-label="tera">
        <span
          className="font-bold select-none"
          style={{
            background: "linear-gradient(90deg, #00B8CC 0%, #44C038 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontSize: "1.1rem",
            letterSpacing: "0.28em",
          }}
        >
          tera
        </span>
      </div>

      {/* Header — right-side controls only */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-start justify-end"
        style={{ paddingTop: "49px", paddingRight: "72px" }}
      >
        <div className="flex items-center gap-5">

          {/* Menu button — white fill from bottom on hover */}
          <button
            onClick={() => setMenuOpen(true)}
            className="relative flex items-center gap-3 overflow-hidden rounded border border-white/30 group"
            style={{ padding: "14px 20px" }}
            aria-label="Open menu"
          >
            {/* White fill slides up from bottom */}
            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />

            {/* Content sits above the fill */}
            <div className="relative z-10 flex items-center gap-3">
              <div className="grid grid-cols-2 gap-1">
                <div className="w-1.5 h-1.5 bg-white group-hover:bg-black rounded-sm transition-colors duration-300" />
                <div className="w-1.5 h-1.5 bg-white group-hover:bg-black rounded-sm transition-colors duration-300" />
                <div className="w-1.5 h-1.5 bg-white group-hover:bg-black rounded-sm transition-colors duration-300" />
                <div className="w-1.5 h-1.5 bg-white group-hover:bg-black rounded-sm transition-colors duration-300" />
              </div>
              <span className="text-white group-hover:text-black font-semibold text-sm transition-colors duration-300" style={{ letterSpacing: "0.08em" }}>
                Menu
              </span>
            </div>
          </button>
        </div>
      </header>

      {/* Dark overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Slide-out menu panel — floating card, inset from edges */}
      <div
        className={`fixed top-4 right-4 bottom-4 w-full max-w-xs bg-white rounded-2xl z-[70] shadow-2xl flex flex-col transition-transform duration-500 ease-out ${
          menuOpen ? "translate-x-0" : "translate-x-[calc(100%+1rem)]"
        }`}
      >
        <div className="flex flex-col h-full p-8">

          {/* Panel header */}
          <div className="flex items-center justify-between mb-10">
            <span className="text-gray-400 text-base font-normal tracking-wide">Menu</span>
            <button
              onClick={() => setMenuOpen(false)}
              className="w-11 h-11 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              aria-label="Close menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex-1 flex flex-col gap-6">
            {NAV_LINKS.map(({ label, section }) => (
              <button
                key={label}
                onClick={() => handleNavClick(section)}
                className="text-left text-3xl font-bold text-black hover:text-gray-500 transition-colors duration-200"
              >
                {label}
              </button>
            ))}

            {/* Contact — external style with arrow */}
            <a
              href="mailto:hello@tera.bio"
              className="flex items-center gap-2 text-3xl font-bold text-black hover:text-gray-500 transition-colors duration-200"
              onClick={() => setMenuOpen(false)}
            >
              Contact
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </nav>

          {/* Panel footer */}
          <div className="flex items-end justify-between pt-6 border-t border-gray-100">
            <div className="flex flex-col gap-2">
              <a href="#" className="text-sm text-gray-400 hover:text-black transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-black transition-colors">
                Legal Mentions
              </a>
            </div>

            {/* LinkedIn */}
            <a
              href="#"
              aria-label="LinkedIn"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z" fill="#6B7280" />
                <path d="M6 9H2V21H6V9Z" fill="#6B7280" />
                <path d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z" fill="#6B7280" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
