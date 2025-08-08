from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import KeyAssignmentViewSet

router = DefaultRouter()
router.register(r'key-assignments', KeyAssignmentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]