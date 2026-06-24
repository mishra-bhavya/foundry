"use client";

import { useState } from "react";

import CareerCard from "./CareerCard";
import { careers } from "./careers";

type Props = {
  onStart: () => void;
};

export default function LandingPage({ onStart }: Props) {
  const [activeCareer, setActiveCareer] = useState(0);

  return (
    <main
      style={{
        minHeight: "100vh",

        display: "flex",
        flexDirection: "column",

        justifyContent: "center",
        alignItems: "center",

        padding: "4rem 2rem",
      }}
    >
      <div
        style={{
          textAlign: "center",
          marginBottom: "4rem",
        }}
      >
        <div
          style={{
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "#ff8c42",
            marginBottom: "1rem",
            fontSize: "0.9rem",
          }}
        >
          Career Simulation
        </div>

        <h1
          style={{
            fontSize: "5.5rem",
            fontWeight: 800,
            lineHeight: 1,
            marginBottom: "1rem",
          }}
        >
          Who Will You Become?
        </h1>

        <p
          style={{
            color: "var(--muted)",
            fontSize: "1.1rem",
          }}
        >
          Every path demands sacrifice. Choose carefully.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "2rem",
          flexWrap: "wrap",
        }}
      >
        {careers.map((career, index) => (
          <CareerCard
            key={career.id}
            career={career}
            isActive={index === activeCareer}
            onClick={() => setActiveCareer(index)}
          />
        ))}
      </div>
    </main>
  );
}