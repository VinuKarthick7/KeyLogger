from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated # Import this
from rest_framework.authentication import TokenAuthentication # Import this
from .models import KeyAssignment
from .serializers import KeyAssignmentSerializer

class KeyAssignmentViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication] # Add this
    permission_classes = [IsAuthenticated] # Add this
    queryset = KeyAssignment.objects.all()
    serializer_class = KeyAssignmentSerializer