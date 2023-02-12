from django.urls import path
from .views import OnlineView

urlpatterns = [
    path('online/', OnlineView.as_view())
]