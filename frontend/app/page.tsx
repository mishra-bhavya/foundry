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

  useEffect(() => {
    async function fetchStage() {
      const res = await fetch("http://127.0.0.1:8000/stage/1");
      const data = await res.json();
      setStage(data);
    }

    fetchStage();
  }, []);

  function handleDecision(impact: SkillState) {
    setSkills((prev) => ({
      product_thinking: prev.product_thinking + impact.product_thinking,
      technical_judgment:
        prev.technical_judgment + impact.technical_judgment,
      leadership: prev.leadership + impact.leadership,
      resource_management:
        prev.resource_management + impact.resource_management,
      execution: prev.execution + impact.execution,
    }));
  }

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
          onClick={() => handleDecision(decision.impact)}
          style={{
            display: "block",
            margin: "1rem 0",
            padding: "0.5rem 1rem",
          }}
        >
          {decision.text}
        </button>
      ))}
    </main>
  );
}