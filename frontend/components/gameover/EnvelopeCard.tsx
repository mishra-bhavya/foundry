"use client";

type EnvelopeCardProps = {
  title: string;
  statusLabel: string;
  isOpen: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

export default function EnvelopeCard({
  title,
  statusLabel,
  isOpen,
  onClick,
  children,
}: EnvelopeCardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        width: isOpen ? "78vw" : "320px",

        position: "absolute",

        top: isOpen ? "50%" : undefined,
        left: isOpen ? "50%" : undefined,

        transform: isOpen
        ? "translate(-50%, -50%) scale(1.04)"
        : undefined,

        zIndex: isOpen ? 50 : 1,

        cursor: "pointer",

        borderRadius: "32px",
        overflow: "hidden",

        border: "1px solid rgba(255,140,60,0.18)",

        background: isOpen
          ? "linear-gradient(180deg, rgba(28,20,16,0.96), rgba(14,10,8,0.98))"
          : "linear-gradient(180deg, rgba(20,16,14,0.88), rgba(10,8,7,0.92))",

        boxShadow: isOpen
          ? "0 30px 80px rgba(255,120,40,0.16)"
          : "0 10px 30px rgba(0,0,0,0.35)",

        padding: isOpen ? "2rem" : "1.4rem",

        minHeight: isOpen ? "520px" : "160px",

        transition: "all 260ms ease",

        backdropFilter: "blur(18px)",


        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* EMBER GLOW */}
      <div
        style={{
          position: "absolute",
          inset: 0,

          background:
            "linear-gradient(120deg, rgba(255,138,61,0.10), transparent 32%, transparent 70%, rgba(255,90,54,0.06))",

          pointerEvents: "none",
        }}
      />

      {/* HEADER */}
      <div
        style={{
          position: "relative",
          zIndex: 2,

          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "1.5rem",
            fontWeight: 700,
          }}
        >
          {title}
        </h2>

        <div
          style={{
            color: "#ff7a2f",
            fontSize: "1rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          {statusLabel}
        </div>
      </div>

      {/* CONTENT */}
      <div
        style={{
          position: "relative",
          zIndex: 2,

          marginTop: "1.5rem",

          opacity: isOpen ? 1 : 0,

          maxHeight: isOpen ? "1000px" : "0px",

          overflow: "hidden",

          transition:
            "opacity 220ms ease, max-height 260ms ease",
        }}
      >
        {children}
      </div>
    </div>
  );
}