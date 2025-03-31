from django.urls import path
from users import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
from .views import CustomTokenObtainPairView

urlpatterns = [
    path('register/', views.RegisterUserView.as_view(), name='register'),
    path('verify-otp/', views.VerifyOTPView.as_view(), name='verify-otp'),
    path('resend-otp/', views.ResendOTPView.as_view(), name='resend-otp'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('user/', views.ArraivUserList.as_view()),
    path('user/<int:pk>', views.ArraivUserRetrieveUpdateDestroy.as_view()),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('verifytoken/', TokenVerifyView.as_view(), name='token_verify'),
    
    path('google/login/', views.google_login, name='google_login'),
    path('exchange-token/', views.exchange_token, name='exchange_token'),
    
    path("logout/", views.LogoutView.as_view(), name="logout"),
    path("test/", views.TestView.as_view(), name="test-view"),
]