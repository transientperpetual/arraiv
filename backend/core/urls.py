from django.contrib import admin
from django.urls import path, include
from users import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView


urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/", include("users.urls"))
]
