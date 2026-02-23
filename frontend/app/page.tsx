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

  const [selectedDecision, setSelectedDecision] = useState<number | null>(null);
  const [currentStage, setCurrentStage] = useState<number>(1);

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

        // Reset decision when stage changes
        setSelectedDecision(null);
        localStorage.removeItem("selectedDecision");
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

  /* ---------------- SAVE SELECTED DECISION ---------------- */
  useEffect(() => {
    if (selectedDecision !== null) {
      localStorage.setItem(
        "selectedDecision",
        selectedDecision.toString()
      );
    }
  }, [selectedDecision]);

  /* ---------------- HANDLE DECISION ---------------- */
  function handleDecision(decisionId: number, impact: SkillState) {
    if (selectedDecision !== null) return;

    setSkills((prev) => ({
      product_thinking: prev.product_thinking + impact.product_thinking,
      technical_judgment:
        prev.technical_judgment + impact.technical_judgment,
      leadership: prev.leadership + impact.leadership,
      resource_management:
        prev.resource_management + impact.resource_management,
      execution: prev.execution + impact.execution,
    }));

    setSelectedDecision(decisionId);
  }

  /* ---------------- HANDLE NEXT STAGE ---------------- */
  function handleNextStage() {
    setCurrentStage((prev) => prev + 1);
  }

  /* ---------------- HANDLE RESET GAME AND SKILL SCORES ---------------- */
  function handleResetGame() {
  localStorage.clear();

  setSkills({
    product_thinking: 0,
    technical_judgment: 0,
    leadership: 0,
    resource_management: 0,
    execution: 0,
  });

  setSelectedDecision(null);
  setCurrentStage(1);
}

  /* ---------------- LOADING GUARD ---------------- */
  if (!stage || !stage.decisions) {
    return <p>Loading...</p>;
  }

  const chosenDecision = stage.decisions.find(
    (d: any) => d.id === selectedDecision
  );

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
          onClick={() => handleDecision(decision.id, decision.impact)}
          disabled={selectedDecision !== null}
          style={{
            display: "block",
            margin: "1rem 0",
            padding: "0.5rem 1rem",
            opacity: selectedDecision !== null ? 0.6 : 1,
          }}
        >
          {decision.text}
        </button>
      ))}

      {/* Feedback */}
      {selectedDecision !== null && chosenDecision && (
        <p style={{ marginTop: "1rem", fontWeight: "bold" }}>
          You chose: {chosenDecision.text}
        </p>
      )}

      {selectedDecision !== null && (
        <button
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            display: "block",
          }}
          onClick={handleNextStage}
        >
          Continue to Next Stage
        </button>
      )}

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