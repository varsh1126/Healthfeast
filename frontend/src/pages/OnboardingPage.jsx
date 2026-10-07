import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { profileService } from '../api/services';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  AlertCircle,
  HelpCircle,
  ShieldAlert,
  Heart,
  Scale,
  Activity,
  Utensils
} from 'lucide-react';

export default function OnboardingPage() {
  const { profile, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    age: profile?.age || 26,
    gender: profile?.gender || 'male',
    height_cm: profile?.height_cm || 170,
    weight_kg: profile?.weight_kg || 68,
    waist_cm: profile?.waist_cm || 82,

    activity_level: profile?.activity_level || 'moderate',
    sleep_hours: profile?.sleep_hours || 7.5,
    exercise_frequency: profile?.exercise_frequency || 4,

    diet_type: profile?.diet_type || 'vegetarian',
    meals_per_day: profile?.meals_per_day || 4,
    cooking_time_pref: profile?.cooking_time_pref || 'moderate_under_45',
    daily_budget_inr: profile?.daily_budget_inr || 250,
    favorite_foods: profile?.favorite_foods?.join(', ') || 'Paneer, Moong Dal, Poha',
    disliked_foods: profile?.disliked_foods?.join(', ') || 'Karela, Oats',

    fitness_goal: profile?.fitness_goal || 'maintain_weight',

    allergies: profile?.allergies || [],
    health_conditions: profile?.health_conditions || []
  });

  const ALLERGY_OPTIONS = [
    'Peanuts', 'Tree Nuts', 'Milk & Dairy', 'Eggs', 'Seafood & Shellfish', 'Soy & Soya', 'Gluten & Wheat'
  ];

  const CONDITION_OPTIONS = [
    'Type 2 Diabetes', 'Hypertension (High Blood Pressure)', 'High Cholesterol / Dyslipidemia',
    'PCOS (Polycystic Ovary Syndrome)', 'Non-Alcoholic Fatty Liver (NAFLD)', 'Iron Deficiency Anemia',
    'Chronic Kidney Dietary Restrictions', 'No Known Condition'
  ];

  const toggleAllergy = (alg) => {
    setFormData((prev) => {
      const exists = prev.allergies.includes(alg);
      return {
        ...prev,
        allergies: exists ? prev.allergies.filter((a) => a !== alg) : [...prev.allergies, alg]
      };
    });
  };

  const toggleCondition = (cond) => {
    setFormData((prev) => {
      if (cond === 'No Known Condition') {
        return { ...prev, health_conditions: ['No Known Condition'] };
      }
      const filtered = prev.health_conditions.filter((c) => c !== 'No Known Condition');
      const exists = filtered.includes(cond);
      return {
        ...prev,
        health_conditions: exists ? filtered.filter((c) => c !== cond) : [...filtered, cond]
      };
    });
  };

  const handleNext = () => {
    setError('');
    setStep((s) => Math.min(4, s + 1));
  };

  const handleBack = () => {
    setError('');
    setStep((s) => Math.max(1, s - 1));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const payload = {
        ...formData,
        favorite_foods: formData.favorite_foods.split(',').map((s) => s.trim()).filter(Boolean),
        disliked_foods: formData.disliked_foods.split(',').map((s) => s.trim()).filter(Boolean),
        onboarding_completed: true
      };

      await profileService.updateProfile(payload);
      await refreshProfile();
      navigate('/health-analysis');
    } catch (err) {
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      padding: '110px 20px 60px 20px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '680px',
        width: '100%',
        padding: '36px',
        borderRadius: '24px',
        boxShadow: 'var(--shadow-xl)'
      }}>
        {/* Step Progress Bar */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.82rem', fontWeight: 700, color: '#059669' }}>
            <span>Smart Health Interview</span>
            <span>Step {step} of 4</span>
          </div>
          <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${(step / 4) * 100}%`,
              background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            padding: '12px 14px',
            borderRadius: '12px',
            fontSize: '0.85rem',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: Body Metrics */}
        {step === 1 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: '#ecfdf5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Scale size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                  Body Metrics & Demographics
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  Used to estimate your basal metabolic rate (BMR) via Mifflin-St Jeor
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Age (Years)
                </label>
                <input
                  type="number"
                  min="14"
                  max="100"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                  className="input-field"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Biological Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="input-field"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other / Neutral</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Height (cm)
                </label>
                <input
                  type="number"
                  min="100"
                  max="250"
                  value={formData.height_cm}
                  onChange={(e) => setFormData({ ...formData, height_cm: Number(e.target.value) })}
                  className="input-field"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Current Weight (kg)
                </label>
                <input
                  type="number"
                  min="30"
                  max="250"
                  step="0.5"
                  value={formData.weight_kg}
                  onChange={(e) => setFormData({ ...formData, weight_kg: Number(e.target.value) })}
                  className="input-field"
                />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Waist Circumference (Optional, cm)
              </label>
              <input
                type="number"
                min="40"
                max="180"
                value={formData.waist_cm || ''}
                onChange={(e) => setFormData({ ...formData, waist_cm: e.target.value ? Number(e.target.value) : null })}
                placeholder="e.g. 82"
                className="input-field"
              />
            </div>
          </div>
        )}

        {/* STEP 2: Lifestyle & Goals */}
        {step === 2 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: '#ecfdf5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Activity size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                  Lifestyle & Primary Fitness Goal
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  Determines your Total Daily Energy Expenditure (TDEE) and caloric targets
                </p>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Primary Goal
              </label>
              <select
                value={formData.fitness_goal}
                onChange={(e) => setFormData({ ...formData, fitness_goal: e.target.value })}
                className="input-field"
              >
                <option value="lose_weight">Lose Weight & Fat</option>
                <option value="gain_weight">Gain Healthy Weight</option>
                <option value="maintain_weight">Maintain Current Weight</option>
                <option value="get_fit">Get Fit & Energetic</option>
                <option value="build_muscle">Build Muscle (Hypertrophy Focus)</option>
                <option value="general_nutrition">Improve General Nutrition</option>
                <option value="skin_wellness">Support Healthy-Looking Skin & Glow</option>
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Daily Activity Level
              </label>
              <select
                value={formData.activity_level}
                onChange={(e) => setFormData({ ...formData, activity_level: e.target.value })}
                className="input-field"
              >
                <option value="sedentary">Sedentary (Desk job, minimal movement)</option>
                <option value="light">Lightly Active (1-3 days light exercise)</option>
                <option value="moderate">Moderately Active (3-5 days moderate exercise)</option>
                <option value="very_active">Very Active (6-7 days intense workouts)</option>
                <option value="extra_active">Extra Active (Intense training / physical labor)</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Average Sleep (Hours/Night)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="4"
                  max="12"
                  value={formData.sleep_hours}
                  onChange={(e) => setFormData({ ...formData, sleep_hours: Number(e.target.value) })}
                  className="input-field"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Exercise (Days / Week)
                </label>
                <input
                  type="number"
                  min="0"
                  max="7"
                  value={formData.exercise_frequency}
                  onChange={(e) => setFormData({ ...formData, exercise_frequency: Number(e.target.value) })}
                  className="input-field"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Diet & Indian Preferences */}
        {step === 3 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: '#ecfdf5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Utensils size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                  Dietary Patterns & Budget
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  We respect your authentic food choices and economic preferences
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Dietary Type
                </label>
                <select
                  value={formData.diet_type}
                  onChange={(e) => setFormData({ ...formData, diet_type: e.target.value })}
                  className="input-field"
                >
                  <option value="vegetarian">Vegetarian</option>
                  <option value="non_vegetarian">Non-Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="eggetarian">Eggetarian</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Daily Food Budget (INR)
                </label>
                <select
                  value={formData.daily_budget_inr}
                  onChange={(e) => setFormData({ ...formData, daily_budget_inr: Number(e.target.value) })}
                  className="input-field"
                >
                  <option value={150}>₹150 / day (Budget Superfoods)</option>
                  <option value={250}>₹250 / day (Standard Balanced)</option>
                  <option value={400}>₹400 / day (Premium Varieties)</option>
                  <option value={600}>₹600+ / day (Gourmet / High Protein)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Meals Per Day
                </label>
                <select
                  value={formData.meals_per_day}
                  onChange={(e) => setFormData({ ...formData, meals_per_day: Number(e.target.value) })}
                  className="input-field"
                >
                  <option value={3}>3 Meals (Breakfast, Lunch, Dinner)</option>
                  <option value={4}>4 Meals (+ Evening Snack)</option>
                  <option value={5}>5 Meals (+ Mid-Morning Refresh)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Cooking Time Preference
                </label>
                <select
                  value={formData.cooking_time_pref}
                  onChange={(e) => setFormData({ ...formData, cooking_time_pref: e.target.value })}
                  className="input-field"
                >
                  <option value="quick_under_20">Quick (&lt; 20 mins)</option>
                  <option value="moderate_under_45">Moderate (20 - 45 mins)</option>
                  <option value="elaborate">Elaborate (No time limit)</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Disliked Foods (Comma separated)
              </label>
              <input
                type="text"
                value={formData.disliked_foods}
                onChange={(e) => setFormData({ ...formData, disliked_foods: e.target.value })}
                placeholder="e.g. Karela, Oats, Brinjal"
                className="input-field"
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Favorite Foods (Comma separated)
              </label>
              <input
                type="text"
                value={formData.favorite_foods}
                onChange={(e) => setFormData({ ...formData, favorite_foods: e.target.value })}
                placeholder="e.g. Paneer, Moong Dal Chilla, Poha, Amla"
                className="input-field"
              />
            </div>
          </div>
        )}

        {/* STEP 4: Health Conditions & Allergies */}
        {step === 4 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: '#ecfdf5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ShieldAlert size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                  Safety Layer: Allergies & Health Conditions
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  Deterministic safety filtering eliminates contraindicated ingredients
                </p>
              </div>
            </div>

            {/* Allergies Selection */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                Food Allergies (Select all that apply)
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {ALLERGY_OPTIONS.map((alg) => {
                  const selected = formData.allergies.includes(alg);
                  return (
                    <button
                      key={alg}
                      type="button"
                      onClick={() => toggleAllergy(alg)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '10px',
                        border: selected ? '1.5px solid #ef4444' : '1px solid #cbd5e1',
                        background: selected ? '#fee2e2' : '#ffffff',
                        color: selected ? '#b91c1c' : '#475569',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      {selected && <Check size={14} />}
                      {alg}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Health Conditions Selection */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                Health Conditions / Clinical Dietary Constraints
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {CONDITION_OPTIONS.map((cond) => {
                  const selected = formData.health_conditions.includes(cond);
                  return (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => toggleCondition(cond)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '10px',
                        border: selected ? '1.5px solid #059669' : '1px solid #cbd5e1',
                        background: selected ? '#ecfdf5' : '#ffffff',
                        color: selected ? '#065f46' : '#475569',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      {selected && <Check size={14} />}
                      {cond}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Smart Clarification for Kidney or Clinical Conditions */}
            {formData.health_conditions.some((c) => c.includes('Kidney')) && (
              <div style={{
                background: '#fffbeb',
                border: '1px solid #fef3c7',
                padding: '12px 16px',
                borderRadius: '12px',
                marginBottom: '20px',
                fontSize: '0.82rem',
                color: '#92400e',
                lineHeight: 1.5
              }}>
                <strong>Smart Health Follow-up:</strong> For renal and kidney-related restrictions,
                HealthFeast adjusts protein limits to safe boundaries. Note that electrolyte levels
                (potassium, sodium, phosphorus) must be verified with your clinical nephrologist.
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '28px' }}>
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="btn btn-secondary"
              style={{ padding: '10px 20px' }}
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          ) : <div />}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="btn btn-primary"
              style={{ padding: '10px 24px' }}
            >
              <span>Continue</span>
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              disabled={loading}
              onClick={handleSubmit}
              className="btn btn-primary"
              style={{ padding: '10px 28px' }}
            >
              <Sparkles size={16} />
              <span>{loading ? 'Analyzing Health...' : 'Complete & View Analysis'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
