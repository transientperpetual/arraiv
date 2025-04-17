from django.urls import path
from healthdevice import views
from .garmin_ops import sync_garmin_historical_data


urlpatterns = [
    #user signing up / in with google
    path('device/register/garmin/', views.GarminRegistration.as_view(), name='garmin_registration'),
    path('device/garmin/', views.GarminDevice.as_view(), name='garmin_get'),
    path('device/garmin/sync', views.GarminDataSync.as_view(), name='garmin_data_sync'),
    # path("test/", views.TestView.as_view(), name="test-view"),
]