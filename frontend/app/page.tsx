"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const selectCareer = (careerId: string) => {
    router.push(`/game?career=${careerId}`);
  };

  return (
    <main style={{ padding: "3rem", fontFamily: "sans-serif" }}>
      <h1>Foundry</h1>
      <p>Select your career path:</p>

      <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
        <button onClick={() => selectCareer("hackathon")}>
          Hackathon
        </button>

        <button onClick={() => selectCareer("doctor")}>
          Doctor
        </button>
      </div>
    </main>
  );
}