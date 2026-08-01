import json
from fastapi.testclient import TestClient
from app.main import app
from app.services.providers.local_provider import LocalFallbackProvider

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_analyze_code_empty_validation():
    response = client.post(
        "/api/v1/analysis/analyze",
        json={"code": "", "language": "python", "analysis_types": ["Bug Detection"]}
    )
    assert response.status_code == 400
    assert "cannot be empty" in response.json()["detail"]

def test_dynamic_math_scoring_vulnerable_code():
    # Intentionally bad code with SQL injection, hardcoded secret, nested loops
    bad_code = """
def get_user(user_id):
    API_KEY = "sk_live_secret_12345"
    query = "SELECT * FROM users WHERE id = " + user_id
    for i in range(10):
        for j in range(10):
            print i, j
    return query
"""
    provider = LocalFallbackProvider()
    res = provider.analyze(bad_code, "python")
    
    # Verify dynamic score deductions
    assert res.code_health_score < 60
    assert res.security_score < 70
    assert len(res.security) >= 1
    assert any(s.severity in ["critical", "high"] for s in res.security)
    assert len(res.issues) >= 1
    assert "O(N^2)" in res.complexity.time
    assert res.code_explanation is not None
    assert "SQL Injection" in res.summary or "critical" in res.summary.lower()

def test_dynamic_math_scoring_clean_code():
    clean_code = """
def calculate_total(prices: list[float]) -> float:
    \"\"\"Calculates sum of items with type safety.\"\"\"
    return sum(prices)
"""
    provider = LocalFallbackProvider()
    res = provider.analyze(clean_code, "python")
    assert res.code_health_score >= 90
    assert res.security_score == 100
    assert res.critical_count == 0
