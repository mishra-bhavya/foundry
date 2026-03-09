# backend/services/ai_engine.py

def generate_stage(career_id, skill_state, system_state, stage_number):
    """
    Generate a placeholder stage that respects the career schema.
    """

    skill_keys = list(skill_state.keys())
    system_keys = list(system_state.keys())
    scenarios = [
        "A client demands results faster than expected.",
        "Opposing counsel introduces a surprise argument.",
        "Your team disagrees on the best legal strategy.",
        "A key witness changes their testimony.",
        "The judge challenges your interpretation of the law.",
        "New evidence appears late in the case.",
        "Your client pressures you to take a risky approach."
    ]

    scenario = scenarios[stage_number % len(scenarios)]
    skill_key = skill_keys[stage_number % len(skill_keys)]
    system_key = system_keys[stage_number % len(system_keys)]

    return {
        "title": f"{career_id.capitalize()} Challenge {stage_number}",
        "description": scenario,
        "decisions": [
            {
                "id": 1,
                "text": "Play it safe and proceed cautiously",
                "impact": {
                    "skills": {skill_key: 1},
                    "system": {system_key: -1}
                },
                "next_stage": None
            },
            {
                "id": 2,
                "text": "Take a balanced and calculated approach",
                "impact": {
                    "skills": {skill_key: 2},
                    "system": {system_key: 0}
                },
                "next_stage": None
            },
            {
                "id": 3,
                "text": "Make a bold and risky move",
                "impact": {
                    "skills": {skill_key: 3},
                    "system": {system_key: 2}
                },
                "risk_factor": 1.4,
                "next_stage": None
            }
        ]
    }