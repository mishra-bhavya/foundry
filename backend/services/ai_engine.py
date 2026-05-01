import random

def generate_stage(career_id, skill_state, system_state, stage_number):

    if stage_number < 10:
        difficulty = 1.0
    elif stage_number < 30:
        difficulty = 1.3
    else:
        difficulty = 1.7

    skill_keys = list(skill_state.keys())
    system_keys = list(system_state.keys())

    decision_text_bank = {
        "safe": [
            "Follow established protocol carefully",
            "Consult colleagues before acting",
            "Delay action until more information is available"
        ],
        "balanced": [
            "Take a balanced and calculated approach",
            "Combine caution with decisive action",
            "Proceed carefully while adapting to the situation"
        ],
        "risky": [
            "Make a bold and risky move",
            "Act quickly and trust your instincts",
            "Take an aggressive approach despite uncertainty"
        ]
    }

    scenario_bank = {

        "doctor": {

            "diagnosis": [
                "A patient arrives with unusual symptoms.",
                "A rare disease is suspected but tests are inconclusive.",
                "Two diagnoses appear equally likely.",
                "Lab results contradict your initial assessment.",
                "A junior doctor proposes a controversial diagnosis."
            ],

            "emergency": [
                "A critical patient suddenly deteriorates.",
                "A surgical complication appears unexpectedly.",
                "A patient collapses in the waiting room.",
                "A trauma case arrives requiring immediate action.",
                "An allergic reaction escalates rapidly."
            ],

            "pressure": [
                "Hospital administration pressures you to discharge patients faster.",
                "A worried family demands immediate answers.",
                "Your department is short-staffed during a busy shift.",
                "A nurse alerts you to a concerning change in a patient’s vitals.",
                "Another doctor challenges your treatment plan."
            ],

            "ethical": [
                "A patient refuses a life-saving treatment.",
                "A family asks you to hide a diagnosis from the patient.",
                "You must decide how much risk to take with an experimental treatment.",
                "A colleague may have made a serious medical mistake.",
                "A patient cannot afford the recommended treatment."
            ]
        },


        "lawyer": {

            "case_conflict": [
                "Opposing counsel introduces a surprise argument.",
                "A key witness suddenly changes testimony.",
                "New evidence appears late in the case.",
                "The judge questions your interpretation of the law.",
                "A procedural mistake threatens your case."
            ],

            "client_pressure": [
                "A client demands results faster than expected.",
                "A corporate client pushes for aggressive tactics.",
                "Your client insists on taking the case to trial.",
                "A high-profile client brings media attention.",
                "A client withholds crucial information."
            ],

            "legal_strategy": [
                "A risky legal precedent could strengthen your case.",
                "A senior partner questions your courtroom strategy.",
                "Opposing counsel offers an unexpected settlement.",
                "You uncover a loophole that could change the case.",
                "The judge demands a new legal argument."
            ],

            "ethics": [
                "A client asks you to bend the truth slightly.",
                "You discover evidence that could harm your client.",
                "A junior associate makes an ethical mistake.",
                "You must choose between loyalty and legal ethics.",
                "A powerful client pressures you to ignore regulations."
            ]
        },


        "hackathon": {

            "team_conflict": [
                "Your team disagrees on the product direction.",
                "A teammate refuses to work on the backend.",
                "Two teammates argue over design choices.",
                "Your most skilled developer suddenly disappears.",
                "A teammate wants to pivot the entire project."
            ],

            "technical_crisis": [
                "A major bug appears shortly before submission.",
                "Your demo crashes minutes before presentation.",
                "A key API stops working unexpectedly.",
                "Your database becomes corrupted.",
                "Your prototype suddenly stops compiling."
            ],

            "time_pressure": [
                "Judges announce a surprise evaluation criterion.",
                "You realize you underestimated the project scope.",
                "Only a few hours remain and features are incomplete.",
                "Your team must choose between polish or features.",
                "Time is running out and the prototype is unstable."
            ],

            "strategy": [
                "A teammate suggests a risky new feature.",
                "You consider pivoting the product idea entirely.",
                "A mentor suggests simplifying your project.",
                "Another team shows a very similar idea.",
                "You must choose between innovation or reliability."
            ]
        }
    }

    career_scenarios = scenario_bank.get(career_id, {})

    category = random.choice(list(career_scenarios.keys()))

    scenario = random.choice(career_scenarios[category])

    skill_key = skill_keys[stage_number % len(skill_keys)]
    system_key = system_keys[stage_number % len(system_keys)]

    safe_text = random.choice(decision_text_bank["safe"])
    balanced_text = random.choice(decision_text_bank["balanced"])
    risky_text = random.choice(decision_text_bank["risky"])

    return {
        "title": f"{career_id.capitalize()} Scenario",
        "description": scenario,
        "decisions": [
            {
                "id": 1,
                "text": safe_text,
                "impact": {
                    "skills": {skill_key: 1},
                    "system": {system_key: int(-1*difficulty)}
                },
                "next_stage": None
            },
            {
                "id": 2,
                "text": balanced_text,
                "impact": {
                    "skills": {skill_key: 2},
                    "system": {system_key: int(0*difficulty)}
                },
                "next_stage": None
            },
            {
                "id": 3,
                "text": risky_text,
                "impact": {
                    "skills": {skill_key: 3},
                    "system": {system_key: int(2*difficulty)}
                },
                "risk_factor": 1.4,
                "next_stage": None
            }
        ]
    }