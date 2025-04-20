from django.db import models
from users.models import ArraivUser


class HealthDevice(models.Model):
    user = models.OneToOneField(ArraivUser, on_delete=models.CASCADE, primary_key=True, related_name="health_device",)
    device_brand = models.CharField(max_length=50)
    device_name = models.CharField(max_length=100)
    display_name = models.CharField(max_length=150)
    token_string = models.TextField()
    
    def __str__(self):
        return f"{self.device_name} ({self.device_brand})"

class DailyMetrics(models.Model):
    device = models.ForeignKey(HealthDevice, on_delete=models.CASCADE, related_name="metrics")
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    steps = models.PositiveIntegerField(null=True, blank=True)
    calories = models.FloatField(null=True, blank=True)
    body_battery = models.PositiveIntegerField(null=True, blank=True)
    sleep_score = models.PositiveIntegerField(null=True, blank=True)
    sleep_hrv = models.FloatField(null=True, blank=True)
    sleep_deep = models.PositiveIntegerField(null=True, blank=True)
    sleep_rem = models.PositiveIntegerField(null=True, blank=True)
    sleep_light = models.PositiveIntegerField(null=True, blank=True)
    sleep_stress = models.FloatField(null=True, blank=True)
    resting_heart_rate = models.PositiveIntegerField(null=True, blank=True)

    weekly_avg_hrv = models.PositiveIntegerField(null=True, blank=True)
    hrv_baseline_low = models.PositiveIntegerField(null=True, blank=True)
    hrv_baseline_high = models.PositiveIntegerField(null=True, blank=True)
    hrv_status = models.CharField(max_length=30, null=True, blank=True)
    
    moderate_intensity_minutes = models.PositiveIntegerField(null=True, blank=True)
    vigorous_intensity_minutes = models.PositiveIntegerField(null=True, blank=True)
    
    stress = models.PositiveIntegerField(null=True, blank=True)
    resting_stress = models.PositiveIntegerField(null=True, blank=True)
    low_stress = models.PositiveIntegerField(null=True, blank=True)
    medium_stress = models.PositiveIntegerField(null=True, blank=True)
    high_stress = models.PositiveIntegerField(null=True, blank=True)
    stress_status = models.CharField(max_length=30, null=True, blank=True)

    
    
    class Meta:
        # Ensure only one entry per device per date
        unique_together = ["device", "date"]
        
        indexes = [
            models.Index(fields=["device"]),  # Index on device (foreign key)
            models.Index(fields=["date"]),    # Index on date
            models.Index(fields=["device", "date"]),  # Composite index for queries filtering by both
        ]

    def __str__(self):
        return f"Metrics for {self.device} on {self.date}"


    
