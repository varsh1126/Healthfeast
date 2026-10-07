"""
Adaptive AI Engine for HealthFeast.
Learns from user interactions, meal tracking, skipped dishes, replacements, and ratings.
Dynamically updates food affinity scores and generates weekly adaptive reviews.
"""

from typing import Dict, Any, List
from datetime import datetime, timedelta


def analyze_user_behavior_and_adapt(
    user_profile: Dict[str, Any],
    recent_food_logs: List[Dict[str, Any]],
    skipped_meals: List[Dict[str, Any]],
    replaced_items: List[Dict[str, Any]],
    user_feedbacks: List[Dict[str, Any]],
    recent_weights: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Synthesizes behavioral signals to produce an adaptive profile update and weekly review.
    """
    adaptations = {
        "food_penalties": [],       # Foods to deprioritize
        "food_boosts": [],          # Foods to recommend more frequently
        "quick_meals_needed": False,
        "breakfast_simplified": False,
        "insights": [],
        "recommendations_next_week": []
    }

    # 1. Analyze Food Replacements
    replacement_counts: Dict[str, int] = {}
    for rep in replaced_items:
        food_name = rep.get("original_food_name", "").lower()
        if food_name:
            replacement_counts[food_name] = replacement_counts.get(food_name, 0) + 1

    for food_name, count in replacement_counts.items():
        if count >= 2:
            adaptations["food_penalties"].append(food_name)
            adaptations["insights"].append(
                f"You replaced '{food_name}' {count} times this week. We have reduced its frequency in upcoming meal plans."
            )

    # 2. Analyze Feedback & Ratings
    low_rated_foods = []
    high_rated_foods = []
    time_complaint_count = 0

    for fb in user_feedbacks:
        rating = fb.get("rating", 3)
        food_name = fb.get("food_name", "").lower()
        reason = fb.get("reason", "")

        if rating <= 2 and food_name:
            low_rated_foods.append(food_name)
        elif rating >= 4 and food_name:
            high_rated_foods.append(food_name)

        if reason == "took_too_long" or "long" in fb.get("comment", "").lower():
            time_complaint_count += 1

    adaptations["food_penalties"].extend([f for f in low_rated_foods if f not in adaptations["food_penalties"]])
    adaptations["food_boosts"].extend(list(set(high_rated_foods)))

    if time_complaint_count >= 1:
        adaptations["quick_meals_needed"] = True
        adaptations["insights"].append(
            "You noted that meal preparation took too long. Next week's plan emphasizes quick, under-20-minute recipes."
        )

    # 3. Analyze Skipped Meals
    skipped_types: Dict[str, int] = {}
    for skip in skipped_meals:
        mtype = skip.get("meal_type", "").lower()
        if mtype:
            skipped_types[mtype] = skipped_types.get(mtype, 0) + 1

    if skipped_types.get("breakfast", 0) >= 2:
        adaptations["breakfast_simplified"] = True
        adaptations["insights"].append(
            "Breakfast was skipped multiple days. We're prioritizing ultra-portable, minimal-prep breakfasts (e.g. smoothies, roasted chana, fruits)."
        )

    # 4. Weight Trend Analysis
    if len(recent_weights) >= 2:
        start_w = float(recent_weights[0].get("weight_kg", 0))
        end_w = float(recent_weights[-1].get("weight_kg", 0))
        delta = round(end_w - start_w, 1)
        goal = user_profile.get("fitness_goal", "").lower()

        if "lose" in goal:
            if delta < -0.2:
                adaptations["insights"].append(f"Steady weight reduction progress of {abs(delta)} kg observed. Calorie targets remain well-calibrated.")
            elif delta > 0.5:
                adaptations["insights"].append("Weight has fluctuated slightly upward. Focus on tracking liquid calories and evening snack portions.")
        elif "gain" in goal or "muscle" in goal:
            if delta > 0.2:
                adaptations["insights"].append(f"Weight increase of {delta} kg noted, supporting your hypertrophy goals.")

    # 5. Summary and Next Steps
    adherence_pct = round(
        (len(recent_food_logs) / max(1, len(recent_food_logs) + len(skipped_meals))) * 100
    ) if (recent_food_logs or skipped_meals) else 85

    weekly_review = {
        "generated_at": datetime.now().isoformat(),
        "adherence_percentage": adherence_pct,
        "insights": adaptations["insights"] or ["Consistent logging maintained this week! Continue tracking to unlock deeper personalized insights."],
        "adaptations_applied": {
            "penalized_ingredients": list(set(adaptations["food_penalties"])),
            "promoted_favorites": list(set(adaptations["food_boosts"])),
            "speed_priority_enabled": adaptations["quick_meals_needed"],
            "simplified_breakfast": adaptations["breakfast_simplified"]
        },
        "next_week_focus": (
            "Focus on consistent hydration and prioritizing fiber-rich seasonal vegetables at lunch and dinner."
        )
    }

    return weekly_review
