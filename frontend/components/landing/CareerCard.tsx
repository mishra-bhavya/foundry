import type { Career } from "./careers";

type CareerCardProps = {
  career: Career;
  isActive: boolean;
  onClick: () => void;
  onStart: () => void;
};

export default function CareerCard({
  career,
  isActive,
  onClick,
  onStart,
}: CareerCardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        width: isActive ? "380px" : "280px",
        height: isActive ? "520px" : "380px",

        background: "#f3ede2",
        borderRadius: "28px",

        padding: "2rem",

        cursor: "pointer",

        transition: "all 0.35s ease",

        boxShadow: isActive
          ? "0 30px 80px rgba(0,0,0,0.45)"
          : "0 10px 25px rgba(0,0,0,0.25)",

        color: "#17120f",

        overflow: "hidden",
      }}
    >
      <div
        style={{
          fontSize: "0.8rem",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "#6b625c",
          //opacity: 0.6,
          marginBottom: "1rem",
        }}
      >
        Career
      </div>

      <h2
        style={{
          fontSize: isActive ? "3rem" : "2rem",
          fontWeight: 800,
          lineHeight: 1,
          marginBottom: "1.5rem",
          color: "#17120f",
        }}
      >
        {career.title}
      </h2>

      {isActive && (
        <p
          style={{
            fontSize: "1.05rem",
            lineHeight: 1.7,
            color: "#4d433c",
          }}
        >
          {career.description}
        </p>
      )}

      {isActive && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStart();
          }}
          style={{
            marginTop: "2rem",
            width: "100%",
            padding: "1rem",
            borderRadius: "16px",
            border: "none",

            background: "#111",
            color: "#fff",

            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Begin Career
        </button>
      )}
    </div>
  );
}