"use client";

import { useEffect, useRef } from "react";

interface ParallaxTarget {
  x: number;
  y: number;
}

export function useMouseParallax(strength = 1) {
  const current = useRef<ParallaxTarget>({ x: 0, y: 0 });
  const target = useRef<ParallaxTarget>({ x: 0, y: 0 });
  const rafId = useRef<number>(0);
  const listeners = useRef<((x: number, y: number) => void)[]>([]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const isTouchDevice = window.matchMedia("(hover: none)").matches;

    if (mq.matches || isTouchDevice) return;

    const onMove = (e: MouseEvent) => {
      target.current.x = ((e.clientX / window.innerWidth) * 2 - 1) * strength;
      target.current.y = (-(e.clientY / window.innerHeight) * 2 + 1) * strength;
    };

    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * 0.06;
      current.current.y += (target.current.y - current.current.y) * 0.06;

      for (const cb of listeners.current) {
        cb(current.current.x, current.current.y);
      }

      rafId.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    rafId.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId.current);
    };
  }, [strength]);

  const subscribe = (cb: (x: number, y: number) => void) => {
    listeners.current.push(cb);
    return () => {
      listeners.current = listeners.current.filter((l) => l !== cb);
    };
  };

  return { subscribe };
}
