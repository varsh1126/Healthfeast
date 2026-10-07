import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dietService } from '../api/services';
import MealCard from '../components/MealCard';
import FoodReplaceModal from '../components/FoodReplaceModal';
import DisclaimerBanner from '../components/DisclaimerBanner';
import { Layers, ShoppingBag, Sparkles, RefreshCw, Calendar, IndianRupee } from 'lucide-react';

export default function WeeklyPlanPage() {
  const [activePlan, setActivePlan] = useState(null);
  const [selectedMealForReplace, setSelectedMealForReplace] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWeeklyPlan();
  }, []);

  const loadWeeklyPlan = async () => {
    setLoading(true);
    try {
      const data = await dietService.getActivePlan();
      setActivePlan(data);
    } catch (err) {
      console.error('Failed to load weekly plan:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (mealId, action) => {
    try {
      await dietService.updateMealStatus(mealId, action);
      loadWeeklyPlan();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  if (loading) {
    return (
      <div className="page-container app-container" style={{ textAlign: 'center', padding: '140px 0' }}>
        <div style={{
          width: '36px',
          height: '36px',
          border: '3px solid #10b981',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          margin: '0 auto 16px auto',
          animation: 'spin 1s linear infinite'
        }} />
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Loading 7-Day Plan...</h3>
      </div>
    );
  }

  const weeklyDays = activePlan?.weekly_plan || [];

  return (
    <div className="page-container app-container">
      <DisclaimerBanner />

      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '32px'
      }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a' }}>
            7-Day Weekly Personalized Planner
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Complete Monday through Sunday Indian nutrition architecture
          </p>
        </div>

        <Link to="/grocery" className="btn btn-primary" style={{ padding: '12px 24px', borderRadius: '14px' }}>
          <ShoppingBag size={18} />
          <span>Generate Grocery List</span>
        </Link>
      </div>

      {/* Days Stack */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '36px', marginBottom: '40px' }}>
        {weeklyDays.map((dayData) => (
          <div key={dayData.day} className="glass-panel" style={{ padding: '28px' }}>
            {/* Day Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              paddingBottom: '16px',
              borderBottom: '1px solid #e2e8f0',
              marginBottom: '20px'
            }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
                  {dayData.day}
                </h3>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Est. Daily Cost: ~₹{dayData.totals?.estimated_cost_inr}
                </div>
              </div>

              {/* Day Nutrition Totals Badge */}
              <div style={{
                display: 'flex',
                gap: '16px',
                background: '#f8fafc',
                padding: '8px 16px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                fontSize: '0.85rem'
              }}>
                <div><strong>{dayData.totals?.calories}</strong> kcal</div>
                <div style={{ color: '#10b981' }}><strong>{dayData.totals?.protein_g}g</strong> protein</div>
                <div style={{ color: '#3b82f6' }}><strong>{dayData.totals?.carbs_g}g</strong> carbs</div>
                <div style={{ color: '#ec4899' }}><strong>{dayData.totals?.fat_g}g</strong> fat</div>
              </div>
            </div>

            {/* Meals in Day */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px'
            }}>
              {dayData.meals.map((meal) => (
                <MealCard
                  key={meal.id}
                  meal={meal}
                  onMarkEaten={handleStatusUpdate}
                  onSkipMeal={handleStatusUpdate}
                  onOpenReplace={(m) => setSelectedMealForReplace(m)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Replacement Modal */}
      {selectedMealForReplace && (
        <FoodReplaceModal
          meal={selectedMealForReplace}
          onClose={() => setSelectedMealForReplace(null)}
          onSuccess={() => loadWeeklyPlan()}
        />
      )}
    </div>
  );
}
