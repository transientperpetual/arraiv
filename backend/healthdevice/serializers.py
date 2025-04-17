from rest_framework import serializers
from .models import HealthDevice

class HealthDeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthDevice
        fields = ['device_brand', 'device_name', 'display_name', 'token_string',]
        
        