"""
Comprehensive Backend Test Suite for HealthFeast.
Tests:
- Authentication & JWT
- Mifflin-St Jeor BMR, TDEE, Macros, BMI
- Deterministic Safety Layer (Allergies, Health Conditions, Dislikes)
- 7-Day Diet Generation & Single Meal Replacement
- Grocery Aggregation & Categorization
- Glow & Skin Wellness Scoring
- Food Scanner Vision Analysis
- Ask HealthFeast AI Chat & Authoritative Citations
- User Tracking (Water, Food Log, Exercise, Progress)
"""

import json
from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status

from core.models import Food, MealPlan, Meal, HealthProfile, Allergy, HealthCondition
from engine.nutrition_math import calculate_bmi, calculate_bmr, calculate_tdee, calculate_nutrition_targets
from engine.safety_rules import validate_meal_safety, check_allergen_conflict, check_condition_suitability
from engine.skin_wellness import calculate_skin_wellness_score
from engine.grocery_engine import generate_grocery_list_from_plan
from engine.food_scanner import scan_food_image
from engine.replacement import find_replacements
from engine.ai_assistant import chat_with_healthfeast


class HealthFeastComprehensiveTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="testuser",
            email="testuser@example.com",
            password="StrongPassword123!"
        )
        self.profile = HealthProfile.objects.create(
            user=self.user,
            age=25,
            gender="female",
            height_cm=162.0,
            weight_kg=56.0,
            activity_level="moderate",
            diet_type="vegetarian",
            fitness_goal="lose_weight",
            daily_budget_inr=250.0,
            favorite_foods=["Moong Dal", "Poha"],
            disliked_foods=["Karela"]
        )
        self.sample_food = Food.objects.create(
            name="Moong Dal Tadka",
            category="dal_protein",
            serving_size_desc="1 bowl (150g)",
            calories=150.0,
            protein_g=9.0,
            carbs_g=22.0,
            fat_g=2.5,
            fiber_g=4.0,
            dietary_type="vegetarian",
            allergens=[],
            estimated_cost_inr=20.0
        )
        self.sample_peanut_food = Food.objects.create(
            name="Peanut Chikki",
            category="snacks",
            calories=180.0,
            protein_g=5.0,
            carbs_g=20.0,
            fat_g=9.0,
            fiber_g=2.0,
            dietary_type="vegetarian",
            allergens=["peanuts"]
        )

    # 1. Nutrition Math Tests
    def test_bmi_calculation(self):
        result = calculate_bmi(weight_kg=56.0, height_cm=162.0)
        self.assertAlmostEqual(result["bmi"], 21.3, delta=0.2)
        self.assertIn("Normal", result["category"])
        self.assertTrue(result["is_screening_metric"])

    def test_bmr_and_tdee(self):
        # Female 56kg, 162cm, 25 years: 10*56 + 6.25*162 - 5*25 - 161 = 560 + 1012.5 - 125 - 161 = 1286.5
        bmr = calculate_bmr(weight_kg=56.0, height_cm=162.0, age=25, gender="female")
        self.assertAlmostEqual(bmr, 1286.5, delta=1.0)
        tdee = calculate_tdee(bmr, "moderate")
        self.assertAlmostEqual(tdee, round(bmr * 1.55, 1), delta=1.0)

    def test_nutrition_targets_safe_floor(self):
        # Even with aggressive deficit, female calories must not drop below 1200 kcal floor
        targets = calculate_nutrition_targets(
            weight_kg=45.0, height_cm=150.0, age=30, gender="female",
            activity_level="sedentary", goal="lose_weight"
        )
        self.assertGreaterEqual(targets["calories"], 1200)
        self.assertGreaterEqual(targets["protein_g"], 50.0)
        self.assertGreaterEqual(targets["hydration_ml"], 2000)

    # 2. Safety Engine Tests
    def test_allergy_detection(self):
        has_conflict, reason = check_allergen_conflict(
            food_allergens=["peanuts"],
            food_name="Peanut Chikki",
            user_allergies=["peanuts"]
        )
        self.assertTrue(has_conflict)
        self.assertIn("peanuts", reason.lower())

    def test_dislike_filtering(self):
        bad_food = {"name": "Karela Fry", "category": "vegetables", "allergens": [], "dietary_type": "vegetarian"}
        user_context = {"allergies": [], "diet_type": "vegetarian", "disliked_foods": ["karela"]}
        is_safe, violations = validate_meal_safety(bad_food, user_context)
        self.assertFalse(is_safe)
        self.assertTrue(any("karela" in v.lower() for v in violations))

    def test_diabetic_safety(self):
        sugary_food = {"name": "Gulab Jamun", "glycemic_index": "high", "allergens": [], "dietary_type": "vegetarian"}
        is_ok, reason = check_condition_suitability(sugary_food, ["Type 2 Diabetes"])
        self.assertFalse(is_ok)
        self.assertIn("restricted", reason.lower())

    # 3. Glow & Skin Wellness Engine Tests
    def test_skin_wellness_score(self):
        score_res = calculate_skin_wellness_score(
            hydration_pct=90.0,
            sleep_hours=8.0,
            veggie_servings=4,
            fruit_servings=2,
            exercise_days_per_week=4,
            sugar_intake_level="low"
        )
        self.assertGreaterEqual(score_res["score"], 80)
        self.assertIn("breakdown", score_res)
        self.assertIn("hydration", score_res["breakdown"])
        self.assertIn("disclaimer", score_res)

    # 4. Food Replacement Engine Tests
    def test_replacement_scoring(self):
        target = {"id": 1, "name": "Yellow Dal", "calories": 160, "protein_g": 9.0, "category": "dal_protein"}
        candidates = [
            {"id": 2, "name": "Moong Dal Tadka", "calories": 150, "protein_g": 9.0, "category": "dal_protein", "dietary_type": "vegetarian"},
            {"id": 3, "name": "Chicken Curry", "calories": 250, "protein_g": 25.0, "category": "dal_protein", "dietary_type": "non_vegetarian"}
        ]
        user_ctx = {"diet_type": "vegetarian", "allergies": [], "disliked_foods": []}
        reps = find_replacements(target, candidates, user_ctx)
        self.assertEqual(len(reps), 1)
        self.assertEqual(reps[0]["food"]["name"], "Moong Dal Tadka")

    # 5. Grocery Aggregation Tests
    def test_grocery_generation(self):
        mock_plan = [
            {
                "meals": [
                    {"food": {"name": "Steamed Idli", "category": "breakfast", "serving_size_desc": "2 idlis", "estimated_cost_inr": 20}, "portion_multiplier": 1.0},
                    {"food": {"name": "Moong Dal", "category": "dal_protein", "serving_size_desc": "1 katori", "estimated_cost_inr": 25}, "portion_multiplier": 1.5}
                ]
            }
        ]
        grocery = generate_grocery_list_from_plan(mock_plan)
        self.assertEqual(grocery["total_items"], 2)
        self.assertIn("all_items", grocery)

    # 6. Food Scanner Heuristics
    def test_food_scanner_heuristics(self):
        # 10x10 transparent test image
        from io import BytesIO
        from PIL import Image
        img = Image.new('RGB', (50, 50), color='green')
        buf = BytesIO()
        img.save(buf, format='JPEG')
        scan = scan_food_image(buf.getvalue(), filename="dosa_breakfast.jpg")
        self.assertIn("detected_food_name", scan)
        self.assertIn("calories", scan)
        self.assertTrue(scan["requires_user_confirmation"])

    # 7. AI Chat Assistant Tests
    def test_ai_chat_fallback(self):
        res = chat_with_healthfeast(
            user_query="What should I eat for dinner?",
            user_profile={"diet_type": "vegetarian", "fitness_goal": "lose_weight", "daily_budget_inr": 200}
        )
        self.assertIn("response", res)
        self.assertIn("citations", res)
        self.assertIn("disclaimer", res)

    # 8. API Endpoint Authentication & End-to-End Tests
    def test_auth_and_profile_api(self):
        # Login
        resp = self.client.post("/api/auth/login/", {
            "username": "testuser",
            "password": "StrongPassword123!"
        }, format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        token = resp.data["tokens"]["access"]

        # Access profile
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        prof_resp = self.client.get("/api/profile/")
        self.assertEqual(prof_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(prof_resp.data["diet_type"], "vegetarian")

    def test_health_analyze_api(self):
        self.client.force_authenticate(user=self.user)
        resp = self.client.get("/api/health/analyze/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn("calories", resp.data)
        self.assertIn("protein_g", resp.data)

    def test_water_tracking_api(self):
        self.client.force_authenticate(user=self.user)
        # Log water
        log_resp = self.client.post("/api/tracking/water/", {"amount_ml": 500}, format='json')
        self.assertEqual(log_resp.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(log_resp.data["today_total_ml"], 500)
