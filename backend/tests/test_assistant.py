from app.assistant import answer

def test_empty_question_returns_safety_notice():
    result = answer("")
    assert result["citations"] == []
    assert "cannot assess emergencies" in result["notice"]

def test_unmatched_question_escalates_to_clinic():
    result = answer("unrelated obscure question")
    assert "contact the clinic" in result["answer"]
