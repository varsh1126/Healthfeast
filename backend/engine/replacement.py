"""
Food Replacement Engine for HealthFeast.
Finds nutritionally compatible alternative meals and foods when a user requests a substitution.
Considers calories, protein, allergens, dietary preferences, health conditions, budget, and prep time.
"""

from typing import List, Dict, Any, Optional
from .safety_rules import validate_meal_safety


def calculate_nutritional_similarity(target: Dict[str, Any], candidate: Dict[str, Any]) -> float:
    """
    Computes nutritional affinity score (0 to 100) based on calorie and macronutrient parity.
    Higher score indicates closer macro equivalence.
    """
    target_cals = float(target.get("calories", 300))
    cand_cals = float(candidate.get("calories", 300))
    cal_diff = abs(target_cals - cand_cals)
    cal_score = max(0.0, 40.0 - (cal_diff / target_cals) * 40.0) if target_cals > 0 else 20.0

    target_prot = float(target.get("protein_g", 15))
    cand_prot = float(candidate.get("protein_g", 15))
    prot_diff = abs(target_prot - cand_prot)
    prot_score = max(0.0, 30.0 - (prot_diff / max(1.0, target_prot)) * 30.0)

    target_fiber = float(target.get("fiber_g", 4))
    cand_fiber = float(candidate.get("fiber_g", 4))
    fiber_score = 15.0 if cand_fiber >= target_fiber else max(0.0, 15.0 - (target_fiber - cand_fiber) * 3)

    base_score = cal_score + prot_score + fiber_score + 15.0
    return round(min(100.0, max(0.0, base_score)), 1)


def find_replacements(
    current_food: Dict[str, Any],
    candidate_foods: List[Dict[str, Any]],
    user_profile: Dict[str, Any],
    limit: int = 5
) -> List[Dict[str, Any]]:
    """
    Filters and ranks viable replacements for a specific food or meal item.
    """
    valid_candidates = []
    target_id = current_food.get("id")
    target_category = current_food.get("category", "")

    for food in candidate_foods:
        # Do not suggest the exact same food
        if food.get("id") == target_id or food.get("name") == current_food.get("name"):
            continue

        # 1. Deterministic safety validation
        is_safe, violations = validate_meal_safety(food, user_profile)
        if not is_safe:
            continue

        # 2. Check cooking time preference
        prep_time = food.get("preparation_time_mins", 20)
        cook_pref = user_profile.get("cooking_time_pref", "moderate_under_45")
        if cook_pref == "quick_under_20" and prep_time > 25:
            continue

        # 3. Check Category alignment (e.g. breakfast replaces breakfast, or compatible snacks)
        if target_category and food.get("category") != target_category:
            # allow flexible snacks
            if not ("snack" in target_category and "snack" in food.get("category", "")):
                continue

        # 4. Compute similarity and compatibility score
        similarity_score = calculate_nutritional_similarity(current_food, food)

        cal_delta = round(float(food.get("calories", 0)) - float(current_food.get("calories", 0)), 1)
        prot_delta = round(float(food.get("protein_g", 0)) - float(current_food.get("protein_g", 0)), 1)

        valid_candidates.append({
            "food": food,
            "similarity_score": similarity_score,
            "calorie_difference": cal_delta,
            "protein_difference": prot_delta,
            "reason": (
                f"Nutritionally compatible: {cal_delta:+} kcal, {prot_delta:+}g protein. "
                f"Respects your {user_profile.get('diet_type', 'dietary')} preferences."
            )
        })

    # Sort candidates by similarity score descending
    valid_candidates.sort(key=lambda x: x["similarity_score"], reverse=True)
    return valid_candidates[:limit]
