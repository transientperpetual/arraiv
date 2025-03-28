from django.shortcuts import render
from .models import ArraivUser
from .serializers import ArraivUserSerializer, RegisterUserSerialzier
from rest_framework.generics import ListAPIView, RetrieveUpdateDestroyAPIView, CreateAPIView
from rest_framework.views import APIView
from django.utils.timezone import now
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView
from .serializers import CustomTokenObtainPairSerializer
from django.core.mail import send_mail
from rest_framework.response import Response
from django.conf import settings
from django.http import JsonResponse
from django.contrib.auth import get_user_model
from django.shortcuts import render, redirect
from urllib.parse import urlencode
import requests
from rest_framework import status
import environ
from rest_framework_simplejwt.tokens import RefreshToken
from .authentication import CookieJWTAuthentication
from django.views.decorators.csrf import csrf_exempt

# Initialize environ
env = environ.Env(
    DEBUG=(bool, False)
)

User = get_user_model()

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class UserRegistrationView(CreateAPIView):
    serializer_class = RegisterUserSerialzier
    permission_classes = [AllowAny]
    


class RegisterUserView(CreateAPIView):
    queryset = ArraivUser.objects.all()
    serializer_class = ArraivUserSerializer
    permission_classes = [AllowAny]
    def perform_create(self, serializer):
        user = serializer.save()
        user.is_email_verified = False
        user.save()
        user.generate_otp()  # Generate OTP

        # Send OTP via email
        send_mail(
            subject="Welcome to ARRAIV!",
            message=f"Here's your OTP {user.otp}. It expires in 10 minutes.",
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[user.email],
            fail_silently=False,
        )

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)  # Call default create method
        return Response({"message": "User registered. Check your email for the OTP."}, status=status.HTTP_201_CREATED)
    

class VerifyOTPView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        email = request.data.get("email")
        otp = request.data.get("otp")

        if not email or not otp:
            return JsonResponse({"error": "Email and OTP required"}, status=400)

        try:
            user = ArraivUser.objects.get(email=email)
        except ArraivUser.DoesNotExist:
            return JsonResponse({"error": "Account not found for this email"}, status=400)

        # Check OTP expiration (valid for 10 minutes)
        if user.otp != otp or (now() - user.otp_created_at).total_seconds() > 600:
            return JsonResponse({"error": "Invalid or expired OTP"}, status=400)

        # Mark email as verified
        user.is_email_verified = True
        user.otp = None  # Clear OTP after successful verification
        user.otp_created_at = None
        user.save()

        return JsonResponse({"message": "Email successfully verified!"}, status=200)


class ResendOTPView(APIView):
    permission_classes=[AllowAny]
    def post(self, request):
        email = request.data.get("email")

        if not email:
            return JsonResponse({"error": "Email required"}, status=400)

        try:
            user = ArraivUser.objects.get(email=email)
        except ArraivUser.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=400)

        if user.is_email_verified:
            return JsonResponse({"message": "Email is already verified."}, status=400)

        user.generate_otp()

        # Send OTP via email
        send_mail(
            subject="Your OTP for Email Verification",
            message=f"Your new OTP is {user.otp}. It will expire in 10 minutes.",
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[user.email],
            fail_silently=False,
        )

        return JsonResponse({"message": "A new OTP has been sent to your email."})
    
    
def google_login(request):
    base_url = "https://accounts.google.com/o/oauth2/v2/auth"
    params = {
        "client_id": env("GOOGLE_CLIENT_ID"),
        "response_type": "code",
        "scope": "openid email profile",
        "redirect_uri": request.build_absolute_uri('/google/callback/'),
        "state": "random_state_string",  # Protect against CSRF
        "access_type": "offline",
        # "prompt": "consent",
    }
    print("new url : ", f"{base_url}?{urlencode(params)}")
    return redirect(f"{base_url}?{urlencode(params)}")



def google_callback(request):
    code = request.GET.get('code')
    
    if not code:
        return render(request, 'error.html', {"message": "No code provided."})

    # Exchange authorization code for access token
    token_response = requests.post(
        "https://oauth2.googleapis.com/token",
        data={
            "code": code,
            "client_id": env("GOOGLE_CLIENT_ID"),
            "client_secret": env("GOOGLE_CLIENT_SECRET"),
            "redirect_uri": request.build_absolute_uri('/google/callback/'),
            "grant_type": "authorization_code",
            "state": "random_state_string",
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    ).json()

    if "error" in token_response:
        return render(request, 'error.html', {"message": token_response.get("error_description")})

    access_token = token_response.get('access_token')

    # Get user info from Google
    user_info_response = requests.get(
        "https://www.googleapis.com/oauth2/v1/userinfo",
        params={"access_token": access_token, "alt": "json"},
    ).json()

    email = user_info_response.get('email')
    first_name = user_info_response.get('given_name')

    #Add a template here.
    if not email:
        return render(request, 'error.html', {"message": "Email not provided by Google."})

    # Create or update user
    user, created = ArraivUser.objects.update_or_create(
        email=email,
        defaults={"first_name": first_name, "email": email, "is_email_verified": True},
    )

    # Generate JWT tokens
    tokens = get_tokens_for_user(user)

    return JsonResponse({
        "message": "Google login successful",
        "access_token": tokens['access'],
        "refresh_token": tokens['refresh'],
        "user": {
            "email": user.email,
            "first_name": user.first_name,
        },
    })

    
class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == 200:
            response.data = {
                "arraiv_at_src": response.data["access"],
                "arraiv_rt_src": response.data["refresh"]
            }
        
        return response
    


class ArraivUserList(ListAPIView):
    queryset = ArraivUser.objects.all()
    serializer_class = ArraivUserSerializer
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

class ArraivUserRetrieveUpdateDestroy(RetrieveUpdateDestroyAPIView):
    queryset = ArraivUser.objects.all()
    serializer_class = ArraivUserSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAdminUser]



class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.COOKIES.get("refresh_token")
            if not refresh_token:
                return Response({"error": "No refresh token"}, status=400)

            # Blacklist the token
            token = RefreshToken(refresh_token)
            token.blacklist()

            # Clear cookies
            response.delete_cookie("access_token")
            response.delete_cookie("refresh_token")
            response = Response({"message": "Logged out successfully"}, status=200)

            return response
        except Exception as e:
            return Response({"error": "Invalid token or already blacklisted"}, status=400)


class TestView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        response = Response({"message": "TestView is hit"}, status=200)
        return response
        