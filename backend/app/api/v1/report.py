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
        md = f"""# CodeMedic AI - Executive Audit Report

**Target File:** `{report.file_name}`
**Language:** {report.language.capitalize()}
**Analysis Type:** {report.analysis_type}
**Date:** {report.created_at.strftime("%Y-%m-%d %H:%M:%S")}
**AI Confidence:** {report.confidence}%

---

## 1. Executive Summary
{report.summary}

"""
        if report.code_explanation:
            md += f"### Detailed AI Code Explanation\n{report.code_explanation}\n\n"

        md += f"""---

## 2. Dynamic Scores & Quality Matrix
- **Overall Code Health:** {report.code_quality_score}/100
- **Security Rating:** {report.security_score}/100
- **Total Bugs Detected:** {report.bug_count}
- **Scan Duration:** {report.analysis_duration}s

---

## 3. Complexity & Algorithmic Bounds
- **Time Complexity:** {report.complexity.get("time", "N/A")}
- **Space Complexity:** {report.complexity.get("space", "N/A")}
- **Description:** {report.complexity.get("explanation", "N/A")}

---

## 4. Detected Bugs & Flaws
"""
        if not report.issues:
            md += "No bugs detected in the parsed code.\n"
        else:
            for idx, issue in enumerate(report.issues, 1):
                line_num = issue.get("line") or issue.get("line_number")
                line_str = f" (Line {line_num})" if line_num else ""
                md += f"### {idx}. {issue.get('title')}\n"
                md += f"- **Severity:** `{str(issue.get('severity', 'low')).upper()}`\n"
                md += f"- **Location:** `{report.file_name}{line_str}`\n"
                md += f"- **Description:** {issue.get('description')}\n"
                if issue.get("why_it_happens"):
                    md += f"- **Why It Happens:** {issue.get('why_it_happens')}\n"
                if issue.get("impact"):
                    md += f"- **Runtime Impact:** {issue.get('impact')}\n"
                if issue.get("fix"):
                    md += f"- **Fix:** {issue.get('fix')}\n"
                md += "\n"

        md += "\n---\n\n## 5. Security & OWASP Audit\n"
        if not report.security:
            md += "No security exposures or credential vulnerabilities detected.\n"
        else:
            for idx, sec in enumerate(report.security, 1):
                finding = sec.get("finding") or sec.get("title")
                owasp = sec.get("owasp_category", "OWASP General")
                remediation = sec.get("remediation") or sec.get("fix")
                md += f"### {idx}. {finding}\n"
                md += f"- **Severity:** `{str(sec.get('severity', 'low')).upper()}`\n"
                md += f"- **OWASP Category:** {owasp}\n"
                if remediation:
                    md += f"- **Remediation:** {remediation}\n"
                md += "\n"

        if report.code_review:
            md += "\n---\n\n## 6. Senior Code Review & SOLID Architecture\n"
            for idx, cr in enumerate(report.code_review, 1):
                md += f"### {idx}. {cr.get('category')}\n"
                md += f"- **Status:** `{str(cr.get('status', 'pass')).upper()}`\n"
                md += f"- **Suggestion:** {cr.get('suggestion')}\n\n"

        md += "\n---\n\n## 7. Refactored Source Code\n"
        if report.why_better:
            md += f"### Why this version is better\n{report.why_better}\n\n"
        md += f"```{report.language}\n{report.optimized_code}\n```\n\n"

        md += "Generated by CodeMedic AI — Fix. Explain. Optimize. Powered by AI Engine.\n"

        mem = io.BytesIO(md.encode("utf-8"))
        filename = f"codemedic_report_{report.file_name}.md"
        return StreamingResponse(
            mem,
            media_type="text/markdown",
            headers={"Content-Disposition": f"attachment; filename={filename}"},
        )

    elif export_format == "json":
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
            "code_explanation": report.code_explanation,
            "why_better": report.why_better,
            "issues": report.issues,
            "security": report.security,
            "performance": report.performance,
            "code_review": report.code_review,
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

## Executive Summary
{report.summary}

## Code Quality Highlights
- Overall Health Score: {report.code_quality_score}/100
- Security Score: {report.security_score}/100
- Bug Count: {report.bug_count} fixed

## File Details
- `optimized_{report.file_name}`: Fully rewritten, optimized source file.
- `test_{report.file_name}`: Production unit test suite.
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
