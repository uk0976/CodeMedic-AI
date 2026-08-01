import asyncio
import json
import logging
from collections.abc import AsyncIterator

from fastapi import APIRouter, HTTPException
from fastapi.concurrency import run_in_threadpool
from fastapi.responses import StreamingResponse

from app.schemas.analysis import AnalysisRequestSchema
from app.services.analysis import AnalysisService
from app.services.providers.local_provider import LocalFallbackProvider

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/analysis", tags=["Code Analysis"])


async def analysis_stream_generator(
    code: str, language: str, analysis_types: list[str]
) -> AsyncIterator[str]:
    """
    Yields progress indicators as SSE messages, executes OpenAI analysis in a threadpool,
    and yields the structured output JSON object or errors.
    """
    progress_steps = [
        "Analyzing...",
        "Reviewing...",
        "Checking Security...",
        "Generating Fixes...",
        "Generating Tests...",
        "Finalizing Report...",
    ]

    # Stream progress messages
    for step in progress_steps:
        yield f"data: {json.dumps({'status': step})}\n\n"
        await asyncio.sleep(0.1)  # Keep user updated with transition steps

    try:
        # Run analysis service
        analysis_service = AnalysisService()
        result = await run_in_threadpool(
            analysis_service.run_code_analysis, code, language, analysis_types
        )

        yield f"data: {json.dumps({'result': result.model_dump()})}\n\n"

    except Exception as e:
        logger.error(f"Error in streaming analysis: {e}. Executing local fallback engine.")
        fallback = LocalFallbackProvider()
        result = fallback.analyze(code, language)
        yield f"data: {json.dumps({'result': result.model_dump()})}\n\n"


@router.post("/analyze")
async def analyze_code(request: AnalysisRequestSchema) -> StreamingResponse:
    """
    Server-Sent Events endpoint to analyze code structure and retrieve metrics.
    """
    if not request.code.strip():
        raise HTTPException(status_code=400, detail="Code content cannot be empty.")

    return StreamingResponse(
        analysis_stream_generator(request.code, request.language, request.analysis_types),
        media_type="text/event-stream",
    )
