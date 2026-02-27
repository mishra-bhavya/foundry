from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from simulation.engine import apply_decision
from simulation.state import initial_skill_state, initial_system_state
from pydantic import BaseModel

class DecisionRequest(BaseModel):
    decision_id: int
    stage_id: int

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
    "description": "After committing to your approach, tensions rise within the team. One teammate feels ignored. Another thinks you're playing too safe. Productivity starts slipping.",
    "decisions": [
        {
            "id": 1,
            "text": "Double down on your leadership style.",
            "impact": {
                "product_thinking": 1,
                "technical_judgment": -1,
                "leadership": 2,
                "resource_management": -1,
                "execution": 1
            },
            "next_stage": 3
        },
        {
            "id": 2,
            "text": "Call a team retrospective to realign.",
            "impact": {
                "product_thinking": 1,
                "technical_judgment": 0,
                "leadership": 1,
                "resource_management": 2,
                "execution": -1
            },
            "next_stage": 3
        },
        {
            "id": 3,
            "text": "Ignore the conflict and focus on building.",
            "impact": {
                "product_thinking": 0,
                "technical_judgment": 2,
                "leadership": -2,
                "resource_management": -1,
                "execution": 2
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
                "technical_debt": 2,
                "burnout": 2,
                "team_morale": -2
            },
            "next_stage": 4,
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
            "next_stage": 4,
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
            "next_stage": 4
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

stages = {
    1: stage_1,
    2: stage_2,
    3: stage_3,
    4: stage_4
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
    next_stage = decision["next_stage"]
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