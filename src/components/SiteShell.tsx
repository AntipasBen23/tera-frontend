"use client";

import { useState, useCallback, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Preloader from "./Preloader";
import SectionIndicator from "./SectionIndicator";
import HeroSection from "./sections/HeroSection";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const NAV_LINKS = [
  { label: "Platform",     section: 1 },
  { label: "Technology",   section: 2 },
  { label: "Applications", section: 3 },
  { label: "Team",         section: 4 },
  { label: "Investors",    section: 5 },
];

export default function SiteShell() {
  const [loaded, setLoaded]             = useState(false);
  const [menuOpen, setMenuOpen]         = useState(false);
  const [theme, setTheme]               = useState<"dark" | "light">("dark");
  const [scrollProgress, setScrollProgress] = useState(0);

  const activeSection = Math.min(Math.floor(scrollProgress * 6), 5);

  const onPreloaderDone = useCallback(() => setLoaded(true), []);

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme") as "dark" | "light";
    if (current) setTheme(current);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
  };

  const jumpToSection = useCallback((index: number) => {
    const st = ScrollTrigger.getById("heroTrigger");
    if (!st) return;
    const target = st.start + (st.end - st.start) * (index / 6);
    window.scrollTo({ top: target, behavior: "smooth" });
  }, []);

  const handleNavClick = (section: number) => {
    jumpToSection(section);
    setMenuOpen(false);
  };

  return (
    <>
      {/* Preloader */}
      {!loaded && <Preloader onComplete={onPreloaderDone} />}

      {/* Page content */}
      <div
        id="scroll-container"
        style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.4s ease" }}
      >
        <HeroSection onScrollProgress={setScrollProgress} />
      </div>

      {/* Fixed section indicator */}
      <div className="hidden md:block">
        <SectionIndicator
          active={activeSection}
          scrollProgress={scrollProgress}
          onChange={jumpToSection}
        />
      </div>

      {/* Circular pulsing theme toggle */}
      <button
        onClick={toggleTheme}
        className="fixed z-50 hidden md:flex items-center group"
        style={{ right: "110px", top: "52%", transform: "translateY(-50%)" }}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      >
        <span
          className="mr-4 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap select-none"
          style={{ color: "var(--text-secondary)", letterSpacing: "0.06em" }}
        >
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </span>

        <span className="relative flex items-center justify-center" style={{ width: 16, height: 16 }}>
          {[0, 0.6, 1.2, 1.8].map((delay, i) => (
            <span
              key={i}
              className="absolute rounded-full"
              style={{
                width: 16, height: 16,
                top: 0, left: 0,
                border: `1px solid rgba(255,255,255,${0.6 - i * 0.1})`,
                animation: "radarPing 2.4s ease-out infinite",
                animationDelay: `${delay}s`,
              }}
            />
          ))}
          <span className="relative block rounded-full" style={{ width: 12, height: 12, background: "rgba(255,255,255,0.88)" }} />
        </span>
      </button>

      {/* Logo */}
      <div className="fixed z-50" style={{ left: "clamp(16px, 5vw, 72px)", top: "clamp(24px, 4vh, 55px)" }} aria-label="Tera">
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
          Tera
        </span>
      </div>

      {/* Header */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-start justify-end gap-3"
        style={{ paddingTop: "clamp(20px, 3.5vh, 49px)", paddingRight: "clamp(16px, 5vw, 72px)" }}
      >
        {/* Mobile theme toggle — visible in header so users can find it without opening the menu */}
        <button
          onClick={toggleTheme}
          className="md:hidden flex items-center justify-center rounded-full active:scale-95 transition-transform"
          style={{ width: "44px", height: "44px", border: "1px solid rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.06)" }}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M12 3v1m0 16v1M4.22 4.22l.71.71m12.73 12.73.71.71M3 12H2m20 0h-1M4.22 19.78l.71-.71M18.36 5.64l.71-.71M12 7a5 5 0 1 0 0 10A5 5 0 0 0 12 7z" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="#0D1520" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>

        <button
          onClick={() => setMenuOpen(true)}
          className="relative flex items-center gap-3 overflow-hidden rounded border border-white/30 group"
          style={{ padding: "14px 20px" }}
          aria-label="Open menu"
        >
          <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
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
      </header>

      {/* Dark overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile scroll indicator — section number above, progress bar below */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex flex-col items-center" style={{ paddingBottom: "6px" }}>
        <span
          key={activeSection}
          style={{
            color: "var(--accent)",
            fontFamily: "var(--font-mono), monospace",
            fontSize: "0.58rem",
            letterSpacing: "0.18em",
            marginBottom: "4px",
            animation: "contentFadeIn 0.3s ease forwards",
          }}
        >
          {String(activeSection + 1).padStart(2, "0")}
        </span>
        <div style={{ width: "100%", height: "1.5px", background: "rgba(255,255,255,0.08)" }}>
          <div style={{ height: "100%", width: `${scrollProgress * 100}%`, background: "linear-gradient(90deg, var(--accent), #44C038)", transition: "width 0.06s linear" }} />
        </div>
      </div>

      {/* Slide-out menu panel */}
      <div
        className={`fixed top-3 right-3 bottom-3 w-full max-w-sm z-[70] flex flex-col transition-transform duration-500 ease-out ${
          menuOpen ? "translate-x-0" : "translate-x-[calc(100%+1rem)]"
        }`}
        style={{ background: "var(--surface-alt)", border: "1px solid var(--border)" }}
      >
        <div className="flex flex-col h-full" style={{ padding: "clamp(24px, 4vh, 44px) clamp(24px, 5vw, 40px)" }}>

          {/* Header */}
          <div className="flex items-center justify-between" style={{ marginBottom: "clamp(20px, 3vh, 36px)" }}>
            <span style={{ color: "var(--text-muted)", fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", fontFamily: "var(--font-mono), monospace" }}>
              Navigation
            </span>
            <button
              onClick={() => setMenuOpen(false)}
              className="w-9 h-9 flex items-center justify-center transition-colors"
              style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}
              aria-label="Close menu"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div style={{ height: "1px", background: "var(--border)" }} />

          {/* Nav links */}
          <nav className="flex-1 flex flex-col" style={{ paddingTop: "clamp(4px, 1vh, 8px)" }}>
            {NAV_LINKS.map(({ label, section }, i) => (
              <button
                key={label}
                onClick={() => handleNavClick(section)}
                className="group flex items-center gap-4 text-left transition-all duration-200"
                style={{ borderBottom: "1px solid var(--border)", padding: "clamp(14px, 2.4vh, 22px) 0" }}
              >
                <span style={{ color: "var(--accent)", fontFamily: "var(--font-mono), monospace", fontSize: "10px", letterSpacing: "0.12em", minWidth: "22px" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className="flex-1 group-hover:translate-x-1 transition-transform duration-200"
                  style={{ color: "var(--text-primary)", fontSize: "clamp(18px, 4vw, 22px)", fontWeight: 600, letterSpacing: "-0.02em", fontFamily: "var(--font-lato), Lato, sans-serif" }}
                >
                  {label}
                </span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ color: "var(--accent)", flexShrink: 0 }}>
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            ))}

            <a
              href="mailto:hello@tera.bio"
              className="group flex items-center gap-4"
              style={{ borderBottom: "1px solid var(--border)", padding: "clamp(14px, 2.4vh, 22px) 0" }}
              onClick={() => setMenuOpen(false)}
            >
              <span style={{ color: "var(--accent)", fontFamily: "var(--font-mono), monospace", fontSize: "10px", letterSpacing: "0.12em", minWidth: "22px" }}>06</span>
              <span
                className="flex-1 group-hover:translate-x-1 transition-transform duration-200"
                style={{ color: "var(--text-primary)", fontSize: "clamp(18px, 4vw, 22px)", fontWeight: 600, letterSpacing: "-0.02em", fontFamily: "var(--font-lato), Lato, sans-serif" }}
              >
                Contact
              </span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ color: "var(--text-muted)", flexShrink: 0 }}>
                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </nav>

          {/* Footer */}
          <div className="flex items-center justify-between" style={{ paddingTop: "clamp(20px, 3vh, 32px)", borderTop: "1px solid var(--border)" }}>
            <button
              onClick={() => { toggleTheme(); setMenuOpen(false); }}
              className="flex items-center gap-2 transition-colors duration-200"
              style={{ color: "var(--text-muted)", fontSize: "11px", fontFamily: "var(--font-lato), Lato, sans-serif", letterSpacing: "0.08em" }}
            >
              {theme === "dark" ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 3v1m0 16v1M4.22 4.22l.71.71m12.73 12.73.71.71M3 12H2m20 0h-1M4.22 19.78l.71-.71M18.36 5.64l.71-.71M12 7a5 5 0 1 0 0 10A5 5 0 0 0 12 7z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              )}
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </button>

            <div className="flex items-center gap-3">
              <a href="#" style={{ color: "var(--text-muted)", fontSize: "11px", fontFamily: "var(--font-lato), Lato, sans-serif" }}>Privacy</a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="w-8 h-8 flex items-center justify-center transition-colors"
                style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z"/>
                  <path d="M6 9H2V21H6V9Z"/>
                  <path d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z"/>
                </svg>
              </a>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
