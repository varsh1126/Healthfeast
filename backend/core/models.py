"""
HealthFeast Core Models.
Comprehensive database schema for users, health profiles, clinical conditions,
allergens, foods, meal plans, logs, skin wellness, and adaptive preferences.
"""

from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class HealthProfile(models.Model):
    GENDER_CHOICES = (
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other / Prefer not to say'),
    )
    ACTIVITY_CHOICES = (
        ('sedentary', 'Sedentary (little to no exercise, desk work)'),
        ('light', 'Light (light activity/exercise 1-3 days/week)'),
        ('moderate', 'Moderate (moderate exercise 3-5 days/week)'),
        ('very_active', 'Very Active (hard exercise 6-7 days/week)'),
        ('extra_active', 'Extra Active (intense training or physical labor)'),
    )
    DIET_CHOICES = (
        ('vegetarian', 'Vegetarian'),
        ('non_vegetarian', 'Non-Vegetarian'),
        ('vegan', 'Vegan'),
        ('eggetarian', 'Eggetarian'),
        ('other', 'Other'),
    )
    GOAL_CHOICES = (
        ('lose_weight', 'Lose Weight'),
        ('gain_weight', 'Gain Weight'),
        ('maintain_weight', 'Maintain Weight'),
        ('get_fit', 'Get Fit & Active'),
        ('build_muscle', 'Build Muscle & Hypertrophy'),
        ('general_nutrition', 'Improve General Nutrition'),
        ('skin_wellness', 'Support Healthy-Looking Skin'),
    )
    COOKING_TIME_CHOICES = (
        ('quick_under_20', 'Quick (< 20 mins)'),
        ('moderate_under_45', 'Moderate (20 - 45 mins)'),
        ('elaborate', 'Elaborate (No time constraint)'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='health_profile')
    age = models.PositiveIntegerField(default=25)
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES, default='female')
    height_cm = models.FloatField(default=165.0)
    weight_kg = models.FloatField(default=62.0)
    waist_cm = models.FloatField(null=True, blank=True)

    activity_level = models.CharField(max_length=30, choices=ACTIVITY_CHOICES, default='moderate')
    sleep_hours = models.FloatField(default=7.5)
    exercise_frequency = models.PositiveIntegerField(default=4, help_text="Days per week")

    diet_type = models.CharField(max_length=30, choices=DIET_CHOICES, default='vegetarian')
    favorite_foods = models.JSONField(default=list, blank=True)
    disliked_foods = models.JSONField(default=list, blank=True)
    cuisine_preference = models.CharField(max_length=50, default='pan_indian')
    meals_per_day = models.PositiveIntegerField(default=4)
    cooking_time_pref = models.CharField(max_length=30, choices=COOKING_TIME_CHOICES, default='moderate_under_45')

    fitness_goal = models.CharField(max_length=30, choices=GOAL_CHOICES, default='maintain_weight')
    daily_budget_inr = models.FloatField(default=250.0)
    onboarding_completed = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"HealthProfile for {self.user.username} ({self.fitness_goal})"


class HealthCondition(models.Model):
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    dietary_guidance = models.TextField(blank=True)
    restricted_nutrients = models.JSONField(default=dict, blank=True)
    recommended_foods = models.JSONField(default=list, blank=True)

    def __str__(self):
        return self.name


class UserCondition(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='conditions')
    condition = models.ForeignKey(HealthCondition, on_delete=models.CASCADE)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'condition')


class Allergy(models.Model):
    name = models.CharField(max_length=100, unique=True)
    allergen_key = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class UserAllergy(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='allergies')
    allergy = models.ForeignKey(Allergy, on_delete=models.CASCADE, null=True, blank=True)
    custom_allergen_name = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.allergy.name if self.allergy else self.custom_allergen_name}"


class Food(models.Model):
    CATEGORY_CHOICES = (
        ('breakfast', 'Breakfast'),
        ('grains', 'Grains & Millets'),
        ('dal_protein', 'Pulses, Legumes & Protein'),
        ('vegetables', 'Vegetables'),
        ('fruits', 'Fruits'),
        ('snacks', 'Snacks & Seeds'),
        ('beverages', 'Beverages & Hydration'),
        ('dairy', 'Dairy'),
        ('other', 'Other'),
    )
    DIETARY_CHOICES = (
        ('vegetarian', 'Vegetarian'),
        ('non_vegetarian', 'Non-Vegetarian'),
        ('vegan', 'Vegan'),
        ('eggetarian', 'Eggetarian'),
    )

    name = models.CharField(max_length=150, db_index=True)
    hindi_name = models.CharField(max_length=150, blank=True)
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES, default='grains')
    serving_size_desc = models.CharField(max_length=100, default='1 serving (100g)')
    serving_weight_g = models.FloatField(default=100.0)

    calories = models.FloatField(default=150.0)
    protein_g = models.FloatField(default=4.0)
    carbs_g = models.FloatField(default=25.0)
    fat_g = models.FloatField(default=3.0)
    fiber_g = models.FloatField(default=2.5)

    dietary_type = models.CharField(max_length=20, choices=DIETARY_CHOICES, default='vegetarian')
    allergens = models.JSONField(default=list, blank=True)
    preparation_time_mins = models.PositiveIntegerField(default=15)
    estimated_cost_inr = models.FloatField(default=25.0)
    micronutrients = models.JSONField(default=dict, blank=True)
    glycemic_index = models.CharField(max_length=20, default='low')

    source = models.CharField(max_length=150, default='ICMR-NIN (IFCT 2017)')
    source_date = models.DateField(default=timezone.now)
    verification_status = models.CharField(max_length=30, default='verified')
    image_url = models.CharField(max_length=255, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.calories} kcal)"


class MealPlan(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='meal_plans')
    title = models.CharField(max_length=150, default='7-Day Personalized Wellness Plan')
    start_date = models.DateField(default=timezone.now)
    end_date = models.DateField()
    total_days = models.PositiveIntegerField(default=7)
    goal_mode = models.CharField(max_length=50, default='maintain_weight')
    is_active = models.BooleanField(default=True)
    adaptation_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} for {self.user.username}"


class Meal(models.Model):
    meal_plan = models.ForeignKey(MealPlan, on_delete=models.CASCADE, related_name='meals')
    day_of_week = models.CharField(max_length=20)  # e.g., 'Monday'
    meal_type = models.CharField(max_length=30)    # e.g., 'breakfast'
    meal_title = models.CharField(max_length=100, default='Meal')
    suggested_time = models.CharField(max_length=20, default='08:30 AM')

    total_calories = models.FloatField(default=0.0)
    total_protein = models.FloatField(default=0.0)
    total_carbs = models.FloatField(default=0.0)
    total_fat = models.FloatField(default=0.0)
    total_fiber = models.FloatField(default=0.0)
    estimated_cost = models.FloatField(default=0.0)

    is_eaten = models.BooleanField(default=False)
    is_skipped = models.BooleanField(default=False)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.day_of_week} {self.meal_type} ({self.total_calories} kcal)"


class MealFood(models.Model):
    meal = models.ForeignKey(Meal, on_delete=models.CASCADE, related_name='foods')
    food = models.ForeignKey(Food, on_delete=models.CASCADE)
    portion_multiplier = models.FloatField(default=1.0)
    serving_desc = models.CharField(max_length=100, default='1 serving')

    def __str__(self):
        return f"{self.food.name} in {self.meal}"


class FoodLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='food_logs')
    food = models.ForeignKey(Food, on_delete=models.SET_NULL, null=True, blank=True)
    food_name = models.CharField(max_length=150)
    meal_type = models.CharField(max_length=30, default='lunch')
    date = models.DateField(default=timezone.now)
    logged_at = models.DateTimeField(auto_now_add=True)

    portion_size = models.CharField(max_length=100, default='1 serving')
    calories = models.FloatField(default=0.0)
    protein_g = models.FloatField(default=0.0)
    carbs_g = models.FloatField(default=0.0)
    fat_g = models.FloatField(default=0.0)
    fiber_g = models.FloatField(default=0.0)

    source = models.CharField(max_length=30, default='plan')  # plan, manual, scanner, ai_assistant
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.food_name} ({self.calories} kcal) on {self.date}"


class Progress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='progress_records')
    date = models.DateField(default=timezone.now)
    weight_kg = models.FloatField()
    waist_cm = models.FloatField(null=True, blank=True)
    adherence_pct = models.FloatField(default=85.0)
    mood = models.CharField(max_length=30, default='good')
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['date']


class Feedback(models.Model):
    REASON_CHOICES = (
        ('loved_it', 'Loved the taste & feeling'),
        ('too_heavy', 'Felt too heavy'),
        ('took_too_long', 'Took too long to prepare'),
        ('disliked_taste', 'Disliked the ingredients/taste'),
        ('too_expensive', 'Exceeded daily food budget'),
        ('other', 'Other feedback'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='feedbacks')
    meal_plan = models.ForeignKey(MealPlan, on_delete=models.SET_NULL, null=True, blank=True)
    meal = models.ForeignKey(Meal, on_delete=models.SET_NULL, null=True, blank=True)
    food = models.ForeignKey(Food, on_delete=models.SET_NULL, null=True, blank=True)
    food_name = models.CharField(max_length=150, blank=True)

    rating = models.PositiveIntegerField(default=5)  # 1 to 5
    reason = models.CharField(max_length=40, choices=REASON_CHOICES, default='loved_it')
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class GroceryList(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='grocery_lists')
    meal_plan = models.ForeignKey(MealPlan, on_delete=models.CASCADE, null=True, blank=True)
    items = models.JSONField(default=dict)
    generated_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class AIInteraction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ai_chats')
    query = models.TextField()
    response = models.TextField()
    intent = models.CharField(max_length=50, blank=True)
    context_snapshot = models.JSONField(default=dict, blank=True)
    retrieved_sources = models.JSONField(default=list, blank=True)
    latency_ms = models.FloatField(default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)


class DataSource(models.Model):
    name = models.CharField(max_length=150)
    organization = models.CharField(max_length=150)
    url = models.URLField(max_length=300)
    publication_date = models.CharField(max_length=50)
    retrieval_date = models.CharField(max_length=50)
    topic = models.CharField(max_length=150)
    reliability_level = models.CharField(max_length=100)
    verified_status = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.organization} - {self.name}"


class WellnessProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='wellness_profile')
    skin_type = models.CharField(max_length=30, default='combination')
    primary_concerns = models.JSONField(default=list, blank=True)
    daily_water_ml = models.PositiveIntegerField(default=2500)
    calculated_skin_score = models.FloatField(default=75.0)
    score_breakdown = models.JSONField(default=dict, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Skin Wellness for {self.user.username} (Score: {self.calculated_skin_score})"


class ExerciseLog(models.Model):
    ACTIVITY_CHOICES = (
        ('brisk_walking', 'Brisk Walking'),
        ('running', 'Jogging / Running'),
        ('yoga', 'Yoga / Surya Namaskar'),
        ('strength_training', 'Strength Training / Gym'),
        ('cycling', 'Cycling'),
        ('swimming', 'Swimming'),
        ('mobility', 'Stretching & Mobility'),
        ('hiit', 'High Intensity Interval Training (HIIT)'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='exercise_logs')
    activity_type = models.CharField(max_length=40, choices=ACTIVITY_CHOICES, default='brisk_walking')
    duration_mins = models.PositiveIntegerField(default=30)
    intensity = models.CharField(max_length=20, default='moderate')
    calories_burned_est = models.FloatField(default=150.0)
    date = models.DateField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)


class WaterLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='water_logs')
    amount_ml = models.PositiveIntegerField(default=250)
    date = models.DateField(default=timezone.now)
    logged_at = models.DateTimeField(auto_now_add=True)


class SleepLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sleep_logs')
    date = models.DateField(default=timezone.now)
    sleep_hours = models.FloatField(default=7.5)
    sleep_quality = models.CharField(max_length=20, default='good')
    notes = models.TextField(blank=True)


class AdaptivePreference(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='adaptive_preference')
    food_affinity = models.JSONField(default=dict, blank=True)
    speed_preference_weight = models.FloatField(default=1.0)
    budget_sensitivity = models.FloatField(default=1.0)
    meal_skip_patterns = models.JSONField(default=dict, blank=True)
    last_adapted_at = models.DateTimeField(auto_now=True)
