import random
from .constants import SIM_CONSTANTS
from .utils import clamp_all


def apply_decision(skill_state, system_state, impact, difficulty=1.0, risk_factor=1.0):
    # Apply skill changes
    for skill, value in impact.get("skills", {}).items():
        base_value = skill_state.get(skill, 0)

        skill_modifier = 1 + (base_value * 0.05)

        burnout = system_state.get("burnout", 0)
        burnout_penalty = max(0.5, 1 - burnout * 0.03)

        adjusted = value * difficulty * skill_modifier * burnout_penalty

        skill_state[skill] = base_value + adjusted

    # Apply system changes
    for system_key, value in impact.get("system", {}).items():

        base_value = system_state.get(system_key, 0)

        tech_debt = system_state.get("technical_debt", 0)
        debt_penalty = 1 + tech_debt * 0.1

        adjusted = value * difficulty * risk_factor * debt_penalty

        system_state[system_key] = base_value + adjusted

    return skill_state, system_state