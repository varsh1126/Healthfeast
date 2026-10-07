import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { profileService, dietService } from '../api/services';
import { useNavigate } from 'react-router-dom';
import DisclaimerBanner from '../components/DisclaimerBanner';
import {
  TrendingDown,
  TrendingUp,
  Scale,
  Zap,
  Dumbbell,
  Heart,
  Sparkles,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

const GOAL_MODES = [
  {
    id: 'lose_weight',
    title: 'Weight & Fat Loss',
    icon: TrendingDown,
    color: '#059669',
    bgColor: '#ecfdf5',
    tagline: 'Sustainable 400-500 kcal deficit with lean muscle protection',
    description: 'Focuses on high-satiety whole foods, high dietary fiber (legumes, vegetables, millets), and elevated protein to prevent muscle loss while burning adipose tissue safely.'
  },
  {
    id: 'build_muscle',
    title: 'Muscle Building & Hypertrophy',
    icon: Dumbbell,
    color: '#7c3aed',
    bgColor: '#f5f3ff',
    tagline: '1.8-2.0 g/kg protein paired with slight energy surplus',
    description: 'Prioritizes bioavailable amino acid combinations (paneer, dal-rice combinations, soya, eggs, chicken), timed post-workout carbs for glycogen resynthesis.'
  },
  {
    id: 'skin_wellness',
    title: 'Glow & Skin Wellness',
    icon: Sparkles,
    color: '#db2777',
    bgColor: '#fdf2f8',
    tagline: 'Dermal antioxidant density, collagen cofactors & hydration',
    description: 'Emphasizes dietary Vitamin C (amla, guava), provitamin A carotenoids (papaya, carrots), bioavailable zinc (pumpkin seeds), and omega-3s for barrier resilience.'
  },
  {
    id: 'maintain_weight',
    title: 'Weight Maintenance & Balance',
    icon: Scale,
    color: '#3b82f6',
    bgColor: '#eff6ff',
    tagline: 'Caloric equilibrium adhering to ICMR-NIN dietary guidelines',
    description: 'Provides consistent metabolic stability, balanced macronutrients (55% carbs, 20% protein, 25% fats), and steady all-day vitality.'
  },
  {
    id: 'get_fit',
    title: 'Functional Fitness & Stamina',
    icon: Zap,
    color: '#f59e0b',
    bgColor: '#fef3c7',
    tagline: 'Enhanced endurance and clean cellular energy',
    description: 'Optimized complex millets (ragi, jowar, bajra), electrolyte-rich fluids (coconut water, chaas), and sustained antioxidant recovery.'
  },
  {
    id: 'general_nutrition',
    title: 'General Wellness & Longevity',
    icon: Heart,
    color: '#10b981',
    bgColor: '#ecfdf5',
    tagline: 'Whole-food diversity & gut microbiome protection',
    description: 'Focuses on fiber diversity, fermented probiotics (dahi, idli), seasonal greens, and low-sodium, zero-trans-fat Indian recipes.'
  }
];

export default function GoalDietPage() {
  const { profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [selectedGoal, setSelectedGoal] = useState(profile?.fitness_goal || 'maintain_weight');
  const [updating, setUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleApplyGoal = async (goalId) => {
    setSelectedGoal(goalId);
    setUpdating(true);
    setSuccessMsg('');
    try {
      await profileService.updateProfile({ fitness_goal: goalId });
      await dietService.generatePlan();
      await refreshProfile();
      setSuccessMsg(`Successfully calibrated plan for ${goalId.replace('_', ' ')}!`);
      setTimeout(() => navigate('/diet'), 1200);
    } catch (err) {
      console.error('Failed to update goal:', err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="page-container app-container" style={{ maxWidth: '1040px' }}>
      <DisclaimerBanner />

      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.3rem', fontWeight: 800, color: '#0f172a' }}>
          Personalized Goal Modes
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '640px', margin: '8px auto 0 auto' }}>
          Select your active fitness objective. HealthFeast dynamically retunes your BMR multipliers,
          protein ratios, and culinary recommendations.
        </p>
      </div>

      {successMsg && (
        <div style={{
          background: '#ecfdf5',
          border: '1px solid #a7f3d0',
          color: '#065f46',
          padding: '14px',
          borderRadius: '14px',
          textAlign: 'center',
          fontWeight: 700,
          marginBottom: '24px'
        }}>
          {successMsg}
        </div>
      )}

      {/* Goal Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
        marginBottom: '40px'
      }}>
        {GOAL_MODES.map((mode) => {
          const Icon = mode.icon;
          const isActive = profile?.fitness_goal === mode.id;

          return (
            <div
              key={mode.id}
              className="glass-panel"
              style={{
                padding: '28px',
                border: isActive ? `2px solid ${mode.color}` : '1px solid var(--border-light)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: mode.bgColor,
                    color: mode.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon size={24} />
                  </div>
                  {isActive && (
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      color: mode.color,
                      background: mode.bgColor,
                      padding: '4px 10px',
                      borderRadius: '8px'
                    }}>
                      Active Mode
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                  {mode.title}
                </h3>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: mode.color, marginBottom: '12px' }}>
                  {mode.tagline}
                </div>
                <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6, marginBottom: '20px' }}>
                  {mode.description}
                </p>
              </div>

              <button
                disabled={updating || isActive}
                onClick={() => handleApplyGoal(mode.id)}
                className={`btn ${isActive ? 'btn-secondary' : 'btn-primary'}`}
                style={{ width: '100%', padding: '10px' }}
              >
                {isActive ? (
                  <span>Currently Applied</span>
                ) : (
                  <>
                    <span>Switch to This Goal</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
