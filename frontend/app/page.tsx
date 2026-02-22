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
  // Stage data from backend
  const [stage, setStage] = useState<any>(null);

  // Player skill state
  const [skills, setSkills] = useState<SkillState>({
    product_thinking: 0,
    technical_judgment: 0,
    leadership: 0,
    resource_management: 0,
    execution: 0,
  });

  // Track which decision was selected
  const [selectedDecision, setSelectedDecision] = useState<number | null>(null);

  // Fetch stage data on first load
  useEffect(() => {
  async function fetchStage() {
    const res = await fetch("http://127.0.0.1:8000/stage/1");
    const data = await res.json();
    setStage(data);
  }

  fetchStage();

  // Load saved skills
  const savedSkills = localStorage.getItem("skills");
  const savedDecision = localStorage.getItem("selectedDecision");

  if (savedSkills) {
    setSkills(JSON.parse(savedSkills));
  }

  if (savedDecision) {
    setSelectedDecision(Number(savedDecision));
  }
}, []);

  useEffect(() => {
  localStorage.setItem("skills", JSON.stringify(skills));
}, [skills]);

useEffect(() => {
  if (selectedDecision !== null) {
    localStorage.setItem(
      "selectedDecision",
      selectedDecision.toString()
    );
  }
}, [selectedDecision]);

  // Handle decision click
  function handleDecision(decisionId: number, impact: SkillState) {
    // Prevent multiple selections
    if (selectedDecision !== null) return;

    // Update skills safely using previous state
    setSkills((prev) => ({
      product_thinking: prev.product_thinking + impact.product_thinking,
      technical_judgment:
        prev.technical_judgment + impact.technical_judgment,
      leadership: prev.leadership + impact.leadership,
      resource_management:
        prev.resource_management + impact.resource_management,
      execution: prev.execution + impact.execution,
    }));

    // Mark this decision as selected
    setSelectedDecision(decisionId);
  }

  // Show loading while stage is not yet fetched
  if (!stage) return <p>Loading...</p>;

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

      {/* Feedback section */}
      {selectedDecision !== null && (
        <p style={{ marginTop: "1rem", fontWeight: "bold" }}>
          You chose:{" "}
          {
            stage.decisions.find(
              (d: any) => d.id === selectedDecision
            ).text
          }
        </p>
      )}
    </main>
  );
}