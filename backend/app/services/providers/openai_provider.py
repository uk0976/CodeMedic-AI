import logging
import time
from typing import TypeVar
from openai import APIError, APITimeoutError, OpenAI, RateLimitError
from pydantic import BaseModel

from app.core.config import get_settings
from app.services.providers.base import BaseAIProvider

logger = logging.getLogger(__name__)
settings = get_settings()

T = TypeVar("T", bound=BaseModel)


class OpenAIProvider(BaseAIProvider):
    def __init__(self, api_key: str | None = None) -> None:
        key = api_key or (
            settings.openai_api_key.get_secret_value() if settings.openai_api_key else None
        )
        if not key:
            raise ValueError("OPENAI_API_KEY is not configured.")
        self.client = OpenAI(api_key=key)

    def generate_structured_output(
        self,
        system_prompt: str,
        user_prompt: str,
        response_format: type[T],
        timeout: float = 30.0,
    ) -> T:
        model = "gpt-4o-mini"
        max_retries = 3
        delay = 1.0
        for attempt in range(max_retries):
            try:
                logger.info(f"OpenAIProvider attempt {attempt + 1}/{max_retries} (Model: {model})")
                response = self.client.beta.chat.completions.parse(
                    model=model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt},
                    ],
                    response_format=response_format,
                    timeout=timeout,
                )
                if response.usage:
                    logger.info(f"OpenAI Tokens: {response.usage.total_tokens}")
                parsed = response.choices[0].message.parsed
                if parsed is None:
                    raise ValueError("Failed to parse response from OpenAI.")
                return parsed
            except (RateLimitError, APITimeoutError, APIError) as e:
                logger.warning(f"OpenAIProvider error: {e}. Retrying in {delay}s...")
                if attempt == max_retries - 1:
                    raise e
                time.sleep(delay)
                delay *= 2
            except Exception as e:
                logger.error(f"OpenAIProvider unexpected failure: {e}")
                raise e

        raise ValueError("OpenAIProvider failed after retries.")
