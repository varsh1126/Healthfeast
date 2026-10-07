"""
HealthFeast URL Routing Configuration for Core App.
"""

from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    # Authentication
    path('auth/register/', views.register_user, name='auth-register'),
    path('auth/login/', views.login_user, name='auth-login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('auth/me/', views.get_current_user, name='auth-me'),

    # Profile & Health Interview
    path('profile/', views.user_health_profile, name='user-profile'),
    path('profile/update/', views.user_health_profile, name='user-profile-update'),
    path('health/analyze/', views.analyze_health, name='health-analyze'),
    path('nutrition/targets/', views.analyze_health, name='nutrition-targets'),

    # Food Database
    path('foods/', views.list_foods, name='foods-list'),
    path('foods/search/', views.search_foods, name='foods-search'),

    # Diet Generation & Management
    path('diet/generate/', views.generate_diet_plan, name='diet-generate'),
    path('diet/weekly/', views.get_active_diet_plan, name='diet-weekly'),
    path('diet/meal/<int:meal_id>/replace/', views.get_meal_replacements, name='meal-replace-options'),
    path('diet/meal/<int:meal_id>/apply-replace/', views.apply_meal_replacement, name='meal-apply-replace'),
    path('diet/meal/<int:meal_id>/status/', views.update_meal_status, name='meal-status-update'),
    path('diet/pantry-match/', views.what_can_i_eat, name='pantry-match'),

    # Scanner & AI Assistant
    path('scanner/analyze/', views.scan_food, name='food-scanner'),
    path('ai/chat/', views.ask_ai_assistant, name='ai-chat'),

    # Glow & Skin Wellness
    path('wellness/skin/', views.skin_wellness_module, name='skin-wellness'),

    # Tracking Suite
    path('tracking/meals/', views.meal_tracking, name='tracking-meals'),
    path('tracking/water/', views.water_tracking, name='tracking-water'),
    path('tracking/exercise/', views.exercise_tracking, name='tracking-exercise'),
    path('tracking/sleep/', views.sleep_tracking, name='tracking-sleep'),
    path('tracking/progress/', views.progress_tracking, name='tracking-progress'),

    # Grocery List
    path('grocery/generate/', views.grocery_list_view, name='grocery-generate'),

    # Adaptive AI & Feedback
    path('adaptive/review/', views.adaptive_weekly_review, name='adaptive-review'),
    path('feedback/', views.submit_feedback, name='submit-feedback'),

    # Admin Dashboard
    path('admin/metrics/', views.admin_metrics, name='admin-metrics'),
]
