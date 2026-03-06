import asyncio
import httpx
import json

async def test_labs_api():
    url = "http://127.0.0.1:8000/labs/analyze"
    
    payload = {
        "lab_values": {
            "hemoglobin": 10.5,
            "leukocytes": 14.2,
            "glucose": 5.0,
            "cholesterol": 200 # Unknown to current references just to test fallback
        },
        "patient_info": {
            "age": 35,
            "sex": "female"
        }
    }

    async with httpx.AsyncClient() as client:
        print("--- Testing Lab Interpreter ---")
        response = await client.post(url, json=payload)
        print(f"Status: {response.status_code}")
        print(json.dumps(response.json(), indent=2))
        
if __name__ == "__main__":
    asyncio.run(test_labs_api())
