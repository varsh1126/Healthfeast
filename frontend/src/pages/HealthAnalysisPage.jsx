import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { healthService, dietService } from '../api/services';
import { useAuth } from '../context/AuthContext';
import {
  Activity,
  Flame,
  Droplet,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Info,
  Scale,
  HeartPulse,
  Dna
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function HealthAnalysisPage() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAnalysis();
  }, []);

  const loadAnalysis = async () => {
    setLoading(true);
    try {
      const data = await healthService.analyzeHealth();
      setAnalysis(data);
    } catch (err) {
      setError('Unable to load health analysis. Please verify your profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePlan = async () => {
    setGenerating(true);
    try {
      await dietService.generatePlan();
      // Celebrate plan generation with confetti
      try {
        confetti({ particleCount: 75, spread: 60, origin: { y: 0.6 } });
      } catch {}
      navigate('/diet');
    } catch (err) {
      setError('Failed to generate 7-day meal plan. Please try again.');
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container app-container" style={{ textAlign: 'center', padding: '140px 0' }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #10b981',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          margin: '0 auto 16px auto',
          animation: 'spin 1s linear infinite'
        }} />
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b' }}>
          Computing Personalized Health & Nutrition Metrics...
        </h3>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          Applying Mifflin-St Jeor equation and ICMR-NIN macronutrient distributions
        </p>
      </div>
    );
  }

  return (
    <div className="page-container app-container" style={{ maxWidth: '980px' }}>
      {/* Page Header */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: '#ecfdf5',
          color: '#059669',
          padding: '6px 14px',
          borderRadius: '999px',
          fontSize: '0.82rem',
          fontWeight: 700,
          marginBottom: '12px'
        }}>
          <Sparkles size={14} />
          <span>Scientific Nutrition Synthesis</span>
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
          Your Health & Nutrition Analysis
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '640px', margin: '8px auto 0 auto' }}>
          Estimates derived from validated biological equations (Mifflin-St Jeor) and ICMR-NIN dietary guidelines.
        </p>
      </div>

      {error && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#b91c1c',
          padding: '14px',
          borderRadius: '12px',
          marginBottom: '24px'
        }}>
          {error}
        </div>
      )}

      {/* Main Metabolic Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {/* BMI Card */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ padding: '8px', background: '#eff6ff', borderRadius: '10px', color: '#2563eb' }}>
                <Scale size={20} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>BMI Screening</h3>
            </div>
            <span style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: '8px',
              background: '#f1f5f9',
              color: analysis.bmi_color || '#10b981'
            }}>
              {analysis.bmi_category}
            </span>
          </div>

          <div style={{ fontSize: '2.8rem', fontWeight: 800, color: '#0f172a', lineHeight: 1, marginBottom: '8px' }}>
            {analysis.bmi}
          </div>
          <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, marginBottom: '12px' }}>
            {analysis.bmi_guidance}
          </p>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>
            *Note: BMI is a screening indicator and does not replace diagnostic body composition analysis.
          </div>
        </div>

        {/* Caloric Energy Target */}
        <div className="glass-panel" style={{ padding: '28px', border: '1.5px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ padding: '8px', background: '#ecfdf5', borderRadius: '10px', color: '#059669' }}>
                <Flame size={20} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Daily Calorie Target</h3>
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#059669', background: '#d1fae5', padding: '4px 10px', borderRadius: '8px' }}>
              Optimized
            </span>
          </div>

          <div style={{ fontSize: '2.8rem', fontWeight: 800, color: '#059669', lineHeight: 1, marginBottom: '8px' }}>
            {analysis.calories} <span style={{ fontSize: '1.2rem', fontWeight: 600, color: '#64748b' }}>kcal</span>
          </div>
          <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: '#64748b' }}>
            <div>BMR: <strong>{analysis.bmr}</strong> kcal</div>
            <div>TDEE: <strong>{analysis.tdee}</strong> kcal</div>
          </div>
        </div>

        {/* Hydration Card */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ padding: '8px', background: '#e0f2fe', borderRadius: '10px', color: '#0284c7' }}>
                <Droplet size={20} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Hydration Target</h3>
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0284c7', background: '#bae6fd', padding: '4px 10px', borderRadius: '8px' }}>
              Daily Fluid
            </span>
          </div>

          <div style={{ fontSize: '2.8rem', fontWeight: 800, color: '#0284c7', lineHeight: 1, marginBottom: '8px' }}>
            {analysis.hydration_ml} <span style={{ fontSize: '1.2rem', fontWeight: 600, color: '#64748b' }}>ml</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Approx. {Math.round(analysis.hydration_ml / 250)} standard glasses (including water, buttermilk & herbal infusions).
          </p>
        </div>
      </div>

      {/* Macronutrient Distribution Card */}
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px', color: '#0f172a' }}>
          Target Macronutrient Breakdown
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '24px'
        }}>
          {/* Protein */}
          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase' }}>
              Protein Target
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>
              {analysis.protein_g}g
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              ~{analysis.macro_distribution?.protein_pct}% of total daily energy
            </div>
          </div>

          {/* Carbs */}
          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase' }}>
              Complex Carbs
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>
              {analysis.carbs_g}g
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              ~{analysis.macro_distribution?.carbs_pct}% of total daily energy
            </div>
          </div>

          {/* Fats */}
          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ec4899', textTransform: 'uppercase' }}>
              Healthy Fats
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>
              {analysis.fat_g}g
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              ~{analysis.macro_distribution?.fat_pct}% of total daily energy
            </div>
          </div>

          {/* Dietary Fiber */}
          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#8b5cf6', textTransform: 'uppercase' }}>
              Dietary Fiber
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>
              {analysis.fiber_g}g
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Supports gut microbiome & skin radiance
            </div>
          </div>
        </div>

        {/* Visual Macro Bar */}
        <div style={{ height: '14px', borderRadius: '999px', overflow: 'hidden', display: 'flex', background: '#e2e8f0' }}>
          <div style={{ width: `${analysis.macro_distribution?.protein_pct || 25}%`, background: '#10b981' }} title="Protein" />
          <div style={{ width: `${analysis.macro_distribution?.carbs_pct || 50}%`, background: '#3b82f6' }} title="Carbohydrates" />
          <div style={{ width: `${analysis.macro_distribution?.fat_pct || 25}%`, background: '#ec4899' }} title="Fats" />
        </div>
      </div>

      {/* Primary Action Button */}
      <div style={{
        textAlign: 'center',
        padding: '36px',
        background: 'linear-gradient(135deg, rgba(236, 253, 245, 0.8) 0%, rgba(254, 243, 199, 0.6) 100%)',
        borderRadius: '24px',
        border: '1px solid #a7f3d0',
        marginBottom: '40px'
      }}>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#065f46', marginBottom: '8px' }}>
          Ready for Your 7-Day Personalized Plan?
        </h3>
        <p style={{ color: '#047857', fontSize: '0.92rem', maxWidth: '580px', margin: '0 auto 24px auto' }}>
          Our recommendation engine will construct a week of authentic Indian meals matching these exact targets,
          respecting your allergies, budget, and taste preferences.
        </p>

        <button
          onClick={handleGeneratePlan}
          disabled={generating}
          className="btn btn-primary"
          style={{ padding: '16px 36px', fontSize: '1.05rem', borderRadius: '16px' }}
        >
          <Sparkles size={20} />
          <span>{generating ? 'Crafting 7-Day Meal Plan...' : 'Generate 7-Day Personalized Meal Plan ✨'}</span>
        </button>
      </div>
    </div>
  );
}
