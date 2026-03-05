skills_schema = [
    "argumentation",
    "research",
    "negotiation",
    "ethics",
    "execution"
]

system_schema = [
    "reputation",
    "stress",
    "client_trust",
    "fatigue",
    "time_pressure"
]

career_config = {
    "id": "lawyer",
    "name": "Lawyer",
    "description": "Navigate legal strategy, research, negotiation, and courtroom pressure.",

    "skills_schema": skills_schema,
    "system_schema": system_schema,

    "skills": {
        "argumentation": 0,
        "research": 0,
        "negotiation": 0,
        "ethics": 0,
        "execution": 0,
    },

    "system_state": {
        "reputation": 50,
        "stress": 0,
        "client_trust": 50,
        "fatigue": 0,
        "time_pressure": 0,
    },

    "stages": {
        1: {
            "title": "First Case",
            "description": "You receive your first legal case.",
            "decisions": [
                {
                    "id": 1,
                    "text": "Prepare aggressively",
                    "impact": {
                        "skills": {"research": 1},
                        "system": {"stress": 1}
                    },
                    "next_stage": 2
                }
            ]
        }
    }
}