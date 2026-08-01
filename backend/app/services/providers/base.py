from abc import ABC, abstractmethod
from typing import TypeVar
from pydantic import BaseModel

T = TypeVar("T", bound=BaseModel)

class BaseAIProvider(ABC):
    @abstractmethod
    def generate_structured_output(
        self,
        system_prompt: str,
        user_prompt: str,
        response_format: type[T],
        timeout: float = 30.0,
    ) -> T:
        """Generates structured Pydantic response from LLM or local provider."""
        pass
