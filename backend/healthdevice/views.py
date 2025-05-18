# from os import sync
from django.http import JsonResponse
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from .garmin import operations
from .serializers import HealthDeviceSerializer
from users.authentication import CookieJWTAuthentication

class GarminRegistration(APIView):
    
    permission_classes = [IsAuthenticated]
    authentication_classes = [CookieJWTAuthentication]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        user = request.user
        # existing_device = HealthDevice.objects.filter(user=request.user).first()
        if hasattr(user, 'health_device'):
            return JsonResponse({"detail": "User already has a Garmin device linked."}, status=status.HTTP_400_BAD_REQUEST)
                
        # send email and password to garmin_auth
        try: 
            device_name, device_brand, registered_date, display_name, token_string = operations.garmin_registration(email, password)
            data = {
                "device_name": device_name,
                "device_brand": device_brand,
                "registered_date": registered_date,
                "display_name": display_name,
                "token_string": token_string,
            }
            # validate device data against HealthDeviceSerailizer 
            serializer = HealthDeviceSerializer(data=data)
            print(serializer.is_valid())
            if serializer.is_valid():
                serializer.save(user=user)

                #sync garmin data
                operations.primary_sync_garmin(user.health_device, True)
                
                # mark health device linked
                user.health_device_status = "linked"
                user.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class GarminDevice(APIView):
    permission_classes=[IsAuthenticated]
    
    def get(self, request):
        data = operations.get_garmin(request.user)
        print("RETRV : ", data)
        return Response(data)
    

class SyncGarminData(APIView):
    def get(self, request):
        print(request.user)
        # operations.primary_sync_garmin_sync(request.user.health_device)
        operations.get_sleep_hrv(request.user.health_device)
        return JsonResponse({"message":"success"})
    
class GarminDeviceDeleteView(APIView):
    print("remove")
    