type HelpModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function HelpModal({
  isOpen,
  onClose,
}: HelpModalProps) {
  const sectionTitleStyle = {
    margin: "0 0 10px 0",
    fontSize: "1.15rem",
    color: "#ffcf9e",
    letterSpacing: "0.04em",
  };

  const bodyStyle = {
    margin: 0,
    lineHeight: 1.9,
    fontSize: "1rem",
    color: "rgba(255,240,220,0.78)",
  };
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.72)",
        backdropFilter: "blur(10px)",
        zIndex: 9999,

        display: "flex",
        justifyContent: "center",
        alignItems: "center",

        padding: "24px",
      }}
    >
      <div
        style={{
          width: "min(900px, 100%)",
          maxHeight: "90vh",
          overflowY: "auto",

          background:
            "linear-gradient(180deg, rgba(20,20,24,0.96), rgba(10,10,12,0.98))",

          border: "1px solid rgba(255,140,60,0.18)",
          borderRadius: "32px",

          padding: "40px",

          boxShadow:
            "0 0 60px rgba(255,120,40,0.12)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "32px",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "2.2rem",
              color: "#fff4e8",
            }}
          >
            How Foundry Works
          </h2>

          <button
            onClick={onClose}
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              border: "1px solid rgba(255,140,60,0.25)",

              background: "transparent",
              color: "#ffb36b",

              fontSize: "1.1rem",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "28px",
            color: "rgba(255,240,220,0.82)",
          }}
        >

          {/* SECTION 1 */}
          <section
            style={{
              padding: "22px 24px",
              border: "1px solid rgba(255,140,60,0.08)",
              borderRadius: "18px",
              background: "rgba(255,255,255,0.02)",
              boxShadow: "0 0 24px rgba(255,120,40,0.04)",
            }}
          >
            <h3 style={sectionTitleStyle}>What is Foundry?</h3>

            <p style={bodyStyle}>
              Foundry is a career simulation game where every decision shapes
              your professional identity. You will navigate pressure,
              reputation, ethics, performance, and long-term consequences
              across different career paths.
            </p>
          </section>

          {/* SECTION 2 */}
          <section
            style={{
              padding: "22px 24px",
              border: "1px solid rgba(255,140,60,0.08)",
              borderRadius: "18px",
              background: "rgba(255,255,255,0.02)",
              boxShadow: "0 0 24px rgba(255,120,40,0.04)",
            }}
          >
            <h3 style={sectionTitleStyle}>How Gameplay Works</h3>

            <p style={bodyStyle}>
              Each stage presents a scenario with multiple choices. Every
              decision affects your stats, stress levels, relationships,
              reputation, and future opportunities.
            </p>
          </section>

          {/* SECTION 3 */}
          <section
            style={{
              padding: "22px 24px",
              border: "1px solid rgba(255,140,60,0.08)",
              borderRadius: "18px",
              background: "rgba(255,255,255,0.02)",
              boxShadow: "0 0 24px rgba(255,120,40,0.04)",
            }}
          >
            <h3 style={sectionTitleStyle}>Stats & Attributes</h3>

            <p style={bodyStyle}>
              Different careers track different skill categories such as
              research, execution, negotiation, ethics, leadership, and
              technical ability. Your choices determine how these evolve.
            </p>
          </section>

          {/* SECTION 4 */}
          <section
            style={{
              padding: "22px 24px",
              border: "1px solid rgba(255,140,60,0.08)",
              borderRadius: "18px",
              background: "rgba(255,255,255,0.02)",
              boxShadow: "0 0 24px rgba(255,120,40,0.04)",
            }}
          >
            <h3 style={sectionTitleStyle}>Pressure System</h3>

            <p style={bodyStyle}>
              Stress, burnout, reputation, and public trust influence your
              performance. High pressure can unlock new outcomes or create
              major setbacks depending on how you respond.
            </p>
          </section>

          {/* SECTION 5 */}
          <section
            style={{
              padding: "22px 24px",
              border: "1px solid rgba(255,140,60,0.08)",
              borderRadius: "18px",
              background: "rgba(255,255,255,0.02)",
              boxShadow: "0 0 24px rgba(255,120,40,0.04)",
            }}
          >
            <h3 style={sectionTitleStyle}>Multiple Endings</h3>

            <p style={bodyStyle}>
              There is no single correct path. Careers can succeed,
              collapse, transform, or evolve differently depending on your
              priorities and decisions throughout the simulation.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}