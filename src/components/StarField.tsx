"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  speed: number;
  phase: number;
  gold: boolean;
}

function createStars(width: number, height: number): Star[] {
  const count = Math.min(150, Math.max(70, Math.floor((width * height) / 12_000)));
  return Array.from({ length: count }, (_, index) => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: index % 23 === 0 ? 1.2 : Math.random() * 0.8 + 0.25,
    alpha: Math.random() * 0.45 + 0.2,
    speed: Math.random() * 0.65 + 0.15,
    phase: Math.random() * Math.PI * 2,
    gold: index % 11 === 0,
  }));
}

export function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;
    let stars = createStars(width, height);
    let frame = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = createStars(width, height);
    };

    const paint = (time: number) => {
      context.clearRect(0, 0, width, height);

      for (const star of stars) {
        const twinkle = reducedMotion
          ? 1
          : 0.65 + Math.sin(time * 0.00045 * star.speed + star.phase) * 0.35;
        context.beginPath();
        context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        context.fillStyle = star.gold
          ? `rgba(201, 169, 108, ${star.alpha * twinkle})`
          : `rgba(226, 234, 245, ${star.alpha * twinkle})`;
        context.fill();
      }
    };

    const animate = (time: number) => {
      paint(time);
      if (!reducedMotion) {
        frame = window.requestAnimationFrame(animate);
      }
    };

    resize();
    paint(0);

    if (!reducedMotion) {
      frame = window.requestAnimationFrame(animate);
    }

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return <canvas ref={canvasRef} className="star-field" aria-hidden="true" />;
}
