# backend/services/ai_engine.py

def generate_stage(career_id, skill_state, system_state, stage_number):
    """
    Generate a placeholder stage that respects the career schema.
    """

    skill_keys = list(skill_state.keys())
    system_keys = list(system_state.keys())

    skill_key = skill_keys[stage_number % len(skill_keys)]
    system_key = system_keys[stage_number % len(system_keys)]

    return {
        "title": f"{career_id.capitalize()} Challenge {stage_number}",
        "description": "An unexpected situation appears. How do you respond?",
        "decisions": [
            {
                "id": 1,
                "text": "Take a cautious approach",
                "impact": {
                    "skills": {skill_key: 1},
                    "system": {system_key: 1}
                },
                "next_stage": stage_number + 1
            },
            {
                "id": 2,
                "text": "Take a bold risky move",
                "impact": {
                    "skills": {skill_key: 2},
                    "system": {system_key: 2}
                },
                "risk_factor": 1.4,
                "next_stage": stage_number + 1
            }
        ]
    }