from openai import OpenAI
from django.http import JsonResponse



def local_llm(query, model):
    print("QRC : ", query, model)
    try:
        client = OpenAI(
            base_url='http://localhost:11434/v1/',

            # required but ignored
            api_key='ollama',
        )
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": "You are a helpful assistant. You must answer in under 100 words"},
                {"role": "user", "content": f'{query}'},
                # {"role": "assistant", "content": "The capital of France is Paris."},
                # {"role": "user", "content": "When was it declared as the capital?"},
        
            ],
            max_tokens=300,
        )

        print(response)
        inference = response.choices[0].message.content

        #send the response to the client
        # return JsonResponse({'inference': readable_res}, status=200)

        return inference
    
    except Exception as e:
        print("LLM ERROR : ",e)