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