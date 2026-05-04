"use client";

import { useEffect, useRef } from "react";
import Snowfall from "./Snowfall";

const EVENTS = [
  {
    time: "6:00 PM",  title: "Cocktail Reception", desc: "Welcome drinks and mingling with guests.",
    icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  },
  {
    time: "7:00 PM",  title: "Wedding Ceremony",   desc: "The exchange of vows and rings.",
    icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  },
  {
    time: "7:30 PM",  title: "Wedding Dinner",     desc: "Feast and celebrate with loved ones.",
    icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>,
  },
  {
    time: "11:00 PM", title: "Celebration Ends",   desc: "Thank you for sharing this day with us.",
    icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  },
];

export default function WeddingDetailsSection() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll(".reveal-section").forEach((child, i) => {
            setTimeout(() => (child as HTMLElement).classList.add("visible"), i * 120);
          });
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="details"
      ref={ref}
      className="relative min-h-dvh flex items-center justify-center overflow-hidden"
    >
      {/* Wedding photo background — positioned to centre on groom for mobile */}
      <div
        className="absolute inset-0 bg-cover bg-no-repeat"
        style={{
          backgroundImage:    `url('/images/details-bg.jpg')`,
          backgroundColor:    "#2D0A18",
          backgroundPosition: "50% center",
        }}
      />
      {/* Rose overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(26,5,14,0.88) 0%, rgba(92,26,53,0.78) 50%, rgba(26,5,14,0.88) 100%)",
        }}
      />

      {/* Snow */}
      <Snowfall count={36} />

      <div className="relative z-10 w-full max-w-md mx-auto px-8 py-20">
        <div className="text-center mb-12">
          <p className="reveal-section text-[10px] tracking-[0.4em] uppercase mb-3 font-inter" style={{ color: "#e090b0" }}>
            Mark Your Calendar
          </p>
          <h2 className="reveal-section font-playfair italic" style={{ fontSize: "clamp(2.2rem,9vw,3rem)", lineHeight: 1.2, color: "white" }}>
            The Details
          </h2>
        </div>

        {/* Info cards */}
        <div className="reveal-section grid grid-cols-2 gap-3 mb-10">
          {[
            {
              label: "Date", value: "15 May 2027", sub: "Saturday",
              icon: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#e090b0" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
            },
            {
              label: "Venue", value: "VTEC", sub: "Batu Kawan",
              icon: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#e090b0" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
            },
            {
              label: "Time", value: "6:00 PM", sub: "onwards",
              icon: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#e090b0" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
            },
            {
              label: "Dress Code", value: "Formal", sub: "Pink preferred",
              icon: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#e090b0" strokeWidth="1.5"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/></svg>,
            },
          ].map((item) => (
            <div key={item.label} className="p-4 text-center"
              style={{ border: "1px solid rgba(224,144,176,0.2)", background: "rgba(192,72,120,0.06)" }}>
              <div className="flex justify-center mb-2">{item.icon}</div>
              <p className="font-inter text-[9px] tracking-[0.25em] uppercase mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>{item.label}</p>
              <p className="font-cormorant font-semibold" style={{ fontSize: "1rem", color: "#f5c4d8" }}>{item.value}</p>
              <p className="font-inter text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>{item.sub}</p>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="reveal-section flex items-center gap-3 mb-10">
          <div className="flex-1 h-px" style={{ background: "rgba(224,144,176,0.2)" }} />
          <svg viewBox="0 0 16 16" width="8" height="8" fill="#e090b0" opacity="0.5"><polygon points="8,0 16,8 8,16 0,8" /></svg>
          <div className="flex-1 h-px" style={{ background: "rgba(224,144,176,0.2)" }} />
        </div>

        {/* Programme */}
        <div className="reveal-section space-y-0">
          <p className="font-inter text-[10px] tracking-[0.3em] uppercase mb-6" style={{ color: "rgba(255,255,255,0.35)" }}>Programme</p>
          {EVENTS.map((event, i) => (
            <div key={event.title} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ border: "1px solid rgba(224,144,176,0.35)", color: "#e090b0", background: "rgba(192,72,120,0.06)" }}>
                  {event.icon}
                </div>
                {i < EVENTS.length - 1 && (
                  <div className="w-px flex-1 my-1 min-h-[32px]" style={{ background: "rgba(192,72,120,0.15)" }} />
                )}
              </div>
              <div className="pb-6">
                <p className="font-inter text-[10px] tracking-widest uppercase mb-0.5" style={{ color: "#e090b0" }}>{event.time}</p>
                <p className="font-cormorant font-semibold text-lg leading-tight" style={{ color: "white" }}>{event.title}</p>
                <p className="font-inter text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{event.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
