def clamp(value, min_val, max_val):
    return max(min_val, min(max_val, value))


def clamp_all(skill_state, system_state):
    for key in skill_state:
        skill_state[key] = clamp(skill_state[key], 0, 100)

    system_state["team_morale"] = clamp(system_state["team_morale"], 0, 100)
    system_state["burnout"] = clamp(system_state["burnout"], 0, 10)
    system_state["technical_debt"] = clamp(system_state["technical_debt"], 0, 10)
    system_state["time_pressure"] = clamp(system_state["time_pressure"], 0, 10)
    system_state["reputation"] = clamp(system_state["reputation"], -10, 10)

    return skill_state, system_state