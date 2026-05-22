type HelpModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function HelpModal({
  isOpen,
  onClose,
}: HelpModalProps) {
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
            color: "rgba(255,240,220,0.82)",
            lineHeight: 1.8,
            fontSize: "1rem",
          }}
        >
          Help content goes here.
        </div>
      </div>
    </div>
  );
}