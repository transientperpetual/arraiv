from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from users.views import google_callback

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include("users.urls")),
    path('google/callback/', google_callback, name='google_callback'),
]

