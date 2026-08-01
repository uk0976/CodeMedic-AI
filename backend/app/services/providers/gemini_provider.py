import json
import logging
import re
from typing import TypeVar
from pydantic import BaseModel

import google.generativeai as genai
from app.core.config import get_settings
from app.services.providers.base import BaseAIProvider

logger = logging.getLogger(__name__)
settings = get_settings()

T = TypeVar("T", bound=BaseModel)

class GeminiProvider(BaseAIProvider):
    def __init__(self, api_key: str | None = None) -> None:
        key = api_key or (settings.groq_api_key.get_secret_value() if settings.groq_api_key else None)
        # Check environment variable for GEMINI_API_KEY if present
        import os
        key = key or os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
        if not key:
            raise ValueError("GEMINI_API_KEY / GOOGLE_API_KEY is not configured.")
        genai.configure(api_key=key)
        self.model = genai.GenerativeModel("gemini-1.5-flash")

    def generate_structured_output(
        self,
        system_prompt: str,
        user_prompt: str,
        response_format: type[T],
        timeout: float = 30.0,
    ) -> T:
        logger.info("Calling GeminiProvider for code analysis...")
        prompt = f"{system_prompt}\n\n{user_prompt}\n\nRespond ONLY with raw valid JSON matching the requested schema."
        response = self.model.generate_content(prompt)
        text = response.text.strip()
        
        # Clean JSON markdown fences
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()

        # Parse with Pydantic
        data = json.loads(text)
        return response_format.model_validate(data)
