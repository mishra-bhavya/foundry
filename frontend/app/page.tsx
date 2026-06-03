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
          marginTop: "4rem",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "260px",
            height: "180px",
          }}
        >
          {careers.map((career, index) => {
            const offset =
              (index - selectedIndex + careers.length) %
              careers.length;

            if (offset > 2) return null;

            return (
              <div
                key={career.id}
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 3 - offset,
                  transform: `
                    translateY(${offset * 12}px)
                    scale(${1 - offset * 0.04})
                  `,
                }}
              >
                <EnvelopeCard
                  title={career.name}
                  isOpen={openedCareer === career.id}
                  isDimmed={offset !== 0}
                  onOpen={() => setOpenedCareer(career.id)}
                  onClose={() => setOpenedCareer(null)}
                >
                  <p>{career.description}</p>

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
            display: "flex",
            gap: "1rem",
          }}
        >
          <button
            onClick={() =>
              setSelectedIndex(
                (selectedIndex - 1 + careers.length) %
                  careers.length
              )
            }
          >
            ←
          </button>

          <button
            onClick={() =>
              setSelectedIndex(
                (selectedIndex + 1) %
                  careers.length
              )
            }
          >
            →
          </button>
        </div>
      </div>
    </main>
  );
}