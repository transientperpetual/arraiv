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

#this function will sync all garmin device data under the model DailyMetrics from the date of device registration to today.
#and
#this function will sync garmin from the last date of sync to T-1. 


def sync_garmin_data(garmin_device, onBoard=False):

    garth.resume(garmin_device.token_string)
    #sync fresh
    if onBoard:
        date_pointer = garmin_device.registered_date.date()
    #sync latest
    else:
        #get the last date of sync and set it + 1 as date_pointer.
        date_pointer = garmin_device.metrics.latest('date').date + datetime.timedelta(days=1)
    
    days = 0

    while date_pointer < today:
        days += 1

        #daily summary metrics
        daily_summary_url = f'/usersummary-service/usersummary/daily/{garmin_device.display_name}'
        daily_summary_params = {"calendarDate": str(date_pointer.isoformat())}
        daily_summary_data = garth.connectapi(daily_summary_url, params=daily_summary_params)

        #TODO : your day is presumed to start with sleep and sleep hrv, so will need to fetch sleep and hrv for T and assign it to T-1 data.
        #sleep data
        sleep_url = f"/wellness-service/wellness/dailySleepData/{garmin_device.display_name}"
        sleep_params = {"date": str(date_pointer.isoformat()), "nonSleepBufferMinutes": 60}
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
        hrv_url = f"/hrv-service/hrv/{str(date_pointer.isoformat())}"
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
            "date":date_pointer,
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


#IMPORTANT : Updating the current date happens in two phases.
    #1. We sync sleep and HRV data from T and save it in table and use it for our inference (along with T-1 daily summary) to generate the daily statement.
    #2. We sync daily summary data from T on the next day at 8am into the table along with the sleep and HRV data (completing the table for T).

def sync_garmin_data_today():
    
    print("")

def sync_sleep_hrv_today():
    #8am sync sleep and hrv for today (T).
    print("")

def sync_daily_summary_yesterdays():
    #sleep and hrv are already present. just need to update the daily summary data. (8am T-1)
    print("")

def ready_for_inference():
    #on T 8am ready for inference with sleep and hrv data from T and daily summary data from T-1.
    print("")

def get_garmin_data(garmin_device):

    # url = "/web-gateway/device-info/primary-training-device"
    # device_data = garth.connectapi(url)
    print("DEVICE DATA", type(garmin_device.display_name))

    
     
    

def garmin_delete_token():
    #delete device data
    #delete device 
    print("GARMIN REMOVED")