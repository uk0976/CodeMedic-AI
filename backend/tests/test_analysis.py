import json
from fastapi.testclient import TestClient
from app.main import app

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

def test_analyze_code_streaming_sse():
    payload = {
        "code": "def process(x):\n    return x * 2\n",
        "language": "python",
        "analysis_types": ["Bug Detection", "Security Scan"]
    }
    response = client.post("/api/v1/analysis/analyze", json=payload)
    assert response.status_code == 200
    assert "text/event-stream" in response.headers["content-type"]
    
    body = response.text
    assert "data: " in body
    assert "Finalizing Report..." in body or "result" in body
