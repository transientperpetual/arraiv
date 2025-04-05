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
            model = data.get('infModel')

            inferernce = local_llm(query, model)

            # You can process/store data here
            return JsonResponse({'Inference': inferernce}, status=200)
        
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
