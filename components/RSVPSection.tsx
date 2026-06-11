"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Snowfall from "./Snowfall";
import { useLanguage } from "@/lib/i18n";

/* Couple contact details */
const GROOM = {
  name: "Norman",
  display: "+60 13-488 8747",
  wa: "https://wa.me/60134888747",
  email: "norman1997.an@gmail.com",
};
const BRIDE = {
  name: "Ong Joo Yi",
  display: "+60 11-1101 8088",
  wa: "https://wa.me/601111018088",
};

type Status = "idle" | "loading" | "success" | "error" | "duplicate";

interface FormData {
  name: string;
  phone: string;
  side: "bride" | "groom" | "";
  dietary: string;
  adults: string;
  babies: string;
  message: string;
}

const INITIAL: FormData = {
  name: "",
  phone: "",
  side: "",
  dietary: "",
  adults: "1",
  babies: "0",
  message: "",
};

function InputWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative" style={{ borderBottom: "1px solid rgba(224,144,176,0.25)" }}>
      {children}
    </div>
  );
}

export default function RSVPSection() {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [submittedName, setSubmittedName] = useState("");
  const [submittedSide, setSubmittedSide] = useState<"bride" | "groom" | "">("");
  const [showGuestInfo, setShowGuestInfo] = useState(false);
  const infoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showGuestInfo) return;
    function onDocClick(e: MouseEvent) {
      if (infoRef.current && !infoRef.current.contains(e.target as Node)) {
        setShowGuestInfo(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [showGuestInfo]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll(".reveal-section").forEach((child, i) => {
            setTimeout(() => (child as HTMLElement).classList.add("visible"), i * 100);
          });
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.phone || !form.side) {
      setError(t.rsvp.form.errorFill);
      return;
    }
    setError("");
    setStatus("loading");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.status === 409) {
        setStatus("duplicate");
        return;
      }
      if (!res.ok) throw new Error();
      setSubmittedName(form.name.trim());
      setSubmittedSide(form.side);
      setStatus("success");
      setForm(INITIAL);
    } catch {
      setStatus("error");
    }
  }

  const firstName = useMemo(
    () => (submittedName ? submittedName.split(/\s+/)[0] : ""),
    [submittedName]
  );

  const inputStyle: React.CSSProperties = {
    background: "transparent",
    outline: "none",
    color: "white",
    fontFamily: "var(--font-inter-sans), Inter, system-ui, sans-serif",
    fontSize: "0.875rem",
    width: "100%",
    padding: "12px 0",
    letterSpacing: "0.02em",
  };
  const labelStyle: React.CSSProperties = {
    color: "rgba(255,255,255,0.35)",
    fontSize: "0.65rem",
    letterSpacing: "0.25em",
    textTransform: "uppercase",
    fontFamily: "var(--font-inter-sans), Inter, system-ui, sans-serif",
    display: "block",
    marginBottom: "2px",
  };

  return (
    <section
      id="rsvp"
      ref={ref}
      className="relative min-h-dvh flex items-center justify-center overflow-hidden"
    >
      {/* Wedding photo background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/images/hero-bg.jpg')`, backgroundColor: "#1A0510" }}
      />
      {/* Deep rose overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(61,15,32,0.88) 0%, rgba(125,37,72,0.82) 40%, rgba(26,5,14,0.92) 100%)",
        }}
      />

      <Snowfall count={38} />

      <div className="relative z-10 w-full max-w-md mx-auto px-8 py-20">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="reveal-section text-[10px] tracking-[0.4em] uppercase mb-3 font-inter" style={{ color: "#e090b0" }}>
            {t.rsvp.invited}
          </p>
          <h2 className="reveal-section font-playfair italic" style={{ fontSize: "clamp(2.2rem,9vw,3rem)", lineHeight: 1.2, color: "white" }}>
            {t.rsvp.title}
          </h2>
          <p className="reveal-section font-cormorant italic mt-3" style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.45)" }}>
            {t.rsvp.respondBy}
          </p>
        </div>

        {status === "duplicate" ? (
          <motion.div
            className="relative text-center py-12 px-6"
            style={{
              border: "1px solid rgba(224,144,176,0.30)",
              background: "rgba(45,10,24,0.55)",
              backdropFilter: "blur(10px)",
            }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="flex justify-center mb-4">
              <span style={{ fontSize: "2.4rem" }}>💌</span>
            </div>
            <h3 className="font-playfair italic mb-3" style={{ color: "#f5c4d8", fontSize: "1.6rem" }}>
              {t.rsvp.duplicate.title}
            </h3>
            <p
              className="font-cormorant italic mx-auto"
              style={{
                fontSize: "1.02rem",
                color: "rgba(255,255,255,0.65)",
                maxWidth: "22rem",
                lineHeight: 1.55,
              }}
            >
              {t.rsvp.duplicate.body}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <a
                href={`${GROOM.wa}?text=Hi%2C%20I%20need%20to%20update%20my%20RSVP`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 font-inter text-[11px] tracking-[0.25em] uppercase transition-all duration-200"
                style={{ background: "#c04878", color: "#fff" }}
              >
                {t.rsvp.duplicate.whatsappGroom} · {GROOM.display}
              </a>
              <a
                href={`${BRIDE.wa}?text=Hi%2C%20I%20need%20to%20update%20my%20RSVP`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 font-inter text-[11px] tracking-[0.25em] uppercase transition-all duration-200"
                style={{ border: "1px solid #c04878", color: "#f5c4d8" }}
              >
                {t.rsvp.duplicate.whatsappBride} · {BRIDE.display}
              </a>
            </div>
          </motion.div>
        ) : status === "success" ? (
          <motion.div
            className="relative overflow-hidden text-center py-12 px-6"
            style={{
              border: "1px solid rgba(224,144,176,0.30)",
              background:
                "linear-gradient(160deg, rgba(192,72,120,0.18) 0%, rgba(125,37,72,0.10) 100%)",
              backdropFilter: "blur(10px)",
            }}
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Floating hearts rising */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              {Array.from({ length: 12 }).map((_, i) => {
                const left = (i * 13 + 7) % 95;
                const delay = (i * 0.25) % 3;
                const size = 12 + (i % 4) * 4;
                const duration = 5 + (i % 3);
                return (
                  <motion.span
                    key={i}
                    className="absolute"
                    style={{ left: `${left}%`, bottom: -20, fontSize: size }}
                    initial={{ y: 0, opacity: 0 }}
                    animate={{ y: -360, opacity: [0, 1, 1, 0] }}
                    transition={{
                      duration,
                      delay,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                  >
                    {i % 3 === 0 ? "🌸" : i % 3 === 1 ? "💗" : "✨"}
                  </motion.span>
                );
              })}
            </div>

            {/* Animated couple emoji */}
            <motion.div
              className="relative flex justify-center items-center gap-1 mb-5"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 14 }}
            >
              <motion.span
                style={{ fontSize: "2.4rem", display: "inline-block" }}
                animate={{ rotate: [-6, 6, -6] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              >
                👰🏻‍♀️
              </motion.span>
              <motion.span
                style={{ fontSize: "1.6rem", display: "inline-block", color: "#e090b0" }}
                animate={{ scale: [1, 1.25, 1] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              >
                💖
              </motion.span>
              <motion.span
                style={{ fontSize: "2.4rem", display: "inline-block" }}
                animate={{ rotate: [6, -6, 6] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              >
                🤵🏻‍♂️
              </motion.span>
            </motion.div>

            <motion.p
              className="relative text-[10px] tracking-[0.4em] uppercase mb-3 font-inter"
              style={{ color: "#e090b0" }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
            >
              {t.rsvp.success.badge}
            </motion.p>

            <motion.h3
              className="relative font-playfair italic mb-3"
              style={{ color: "#f5c4d8", fontSize: "1.9rem", lineHeight: 1.15 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7 }}
            >
              {firstName
                ? t.rsvp.success.thankYouNamed.replace("{name}", firstName)
                : t.rsvp.success.thankYou}
            </motion.h3>

            <motion.p
              className="relative font-cormorant italic mx-auto"
              style={{
                fontSize: "1.05rem",
                color: "rgba(255,255,255,0.65)",
                maxWidth: "22rem",
                lineHeight: 1.55,
              }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.9 }}
            >
              {t.rsvp.success.body}
              {submittedSide === "bride" && t.rsvp.success.brideFamily}
              {submittedSide === "groom" && t.rsvp.success.groomFamily}
              {!submittedSide && t.rsvp.success.bothFamily}
            </motion.p>

            <motion.div
              className="relative flex items-center justify-center gap-3 my-6 mx-auto max-w-[200px]"
              initial={{ opacity: 0, scaleX: 0.4 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.8, delay: 1.05 }}
            >
              <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, #e090b0, transparent)" }} />
              <svg viewBox="0 0 16 16" width="8" height="8" fill="#e090b0">
                <polygon points="8,0 16,8 8,16 0,8" />
              </svg>
              <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, #e090b0, transparent)" }} />
            </motion.div>

            <motion.p
              className="relative font-cormorant italic"
              style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.5)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              {t.rsvp.success.seeYou}{" "}
              <span style={{ color: "#f5c4d8", fontWeight: 500 }}>{t.details.cards.date.value}</span>
            </motion.p>

            <motion.p
              className="relative mt-6 font-cormorant italic mx-auto"
              style={{
                fontSize: "0.85rem",
                color: "rgba(255,255,255,0.4)",
                maxWidth: "20rem",
                lineHeight: 1.5,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.4 }}
            >
              {t.rsvp.success.updateNote}
              <br />
              <span style={{ color: "rgba(255,255,255,0.55)" }}>{t.rsvp.contact.groom}:</span>{" "}
              <a
                href={GROOM.wa}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "rgba(224,144,176,0.85)", textDecoration: "underline" }}
              >
                {GROOM.display}
              </a>
              {"  ·  "}
              <span style={{ color: "rgba(255,255,255,0.55)" }}>{t.rsvp.contact.bride}:</span>{" "}
              <a
                href={BRIDE.wa}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "rgba(224,144,176,0.85)", textDecoration: "underline" }}
              >
                {BRIDE.display}
              </a>
            </motion.p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="reveal-section space-y-6"
            style={{ border: "1px solid rgba(224,144,176,0.18)", background: "rgba(45,10,24,0.60)", backdropFilter: "blur(10px)", padding: "2rem" }}>

            <InputWrapper>
              <label style={labelStyle}>{t.rsvp.form.nameLabel}</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder={t.rsvp.form.namePlaceholder}
                style={inputStyle}
                className="placeholder:text-white/20"
                required
              />
            </InputWrapper>

            <InputWrapper>
              <label style={labelStyle}>{t.rsvp.form.phoneLabel}</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder={t.rsvp.form.phonePlaceholder}
                style={inputStyle}
                className="placeholder:text-white/20"
                required
              />
            </InputWrapper>

            <div>
              <label style={labelStyle}>{t.rsvp.form.sideLabel}</label>
              <div className="grid grid-cols-2 gap-3 mt-3">
                {([
                  { id: "bride", emoji: "👰🏻‍♀️", label: t.rsvp.form.brideSide, accent: "#e090b0" },
                  { id: "groom", emoji: "🤵🏻‍♂️", label: t.rsvp.form.groomSide, accent: "#9a6c4a" },
                ] as const).map((opt) => {
                  const selected = form.side === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => set("side", opt.id)}
                      className="flex flex-col items-center gap-2 py-4 font-inter transition-all duration-200"
                      style={
                        selected
                          ? {
                              background: `linear-gradient(135deg, ${opt.accent}33 0%, rgba(192,72,120,0.15) 100%)`,
                              border: `1px solid ${opt.accent}`,
                              color: "#fff",
                              boxShadow: `0 0 0 3px ${opt.accent}22`,
                            }
                          : {
                              border: "1px solid rgba(224,144,176,0.20)",
                              color: "rgba(255,255,255,0.55)",
                              background: "transparent",
                            }
                      }
                    >
                      <span style={{ fontSize: "1.75rem", lineHeight: 1 }}>{opt.emoji}</span>
                      <span className="text-[10px] tracking-[0.2em] uppercase">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label style={labelStyle}>{t.rsvp.form.paxLabel}</label>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <InputWrapper>
                  <div
                    ref={infoRef}
                    className="relative flex items-center gap-1.5"
                    style={{ marginBottom: "2px" }}
                  >
                    <label
                      className="font-inter"
                      style={{
                        color: "rgba(255,255,255,0.45)",
                        fontSize: "0.7rem",
                      }}
                    >
                      {t.rsvp.form.adults}
                    </label>
                    <button
                      type="button"
                      aria-label={t.rsvp.form.guestsInfo}
                      onClick={() => setShowGuestInfo((v) => !v)}
                      onMouseEnter={() => setShowGuestInfo(true)}
                      onMouseLeave={() => setShowGuestInfo(false)}
                      className="flex items-center justify-center font-inter"
                      style={{
                        width: "15px",
                        height: "15px",
                        borderRadius: "9999px",
                        border: "1px solid rgba(224,144,176,0.55)",
                        color: "rgba(224,144,176,0.95)",
                        fontSize: "0.62rem",
                        lineHeight: 1,
                        cursor: "pointer",
                        flexShrink: 0,
                      }}
                    >
                      i
                    </button>
                    <AnimatePresence>
                      {showGuestInfo && (
                        <motion.div
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 4 }}
                          transition={{ duration: 0.18 }}
                          className="absolute font-inter"
                          style={{
                            bottom: "calc(100% + 8px)",
                            left: 0,
                            zIndex: 30,
                            width: "210px",
                            maxWidth: "70vw",
                            background: "rgba(45,10,24,0.97)",
                            border: "1px solid rgba(224,144,176,0.35)",
                            color: "rgba(255,255,255,0.82)",
                            fontSize: "0.7rem",
                            lineHeight: 1.45,
                            padding: "8px 10px",
                            borderRadius: "6px",
                            boxShadow: "0 8px 24px rgba(0,0,0,0.45)",
                            pointerEvents: "none",
                          }}
                        >
                          {t.rsvp.form.guestsInfo}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <select
                    value={form.adults}
                    onChange={(e) => set("adults", e.target.value)}
                    style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
                  >
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n} style={{ background: "#3D0F20" }}>
                        {n}
                      </option>
                    ))}
                  </select>
                </InputWrapper>

                <InputWrapper>
                  <label
                    className="font-inter"
                    style={{
                      color: "rgba(255,255,255,0.45)",
                      fontSize: "0.7rem",
                      display: "block",
                      marginBottom: "2px",
                    }}
                  >
                    {t.rsvp.form.babiesLabel}
                  </label>
                  <select
                    value={form.babies}
                    onChange={(e) => set("babies", e.target.value)}
                    style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
                  >
                    {Array.from({ length: 6 }, (_, i) => i).map((n) => (
                      <option key={n} value={n} style={{ background: "#3D0F20" }}>
                        {n} {n === 1 ? t.rsvp.form.babyUnit : t.rsvp.form.babiesUnit}
                      </option>
                    ))}
                  </select>
                </InputWrapper>
              </div>
            </div>

            <InputWrapper>
              <label style={labelStyle}>{t.rsvp.form.dietaryLabel}</label>
              <input
                type="text"
                value={form.dietary}
                onChange={(e) => set("dietary", e.target.value)}
                placeholder={t.rsvp.form.dietaryPlaceholder}
                style={inputStyle}
                className="placeholder:text-white/20"
              />
            </InputWrapper>

            <InputWrapper>
              <label style={labelStyle}>{t.rsvp.form.messageLabel}</label>
              <textarea
                value={form.message}
                onChange={(e) => set("message", e.target.value)}
                placeholder={t.rsvp.form.messagePlaceholder}
                rows={3}
                style={{ ...inputStyle, resize: "none", lineHeight: 1.6 }}
                className="placeholder:text-white/20"
              />
            </InputWrapper>

            {error && <p className="font-inter text-xs" style={{ color: "rgba(255,140,160,0.9)" }}>{error}</p>}
            {status === "error" && <p className="font-inter text-xs" style={{ color: "rgba(255,140,160,0.9)" }}>{t.rsvp.form.errorGeneric}</p>}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-4 font-inter text-[11px] tracking-[0.3em] uppercase transition-all duration-300 disabled:opacity-50"
              style={{ background: status === "loading" ? "rgba(192,72,120,0.5)" : "#c04878", color: "#fff", fontWeight: 600 }}
            >
              {status === "loading" ? t.rsvp.form.sending : t.rsvp.form.submit}
            </button>
          </form>
        )}

        <div className="reveal-section mt-10 text-center">
          <p
            className="font-cormorant italic mx-auto"
            style={{
              fontSize: "0.95rem",
              color: "rgba(255,255,255,0.4)",
              maxWidth: "22rem",
              lineHeight: 1.5,
            }}
          >
            {t.rsvp.contact.intro}
          </p>
          <div className="mt-3 flex flex-col gap-3 items-center">
            <div className="flex flex-col gap-1 items-center">
              <p className="font-inter text-[10px] tracking-[0.25em] uppercase" style={{ color: "rgba(255,255,255,0.45)" }}>
                {t.rsvp.contact.groom} · {GROOM.name}
              </p>
              <a
                href={GROOM.wa}
                target="_blank"
                rel="noopener noreferrer"
                className="font-inter text-xs tracking-wider"
                style={{ color: "rgba(224,144,176,0.85)" }}
              >
                {GROOM.display}
              </a>
              <a
                href="mailto:norman1997.an@gmail.com?subject=Wedding%20RSVP%20Query"
                className="font-inter text-xs tracking-wider"
                style={{ color: "rgba(224,144,176,0.85)" }}
              >
                {GROOM.email}
              </a>
            </div>
            <div className="flex flex-col gap-1 items-center">
              <p className="font-inter text-[10px] tracking-[0.25em] uppercase" style={{ color: "rgba(255,255,255,0.45)" }}>
                {t.rsvp.contact.bride} · {BRIDE.name}
              </p>
              <a
                href={BRIDE.wa}
                target="_blank"
                rel="noopener noreferrer"
                className="font-inter text-xs tracking-wider"
                style={{ color: "rgba(224,144,176,0.85)" }}
              >
                {BRIDE.display}
              </a>
            </div>
          </div>
          <div className="mt-10">
            <p className="font-playfair italic text-lg" style={{ color: "rgba(255,255,255,0.22)" }}>Norman &amp; Joo Yi</p>
            <p className="font-inter text-[9px] tracking-[0.3em] uppercase mt-1" style={{ color: "rgba(255,255,255,0.15)" }}>15 · 05 · 2027</p>
          </div>
        </div>
      </div>
    </section>
  );
}
