from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_reports_crud_and_exports():
    # 1. Create Report
    payload = {
        "file_name": "test_script.py",
        "language": "python",
        "analysis_type": "Bug Detection",
        "code_quality_score": 90,
        "bug_count": 1,
        "security_score": 95,
        "analysis_duration": 2,
        "confidence": 92,
        "code": "def hello():\n    print('world')\n",
        "optimized_code": "def hello() -> None:\n    print('world')\n",
        "summary": "Clean code with minor print syntax warning.",
        "issues": [
            {
                "title": "Print function",
                "description": "Ensure Python 3 syntax",
                "severity": "low",
                "line": 2,
            }
        ],
        "security": [],
        "performance": [],
        "complexity": {"time": "O(1)", "space": "O(1)"},
        "tests": ["def test_hello(): assert hello() is None"],
    }

    res = client.post("/api/v1/reports/", json=payload)
    assert res.status_code == 201
    report = res.json()
    report_id = report["id"]

    # 2. Get List of Reports
    res_list = client.get("/api/v1/reports/")
    assert res_list.status_code == 200
    assert len(res_list.json()) >= 1

    # 3. Export PDF Report
    res_pdf = client.get(f"/api/v1/reports/{report_id}/export/pdf")
    assert res_pdf.status_code == 200
    assert res_pdf.headers["content-type"] == "application/pdf"

    # 4. Export Markdown Report
    res_md = client.get(f"/api/v1/reports/{report_id}/export/markdown")
    assert res_md.status_code == 200
    assert "text/markdown" in res_md.headers["content-type"]
    assert "# CodeMedic AI" in res_md.text

    # 5. Export JSON Report
    res_json = client.get(f"/api/v1/reports/{report_id}/export/json")
    assert res_json.status_code == 200
    assert res_json.json()["file_name"] == "test_script.py"

    # 6. Delete Report
    res_del = client.get(f"/api/v1/reports/{report_id}")  # Check details first
    assert res_del.status_code == 200

    res_del2 = client.delete(f"/api/v1/reports/{report_id}")
    assert res_del2.status_code == 200
    assert res_del2.json() == {"success": True}
