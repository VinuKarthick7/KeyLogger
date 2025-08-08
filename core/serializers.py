from rest_framework import serializers
from .models import KeyAssignment

class KeyAssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = KeyAssignment
        fields = '__all__'