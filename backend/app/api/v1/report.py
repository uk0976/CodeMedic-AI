import io
import json
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.database.session import get_db_session
from app.models.report import AnalysisReport
from app.repositories.report import ReportRepository
from app.schemas.report import ReportCreateSchema, ReportDetailSchema, ReportListSchema
from app.utils.pdf_generator import generate_report_pdf

router = APIRouter(prefix="/reports", tags=["Analysis Reports"])


@router.post("/", response_model=ReportDetailSchema, status_code=status.HTTP_201_CREATED)
def create_report(
    schema: ReportCreateSchema, db: Session = Depends(get_db_session)
) -> AnalysisReport:
    """
    Saves an analysis report history item into the database.
    """
    repo = ReportRepository(db)
    report = repo.create_report(schema)
    return report


@router.get("/", response_model=list[ReportListSchema])
def list_reports(
    search: str | None = Query(None, description="Search by file name"),
    language: str | None = Query(None, description="Filter by language"),
    sort_by: str | None = Query(
        None, description="Sort order (newest, oldest, highest_score, most_bugs, alphabetical)"
    ),
    db: Session = Depends(get_db_session),
) -> list[AnalysisReport]:
    """
    Retrieves all history reports matching search filters and sort parameters.
    """
    repo = ReportRepository(db)
    return repo.list_reports(search=search, language=language, sort_by=sort_by)


@router.get("/{report_id}", response_model=ReportDetailSchema)
def get_report(report_id: UUID, db: Session = Depends(get_db_session)) -> AnalysisReport:
    """
    Retrieves details of a single report by ID.
    """
    repo = ReportRepository(db)
    report = repo.get_report_by_id(report_id)
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis report not found.",
        )
    return report


@router.delete("/{report_id}")
def delete_report(report_id: UUID, db: Session = Depends(get_db_session)) -> dict[str, bool]:
    """
    Removes a report from database history.
    """
    repo = ReportRepository(db)
    success = repo.delete_report(report_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis report not found.",
        )
    return {"success": True}


@router.get("/{report_id}/export/{export_format}")
def export_report(
    report_id: UUID, export_format: str, db: Session = Depends(get_db_session)
) -> StreamingResponse:
    """
    Exports report content into PDF, Markdown, JSON, Source Code, or Unit Test script.
    """
    repo = ReportRepository(db)
    report = repo.get_report_by_id(report_id)
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis report not found.",
        )

    export_format = export_format.lower()

    if export_format == "pdf":
        pdf_buffer = generate_report_pdf(report)
        filename = f"codemedic_report_{report.file_name}.pdf"
        return StreamingResponse(
            pdf_buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={filename}"},
        )

    elif export_format == "markdown":
        # Generate clean developer-friendly Markdown report
        md = f"""# CodeMedic AI - Code Analysis Report

**File Name:** {report.file_name}
**Language:** {report.language.capitalize()}
**Analysis Type:** {report.analysis_type}
**Date:** {report.created_at.strftime("%Y-%m-%d %H:%M:%S")}
**Confidence:** {report.confidence}%

---

## 1. Executive Summary
{report.summary}

---

## 2. Quality Scores
- **Code Quality Score:** {report.code_quality_score}/100
- **Security Score:** {report.security_score}/100
- **Total Bugs Detected:** {report.bug_count}
- **Scan Duration:** {report.analysis_duration}s

---

## 3. Complexity Estimates
- **Time Complexity:** {report.complexity.get("time", "N/A")}
- **Space Complexity:** {report.complexity.get("space", "N/A")}
- **Description:** {report.complexity.get("explanation", "N/A")}

---

## 4. Detected Bugs & Code Quality Issues
"""
        if not report.issues:
            md += "No bugs detected in the parsed code.\n"
        else:
            for idx, issue in enumerate(report.issues, 1):
                line_str = (
                    f" (Line {issue.get('line_number')})" if issue.get("line_number") else ""
                )
                md += f"### {idx}. {issue.get('title')}\n"
                md += f"- **Severity:** {issue.get('severity', 'low').upper()}\n"
                md += f"- **Location:** {report.file_name}{line_str}\n"
                md += f"- **Description:** {issue.get('description')}\n\n"

        md += "\n---\n\n## 5. Security Analysis\n"
        if not report.security:
            md += "No security exposures or credential vulnerabilities detected.\n"
        else:
            for idx, sec in enumerate(report.security, 1):
                md += f"### {idx}. {sec.get('title')}\n"
                md += f"- **Severity:** {sec.get('severity', 'low').upper()}\n"
                md += f"- **Description:** {sec.get('description')}\n\n"

        md += "\n---\n\n## 6. Performance Recommendations\n"
        if not report.performance:
            md += "No performance bottlenecks detected. Code execution pattern is efficient.\n"
        else:
            for idx, perf in enumerate(report.performance, 1):
                md += f"### {idx}. {perf.get('title')}\n"
                md += f"- **Impact:** {perf.get('impact', 'low').upper()}\n"
                md += f"- **Description:** {perf.get('description')}\n\n"

        md += "\n---\n\n## 7. Recommendations & Final Checkpoints\n"
        md += "Review the optimized source code and apply checks directly in development.\n\n"
        md += "Generated by CodeMedic AI — Fix. Explain. Optimize. Powered by Codex.\n"

        # Return as downloadable string stream
        mem = io.BytesIO(md.encode("utf-8"))
        filename = f"codemedic_report_{report.file_name}.md"
        return StreamingResponse(
            mem,
            media_type="text/markdown",
            headers={"Content-Disposition": f"attachment; filename={filename}"},
        )

    elif export_format == "json":
        # Wrap database fields in dict and return as downloadable JSON attachment
        data = {
            "id": str(report.id),
            "file_name": report.file_name,
            "language": report.language,
            "analysis_type": report.analysis_type,
            "code_quality_score": report.code_quality_score,
            "bug_count": report.bug_count,
            "security_score": report.security_score,
            "analysis_duration": report.analysis_duration,
            "confidence": report.confidence,
            "code": report.code,
            "optimized_code": report.optimized_code,
            "summary": report.summary,
            "issues": report.issues,
            "security": report.security,
            "performance": report.performance,
            "complexity": report.complexity,
            "tests": report.tests,
            "created_at": report.created_at.isoformat(),
        }
        mem = io.BytesIO(json.dumps(data, indent=2).encode("utf-8"))
        filename = f"codemedic_report_{report.file_name}.json"
        return StreamingResponse(
            mem,
            media_type="application/json",
            headers={"Content-Disposition": f"attachment; filename={filename}"},
        )

    elif export_format == "code":
        mem = io.BytesIO(report.optimized_code.encode("utf-8"))
        filename = f"optimized_{report.file_name}"
        return StreamingResponse(
            mem,
            media_type="text/plain",
            headers={"Content-Disposition": f"attachment; filename={filename}"},
        )

    elif export_format == "tests":
        tests_content = "\n\n".join(report.tests) if report.tests else "# No tests generated"
        mem = io.BytesIO(tests_content.encode("utf-8"))

        # Give appropriate extension for tests
        ext = report.file_name.split(".")[-1] if "." in report.file_name else "txt"
        filename = f"test_{report.file_name.split('.')[0]}.{ext}"

        return StreamingResponse(
            mem,
            media_type="text/plain",
            headers={"Content-Disposition": f"attachment; filename={filename}"},
        )

    elif export_format == "readme":
        readme_content = f"""# CodeMedic Optimized Code: {report.file_name}

This directory contains source code optimized by CodeMedic AI's analysis engine.

## Summary of Changes
{report.summary}

## Code Quality Highlights
- Quality Score: {report.code_quality_score}/100
- Security Score: {report.security_score}/100
- Bug Count: {report.bug_count} fixed

## File Details
- `optimized_{report.file_name}`: Fully rewritten, optimized source file.
- `test_{report.file_name}`: Suggested unit test cases code.
"""
        mem = io.BytesIO(readme_content.encode("utf-8"))
        filename = "README_codemedic.md"
        return StreamingResponse(
            mem,
            media_type="text/markdown",
            headers={"Content-Disposition": f"attachment; filename={filename}"},
        )

    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported export format: {export_format}",
        )
