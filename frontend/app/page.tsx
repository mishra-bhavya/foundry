"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();

  const [careers, setCareers] = useState<string[]>([]);

  const selectCareer = (careerId: string) => {
    router.push(`/game?career=${careerId}`);
  };

  useEffect(() => {
    const fetchCareers = async () => {
      const res = await fetch("http://localhost:8000/careers");
      const data = await res.json();
      setCareers(data);
    };

    fetchCareers();
  }, []);

  return (
    <main style={{ padding: "3rem", fontFamily: "sans-serif" }}>
      <h1>Foundry</h1>
      <p>Select your career path:</p>

      <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
        {careers.map((career) => (
          <button
            key={career}
            onClick={() => selectCareer(career)}
          >
            {career.charAt(0).toUpperCase() + career.slice(1)}
          </button>
        ))}
      </div>
    </main>
  );
}