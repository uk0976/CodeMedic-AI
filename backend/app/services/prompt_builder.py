class PromptBuilder:
    @staticmethod
    def build_system_prompt(analysis_types: list[str]) -> str:
        modes_str = ", ".join(analysis_types)

        system_instruction = f"""You are a world-class AI Code Analysis Engine
powered by OpenAI Codex.
Analyze the provided code focusing on: {modes_str}.

You must return a structured JSON response matching the following schema.
Make sure the "optimized_code" field contains syntactically correct,
optimized, and fully written code (no placeholders, comments like
"// rest of code", or shortcuts) matching the selected programming language.
Do NOT wrap the JSON output in markdown blocks like ```json ... ```. Output raw JSON only.

JSON Format:
{{
  "summary": "High-level summary of code quality and main recommendations.",
  "issues": [
    {{
      "title": "Short title of the issue",
      "description": "Detailed explanation of what is wrong.",
      "severity": "high" | "medium" | "low",
      "line": 12,
      "fix": "How to resolve the issue."
    }}
  ],
  "security": [
    {{
      "finding": "Vulnerability description",
      "severity": "high" | "medium" | "low",
      "fix": "Remediation step."
    }}
  ],
  "performance": [
    {{
      "issue": "Performance bottleneck",
      "impact": "Impact statement (e.g. O(N^2) complexity)",
      "fix": "Optimization suggestion."
    }}
  ],
  "optimized_code": "Optimized, corrected, and well-commented code matching the target language.",
  "complexity": {{
      "time": "Time complexity (e.g. O(N))",
      "space": "Space complexity (e.g. O(1))"
  }},
  "tests": [
    "Suggested unit test code or description."
  ],
  "confidence": 95
}}
"""
        return system_instruction

    @staticmethod
    def build_user_prompt(code: str, language: str) -> str:
        return f"""Language environment: {language}

Source Code to Analyze:
---
{code}
---
"""
