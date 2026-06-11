"use client";

import { useEffect, useRef } from "react";
import Snowfall from "./Snowfall";
import { useLanguage } from "@/lib/i18n";

export default function OurStorySection() {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll(".reveal-section").forEach((child, i) => {
            setTimeout(() => (child as HTMLElement).classList.add("visible"), i * 150);
          });
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="story"
      ref={ref}
      className="relative min-h-dvh flex items-center justify-center overflow-hidden"
    >
      {/* Wedding photo background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/images/hero-bg.jpg')`, backgroundColor: "#3D0F20" }}
      />
      {/* Rose overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(26,5,14,0.72) 0%, rgba(45,10,24,0.65) 50%, rgba(26,5,14,0.82) 100%)",
        }}
      />

      {/* Snow */}
      <Snowfall count={38} />

      <div className="relative z-10 w-full max-w-md mx-auto px-8 py-20 text-center">
        <p
          className="reveal-section text-[10px] tracking-[0.4em] uppercase mb-4 font-inter"
          style={{ color: "#e090b0" }}
        >
          {t.story.chapter}
        </p>

        <h2
          className="reveal-section font-playfair italic mb-6"
          style={{ fontSize: "clamp(2.2rem,9vw,3rem)", lineHeight: 1.2, color: "white" }}
        >
          {t.story.title}
        </h2>

        <div className="reveal-section flex items-center gap-3 max-w-[180px] mx-auto mb-8">
          <div className="flex-1 h-px" style={{ background: "rgba(224,144,176,0.4)" }} />
          <svg viewBox="0 0 16 16" width="8" height="8" fill="#e090b0">
            <polygon points="8,0 16,8 8,16 0,8" />
          </svg>
          <div className="flex-1 h-px" style={{ background: "rgba(224,144,176,0.4)" }} />
        </div>

        <p
          className="reveal-section font-cormorant leading-relaxed mb-6"
          style={{ fontSize: "clamp(1.1rem,4.5vw,1.25rem)", color: "rgba(255,255,255,0.78)", fontStyle: "italic" }}
        >
          &ldquo;{t.story.quote}&rdquo;
        </p>

        <p
          className="reveal-section font-cormorant"
          style={{ fontSize: "1rem", color: "rgba(255,255,255,0.4)" }}
        >
          {t.story.signature}
        </p>

        {/* Timeline */}
        <div className="reveal-section mt-12 space-y-6 text-left">
          {t.story.timeline.map((item) => (
            <div key={item.year} className="flex items-start gap-4">
              <div className="flex flex-col items-center pt-1">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#c04878" }} />
                <div className="w-px flex-1 mt-1 min-h-[40px]" style={{ background: "rgba(192,72,120,0.2)" }} />
              </div>
              <div className="pb-4">
                <p className="font-cormorant font-semibold text-lg" style={{ color: "#f5c4d8" }}>{item.year}</p>
                <p className="font-inter text-xs tracking-wide mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
