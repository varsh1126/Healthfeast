import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dietService, trackingService, wellnessService } from '../api/services';
import MacroRing from '../components/MacroRing';
import MealCard from '../components/MealCard';
import FoodReplaceModal from '../components/FoodReplaceModal';
import DisclaimerBanner from '../components/DisclaimerBanner';
import {
  Flame,
  Droplet,
  Sparkles,
  Camera,
  UtensilsCrossed,
  ArrowRight,
  TrendingUp,
  Award,
  Layers,
  ShoppingBag,
  PlusCircle,
  Plus
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function DashboardPage({ onOpenAI }) {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [activePlan, setActivePlan] = useState(null);
  const [mealLogs, setMealLogs] = useState({ logs: [], totals: {} });
  const [waterData, setWaterData] = useState({ today_total_ml: 0, target_ml: 2500, percentage: 0 });
  const [skinData, setSkinData] = useState(null);
  const [selectedMealForReplace, setSelectedMealForReplace] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [planRes, trackingRes, waterRes, skinRes] = await Promise.allSettled([
        dietService.getActivePlan(),
        trackingService.getMeals(),
        trackingService.getWater(),
        wellnessService.getSkinWellness(),
      ]);

      if (planRes.status === 'fulfilled' && planRes.value?.weekly_plan) {
        setActivePlan(planRes.value);
      }
      if (trackingRes.status === 'fulfilled') {
        setMealLogs(trackingRes.value);
      }
      if (waterRes.status === 'fulfilled') {
        setWaterData(waterRes.value);
      }
      if (skinRes.status === 'fulfilled') {
        setSkinData(skinRes.value);
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkEaten = async (mealId, action) => {
    try {
      await dietService.updateMealStatus(mealId, action);
      loadDashboardData();
    } catch (err) {
      console.error('Error updating meal:', err);
    }
  };

  const handleQuickWater = async (amount) => {
    try {
      const res = await trackingService.logWater(amount);
      setWaterData((prev) => ({
        ...prev,
        today_total_ml: res.today_total_ml,
        percentage: res.percentage
      }));
      if (res.percentage >= 100) {
        try {
          confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
        } catch {}
      }
    } catch (err) {
      console.error('Error logging water:', err);
    }
  };

  // Determine current day of week
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currentDayName = days[new Date().getDay()];

  const todaysMeals = activePlan?.weekly_plan?.find(
    (d) => d.day.toLowerCase() === currentDayName.toLowerCase()
  )?.meals || activePlan?.weekly_plan?.[0]?.meals || [];

  const targets = activePlan?.targets || {
    calories: 1850,
    protein_g: 75,
    carbs_g: 220,
    fat_g: 45,
    hydration_ml: 2600
  };

  const consumedCalories = mealLogs.totals?.calories || 0;
  const consumedProtein = mealLogs.totals?.protein_g || 0;
  const consumedCarbs = mealLogs.totals?.carbs_g || 0;
  const consumedFat = mealLogs.totals?.fat_g || 0;

  // Time-based greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="page-container app-container">
      {/* Educational Disclaimer Banner */}
      <DisclaimerBanner />

      {/* Hero Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #065f46 0%, #059669 60%, #10b981 100%)',
        borderRadius: '24px',
        padding: '32px',
        color: '#ffffff',
        marginBottom: '32px',
        boxShadow: '0 12px 30px rgba(5, 150, 105, 0.25)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '640px' }}>
          <div style={{
            fontSize: '0.85rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: '#a7f3d0',
            marginBottom: '6px'
          }}>
            {currentDayName} • {greeting}
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
            Namaste, {user?.first_name || user?.username}!
          </h1>
          <p style={{ color: '#ecfdf5', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '20px' }}>
            Goal: <strong>{profile?.fitness_goal?.replace('_', ' ').toUpperCase() || 'WELLNESS'}</strong> •
            Budget: <strong>₹{profile?.daily_budget_inr || 250}/day</strong> •
            Diet: <strong>{profile?.diet_type?.toUpperCase() || 'VEGETARIAN'}</strong>
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link to="/diet" className="btn btn-warm" style={{ padding: '10px 20px', borderRadius: '12px' }}>
              <UtensilsCrossed size={16} />
              <span>View Today's Diet</span>
            </Link>
            <button
              onClick={onOpenAI}
              className="btn"
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '10px 20px',
                borderRadius: '12px'
              }}
            >
              <Sparkles size={16} />
              <span>Ask HealthFeast ✨</span>
            </button>
          </div>
        </div>
      </div>

      {/* Nutrition Macro Rings Row */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Today's Nutritional Fulfillment</h3>
          <Link to="/progress" style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 700, textDecoration: 'none' }}>
            View Full Trends →
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '16px'
        }}>
          <MacroRing
            label="Calories"
            current={consumedCalories}
            target={targets.calories}
            unit=" kcal"
            color="#f59e0b"
            icon={Flame}
          />
          <MacroRing
            label="Protein"
            current={consumedProtein}
            target={targets.protein_g}
            unit="g"
            color="#10b981"
          />
          <MacroRing
            label="Carbs"
            current={consumedCarbs}
            target={targets.carbs_g}
            unit="g"
            color="#3b82f6"
          />
          <MacroRing
            label="Healthy Fat"
            current={consumedFat}
            target={targets.fat_g}
            unit="g"
            color="#ec4899"
          />
          <MacroRing
            label="Hydration"
            current={waterData.today_total_ml}
            target={targets.hydration_ml || 2500}
            unit="ml"
            color="#0ea5e9"
            icon={Droplet}
          />
        </div>
      </div>

      {/* Main Grid: Today's Meals & Side Panels */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '32px',
        marginBottom: '40px'
      }}>
        {/* Left Col: Today's Meals */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Today's Meal Schedule</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Balanced Indian portions tailored to your metabolic requirements
              </p>
            </div>
            <Link to="/weekly-plan" className="btn btn-outline" style={{ fontSize: '0.82rem', padding: '6px 14px' }}>
              <Layers size={14} />
              <span>Full Week</span>
            </Link>
          </div>

          {todaysMeals.length === 0 ? (
            <div className="glass-panel" style={{ padding: '36px', textAlign: 'center' }}>
              <p style={{ color: '#64748b', marginBottom: '16px' }}>No meal plan generated yet.</p>
              <Link to="/health-analysis" className="btn btn-primary">
                <Sparkles size={16} />
                <span>Generate 7-Day Plan</span>
              </Link>
            </div>
          ) : (
            todaysMeals.map((meal) => (
              <MealCard
                key={meal.id}
                meal={meal}
                onMarkEaten={handleMarkEaten}
                onSkipMeal={handleMarkEaten}
                onOpenReplace={(m) => setSelectedMealForReplace(m)}
              />
            ))
          )}
        </div>

        {/* Right Col: Quick Actions, AI Insights, Water, Skin Wellness */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* AI Daily Insight */}
          <div className="glass-card-ai" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                background: '#8b5cf6',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Sparkles size={18} />
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#4c1d95' }}>
                Adaptive AI Insight
              </h4>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#4b5563', lineHeight: 1.6, marginBottom: '16px' }}>
              {consumedProtein < targets.protein_g * 0.4
                ? "Your protein intake is currently below your estimated requirement today. Consider enjoying roasted chana or paneer/tofu at your next meal to support cellular recovery."
                : "Great consistency! Your macronutrient pacing aligns with your goal. Remember to maintain steady hydration throughout the afternoon."}
            </p>
            <button
              onClick={onOpenAI}
              className="btn btn-ai"
              style={{ width: '100%', fontSize: '0.85rem', padding: '10px' }}
            >
              Ask For Meal Optimization ✨
            </button>
          </div>

          {/* Quick Water Logger */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Droplet size={18} color="#0ea5e9" />
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Quick Hydration</h4>
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0ea5e9' }}>
                {waterData.today_total_ml} / {targets.hydration_ml || 2500} ml
              </span>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => handleQuickWater(250)}
                className="btn btn-outline"
                style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}
              >
                +250 ml
              </button>
              <button
                onClick={() => handleQuickWater(500)}
                className="btn btn-outline"
                style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}
              >
                +500 ml
              </button>
              <Link
                to="/hydration"
                className="btn btn-secondary"
                style={{ padding: '10px', fontSize: '0.85rem' }}
                title="Open Hydration Tracker"
              >
                <Plus size={16} />
              </Link>
            </div>
          </div>

          {/* Glow & Skin Wellness Snapshot */}
          <div className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid #ec4899' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                Skin Wellness Score
              </h4>
              <span style={{
                fontSize: '1.1rem',
                fontWeight: 800,
                color: '#ec4899',
                background: '#fdf2f8',
                padding: '4px 10px',
                borderRadius: '8px'
              }}>
                {skinData?.score || 80}/100
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, marginBottom: '16px' }}>
              {skinData?.summary || "Hydration and dietary antioxidants actively nourish epidermal health."}
            </p>
            <Link to="/skin-wellness" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ec4899', textDecoration: 'none' }}>
              View Skin Wellness Guide →
            </Link>
          </div>

          {/* Quick Shortcuts */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '12px' }}>
              Quick Tools
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <Link
                to="/scanner"
                className="btn btn-secondary"
                style={{ padding: '12px', fontSize: '0.82rem', justifyContent: 'flex-start' }}
              >
                <Camera size={16} color="#059669" />
                <span>Food Scanner</span>
              </Link>
              <Link
                to="/what-can-i-eat"
                className="btn btn-secondary"
                style={{ padding: '12px', fontSize: '0.82rem', justifyContent: 'flex-start' }}
              >
                <UtensilsCrossed size={16} color="#f59e0b" />
                <span>Pantry Matcher</span>
              </Link>
              <Link
                to="/grocery"
                className="btn btn-secondary"
                style={{ padding: '12px', fontSize: '0.82rem', justifyContent: 'flex-start' }}
              >
                <ShoppingBag size={16} color="#0ea5e9" />
                <span>Grocery List</span>
              </Link>
              <Link
                to="/exercise"
                className="btn btn-secondary"
                style={{ padding: '12px', fontSize: '0.82rem', justifyContent: 'flex-start' }}
              >
                <TrendingUp size={16} color="#8b5cf6" />
                <span>Log Workout</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Food Replacement Modal */}
      {selectedMealForReplace && (
        <FoodReplaceModal
          meal={selectedMealForReplace}
          onClose={() => setSelectedMealForReplace(null)}
          onSuccess={() => loadDashboardData()}
        />
      )}
    </div>
  );
}
