import os
from openai import OpenAI

# Feature toggle to prevent accidental API spending
ENABLE_AI_FEEDBACK = os.getenv("ENABLE_AI_FEEDBACK", "false").lower() == "true"


def generate_ai_feedback(data: dict):

    if not ENABLE_AI_FEEDBACK:
        return None

    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    history = "\n".join(
        f"Stage {d['stage']}: {d['decision_text']}"
        for d in data.get("decision_history", [])
    )

    prompt = f"""
You are a career coach analyzing a player's behavior in a career simulation.

Career: {data["career_id"]}

Dominant Skill: {data["summary"]["dominant_skill"]}
Weakest Skill: {data["summary"]["weakest_skill"]}
Performance Score: {data["summary"]["performance_score"]}

Final Skills:
{data["skills"]}

System Pressures:
{data["system"]}

Decision Timeline:
{history}

Provide feedback in JSON format:

{{
"analysis": "...",
"strengths": ["...", "..."],
"weaknesses": ["...", "..."],
"behavior_style": "...",
"career_advice": "..."
}}
"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        temperature=0.4,
        max_tokens=300,
        messages=[
            {"role": "system", "content": "You analyze player behavior."},
            {"role": "user", "content": prompt}
        ]
    )

    import json

    content = response.choices[0].message.content

    # remove markdown code fences if present
    content = content.replace("```json", "").replace("```", "").strip()

    try:
        return json.loads(content)
    except json.JSONDecodeError:
        return {"analysis": content}

def generate_career_ending(career_id, dominant_skill, weakest_skill, ending_type):

    career = career_id.capitalize()
    strong = dominant_skill.replace("_", " ")
    weak = weakest_skill.replace("_", " ")

    if ending_type == "completed":
        return (
            f"After navigating many challenges as a {career}, your journey concludes "
            f"with valuable experience. Your strongest ability was {strong}, which helped "
            f"you handle critical situations effectively. However, improving {weak} could "
            f"further strengthen your long-term success in this field."
        )

    if ending_type == "burnout":
        return (
            f"Your career as a {career} pushed you to your limits. While your strength in "
            f"{strong} allowed you to perform under pressure, neglecting {weak} created "
            f"unsustainable strain that eventually led to burnout."
        )

    if ending_type == "malpractice":
        return (
            f"Your journey as a {career} took a difficult turn after a serious mistake. "
            f"Although you demonstrated strong {strong}, improving {weak} may have helped "
            f"prevent the circumstances that led to this outcome."
        )

    if ending_type == "team_collapse":
        return (
            f"Despite moments of strong {strong}, your experience as a {career} was cut "
            f"short when team dynamics deteriorated. Developing stronger {weak} could "
            f"help maintain stability in high-pressure environments."
        )

    return (
        f"Your path as a {career} ended earlier than expected. Your strength in {strong} "
        f"was clear, but developing {weak} could significantly improve future outcomes."
    )