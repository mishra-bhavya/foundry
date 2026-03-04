"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Career = {
  id: string
  name: string
  description: string
}

export default function Home() {
  const router = useRouter();

  const [careers, setCareers] = useState<Career[]>([]);

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
          <div
            key={career.id}
            onClick={() => selectCareer(career.id)}
            style={{
              border: "1px solid #333",
              padding: "1rem",
              borderRadius: "8px",
              cursor: "pointer",
              width: "220px"
            }}
          >
            <h3>{career.name}</h3>
            <p style={{ fontSize: "0.9rem", opacity: 0.7 }}>
              {career.description}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}