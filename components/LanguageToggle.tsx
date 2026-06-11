"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n";

const OPTIONS: { id: "en" | "zh"; label: string }[] = [
  { id: "en", label: "EN" },
  { id: "zh", label: "中文" },
];

/** Shared segmented EN / 中文 control. Used both floating and inside the NavBar. */
export function LangSegments({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useLanguage();
  return (
    <>
      {OPTIONS.map((opt) => {
        const active = lang === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => setLang(opt.id)}
            aria-label={`Switch language to ${opt.label}`}
            aria-pressed={active}
            className={`rounded-full font-inter tracking-wider transition-all duration-300 ${
              compact ? "px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-xs" : "px-3 py-1 text-[11px]"
            }`}
            style={
              active
                ? { background: "#c04878", color: "#fff" }
                : { background: "transparent", color: "rgba(255,255,255,0.55)" }
            }
          >
            {opt.label}
          </button>
        );
      })}
    </>
  );
}

/**
 * Floating toggle for the top of the page (over the hero, where the NavBar is
 * hidden). It fades out once the NavBar slides in so the two never overlap —
 * the NavBar carries its own switch from that point on.
 */
export default function LanguageToggle() {
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY <= 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed top-4 right-4 z-[60] flex items-center rounded-full p-0.5 transition-opacity duration-300"
      style={{
        background: "rgba(45,10,24,0.82)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(192,72,120,0.35)",
        opacity: atTop ? 1 : 0,
        pointerEvents: atTop ? "auto" : "none",
      }}
    >
      <LangSegments />
    </div>
  );
}
