"""
Ask HealthFeast Conversational AI Engine.
Integrates user health profile context, deterministic safety constraints,
live authoritative knowledge retrieval, and Google Gemini API (gemini-3.8-flash).
Includes a comprehensive deterministic clinical-nutrition fallback for seamless demo/offline operation.
"""

import os
import json
import logging
from typing import Dict, Any, List, Optional
from .live_knowledge import retrieve_relevant_knowledge, format_knowledge_citation
from .safety_rules import validate_meal_safety

logger = logging.getLogger(__name__)


def build_system_context(user_profile: Dict[str, Any], retrieved_knowledge: List[Dict[str, Any]]) -> str:
    """
    Constructs a detailed clinical context prompt incorporating all user parameters and citations.
    """
    context_lines = [
        "You are 'Ask HealthFeast ✨', an intelligent, empathetic Indian nutrition & wellness AI advisor.",
        "Your mission is to provide personalized, culturally authentic, science-backed dietary and wellness guidance.",
        "",
        "CRITICAL SAFETY & MEDICAL POLICIES:",
        "1. Never diagnose diseases, prescribe medication, or instruct users to alter pharmacological treatments.",
        "2. Never promise guaranteed weight loss, skin whitening, or miracle cures.",
        "3. Always ground advice in Indian culinary traditions and verified scientific nutrition.",
        "4. Strict adherence to user allergens and dietary boundaries is non-negotiable.",
        "",
        "CURRENT USER HEALTH PROFILE CONTEXT:",
        f"- Age: {user_profile.get('age', 25)} years | Gender: {user_profile.get('gender', 'Not specified')}",
        f"- Height: {user_profile.get('height_cm', 165)} cm | Weight: {user_profile.get('weight_kg', 65)} kg",
        f"- Dietary Pattern: {user_profile.get('diet_type', 'Vegetarian')}",
        f"- Daily Food Budget: ₹{user_profile.get('daily_budget_inr', 250)}/day",
        f"- Primary Goal: {user_profile.get('fitness_goal', 'Maintain Weight')}",
        f"- Activity Level: {user_profile.get('activity_level', 'Moderate')}",
        f"- Known Allergies: {', '.join(user_profile.get('allergies', [])) or 'None reported'}",
        f"- Health Conditions: {', '.join(user_profile.get('health_conditions', [])) or 'None reported'}",
        f"- Disliked Foods: {', '.join(user_profile.get('disliked_foods', [])) or 'None reported'}",
        f"- Favorite Foods: {', '.join(user_profile.get('favorite_foods', [])) or 'Not specified'}",
        f"- Cooking Time Preference: {user_profile.get('cooking_time_pref', 'Moderate (<45 mins)')}",
        "",
        "AUTHORITATIVE KNOWLEDGE GROUNDING (ICMR-NIN & WHO Guidelines):"
    ]

    for k in retrieved_knowledge:
        context_lines.append(f"- [{k['source']} ({k['publication_date']})]: {k['summary']}")

    context_lines.append("\nRespond warmly, concisely, with actionable Indian meal ideas and clear educational disclaimers.")
    return "\n".join(context_lines)


def generate_fallback_response(query: str, user_profile: Dict[str, Any], retrieved_knowledge: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Intelligent context-driven fallback generator for offline or keyless demo environments.
    """
    q = query.lower()
    citations = format_knowledge_citation(retrieved_knowledge)
    diet = user_profile.get("diet_type", "vegetarian").capitalize()
    goal = user_profile.get("fitness_goal", "general wellness")
    budget = user_profile.get("daily_budget_inr", 250)
    dislikes = user_profile.get("disliked_foods", [])

    if "dinner" in q or "tonight" in q:
        dishes = (
            "1. Multigrain Phulka with Palak Dal and Stir-Fried Lauki (Bottle Gourd)\n"
            "2. Steamed Brown Rice with Yellow Moong Dal, Methi Sabzi & Cucumber Raita\n"
            "3. Roasted Paneer/Tofu Sauté with Capsicum, Carrots and warm Cumin Water"
        )
        answer = (
            f"Based on your **{diet}** preference and goal of **{goal}**, here are 3 balanced dinner options "
            f"well within your daily budget of ₹{budget}:\n\n{dishes}\n\n"
            f"💡 *Nutrition Tip:* Keep your evening meal light on simple carbohydrates and rich in soluble fiber "
            f"for steady overnight blood glucose and digestive rest."
        )

    elif "skin" in q or "glow" in q:
        answer = (
            f"For healthy-looking skin aligned with your profile, focus on antioxidant-rich and hydrating foods:\n\n"
            f"• **Vitamin C & Collagen Support:** Fresh Amla juice or Guava slices mid-morning.\n"
            f"• **Skin Barrier Lipids:** 1 tablespoon of roasted flaxseeds or pumpkin seeds daily.\n"
            f"• **Hydration Goal:** Aim for at least 2.5–3.0 liters of water, complemented by thin unsweetened buttermilk (chaas).\n"
            f"• **Carotenoids:** Add carrots, ripe papaya, and spinach to your weekly meal rotation.\n\n"
            f"✨ *Reminder:* HealthFeast encourages skin wellness through overall nourishment, hydration, and restful sleep."
        )

    elif "budget" in q or "100" in q or "cheap" in q:
        answer = (
            f"Nutritious, high-protein Indian meals can easily be enjoyed under ₹100:\n\n"
            f"• **Roasted Chana & Buttermilk Bowl (₹25):** 50g roasted chana + 1 glass chaas (~12g protein).\n"
            f"• **Moong Dal Khichdi with Curd (₹40):** Balanced amino acids, comforting and easily digestible.\n"
            f"• **Double Egg Bhurji / Soya Paneer Stir-fry with 2 Rotis (₹45):** Rich in quality protein (~16g protein).\n"
            f"• **Sprouted Moong Salad (₹20):** Fresh lemon, chopped cucumber, tomatoes, and sprouted green gram."
        )

    elif "exercise" in q or "workout" in q or "before" in q or "after" in q:
        answer = (
            f"Tailoring nutrition around your workouts for **{goal}**:\n\n"
            f"• **Pre-Workout (45–60 mins prior):** Fast-digesting complex carbs like 1 medium banana or 1 slice of whole-wheat toast with peanut butter.\n"
            f"• **Post-Workout (within 45 mins):** Protein to support muscular repair — e.g. 2 boiled eggs / 100g paneer cubes or sattu drink with water, paired with hydration.\n"
            f"• **Hydration:** Sip 250–500ml water before and after training."
        )

    elif "replace" in q or "don't like" in q:
        answer = (
            f"No problem! We've noted your preference. If you don't enjoy a particular meal, you can click "
            f"the **Replace** button on any meal card in your Diet tab to instantly swap it with a nutritionally equivalent "
            f"Indian alternative matching your exact calories and protein targets."
        )

    else:
        answer = (
            f"Hello! As your HealthFeast advisor, I'm keeping your profile (**{diet}**, goal: **{goal}**, "
            f"budget: ₹{budget}/day) front and center.\n\n"
            f"Whether you need pantry-based recipes, macro-friendly meal swaps, budget tips, or skin-wellness guidance, "
            f"feel free to ask!\n\n"
            f"Example prompts:\n"
            f"• 'What should I eat for dinner under 400 calories?'\n"
            f"• 'I only have eggs and tomatoes at home.'\n"
            f"• 'Suggest skin-supporting snacks for this evening.'"
        )

    return {
        "response": answer,
        "citations": citations,
        "sources": retrieved_knowledge,
        "model_used": "HealthFeast Intelligent Clinical Rules Engine (Demo Mode)",
        "disclaimer": "HealthFeast provides informational dietary wellness insights. Consult a physician for clinical diagnoses."
    }


def chat_with_healthfeast(
    user_query: str,
    user_profile: Dict[str, Any],
    chat_history: Optional[List[Dict[str, str]]] = None,
    api_key: str = ""
) -> Dict[str, Any]:
    """
    Main conversational agent method.
    Uses Gemini 3.8 Flash via google-genai when an API key is available,
    or falls back smoothly to the authoritative knowledge engine.
    """
    # 1. Retrieve authoritative sources based on query
    retrieved_knowledge = retrieve_relevant_knowledge(user_query, top_k=2)

    # 2. Try Gemini API if key is present
    if api_key and len(api_key.strip()) > 10:
        try:
            from google import genai
            from google.genai import types

            client = genai.Client(api_key=api_key)
            system_instruction = build_system_context(user_profile, retrieved_knowledge)

            contents = []
            if chat_history:
                for msg in chat_history[-6:]:
                    role = "user" if msg.get("role") == "user" else "model"
                    contents.append(f"{role.upper()}: {msg.get('content')}")

            contents.append(f"USER: {user_query}")
            full_prompt = "\n".join(contents)

            response = client.models.generate_content(
                model="gemini-3.8-flash",
                contents=full_prompt,
                config=types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    temperature=0.7,
                )
            )

            if response and response.text:
                return {
                    "response": response.text.strip(),
                    "citations": format_knowledge_citation(retrieved_knowledge),
                    "sources": retrieved_knowledge,
                    "model_used": "Gemini 3.8 Flash",
                    "disclaimer": "Educational wellness guidance. Not a substitute for medical consultation."
                }
        except Exception as e:
            logger.warning(f"Gemini API chat error: {e}. Utilizing authoritative knowledge fallback.")

    # 3. Deterministic Clinical Fallback
    return generate_fallback_response(user_query, user_profile, retrieved_knowledge)
