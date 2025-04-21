import datetime
from django.utils.timezone import make_aware
from xml.dom.domreg import registered
import garth
import healthdevice
from .models import DailyMetrics, HealthDevice
from .serializers import DailyMetricsSerializer, HealthDeviceSerializer
from rest_framework.response import Response
from rest_framework import status

today = datetime.date.today()

def garmin_registration(email, password):
    try:
        print("TRYING TO LOGIN", email)
        garth.login(email, password)
        #modify init.py on garth (to allow returning a token string)
        token_string = garth.save()
        
        # get garmin device name
        url = "/web-gateway/device-info/primary-training-device"
        device_data = garth.connectapi(url)
        
        device_name = device_data["RegisteredDevices"][0]["displayName"]
        epoch_ms  = device_data["RegisteredDevices"][0]["registeredDate"]
        registered_date = make_aware(datetime.datetime.fromtimestamp(epoch_ms / 1000.0))
        
        # comment out profile_image_uuid to avoid error in gath init.py
        display_name = garth.UserProfile.get().display_name
        
        print("Garmin authentication successful.",device_name, registered_date, display_name)
        return device_name, "GARMIN", registered_date, display_name, token_string
    except Exception as e:
        print(f"Error during Garmin authentication: {e}")
        return None, None, None
    

def get_garmin(user):
    device = HealthDevice.objects.filter(user=user).first()
    if device is None:
        return Response({"error": "No device found for this user."}, status=status.HTTP_404_NOT_FOUND)

    # Serialize the device data
    serializer = HealthDeviceSerializer(device)
    print("DATA", serializer.data["registered_date"])
    return serializer.data


def sync_garmin_historical_data(garmin_device):

    garth.resume(garmin_device.token_string)

    date_pointer = garmin_device.registered_date
    days = 0

    while date_pointer.date() <= today:
        days += 1

        #daily summary metrics
        daily_summary_url = f'/usersummary-service/usersummary/daily/{garmin_device.display_name}'
        daily_summary_params = {"calendarDate": str(date_pointer.date().isoformat())}
        daily_summary_data = garth.connectapi(daily_summary_url, params=daily_summary_params)

        #sleep data
        sleep_url = f"/wellness-service/wellness/dailySleepData/{garmin_device.display_name}"
        sleep_params = {"date": str(date_pointer.date().isoformat()), "nonSleepBufferMinutes": 60}
        sleep_data = garth.connectapi(sleep_url, params=sleep_params)

        try:
            avgOvernightHrv = sleep_data["avgOvernightHrv"]
        except KeyError:
            avgOvernightHrv = None
        
        try:
            avgSleepStress = sleep_data["dailySleepDTO"]["avgSleepStress"]
        except KeyError:
            avgSleepStress = None

        try:
            restingHeartRate = sleep_data["restingHeartRate"]
        except KeyError:
            restingHeartRate = None

        sleep_score = (
                sleep_data.get("dailySleepDTO", {})
              .get("sleepScores", {})
              .get("overall", {})
              .get("value")
        )

        #hrv data
        hrv_url = f"/hrv-service/hrv/{str(date_pointer.date().isoformat())}"
        hrv_data = garth.connectapi(hrv_url)

        def safe_get(data, *keys, default=None):
            """Safely access nested dictionary keys."""
            if data is None:
                return default
            
            current = data
            for key in keys:
                if not isinstance(current, dict):
                    return default
                current = current.get(key, default)
                if current is None:
                    return default
            return current

        daily_metric = {
            "device": garmin_device,
            "date":date_pointer.date(),
            "steps":daily_summary_data["totalSteps"],
            "calories":daily_summary_data["totalKilocalories"],
            "body_battery":daily_summary_data["bodyBatteryHighestValue"],
            
            "sleep_duration":daily_summary_data["sleepingSeconds"],
            "sleep_score":sleep_score,
            "sleep_hrv":avgOvernightHrv,
            "sleep_deep":sleep_data["dailySleepDTO"]["deepSleepSeconds"],
            "sleep_rem":sleep_data["dailySleepDTO"]["remSleepSeconds"],
            "sleep_light":sleep_data["dailySleepDTO"]["lightSleepSeconds"],
            "sleep_stress":avgSleepStress,
            "resting_heart_rate":restingHeartRate,
            
            # Safe dictionary access with get() method
            "weekly_avg_hrv": safe_get(hrv_data, "hrvSummary", "weeklyAvg"),
            "hrv_baseline_low": safe_get(hrv_data, "hrvSummary", "baseline", "balancedLow"),
            "hrv_baseline_high": safe_get(hrv_data, "hrvSummary", "baseline", "balancedUpper"),
            "hrv_status": safe_get(hrv_data, "hrvSummary", "status"),

            "moderate_intensity_minutes":daily_summary_data["moderateIntensityMinutes"],
            "vigorous_intensity_minutes":daily_summary_data["vigorousIntensityMinutes"],
            
            "stress":daily_summary_data["averageStressLevel"],
            "resting_stress":daily_summary_data["restStressDuration"],
            "low_stress":daily_summary_data["lowStressDuration"],
            "medium_stress":daily_summary_data["mediumStressDuration"],
            "high_stress":daily_summary_data["highStressDuration"],
            "stress_status":daily_summary_data["stressQualifier"],
        }

        serializer = DailyMetricsSerializer(data=daily_metric)

        if serializer.is_valid():
            print("DAILY METRI _ ", daily_metric)
            serializer.save()

            #CLEAN THIS CODE
            #CREATE A FUNCTION TO GRAB GARMIN DATA ONCE INITIAL SYNC IS COMPLETE (for the upcoming days)
        else:
            print("inv data : ", daily_metric)

        date_pointer += datetime.timedelta(days=1)



def get_garmin_data(garmin_device):

    # url = "/web-gateway/device-info/primary-training-device"
    # device_data = garth.connectapi(url)
    print("DEVICE DATA", type(garmin_device.display_name))
    # garth.resume(garmin_device.token_string)

    #get device registration



    deviceRegisteredDate = datetime.datetime.fromtimestamp(1734964851).date()
    # date_pointer = datetime.datetime.fromtimestamp(1734964851).date()

    # folder_path = "data/stats"  # you can change this

    # while date_pointer <= today:
    #     saveInJson(api.get_stats(date_pointer.isoformat()), f'stats_{date_pointer.isoformat()}', folder_path)
    #     date_pointer += datetime.timedelta(days=1)
    # print(f"Data saved")

    #check the last sync date
    
    #fetch data for all days from last sync to current date.
    
    #fetch data from garmin
    
    #get till date stats
    
    #write data to table
    
     
    

def garmin_delete_token():
    #delete device data
    #delete device 
    print("GARMIN REMOVED")