import garth
from .models import HealthDevice
from .serializers import HealthDeviceSerializer
from rest_framework.response import Response
from rest_framework import status

def garmin_registration(email, password):
    try:
        garth.login(email, password)
        #modify init.py on garth (to allow returning a token string)
        token_string = garth.save()
        
        # get garmin device name
        url = "/web-gateway/device-info/primary-training-device"
        device_data = garth.connectapi(url)
        
        device_name = device_data["RegisteredDevices"][0]["displayName"]
        display_name = garth.profile["displayName"]
        
        print("Garmin authentication successful.")
        return "GARMIN", device_name, display_name, token_string
    except Exception as e:
        print(f"Error during Garmin authentication: {e}")
        return None, None, None
    

def get_garmin(user):
    device = HealthDevice.objects.filter(user=user).first()
    if device is None:
        return Response({"error": "No device found for this user."}, status=status.HTTP_404_NOT_FOUND)

    # Serialize the device data
    serializer = HealthDeviceSerializer(device)
    return serializer.data

def sync_garmin_historical_data(garmin_device=None, user=None):
    
    print("RES")
    # print(request.user)
    device = {}
    #check if data is present
    # if garmin_device:
    #     device = garmin_device
    # else:
    #     existing_device = HealthDevice.objects.filter(user=request.user).first()
    # daily_summary_url = f'/usersummary-service/usersummary/daily/{garmin_device.display_name}'
    # garth.connectapi(daily_summary_url)
    
    #check the last sync date
    
    #fetch data for all days from last sync to current date.
    
    #fetch data from garmin
    
    #get till date stats
    
    #write data to table
    
     
    

def garmin_delete_token():
    #delete device data
    #delete device 
    print("GARMIN REMOVED")