import asyncio
import httpx
import json

async def test_reasoning_api():
    url = "http://127.0.0.1:8000/clinical/reason"
    
    payload = {
        "symptoms": ["chest pain", "shortness of breath", "sweating"],
        "anamnesis": {
            "age": 55,
            "sex": "male",
            "duration": "1 hour",
            "severity": "severe"
        }
    }

    async with httpx.AsyncClient() as client:
        print("--- Testing Clinical Reasoning Engine (with PgVector RAG) ---")
        response = await client.post(url, json=payload)
        print(f"Status: {response.status_code}")
        print(json.dumps(response.json(), indent=2))
        
if __name__ == "__main__":
    asyncio.run(test_reasoning_api())
