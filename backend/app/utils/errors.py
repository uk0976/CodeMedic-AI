from typing import Any

from fastapi import Request
from fastapi.responses import JSONResponse
from starlette import status


async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    request_id = getattr(request.state, "request_id", None)
    content: dict[str, Any] = {
        "detail": "An unexpected server error occurred.",
        "request_id": request_id,
    }
    return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content=content)
