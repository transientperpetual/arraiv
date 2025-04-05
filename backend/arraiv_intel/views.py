from django.shortcuts import render
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .local_llm import local_llm

# Create your views here.

@csrf_exempt
def arraiv_llm(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            query = data.get('query')

            local_llm(query)


            # You can process/store data here
            return JsonResponse({'message': f'Query recieved '}, status=200)
        
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
