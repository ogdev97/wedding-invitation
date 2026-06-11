"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/i18n";

export default function AudioPlayer() {
  const { t } = useLanguage();
  const audioRef  = useRef<HTMLAudioElement>(null);
  const [playing,  setPlaying]  = useState(false);
  const [started,  setStarted]  = useState(false);
  const [showHint, setShowHint] = useState(true);

  /* Try silent autoplay; browsers usually block audio without interaction */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.35;
    audio.play()
      .then(() => { setPlaying(true); setStarted(true); setShowHint(false); })
      .catch(() => { /* blocked — user will click the button */ });
  }, []);

  /* Hide hint label after 5 s even if not interacted */
  useEffect(() => {
    if (!showHint) return;
    const t = setTimeout(() => setShowHint(false), 5000);
    return () => clearTimeout(t);
  }, [showHint]);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.volume = 0.35;
      audio.play().then(() => { setPlaying(true); setStarted(true); });
    }
  }

  return (
    <>
      {/* Hidden audio element */}
      <audio ref={audioRef} src="/audio/wedding-music.mp4" loop preload="auto" />

      {/* Floating button — fixed bottom-right */}
      <div className="fixed bottom-6 right-5 z-50 flex flex-col items-end gap-2">

        {/* Hint label */}
        {showHint && !started && (
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-white text-[10px] tracking-widest uppercase font-inter whitespace-nowrap"
            style={{
              background:     "rgba(192,72,120,0.88)",
              backdropFilter: "blur(8px)",
              border:         "1px solid rgba(255,255,255,0.18)",
              animation:      "fadeIn 0.6s ease-out forwards",
            }}
          >
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="white" strokeWidth="2">
              <path d="M9 18V5l12-2v13"/>
              <circle cx="6" cy="18" r="3"/>
              <circle cx="18" cy="16" r="3"/>
            </svg>
            {t.audio.hint}
          </div>
        )}

        {/* Play / Pause button */}
        <button
          onClick={toggle}
          aria-label={playing ? "Pause music" : "Play music"}
          className="relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300"
          style={{
            background:     playing ? "rgba(192,72,120,0.92)" : "rgba(45,10,24,0.88)",
            backdropFilter: "blur(10px)",
            border:         "1px solid rgba(224,144,176,0.4)",
            boxShadow:      playing
              ? "0 0 20px rgba(192,72,120,0.5), 0 4px 16px rgba(0,0,0,0.3)"
              : "0 4px 16px rgba(0,0,0,0.3)",
          }}
        >
          {/* Ping ring when idle (not yet played) */}
          {!started && (
            <span
              className="absolute inset-0 rounded-full"
              style={{
                border:    "2px solid rgba(224,144,176,0.6)",
                animation: "pulse-ring 1.8s ease-out infinite",
              }}
            />
          )}

          {/* Equaliser bars when playing, note icon when paused */}
          {playing ? <EqBars /> : <MusicNoteIcon />}
        </button>
      </div>
    </>
  );
}

/* Animated equaliser bars */
function EqBars() {
  return (
    <svg viewBox="0 0 20 16" width="20" height="16" fill="white">
      <rect x="0" y="4"  width="3" height="12" rx="1.5" style={{ animation: "eqBar 0.6s ease-in-out infinite alternate" }} />
      <rect x="5" y="1"  width="3" height="15" rx="1.5" style={{ animation: "eqBar 0.8s ease-in-out infinite alternate-reverse" }} />
      <rect x="10" y="5" width="3" height="11" rx="1.5" style={{ animation: "eqBar 0.5s ease-in-out infinite alternate" }} />
      <rect x="15" y="2" width="3" height="14" rx="1.5" style={{ animation: "eqBar 0.7s ease-in-out infinite alternate-reverse" }} />
    </svg>
  );
}

/* Music note icon */
function MusicNoteIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#f5c4d8" strokeWidth="1.8">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}
