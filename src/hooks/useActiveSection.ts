"use client";

import { useEffect, useState, useCallback } from "react";

export function useActiveSection(count: number) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const container = document.getElementById("scroll-container");
    if (!container) return;

    const onScroll = () => {
      const scrollTop = container.scrollTop;
      const sectionHeight = container.clientHeight;
      const index = Math.round(scrollTop / sectionHeight);
      setActive(Math.min(Math.max(index, 0), count - 1));
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, [count]);

  const scrollTo = useCallback((index: number) => {
    const container = document.getElementById("scroll-container");
    if (!container) return;
    container.scrollTo({
      top: index * container.clientHeight,
      behavior: "smooth",
    });
  }, []);

  return { active, scrollTo };
}
