"use client";

import { useEffect, useRef, useState } from "react";
import Snowfall from "./Snowfall";

type Status = "idle" | "loading" | "success" | "error";

interface FormData {
  name: string; email: string;
  attendance: "yes" | "no" | "maybe" | "";
  guests: string; dietary: string; message: string;
}

const INITIAL: FormData = { name: "", email: "", attendance: "", guests: "1", dietary: "", message: "" };

function InputWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative" style={{ borderBottom: "1px solid rgba(224,144,176,0.25)" }}>
      {children}
    </div>
  );
}

export default function RSVPSection() {
  const ref    = useRef<HTMLDivElement>(null);
  const [form, setForm]     = useState<FormData>(INITIAL);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError]   = useState("");

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

  function set(key: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.attendance) { setError("Please fill in all required fields."); return; }
    setError(""); setStatus("loading");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("success"); setForm(INITIAL);
    } catch { setStatus("error"); }
  }

  const inputStyle: React.CSSProperties = {
    background: "transparent", outline: "none", color: "white",
    fontFamily: "var(--font-inter-sans), Inter, system-ui, sans-serif",
    fontSize: "0.875rem", width: "100%", padding: "12px 0", letterSpacing: "0.02em",
  };
  const labelStyle: React.CSSProperties = {
    color: "rgba(255,255,255,0.35)", fontSize: "0.65rem", letterSpacing: "0.25em",
    textTransform: "uppercase", fontFamily: "var(--font-inter-sans), Inter, system-ui, sans-serif",
    display: "block", marginBottom: "2px",
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
      {/* Deep rose overlay — darker so form stays readable */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(61,15,32,0.88) 0%, rgba(125,37,72,0.82) 40%, rgba(26,5,14,0.92) 100%)",
        }}
      />

      {/* Snow */}
      <Snowfall count={38} />

      <div className="relative z-10 w-full max-w-md mx-auto px-8 py-20">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="reveal-section text-[10px] tracking-[0.4em] uppercase mb-3 font-inter" style={{ color: "#e090b0" }}>
            You&rsquo;re Invited
          </p>
          <h2 className="reveal-section font-playfair italic" style={{ fontSize: "clamp(2.2rem,9vw,3rem)", lineHeight: 1.2, color: "white" }}>
            RSVP
          </h2>
          <p className="reveal-section font-cormorant italic mt-3" style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.45)" }}>
            Kindly respond by 1st April 2027
          </p>
        </div>

        {status === "success" ? (
          <div className="reveal-section text-center py-12 px-6"
            style={{ border: "1px solid rgba(224,144,176,0.25)", background: "rgba(192,72,120,0.10)" }}>
            <div className="flex justify-center mb-4">
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#e090b0" strokeWidth="1.5">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h3 className="font-playfair italic text-2xl mb-2" style={{ color: "#f5c4d8" }}>Thank You!</h3>
            <p className="font-cormorant italic" style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.55)" }}>
              We&rsquo;ve received your RSVP and can&rsquo;t wait to see you on our special day.
            </p>
            <button className="mt-6 text-[10px] tracking-[0.25em] uppercase font-inter"
              style={{ color: "rgba(224,144,176,0.6)" }} onClick={() => setStatus("idle")}>
              Submit another response
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="reveal-section space-y-6"
            style={{ border: "1px solid rgba(224,144,176,0.18)", background: "rgba(45,10,24,0.60)", backdropFilter: "blur(10px)", padding: "2rem" }}>

            <InputWrapper>
              <label style={labelStyle}>Full Name *</label>
              <input type="text" value={form.name} onChange={(e) => set("name", e.target.value)}
                placeholder="Your full name" style={inputStyle} className="placeholder:text-white/20" required />
            </InputWrapper>

            <InputWrapper>
              <label style={labelStyle}>Email *</label>
              <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)}
                placeholder="your@email.com" style={inputStyle} className="placeholder:text-white/20" required />
            </InputWrapper>

            <div>
              <label style={labelStyle}>Will you be attending? *</label>
              <div className="flex gap-2 mt-3">
                {(["yes", "no", "maybe"] as const).map((opt) => (
                  <button key={opt} type="button" onClick={() => set("attendance", opt)}
                    className="flex-1 py-2.5 text-[10px] tracking-[0.15em] uppercase font-inter transition-all duration-200"
                    style={form.attendance === opt
                      ? { background: "#c04878", color: "#fff", border: "1px solid #c04878" }
                      : { border: "1px solid rgba(224,144,176,0.25)", color: "rgba(255,255,255,0.45)", background: "transparent" }}>
                    {opt === "yes" ? "Accept" : opt === "no" ? "Decline" : "Maybe"}
                  </button>
                ))}
              </div>
            </div>

            {form.attendance === "yes" && (
              <InputWrapper>
                <label style={labelStyle}>Number of Guests</label>
                <select value={form.guests} onChange={(e) => set("guests", e.target.value)}
                  style={{ ...inputStyle, appearance: "none", cursor: "pointer" }} className="bg-transparent">
                  {[1, 2, 3, 4].map((n) => (
                    <option key={n} value={n} style={{ background: "#3D0F20" }}>{n} {n === 1 ? "guest" : "guests"}</option>
                  ))}
                </select>
              </InputWrapper>
            )}

            <InputWrapper>
              <label style={labelStyle}>Dietary Requirements</label>
              <input type="text" value={form.dietary} onChange={(e) => set("dietary", e.target.value)}
                placeholder="Vegetarian, halal, allergies…" style={inputStyle} className="placeholder:text-white/20" />
            </InputWrapper>

            <InputWrapper>
              <label style={labelStyle}>Message to the Couple</label>
              <textarea value={form.message} onChange={(e) => set("message", e.target.value)}
                placeholder="Share your wishes…" rows={3}
                style={{ ...inputStyle, resize: "none", lineHeight: 1.6 }} className="placeholder:text-white/20" />
            </InputWrapper>

            {error && <p className="font-inter text-xs" style={{ color: "rgba(255,140,160,0.9)" }}>{error}</p>}
            {status === "error" && <p className="font-inter text-xs" style={{ color: "rgba(255,140,160,0.9)" }}>Something went wrong. Please try again.</p>}

            <button type="submit" disabled={status === "loading"}
              className="w-full py-4 font-inter text-[11px] tracking-[0.3em] uppercase transition-all duration-300 disabled:opacity-50"
              style={{ background: status === "loading" ? "rgba(192,72,120,0.5)" : "#c04878", color: "#fff", fontWeight: 600 }}>
              {status === "loading" ? "Sending…" : "Send RSVP"}
            </button>
          </form>
        )}

        <div className="reveal-section mt-10 text-center">
          <p className="font-cormorant italic" style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.3)" }}>
            For enquiries, contact us at
          </p>
          <a href="mailto:norman1997.an@gmail.com" className="font-inter text-xs tracking-wider" style={{ color: "rgba(224,144,176,0.7)" }}>
            norman1997.an@gmail.com
          </a>
          <div className="mt-10">
            <p className="font-playfair italic text-lg" style={{ color: "rgba(255,255,255,0.22)" }}>Norman &amp; Joo Yi</p>
            <p className="font-inter text-[9px] tracking-[0.3em] uppercase mt-1" style={{ color: "rgba(255,255,255,0.15)" }}>15 · 05 · 2027</p>
          </div>
        </div>
      </div>
    </section>
  );
}
