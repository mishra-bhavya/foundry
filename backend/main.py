from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from simulation.engine import apply_decision
from pydantic import BaseModel
from database import SessionLocal
from database import engine
from models import Base
from models import GameSession
from careers import CAREERS
from fastapi import Query

Base.metadata.create_all(bind=engine)

class DecisionRequest(BaseModel):
    session_id: int
    decision_id: int

class ResetRequest(BaseModel):
    session_id: int


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Foundry backend running"}

# dynamic endpoint
@app.get("/stage/{stage_id}")
def get_stage(stage_id: int, session_id: int = Query(...)):

    db = SessionLocal()

    session = db.query(GameSession).filter(
        GameSession.id == session_id
    ).first()

    if not session:
        db.close()
        return {"error": "Invalid session"}

    career_config = CAREERS.get(session.career_id)

    if not career_config:
        db.close()
        return {"error": "Career not found"}

    stage = career_config["stages"].get(stage_id)

    db.close()

    if not stage:
        return {"error": "Stage not found"}

    if stage.get("final"):
        return {
            "final": True,
            "reason": "Hackathon completed."
        }

    return stage


@app.post("/decision")
def make_decision(req: DecisionRequest):

    db = SessionLocal()

    session = db.query(GameSession).filter(
        GameSession.id == req.session_id
    ).first()

    if not session:
        db.close()
        return {"error": "Invalid session"}

    current_stage = session.current_stage
    career_config = CAREERS.get(session.career_id)

    if not career_config:
        db.close()
        return {"error": "Career not found"}

    stage = career_config["stages"].get(current_stage)

    if not stage:
        db.close()
        return {"error": "Stage not found"}

    decision = next(
        d for d in stage["decisions"]
        if d["id"] == req.decision_id
    )

    # ✅ Use stored JSON directly
    skill_state = session.skills.copy()
    system_state = session.system_state.copy()

    # Apply decision logic
    skill_state, system_state = apply_decision(
        skill_state,
        system_state,
        impact=decision["impact"],
        difficulty=1.0,
        risk_factor=decision.get("risk_factor", 1.0)
    )

    # Resolve next stage
    def resolve_next_stage(next_stage_config, system_state):
        # FINAL STAGE
        if next_stage_config is None:
            return None

        # Simple direct jump
        if isinstance(next_stage_config, int):
            return next_stage_config

        # Conditional branching
        if isinstance(next_stage_config, dict):
            if system_state["team_morale"] < 35 and "if_morale_low" in next_stage_config:
                return next_stage_config["if_morale_low"]

            if system_state["technical_debt"] > 4 and "if_debt_high" in next_stage_config:
                return next_stage_config["if_debt_high"]

            return next_stage_config.get("default")

        return None


    next_stage = resolve_next_stage(
        decision["next_stage"],
        system_state
    )

    if next_stage is None:
        session.is_game_over = True
        db.commit()
        db.close()

        return {
            "skills": skill_state,
            "system": system_state,
            "next_stage": None,
            "game_over": True,
            "reason": "Hackathon completed."
        }

    # ✅ Save updated JSON back into session
    session.skills = skill_state
    session.system_state = system_state
    session.current_stage = next_stage

    db.commit()

    # Game over logic
    game_over = False
    reason = None

    if system_state.get("team_morale", 100) <= 10:
        game_over = True
        reason = "Team collapsed due to low morale."

    if system_state.get("burnout", 0) >= 10:
        game_over = True
        reason = "You burned out before finishing."

    if stage.get("final"):
        game_over = True
        reason = "Hackathon completed."

    db.close()

    return {
        "skills": skill_state,
        "system": system_state,
        "next_stage": next_stage,
        "game_over": game_over,
        "reason": reason
    }

@app.post("/reset")
def reset_game(req: ResetRequest):
    db = SessionLocal()

    session = db.query(GameSession).filter(
        GameSession.id == req.session_id
    ).first()

    if not session:
        db.close()
        return {"error": "Invalid session"}

    # Reset skills
    session.product_thinking = 0
    session.technical_judgment = 0
    session.leadership = 0
    session.resource_management = 0
    session.execution = 0

    # Reset system
    session.technical_debt = 0
    session.burnout = 0
    session.team_morale = 100

    session.current_stage = 1

    db.commit()
    db.close()

    return {"message": "Game reset"}


@app.post("/start")
def start_game(career_id: str = Query(...)):

    if career_id not in CAREERS:
        return {"error": "Invalid career"}

    career_config = CAREERS[career_id]

    db = SessionLocal()

    new_session = GameSession(
        career_id=career_config["id"],
        skills=career_config["skills"].copy(),
        system_state=career_config["system_state"].copy(),
        current_stage=1,
        is_game_over=False
    )

    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    db.close()

    return {
        "id": new_session.id,
        "career_id": new_session.career_id,
        "current_stage": new_session.current_stage,
        "skills": new_session.skills,
        "system_state": new_session.system_state,
        "is_game_over": new_session.is_game_over
    }