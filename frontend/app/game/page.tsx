"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import EnvelopeCard from "@/components/gameover/EnvelopeCard";

type SkillState = Record<string, number>;
type SystemState = Record<string, number>;

function getStatStatus(stat: string, value: number) {
  const thresholds: Record<string, { warning: number; danger: number }> = {
    burnout: { warning: 5, danger: 10 },
    technical_debt: { warning: 8, danger: 15 },
    time_pressure: { warning: 5, danger: 10 },
    reputation: { warning: 20, danger: 10 },
    team_morale: { warning: 40, danger: 20 }
  };

  const config = thresholds[stat];
  if (!config) return "good";

  if (stat === "reputation" || stat === "team_morale") {
    if (value < config.danger) return "danger";
    if (value < config.warning) return "warning";
    return "good";
  }

  if (value >= config.danger) return "danger";
  if (value >= config.warning) return "warning";
  return "good";
}

export default function Home() {
  const [stage, setStage] = useState<any>(null);

  const [skills, setSkills] = useState<SkillState>({});
  const [system, setSystem] = useState<SystemState>({});
  const [history, setHistory] = useState<any[]>([]);
  const [aiFeedback, setAiFeedback] = useState<any | null>(null)

  const [skillsSchema, setSkillsSchema] = useState<string[]>([]);
  const [systemSchema, setSystemSchema] = useState<string[]>([]);

  const [careerStory, setCareerStory] = useState("");

  const [currentStage, setCurrentStage] = useState<number>(1);
  const [stageLocked, setStageLocked] = useState(false);
  const [sessionId, setSessionId] = useState<number | null>(null);

  const [endingType, setEndingType] = useState<string | null>(null);

  const [gameOver, setGameOver] = useState(false);
  const [finalReason, setFinalReason] = useState<string | null>(null);

  const [openEnvelope, setOpenEnvelope] = useState<string | null>("reflection");

  const router = useRouter();

  const searchParams = useSearchParams();
  const careerId = searchParams.get("career");
  if (!careerId) {
    return <p>No career selected.</p>;
  }

  useEffect(() => {
    startGame();
  }, []);


  function getStatStatus(stat: string, value: number) {
    const thresholds: Record<string, { warning: number; danger: number }> = {
      burnout: { warning: 5, danger: 10 },
      technical_debt: { warning: 8, danger: 15 },
      time_pressure: { warning: 5, danger: 10 },
      reputation: { warning: 20, danger: 10 },
      team_morale: { warning: 40, danger: 20 }
    };

    const config = thresholds[stat];
    if (!config) return "normal";

    if (stat === "reputation" || stat === "team_morale") {
      if (value < config.danger) return "danger";
      if (value < config.warning) return "warning";
      return "good";
    }

    if (value >= config.danger) return "danger";
    if (value >= config.warning) return "warning";
    return "good";
  }


  /* ---------------- FETCH STAGE ---------------- */
  useEffect(() => {
    if (gameOver || !sessionId || stageLocked) return;

    async function fetchStage() {
      try {
        const res = await fetch(`http://127.0.0.1:8000/stage/${currentStage}?session_id=${sessionId}`);

        if (!res.ok){
        console.error("Stage fetch failed:", await res.text());
        return;
      }

        const data = await res.json();

        if (data.decision_history) {
          setHistory(data.decision_history);
        }

        if (data.game_over) {
          setGameOver(true);
          setFinalReason(data.reason);
          setStageLocked(true);

          if (data.ending_type) {
            setEndingType(data.ending_type);
          }

          return;
        }

        setStage(data);
        setStageLocked(false);
      } catch (err) {
        console.error("Stage fetch failed:", err);
      }
    }

    fetchStage();
  }, [currentStage, gameOver, sessionId]);

  /* ---------------- START GAME ---------------- */
  async function startGame() {
    try {
      const res = await fetch(`http://localhost:8000/start?career_id=${careerId}`, {
          method: "POST"
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Failed to start:", data);
        return;
      }

      setSessionId(data.id);
      setSkills(prev => ({
        ...prev,
        ...data.skills
      }));;
      setSystem(prev => ({
        ...prev,
        ...data.system
      }));
      setCurrentStage(data.current_stage);
      setSkillsSchema(data.skills_schema);
      setSystemSchema(data.system_schema);
      setGameOver(false);
      setFinalReason(null);
      setStageLocked(false);
    } catch (err) {
      console.error("Start failed:", err);
    }
  }

  /* ---------------- HANDLE DECISION ---------------- */
  async function handleDecision(decisionId: number) {
    if (stageLocked || !sessionId) return;

    setStageLocked(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/decision", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: sessionId,
          decision_id: decisionId,
        }),
      });

      const data = await res.json();

      if (data.decision_history) {
        setHistory(data.decision_history)
      }

      if (data.ai_feedback) {
        setAiFeedback(data.ai_feedback)
      }

      if (!res.ok) {
        console.error("Decision rejected:", data);
        setStageLocked(false);
        return;
      }

      setSkills(prev => ({
        ...prev,
        ...data.skills
      }));;
      setSystem(prev => ({
        ...prev,
        ...data.system
      }));

      if (data.game_over) {
        setGameOver(true);
        setFinalReason(data.reason);

        if (data.ending_type) {
          setEndingType(data.ending_type);
        }

        if (data.career_story) {
          setCareerStory(data.career_story);
        }

        return;
      }

      setTimeout(() => {

        /* ---------- NEW: EVENT HANDLING ---------- */
        if (data.event && data.stage) {
          setStage(data.stage);
          setStageLocked(false);
          return;
        }

        /* ---------- NORMAL STAGE FLOW ---------- */
        if (data.next_stage !== null && data.next_stage !== undefined) {
          setCurrentStage(data.next_stage);
        }

        setStageLocked(false);

      }, 600);

    } catch (err) {
      console.error("Decision failed:", err);
    }
  }

  /* ---------------- RESTART GAME ---------------- */
  async function handleRestart() {

    setSkills({});
    setSystem({});
    setHistory([]);

    setGameOver(false);
    setFinalReason(null);

    setCurrentStage(1);
    setStage(null);

    await startGame();
  }

  /* ---------------- RESET EVERYTHING ---------------- */
  async function handleHardReset() {
    try {
      await fetch("http://127.0.0.1:8000/reset", {
        method: "POST",
      });

      setGameOver(false);
      setFinalReason(null);
      setSkills({});
      setSystem({});
      setCurrentStage(1);

      await startGame();
    } catch (err) {
      console.error("Hard reset failed:", err);
    }
  }

  

  /* ---------------- GAME OVER SCREEN ---------------- */
  if (gameOver) {

    const dominantSkill = Object.entries(skills).reduce((a, b) =>
      a[1] > b[1] ? a : b
    )[0];

    const weakestSkill = Object.entries(skills).reduce((a, b) =>
      a[1] < b[1] ? a : b
    )[0];

    const performanceScore =
      Object.values(skills).reduce((a, b) => a + b, 0) -
      Object.values(system).reduce((a, b) => a + b, 0);

    return (
      <main style={{
              padding: "2rem",
              fontFamily: "sans-serif",
              minHeight: "100vh",
              position: "relative",
            }}
      >
        <h1>Simulation Complete</h1>
        <p>
          <strong>Ending Type:</strong> {endingType?.replace("_", " ")}
        </p>

        <p>{finalReason}</p>

        <div
          style={{
            position: "relative",

            marginTop: "3rem",

            minHeight: "900px",

            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        ></div>

        {careerStory && (
          <EnvelopeCard
            title="Career Reflection"
            
            isOpen={openEnvelope === "reflection"}
            isDimmed={
              openEnvelope !== null &&
              openEnvelope !== "reflection"
            }
            onOpen={() => setOpenEnvelope("reflection")}
            onClose={() => setOpenEnvelope(null)}
          >
            <p
              style={{
                fontSize: "1.15rem",
                lineHeight: 1.9,
                color: "var(--muted)",
              }}
            >
              {careerStory}
            </p>
          </EnvelopeCard>
        )}

        <EnvelopeCard
          title="Performance Summary"
          isOpen={openEnvelope === "performance"}
          isDimmed={
            openEnvelope !== null &&
            openEnvelope !== "performance"
          }
          onOpen={() => setOpenEnvelope("performance")}
          onClose={() => setOpenEnvelope(null)}
        >
          <p>
            <strong>Dominant Skill:</strong>{" "}
            {dominantSkill.replace(/_/g, " ")}
          </p>

          <p>
            <strong>Weakest Skill:</strong>{" "}
            {weakestSkill.replace(/_/g, " ")}
          </p>

          <p>
            <strong>Overall Score:</strong>{" "}
            {performanceScore.toFixed(1)}
          </p>
        </EnvelopeCard>

        <EnvelopeCard
          title="AI Feedback"
          isOpen={openEnvelope === "feedback"}
          isDimmed={
            openEnvelope !== null &&
            openEnvelope !== "feedback"
          }
          onOpen={() => setOpenEnvelope("feedback")}
          onClose={() => setOpenEnvelope(null)}
        >
          <p>{aiFeedback?.analysis}</p>
        </EnvelopeCard>

        <EnvelopeCard
          title="Decision Timeline"
          isOpen={openEnvelope === "timeline"}
          isDimmed={
            openEnvelope !== null &&
            openEnvelope !== "timeline"
          }
          onOpen={() => setOpenEnvelope("timeline")}
          onClose={() => setOpenEnvelope(null)}
        >
          {history?.map((h: any, index: number) => (
            <div key={index} style={{ marginBottom: "1rem" }}>
              <strong>Stage {h.stage}</strong>
              <div>{h.title}</div>
              <div>{h.decision_text}</div>
            </div>
          ))}
        </EnvelopeCard>

        <EnvelopeCard
          title="Final Skills"
          isOpen={openEnvelope === "skills"}
          isDimmed={
            openEnvelope !== null &&
            openEnvelope !== "skills"
          }
          onOpen={() => setOpenEnvelope("skills")}
          onClose={() => setOpenEnvelope(null)}
        >
          {skillsSchema.map((key) => (
            <div key={key}>
              {key.replace(/_/g, " ")}:{" "}
              {Number(skills[key] ?? 0).toFixed(1)}
            </div>
          ))}
        </EnvelopeCard>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginTop: "2rem",
            flexWrap: "wrap",
          }}
        >
          <button
            className="primary-button"
            onClick={handleRestart}
          >
            Replay Career
          </button>

          <button
            onClick={() => router.push("/")}
            style={{
              padding: "1rem 1.4rem",
              borderRadius: "18px",
              border: "1px solid rgba(255,140,60,0.18)",
              background: "rgba(255,255,255,0.04)",
              color: "var(--foreground)",
              cursor: "pointer",
              fontWeight: 600,
              backdropFilter: "blur(10px)",
            }}
          >
            Choose Another Career
          </button>
        </div>
      </main>
    );
  }

  /* ---------------- LOADING ---------------- */
  if (!stage || !stage.decisions) {
    return <p>Loading...</p>;
  }

  /* ---------------- MAIN GAME ---------------- */
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "48px 32px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1400px",
          display: "grid",
          gridTemplateColumns: "minmax(0, 2fr) 380px",
          gap: "32px",
          alignItems: "start",
        }}
      >
        {/* LEFT SIDE */}
        <section
          className="glass-card"
          style={{
            background: "var(--panel)",
            border: "1px solid var(--panel-border)",
            borderRadius: "24px",
            padding: "40px",
            backdropFilter: "blur(14px)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.35)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "999px",
                background: "var(--accent)",
                boxShadow: "0 0 16px var(--accent)",
              }}
            />

            <span
              style={{
                color: "var(--muted)",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                fontSize: "0.75rem",
                fontWeight: 600,
              }}
            >
              Career Simulation
            </span>
          </div>

          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: 700,
              marginBottom: "18px",
            }}
          >
            {stage.title}
          </h1>

          <p
            style={{
              color: "var(--muted)",
              fontSize: "1.05rem",
              lineHeight: 1.8,
              maxWidth: "90%",
            }}
          >
            {stage.description}
          </p>

          <div
            style={{
              marginTop: "48px",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: 600,
              }}
            >
              Choose Your Response
            </h2>

            <span
              style={{
                color: "var(--muted)",
                fontSize: "0.85rem",
              }}
            >
              Decisions shape your career path
            </span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            {stage.decisions.map((decision: any) => {
              const skillEffects = Object.entries(
                decision.impact?.skills || {}
              ).filter(([key]) =>
                skillsSchema.includes(key)
              ) as [string, number][];

              const systemEffects = Object.entries(
                decision.impact?.system || {}
              ).filter(([key]) =>
                systemSchema.includes(key)
              ) as [string, number][];

              return (
                <button
                  key={decision.id}
                  onClick={() => handleDecision(decision.id)}
                  disabled={stageLocked}
                  style={{
                    width: "100%",
                    padding: "26px",
                    borderRadius: "18px",
                    border: "1px solid rgba(105, 71, 117, 0.18)",
                    background:
                      "linear-gradient(180deg, rgba(18,16,14,0.96), rgba(10,9,8,0.98))",
                    color: "var(--foreground)",
                    cursor: "pointer",
                    transition: "all 0.25s ease",
                    textAlign: "left",
                    backdropFilter: "blur(10px)",
                    boxShadow: "0 8px 30px rgba(80,50,90,0.08)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.borderColor =
                      "rgba(105,71,117,0.35)";
                    e.currentTarget.style.background =
                      "linear-gradient(180deg, rgba(52,24,10,0.98), rgba(18,10,8,0.98))";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0px)";
                    e.currentTarget.style.borderColor =
                      "rgba(105,71,117,0.18)";
                    e.currentTarget.style.background =
                      "linear-gradient(180deg, rgba(52,24,10,0.98), rgba(18,10,8,0.98))";
                  }}
                >
                  <div
                    style={{
                      fontSize: "1.15rem",
                      fontWeight: 600,
                      marginBottom: "18px",
                      lineHeight: 1.5,
                    }}
                  >
                    {decision.text}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "10px",
                    }}
                  >
                    {[...skillEffects, ...systemEffects].map(([key, val]) => (
                      <div
                        key={key}
                        style={{
                          padding: "6px 10px",
                          borderRadius: "999px",
                          fontSize: "0.82rem",
                          background:
                            val > 0
                              ? "rgba(130,171,125,0.18)"
                              : "rgba(160,82,45,0.16)",
                          color:
                            val > 0
                              ? "#5E7C5A"
                              : "#9C4F2D",
                          border:
                            val > 0
                              ? "1px solid rgba(130,171,125,0.28)"
                              : "1px solid rgba(160,82,45,0.24)"
                        }}
                      >
                        {val > 0 ? "+" : ""}
                        {val} {key.replace(/_/g, " ")}
                      </div>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* RIGHT PANEL */}
        <aside
          style={{
            background: "var(--panel)",
            border: "1px solid var(--panel-border)",
            borderRadius: "24px",
            padding: "28px",
            position: "sticky",
            top: "32px",
            height: "fit-content",
            backdropFilter: "blur(14px)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.35)",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              marginBottom: "28px",
            }}
          >
            Live Stats
          </h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            {skillsSchema.map((key) => {
              const value = skills?.[key] ?? 0;

              return (
                <div key={key}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                      fontSize: "0.9rem",
                    }}
                  >
                    <span>{key.replace(/_/g, " ")}</span>
                    <span>{Number(value).toFixed(1)}</span>
                  </div>

                  <div
                    style={{
                      height: "8px",
                      background: "rgba(255,255,255,0.06)",
                      borderRadius: "999px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.max(0, value * 10)}%`,
                        height: "100%",
                        borderRadius: "999px",
                        background: "linear-gradient(to right, #38bdf8, #22c55e)",
                        transition: "width 0.4s ease",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <h3
            style={{
              marginTop: "40px",
              marginBottom: "22px",
              fontSize: "1.2rem",
            }}
          >
            System Pressure
          </h3>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            {systemSchema.map((key) => {
              const value = system[key] ?? 0;

              const positiveStats = [
                "reputation",
                "client_trust",
                "team_morale",
                "patient_trust",
              ];

              const isGoodStat = positiveStats.includes(key);

              let barColor = "#22c55e";

              if (isGoodStat) {
                if (value < 30) {
                  barColor = "#ef4444";
                } else if (value < 60) {
                  barColor = "#facc15";
                }
              } else {
                if (value >= 8) {
                  barColor = "#ef4444";
                } else if (value >= 5) {
                  barColor = "#facc15";
                }
              }

              return (
                <div key={key}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                      fontSize: "0.9rem",
                    }}
                  >
                    <span>{key.replace(/_/g, " ")}</span>
                    <span>{Math.round(value)}</span>
                  </div>

                  <div
                    style={{
                      height: "8px",
                      background: "rgba(255,255,255,0.06)",
                      borderRadius: "999px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.min(value * 10, 100)}%`,
                        height: "100%",
                        background: barColor,
                        borderRadius: "999px",
                        transition: "width 0.4s ease",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleHardReset}
            style={{
              width: "100%",
              marginTop: "36px",
              padding: "14px",
              borderRadius: "14px",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.03)",
              color: "#d1d5db",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor =
                "rgba(255,255,255,0.18)";
              e.currentTarget.style.background =
                "rgba(255,255,255,0.06)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor =
                "rgba(255,255,255,0.08)";
              e.currentTarget.style.background =
                "rgba(255,255,255,0.03)";
            }}
          >
            Reset Simulation
          </button>
        </aside>
      </div>
    </main>
  );
}