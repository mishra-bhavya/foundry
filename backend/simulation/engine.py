import random
from .constants import SIM_CONSTANTS
from .utils import clamp_all


def apply_decision(skill_state, system_state, impact, difficulty=1.0, risk_factor=1.0):

    for key, base_value in impact.items():

        adjusted = base_value * difficulty

        # Diminishing returns
        if key in skill_state:
            current = skill_state[key]
            adjusted *= (1 - current / SIM_CONSTANTS["diminishing_cap"])

        # Burnout penalty
        if (
            key in ["leadership", "execution"]
            and system_state["burnout"] > SIM_CONSTANTS["burnout_threshold"]
        ):
            adjusted *= SIM_CONSTANTS["burnout_penalty"]

        # Technical debt penalty
        if (
            key == "execution"
            and system_state["technical_debt"] > SIM_CONSTANTS["debt_threshold"]
        ):
            adjusted *= SIM_CONSTANTS["debt_execution_penalty"]

        # Low morale penalty
        if (
            key == "leadership"
            and system_state["team_morale"] < SIM_CONSTANTS["morale_low_threshold"]
        ):
            adjusted *= SIM_CONSTANTS["morale_penalty"]

        # Risk variance
        variance = random.uniform(-0.5, 0.5) * risk_factor
        adjusted += adjusted * variance

        # Apply update
        if key in skill_state:
            skill_state[key] += int(adjusted)
        elif key in system_state:
            system_state[key] += int(adjusted)

    # Time pressure increases each stage
    system_state["time_pressure"] += 1

    # Extra burnout if already high
    if system_state["burnout"] > SIM_CONSTANTS["burnout_threshold"]:
        system_state["burnout"] += 1

    skill_state, system_state = clamp_all(skill_state, system_state)

    return skill_state, system_state