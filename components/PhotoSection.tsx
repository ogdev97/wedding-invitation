"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, type PanInfo } from "framer-motion";
import Image from "next/image";
import Snowfall from "./Snowfall";

const PHOTOS = [
  { src: "/images/gallery-DSC07120.jpg", caption: "Pure Joy",       sub: "Petals in the air",    objectPosition: "center" },
  { src: "/images/gallery-DSC07105.jpg", caption: "Together",       sub: "Side by side",         objectPosition: "39% center" },
  { src: "/images/gallery-DSC07091.jpg", caption: "The Rings",      sub: "Sealed with love",     objectPosition: "48% center" },
  { src: "/images/gallery-DSC07078.jpg", caption: "Our Vows",       sub: "Words from the heart", objectPosition: "45% center" },
  { src: "/images/gallery-DSC07038.jpg", caption: "Forever Starts", sub: "The ceremony",         objectPosition: "center" },
];

const SPRING = { type: "spring" as const, stiffness: 320, damping: 38 };
const SWIPE_THRESHOLD = 45;
const AUTO_INTERVAL  = 4500;

export default function PhotoSection() {
  const [current, setCurrent]       = useState(0);
  const [dragging, setDragging]     = useState(false);
  const [cardW, setCardW]           = useState(300);
  const [sectionVisible, setSectionVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef   = useRef<HTMLElement>(null);
  const timerRef     = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Responsive card width */
  useEffect(() => {
    const calc = () => {
      const vw = window.innerWidth;
      setCardW(vw < 768 ? Math.round(vw - 32) : Math.min(Math.round(vw * 0.78), 340));
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  /* Section reveal */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setSectionVisible(true); },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* Auto-advance */
  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setCurrent((c) => (c + 1) % PHOTOS.length);
    }, AUTO_INTERVAL);
  }, []);

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [current, resetTimer]);

  function goTo(idx: number) {
    setCurrent(idx);
    resetTimer();
  }

  function handleDragEnd(_: unknown, info: PanInfo) {
    setDragging(false);
    if (info.offset.x < -SWIPE_THRESHOLD && current < PHOTOS.length - 1) {
      goTo(current + 1);
    } else if (info.offset.x > SWIPE_THRESHOLD && current > 0) {
      goTo(current - 1);
    }
  }

  const GAP = 14;
  /* x so active card is centred in the viewport */
  const trackX = containerRef.current
    ? (containerRef.current.offsetWidth - cardW) / 2 - current * (cardW + GAP)
    : 0;

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="relative min-h-dvh flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/images/hero-bg.jpg')`, backgroundColor: "#1A0510" }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(26,5,14,0.82) 0%, rgba(45,10,24,0.68) 45%, rgba(26,5,14,0.85) 100%)",
        }}
      />
      <Snowfall count={36} />

      <div className="relative z-10 w-full py-16 flex flex-col items-center">

        {/* Header */}
        <div
          className="text-center mb-10 px-8 transition-all duration-700"
          style={{ opacity: sectionVisible ? 1 : 0, transform: sectionVisible ? "translateY(0)" : "translateY(28px)" }}
        >
          <p className="text-[10px] tracking-[0.4em] uppercase mb-3 font-inter" style={{ color: "#e090b0" }}>
            Our Moments
          </p>
          <h2 className="font-playfair italic" style={{ fontSize: "clamp(2.2rem,9vw,3rem)", lineHeight: 1.2, color: "white" }}>
            Gallery
          </h2>
        </div>

        {/* Carousel track */}
        <div ref={containerRef} className="w-full overflow-visible select-none" style={{ touchAction: "pan-y" }}>
          <motion.div
            className="flex"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragStart={() => setDragging(true)}
            onDragEnd={handleDragEnd}
            animate={{ x: trackX }}
            transition={SPRING}
            style={{ gap: GAP, paddingBottom: 8 }}
          >
            {PHOTOS.map((photo, i) => {
              const isActive = i === current;
              return (
                <motion.div
                  key={photo.src}
                  animate={{
                    scale:   isActive ? 1 : 0.88,
                    opacity: isActive ? 1 : 0.52,
                  }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  style={{ width: cardW, flexShrink: 0, cursor: dragging ? "grabbing" : "grab" }}
                  onClick={() => !dragging && goTo(i)}
                >
                  {/* Card */}
                  <div
                    className="relative overflow-hidden"
                    style={{
                      height:       cardW * 1.28,
                      borderRadius: "16px",
                      border:       isActive
                        ? "1.5px solid rgba(224,144,176,0.55)"
                        : "1px solid rgba(224,144,176,0.18)",
                      boxShadow: isActive
                        ? "0 24px 60px rgba(0,0,0,0.45), 0 0 0 1px rgba(192,72,120,0.15)"
                        : "0 8px 24px rgba(0,0,0,0.3)",
                    }}
                  >
                    <Image
                      src={photo.src}
                      alt={photo.caption}
                      fill
                      className="object-cover"
                      style={{ objectPosition: photo.objectPosition }}
                      draggable={false}
                      priority={i === 0}
                      sizes="(max-width: 768px) 96vw, 340px"
                    />

                    {/* Bottom gradient + caption */}
                    <div
                      className="absolute inset-x-0 bottom-0 flex flex-col justify-end px-5 pb-5 pt-16"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(26,5,14,0.85) 0%, transparent 100%)",
                      }}
                    >
                      <p
                        className="font-playfair italic text-white"
                        style={{ fontSize: "1.25rem", lineHeight: 1.2 }}
                      >
                        {photo.caption}
                      </p>
                      <p
                        className="font-inter mt-0.5"
                        style={{ fontSize: "0.65rem", letterSpacing: "0.2em", color: "#f5c4d8", textTransform: "uppercase" }}
                      >
                        {photo.sub}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-2 mt-7">
          {PHOTOS.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to photo ${i + 1}`}
              className="h-2 rounded-full transition-all duration-400"
              style={{
                width:      i === current ? "24px" : "8px",
                background: i === current ? "#c04878" : "rgba(255,255,255,0.3)",
              }}
            />
          ))}
        </div>

        {/* Counter */}
        <p
          className="mt-4 font-inter"
          style={{ fontSize: "0.65rem", letterSpacing: "0.3em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}
        >
          {current + 1} / {PHOTOS.length}
        </p>

        {/* Swipe hint — fades after first swipe */}
        <div
          className="flex items-center gap-2 mt-5 transition-opacity duration-500"
          style={{ opacity: current === 0 ? 0.5 : 0 }}
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#e090b0" strokeWidth="1.5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          <span className="font-inter text-[9px] tracking-[0.25em] uppercase" style={{ color: "#e090b0" }}>
            Swipe to explore
          </span>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#e090b0" strokeWidth="1.5">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </div>
      </div>
    </section>
  );
}
