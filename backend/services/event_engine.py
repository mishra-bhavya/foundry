import random

def check_stat_events(career_id, system_state):

    # Hackathon crisis
    if career_id == "hackathon":
        if system_state.get("technical_debt", 0) > 15:
            return {
                "title": "System Crash",
                "description": "Your rushed codebase collapses during testing.",
                "decisions": [
                    {
                        "id": 1,
                        "text": "Quick hotfix",
                        "impact": {
                            "system": {"technical_debt": -3, "burnout": 2}
                        }
                    },
                    {
                        "id": 2,
                        "text": "Refactor properly",
                        "impact": {
                            "system": {"technical_debt": -5, "time_pressure": 2}
                        }
                    }
                ]
            }

    # Doctor crisis
    if career_id == "doctor":
        if system_state.get("fatigue", 0) > 15:
            return {
                "title": "Medical Error Risk",
                "description": "Exhaustion makes it harder to focus during surgery.",
                "decisions": [
                    {
                        "id": 1,
                        "text": "Push through",
                        "impact": {
                            "system": {"reputation": -2, "fatigue": 2}
                        }
                    },
                    {
                        "id": 2,
                        "text": "Call for assistance",
                        "impact": {
                            "system": {"fatigue": -3, "hospital_pressure": 1}
                        }
                    }
                ]
            }

    # Lawyer crisis
    if career_id == "lawyer":
        if system_state.get("stress", 0) > 20:
            return {
                "title": "Courtroom Slip",
                "description": "Stress causes a mistake during a critical argument.",
                "decisions": [
                    {
                        "id": 1,
                        "text": "Recover quickly",
                        "impact": {
                            "system": {"reputation": -1}
                        }
                    },
                    {
                        "id": 2,
                        "text": "Request recess",
                        "impact": {
                            "system": {"stress": -3, "time_pressure": 1}
                        }
                    }
                ]
            }

    return None

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