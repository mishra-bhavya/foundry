type Props = {
  onStart: () => void;
};

export default function LandingPage({ onStart }: Props) {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px",
        position: "relative",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          display: "grid",
          gridTemplateColumns: "1.2fr 0.8fr",
          gap: "48px",
          alignItems: "center",
        }}
      >
        <section>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "999px",
                background: "#ff8c42",
                boxShadow: "0 0 18px rgba(255,140,66,0.8)",
              }}
            />

            <span
              style={{
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--muted)",
                fontSize: "0.9rem",
              }}
            >
              Career Simulation Experience
            </span>
          </div>

          <h1
            style={{
              fontSize: "5rem",
              lineHeight: 1,
              marginBottom: "24px",
              fontWeight: 800,
            }}
          >
            Forge Your
            <br />
            Future
          </h1>

          <p
            style={{
              fontSize: "1.2rem",
              color: "var(--muted)",
              maxWidth: "700px",
              lineHeight: 1.8,
              marginBottom: "36px",
            }}
          >
            Every decision shapes your career. Build skills, manage pressure,
            survive difficult trade-offs, and discover the kind of professional
            you become under pressure.
          </p>

          <button
            onClick={onStart}
            className="primary-button"
          >
            Begin Simulation
          </button>
        </section>

        <section
          className="glass-card"
          style={{
            padding: "36px",
            borderRadius: "28px",
            border: "1px solid var(--panel-border)",
            background: "var(--panel)",
            backdropFilter: "blur(14px)",
          }}
        >
          <h2
            style={{
              marginBottom: "24px",
              fontSize: "1.6rem",
            }}
          >
            What You'll Experience
          </h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            {[
              "Dynamic career decision-making",
              "Real-time stat evolution",
              "Pressure and reputation systems",
              "Multiple endings and outcomes",
              "Personalized performance summaries",
            ].map((item) => (
              <div
                key={item}
                style={{
                  padding: "18px",
                  borderRadius: "16px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}