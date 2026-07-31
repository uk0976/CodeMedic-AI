import logging
import time
from typing import TypeVar

from openai import APIError, APITimeoutError, OpenAI, RateLimitError
from pydantic import BaseModel

from app.core.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

T = TypeVar("T", bound=BaseModel)


class OpenAIService:
    def __init__(self) -> None:
        self.api_key = (
            settings.openai_api_key.get_secret_value() if settings.openai_api_key else None
        )
        self._client: OpenAI | None = None

    @property
    def client(self) -> OpenAI:
        if not self._client:
            if not self.api_key:
                raise ValueError("OPENAI_API_KEY environment variable is not configured.")
            self._client = OpenAI(api_key=self.api_key)
        return self._client

    def generate_structured_output(
        self,
        system_prompt: str,
        user_prompt: str,
        response_format: type[T],
        model: str = "gpt-4o-mini",
        max_retries: int = 3,
        initial_delay: float = 1.0,
        timeout: float = 30.0,
    ) -> T:
        """
        Calls OpenAI Chat Completions API with structured outputs matching a Pydantic model.
        Includes exponential backoff retries for robust handling.
        """
        delay = initial_delay

        for attempt in range(max_retries):
            try:
                logger.info(f"Calling OpenAI (Model: {model}), Attempt {attempt + 1}/{max_retries}")

                # Using the standard SDK client's parsing helper
                response = self.client.beta.chat.completions.parse(
                    model=model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt},
                    ],
                    response_format=response_format,
                    timeout=timeout,
                )

                # Track and log token usage
                if response.usage:
                    logger.info(
                        f"OpenAI Call Tokens - Prompt: {response.usage.prompt_tokens}, "
                        f"Completion: {response.usage.completion_tokens}, "
                        f"Total: {response.usage.total_tokens}"
                    )

                # Check parsed response
                parsed_object = response.choices[0].message.parsed
                if parsed_object is None:
                    raise ValueError("Failed to parse structured JSON from OpenAI")

                return parsed_object

            except RateLimitError as e:
                logger.warning(f"OpenAI Rate limit exceeded: {e}. Retrying in {delay}s...")
                if attempt == max_retries - 1:
                    raise e
                time.sleep(delay)
                delay *= 2

            except APITimeoutError as e:
                logger.warning(f"OpenAI Request timeout: {e}. Retrying in {delay}s...")
                if attempt == max_retries - 1:
                    raise e
                time.sleep(delay)
                delay *= 2

            except APIError as e:
                logger.error(f"OpenAI API error encountered: {e}")
                if attempt == max_retries - 1:
                    raise e
                time.sleep(delay)
                delay *= 2

            except Exception as e:
                logger.error(f"Unexpected error calling OpenAI service: {e}")
                raise e

        raise ValueError("Failed to generate code analysis within retries limit.")
