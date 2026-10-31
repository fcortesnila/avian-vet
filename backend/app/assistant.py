"""Small deterministic retrieval baseline; never presents itself as clinical advice."""
from pathlib import Path
import re

KNOWLEDGE_DIR = Path(__file__).parent / "knowledge"
EMERGENCY_NOTICE = "For breathing difficulty, collapse, active bleeding, seizures, or suspected toxin exposure, contact an avian veterinarian or emergency clinic now. This assistant cannot assess emergencies."

def answer(question: str) -> dict:
    q = question.strip()
    if not q:
        return {"answer": "Ask a general care information question.", "citations": [], "notice": EMERGENCY_NOTICE}
    docs = []
    for path in KNOWLEDGE_DIR.glob("*.md"):
        body = path.read_text(encoding="utf-8")
        terms = set(re.findall(r"[a-z]{3,}", q.lower()))
        score = sum(body.lower().count(term) for term in terms)
        if score:
            docs.append((score, path.name, body.strip()))
    docs.sort(reverse=True)
    if not docs:
        return {"answer": "I couldn't find a reviewed clinic reference for that. Please contact the clinic for guidance.", "citations": [], "notice": EMERGENCY_NOTICE}
    citations = [{"source": name, "excerpt": text[:500]} for _, name, text in docs[:2]]
    return {"answer": "Here is general information from the clinic reference material. Please confirm care decisions with your avian veterinarian.", "citations": citations, "notice": EMERGENCY_NOTICE}
