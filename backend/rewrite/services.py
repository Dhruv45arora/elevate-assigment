import os

from anthropic import Anthropic

def _build_user_message(text: str, mode: str) -> str:
    """Wrap user text so Claude treats it as content, not a chat question."""
    document = text.strip()
    if mode == "rewrite":
        return (
            "Rewrite the document below. Make it clearer and more professional. "
            "Keep the same meaning. Output ONLY the rewritten document — no introduction, "
            "no questions, no commentary.\n\n"
            f"<document>\n{document}\n</document>"
        )
    if mode == "summarise":
        return (
            "Summarize the document below in concise bullet points or a short paragraph. "
            "Capture the main ideas only. Output ONLY the summary — no introduction, "
            "no questions, never ask the user for more text.\n\n"
            f"<document>\n{document}\n</document>"
        )
    raise ValueError(f"Unsupported mode: {mode}")


def call_claude(text: str, mode: str) -> str:
    api_key = (os.environ.get("ANTHROPIC_API_KEY") or "").strip()
    if not api_key or api_key == "sk-ant-api03-xxxxxxxx":
        raise ValueError("ANTHROPIC_API_KEY is not configured")

    document = text.strip()
    if not document:
        raise ValueError("Text cannot be empty")

    model = os.environ.get("CLAUDE_MODEL", "claude-haiku-4-5-20251001")
    user_message = _build_user_message(document, mode)

    client = Anthropic(api_key=api_key)
    message = client.messages.create(
        model=model,
        max_tokens=2048,
        system=(
            "You process documents for a writing assistant app. "
            "The user's content is always inside <document> tags. "
            "Never reply as a chatbot asking for input — only transform the document."
        ),
        messages=[
            {
                "role": "user",
                "content": user_message,
            }
        ],
    )

    parts = []
    for block in message.content:
        if hasattr(block, "text"):
            parts.append(block.text)
    return "".join(parts).strip()
