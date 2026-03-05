# backend/services/ai_engine.py

def generate_stage(career_id, skill_state, system_state, stage_number):
    """
    Placeholder AI stage generator.
    Later this will call an LLM.
    """

    return {
        "title": f"{career_id.capitalize()} Challenge {stage_number}",
        "description": "An unexpected situation appears. How do you respond?",
        "decisions": [
            {
                "id": 1,
                "text": "Take the safe and cautious approach",
                "impact": {"execution": 1},
                "next_stage": stage_number + 1
            },
            {
                "id": 2,
                "text": "Take a bold high-risk move",
                "impact": {"execution": 3},
                "risk_factor": 1.5,
                "next_stage": stage_number + 1
            }
        ]
    }