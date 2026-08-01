import asyncio
import json
import logging
from collections.abc import AsyncIterator

from fastapi import APIRouter, HTTPException
from fastapi.concurrency import run_in_threadpool
from fastapi.responses import StreamingResponse

from app.schemas.analysis import AnalysisRequestSchema, AnalysisResponseSchema
from app.services.analysis import AnalysisService
from app.services.providers.local_provider import LocalFallbackProvider

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/analysis", tags=["Code Analysis"])


async def analysis_stream_generator(
    code: str, language: str, analysis_types: list[str]
) -> AsyncIterator[str]:
    """
    Yields initial progress indicators and continuous heartbeat messages to prevent
    proxy timeouts, executes analysis in a background thread, and yields final JSON result.
    """
    yield f"data: {json.dumps({'status': 'Initializing AI diagnostic engine...'})}\n\n"
    await asyncio.sleep(0.05)

    # Launch AI analysis task in background thread
    loop = asyncio.get_running_loop()
    analysis_service = AnalysisService()
    task = loop.run_in_executor(
        None, analysis_service.run_code_analysis, code, language, analysis_types
    )

    heartbeat_msgs = [
        "Analyzing code structure & AST metrics...",
        "Scanning for OWASP security vulnerabilities...",
        "Evaluating time & space complexity...",
        "Generating optimized production code rewrite...",
        "Building automated unit test suite...",
        "Finalizing diagnostic audit report...",
    ]
    idx = 0

    # Heartbeat loop: Yield status every 1.5 seconds so Render / Vercel proxy NEVER times out
    while not task.done():
        status_msg = heartbeat_msgs[idx % len(heartbeat_msgs)]
        yield f"data: {json.dumps({'status': status_msg})}\n\n"
        idx += 1
        await asyncio.sleep(1.5)

    try:
        result = await task
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


@router.post("/analyze-sync")
async def analyze_code_sync(request: AnalysisRequestSchema) -> AnalysisResponseSchema:
    """
    Synchronous fallback REST endpoint for code analysis.
    """
    if not request.code.strip():
        raise HTTPException(status_code=400, detail="Code content cannot be empty.")

    analysis_service = AnalysisService()
    return await run_in_threadpool(
        analysis_service.run_code_analysis, request.code, request.language, request.analysis_types
    )
