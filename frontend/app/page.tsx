"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import IntroScreen from "@/components/landing/IntroScreen";
import EnvelopeCard from "@/components/gameover/EnvelopeCard";

type Career = {
  id: string
  name: string
  description: string
}

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const router = useRouter();

  const [careers, setCareers] = useState<Career[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [openedCareer, setOpenedCareer] = useState<string | null>(null);

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

  if (showIntro) {
    return (
      <IntroScreen
        onStart={() => setShowIntro(false)}
      />
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "3rem",
        fontFamily: "sans-serif",

        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          textAlign: "center",
          marginTop: "2rem",
        }}
      >
        <p
          style={{
            color: "#ff8c3c",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
          }}
        >
          Career Simulation
        </p>

        <h1
          style={{
            fontSize: "5rem",
            marginBottom: "1rem",
          }}
        >
          Who Will You Become?
        </h1>

        <p
          style={{
            maxWidth: "700px",
            margin: "0 auto",
            opacity: 0.8,
          }}
        >
          Every path demands sacrifice.
          Choose carefully.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "6rem",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "800px",
            height: "320px",
          }}
        >
          {careers.map((career, index) => {
            const rawOffset =
              index - selectedIndex;

            if (
              rawOffset < -2 ||
              rawOffset > 2
            ) {
              return null;
            }

            return (
              <div
                key={career.id}
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 10 - Math.abs(rawOffset),

                  transform: `
                    translateX(${rawOffset * 240}px)
                    translateY(${Math.abs(rawOffset) * 40}px)
                    rotate(${rawOffset * 16}deg)
                    scale(${rawOffset === 0 ? 1.1 : 0.82})
                  `,
                }}
              >
                <EnvelopeCard
                  title={career.name}
                  isOpen={openedCareer === career.id}
                  isDimmed={false}
                  onOpen={() => setOpenedCareer(career.id)}
                  onClose={() => setOpenedCareer(null)}
                >
                  <div
                    style={{
                      color: "#2d241d",
                      fontSize: "1.05rem",
                      lineHeight: "1.8",
                    }}
                  >
                    {career.description}
                  </div>

                  <button
                    onClick={() => selectCareer(career.id)}
                    style={{
                      marginTop: "1rem",
                      padding: "0.8rem 1rem",
                      borderRadius: "12px",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Begin Career
                  </button>
                </EnvelopeCard>
              </div>
            );
          })}
        </div>

        <div
          style={{
            marginTop: "2rem",
            color: "rgba(255,255,255,0.6)",
            fontSize: "0.9rem",
            letterSpacing: "0.08em",
          }}
        >
          Click a dossier to inspect it
        </div>
      </div>
    </main>
  );
}