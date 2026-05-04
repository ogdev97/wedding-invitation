"use client";

import { useEffect, useState } from "react";

interface Flake {
  id: number;
  left: number;
  size: number;
  fallDuration: number;
  fallDelay: number;
  blinkDuration: number;
  blinkDelay: number;
  isSparkle: boolean;
}

function generateFlakes(count: number): Flake[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: (i * 7.31 + 1.8) % 98,
    size: 2 + (i % 4),
    fallDuration: 9 + (i % 9),
    fallDelay: -((i * 0.85) % 15),   // negative → already mid-fall on load
    blinkDuration: 1.4 + (i % 5) * 0.45,
    blinkDelay: -((i * 0.37) % 4),
    isSparkle: i % 5 === 0,
  }));
}

export default function Snowfall({ count = 40 }: { count?: number }) {
  const [flakes, setFlakes] = useState<Flake[]>([]);

  useEffect(() => {
    setFlakes(generateFlakes(count));
  }, [count]);

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 3 }}
      aria-hidden="true"
    >
      {flakes.map((flake) => (
        <div
          key={flake.id}
          style={{
            position: "absolute",
            left: `${flake.left}%`,
            top: "-20px",
            animation: `snowFall ${flake.fallDuration}s ${flake.fallDelay}s linear infinite`,
          }}
        >
          {flake.isSparkle ? (
            /* 4-pointed star sparkle */
            <svg
              viewBox="0 0 12 12"
              width={flake.size + 4}
              height={flake.size + 4}
              style={{
                fill: "rgba(255,255,255,0.92)",
                filter: "drop-shadow(0 0 2px rgba(255,255,255,0.9))",
                animation: `snowBlink ${flake.blinkDuration}s ${flake.blinkDelay}s ease-in-out infinite`,
              }}
            >
              <path d="M6 0L7.2 4.8L12 6L7.2 7.2L6 12L4.8 7.2L0 6L4.8 4.8Z" />
            </svg>
          ) : (
            /* Round snow dot */
            <div
              style={{
                width: `${flake.size}px`,
                height: `${flake.size}px`,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.95)",
                boxShadow: `0 0 ${flake.size + 2}px rgba(255,255,255,0.7)`,
                animation: `snowBlink ${flake.blinkDuration}s ${flake.blinkDelay}s ease-in-out infinite`,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
