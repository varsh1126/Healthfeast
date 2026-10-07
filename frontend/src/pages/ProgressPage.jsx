import React, { useState, useEffect } from 'react';
import { trackingService, adaptiveService } from '../api/services';
import DisclaimerBanner from '../components/DisclaimerBanner';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';
import {
  TrendingUp,
  Scale,
  Sparkles,
  Award,
  CheckCircle2,
  Calendar,
  Plus
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ProgressPage() {
  const [progressHistory, setProgressHistory] = useState([]);
  const [adaptiveReview, setAdaptiveReview] = useState(null);
  const [newWeight, setNewWeight] = useState('');
  const [newWaist, setNewWaist] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    setLoading(true);
    try {
      const [progRes, revRes] = await Promise.allSettled([
        trackingService.getProgress(),
        adaptiveService.getWeeklyReview()
      ]);

      if (progRes.status === 'fulfilled') {
        setProgressHistory(progRes.value.history || []);
      }
      if (revRes.status === 'fulfilled') {
        setAdaptiveReview(revRes.value);
      }
    } catch (err) {
      console.error('Error loading progress:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogProgress = async (e) => {
    e.preventDefault();
    if (!newWeight) return;
    setSubmitting(true);
    try {
      await trackingService.logProgress({
        weight_kg: Number(newWeight),
        waist_cm: newWaist ? Number(newWaist) : null
      });
      setNewWeight('');
      setNewWaist('');
      try {
        confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
      } catch {}
      await loadProgress();
    } catch (err) {
      console.error('Failed to log progress:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const chartData = progressHistory.map((item) => ({
    date: item.date?.slice(5) || '',
    weight: item.weight_kg,
    adherence: item.adherence_pct
  }));

  const latestWeight = progressHistory[progressHistory.length - 1]?.weight_kg || 68;
  const initialWeight = progressHistory[0]?.weight_kg || latestWeight;
  const deltaWeight = Math.round((latestWeight - initialWeight) * 10) / 10;

  return (
    <div className="page-container app-container" style={{ maxWidth: '1040px' }}>
      <DisclaimerBanner />

      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a' }}>
          Health Trends & Adaptive AI Review
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
          Continuous analysis of tracking, meal adherence, and metabolic evolution
        </p>
      </div>

      {/* KPI Cards Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
            Current Weight
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>
            {latestWeight} kg
          </div>
          <div style={{ fontSize: '0.8rem', color: deltaWeight <= 0 ? '#059669' : '#d97706', fontWeight: 600 }}>
            {deltaWeight <= 0 ? `${deltaWeight} kg change` : `+${deltaWeight} kg change`}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
            Weekly Adherence
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981', margin: '4px 0' }}>
            {adaptiveReview?.adherence_percentage || 88}%
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Consistent logging pattern
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
            Log New Measurement
          </div>
          <form onSubmit={handleLogProgress} style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <input
              type="number"
              step="0.1"
              required
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              placeholder="Weight (kg)"
              className="input-field"
              style={{ padding: '8px', fontSize: '0.85rem' }}
            />
            <button type="submit" disabled={submitting} className="btn btn-primary" style={{ padding: '8px 14px' }}>
              <Plus size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* Recharts Weight Trend Chart */}
      <div className="glass-panel" style={{ padding: '28px', marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
          Weight Trajectory
        </h3>

        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
              <YAxis domain={['auto', 'auto']} stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  border: '1px solid #e2e8f0'
                }}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#059669"
                strokeWidth={3}
                dot={{ r: 5, fill: '#059669' }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Adaptive AI Review Card (Section 25) */}
      <div className="glass-card-ai" style={{ padding: '32px', marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: '#8b5cf6',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Sparkles size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#4c1d95' }}>
              Weekly Adaptive AI Review
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#6d28d9' }}>
              Synthesizing your meal logs, swaps, and ratings to refine upcoming recommendations
            </p>
          </div>
        </div>

        {/* Actionable Insights */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e1b4b', marginBottom: '10px' }}>
            Behavioral Observations & Learning Signals:
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {(adaptiveReview?.insights || []).map((ins, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.88rem', color: '#334155' }}>
                <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '3px' }} />
                <span>{ins}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Adaptations applied */}
        {adaptiveReview?.adaptations_applied && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.7)',
            padding: '16px',
            borderRadius: '14px',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            fontSize: '0.85rem',
            color: '#475569',
            marginBottom: '16px'
          }}>
            <div>
              <strong>Calibrated Penalties:</strong>{' '}
              {adaptiveReview.adaptations_applied.penalized_ingredients?.join(', ') || 'None this week'}
            </div>
            <div style={{ marginTop: '4px' }}>
              <strong>Promoted Favorites:</strong>{' '}
              {adaptiveReview.adaptations_applied.promoted_favorites?.join(', ') || 'Balanced selection'}
            </div>
          </div>
        )}

        <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#059669' }}>
          💡 Next Week Focus: {adaptiveReview?.next_week_focus}
        </div>
      </div>
    </div>
  );
}
