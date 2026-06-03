import logging

from anthropic import APIStatusError
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import RewriteRequestSerializer, RewriteResponseSerializer
from .services import call_claude

logger = logging.getLogger(__name__)


def _claude_error_message(exc: APIStatusError) -> str:
    body = getattr(exc, "body", None) or {}
    if isinstance(body, dict):
        api_error = body.get("error", {})
        if isinstance(api_error, dict) and api_error.get("message"):
            return api_error["message"]
    return str(exc.message)


class RewriteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = RewriteRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        text = serializer.validated_data["text"]
        mode = serializer.validated_data["mode"]

        try:
            result = call_claude(text, mode)
        except ValueError as exc:
            return Response(
                {"error": str(exc)},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        except APIStatusError as exc:
            message = _claude_error_message(exc)
            logger.warning("Claude API error: %s", message)
            return Response(
                {"error": message},
                status=status.HTTP_502_BAD_GATEWAY,
            )
        except Exception:
            logger.exception("Unexpected error calling Claude API")
            return Response(
                {"error": "Failed to process text with Claude API"},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        response_serializer = RewriteResponseSerializer(
            {"result": result, "mode": mode}
        )
        return Response(response_serializer.data, status=status.HTTP_200_OK)
