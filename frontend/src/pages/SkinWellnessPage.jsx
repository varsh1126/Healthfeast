import React, { useState, useEffect } from 'react';
import { wellnessService } from '../api/services';
import DisclaimerBanner from '../components/DisclaimerBanner';
import {
  Sparkles,
  Droplet,
  Moon,
  Activity,
  Heart,
  ShieldCheck,
  CheckCircle2,
  Info,
  Apple,
  RefreshCw
} from 'lucide-react';

export default function SkinWellnessPage() {
  const [wellnessData, setWellnessData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);

  // Interactive habits simulator
  const [habits, setHabits] = useState({
    hydration_pct: 85,
    sleep_hours: 7.5,
    veggie_servings: 3,
    fruit_servings: 2,
    exercise_days: 4,
    sugar_intake_level: 'low'
  });

  useEffect(() => {
    loadSkinWellness();
  }, []);

  const loadSkinWellness = async () => {
    setLoading(true);
    try {
      const data = await wellnessService.getSkinWellness();
      setWellnessData(data);
    } catch (err) {
      console.error('Error loading skin wellness:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRecalculate = async () => {
    setCalculating(true);
    try {
      const data = await wellnessService.calculateSkinScore(habits);
      setWellnessData(data);
    } catch (err) {
      console.error('Recalculation error:', err);
    } finally {
      setCalculating(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container app-container" style={{ textAlign: 'center', padding: '140px 0' }}>
        <div style={{
          width: '36px',
          height: '36px',
          border: '3px solid #ec4899',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          margin: '0 auto 16px auto',
          animation: 'spin 1s linear infinite'
        }} />
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Synthesizing Dermal Nutrition & Wellness Markers...</h3>
      </div>
    );
  }

  const score = wellnessData?.score || 82;
  const tier = wellnessData?.tier || "Radiant & Nourished";
  const breakdown = wellnessData?.breakdown || {};
  const foods = wellnessData?.recommended_foods || [];
  const habitsList = wellnessData?.lifestyle_habits || [];

  return (
    <div className="page-container app-container" style={{ maxWidth: '1040px' }}>
      {/* Ethical Dermatological Disclaimer */}
      <div style={{
        background: '#fff1f2',
        border: '1px solid #fecdd3',
        borderRadius: '16px',
        padding: '16px 20px',
        marginBottom: '28px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        color: '#9f1239',
        fontSize: '0.85rem'
      }}>
        <ShieldCheck size={20} style={{ flexShrink: 0 }} />
        <span>
          <strong>Ethical Wellness Policy:</strong> HealthFeast does not promote skin whitening, fairness promises,
          or guaranteed acne treatments. Our Glow & Skin Wellness module focuses strictly on science-backed cellular hydration,
          collagen synthesis cofactors (Vitamin C, Zinc), and antioxidant defense.
        </span>
      </div>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: '#fdf2f8',
          color: '#db2777',
          padding: '6px 16px',
          borderRadius: '999px',
          fontSize: '0.82rem',
          fontWeight: 700,
          marginBottom: '12px'
        }}>
          <Sparkles size={14} />
          <span>Dermal Nutrition Architecture</span>
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0f172a' }}>
          Glow & Skin Wellness System
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '640px', margin: '8px auto 0 auto' }}>
          Healthy skin is an outward reflection of internal cellular nourishment, hydration, antioxidant defense, and restful sleep.
        </p>
      </div>

      {/* Main Score & Simulator Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '32px',
        marginBottom: '40px'
      }}>
        {/* Left: Overall Skin Wellness Score */}
        <div className="glass-panel" style={{
          padding: '36px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(253, 242, 248, 0.9) 0%, rgba(255, 255, 255, 0.95) 100%)',
          border: '1.5px solid #fbcfe8'
        }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#831843', marginBottom: '8px' }}>
            HealthFeast Skin Wellness Score
          </h3>
          <p style={{ fontSize: '0.82rem', color: '#9d174d', marginBottom: '24px' }}>
            Holistic lifestyle and nutrient adequacy index
          </p>

          <div style={{
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            background: 'conic-gradient(#ec4899 0%, #f43f5e 80%, #f1f5f9 80% 100%)',
            margin: '0 auto 24px auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px',
            boxShadow: '0 10px 25px rgba(236, 72, 153, 0.25)'
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              background: '#ffffff',
              borderRadius: '50%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '3rem', fontWeight: 800, color: '#be185d', lineHeight: 1 }}>
                {score}
              </span>
              <span style={{ fontSize: '0.8rem', color: '#9d174d', fontWeight: 600 }}>/ 100</span>
            </div>
          </div>

          <div style={{
            fontSize: '1.1rem',
            fontWeight: 800,
            color: '#be185d',
            marginBottom: '6px'
          }}>
            {tier}
          </div>
          <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.6 }}>
            {wellnessData?.summary}
          </p>
        </div>

        {/* Right: Interactive Lifestyle Factor Simulator */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '20px', color: '#0f172a' }}>
            Daily Habit Simulator
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                <span>Hydration Fulfillment</span>
                <span style={{ color: '#0ea5e9' }}>{habits.hydration_pct}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                value={habits.hydration_pct}
                onChange={(e) => setHabits({ ...habits, hydration_pct: Number(e.target.value) })}
                style={{ width: '100%', accentColor: '#0ea5e9' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                <span>Restful Sleep (Hours)</span>
                <span style={{ color: '#8b5cf6' }}>{habits.sleep_hours} hrs</span>
              </div>
              <input
                type="range"
                min="4"
                max="10"
                step="0.5"
                value={habits.sleep_hours}
                onChange={(e) => setHabits({ ...habits, sleep_hours: Number(e.target.value) })}
                style={{ width: '100%', accentColor: '#8b5cf6' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
                  Vegetable Servings
                </label>
                <input
                  type="number"
                  min="0"
                  max="8"
                  value={habits.veggie_servings}
                  onChange={(e) => setHabits({ ...habits, veggie_servings: Number(e.target.value) })}
                  className="input-field"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
                  Fresh Fruit Servings
                </label>
                <input
                  type="number"
                  min="0"
                  max="6"
                  value={habits.fruit_servings}
                  onChange={(e) => setHabits({ ...habits, fruit_servings: Number(e.target.value) })}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
                Added Sugar / Processed Snacks Intake
              </label>
              <select
                value={habits.sugar_intake_level}
                onChange={(e) => setHabits({ ...habits, sugar_intake_level: e.target.value })}
                className="input-field"
              >
                <option value="low">Low (Rarely consume sweet drinks / fried snacks)</option>
                <option value="moderate">Moderate (Occasional sweets / biscuits)</option>
                <option value="high">High (Frequent sugary chai, sodas, packaged sweets)</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleRecalculate}
            disabled={calculating}
            className="btn btn-warm"
            style={{ width: '100%', padding: '12px' }}
          >
            <RefreshCw size={16} />
            <span>{calculating ? 'Evaluating...' : 'Update & Recalculate Skin Score'}</span>
          </button>
        </div>
      </div>

      {/* Component Breakdown Cards */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '20px' }}>
          Diagnostic Lifestyle Pillars
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px'
        }}>
          {Object.entries(breakdown).map(([key, item]) => (
            <div key={key} className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'capitalize', color: '#1e293b' }}>
                  {key.replace('_', ' ')}
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ec4899' }}>
                  {item.score}/{item.max}
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5 }}>
                {item.feedback}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Skin-Supportive Foods */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '8px' }}>
          Curated Skin-Supportive Indian Superfoods
        </h3>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '24px' }}>
          Rich in Vitamin C, Carotenoids, Zinc, and Omega-3 fatty acids that support healthy epidermal barrier function
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {foods.map((food, idx) => (
            <div key={idx} className="glass-panel" style={{ padding: '24px' }}>
              <div style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#db2777',
                background: '#fdf2f8',
                padding: '4px 10px',
                borderRadius: '8px',
                display: 'inline-block',
                marginBottom: '10px'
              }}>
                {food.category}
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                {food.name}
              </h4>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#059669', marginBottom: '8px' }}>
                Key Nutrient: {food.key_nutrient}
              </div>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, marginBottom: '12px' }}>
                {food.benefit}
              </p>
              <div style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 600 }}>
                Serving: {food.serving}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
