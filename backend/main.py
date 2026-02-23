from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----- Skill Metrics Template -----
initial_skills = {
    "product_thinking": 0,
    "technical_judgment": 0,
    "leadership": 0,
    "resource_management": 0,
    "execution": 0
}

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
            }
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
            }
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
            }
        }
    ]
}

stage_2 = {
    "id": 2,
    "title": "Internal Friction",
    "description": "After committing to your approach, tensions rise within the team. One teammate feels ignored. Another thinks you're playing too safe. Productivity starts slipping.",
    "decisions": [
        {
            "id": "A",
            "text": "Double down on your leadership style.",
            "impact": {
                "product_thinking": 1,
                "technical_judgment": -1,
                "leadership": 2,
                "resource_management": -1,
                "execution": 1
            }
        },
        {
            "id": "B",
            "text": "Call a team retrospective to realign.",
            "impact": {
                "product_thinking": 1,
                "technical_judgment": 0,
                "leadership": 1,
                "resource_management": 2,
                "execution": -1
            }
        },
        {
            "id": "C",
            "text": "Ignore the conflict and focus on building.",
            "impact": {
                "product_thinking": 0,
                "technical_judgment": 2,
                "leadership": -2,
                "resource_management": -1,
                "execution": 2
            }
        }
    ]
}


@app.get("/")
def root():
    return {"message": "Foundry backend running"}


@app.get("/stage/1")
def get_stage_1():
    return stage_1

@app.get("/stage/2")
def get_stage_2():
    return stage_2