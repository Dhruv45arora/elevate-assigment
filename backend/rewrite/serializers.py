from rest_framework import serializers

VALID_MODES = ("rewrite", "summarise")


class RewriteRequestSerializer(serializers.Serializer):
    text = serializers.CharField(min_length=1, max_length=50000)
    mode = serializers.ChoiceField(choices=VALID_MODES)


class RewriteResponseSerializer(serializers.Serializer):
    result = serializers.CharField()
    mode = serializers.CharField()
