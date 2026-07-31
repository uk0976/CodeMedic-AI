import logging

from app.schemas.analysis import AnalysisResponseSchema
from app.services.openai import OpenAIService
from app.services.prompt_builder import PromptBuilder

logger = logging.getLogger(__name__)


class AnalysisService:
    def __init__(self) -> None:
        self.openai_service = OpenAIService()

    def run_code_analysis(
        self, code: str, language: str, analysis_types: list[str]
    ) -> AnalysisResponseSchema:
        """
        Coordinates prompts building and OpenAI structured output query parsing.
        """
        logger.info(f"Initiating code analysis for language: {language}, modes: {analysis_types}")

        system_prompt = PromptBuilder.build_system_prompt(analysis_types)
        user_prompt = PromptBuilder.build_user_prompt(code, language)

        # Call openai client
        result = self.openai_service.generate_structured_output(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            response_format=AnalysisResponseSchema,
        )

        logger.info("Code analysis parsed successfully.")
        return result
