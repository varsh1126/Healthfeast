"""
Nutrition Mathematical Engine for HealthFeast.
Implements Mifflin-St Jeor BMR, TDEE, macronutrient distributions,
hydration estimates, fiber targets, and BMI screening metrics.
All calculations are explicitly marked as scientific estimates.
"""

from typing import Dict, Any, Optional


def calculate_bmi(weight_kg: float, height_cm: float) -> Dict[str, Any]:
    """
    Calculate Body Mass Index (BMI) and categorization.
    Note: BMI is a screening metric, not a diagnostic measure of body composition or clinical health.
    """
    if height_cm <= 0 or weight_kg <= 0:
        return {"bmi": 0.0, "category": "Unknown", "status_color": "gray"}

    height_m = height_cm / 100.0
    bmi = round(weight_kg / (height_m ** 2), 1)

    # WHO Standard / Asian Indian Context Screening Ranges
    if bmi < 18.5:
        category = "Underweight"
        color = "#3b82f6"  # Blue
        guidance = "Focus on nutrient-dense foods, healthy fats, and adequate protein."
    elif 18.5 <= bmi < 23.0:
        category = "Normal (Optimal Indian Range)"
        color = "#10b981"  # Emerald Green
        guidance = "Maintain balanced nutrition, regular physical activity, and whole foods."
    elif 23.0 <= bmi < 25.0:
        category = "Normal / Mildly Elevated"
        color = "#10b981"
        guidance = "Good baseline; focus on metabolic health, portion control, and fiber."
    elif 25.0 <= bmi < 30.0:
        category = "Overweight"
        color = "#f59e0b"  # Amber
        guidance = "Consider a gradual calorie deficit, high-fiber carbohydrates, and regular cardio/strength."
    else:
        category = "Obesity Class"
        color = "#ef4444"  # Red
        guidance = "Gradual, sustainable lifestyle modifications. Consult a physician for personalized guidance."

    return {
        "bmi": bmi,
        "category": category,
        "color": color,
        "guidance": guidance,
        "is_screening_metric": True
    }


def calculate_bmr(weight_kg: float, height_cm: float, age: int, gender: str) -> float:
    """
    Calculate Basal Metabolic Rate (BMR) using the validated Mifflin-St Jeor equation.
    Men:   10 * W(kg) + 6.25 * H(cm) - 5 * A(years) + 5
    Women: 10 * W(kg) + 6.25 * H(cm) - 5 * A(years) - 161
    Other/Neutral: 10 * W(kg) + 6.25 * H(cm) - 5 * A(years) - 78
    """
    base = 10 * weight_kg + 6.25 * height_cm - 5 * age
    g = (gender or "").lower()

    if g in ("male", "man", "m"):
        bmr = base + 5
    elif g in ("female", "woman", "f"):
        bmr = base - 161
    else:
        bmr = base - 78

    return max(900.0, round(bmr, 1))


def calculate_tdee(bmr: float, activity_level: str) -> float:
    """
    Estimate Total Daily Energy Expenditure (TDEE) based on physical activity factor.
    """
    multipliers = {
        "sedentary": 1.2,          # Little or no exercise, desk job
        "light": 1.375,            # Light exercise 1-3 days/week
        "moderate": 1.55,          # Moderate exercise 3-5 days/week
        "very_active": 1.725,      # Hard exercise 6-7 days/week
        "extra_active": 1.9        # Very intense daily training or physical labor
    }
    factor = multipliers.get((activity_level or "").lower(), 1.375)
    return round(bmr * factor, 1)


def calculate_nutrition_targets(
    weight_kg: float,
    height_cm: float,
    age: int,
    gender: str,
    activity_level: str,
    goal: str,
    skin_wellness_focus: bool = False
) -> Dict[str, Any]:
    """
    Calculate comprehensive daily nutrition targets including:
    - Calories (with safety bounds to prevent unsafe crash dieting)
    - Protein (grams and % of energy)
    - Carbohydrates (grams and % of energy)
    - Fats (grams and % of energy)
    - Fiber (grams)
    - Daily Hydration (milliliters)
    """
    bmi_data = calculate_bmi(weight_kg, height_cm)
    bmr = calculate_bmr(weight_kg, height_cm, age, gender)
    tdee = calculate_tdee(bmr, activity_level)

    g = (goal or "").lower()

    # Determine calorie adjustment based on fitness goal
    if "lose" in g or "fat" in g:
        # Deficit of ~400-500 kcal, but never drop below safe biological floors
        calorie_target = tdee - 450
        min_floor = 1200.0 if (gender or "").lower() in ("female", "f") else 1450.0
        calorie_target = max(calorie_target, min_floor)
        protein_per_kg = 1.6  # High protein to spare lean muscle mass during deficit
        fat_pct = 0.25
    elif "gain" in g or "bulk" in g:
        calorie_target = tdee + 400
        protein_per_kg = 1.7
        fat_pct = 0.28
    elif "muscle" in g:
        calorie_target = tdee + 250
        protein_per_kg = 1.9  # High protein for hypertrophy
        fat_pct = 0.25
    elif "fit" in g:
        calorie_target = tdee - 100
        protein_per_kg = 1.4
        fat_pct = 0.26
    elif "skin" in g or skin_wellness_focus:
        calorie_target = tdee
        protein_per_kg = 1.3
        fat_pct = 0.28  # Essential fatty acids for skin barrier integrity
    else:
        # Maintenance or general wellness
        calorie_target = tdee
        protein_per_kg = 1.2
        fat_pct = 0.27

    calorie_target = round(calorie_target)

    # 1. Protein target (4 kcal/g)
    protein_g = round(weight_kg * protein_per_kg, 1)
    # Clamp protein to safe range (at least 50g, max 2.2g/kg)
    protein_g = max(50.0, min(protein_g, weight_kg * 2.2))
    protein_cals = protein_g * 4.0

    # 2. Fat target (9 kcal/g)
    fat_cals = calorie_target * fat_pct
    fat_g = round(fat_cals / 9.0, 1)

    # 3. Carbohydrates: remaining calories (4 kcal/g)
    remaining_cals = max(0.0, calorie_target - protein_cals - fat_cals)
    carbs_g = round(remaining_cals / 4.0, 1)

    # 4. Fiber target: ~14g per 1000 kcal, standard 28-35g for adults
    fiber_g = round(max(25.0, min(40.0, (calorie_target / 1000.0) * 14.0)), 1)

    # 5. Hydration estimate: 35 ml/kg baseline + activity bonus
    activity_bonus_ml = {
        "sedentary": 250,
        "light": 500,
        "moderate": 750,
        "very_active": 1000,
        "extra_active": 1250
    }.get((activity_level or "").lower(), 500)

    hydration_ml = round((weight_kg * 35.0) + activity_bonus_ml)
    # Clamp between 2000 ml and 4200 ml for safety
    hydration_ml = max(2000, min(4200, hydration_ml))

    # Calculate macro calorie percentages
    total_cals = (protein_g * 4.0) + (carbs_g * 4.0) + (fat_g * 9.0)
    protein_pct = round((protein_g * 4.0 / total_cals) * 100) if total_cals else 25
    carbs_pct = round((carbs_g * 4.0 / total_cals) * 100) if total_cals else 50
    fat_pct_actual = round((fat_g * 9.0 / total_cals) * 100) if total_cals else 25

    return {
        "bmi": bmi_data["bmi"],
        "bmi_category": bmi_data["category"],
        "bmi_color": bmi_data["color"],
        "bmi_guidance": bmi_data["guidance"],
        "bmr": bmr,
        "tdee": tdee,
        "calories": calorie_target,
        "protein_g": protein_g,
        "carbs_g": carbs_g,
        "fat_g": fat_g,
        "fiber_g": fiber_g,
        "hydration_ml": hydration_ml,
        "macro_distribution": {
            "protein_pct": protein_pct,
            "carbs_pct": carbs_pct,
            "fat_pct": fat_pct_actual,
        },
        "disclaimer": (
            "Nutritional values are scientific estimates computed via Mifflin-St Jeor and ICMR-NIN "
            "reference parameters. They serve as an educational wellness guide, not a prescriptive medical diagnosis."
        )
    }
