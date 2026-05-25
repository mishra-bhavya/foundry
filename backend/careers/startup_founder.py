skills_schema = [
    "product_thinking",
    "technical_judgment",
    "leadership",
    "resource_management",
    "execution"
]

system_schema = [
    "technical_debt",
    "burnout",
    "team_morale",
    "reputation",
    "time_pressure"
]

career_config = {
    "id": "startup_founder",
    "name": "Startup Founder",
    "description": "Build and scale a startup while balancing product vision, team dynamics, investor pressure, and technical execution.",

    "skills_schema": skills_schema,
    "system_schema": system_schema,

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
            "title": "Founder Disagreement",
            "description": "Your startup team is preparing the first public version of your product. One side wants to pursue an ambitious AI-driven networking platform with investor appeal. The other side argues for a smaller, stable MVP that users can trust immediately.",
            "decisions": [
                {
                    "id": 1,
                    "text": "Push for the ambitious AI-driven platform vision.",
                    "impact": {
                        "skills": {"product_thinking": 2, "technical_judgment": 1},
                        "system": {"technical_debt": 2, "team_morale": -5}
                    },
                    "next_stage": 2
                },
                {
                    "id": 2,
                    "text": "Prioritize a lean MVP that can reliably retain early users.",
                    "impact": {
                        "skills": {"execution": 2, "resource_management": 1},
                        "system": {"technical_debt": -1, "team_morale": 5}
                    },
                    "next_stage": 2
                },
                {
                    "id": 3,
                    "text": "Delay the decision and continue debating product direction.",
                    "impact": {
                        "skills": {"leadership": -1},
                        "system": {"time_pressure": 2, "team_morale": -3}
                    },
                    "next_stage": 2
                }
            ]
        },

        2: {
            "title": "Scaling Problems",
            "description": "Your startup gains unexpected traction after launch. New users are flooding in, bugs are surfacing, and the team is struggling to balance growth with stability.",
            "decisions": [
                {
                    "id": 4,
                    "text": "Pause feature development to stabilize the platform.",
                    "impact": {
                        "skills": {"technical_judgment": 2},
                        "system": {"technical_debt": -2, "time_pressure": 1}
                    },
                    "next_stage": 3
                },
                {
                    "id": 5,
                    "text": "Keep shipping aggressively to maintain momentum.",
                    "impact": {
                        "skills": {"execution": 2},
                        "system": {"technical_debt": 2, "burnout": 2}
                    },
                    "next_stage": 3
                },
                {
                    "id": 6,
                    "text": "Reduce workload temporarily to prevent burnout.",
                    "impact": {
                        "skills": {"leadership": 2},
                        "system": {"burnout": -2, "team_morale": 5, "time_pressure": 2}
                    },
                    "next_stage": 3
                }
            ]
        },

        3: {
            "title": "Investor Attention",
            "description": "Your startup is attracting early investor interest. With limited time and resources, you must decide what deserves immediate attention before an important product showcase.",
            "decisions": [
                {
                    "id": 7,
                    "text": "Refine the product experience and public narrative.",
                    "impact": {
                        "skills": {"product_thinking": 1, "leadership": 1},
                        "system": {"reputation": 5}
                    },
                    "next_stage": 4
                },
                {
                    "id": 8,
                    "text": "Focus entirely on infrastructure and reliability.",
                    "impact": {
                        "skills": {"technical_judgment": 2},
                        "system": {"technical_debt": -1}
                    },
                    "next_stage": 4
                },
                {
                    "id": 9,
                    "text": "Rush a high-risk feature launch before the showcase.",
                    "impact": {
                        "skills": {"execution": 2},
                        "system": {"technical_debt": 3, "burnout": 2}
                    },
                    "next_stage": 4
                }
            ]
        },

        4: {
            "title": "Critical Pitch",
            "description": "Your startup has reached a pivotal moment. Investors, partners, and early adopters are watching closely as you present the future of the company.",
            "decisions": [
                {
                    "id": 10,
                    "text": "Deliver an ambitious long-term vision for the company",
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
                    "text": "Demonstrate technical reliability and execution discipline",
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