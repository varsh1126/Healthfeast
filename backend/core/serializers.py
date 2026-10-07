"""
HealthFeast DRF Serializers.
Handles validation, nested representations, and data conversion.
"""

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    HealthProfile, HealthCondition, UserCondition, Allergy, UserAllergy,
    Food, MealPlan, Meal, MealFood, FoodLog, Progress, Feedback,
    GroceryList, AIInteraction, DataSource, WellnessProfile,
    ExerciseLog, WaterLog, SleepLog, AdaptivePreference
)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'is_staff')


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    name = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'name')

    def create(self, validated_data):
        name = validated_data.pop('name', '')
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        if name:
            parts = name.strip().split(' ', 1)
            user.first_name = parts[0]
            if len(parts) > 1:
                user.last_name = parts[1]
        user.save()
        # Initialize default health profile
        HealthProfile.objects.create(user=user)
        WellnessProfile.objects.create(user=user)
        AdaptivePreference.objects.create(user=user)
        return user


class AllergySerializer(serializers.ModelSerializer):
    class Meta:
        model = Allergy
        fields = '__all__'


class HealthConditionSerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthCondition
        fields = '__all__'


class UserAllergySerializer(serializers.ModelSerializer):
    allergy_name = serializers.CharField(source='allergy.name', read_only=True)
    allergen_key = serializers.CharField(source='allergy.allergen_key', read_only=True)

    class Meta:
        model = UserAllergy
        fields = ('id', 'allergy', 'allergy_name', 'allergen_key', 'custom_allergen_name')


class UserConditionSerializer(serializers.ModelSerializer):
    condition_name = serializers.CharField(source='condition.name', read_only=True)
    condition_code = serializers.CharField(source='condition.code', read_only=True)

    class Meta:
        model = UserCondition
        fields = ('id', 'condition', 'condition_name', 'condition_code', 'notes')


class HealthProfileSerializer(serializers.ModelSerializer):
    allergies = serializers.SerializerMethodField()
    health_conditions = serializers.SerializerMethodField()

    class Meta:
        model = HealthProfile
        fields = '__all__'
        read_only_fields = ('user', 'created_at', 'updated_at')

    def get_allergies(self, obj):
        return [
            ua.allergy.name if ua.allergy else ua.custom_allergen_name
            for ua in obj.user.allergies.all()
        ]

    def get_health_conditions(self, obj):
        return [uc.condition.name for uc in obj.user.conditions.all()]


class FoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Food
        fields = '__all__'


class MealFoodSerializer(serializers.ModelSerializer):
    food = FoodSerializer(read_only=True)
    food_id = serializers.PrimaryKeyRelatedField(queryset=Food.objects.all(), source='food', write_only=True)

    class Meta:
        model = MealFood
        fields = ('id', 'food', 'food_id', 'portion_multiplier', 'serving_desc')


class MealSerializer(serializers.ModelSerializer):
    foods = MealFoodSerializer(many=True, read_only=True)

    class Meta:
        model = Meal
        fields = '__all__'


class MealPlanSerializer(serializers.ModelSerializer):
    meals = MealSerializer(many=True, read_only=True)

    class Meta:
        model = MealPlan
        fields = '__all__'
        read_only_fields = ('user', 'created_at')


class FoodLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodLog
        fields = '__all__'
        read_only_fields = ('user', 'logged_at')


class WaterLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = WaterLog
        fields = '__all__'
        read_only_fields = ('user', 'logged_at')


class ExerciseLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExerciseLog
        fields = '__all__'
        read_only_fields = ('user', 'created_at')


class SleepLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = SleepLog
        fields = '__all__'
        read_only_fields = ('user',)


class ProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Progress
        fields = '__all__'
        read_only_fields = ('user', 'created_at')


class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = '__all__'
        read_only_fields = ('user', 'created_at')


class GroceryListSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroceryList
        fields = '__all__'
        read_only_fields = ('user', 'generated_at', 'updated_at')


class WellnessProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = WellnessProfile
        fields = '__all__'
        read_only_fields = ('user', 'updated_at')


class DataSourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataSource
        fields = '__all__'


class AIInteractionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIInteraction
        fields = '__all__'
        read_only_fields = ('user', 'created_at')
