"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, type Easing } from "framer-motion";
import CountdownTimer from "./CountdownTimer";
import Snowfall from "./Snowfall";
import { useLanguage } from "@/lib/i18n";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const PINK = "#7D2548";
const PINK_DEEP = "#3D0F20";
const GOLD = "#C9A84C";
const GOLD_LIGHT = "#e8d5a3";

const FLIP_EASE: Easing = [0.4, 0, 0.15, 1.05];

const SHADOW_CLOSED =
  "0 30px 60px rgba(0,0,0,0.5), 0 5px 15px rgba(0,0,0,0.3)";
const SHADOW_OPEN =
  "0 40px 80px rgba(0,0,0,0.4), 0 10px 30px rgba(15,32,87,0.3)";

const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  left: `${(i * 13 + 4) % 97}%`,
  size: `${(i % 3) + 2}px`,
  duration: `${12 + (i % 9)}s`,
  delay: `${(i * 0.9) % 10}s`,
}));

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function Particles() {
  return (
    <>
      {PARTICLES.map((p) => (
        <span
          key={p.id}
          className="particle pointer-events-none"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animationDuration: p.duration,
            animationDelay: p.delay,
          }}
        />
      ))}
    </>
  );
}

type CornerFlip = "x" | "y" | "both" | undefined;

function getCornerTransform(flip: CornerFlip): string {
  if (flip === "both") return "scale(-1,-1)";
  if (flip === "x") return "scale(-1,1)";
  if (flip === "y") return "scale(1,-1)";
  return "scale(1,1)";
}

/** Gold corner ornament for closed (navy) cover. Animates with stroke-dashoffset. */
function CoverCorner({
  flip,
  className = "",
  baseDelay = 0,
}: {
  flip?: CornerFlip;
  className?: string;
  baseDelay?: number;
}) {
  return (
    <svg
      viewBox="0 0 90 90"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: getCornerTransform(flip) }}
    >
      <path
        d="M2 2 L60 2"
        stroke={GOLD}
        strokeWidth="1.2"
        className="draw-path"
        style={{ animationDelay: `${baseDelay + 0.2}s` }}
      />
      <path
        d="M2 2 L2 60"
        stroke={GOLD}
        strokeWidth="1.2"
        className="draw-path"
        style={{ animationDelay: `${baseDelay + 0.4}s` }}
      />
      <path
        d="M12 2 L12 12 L2 12"
        stroke={GOLD}
        strokeWidth="0.8"
        className="draw-path"
        style={{ animationDelay: `${baseDelay + 0.7}s` }}
      />
      <path
        d="M22 2 Q22 22 2 22"
        stroke={GOLD}
        strokeWidth="0.6"
        className="draw-path"
        style={{
          animationDelay: `${baseDelay + 0.9}s`,
          strokeOpacity: 0.6,
        }}
      />
      <path
        d="M34 2 Q34 34 2 34"
        stroke={GOLD}
        strokeWidth="0.4"
        className="draw-path"
        style={{
          animationDelay: `${baseDelay + 1.1}s`,
          strokeOpacity: 0.35,
        }}
      />
      <circle
        cx="12"
        cy="12"
        r="2"
        fill={GOLD}
        className="anim-fade-in"
        style={{ animationDelay: `${baseDelay + 1}s` }}
      />
    </svg>
  );
}

/** Navy corner ornament for opened (white) inner card. Reveals via framer-motion fade. */
function InnerCorner({
  flip,
  className = "",
  delay = 0,
}: {
  flip?: CornerFlip;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.svg
      viewBox="0 0 90 90"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: getCornerTransform(flip) }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
    >
      <path d="M2 2 L60 2" stroke={PINK} strokeWidth="1.2" />
      <path d="M2 2 L2 60" stroke={PINK} strokeWidth="1.2" />
      <path d="M12 2 L12 12 L2 12" stroke={PINK} strokeWidth="0.8" />
      <path
        d="M22 2 Q22 22 2 22"
        stroke={PINK}
        strokeWidth="0.6"
        strokeOpacity={0.55}
      />
      <path
        d="M34 2 Q34 34 2 34"
        stroke={PINK}
        strokeWidth="0.4"
        strokeOpacity={0.3}
      />
      <circle cx="12" cy="12" r="2" fill={PINK} />
    </motion.svg>
  );
}

function PinkDivider({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      className="flex items-center gap-3 w-full max-w-[220px] mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay }}
    >
      <motion.div
        className="flex-1 h-px origin-right"
        style={{
          background: `linear-gradient(to left, ${PINK}, transparent)`,
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.9, delay, ease: "easeOut" }}
      />
      <svg viewBox="0 0 16 16" width="9" height="9" fill={PINK}>
        <polygon points="8,0 16,8 8,16 0,8" />
      </svg>
      <motion.div
        className="flex-1 h-px origin-left"
        style={{
          background: `linear-gradient(to right, ${PINK}, transparent)`,
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.9, delay, ease: "easeOut" }}
      />
    </motion.div>
  );
}

function GoldDivider() {
  return (
    <div className="flex items-center gap-2 w-full max-w-[180px] mx-auto">
      <div
        className="flex-1 h-px"
        style={{
          background: `linear-gradient(to left, ${GOLD}, transparent)`,
        }}
      />
      <svg viewBox="0 0 16 16" width="7" height="7" fill={GOLD}>
        <polygon points="8,0 16,8 8,16 0,8" />
      </svg>
      <div
        className="flex-1 h-px"
        style={{
          background: `linear-gradient(to right, ${GOLD}, transparent)`,
        }}
      />
    </div>
  );
}

/** Tiny ornamental flourish (centered line + dot motifs). */
function Flourish({ delay = 0 }: { delay?: number }) {
  return (
    <motion.svg
      viewBox="0 0 120 12"
      width="120"
      height="12"
      fill="none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay }}
      className="mx-auto"
    >
      <path
        d="M2 6 Q30 0 60 6 T118 6"
        stroke={PINK}
        strokeWidth="0.7"
        strokeOpacity={0.6}
      />
      <circle cx="60" cy="6" r="1.4" fill={PINK} />
      <circle cx="20" cy="6" r="0.8" fill={PINK} fillOpacity={0.5} />
      <circle cx="100" cy="6" r="0.8" fill={PINK} fillOpacity={0.5} />
    </motion.svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

type Phase = 0 | 1 | 2 | 3;

const CARD_WIDTH = 320;
const CARD_HEIGHT = 500;

export default function HeroSection() {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<Phase>(0);

  useEffect(() => {
    setMounted(true);
    const t1 = setTimeout(() => setPhase(1), 50);
    return () => clearTimeout(t1);
  }, []);

  function handleOpen() {
    if (phase !== 1) return;
    setPhase(2);
    setTimeout(() => setPhase(3), 1600);
  }

  const isOpen = phase >= 2;
  const isFlipping = phase === 2;
  const isRevealed = phase >= 3;

  // stagger timings (relative to phase 3 start)
  const REVEAL_BASE = 0.1;
  const STEP = 0.15;
  const d = (i: number) => REVEAL_BASE + STEP * i;

  return (
    <section
      id="home"
      className="relative min-h-dvh flex flex-col items-center justify-center overflow-hidden py-12"
    >
      {/* Hero background photo */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
      />

      {/* Deep navy overlay — darkens bottom (where card sits) more than top (shows sky + mountains) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(61,15,32,0.38) 0%, rgba(45,10,24,0.55) 40%, rgba(26,5,14,0.78) 70%, rgba(26,5,14,0.90) 100%)",
        }}
      />

      {/* Subtle vignette ring */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 45%, rgba(26,5,14,0.55) 100%)",
        }}
      />

      {/* Floating gold particles */}
      {mounted && <Particles />}

      {/* Snow / sparkle fall */}
      <Snowfall count={45} />

      {/* Card stage with perspective */}
      <div
        className="relative z-10 w-full flex justify-center px-4"
        style={{ perspective: "1400px" }}
      >
        <AnimatePresence>
          <motion.div
            key="card"
            className="relative"
            style={{
              width: "100%",
              maxWidth: `${CARD_WIDTH}px`,
              height: `${CARD_HEIGHT}px`,
              transformStyle: "preserve-3d",
            }}
            initial={{ y: 120, opacity: 0, rotateY: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              rotateY: isOpen ? -180 : 0,
              boxShadow: isOpen ? SHADOW_OPEN : SHADOW_CLOSED,
            }}
            transition={{
              y: {
                duration: 1.2,
                delay: 0.3,
                ease: [0.22, 1, 0.36, 1],
              },
              opacity: { duration: 0.6, delay: 0.3 },
              rotateY: { duration: 1.5, ease: FLIP_EASE },
              boxShadow: { duration: 1.2, ease: "easeOut" },
            }}
          >
            {/* ---------- FRONT FACE (closed cover, navy) ---------- */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
              style={{
                background: `linear-gradient(160deg, ${PINK} 0%, ${PINK_DEEP} 100%)`,
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                border: "1px solid rgba(201,168,76,0.35)",
                cursor: phase === 1 ? "pointer" : "default",
              }}
              onClick={handleOpen}
            >
              {/* Corner ornaments (gold, draw-in) */}
              <CoverCorner
                className="absolute top-0 left-0 w-[72px] h-[72px]"
                baseDelay={0.5}
              />
              <CoverCorner
                flip="x"
                className="absolute top-0 right-0 w-[72px] h-[72px]"
                baseDelay={0.5}
              />
              <CoverCorner
                flip="y"
                className="absolute bottom-0 left-0 w-[72px] h-[72px]"
                baseDelay={0.5}
              />
              <CoverCorner
                flip="both"
                className="absolute bottom-0 right-0 w-[72px] h-[72px]"
                baseDelay={0.5}
              />

              {/* Inner gold frame */}
              <div
                className="absolute inset-5 pointer-events-none"
                style={{
                  border: "1px solid rgba(201,168,76,0.18)",
                }}
              />

              {/* Cover content */}
              <motion.p
                className="text-[10px] tracking-[0.4em] uppercase font-inter mb-6"
                style={{ color: GOLD }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                {t.hero.invitation}
              </motion.p>

              <motion.div
                className="flex flex-col items-center gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 1.2 }}
              >
                <h2
                  className="font-playfair italic text-white"
                  style={{ fontSize: "2rem", lineHeight: 1.15, letterSpacing: "0.02em" }}
                >
                  Norman
                  <br />
                  <span style={{ fontSize: "1.5rem" }}>❤️</span>
                  <br />
                  Jooyi
                </h2>
                <GoldDivider />
                <p
                  className="font-cormorant italic"
                  style={{
                    color: "rgba(255,255,255,0.65)",
                    fontSize: "0.95rem",
                    letterSpacing: "0.15em",
                  }}
                >
                  {t.hero.coupleDate}
                </p>
              </motion.div>

              {/* Open button — shown when card has entered, hidden after flip */}
              <AnimatePresence>
                {phase === 1 && (
                  <motion.div
                    className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-3"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <motion.button
                      onClick={(e) => { e.stopPropagation(); handleOpen(); }}
                      className="font-inter uppercase tracking-[0.25em] text-[10px] px-6 py-2.5 rounded-full"
                      style={{
                        background: "rgba(201,168,76,0.15)",
                        border: `1px solid ${GOLD}`,
                        color: GOLD,
                        backdropFilter: "blur(4px)",
                      }}
                      whileHover={{ scale: 1.05, background: "rgba(201,168,76,0.28)" }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {t.hero.openInvitation}
                    </motion.button>
                    <motion.div
                      animate={{ y: [0, 4, 0] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke={GOLD} strokeWidth="1.5">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ---------- BACK FACE (opened, white interior) ---------- */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center text-center px-7"
              style={{
                background:
                  "linear-gradient(180deg, #ffffff 0%, #fbfaf6 100%)",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                border: "1px solid rgba(125,37,72,0.18)",
              }}
            >
              {/* Inner navy corner ornaments — appear after flip */}
              {isRevealed && (
                <>
                  <InnerCorner
                    className="absolute top-0 left-0 w-[64px] h-[64px]"
                    delay={0}
                  />
                  <InnerCorner
                    flip="x"
                    className="absolute top-0 right-0 w-[64px] h-[64px]"
                    delay={0.05}
                  />
                  <InnerCorner
                    flip="y"
                    className="absolute bottom-0 left-0 w-[64px] h-[64px]"
                    delay={0.1}
                  />
                  <InnerCorner
                    flip="both"
                    className="absolute bottom-0 right-0 w-[64px] h-[64px]"
                    delay={0.15}
                  />
                </>
              )}

              {/* Inner faint frame */}
              <div
                className="absolute inset-4 pointer-events-none"
                style={{ border: "1px solid rgba(125,37,72,0.08)" }}
              />

              {isRevealed && (
                <div className="relative z-10 flex flex-col items-center gap-3 w-full">
                  <motion.p
                    className="text-[9px] tracking-[0.4em] uppercase font-inter"
                    style={{ color: GOLD }}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: d(0) }}
                  >
                    {t.hero.togetherFamilies}
                  </motion.p>

                  <motion.p
                    className="font-cormorant italic"
                    style={{
                      color: PINK,
                      fontSize: "0.95rem",
                      letterSpacing: "0.05em",
                    }}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: d(1) }}
                  >
                    {t.hero.weddingOf}
                  </motion.p>

                  <motion.h1
                    className="font-playfair italic"
                    style={{
                      color: PINK,
                      fontSize: "2.5rem",
                      lineHeight: 1.05,
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: d(2) }}
                  >
                    Ang Norman
                  </motion.h1>

                  <motion.span
                    className="font-cormorant"
                    style={{
                      color: GOLD,
                      fontSize: "1.8rem",
                      lineHeight: 1,
                      fontStyle: "italic",
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, delay: d(3) }}
                  >
                    &amp;
                  </motion.span>

                  <motion.h1
                    className="font-playfair italic"
                    style={{
                      color: PINK,
                      fontSize: "2.5rem",
                      lineHeight: 1.05,
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: d(4) }}
                  >
                    Ong Joo Yi
                  </motion.h1>

                  <div className="w-full mt-2">
                    <PinkDivider delay={d(5)} />
                  </div>

                  <motion.p
                    className="font-cormorant"
                    style={{
                      color: PINK,
                      fontSize: "1.2rem",
                      letterSpacing: "0.08em",
                    }}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: d(6) }}
                  >
                    {t.hero.fullDate}
                  </motion.p>

                  <motion.p
                    className="text-[10px] tracking-[0.3em] uppercase font-inter"
                    style={{ color: "rgba(15,32,87,0.55)" }}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: d(7) }}
                  >
                    {t.hero.venue}
                  </motion.p>

                  <div className="mt-1">
                    <Flourish delay={d(8)} />
                  </div>
                </div>
              )}
            </div>

            {/* ---------- SHIMMER overlay (visible only during flip) ---------- */}
            <AnimatePresence>
              {isFlipping && (
                <motion.div
                  key="shimmer"
                  className="absolute inset-0 pointer-events-none overflow-hidden"
                  style={{ zIndex: 5 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    className="absolute top-0 bottom-0"
                    style={{
                      width: "60%",
                      background:
                        "linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.45) 50%, transparent 80%)",
                      filter: "blur(2px)",
                    }}
                    initial={{ left: "-70%" }}
                    animate={{ left: "110%" }}
                    transition={{
                      duration: 1.1,
                      delay: 0.2,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Countdown — fades in 1s after reveal */}
      <div className="relative z-10 mt-10 w-full max-w-[360px] px-4">
        <AnimatePresence>
          {isRevealed && (
            <motion.div
              key="countdown"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1, ease: "easeOut" }}
            >
              <p
                className="text-center text-[10px] tracking-[0.3em] uppercase mb-4 font-inter"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                {t.hero.countdown}
              </p>
              <CountdownTimer targetDate="2027-05-15T00:00:00" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scroll indicator — fades in 1.5s after reveal */}
      <AnimatePresence>
        {isRevealed && (
          <motion.div
            key="scroll"
            className="absolute bottom-6 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.5, ease: "easeOut" }}
          >
            <a
              href="#story"
              className="flex flex-col items-center gap-2 group float-bob"
              aria-label="Scroll down to story"
            >
              <span
                className="text-[9px] tracking-[0.35em] uppercase font-inter"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                {t.hero.scroll}
              </span>
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke={GOLD}
                strokeWidth="1.5"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
