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

        "lawyer": [
            "A client demands results faster than expected.",
            "Opposing counsel introduces a surprise argument.",
            "A key witness suddenly changes their testimony.",
            "The judge questions your legal interpretation.",
            "New evidence appears late in the case.",
            "A rival firm attempts to undermine your strategy.",
            "A client pressures you to settle prematurely.",
            "A regulatory authority requests clarification.",
            "A journalist begins covering the case publicly.",
            "A partner questions your courtroom strategy.",
            "A surprise document appears during discovery.",
            "A negotiation with opposing counsel becomes hostile.",
            "A corporate client demands aggressive tactics.",
            "A junior associate mishandles a critical filing.",
            "A confidential memo leaks unexpectedly.",
            "A last-minute legal precedent threatens your argument.",
            "A witness becomes unavailable before trial.",
            "A client reveals information that weakens your case.",
            "A regulatory change complicates your strategy.",
            "A judge imposes strict time limits on arguments."
        ],

        "doctor": [
            "A patient arrives with unusual symptoms.",
            "A critical patient suddenly deteriorates.",
            "A colleague questions your diagnosis.",
            "You must act quickly during an emergency procedure.",
            "A worried family demands immediate answers.",
            "Hospital administration pressures you to move faster.",
            "A rare disease is suspected but tests are inconclusive.",
            "A patient refuses a life-saving treatment.",
            "A surgical complication appears unexpectedly.",
            "A medical intern makes a documentation mistake.",
            "A treatment causes an unexpected reaction.",
            "A shortage of hospital resources complicates care.",
            "A patient's condition worsens overnight.",
            "A nurse alerts you to a concerning lab result.",
            "A miscommunication delays an important treatment.",
            "A patient arrives with multiple conflicting symptoms.",
            "A critical decision must be made during surgery.",
            "A family disputes your treatment plan.",
            "A diagnostic machine fails during examination.",
            "A patient reacts badly to a routine procedure."
        ],

        "hackathon": [
            "Your team disagrees on the product direction.",
            "A major bug appears shortly before submission.",
            "Your teammate suggests a risky new feature.",
            "Judges announce a surprise evaluation criterion.",
            "Your demo crashes minutes before presentation.",
            "Time is running out and the prototype is incomplete.",
            "A teammate disappears during a critical phase.",
            "A key API suddenly stops working.",
            "A judge asks an unexpected technical question.",
            "A competitor presents a very similar idea.",
            "The team debates pivoting the concept.",
            "A last-minute feature breaks the build.",
            "A teammate accidentally deletes a critical file.",
            "A server outage disrupts your development environment.",
            "A judge asks about scalability concerns.",
            "A teammate proposes rewriting a core feature.",
            "A critical library update breaks your code.",
            "A surprise requirement forces a redesign.",
            "A teammate suggests cutting features for stability.",
            "A demo environment fails just before presentation."
        ]
    }

    scenarios = scenario_bank.get(career_id, ["Unexpected situation arises."])

    scenario = random.choice(scenarios)

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