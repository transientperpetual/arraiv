from django.contrib import admin
from .models import HealthDevice, DailyMetrics

# Register your models here.
@admin.register(HealthDevice)
class HealthDeviceAdmin(admin.ModelAdmin):
    list_display = ["user", "device_brand", "device_name"]
    search_fields = ["user__username", "device_brand", "device_name"]

@admin.register(DailyMetrics)
class DailyMetricsAdmin(admin.ModelAdmin):
    list_display = ["device", "date", "steps", "calories", "sleep_score", "sleep_hrv", "stress"]
    list_filter = ["date", "device"]
    search_fields = ["device__user__username"]