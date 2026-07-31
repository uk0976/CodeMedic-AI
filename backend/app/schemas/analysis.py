from pydantic import BaseModel, Field


class AnalysisRequestSchema(BaseModel):
    code: str
    language: str
    analysis_types: list[str] = Field(default_factory=lambda: ["Bug Detection"])


class IssueItem(BaseModel):
    title: str = Field(description="Short title of the issue detected.")
    description: str = Field(description="Detailed explanation of the issue.")
    severity: str = Field(description="Severity of the issue: high, medium, or low.")
    line: int | None = Field(default=None, description="Line number of the issue in the code.")
    fix: str | None = Field(default=None, description="Proposed resolution or change.")


class SecurityItem(BaseModel):
    finding: str = Field(description="Security vulnerability details.")
    severity: str = Field(description="Severity of vulnerability: high, medium, or low.")
    fix: str | None = Field(default=None, description="Proposed remediation steps.")


class PerformanceItem(BaseModel):
    issue: str = Field(description="Performance bottleneck found in code.")
    impact: str = Field(description="Impact of the performance bottleneck.")
    fix: str | None = Field(default=None, description="Optimization suggestion.")


class ComplexityInfo(BaseModel):
    time: str = Field(description="Estimated Time Complexity (Big O notation, e.g. O(N)).")
    space: str = Field(description="Estimated Space Complexity (Big O notation, e.g. O(1)).")


class AnalysisResponseSchema(BaseModel):
    summary: str = Field(
        description="High-level summary of code quality, rating, and recommendations."
    )
    issues: list[IssueItem] = Field(
        default_factory=list, description="List of detected bugs/code smells."
    )
    security: list[SecurityItem] = Field(
        default_factory=list, description="Security findings and credentials exposure."
    )
    performance: list[PerformanceItem] = Field(
        default_factory=list, description="Performance review recommendations."
    )
    optimized_code: str = Field(
        description="Fully optimized and secure code snippet to replace the original."
    )
    complexity: ComplexityInfo = Field(description="Time and space complexity estimates.")
    tests: list[str] = Field(
        default_factory=list, description="Suggested test cases or unit test boilerplate."
    )
    confidence: int = Field(
        description="Confidence rating of analysis (percentage between 0 and 100)."
    )
