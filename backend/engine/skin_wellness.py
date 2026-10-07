"""
Glow & Skin Wellness Engine for HealthFeast.
Evaluates nutritional and lifestyle indicators supporting healthy-looking skin.
Calculates an educational Skin Wellness Score (0-100) with detailed component breakdown.
Explicitly avoids unsubstantiated dermatological or aesthetic claims.
"""

from typing import Dict, Any, List


SKIN_SUPPORTIVE_FOODS = [
    {
        "name": "Fresh Amla (Indian Gooseberry) & Mint Juice",
        "key_nutrient": "Vitamin C (Ascorbic Acid)",
        "benefit": "Potent water-soluble antioxidant that acts as an essential cofactor for collagen synthesis and helps combat environmental oxidative stress.",
        "serving": "1 small glass (150ml) unsweetened",
        "category": "Antioxidant Elixir",
        "dietary_type": "vegan"
    },
    {
        "name": "Roasted Pumpkin & Flaxseeds Trail Mix",
        "key_nutrient": "Zinc & Alpha-Linolenic Acid (Omega-3)",
        "benefit": "Provides bioavailable zinc for normal cell turnover and omega-3 polyunsaturated fatty acids to maintain epidermal moisture barrier integrity.",
        "serving": "2 tablespoons (25g)",
        "category": "Essential Fatty Acids & Minerals",
        "dietary_type": "vegan"
    },
    {
        "name": "Papaya and Pomegranate Bowl",
        "key_nutrient": "Beta-Carotene (Provitamin A) & Punicalagins",
        "benefit": "Enzyme papain supports gentle digestion; high polyphenol and carotenoid content support UV photoprotection and natural skin radiance.",
        "serving": "1 medium bowl (150g)",
        "category": "Carotenoid Fruit Bowl",
        "dietary_type": "vegan"
    },
    {
        "name": "Sprouted Moong & Tomato Salad with Lemon",
        "key_nutrient": "Vitamin C, Plant Protein & Fiber",
        "benefit": "Sprouting enhances amino acid bio-accessibility; paired with lycopene from tomatoes and Vitamin C from lemon juice.",
        "serving": "1 cup (120g)",
        "category": "Whole-Food Protein & Antioxidant",
        "dietary_type": "vegan"
    },
    {
        "name": "Turmeric Spiced Golden Milk (Almond or Low-Fat Curd)",
        "key_nutrient": "Curcumin & Probiotics",
        "benefit": "Curcumin demonstrates anti-inflammatory properties that support a balanced microbiome and skin calm.",
        "serving": "1 cup (200ml)",
        "category": "Anti-inflammatory Comfort",
        "dietary_type": "vegetarian"
    },
    {
        "name": "Steamed Rohu/Salmon or Tofu Spinach Stir-Fry",
        "key_nutrient": "Complete Protein & Omega-3 / Isoflavones",
        "benefit": "Provides fundamental amino acids required to maintain dermal structural proteins (collagen and elastin).",
        "serving": "1 serving (150g)",
        "category": "Structural Protein",
        "dietary_type": "non_vegetarian"
    }
]


def calculate_skin_wellness_score(
    hydration_pct: float,
    sleep_hours: float,
    veggie_servings: int,
    fruit_servings: int,
    exercise_days_per_week: int,
    sugar_intake_level: str = "low",
    sun_protection_routine: bool = True
) -> Dict[str, Any]:
    """
    Calculates the HealthFeast Skin Wellness Score (0 - 100) based on verified lifestyle markers:
    - Hydration (25 pts)
    - Micronutrient & Antioxidant Intake (30 pts: fruits, vegetables, vitamin C/A)
    - Sleep Quality & Duration (20 pts)
    - Physical Activity & Circulation (15 pts)
    - Sugar/Processed Food Moderation & Sun Protection (10 pts)
    """
    score = 0.0
    breakdown = {}

    # 1. Hydration (0-25 pts)
    h_clamped = min(1.0, max(0.0, hydration_pct / 100.0))
    hydration_score = round(h_clamped * 25.0, 1)
    breakdown["hydration"] = {
        "score": hydration_score,
        "max": 25,
        "feedback": "Optimal fluid intake maintains intracellular volume and skin suppleness." if hydration_score >= 20 else "Increasing water intake supports dermal hydration."
    }
    score += hydration_score

    # 2. Fruits & Vegetables Micronutrients (0-30 pts)
    # Target: 3+ servings vegetables, 2+ servings fruits
    veg_score = min(15.0, (veggie_servings / 3.0) * 15.0)
    fruit_score = min(15.0, (fruit_servings / 2.0) * 15.0)
    antioxidant_score = round(veg_score + fruit_score, 1)
    breakdown["antioxidants"] = {
        "score": antioxidant_score,
        "max": 30,
        "feedback": "Rich dietary antioxidants defend cellular structures against UV and oxidative stress." if antioxidant_score >= 22 else "Adding more colorful vegetables (spinach, carrots, tomatoes) boosts protective carotenoids."
    }
    score += antioxidant_score

    # 3. Sleep (0-20 pts)
    # Optimal: 7-9 hours
    if 7.0 <= sleep_hours <= 9.0:
        sleep_score = 20.0
    elif 6.0 <= sleep_hours < 7.0 or 9.0 < sleep_hours <= 10.0:
        sleep_score = 15.0
    elif 5.0 <= sleep_hours < 6.0:
        sleep_score = 10.0
    else:
        sleep_score = 5.0

    breakdown["sleep"] = {
        "score": sleep_score,
        "max": 20,
        "feedback": "Deep sleep facilitates nocturnal epidermal repair, cell renewal, and cortisol reduction." if sleep_score >= 18 else "Consistent 7-8 hours of restful sleep prevents cortisol spikes that disrupt skin barrier function."
    }
    score += sleep_score

    # 4. Exercise & Circulation (0-15 pts)
    # Target: 3-5 days/week
    ex_score = min(15.0, round((exercise_days_per_week / 4.0) * 15.0, 1))
    breakdown["circulation"] = {
        "score": ex_score,
        "max": 15,
        "feedback": "Cardiorespiratory exercise increases microvascular perfusion, delivering oxygen and nutrients to dermal layers."
    }
    score += ex_score

    # 5. Sugar Moderation & Protective Habits (0-10 pts)
    sugar_penalty = {"high": 2.0, "moderate": 6.0, "low": 8.0}.get(sugar_intake_level.lower(), 7.0)
    sun_bonus = 2.0 if sun_protection_routine else 0.0
    habit_score = min(10.0, sugar_penalty + sun_bonus)
    breakdown["lifestyle_habits"] = {
        "score": habit_score,
        "max": 10,
        "feedback": "Minimizing advanced glycation end-products (AGEs) by limiting added sugars preserves collagen elasticity."
    }
    score += habit_score

    final_score = round(min(100.0, max(10.0, score)))

    if final_score >= 80:
        tier = "Radiant & Nourished"
        summary = "Your nutritional and lifestyle habits strongly support healthy epidermal resilience and vitality."
    elif final_score >= 60:
        tier = "Good Balance"
        summary = "Solid baseline! Subtle increases in hydration and antioxidant-rich whole foods can further enhance your skin wellness."
    else:
        tier = "Building Foundation"
        summary = "Focus on consistent daily water intake, colorful fruits, adequate sleep, and reducing added refined sugars."

    return {
        "score": final_score,
        "tier": tier,
        "summary": summary,
        "breakdown": breakdown,
        "recommended_foods": SKIN_SUPPORTIVE_FOODS,
        "lifestyle_habits": [
            "Maintain baseline water intake (~35 ml per kg bodyweight)",
            "Incorporate at least one Vitamin C-rich food daily (amla, lemon, guava, orange)",
            "Aim for 7-8 hours of uninterrupted restorative sleep",
            "Consume healthy fats (flaxseed, walnuts, chia seeds) to fortify the lipid barrier",
            "Limit high-glycemic ultra-processed foods that trigger rapid insulin spikes"
        ],
        "disclaimer": (
            "The Skin Wellness Score is a lifestyle nutrition guide designed to promote overall well-being. "
            "It does not diagnose, treat, or cure clinical dermatological conditions. "
            "HealthFeast does not promote skin whitening, permanent bleaching, or unrealistic aesthetic promises."
        )
    }
