import logging
import os

from app.core.config import get_settings
from app.services.providers.base import BaseAIProvider
from app.services.providers.gemini_provider import GeminiProvider
from app.services.providers.local_provider import LocalFallbackProvider
from app.services.providers.openai_provider import OpenAIProvider

logger = logging.getLogger(__name__)
settings = get_settings()


def get_ai_provider() -> BaseAIProvider:
    """
    Factory function to select active AI Provider based on configuration:
    1. Explicit AI_PROVIDER env var ('openai', 'gemini', 'groq', 'local')
    2. Auto-detection based on present API keys
    3. Fallback to LocalFallbackProvider for zero-friction standalone operations.
    """
    provider_type = os.getenv("AI_PROVIDER", "").lower()

    if provider_type == "openai" or (not provider_type and settings.openai_api_key):
        try:
            logger.info("Initializing OpenAIProvider...")
            return OpenAIProvider()
        except Exception as e:
            logger.warning(f"Failed to initialize OpenAIProvider ({e}). Falling back.")

    if provider_type == "gemini" or os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY"):
        try:
            logger.info("Initializing GeminiProvider...")
            return GeminiProvider()
        except Exception as e:
            logger.warning(f"Failed to initialize GeminiProvider ({e}). Falling back.")

    logger.info("Using LocalFallbackProvider for real-time code diagnostics.")
    return LocalFallbackProvider()
