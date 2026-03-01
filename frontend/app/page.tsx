"use client";

import { useState, useEffect } from "react";

type SkillState = Record<string, number>;

type SystemState = Record<string, number>;

export default function Home() {
  const [stage, setStage] = useState<any>(null);

  const [skills, setSkills] = useState<SkillState>({});

  const [system, setSystem] = useState<SystemState>({});

  const [currentStage, setCurrentStage] = useState<number>(1);
  const [stageLocked, setStageLocked] = useState(false);
  const [sessionId, setSessionId] = useState<number | null>(null);

  const [gameOver, setGameOver] = useState(false);
  const [finalReason, setFinalReason] = useState<string | null>(null);

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

        if (data.final) {
          setGameOver(true);
          setFinalReason(data.reason);
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
      const res = await fetch("http://127.0.0.1:8000/start?career_id=hackathon", {
          method: "POST"
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Failed to start:", data);
        return;
      }

      setSessionId(data.id);
      setSkills(data.skills);
      setSystem(data.system_state);
      setCurrentStage(data.current_stage);
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

      setSkills(data.skills);
      setSystem(data.system);

      if (data.game_over) {
        setGameOver(true);
        setFinalReason(data.reason);
        return;
      }

      setStageLocked(true);

      setTimeout(() => {
        setCurrentStage(data.next_stage);
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

  function getArchetype(skills: SkillState, system: SystemState | null) {
  if (!system) return "Undefined";

  const total =
    skills.product_thinking +
    skills.technical_judgment +
    skills.leadership +
    skills.resource_management +
    skills.execution;

  if (system.team_morale <= 10) return "Team Destroyer 💀";
  if (system.burnout >= 10) return "Burnout Machine 🔥";

  const maxSkill = Object.entries(skills).reduce((a, b) =>
    a[1] > b[1] ? a : b
  )[0];

  switch (maxSkill) {
    case "product_thinking":
      return "Visionary Strategist 🧠";
    case "technical_judgment":
      return "Technical Architect ⚙️";
    case "leadership":
      return "Team Catalyst 👑";
    case "resource_management":
      return "Strategic Operator 📊";
    case "execution":
      return "Execution Machine 🚀";
    default:
      return "Balanced Builder";
  }
}

  /* ---------------- GAME OVER SCREEN ---------------- */
  if (gameOver) {
    const archetype = getArchetype(skills, system);
    return (
      <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
        <h1>Game Over</h1>
        <p>{finalReason}</p>
        <h2>Your Archetype</h2>
        <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
          {archetype}
        </p>

        <h2>Final Skills</h2>
        <ul>
          <li>Product Thinking: {skills.product_thinking}</li>
          <li>Technical Judgment: {skills.technical_judgment}</li>
          <li>Leadership: {skills.leadership}</li>
          <li>Resource Management: {skills.resource_management}</li>
          <li>Execution: {skills.execution}</li>
        </ul>

        {system && (
          <>
            <h2>System State</h2>
            <ul>
              <li>Technical Debt: {system.technical_debt}</li>
              <li>Burnout: {system.burnout}</li>
              <li>Team Morale: {system.team_morale}</li>
              <li>Reputation: {system.reputation}</li>
              <li>Time Pressure: {system.time_pressure}</li>
            </ul>
          </>
        )}

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
  {Object.entries(skills).map(([key, value]) => (
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
          {key.replace("_", " ")}
        </span>
        <span>{value}</span>
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
  ))}
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