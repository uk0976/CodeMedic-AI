from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ReportCreateSchema(BaseModel):
    file_name: str = Field(..., max_length=255)
    language: str = Field(..., max_length=50)
    analysis_type: str = Field(..., max_length=100)
    code_quality_score: int = Field(default=100)
    bug_count: int = Field(default=0)
    security_score: int = Field(default=100)
    analysis_duration: int = Field(default=0)
    confidence: int = Field(default=100)
    code: str
    optimized_code: str
    summary: str
    issues: list[dict[str, Any]] = Field(default_factory=list)
    security: list[dict[str, Any]] = Field(default_factory=list)
    performance: list[dict[str, Any]] = Field(default_factory=list)
    complexity: dict[str, Any] = Field(default_factory=dict)
    tests: list[str] = Field(default_factory=list)


class ReportListSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    file_name: str
    language: str
    analysis_type: str
    code_quality_score: int
    bug_count: int
    security_score: int
    analysis_duration: int
    confidence: int
    created_at: datetime


class ReportDetailSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    file_name: str
    language: str
    analysis_type: str
    code_quality_score: int
    bug_count: int
    security_score: int
    analysis_duration: int
    confidence: int
    code: str
    optimized_code: str
    summary: str
    issues: list[dict[str, Any]]
    security: list[dict[str, Any]]
    performance: list[dict[str, Any]]
    complexity: dict[str, Any]
    tests: list[str]
    created_at: datetime
