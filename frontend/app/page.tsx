"use client";

import { useState, useEffect } from "react";

type SkillState = {
  product_thinking: number;
  technical_judgment: number;
  leadership: number;
  resource_management: number;
  execution: number;
};

type SystemState = {
  technical_debt: number;
  burnout: number;
  team_morale: number;
  reputation: number;
  time_pressure: number;
};

export default function Home() {
  const [stage, setStage] = useState<any>(null);

  const [skills, setSkills] = useState<SkillState>({
    product_thinking: 0,
    technical_judgment: 0,
    leadership: 0,
    resource_management: 0,
    execution: 0,
  });

  const [system, setSystem] = useState<SystemState | null>(null);

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
    if (gameOver) return;

    async function fetchStage() {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/stage/${currentStage}`
        );

        if (!res.ok) return;

        const data = await res.json();
        setStage(data);
        setStageLocked(false);
      } catch (err) {
        console.error("Stage fetch failed:", err);
      }
    }

    fetchStage();
  }, [currentStage, gameOver]);

  /* ---------------- START GAME ---------------- */
  async function startGame() {
    try {
      const res = await fetch("http://127.0.0.1:8000/start", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Failed to start:", data);
        return;
      }

      setSessionId(data.session_id);
      setSkills(data.skills);
      setCurrentStage(data.stage);
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
      setSkills({
        product_thinking: 0,
        technical_judgment: 0,
        leadership: 0,
        resource_management: 0,
        execution: 0,
      });
      setSystem(null);
      setCurrentStage(1);

      await startGame();
    } catch (err) {
      console.error("Hard reset failed:", err);
    }
  }

  /* ---------------- GAME OVER SCREEN ---------------- */
  if (gameOver) {
    return (
      <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
        <h1>Game Over</h1>
        <p>{finalReason}</p>

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
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>{stage.title}</h1>
      <p>{stage.description}</p>

      <h2>Skills</h2>
      <ul>
        <li>Product Thinking: {skills.product_thinking}</li>
        <li>Technical Judgment: {skills.technical_judgment}</li>
        <li>Leadership: {skills.leadership}</li>
        <li>Resource Management: {skills.resource_management}</li>
        <li>Execution: {skills.execution}</li>
      </ul>

      <h2>Decisions</h2>
      {stage.decisions.map((decision: any) => (
        <button
          key={decision.id}
          onClick={() => handleDecision(decision.id)}
          disabled={stageLocked}
          style={{
            display: "block",
            margin: "1rem 0",
            padding: "0.5rem 1rem",
          }}
        >
          {decision.text}
        </button>
      ))}

      <button
        onClick={handleHardReset}
        style={{
          marginTop: "2rem",
          padding: "0.5rem 1rem",
          backgroundColor: "#aa0000",
          color: "white",
        }}
      >
        Reset Game
      </button>
    </main>
  );
}