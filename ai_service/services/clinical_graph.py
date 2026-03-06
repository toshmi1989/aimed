import json
import os

GRAPH_PATH = os.path.join(os.path.dirname(__file__), "..", "knowledge", "symptom_graph.json")

class ClinicalGraphEngine:
    def __init__(self):
        try:
            with open(GRAPH_PATH, "r", encoding="utf-8") as f:
                self.graph = json.load(f)
        except Exception as e:
            print(f"Warning: Failed to load symptom graph: {e}")
            self.graph = {}

    def query_symptoms(self, symptoms: list[str]) -> dict:
        """
        Takes a list of symptoms, checks the ontology, and returns combined 
        systems, conditions, and tests deterministically.
        """
        combined_result = {
            "systems": set(),
            "possible_conditions": set(),
            "recommended_tests": set()
        }
        
        for symptom in symptoms:
            # Simple keyword matching for MVP. 
            # In production, use NLP embeddings or Synonyms mapping here.
            for graph_symptom, data in self.graph.items():
                if graph_symptom in symptom.lower() or symptom.lower() in graph_symptom:
                    combined_result["systems"].update(data.get("systems", []))
                    combined_result["possible_conditions"].update(data.get("possible_conditions", []))
                    combined_result["recommended_tests"].update(data.get("recommended_tests", []))
                    
        return {
            "systems": list(combined_result["systems"]),
            "possible_conditions": list(combined_result["possible_conditions"]),
            "recommended_tests": list(combined_result["recommended_tests"])
        }
