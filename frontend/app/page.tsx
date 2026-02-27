"use client";

import { useState, useEffect } from "react";

type SkillState = {
  product_thinking: number;
  technical_judgment: number;
  leadership: number;
  resource_management: number;
  execution: number;
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

  const [currentStage, setCurrentStage] = useState<number>(1);
  const [stageLocked, setStageLocked] = useState(false);

  /* ---------------- LOAD SAVED STAGE ON FIRST LOAD ---------------- */
  useEffect(() => {
    const savedStage = localStorage.getItem("currentStage");
    if (savedStage) {
      setCurrentStage(Number(savedStage));
    }
  }, []);

  /* ---------------- FETCH STAGE DATA ---------------- */
  useEffect(() => {
    async function fetchStage() {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/stage/${currentStage}`
        );

        if (!res.ok) {
          console.warn("No more stages available.");
          return;
        }

        const data = await res.json();
        setStage(data);
        setStageLocked(false);

      } catch (error) {
        console.error("Fetch failed:", error);
        setCurrentStage(1);
      }
    }

    fetchStage();
  }, [currentStage]);

  /* ---------------- LOAD SAVED SKILLS ONCE ---------------- */
  useEffect(() => {
    const savedSkills = localStorage.getItem("skills");
    if (savedSkills) {
      setSkills(JSON.parse(savedSkills));
    }
  }, []);

  /* ---------------- SAVE SKILLS ---------------- */
  useEffect(() => {
    localStorage.setItem("skills", JSON.stringify(skills));
  }, [skills]);

  /* ---------------- SAVE CURRENT STAGE ---------------- */
  useEffect(() => {
    localStorage.setItem("currentStage", currentStage.toString());
  }, [currentStage]);


  /* ---------------- HANDLE DECISION ---------------- */
  async function handleDecision(decisionId: number) {
  if (stageLocked) return;

  try {
    const res = await fetch("http://127.0.0.1:8000/decision", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        decision_id: decisionId,
        stage_id: currentStage,
      }),
    });

    const data = await res.json();

    if (!res.ok || !data.skills) {
      console.error("Backend rejected decision:", data);
      return;
    }

    // NEW: handle game over
    if (data.game_over) {
      setSkills(data.skills);
      alert(data.reason);
      setStageLocked(true);
      return;
    }

    setSkills(data.skills);
    setStageLocked(true);

    setTimeout(() => {
      setCurrentStage(data.next_stage);
    }, 800);

  } catch (err) {
    console.error("Decision failed:", err);
  }
}

  /* ---------------- HANDLE RESET GAME AND SKILL SCORES ---------------- */
  async function handleResetGame() {
  try {
    await fetch("http://127.0.0.1:8000/reset", {
      method: "POST",
    });

    localStorage.clear();

    setSkills({
      product_thinking: 0,
      technical_judgment: 0,
      leadership: 0,
      resource_management: 0,
      execution: 0,
    });

    setCurrentStage(1);

  } catch (err) {
    console.error("Reset failed:", err);
  }
}

  /* ---------------- LOADING GUARD ---------------- */
  if (!stage || !stage.decisions) {
    return <p>Loading...</p>;
  }


  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>{stage.title}</h1>
      <p>{stage.description}</p>

      <h2>Skills</h2>
      <ul>
        <li>Product Thinking: {skills?.product_thinking ?? 0}</li>
        <li>Technical Judgment: {skills?.technical_judgment ?? 0}</li>
        <li>Leadership: {skills?.leadership ?? 0}</li>
        <li>Resource Management: {skills?.resource_management ?? 0}</li>
        <li>Execution: {skills?.execution ?? 0}</li>
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
          onClick={handleResetGame}
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