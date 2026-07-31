from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.report import AnalysisReport
from app.schemas.report import ReportCreateSchema


class ReportRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def create_report(self, schema: ReportCreateSchema) -> AnalysisReport:
        report = AnalysisReport(
            file_name=schema.file_name,
            language=schema.language,
            analysis_type=schema.analysis_type,
            code_quality_score=schema.code_quality_score,
            bug_count=schema.bug_count,
            security_score=schema.security_score,
            analysis_duration=schema.analysis_duration,
            confidence=schema.confidence,
            code=schema.code,
            optimized_code=schema.optimized_code,
            summary=schema.summary,
            issues=schema.issues,
            security=schema.security,
            performance=schema.performance,
            complexity=schema.complexity,
            tests=schema.tests,
        )
        self.session.add(report)
        self.session.commit()
        self.session.refresh(report)
        return report

    def get_report_by_id(self, report_id: UUID) -> AnalysisReport | None:
        return self.session.get(AnalysisReport, report_id)

    def list_reports(
        self,
        search: str | None = None,
        language: str | None = None,
        sort_by: str | None = None,
    ) -> list[AnalysisReport]:
        query = select(AnalysisReport)

        # Apply filters
        if search:
            query = query.where(AnalysisReport.file_name.ilike(f"%{search}%"))
        if language and language.lower() != "all":
            query = query.where(AnalysisReport.language == language.lower())

        # Apply sorting
        if sort_by == "oldest":
            query = query.order_by(AnalysisReport.created_at.asc())
        elif sort_by == "highest_score":
            query = query.order_by(AnalysisReport.code_quality_score.desc())
        elif sort_by == "most_bugs":
            query = query.order_by(AnalysisReport.bug_count.desc())
        elif sort_by == "alphabetical":
            query = query.order_by(AnalysisReport.file_name.asc())
        else:
            # Default is newest
            query = query.order_by(AnalysisReport.created_at.desc())

        return list(self.session.scalars(query).all())

    def delete_report(self, report_id: UUID) -> bool:
        report = self.get_report_by_id(report_id)
        if report:
            self.session.delete(report)
            self.session.commit()
            return True
        return False
