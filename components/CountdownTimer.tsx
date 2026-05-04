"use client";

import { useEffect, useState } from "react";

interface TimeLeft {
  days: number; hours: number; minutes: number; seconds: number;
}

function pad(n: number) { return String(n).padStart(2, "0"); }

function getTimeLeft(target: string): TimeLeft {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const s = Math.floor(diff / 1000);
  return {
    days:    Math.floor(s / 86400),
    hours:   Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

function Unit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="w-[62px] h-[62px] flex items-center justify-center relative"
        style={{
          border:     "1px solid rgba(192,72,120,0.40)",
          background: "rgba(192,72,120,0.08)",
        }}
      >
        {/* Corner dots */}
        {["top-0 left-0","top-0 right-0","bottom-0 left-0","bottom-0 right-0"].map((pos) => (
          <span
            key={pos}
            className={`absolute ${pos} w-1 h-1`}
            style={{ background: "#e090b0", opacity: 0.7 }}
          />
        ))}
        <span
          className="font-playfair font-semibold tabular-nums"
          style={{ fontSize: "1.5rem", color: "#f5c4d8" }}
        >
          {value}
        </span>
      </div>
      <span
        className="text-[9px] tracking-[0.25em] uppercase font-inter"
        style={{ color: "rgba(255,255,255,0.35)" }}
      >
        {label}
      </span>
    </div>
  );
}

export default function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => getTimeLeft(targetDate));

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft(targetDate)), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const sep = (
    <span className="font-cormorant pb-8 select-none" style={{ color: "#e090b0", fontSize: "1.2rem" }}>:</span>
  );

  return (
    <div className="flex items-end justify-center gap-3">
      <Unit value={String(timeLeft.days)}       label="Days"    />
      {sep}
      <Unit value={pad(timeLeft.hours)}          label="Hours"   />
      {sep}
      <Unit value={pad(timeLeft.minutes)}        label="Mins"    />
      {sep}
      <Unit value={pad(timeLeft.seconds)}        label="Secs"    />
    </div>
  );
}
