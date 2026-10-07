import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { profileService } from '../api/services';
import DisclaimerBanner from '../components/DisclaimerBanner';
import { Settings, Save, Check, AlertCircle, User, ShieldCheck } from 'lucide-react';

export default function SettingsPage() {
  const { profile, refreshProfile } = useAuth();
  const [formData, setFormData] = useState({
    age: profile?.age || 26,
    weight_kg: profile?.weight_kg || 68,
    height_cm: profile?.height_cm || 170,
    waist_cm: profile?.waist_cm || 82,
    diet_type: profile?.diet_type || 'vegetarian',
    fitness_goal: profile?.fitness_goal || 'maintain_weight',
    daily_budget_inr: profile?.daily_budget_inr || 250,
    meals_per_day: profile?.meals_per_day || 4,
    cooking_time_pref: profile?.cooking_time_pref || 'moderate_under_45',
    favorite_foods: profile?.favorite_foods?.join(', ') || '',
    disliked_foods: profile?.disliked_foods?.join(', ') || ''
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      const payload = {
        ...formData,
        age: Number(formData.age),
        weight_kg: Number(formData.weight_kg),
        height_cm: Number(formData.height_cm),
        waist_cm: formData.waist_cm ? Number(formData.waist_cm) : null,
        daily_budget_inr: Number(formData.daily_budget_inr),
        meals_per_day: Number(formData.meals_per_day),
        favorite_foods: formData.favorite_foods.split(',').map((s) => s.trim()).filter(Boolean),
        disliked_foods: formData.disliked_foods.split(',').map((s) => s.trim()).filter(Boolean)
      };

      await profileService.updateProfile(payload);
      await refreshProfile();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to update profile settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container app-container" style={{ maxWidth: '800px' }}>
      <DisclaimerBanner />

      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a' }}>
          Health Profile & Preferences Settings
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
          Update your parameters anytime. The HealthFeast engine dynamically recalibrates your recommendations.
        </p>
      </div>

      {success && (
        <div style={{
          background: '#ecfdf5',
          border: '1px solid #a7f3d0',
          color: '#065f46',
          padding: '14px',
          borderRadius: '12px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: 600
        }}>
          <Check size={18} />
          <span>Profile updated! AI assistant and recommendations are now synchronized.</span>
        </div>
      )}

      {error && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#b91c1c',
          padding: '14px',
          borderRadius: '12px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '36px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px', color: '#0f172a' }}>
          Physical & Metabolic Attributes
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '28px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Age
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Weight (kg)
            </label>
            <input
              type="number"
              step="0.5"
              name="weight_kg"
              value={formData.weight_kg}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Height (cm)
            </label>
            <input
              type="number"
              name="height_cm"
              value={formData.height_cm}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Daily Budget (₹)
            </label>
            <input
              type="number"
              name="daily_budget_inr"
              value={formData.daily_budget_inr}
              onChange={handleChange}
              className="input-field"
            />
          </div>
        </div>

        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px', color: '#0f172a' }}>
          Dietary Patterns & Taste Preferences
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Dietary Pattern
            </label>
            <select
              name="diet_type"
              value={formData.diet_type}
              onChange={handleChange}
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
              Primary Goal
            </label>
            <select
              name="fitness_goal"
              value={formData.fitness_goal}
              onChange={handleChange}
              className="input-field"
            >
              <option value="lose_weight">Lose Weight & Fat</option>
              <option value="gain_weight">Gain Healthy Weight</option>
              <option value="maintain_weight">Maintain Weight</option>
              <option value="build_muscle">Build Muscle</option>
              <option value="skin_wellness">Support Skin Wellness</option>
              <option value="general_nutrition">General Nutrition</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Cooking Time
            </label>
            <select
              name="cooking_time_pref"
              value={formData.cooking_time_pref}
              onChange={handleChange}
              className="input-field"
            >
              <option value="quick_under_20">Quick (&lt; 20 mins)</option>
              <option value="moderate_under_45">Moderate (20-45 mins)</option>
              <option value="elaborate">Elaborate</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
            Favorite Foods (Comma separated)
          </label>
          <input
            type="text"
            name="favorite_foods"
            value={formData.favorite_foods}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div style={{ marginBottom: '32px' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
            Disliked Foods (Comma separated)
          </label>
          <input
            type="text"
            name="disliked_foods"
            value={formData.disliked_foods}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="btn btn-primary"
          style={{ padding: '14px 32px', fontSize: '1rem', borderRadius: '12px' }}
        >
          <Save size={18} />
          <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
        </button>
      </form>
    </div>
  );
}
