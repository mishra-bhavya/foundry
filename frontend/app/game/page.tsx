"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

type SkillState = Record<string, number>;
type SystemState = Record<string, number>;

export default function Home() {
  const [stage, setStage] = useState<any>(null);

  const [skills, setSkills] = useState<SkillState>({});
  const [system, setSystem] = useState<SystemState>({});

  const [skillsSchema, setSkillsSchema] = useState<string[]>([]);
  const [systemSchema, setSystemSchema] = useState<string[]>([]);

  const [currentStage, setCurrentStage] = useState<number>(1);
  const [stageLocked, setStageLocked] = useState(false);
  const [sessionId, setSessionId] = useState<number | null>(null);

  const [gameOver, setGameOver] = useState(false);
  const [finalReason, setFinalReason] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const careerId = searchParams.get("career");
  if (!careerId) {
    return <p>No career selected.</p>;
  }

  useEffect(() => {
    startGame();
  }, []);

  /* ---------------- FETCH STAGE ---------------- */
  useEffect(() => {
    if (gameOver || !sessionId) return;

    async function fetchStage() {
      try {
        const res = await fetch(`http://127.0.0.1:8000/stage/${currentStage}?session_id=${sessionId}`);

        if (!res.ok){
        console.error("Stage fetch failed:", await res.text());
        return;
      }

        const data = await res.json();

        if (data.game_over) {
          setGameOver(true);
          setFinalReason(data.reason);
          setStageLocked(true);
          return;
        }

        setStage(data);
        setStageLocked(false);
      } catch (err) {
        console.error("Stage fetch failed:", err);
      }
    }

    fetchStage();
  }, [currentStage, gameOver, sessionId]);

  /* ---------------- START GAME ---------------- */
  async function startGame() {
    try {
      const res = await fetch(`http://localhost:8000/start?career_id=${careerId}`, {
          method: "POST"
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Failed to start:", data);
        return;
      }

      setSessionId(data.id);
      setSkills(prev => ({
        ...prev,
        ...data.skills
      }));;
      setSystem(prev => ({
        ...prev,
        ...data.system
      }));
      setCurrentStage(data.current_stage);
      setSkillsSchema(data.skills_schema);
      setSystemSchema(data.system_schema);
      setGameOver(false);
      setFinalReason(null);
      setStageLocked(false);
    } catch (err) {
      console.error("Start failed:", err);
    }
  }

  /* ---------------- HANDLE DECISION ---------------- */
  async function handleDecision(decisionId: number) {
    if (stageLocked || !sessionId) return;

    try {
      const res = await fetch("http://127.0.0.1:8000/decision", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: sessionId,
          decision_id: decisionId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Decision rejected:", data);
        return;
      }

      setSkills(prev => ({
        ...prev,
        ...data.skills
      }));;
      setSystem(prev => ({
        ...prev,
        ...data.system
      }));

      if (data.game_over) {
        setGameOver(true);
        setFinalReason(data.reason);
        return;
      }

      setStageLocked(true);

      setTimeout(() => {

        /* ---------- NEW: EVENT HANDLING ---------- */
        if (data.event && data.stage) {
          setStage(data.stage);
          setStageLocked(false);
          return;
        }

        /* ---------- NORMAL STAGE FLOW ---------- */
        if (data.next_stage !== null && data.next_stage !== undefined) {
          setCurrentStage(data.next_stage);
        }

        setStageLocked(false);

      }, 600);

    } catch (err) {
      console.error("Decision failed:", err);
    }
  }

  /* ---------------- RESTART GAME ---------------- */
  async function handleRestart() {
    await startGame();
  }

  /* ---------------- RESET EVERYTHING ---------------- */
  async function handleHardReset() {
    try {
      await fetch("http://127.0.0.1:8000/reset", {
        method: "POST",
      });

      setGameOver(false);
      setFinalReason(null);
      setSkills({});
      setSystem({});
      setCurrentStage(1);

      await startGame();
    } catch (err) {
      console.error("Hard reset failed:", err);
    }
  }

  

  /* ---------------- GAME OVER SCREEN ---------------- */
  if (gameOver) {

    const dominantSkill = Object.entries(skills).reduce((a, b) =>
      a[1] > b[1] ? a : b
    )[0];

    const weakestSkill = Object.entries(skills).reduce((a, b) =>
      a[1] < b[1] ? a : b
    )[0];

    const performanceScore =
      Object.values(skills).reduce((a, b) => a + b, 0) -
      Object.values(system).reduce((a, b) => a + b, 0);

    return (
      <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
        <h1>Simulation Complete</h1>
        <p>{finalReason}</p>

        <h2>Performance Summary</h2>

        <p>
          <strong>Dominant Skill:</strong> {dominantSkill.replace(/_/g, " ")}
        </p>

        <p>
          <strong>Weakest Skill:</strong> {weakestSkill.replace(/_/g, " ")}
        </p>

        <p>
          <strong>Overall Score:</strong> {performanceScore}
        </p>

        <h2>Final Skills</h2>
        <ul>
          {skillsSchema.map((key) => (
            <li key={key}>
              {key.replace(/_/g, " ")}: {skills[key] ?? 0}
            </li>
          ))}
        </ul>

        <button
          onClick={handleRestart}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
          }}
        >
          Play Again
        </button>
      </main>
    );
  }

  /* ---------------- LOADING ---------------- */
  if (!stage || !stage.decisions) {
    return <p>Loading...</p>;
  }

  /* ---------------- MAIN GAME ---------------- */
  return (
    <main
  style={{
    minHeight: "100vh",
    background: "#0d0d0d",
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    padding: "2rem",
  }}
>
  <div
    style={{
      width: "100%",
      maxWidth: "1100px",
      display: "grid",
      gridTemplateColumns: "2fr 1fr",
      gap: "3rem",
    }}
  >
    {/* LEFT SIDE */}
    <div>
      <h1>{stage.title}</h1>
      <p style={{ opacity: 0.8 }}>{stage.description}</p>

      <h2 style={{ marginTop: "2rem" }}>Decisions</h2>
      {stage.decisions.map((decision: any) => (
        <button
          key={decision.id}
          onClick={() => handleDecision(decision.id)}
          disabled={stageLocked}
          style={{
            display: "block",
            width: "100%",
            margin: "1rem 0",
            padding: "0.75rem 1rem",
            background: "#1a1a1a",
            border: "1px solid #333",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          {decision.text}
        </button>
      ))}
    </div>

    {/* RIGHT SIDE - STATS PANEL */}
    <div
    style={{
      background: "#141414",
      padding: "1.5rem",
      borderRadius: "10px",
      border: "1px solid #222",
      position: "sticky",
      top: "2rem",
      height: "fit-content",
    }}
>
    
      <h2>Live Stats</h2>
      <div
  style={{
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "1rem",
    marginTop: "1.5rem",
  }}
>
  {skillsSchema.map((key) => {
      const value = skills?.[key] ?? 0;

      return (
        <div key={key}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "0.85rem",
              marginBottom: "4px",
            }}
          >
            <span style={{ textTransform: "capitalize" }}>
              {key.replace(/_/g, " ")}
            </span>
            <span>{Number(value).toFixed(1)}</span>
          </div>

          <div
            style={{
              height: "6px",
              background: "#222",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${Math.max(0, value * 10)}%`,
                height: "100%",
                background:
                  value > 0 ? "#4caf50" : value < 0 ? "#f44336" : "#666",
                transition: "width 0.4s ease",
              }}
            />
          </div>
        </div>
      );
    })}

    <h3 style={{ marginTop: "2rem" }}>System Pressure</h3>

    {systemSchema.map((key) => {
      const value = system[key] ?? 0;

      return (
        <div key={key}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>{key.replace("_", " ")}</span>
            <span>{Math.round(value)}</span>
          </div>

          <div
            style={{
              height: "6px",
              background: "#333",
              marginTop: "4px",
              borderRadius: "3px",
            }}
          >
            <div
              style={{
                width: `${Math.min(value * 10, 100)}%`,
                height: "100%",
                background: "#ff6b6b",
                borderRadius: "3px",
              }}
            />
          </div>
        </div>
      );
    })}
</div>

    <div style={{ marginTop: "2rem" }}>
  <button
    onClick={handleHardReset}
    style={{
      width: "100%",
      padding: "0.75rem",
      background: "transparent",
      border: "1px solid #333",
      borderRadius: "6px",
      color: "#bbb",
      cursor: "pointer",
      transition: "all 0.2s ease",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = "#555";
      e.currentTarget.style.color = "#fff";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = "#333";
      e.currentTarget.style.color = "#bbb";
    }}
  >
    Reset Game
  </button>
</div>

      {/* Your compact skill bars go here */}
    </div>
  </div>
</main>
  );
}