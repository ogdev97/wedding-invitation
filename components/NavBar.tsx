"use client";

import { useEffect, useState } from "react";
import { clsx } from "clsx";

const NAV_LINKS = [
  { href: "#home",    label: "Home"    },
  { href: "#story",   label: "Story"   },
  { href: "#details", label: "Details" },
  { href: "#gallery", label: "Gallery" },
  { href: "#rsvp",    label: "RSVP"   },
];

export default function NavBar() {
  const [visible, setVisible] = useState(false);
  const [active, setActive]   = useState("home");

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 80);
      const sections = ["home", "story", "details", "gallery", "rsvp"];
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) { setActive(id); break; }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={clsx(
        "fixed top-0 inset-x-0 z-50 transition-all duration-500",
        visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      )}
    >
      <div
        className="mx-3 mt-3 rounded-full px-3 py-2.5 flex items-center justify-between gap-2"
        style={{
          background:     "rgba(45,10,24,0.88)",
          backdropFilter: "blur(14px)",
          border:         "1px solid rgba(192,72,120,0.25)",
        }}
      >
        {/* Logo — hidden on mobile to give links full room */}
        <span
          className="hidden sm:block font-playfair italic text-sm whitespace-nowrap flex-shrink-0"
          style={{ color: "#f5c4d8" }}
        >
          AJ❤️
        </span>

        <ul className="flex items-center justify-around sm:justify-start sm:gap-1 w-full sm:w-auto">
          {NAV_LINKS.map((link) => {
            const id       = link.href.replace("#", "");
            const isActive = active === id;
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={clsx(
                    "block px-2.5 py-1 rounded-full text-[10px] tracking-wider uppercase font-inter transition-all duration-300 whitespace-nowrap",
                    isActive ? "" : "text-white/50 hover:text-white/80"
                  )}
                  style={
                    isActive
                      ? { background: "#c04878", color: "#fff" }
                      : {}
                  }
                >
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
