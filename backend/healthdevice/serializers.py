from rest_framework import serializers
from .models import DailyMetrics, HealthDevice

class HealthDeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthDevice
        fields = ['device_name', 'device_brand', 'registered_date', 'display_name', 'token_string' ]
        
class DailyMetricsSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyMetrics
        fields = '__all__'