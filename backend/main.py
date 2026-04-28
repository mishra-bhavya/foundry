from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from simulation.engine import apply_decision
from pydantic import BaseModel
from database import SessionLocal, get_db
from database import engine
from models import Base
from models import GameSession
from careers import CAREERS
from fastapi import Query
from services.ai_engine import generate_stage
import random
from services.event_engine import generate_event
from services.event_engine import check_stat_events
from fastapi import Depends
from sqlalchemy.orm import Session

MAX_STAGES = 20


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

    # If stage not defined, generate dynamically
    if not stage:
        stage = generate_stage(
            session.career_id,
            session.skills,
            session.system_state,
            stage_id
        )

    db.close()
    if not stage:
        return {"error": "Stage not found"}

    if stage.get("final"):
        return {
            "final": True,
            "reason": f"{session.career_id.capitalize()} completed."
        }
    return stage



@app.post("/decision")
def make_decision(req: DecisionRequest, db: Session = Depends(get_db)):

    session = db.query(GameSession).filter(
        GameSession.id == req.session_id
    ).first()

    if not session:
        return {"error": "Invalid session"}

    current_stage = session.current_stage
    career_config = CAREERS.get(session.career_id)

    if not career_config:
        return {"error": "Career not found"}

    # Try static stage first
    stage = career_config["stages"].get(current_stage)

    # Generate dynamic stage if not present
    if not stage:
        stage = generate_stage(
            session.career_id,
            session.skills,
            session.system_state,
            current_stage
        )

    if not stage:
        return {"error": "Stage not found"}

    # Find the decision chosen
    decision = next(
        (d for d in stage["decisions"] if d["id"] == req.decision_id),
        None
    )

    if not decision:
        return {"error": "Decision not found"}

    history = list(session.decision_history or [])

    history.append({
        "stage": current_stage,
        "decision_id": decision["id"],
        "title": stage["title"],
        "decision_text": decision["text"]
    })

    session.decision_history = history


    # Copy stored states
    skill_state = session.skills.copy()
    system_state = session.system_state.copy()

    # Apply decision effects
    skill_state, system_state = apply_decision(
        skill_state,
        system_state,
        impact=decision["impact"],
        stage=current_stage,
        risk_factor=decision.get("risk_factor", 1.0)
    )

    # Determine next stage
    def resolve_next_stage(next_stage_config, system_state):

        if next_stage_config is None:
            return None

        if isinstance(next_stage_config, int):
            return next_stage_config

        if isinstance(next_stage_config, dict):

            if system_state.get("team_morale", 100) < 35 and "if_morale_low" in next_stage_config:
                return next_stage_config["if_morale_low"]

            if system_state.get("technical_debt", 0) > 4 and "if_debt_high" in next_stage_config:
                return next_stage_config["if_debt_high"]

            return next_stage_config.get("default")

        return None

    next_stage = resolve_next_stage(
        decision.get("next_stage"),
        system_state
    )

    # Force completion if next stage would exceed limit
    if next_stage and next_stage > MAX_STAGES:
        next_stage = None

    # Default fallback progression (respect MAX_STAGES)
    if next_stage is None and not stage.get("final") and current_stage < MAX_STAGES:
        next_stage = current_stage + 1

    # Final stage handling
    if next_stage is None:

        session.is_game_over = True
        db.commit()

        dominant_skill = max(skill_state, key=skill_state.get)
        weakest_skill = min(skill_state, key=skill_state.get)

        performance_score = round(sum(skill_state.values()) - sum(system_state.values()), 2)

        career_id = session.career_id

        # --- Determine ending type ---
        ending_type = "completed"

        if system_state.get("fatigue", 0) > 12:
            ending_type = "burnout"

        elif system_state.get("legal_risk", 0) > 10:
            ending_type = "malpractice"

        elif system_state.get("team_morale", 100) < 20:
            ending_type = "team_collapse"

        return {
            "skills": skill_state,
            "system": system_state,
            "next_stage": None,
            "game_over": True,
            "ending_type": ending_type,
            "reason": f"{career_id.capitalize()} simulation finished.",
            "summary": {
                "dominant_skill": dominant_skill,
                "weakest_skill": weakest_skill,
                "performance_score": performance_score
            },
            "decision_history": session.decision_history
        }

    # Save updated state
    session.skills = skill_state
    session.system_state = system_state
    session.current_stage = next_stage

    db.commit()

    # Event cooldown system
    EVENT_COOLDOWN = 3

    can_trigger_event = (
        current_stage - session.last_event_stage >= EVENT_COOLDOWN
    )

    # Check stat-triggered events first
    if can_trigger_event:

        stat_event = check_stat_events(session.career_id, system_state)

        if stat_event:
            session.last_event_stage = current_stage
            db.commit()

            return {
                "event": True,
                "stage": stat_event,
                "skills": skill_state,
                "system": system_state,
                "game_over": False
            }

    if can_trigger_event and random.random() < 0.10:

        event_stage = generate_event(session.career_id)

        if event_stage:
            session.last_event_stage = current_stage
            db.commit()

            return {
                "event": True,
                "stage": event_stage,
                "skills": skill_state,
                "system": system_state,
                "game_over": False
            }

    
    game_over = False
    reason = None

    career = session.career_id

    # Hackathon failures
    if career == "hackathon":
        if system_state.get("team_morale", 100) <= 20:
            game_over = True
            reason = "Your team collapsed due to low morale."

        if system_state.get("burnout", 0) >= 10:
            game_over = True
            reason = "You burned out before finishing."

    # Doctor failures
    elif career == "doctor":
        if system_state.get("fatigue", 0) >= 35:
            game_over = True
            reason = "Exhaustion caused a critical medical error."

        if system_state.get("legal_risk", 0) >= 20:
            game_over = True
            reason = "A malpractice lawsuit ended your career."

    # Lawyer failures
    elif career == "lawyer":
        if system_state.get("stress", 0) >= 35:
            game_over = True
            reason = "Stress caused you to collapse during trial."

        if system_state.get("reputation", 0) <= 10:
            game_over = True
            reason = "Your professional reputation collapsed."
    
    return {
        "skills": skill_state,
        "system": system_state,
        "next_stage": next_stage,
        "game_over": game_over,
        "ending_type": "failure",
        "reason": reason,
        "history": session.decision_history
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
        "skills_schema": career_config["skills_schema"],
        "system_schema": career_config["system_schema"],
        "is_game_over": new_session.is_game_over
    }

@app.get("/careers")
def get_careers():
    return [
        {
            "id": key,
            "name": value.get("name", key.capitalize()),
            "description": value.get("description", "")
        }
        for key, value in CAREERS.items()
    ]