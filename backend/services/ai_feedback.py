import os
from openai import OpenAI

# Feature toggle to prevent accidental API spending
ENABLE_AI_FEEDBACK = os.getenv("ENABLE_AI_FEEDBACK", "false").lower() == "true"


def generate_ai_feedback(data: dict):

    # Safety switch — prevents API calls during development
    if not ENABLE_AI_FEEDBACK:
        return None

    # Create client ONLY when needed
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "You are a career coach analyzing a player's behavior in a career simulation."
            },
            {
                "role": "user",
                "content": "Test call"
            }
        ],
        max_tokens=50
    )

    return response.choices[0].message.content