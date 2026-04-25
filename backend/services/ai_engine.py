import random

def generate_stage(career_id, skill_state, system_state, stage_number):

    skill_keys = list(skill_state.keys())
    system_keys = list(system_state.keys())

    scenario_bank = {

        "lawyer": [
            "A client demands results faster than expected.",
            "Opposing counsel introduces a surprise argument.",
            "A key witness changes their testimony.",
            "The judge challenges your interpretation of the law.",
            "New evidence appears late in the case.",
            "Your client pressures you to take a risky legal approach."
        ],

        "doctor": [
            "A patient arrives with unusual symptoms.",
            "A critical patient suddenly deteriorates.",
            "A colleague questions your diagnosis.",
            "You must decide quickly during an emergency procedure.",
            "A worried family demands immediate answers.",
            "Hospital administration pressures you to move faster."
        ],

        "hackathon": [
            "Your team disagrees on the product direction.",
            "A major bug appears shortly before submission.",
            "Your teammate suggests a risky new feature.",
            "Judges announce a surprise evaluation criterion.",
            "Your demo crashes minutes before presentation.",
            "Time is running out and the prototype is incomplete."
        ]
    }

    scenarios = scenario_bank.get(career_id, ["Unexpected situation arises."])

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