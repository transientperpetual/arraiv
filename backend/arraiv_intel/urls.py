from django.urls import path
from arraiv_intel import views


urlpatterns = [
    #user signing up / in with google
    path('assistant/', views.arraiv_llm, name='arraiv_llm'),
]