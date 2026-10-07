"""
Personalized Recommendation & Meal Planning Engine for HealthFeast.
Generates 7-day multi-slot meal plans with diverse Indian culinary foods.
Respects caloric/macro targets, deterministic safety, budgets, prep time, and adaptive affinities.
Includes 'What Can I Eat?' pantry ingredient and craving matcher.
"""

from typing import List, Dict, Any, Optional
import random
from .safety_rules import validate_meal_safety
from .nutrition_math import calculate_nutrition_targets


MEAL_SLOT_CONFIG = {
    3: [
        {"type": "breakfast", "title": "Breakfast", "calorie_pct": 0.30, "time": "08:30 AM"},
        {"type": "lunch", "title": "Lunch", "calorie_pct": 0.40, "time": "01:30 PM"},
        {"type": "dinner", "title": "Dinner", "calorie_pct": 0.30, "time": "08:30 PM"},
    ],
    4: [
        {"type": "breakfast", "title": "Breakfast", "calorie_pct": 0.25, "time": "08:30 AM"},
        {"type": "lunch", "title": "Lunch", "calorie_pct": 0.35, "time": "01:30 PM"},
        {"type": "evening_snack", "title": "Evening Snack", "calorie_pct": 0.15, "time": "05:30 PM"},
        {"type": "dinner", "title": "Dinner", "calorie_pct": 0.25, "time": "08:30 PM"},
    ],
    5: [
        {"type": "breakfast", "title": "Breakfast", "calorie_pct": 0.25, "time": "08:30 AM"},
        {"type": "mid_morning_snack", "title": "Mid-Morning Refresh", "calorie_pct": 0.10, "time": "11:00 AM"},
        {"type": "lunch", "title": "Lunch", "calorie_pct": 0.30, "time": "01:30 PM"},
        {"type": "evening_snack", "title": "Evening Snack", "calorie_pct": 0.10, "time": "05:30 PM"},
        {"type": "dinner", "title": "Dinner", "calorie_pct": 0.25, "time": "08:30 PM"},
    ]
}

DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]


def score_food_for_user(
    food: Dict[str, Any],
    target_calories: float,
    user_profile: Dict[str, Any],
    adaptive_prefs: Optional[Dict[str, Any]] = None
) -> float:
    """
    Ranks foods based on proximity to target meal calories, user budget,
    goal alignment, preparation time, and adaptive affinity.
    """
    score = 100.0

    # 1. Calorie proximity
    food_cals = float(food.get("calories", 300))
    cal_diff = abs(food_cals - target_calories)
    score -= min(40.0, (cal_diff / max(1.0, target_calories)) * 40.0)

    # 2. Budget adherence
    daily_budget = float(user_profile.get("daily_budget_inr", 250))
    food_cost = float(food.get("estimated_cost_inr", 35))
    if food_cost > (daily_budget * 0.45):
        score -= 20.0  # Penalize disproportionately expensive single items

    # 3. Goal alignment
    goal = (user_profile.get("fitness_goal", "")).lower()
    protein_g = float(food.get("protein_g", 0))
    if ("muscle" in goal or "gain" in goal) and protein_g >= 12:
        score += 15.0
    elif ("lose" in goal or "fat" in goal) and float(food.get("fiber_g", 0)) >= 5:
        score += 12.0
    elif "skin" in goal:
        micros = food.get("micronutrients", {})
        if micros.get("vitamin_c_mg", 0) > 15 or micros.get("omega_3_g", 0) > 0.2:
            score += 15.0

    # 4. Preparation time preference
    cook_pref = user_profile.get("cooking_time_pref", "moderate_under_45")
    prep_mins = int(food.get("preparation_time_mins", 20))
    if cook_pref == "quick_under_20" and prep_mins <= 20:
        score += 10.0
    elif cook_pref == "quick_under_20" and prep_mins > 30:
        score -= 25.0

    # 5. User Favorites boost
    favorites = [f.lower() for f in user_profile.get("favorite_foods", [])]
    if any(fav in food.get("name", "").lower() for fav in favorites):
        score += 20.0

    # 6. Adaptive AI affinity modifiers
    if adaptive_prefs:
        penalties = [p.lower() for p in adaptive_prefs.get("penalized_ingredients", [])]
        boosts = [b.lower() for b in adaptive_prefs.get("promoted_favorites", [])]
        name_lower = food.get("name", "").lower()
        if any(p in name_lower for p in penalties):
            score -= 35.0
        if any(b in name_lower for b in boosts):
            score += 20.0

    return max(0.0, score)


def generate_single_meal(
    meal_type: str,
    target_cals: float,
    available_foods: List[Dict[str, Any]],
    user_profile: Dict[str, Any],
    excluded_food_ids: Optional[List[int]] = None,
    adaptive_prefs: Optional[Dict[str, Any]] = None
) -> Optional[Dict[str, Any]]:
    """
    Selects the optimal single food/dish for a given meal slot meeting all safety and nutritional rules.
    """
    excluded_ids = set(excluded_food_ids or [])
    viable_foods = []

    # Map slot types to food categories
    category_mapping = {
        "breakfast": ["breakfast", "grains"],
        "mid_morning_snack": ["fruits", "snacks", "beverages"],
        "lunch": ["lunch", "grains", "dal_protein", "vegetables"],
        "evening_snack": ["snacks", "fruits", "beverages"],
        "dinner": ["dinner", "grains", "dal_protein", "vegetables"],
        "late_snack": ["snacks", "beverages"]
    }

    allowed_cats = category_mapping.get(meal_type, ["lunch", "dinner", "breakfast", "snacks"])

    for food in available_foods:
        if food.get("id") in excluded_ids:
            continue

        # Filter by category suitability
        f_cat = food.get("category", "")
        if f_cat not in allowed_cats and f_cat not in ("grains", "dal_protein", "vegetables"):
            continue

        # Deterministic safety
        is_safe, _ = validate_meal_safety(food, user_profile)
        if not is_safe:
            continue

        score = score_food_for_user(food, target_cals, user_profile, adaptive_prefs)
        viable_foods.append((score, food))

    if not viable_foods:
        # Fallback to any safe food in catalog
        for food in available_foods:
            if food.get("id") not in excluded_ids:
                is_safe, _ = validate_meal_safety(food, user_profile)
                if is_safe:
                    viable_foods.append((50.0, food))

    if not viable_foods:
        return None

    # Sort descending and pick among top choices with slight randomization for variety
    viable_foods.sort(key=lambda x: x[0], reverse=True)
    top_candidates = viable_foods[:min(5, len(viable_foods))]
    chosen = random.choice(top_candidates)[1]

    return chosen


def generate_seven_day_plan(
    user_profile: Dict[str, Any],
    available_foods: List[Dict[str, Any]],
    adaptive_prefs: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Constructs an end-to-end Monday-through-Sunday personalized meal plan.
    Enforces meal diversity, budget bounds, and exact nutritional tracking.
    """
    targets = calculate_nutrition_targets(
        weight_kg=float(user_profile.get("weight_kg", 65)),
        height_cm=float(user_profile.get("height_cm", 165)),
        age=int(user_profile.get("age", 25)),
        gender=user_profile.get("gender", "male"),
        activity_level=user_profile.get("activity_level", "moderate"),
        goal=user_profile.get("fitness_goal", "maintain_weight"),
        skin_wellness_focus=("skin" in str(user_profile.get("fitness_goal", "")).lower())
    )

    daily_calories = targets["calories"]
    meals_per_day = int(user_profile.get("meals_per_day", 4))
    slot_defs = MEAL_SLOT_CONFIG.get(meals_per_day, MEAL_SLOT_CONFIG[4])

    weekly_plan = []
    used_food_history: List[int] = []

    for day_idx, day_name in enumerate(DAYS_OF_WEEK):
        day_meals = []
        day_cals = 0.0
        day_prot = 0.0
        day_carbs = 0.0
        day_fat = 0.0
        day_fiber = 0.0
        day_cost = 0.0

        for slot in slot_defs:
            target_slot_cals = daily_calories * slot["calorie_pct"]

            # Avoid repeating foods used recently
            recent_ids = used_food_history[-6:] if len(used_food_history) >= 6 else []
            food = generate_single_meal(
                meal_type=slot["type"],
                target_cals=target_slot_cals,
                available_foods=available_foods,
                user_profile=user_profile,
                excluded_food_ids=recent_ids,
                adaptive_prefs=adaptive_prefs
            )

            if food:
                used_food_history.append(food["id"])
                f_cals = float(food.get("calories", 0))
                f_prot = float(food.get("protein_g", 0))
                f_carbs = float(food.get("carbs_g", 0))
                f_fat = float(food.get("fat_g", 0))
                f_fib = float(food.get("fiber_g", 0))
                f_cost = float(food.get("estimated_cost_inr", 30))

                day_cals += f_cals
                day_prot += f_prot
                day_carbs += f_carbs
                day_fat += f_fat
                day_fiber += f_fib
                day_cost += f_cost

                day_meals.append({
                    "meal_type": slot["type"],
                    "meal_title": slot["title"],
                    "suggested_time": slot["time"],
                    "food": food,
                    "portion_multiplier": 1.0,
                    "serving_desc": food.get("serving_size_desc", "1 standard serving"),
                    "calories": f_cals,
                    "protein_g": f_prot,
                    "carbs_g": f_carbs,
                    "fat_g": f_fat,
                    "fiber_g": f_fib,
                    "cost_inr": f_cost,
                    "is_eaten": False,
                    "is_skipped": False
                })

        weekly_plan.append({
            "day": day_name,
            "day_index": day_idx,
            "meals": day_meals,
            "totals": {
                "calories": round(day_cals),
                "protein_g": round(day_prot, 1),
                "carbs_g": round(day_carbs, 1),
                "fat_g": round(day_fat, 1),
                "fiber_g": round(day_fiber, 1),
                "estimated_cost_inr": round(day_cost)
            }
        })

    return {
        "targets": targets,
        "weekly_plan": weekly_plan,
        "summary": {
            "daily_target_calories": daily_calories,
            "meals_per_day": meals_per_day,
            "goal": user_profile.get("fitness_goal", "maintain_weight"),
            "diet_type": user_profile.get("diet_type", "vegetarian"),
            "daily_budget_inr": user_profile.get("daily_budget_inr", 250)
        }
    }


def find_meals_by_ingredients(
    available_ingredients: List[str],
    all_foods: List[Dict[str, Any]],
    user_profile: Dict[str, Any],
    max_budget: Optional[float] = None
) -> List[Dict[str, Any]]:
    """
    'What Can I Eat?' Feature.
    Matches user pantry/fridge ingredients with nutritious compliant recipes.
    """
    matched = []
    user_ingredients_lower = [i.lower().strip() for i in available_ingredients if i.strip()]

    for food in all_foods:
        # Check safety
        is_safe, _ = validate_meal_safety(food, user_profile)
        if not is_safe:
            continue

        if max_budget and float(food.get("estimated_cost_inr", 0)) > max_budget:
            continue

        food_name = food.get("name", "").lower()
        matched_items = []
        for ing in user_ingredients_lower:
            if ing in food_name or any(ing in str(v).lower() for v in food.values()):
                matched_items.append(ing)

        if matched_items:
            match_percentage = round((len(matched_items) / max(1, len(user_ingredients_lower))) * 100)
            matched.append({
                "food": food,
                "matched_ingredients": matched_items,
                "match_percentage": match_percentage,
                "recipe_tip": f"Prepare {food.get('name')} using your {', '.join(matched_items)}."
            })

    # Sort descending by match percentage
    matched.sort(key=lambda x: x["match_percentage"], reverse=True)
    return matched[:10]
