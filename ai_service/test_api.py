import asyncio
import httpx
import json

async def test_triage_api():
    url = "http://127.0.0.1:8000/triage/"
    
    # Test 1: Moderate Risk
    payload_moderate = {
        "symptoms": ["cough", "fatigue", "fever"],
        "anamnesis": {
            "age": 32,
            "sex": "male",
            "duration": "2 days",
            "severity": "moderate"
        }
    }
    
    # Test 2: Emergency Risk
    payload_emergency = {
        "symptoms": ["severe chest pain", "shortness of breath", "sweating"],
        "anamnesis": {
            "age": 55,
            "sex": "male",
            "duration": "1 hour",
            "severity": "severe",
            "chronic_conditions": ["hypertension"]
        }
    }

    async with httpx.AsyncClient() as client:
        print("--- Testing Moderate Case ---")
        response1 = await client.post(url, json=payload_moderate)
        print(f"Status: {response1.status_code}")
        print(json.dumps(response1.json(), indent=2))
        
        print("\n--- Testing Emergency Case ---")
        response2 = await client.post(url, json=payload_emergency)
        print(f"Status: {response2.status_code}")
        print(json.dumps(response2.json(), indent=2))

if __name__ == "__main__":
    asyncio.run(test_triage_api())
