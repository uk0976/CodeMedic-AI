import uuid
from datetime import datetime
from typing import Any

from sqlalchemy import JSON, DateTime, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class AnalysisReport(Base):
    __tablename__ = "analysis_reports"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    file_name: Mapped[str] = mapped_column(String(255), nullable=False)
    language: Mapped[str] = mapped_column(String(50), nullable=False)
    analysis_type: Mapped[str] = mapped_column(String(100), nullable=False)
    code_quality_score: Mapped[int] = mapped_column(Integer, default=100)
    bug_count: Mapped[int] = mapped_column(Integer, default=0)
    security_score: Mapped[int] = mapped_column(Integer, default=100)
    analysis_duration: Mapped[int] = mapped_column(Integer, default=0)
    confidence: Mapped[int] = mapped_column(Integer, default=100)

    # Store source codes
    code: Mapped[str] = mapped_column(Text, nullable=False)
    optimized_code: Mapped[str] = mapped_column(Text, nullable=False)

    # Detailed Summaries and Explanations
    summary: Mapped[str] = mapped_column(Text, nullable=False)
    code_explanation: Mapped[str | None] = mapped_column(Text, nullable=True)
    why_better: Mapped[str | None] = mapped_column(Text, nullable=True)

    # JSON results payloads
    issues: Mapped[list[dict[str, Any]]] = mapped_column(JSON, default=list)
    security: Mapped[list[dict[str, Any]]] = mapped_column(JSON, default=list)
    performance: Mapped[list[dict[str, Any]]] = mapped_column(JSON, default=list)
    code_review: Mapped[list[dict[str, Any]]] = mapped_column(JSON, default=list)
    complexity: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict)
    tests: Mapped[list[str]] = mapped_column(JSON, default=list)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
