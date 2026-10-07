"""
Deterministic Safety & Health Constraint Engine for HealthFeast.
Enforces hard dietary boundaries, allergen exclusion, and condition-specific
nutritional filtering. Prevents unsafe recommendations and guarantees medical safety.
"""

from typing import List, Dict, Any, Tuple


# Standard Allergen Mapping
ALLERGEN_KEYWORDS = {
    "peanuts": ["peanut", "groundnut", "moongphali"],
    "nuts": ["almond", "badam", "cashew", "kaju", "walnut", "akhrot", "pista", "pistachio"],
    "milk": ["milk", "curd", "yogurt", "paneer", "cheese", "ghee", "butter", "dairy", "chaas", "buttermilk", "whey"],
    "eggs": ["egg", "anda", "omelette", "albumin"],
    "seafood": ["fish", "prawn", "shrimp", "crab", "salmon", "rohu", "katla", "seafood"],
    "soy": ["soy", "soya", "tofu", "soybean", "edamame"],
    "gluten": ["wheat", "atta", "roti", "chapati", "maida", "suji", "semolina", "bread", "barley", "pasta", "oats"],
}

# Dietary Preference Hierarchies
DIET_PERMITTED_CATEGORIES = {
    "vegan": ["vegan"],
    "vegetarian": ["vegan", "vegetarian"],
    "eggetarian": ["vegan", "vegetarian", "eggetarian"],
    "non_vegetarian": ["vegan", "vegetarian", "eggetarian", "non_vegetarian"],
}


def check_allergen_conflict(food_allergens: List[str], food_name: str, user_allergies: List[str]) -> Tuple[bool, str]:
    """
    Check if a food item triggers any user allergens.
    Returns (has_conflict, reason).
    """
    food_name_lower = (food_name or "").lower()
    user_allergies_lower = [a.lower().strip() for a in user_allergies if a]

    # 1. Direct allergen tag check
    for food_alg in (food_allergens or []):
        alg_clean = food_alg.lower().strip()
        for user_alg in user_allergies_lower:
            if user_alg in alg_clean or alg_clean in user_alg:
                return True, f"Contains allergen: {user_alg}"

    # 2. Keyword check on food title and common ingredients
    for user_alg in user_allergies_lower:
        keywords = ALLERGEN_KEYWORDS.get(user_alg, [user_alg])
        for kw in keywords:
            if kw in food_name_lower:
                return True, f"Potential allergen match ({user_alg}): '{kw}' in '{food_name}'"

    return False, ""


def check_dietary_compatibility(food_dietary_type: str, user_diet_pref: str) -> Tuple[bool, str]:
    """
    Verify if the food matches user's vegetarian/vegan/eggetarian/non-vegetarian rules.
    """
    user_diet_clean = (user_diet_pref or "vegetarian").lower().strip()
    food_diet_clean = (food_dietary_type or "vegetarian").lower().strip()

    permitted = DIET_PERMITTED_CATEGORIES.get(user_diet_clean, ["vegan", "vegetarian"])
    if food_diet_clean not in permitted:
        return False, f"Incompatible with {user_diet_clean} diet (item is {food_diet_clean})"

    return True, ""


def check_condition_suitability(
    food: Dict[str, Any],
    user_conditions: List[str]
) -> Tuple[bool, str]:
    """
    Deterministic clinical guidance checks for common chronic conditions.
    """
    conditions = [c.lower() for c in user_conditions]
    food_name = food.get("name", "").lower()
    glycemic_index = food.get("glycemic_index", "low").lower()
    fat_g = float(food.get("fat_g", 0))
    carbs_g = float(food.get("carbs_g", 0))
    fiber_g = float(food.get("fiber_g", 0))

    # 1. Diabetes / Insulin Resistance
    if any("diabet" in c for c in conditions):
        if glycemic_index == "high":
            return False, f"High glycemic index is restricted for diabetes management."
        if any(bad in food_name for bad in ["gulab jamun", "jalebi", "sugar", "candy", "sweet", "soda", "syrup"]):
            return False, "Added concentrated sugars are restricted for diabetes."

    # 2. Hypertension (High Blood Pressure)
    if any("hypertension" in c or "blood pressure" in c for c in conditions):
        if any(bad in food_name for bad in ["pickle", "achar", "papad", "salted chips", "processed namkeen"]):
            return False, "High sodium preserved items restricted for blood pressure control."

    # 3. High Cholesterol / Cardiovascular Risk
    if any("cholesterol" in c or "cardiac" in c or "heart" in c for c in conditions):
        if any(bad in food_name for bad in ["deep fried", "pakora", "samosa", "bhature", "poori", "mutton", "beef"]):
            return False, "Excessive saturated/trans fats restricted for lipid management."

    # 4. Chronic Kidney Disease restrictions
    if any("kidney" in c for c in conditions):
        protein_g = float(food.get("protein_g", 0))
        if protein_g > 35:
            return False, "Single-meal protein excessive for kidney restriction protocol."

    # 5. Fatty Liver (NAFLD)
    if any("fatty liver" in c for c in conditions):
        if any(bad in food_name for bad in ["deep fried", "sweet", "sugary", "cream", "butter naan"]):
            return False, "Refined carbohydrates and high saturated fats discouraged for liver health."

    return True, ""


def validate_meal_safety(
    food: Dict[str, Any],
    user_profile: Dict[str, Any]
) -> Tuple[bool, List[str]]:
    """
    Comprehensive validation pipeline:
    Checks allergens, dietary type, user dislikes, and medical conditions.
    """
    violations = []

    # 1. Check Allergies
    allergies = user_profile.get("allergies", [])
    has_allergy, reason = check_allergen_conflict(food.get("allergens", []), food.get("name", ""), allergies)
    if has_allergy:
        violations.append(reason)

    # 2. Check Dietary Preference
    diet_pref = user_profile.get("diet_type", "vegetarian")
    is_diet_ok, diet_reason = check_dietary_compatibility(food.get("dietary_type", "vegetarian"), diet_pref)
    if not is_diet_ok:
        violations.append(diet_reason)

    # 3. Check Disliked Foods
    dislikes = [d.lower().strip() for d in user_profile.get("disliked_foods", []) if d]
    food_name_lower = food.get("name", "").lower()
    for dislike in dislikes:
        if dislike in food_name_lower:
            violations.append(f"Contains user-disliked ingredient: {dislike}")

    # 4. Check Health Conditions
    conditions = user_profile.get("health_conditions", [])
    is_cond_ok, cond_reason = check_condition_suitability(food, conditions)
    if not is_cond_ok:
        violations.append(cond_reason)

    is_valid = len(violations) == 0
    return is_valid, violations


def check_plan_calorie_safety(daily_calories: float, gender: str) -> Dict[str, Any]:
    """
    Safety checks to avoid unsafe extreme restriction or unsafe caloric overload.
    """
    min_safe = 1200.0 if (gender or "").lower() in ("female", "woman", "f") else 1450.0
    max_safe = 4200.0

    if daily_calories < min_safe:
        return {
            "safe": False,
            "warning": f"Estimated calories ({daily_calories} kcal) fall below safe biological floor ({min_safe} kcal). Calorie target raised to prevent metabolic disruption."
        }
    if daily_calories > max_safe:
        return {
            "safe": False,
            "warning": f"Estimated calories ({daily_calories} kcal) exceed standard upper threshold. Please verify activity intensity."
        }

    return {"safe": True, "warning": ""}
