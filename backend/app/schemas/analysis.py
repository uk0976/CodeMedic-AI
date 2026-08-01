from pydantic import BaseModel, Field


class AnalysisRequestSchema(BaseModel):
    code: str
    language: str
    analysis_types: list[str] = Field(default_factory=lambda: ["Bug Detection"])


class IssueItem(BaseModel):
    title: str = Field(description="Short title of the issue detected.")
    description: str = Field(description="Detailed explanation of the issue.")
    severity: str = Field(description="Severity: critical, high, medium, or low.")
    line: int | None = Field(default=None, description="Line number of the issue.")
    why_it_happens: str | None = Field(default=None, description="Root cause analysis of why this bug occurs.")
    impact: str | None = Field(default=None, description="Potential runtime failure impact.")
    fix: str | None = Field(default=None, description="Proposed remediation steps.")
    fix_code: str | None = Field(default=None, description="Exact code snippet to replace the buggy lines.")
    confidence: int = Field(default=95, description="Confidence rating for this issue finding.")


class SecurityItem(BaseModel):
    finding: str = Field(description="Security vulnerability title/details.")
    severity: str = Field(description="Severity: critical, high, medium, or low.")
    owasp_category: str | None = Field(default="A03:2021-Injection", description="OWASP Top 10 category.")
    risk_level: str | None = Field(default="High", description="Security risk level.")
    risk_score: int = Field(default=85, description="Numerical risk score penalty.")
    fix: str | None = Field(default=None, description="Remediation instructions.")
    remediation: str | None = Field(default=None, description="Concrete patch or secure code snippet.")


class PerformanceItem(BaseModel):
    issue: str = Field(description="Performance bottleneck title/details.")
    impact: str = Field(description="Execution latency or memory impact.")
    current_time: str | None = Field(default="O(N)", description="Current time complexity.")
    optimized_time: str | None = Field(default="O(1)", description="Optimized time complexity.")
    space: str | None = Field(default="O(1)", description="Space complexity.")
    memory_impact: str | None = Field(default="Low", description="Memory allocation impact.")
    fix: str | None = Field(default=None, description="Optimization suggestion.")


class CodeReviewItem(BaseModel):
    category: str = Field(description="Review area: SOLID, DRY, Naming, Type Hints, Docstrings, Error Handling.")
    status: str = Field(description="Status: pass, warn, fail.")
    suggestion: str = Field(description="Actionable improvement suggestion.")


class ComplexityInfo(BaseModel):
    time: str = Field(description="Estimated Time Complexity (Big O, e.g. O(N)).")
    space: str = Field(description="Estimated Space Complexity (Big O, e.g. O(1)).")
    explanation: str | None = Field(default=None, description="Algorithmic complexity explanation.")
    cyclomatic_complexity: int = Field(default=4, description="Cyclomatic complexity score.")
    maintainability_index: int = Field(default=78, description="Maintainability index score out of 100.")


class AnalysisResponseSchema(BaseModel):
    code_health_score: int = Field(description="Dynamic calculated code health rating out of 100.")
    security_score: int = Field(description="Dynamic security safety rating out of 100.")
    performance_score: int = Field(description="Dynamic performance efficiency score out of 100.")
    maintainability_score: int = Field(description="Dynamic maintainability score out of 100.")
    
    critical_count: int = Field(default=0, description="Count of critical issues.")
    high_count: int = Field(default=0, description="Count of high severity issues.")
    medium_count: int = Field(default=0, description="Count of medium severity issues.")
    low_count: int = Field(default=0, description="Count of low severity issues.")

    summary: str = Field(description="Executive Summary of code quality and findings.")
    code_explanation: str = Field(description="Detailed step-by-step AI explanation of code structure and flaws.")
    why_better: str = Field(description="Explanation of why the refactored code version is superior.")

    issues: list[IssueItem] = Field(default_factory=list, description="Detected bugs and flaws.")
    security: list[SecurityItem] = Field(default_factory=list, description="Security findings and credentials exposure.")
    performance: list[PerformanceItem] = Field(default_factory=list, description="Performance bottlenecks.")
    code_review: list[CodeReviewItem] = Field(default_factory=list, description="Senior code review evaluations.")

    optimized_code: str = Field(description="Optimized, secure, production-ready code rewrite.")
    complexity: ComplexityInfo = Field(description="Time, space, and maintainability metrics.")
    tests: list[str] = Field(default_factory=list, description="Unit test suite code.")
    confidence: int = Field(default=95, description="Overall analysis confidence rating.")
