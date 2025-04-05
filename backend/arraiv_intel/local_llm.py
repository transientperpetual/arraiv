from openai import OpenAI




def local_llm(query):
    print("QRC : ", query)
    try:
        client = OpenAI(
            base_url='http://localhost:11434/v1/',

            # required but ignored
            api_key='ollama',
        )
        response = client.chat.completions.create(
            model="llama3.2",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": "What is the relation between stress and hrv status?"},
                # {"role": "assistant", "content": "The capital of France is Paris."},
                # {"role": "user", "content": "When was it declared as the capital?"},
        
            ],
            max_tokens=100,
        )
        print(response.choices[0].message.content)
    except Exception as e:
        print("LLM ERROR : ",e)