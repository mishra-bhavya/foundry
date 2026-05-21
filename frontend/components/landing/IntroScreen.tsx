"use client";

import { Imperial_Script } from "next/font/google";
const imperial = Imperial_Script({
  subsets: ["latin"],
  weight: "400",
});

type IntroScreenProps = {
  onStart: () => void;
};

export default function IntroScreen({
  onStart,
}: IntroScreenProps) {
  return (
    <main
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        background: "#050505",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* BACKGROUND IMAGE */}
      <div
        style={{
            position: "absolute",
            inset: 0,
            background:
            "url('/forge-bg.png') center center / cover no-repeat",
            opacity: 0.32,
            filter: "contrast(1.1) saturate(1.15)",
            animation: "forgePulse 7s ease-in-out infinite",
            transform: "scale(1.03)",
        }}
      />

      {/* FIRE GLOW OVERLAY */}
      <div
        style={{
            position: "absolute",
            inset: 0,
            background:
            "radial-gradient(circle at bottom, rgba(255,120,20,0.22), transparent 45%)",
            mixBlendMode: "screen",
            animation: "emberGlow 5s ease-in-out infinite",
        }}
      />

      {/* DARK OVERLAY */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at center, rgba(255,120,40,0.12), rgba(0,0,0,0.92) 72%)",
        }}
      />

      {/* FLOATING EMBER GLOW */}
      <div
        style={{
          position: "absolute",
          width: "500px",
          height: "500px",
          borderRadius: "999px",
          background: "rgba(255,120,40,0.08)",
          filter: "blur(120px)",
          bottom: "-180px",
        }}
      />

      {/* HELP BUTTON */}
      <button
        style={{
          position: "absolute",
          top: "34px",
          right: "34px",
          width: "62px",
          height: "62px",
          borderRadius: "999px",
          border: "1px solid rgba(255,140,60,0.55)",
          background: "rgba(0,0,0,0.5)",
          color: "#fff",
          fontSize: "1.7rem",
          cursor: "pointer",
          zIndex: 5,
          boxShadow: "0 0 24px rgba(255,120,40,0.18)",
          backdropFilter: "blur(10px)",
        }}
      >
        ?
      </button>

      {/* MAIN CONTENT */}
      <div
        style={{
          position: "relative",
          zIndex: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "28px",
          transform: "translateY(-20px)",
        }}
      >
        {/* TITLE */}
        <h1
            style={{
                margin: 0,
                fontSize: "10rem",
                fontWeight: 400,
                fontFamily: imperial.style.fontFamily,
                color: "#ffb86b",
                lineHeight: 1,
                letterSpacing: "2px",
                transform: "translateY(10px)",
                textShadow: `
                0 0 8px rgba(255,160,70,0.95),
                0 0 22px rgba(255,120,40,0.85),
                0 0 55px rgba(255,100,20,0.55),
                0 0 120px rgba(255,80,0,0.25)
                `,
            }}
        >
          Foundry
        </h1>

        {/* DIVIDER */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            marginTop: "-6px",
          }}
        >
          <div
            style={{
              width: "120px",
              height: "1px",
              background: "rgba(255,140,60,0.75)",
            }}
          />

          <div
            style={{
              width: "10px",
              height: "10px",
              background: "#ff8a2a",
              transform: "rotate(45deg)",
              boxShadow: "0 0 12px rgba(255,120,40,0.9)",
            }}
          />

          <div
            style={{
              width: "120px",
              height: "1px",
              background: "rgba(255,140,60,0.75)",
            }}
          />
        </div>

        {/* TAGLINE */}
        <p
          style={{
            margin: 0,
            marginTop: "-2px",
            color: "#d7b892",
            textTransform: "uppercase",
            letterSpacing: "7px",
            fontSize: "0.92rem",
            fontWeight: 500,
          }}
        >
          Your decisions shape your future
        </p>

        {/* START BUTTON */}
        <button
          onClick={onStart}
          style={{
            marginTop: "24px",
            width: "300px",
            padding: "20px 0",
            borderRadius: "16px",
            border: "1px solid rgba(255,140,60,0.7)",
            background:
              "linear-gradient(180deg, rgba(40,18,8,0.92), rgba(15,10,8,0.98))",
            color: "#ffbe78",
            fontSize: "2rem",
            fontFamily: "serif",
            letterSpacing: "4px",
            cursor: "pointer",
            boxShadow: `
              0 0 25px rgba(255,120,40,0.18),
              inset 0 0 20px rgba(255,120,40,0.08)
            `,
            transition: "all 0.25s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform =
              "translateY(-2px) scale(1.02)";
            e.currentTarget.style.boxShadow =
              "0 0 40px rgba(255,120,40,0.35)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform =
              "translateY(0px) scale(1)";
            e.currentTarget.style.boxShadow =
              "0 0 25px rgba(255,120,40,0.18)";
          }}
        >
          START
        </button>
      </div>
      <style jsx>{`
        @keyframes forgePulse {
            0% {
            transform: scale(1.03);
            opacity: 0.28;
            }

            50% {
            transform: scale(1.06);
            opacity: 0.38;
            }

            100% {
            transform: scale(1.03);
            opacity: 0.28;
            }
        }

        @keyframes emberGlow {
            0% {
            opacity: 0.45;
            }

            50% {
            opacity: 0.8;
            }

            100% {
            opacity: 0.45;
            }
        }
    `}</style>
    </main>
  );
}