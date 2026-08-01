import logging
import os
from typing import TypeVar

from openai import OpenAI
from pydantic import BaseModel

from app.services.providers.base import BaseAIProvider

logger = logging.getLogger(__name__)

T = TypeVar("T", bound=BaseModel)


class GroqProvider(BaseAIProvider):
    def __init__(self, api_key: str | None = None) -> None:
        key = api_key or os.getenv("GROQ_API_KEY")
        if not key:
            raise ValueError("GROQ_API_KEY is not configured.")
        self.client = OpenAI(
            api_key=key,
            base_url="https://api.groq.com/openai/v1",
        )

    def generate_structured_output(
        self,
        system_prompt: str,
        user_prompt: str,
        response_format: type[T],
        timeout: float = 30.0,
    ) -> T:
        logger.info("Calling GroqProvider (llama-3.3-70b-versatile)...")
        response = self.client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": system_prompt
                    + "\n\nRespond ONLY with a valid JSON object matching the requested schema.",
                },
                {"role": "user", "content": user_prompt},
            ],
            response_format={"type": "json_object"},
            timeout=timeout,
        )
        content = response.choices[0].message.content
        if not content:
            raise ValueError("Failed to parse response from Groq.")
        return response_format.model_validate_json(content)
