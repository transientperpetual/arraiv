from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from .garmin_ops import garmin_registration, get_garmin, sync_garmin_historical_data
from .models import HealthDevice

from .serializers import HealthDeviceSerializer

class GarminRegistration(APIView):
    
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # serializer_class = HealthDeviceSerializer(data=request.data)    
        email = request.data.get("email")
        password = request.data.get("password")
        
        # existing_device = HealthDevice.objects.filter(user=request.user).first()
        if hasattr(request.user, 'health_device'):
            return Response({"detail": "Garmin device already registered."}, status=status.HTTP_400_BAD_REQUEST)
                
        # send email and password to garmin_auth
        try: 
            device_brand, device_name, display_name, token_string = garmin_registration(email, password)
            data = {
                "device_brand": device_brand,
                "device_name": device_name,
                "display_name": display_name,
                "token_string": token_string,
            }
            # validate device data against HealthDeviceSerailizer 
            serializer = HealthDeviceSerializer(data=data)
            if serializer.is_valid():
                serializer.save(user=request.user)
                print("Device saved for : ", request.user)
                
                #sync garmin data
                sync_garmin_historical_data(data)
                
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class GarminDevice(APIView):
    permission_classes=[IsAuthenticated]
    
    def get(self, request):
        data = get_garmin(request.user)
        print("RETRV : ", data)
        return Response(data)
    

class GarminDataSync(APIView):
    def get(self, request):
        print("RES : ")
        print(request.user)
        data = get_garmin(request.user)
        print("RETRV : ", data)
        return Response(data)
    
    
class GarminDeviceDeleteView(APIView):
    print("remove")
    