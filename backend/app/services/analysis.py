import logging

from app.schemas.analysis import AnalysisResponseSchema
from app.services.prompt_builder import PromptBuilder
from app.services.providers.factory import get_ai_provider
from app.services.providers.local_provider import LocalFallbackProvider

logger = logging.getLogger(__name__)


class AnalysisService:
    def __init__(self) -> None:
        self.provider = get_ai_provider()

    def run_code_analysis(
        self, code: str, language: str, analysis_types: list[str]
    ) -> AnalysisResponseSchema:
        """
        Coordinates prompt construction and structured AI response parsing.
        """
        logger.info(f"Initiating code analysis for language: {language}, modes: {analysis_types}")

        system_prompt = PromptBuilder.build_system_prompt(analysis_types)
        user_prompt = PromptBuilder.build_user_prompt(code, language)

        try:
            result = self.provider.generate_structured_output(
                system_prompt=system_prompt,
                user_prompt=user_prompt,
                response_format=AnalysisResponseSchema,
            )
            logger.info("Code analysis executed and parsed successfully.")
            return result
        except Exception as e:
            logger.warning(f"AI Provider execution failed ({e}). Executing local fallback engine.")
            local_engine = LocalFallbackProvider()
            return local_engine.analyze(code, language)
