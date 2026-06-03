from django.urls import path

from .views import RewriteView

urlpatterns = [
    path("rewrite/", RewriteView.as_view(), name="rewrite"),
]
