import React, { useState, useEffect } from 'react';
import { trackingService } from '../api/services';
import DisclaimerBanner from '../components/DisclaimerBanner';
import { Droplet, Plus, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function HydrationPage() {
  const [waterData, setWaterData] = useState({ today_total_ml: 0, target_ml: 2600, percentage: 0, weekly_history: [] });
  const [customAmount, setCustomAmount] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWater();
  }, []);

  const loadWater = async () => {
    setLoading(true);
    try {
      const data = await trackingService.getWater();
      setWaterData(data);
    } catch (err) {
      console.error('Error loading water data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddWater = async (amount) => {
    const val = Number(amount);
    if (!val || val <= 0) return;
    try {
      const res = await trackingService.logWater(val);
      setWaterData((prev) => ({
        ...prev,
        today_total_ml: res.today_total_ml,
        percentage: res.percentage
      }));
      setCustomAmount('');
      if (res.percentage >= 100) {
        try {
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        } catch {}
      }
      loadWater();
    } catch (err) {
      console.error('Error logging water:', err);
    }
  };

  return (
    <div className="page-container app-container" style={{ maxWidth: '840px' }}>
      <DisclaimerBanner />

      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a' }}>
          Hydration & Fluid Tracker
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
          Cellular hydration supports dermal elasticity, cognitive sharpness, and kidney health
        </p>
      </div>

      {/* Main Hydration Cylinder Visual */}
      <div className="glass-panel" style={{
        padding: '36px',
        textAlign: 'center',
        marginBottom: '36px',
        background: 'linear-gradient(135deg, rgba(240, 249, 255, 0.9) 0%, rgba(255, 255, 255, 0.95) 100%)',
        border: '1.5px solid #bae6fd'
      }}>
        {/* Animated Cylinder / Bottle Ring */}
        <div style={{
          width: '160px',
          height: '160px',
          borderRadius: '50%',
          border: '8px solid #e0f2fe',
          margin: '0 auto 20px auto',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle, #e0f2fe 0%, #ffffff 80%)'
        }}>
          <Droplet size={28} color="#0284c7" />
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0284c7', lineHeight: 1, marginTop: '4px' }}>
            {waterData.today_total_ml}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
            / {waterData.target_ml} ml
          </div>
        </div>

        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0369a1', marginBottom: '6px' }}>
          {waterData.percentage}% of Daily Target Completed
        </h3>
        <p style={{ fontSize: '0.85rem', color: '#64748b', maxWidth: '440px', margin: '0 auto 24px auto' }}>
          {waterData.percentage >= 100
            ? "Congratulations! You've achieved your optimal hydration volume for today."
            : `Keep sipping! You need approximately ${Math.max(0, waterData.target_ml - waterData.today_total_ml)} ml more.`}
        </p>

        {/* Quick Log Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
          <button
            onClick={() => handleAddWater(250)}
            className="btn btn-outline"
            style={{ padding: '12px 24px', borderRadius: '14px', fontSize: '0.95rem' }}
          >
            <Droplet size={16} color="#0ea5e9" />
            <span>+250 ml (1 Glass)</span>
          </button>

          <button
            onClick={() => handleAddWater(500)}
            className="btn btn-primary"
            style={{ padding: '12px 24px', borderRadius: '14px', fontSize: '0.95rem', background: '#0284c7' }}
          >
            <Droplet size={16} />
            <span>+500 ml (1 Bottle)</span>
          </button>
        </div>

        {/* Custom Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddWater(customAmount);
          }}
          style={{ display: 'inline-flex', gap: '8px', maxWidth: '320px', width: '100%' }}
        >
          <input
            type="number"
            min="50"
            max="2000"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            placeholder="Custom ml (e.g. 350)"
            className="input-field"
            style={{ fontSize: '0.88rem' }}
          />
          <button type="submit" className="btn btn-secondary">
            Log
          </button>
        </form>
      </div>

      {/* Weekly History Bars */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '20px' }}>
          7-Day Hydration Consistency
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '12px',
          textAlign: 'center',
          alignItems: 'flex-end',
          minHeight: '140px'
        }}>
          {(waterData.weekly_history || []).map((day, idx) => {
            const heightPct = Math.min(100, Math.round((day.amount_ml / Math.max(1, waterData.target_ml)) * 100));
            return (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284c7', marginBottom: '6px' }}>
                  {day.amount_ml}
                </div>
                <div style={{
                  width: '100%',
                  height: '100px',
                  background: '#f1f5f9',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'flex-end',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: '100%',
                    height: `${heightPct}%`,
                    background: heightPct >= 80 ? '#0284c7' : '#38bdf8',
                    borderRadius: '10px 10px 0 0',
                    transition: 'height 0.5s ease'
                  }} />
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, marginTop: '8px' }}>
                  {day.day}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
