import React, { useState, useEffect } from 'react';
import { dietService } from '../api/services';
import MealCard from '../components/MealCard';
import FoodReplaceModal from '../components/FoodReplaceModal';
import DisclaimerBanner from '../components/DisclaimerBanner';
import { UtensilsCrossed, Sparkles, RefreshCw, Layers, Calendar, Flame } from 'lucide-react';

export default function PersonalizedDietPage() {
  const [activePlan, setActivePlan] = useState(null);
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedMealForReplace, setSelectedMealForReplace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    loadPlan();
  }, []);

  const loadPlan = async () => {
    setLoading(true);
    try {
      const data = await dietService.getActivePlan();
      setActivePlan(data);
    } catch (err) {
      console.error('Failed to load plan:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateWholePlan = async () => {
    setRegenerating(true);
    try {
      await dietService.generatePlan();
      await loadPlan();
    } catch (err) {
      console.error('Failed to regenerate plan:', err);
    } finally {
      setRegenerating(false);
    }
  };

  const handleStatusUpdate = async (mealId, action) => {
    try {
      await dietService.updateMealStatus(mealId, action);
      loadPlan();
    } catch (err) {
      console.error('Failed to update meal status:', err);
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
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Loading Personalized Diet...</h3>
      </div>
    );
  }

  const weeklyPlan = activePlan?.weekly_plan || [];
  const currentDayData = weeklyPlan[selectedDay] || weeklyPlan[0];
  const meals = currentDayData?.meals || [];
  const totals = currentDayData?.totals || {};

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
        marginBottom: '28px'
      }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a' }}>
            Personalized Diet Plan
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Scientific, goal-aligned Indian meals tailored to your taste, budget & constraints
          </p>
        </div>

        <button
          onClick={handleRegenerateWholePlan}
          disabled={regenerating}
          className="btn btn-outline"
          style={{ padding: '10px 20px', borderRadius: '12px' }}
        >
          <RefreshCw size={16} />
          <span>{regenerating ? 'Regenerating...' : 'Regenerate Entire Week'}</span>
        </button>
      </div>

      {/* Day Selector Pills */}
      <div style={{
        display: 'flex',
        gap: '10px',
        overflowX: 'auto',
        paddingBottom: '8px',
        marginBottom: '28px'
      }}>
        {weeklyPlan.map((d, idx) => {
          const isSelected = selectedDay === idx;
          return (
            <button
              key={d.day}
              onClick={() => setSelectedDay(idx)}
              style={{
                padding: '10px 18px',
                borderRadius: '14px',
                border: isSelected ? '2px solid #059669' : '1px solid #cbd5e1',
                background: isSelected ? '#ecfdf5' : '#ffffff',
                color: isSelected ? '#065f46' : '#475569',
                fontWeight: isSelected ? 800 : 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: '100px',
                transition: 'all 0.2s'
              }}
            >
              <span>{d.day}</span>
              <span style={{ fontSize: '0.72rem', color: isSelected ? '#059669' : '#94a3b8' }}>
                {d.totals?.calories} kcal
              </span>
            </button>
          );
        })}
      </div>

      {/* Day Summary Bar */}
      <div className="glass-panel" style={{
        padding: '20px 24px',
        marginBottom: '32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
            {currentDayData?.day} Target Fulfillment
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
            {totals.calories} <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>/ {activePlan?.targets?.calories || 1850} kcal</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Protein</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10b981' }}>{totals.protein_g}g</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Carbs</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#3b82f6' }}>{totals.carbs_g}g</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Fat</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ec4899' }}>{totals.fat_g}g</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Fiber</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#8b5cf6' }}>{totals.fiber_g}g</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Est. Cost</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#d97706' }}>₹{totals.estimated_cost_inr}</div>
          </div>
        </div>
      </div>

      {/* Meals Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px',
        marginBottom: '40px'
      }}>
        {meals.map((meal) => (
          <MealCard
            key={meal.id}
            meal={meal}
            onMarkEaten={handleStatusUpdate}
            onSkipMeal={handleStatusUpdate}
            onOpenReplace={(m) => setSelectedMealForReplace(m)}
          />
        ))}
      </div>

      {/* Food Replacement Modal */}
      {selectedMealForReplace && (
        <FoodReplaceModal
          meal={selectedMealForReplace}
          onClose={() => setSelectedMealForReplace(null)}
          onSuccess={() => loadPlan()}
        />
      )}
    </div>
  );
}
