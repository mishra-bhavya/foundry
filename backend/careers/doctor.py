# careers/doctor.py

skills_schema = [
    "diagnosis",
    "bedside_manner",
    "speed",
    "medical_knowledge",
    "decision_making"
]

system_schema = [
    "fatigue",
    "hospital_pressure",
    "patient_trust",
    "reputation",
    "legal_risk"
]

career_config = {
    "id": "doctor",

    "skills_schema": skills_schema,
    "system_schema": system_schema,

    "skills": {
        "diagnosis": 0,
        "bedside_manner": 0,
        "speed": 0,
        "medical_knowledge": 0,
        "decision_making": 0
    },

    "system_state": {
        "fatigue": 0,
        "hospital_pressure": 0,
        "patient_trust": 50,
        "reputation": 50,
        "legal_risk": 0
    },

    "stages": {
        1: {
            "title": "Emergency Room Chaos",
            "description": "Multiple patients arrive at once. You must prioritize.",
            "decisions": [
                {
                    "id": 1,
                    "text": "Treat the most critical case first",
                    "impact": {
                        "skills": {
                            "decision_making": 1,
                            "diagnosis": 1
                        },
                        "system": {
                            "hospital_pressure": 1,
                            "fatigue": 1
                        }
                    },
                    "next_stage": 2
                },
                {
                    "id": 2,
                    "text": "Stabilize multiple minor cases quickly",
                    "impact": {
                        "skills": {
                            "speed": 2
                        },
                        "system": {
                            "patient_trust": -5,
                            "hospital_pressure": -1
                        }
                    },
                    "next_stage": 2
                }
            ]
        },

        2: {
            "title": "Difficult Diagnosis",
            "description": "A patient presents rare symptoms.",
            "decisions": [
                {
                    "id": 3,
                    "text": "Order extensive tests",
                    "impact": {
                        "skills": {
                            "medical_knowledge": 1
                        },
                        "system": {
                            "hospital_pressure": 2,
                            "fatigue": 1
                        }
                    },
                    "next_stage": 3
                },
                {
                    "id": 4,
                    "text": "Trust clinical intuition",
                    "impact": {
                        "skills": {
                            "diagnosis": 2
                        },
                        "system": {
                            "legal_risk": 2
                        }
                    },
                    "next_stage": 3
                }
            ]
        },

        3: {
            "title": "Final Case Outcome",
            "description": "Your patient’s condition evolves rapidly.",
            "decisions": [
                {
                    "id": 5,
                    "text": "Perform risky procedure",
                    "impact": {
                        "skills": {
                            "decision_making": 2
                        },
                        "system": {
                            "legal_risk": 3,
                            "reputation": 5
                        }
                    },
                    "next_stage": None
                },
                {
                    "id": 6,
                    "text": "Refer to specialist",
                    "impact": {
                        "skills": {
                            "bedside_manner": 1
                        },
                        "system": {
                            "reputation": -2,
                            "legal_risk": -1
                        }
                    },
                    "next_stage": None
                }
            ]
        }
    }
}