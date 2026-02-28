from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from simulation.engine import apply_decision
from simulation.state import initial_skill_state, initial_system_state
from pydantic import BaseModel
from database import SessionLocal
from database import engine
from models import Base
from models import GameSession

Base.metadata.create_all(bind=engine)

class DecisionRequest(BaseModel):
    session_id: int
    decision_id: int

skill_state = initial_skill_state()
system_state = initial_system_state()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

current_stage = 1
stage_completed = False

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

    global skill_state, system_state, current_stage, stage_completed

    if req.stage_id != current_stage:
        return {"error": "Invalid stage progression"}

    if stage_completed:
        return {"error": "Stage already completed"}

    stage = stages[req.stage_id]
    decision = next(d for d in stage["decisions"] if d["id"] == req.decision_id)

    skill_state, system_state = apply_decision(
        skill_state,
        system_state,
        impact=decision["impact"],
        difficulty=1.0,
        risk_factor=decision.get("risk_factor", 1.0)
    )

    stage_completed = True
    def resolve_next_stage(next_stage_config, system_state):
        if isinstance(next_stage_config, int):
            return next_stage_config

        # Conditional branching
        if system_state["team_morale"] < 35 and "if_morale_low" in next_stage_config:
            return next_stage_config["if_morale_low"]

        if system_state["technical_debt"] > 4 and "if_debt_high" in next_stage_config:
            return next_stage_config["if_debt_high"]

        return next_stage_config.get("default")

    next_stage = resolve_next_stage(decision["next_stage"], system_state)
    current_stage = next_stage

    game_over = False
    reason = None

    if system_state["team_morale"] <= 10:
        game_over = True
        reason = "Team collapsed due to low morale."

    if system_state["burnout"] >= 10:
        game_over = True
        reason = "You burned out before finishing."

    if req.stage_id == 4:
        game_over = True
        reason = "Hackathon completed."

    return {
        "skills": skill_state,
        "system": system_state,
        "next_stage": next_stage,
        "game_over": game_over,
        "reason": reason
    }

@app.post("/reset")
def reset_game():
    global skill_state, system_state, current_stage, stage_completed

    skill_state = initial_skill_state()
    system_state = initial_system_state()
    current_stage = 1
    stage_completed = False

    return {"message": "Game reset"}

@app.post("/start")
def start_game():
    db = SessionLocal()

    new_session = GameSession(
        skill_state=initial_skill_state(),
        system_state=initial_system_state(),
        current_stage=1
    )

    db.add(new_session)
    db.commit()
    db.refresh(new_session)

    db.close()

    return {
        "session_id": new_session.id,
        "skills": new_session.skill_state,
        "stage": new_session.current_stage
    }