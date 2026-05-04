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
        className="mx-4 mt-3 rounded-full px-6 py-3 flex items-center justify-between gap-6"
        style={{
          background:     "rgba(45,10,24,0.88)",
          backdropFilter: "blur(14px)",
          border:         "1px solid rgba(192,72,120,0.25)",
        }}
      >
        <span
          className="font-playfair italic text-sm whitespace-nowrap"
          style={{ color: "#f5c4d8" }}
        >
          AJ❤️
        </span>

        <ul className="flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const id       = link.href.replace("#", "");
            const isActive = active === id;
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={clsx(
                    "px-3 py-1 rounded-full text-[11px] tracking-wider uppercase font-inter transition-all duration-300",
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
