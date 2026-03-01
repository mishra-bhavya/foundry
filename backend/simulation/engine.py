import random
from .constants import SIM_CONSTANTS
from .utils import clamp_all


def apply_decision(skill_state, system_state, impact, difficulty=1.0, risk_factor=1.0):
    # Apply skill changes
    for skill, value in impact.get("skills", {}).items():
        base_value = skill_state.get(skill, 0)
        adjusted = value * difficulty
        skill_state[skill] = base_value + adjusted

    # Apply system changes
    for system_key, value in impact.get("system", {}).items():
        base_value = system_state.get(system_key, 0)
        adjusted = value * difficulty * risk_factor
        system_state[system_key] = base_value + adjusted

    return skill_state, system_state