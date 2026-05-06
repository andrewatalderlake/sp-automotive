"use client";
import { useEffect, useRef } from "react";

// Slow-drifting dust/ember particles rendered to a full-bleed canvas. Designed
// to sit behind a darkened section as ambient atmosphere. No deps; perf-aware:
// caps DPR at 2, uses requestAnimationFrame, bails on reduced motion, pauses
// when the section is not in view.

type Props = {
  /** Number of particles. Lower for cheaper sections. Default 60. */
  count?: number;
  /** Particle base color (rgba). Default white-ish. */
  color?: string;
  className?: string;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
  twinkleOffset: number;
};

export default function ParticleField({ count = 60, color = "255, 255, 255", className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReduced) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    const particles: Particle[] = [];
    let visible = true;
    let frame = 0;
    let t = 0;

    function resize() {
      const rect = wrap!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas!.width = Math.max(1, Math.floor(width * dpr));
      canvas!.height = Math.max(1, Math.floor(height * dpr));
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.scale(dpr, dpr);
    }

    function spawn() {
      particles.length = 0;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.18,
          vy: -0.08 - Math.random() * 0.18,
          r: 0.6 + Math.random() * 1.6,
          alpha: 0.25 + Math.random() * 0.55,
          twinkleOffset: Math.random() * Math.PI * 2,
        });
      }
    }

    function step() {
      t += 0.016;
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        // Wrap
        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const twinkle = 0.5 + 0.5 * Math.sin(t + p.twinkleOffset);
        const a = p.alpha * (0.6 + 0.4 * twinkle);
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${color}, ${a.toFixed(3)})`;
        ctx!.fill();
      }

      if (visible) frame = requestAnimationFrame(step);
    }

    resize();
    spawn();
    visible = true;
    frame = requestAnimationFrame(step);

    const ro = new ResizeObserver(() => {
      // Reset transform before resize so we don't compound scales
      ctx!.setTransform(1, 0, 0, 1, 0, 0);
      resize();
      spawn();
    });
    ro.observe(wrap);

    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const wasVisible = visible;
        visible = entry.isIntersecting;
        if (visible && !wasVisible) frame = requestAnimationFrame(step);
        if (!visible && wasVisible) cancelAnimationFrame(frame);
      }
    });
    io.observe(wrap);

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
    };
  }, [count, color]);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${className}`}
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
