import random

def generate_event(career_id):

    if career_id == "lawyer":
        events = [
            {
                "title": "Media Attention",
                "description": "Your case suddenly attracts media coverage.",
                "decisions": [
                    {
                        "id": 1,
                        "text": "Avoid reporters",
                        "impact": {"skills": {}, "system": {"reputation": -2, "stress": -1}}
                    },
                    {
                        "id": 2,
                        "text": "Give a careful statement",
                        "impact": {"skills": {"argumentation": 1}, "system": {"reputation": 2, "stress": 1}}
                    },
                    {
                        "id": 3,
                        "text": "Lean into publicity",
                        "impact": {"skills": {"argumentation": 2}, "system": {"reputation": 4, "stress": 3}}
                    }
                ]
            }
        ]

    elif career_id == "hackathon":
        events = [
            {
                "title": "Critical Bug",
                "description": "A major bug appears hours before submission.",
                "decisions": [
                    {
                        "id": 1,
                        "text": "Patch quickly",
                        "impact": {"skills": {"execution": 1}, "system": {"technical_debt": 2}}
                    },
                    {
                        "id": 2,
                        "text": "Refactor properly",
                        "impact": {"skills": {"execution": 2}, "system": {"time_pressure": 2}}
                    },
                    {
                        "id": 3,
                        "text": "Ignore and focus on demo",
                        "impact": {"skills": {"presentation": 1}, "system": {"technical_debt": 3}}
                    }
                ]
            }
        ]

    elif career_id == "doctor":
        events = [
            {
                "title": "Emergency Case",
                "description": "A critical patient arrives unexpectedly.",
                "decisions": [
                    {
                        "id": 1,
                        "text": "Take charge immediately",
                        "impact": {"skills": {"diagnosis": 2}, "system": {"stress": 2}}
                    },
                    {
                        "id": 2,
                        "text": "Call senior doctor",
                        "impact": {"skills": {"ethics": 1}, "system": {"reputation": 1}}
                    },
                    {
                        "id": 3,
                        "text": "Follow strict protocol",
                        "impact": {"skills": {"research": 1}, "system": {"time_pressure": 2}}
                    }
                ]
            }
        ]

    else:
        events = []

    return random.choice(events) if events else None