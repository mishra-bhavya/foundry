career_config = {
    "id": "hackathon",

    "skills": {
        "product_thinking": 0,
        "technical_judgment": 0,
        "leadership": 0,
        "resource_management": 0,
        "execution": 0,
    },

    "system_state": {
        "team_morale": 100,
        "burnout": 0,
        "technical_debt": 0,
        "time_pressure": 0,
        "reputation": 0,
    },

        "stages": {
        1: {
            "title": "Hackathon Kickoff",
            "description": "You and your 3 teammates are 6 hours into a 48-hour hackathon. The theme is AI for campus networking. Half the team wants to build an ambitious AI-matching system. The other half wants a simple but stable MVP that connects students based on interests.",
            "decisions": [
                {
                    "id": 1,
                    "text": "Push for the ambitious AI-matching system.",
                    "impact": {
                        "skills": {"product_thinking": 2, "technical_judgment": 1},
                        "system": {"technical_debt": 2, "team_morale": -5}
                    },
                    "next_stage": 2
                },
                {
                    "id": 2,
                    "text": "Build a simple but stable MVP that actually works.",
                    "impact": {
                        "skills": {"execution": 2, "resource_management": 1},
                        "system": {"technical_debt": -1, "team_morale": 5}
                    },
                    "next_stage": 2
                },
                {
                    "id": 3,
                    "text": "Spend more time debating before deciding.",
                    "impact": {
                        "skills": {"leadership": -1},
                        "system": {"time_pressure": 2, "team_morale": -3}
                    },
                    "next_stage": 2
                }
            ]
        },

        2: {
            "title": "Midnight Reality Check",
            "description": "It’s 2 AM. Bugs are appearing. Energy levels are dropping. The ambitious features are harder than expected.",
            "decisions": [
                {
                    "id": 4,
                    "text": "Refactor core logic to reduce technical debt.",
                    "impact": {
                        "skills": {"technical_judgment": 2},
                        "system": {"technical_debt": -2, "time_pressure": 1}
                    },
                    "next_stage": 3
                },
                {
                    "id": 5,
                    "text": "Ignore the mess and keep building features.",
                    "impact": {
                        "skills": {"execution": 2},
                        "system": {"technical_debt": 2, "burnout": 2}
                    },
                    "next_stage": 3
                },
                {
                    "id": 6,
                    "text": "Let the team rest for a few hours.",
                    "impact": {
                        "skills": {"leadership": 2},
                        "system": {"burnout": -2, "team_morale": 5, "time_pressure": 2}
                    },
                    "next_stage": 3
                }
            ]
        },

        3: {
            "title": "Demo Preparation",
            "description": "Final hours. Judges arrive soon. You must choose what to polish.",
            "decisions": [
                {
                    "id": 7,
                    "text": "Polish UI and storytelling for judges.",
                    "impact": {
                        "skills": {"product_thinking": 1, "leadership": 1},
                        "system": {"reputation": 5}
                    },
                    "next_stage": 4
                },
                {
                    "id": 8,
                    "text": "Focus purely on backend stability.",
                    "impact": {
                        "skills": {"technical_judgment": 2},
                        "system": {"technical_debt": -1}
                    },
                    "next_stage": 4
                },
                {
                    "id": 9,
                    "text": "Try to add one last risky feature.",
                    "impact": {
                        "skills": {"execution": 2},
                        "system": {"technical_debt": 3, "burnout": 2}
                    },
                    "next_stage": 4
                }
            ]
        },

        4: {
            "title": "Final Presentation",
            "description": "You present to the judges. Your clarity, confidence, and technical depth matter.",
            "decisions": [
                {
                    "id": 10,
                    "text": "Deliver a bold visionary pitch",
                    "impact": {
                        "skills": {
                            "product_thinking": 1,
                            "leadership": 1
                        },
                        "system": {
                            "reputation": 2
                        }
                    },
                    "next_stage": None
                },
                {
                    "id": 11,
                    "text": "Focus on technical depth",
                    "impact": {
                        "skills": {
                            "technical_judgment": 2
                        },
                        "system": {
                            "reputation": 1,
                            "burnout": 1
                        }
                    },
                    "next_stage": None
                }
            ]
        }
    }
}