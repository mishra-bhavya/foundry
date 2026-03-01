from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from simulation.engine import apply_decision
from pydantic import BaseModel
from database import SessionLocal
from database import engine
from models import Base
from models import GameSession
from careers.hackathon import career_config

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
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ----- Stage 1: Hackathon Kickoff -----
stage_1 = {
    "stage_id": 1,
    "title": "Hackathon Kickoff",
    "description": (
        "You and your 3 teammates are 6 hours into a 48-hour hackathon. "
        "The theme is AI for campus networking. Half the team wants to build "
        "an ambitious AI-matching system. The other half wants a simple but "
        "stable MVP that connects students based on interests."
    ),
    "decisions": [
        {
            "id": 1,
            "text": "Push for the ambitious AI-matching system.",
            "impact": {
                "product_thinking": 2,
                "technical_judgment": -1,
                "leadership": 0,
                "resource_management": -2,
                "execution": 1
            },
            "next_stage": 2
        },
        {
            "id": 2,
            "text": "Build a simple but stable MVP that actually works.",
            "impact": {
                "product_thinking": 1,
                "technical_judgment": 2,
                "leadership": 1,
                "resource_management": 2,
                "execution": 2
            },
            "next_stage": 2
        },
        {
            "id": 3,
            "text": "Spend more time debating before deciding.",
            "impact": {
                "product_thinking": 0,
                "technical_judgment": 0,
                "leadership": -1,
                "resource_management": -2,
                "execution": -2
            },
            "next_stage": 2
        }
    ]
}

stage_2 = {
    "stage_id": 2,
    "title": "Internal Friction",
    "description": (
        "Tension builds inside the team. One teammate feels unheard. "
        "Another questions your technical direction. Energy dips as deadlines loom."
    ),
    "decisions": [
        {
            "id": 1,
            "text": "Double down and assert authority.",
            "impact": {
                "leadership": 2,
                "execution": 1,
                "team_morale": -6,
                "burnout": 2
            },
            "next_stage": 3
        },
        {
            "id": 2,
            "text": "Pause and run a structured team retrospective.",
            "impact": {
                "leadership": 1,
                "resource_management": 2,
                "team_morale": 4,
                "execution": -1,
                "burnout": 1
            },
            "next_stage": 3
        },
        {
            "id": 3,
            "text": "Ignore conflict and focus purely on output.",
            "impact": {
                "technical_judgment": 2,
                "execution": 2,
                "team_morale": -8,
                "burnout": 3
            },
            "next_stage": 3
        }
    ]
}

stage_3 = {
    "stage_id": 3,
    "title": "Demo Crisis",
    "description": (
        "With 4 hours left, your demo environment starts breaking. "
        "Technical debt is surfacing and team energy is low. "
        "You must decide how to handle the final stretch."
    ),
    "decisions": [
        {
            "id": 1,
            "text": "Quickly patch bugs without refactoring.",
            "impact": {
                "execution": 3,
                "technical_debt": 5,
                "burnout": 2,
                "team_morale": -5
            },
            "next_stage": {
                "default": 4,
                "if_debt_high": 6,
                "if_morale_low": 6
            },
            "risk_factor": 1.2
        },
        {
            "id": 2,
            "text": "Refactor core components before demo.",
            "impact": {
                "technical_judgment": 3,
                "execution": -2,
                "technical_debt": -3,
                "burnout": 1
            },
            "next_stage": {
                "default": 4,
                "if_debt_high": 6,
                "if_morale_low": 6
            },
            "risk_factor": 1.5
        },
        {
            "id": 3,
            "text": "Cut features and stabilize what works.",
            "impact": {
                "resource_management": 3,
                "execution": 1,
                "product_thinking": -1,
                "team_morale": 2
            },
            "next_stage": {
                "default": 4,
                "if_debt_high": 6,
                "if_morale_low": 6
            },
        }
    ]
}

stage_4 = {
    "stage_id": 4,
    "title": "Final Presentation",
    "description": (
        "You stand before the judges. "
        "They question scalability, technical choices, and team execution."
    ),
    "decisions": [
        {
            "id": 1,
            "text": "Focus on product vision and user impact.",
            "impact": {
                "product_thinking": 3,
                "leadership": 2,
                "reputation": 2
            },
            "next_stage": 5
        },
        {
            "id": 2,
            "text": "Deep dive into technical architecture.",
            "impact": {
                "technical_judgment": 4,
                "execution": 1,
                "reputation": 1
            },
            "next_stage": 5
        },
        {
            "id": 3,
            "text": "Emphasize teamwork and resilience.",
            "impact": {
                "leadership": 3,
                "team_morale": 2,
                "reputation": 2
            },
            "next_stage": 5
        }
    ]
}

stage_6 = {
    "stage_id": 6,
    "title": "Team Collapse",
    "description": "Low morale causes a breakdown in coordination. The demo fails.",
    "decisions": []
}

stages = {
    1: stage_1,
    2: stage_2,
    3: stage_3,
    4: stage_4,
    6: stage_6
}


@app.get("/")
def root():
    return {"message": "Foundry backend running"}

# dynamic endpoint
@app.get("/stage/{stage_id}")
def get_stage(stage_id: int):

    global stage_completed

    if stage_id not in stages:
        return {"error": "Stage not found"}

    stage_completed = False
    return stages[stage_id]

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
    stage = stages[current_stage]

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
        if isinstance(next_stage_config, int):
            return next_stage_config

        if system_state.get("team_morale", 100) < 35 and "if_morale_low" in next_stage_config:
            return next_stage_config["if_morale_low"]

        if system_state.get("technical_debt", 0) > 4 and "if_debt_high" in next_stage_config:
            return next_stage_config["if_debt_high"]

        return next_stage_config.get("default")

    next_stage = resolve_next_stage(
        decision["next_stage"],
        system_state
    )

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

    if current_stage == 4:
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
def start_game():
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
        "is_game_over": new_session.is_game_over,
    }