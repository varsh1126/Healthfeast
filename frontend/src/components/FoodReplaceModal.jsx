import React, { useState, useEffect } from 'react';
import { dietService } from '../api/services';
import { X, RefreshCw, Check, AlertCircle, Sparkles, IndianRupee } from 'lucide-react';

export default function FoodReplaceModal({ meal, onClose, onSuccess }) {
  const [replacements, setReplacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    if (!meal) return;
    loadReplacements();
  }, [meal]);

  const loadReplacements = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await dietService.getMealReplacements(meal.id);
      setReplacements(data.replacements || []);
    } catch (err) {
      setError('Unable to load compatible replacements. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (foodId) => {
    setApplying(true);
    try {
      await dietService.applyMealReplacement(meal.id, foodId);
      onSuccess();
      onClose();
    } catch (err) {
      setError('Failed to apply replacement. Please try again.');
      setApplying(false);
    }
  };

  if (!meal) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(8px)',
      zIndex: 1100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '680px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        padding: '28px',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#64748b'
          }}
        >
          <X size={18} />
        </button>

        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
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
            <RefreshCw size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
              Replace Meal
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Swap <strong>{meal.food?.name || meal.meal_title}</strong> with macro-compatible alternatives
            </p>
          </div>
        </div>

        {/* Current Meal Reference Banner */}
        <div style={{
          background: '#f8fafc',
          borderRadius: '14px',
          padding: '12px 16px',
          border: '1px solid #e2e8f0',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
              Current Dish Target
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b' }}>
              {meal.food?.name}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px', textAlign: 'right' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Calories</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f59e0b' }}>{Math.round(meal.calories)} kcal</div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Protein</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#10b981' }}>{meal.protein_g}g</div>
            </div>
          </div>
        </div>

        {/* Status States */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
            <div style={{ marginBottom: '12px' }}>Finding safe, nutritionally compatible Indian alternatives...</div>
            <div style={{
              width: '32px',
              height: '32px',
              border: '3px solid #10b981',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              margin: '0 auto',
              animation: 'spin 1s linear infinite'
            }} />
          </div>
        )}

        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            padding: '12px',
            borderRadius: '12px',
            marginBottom: '16px',
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* List of Replacements */}
        {!loading && replacements.length === 0 && !error && (
          <div style={{ textAlign: 'center', padding: '32px 0', color: '#64748b' }}>
            No alternative candidates found for this specific slot. Try adjusting dietary preferences.
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {replacements.map((item) => {
            const f = item.food;
            return (
              <div
                key={f.id}
                style={{
                  border: '1.5px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '16px',
                  transition: 'border-color 0.2s',
                  background: '#ffffff'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                      {f.name}
                    </h4>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '6px',
                      background: '#ecfdf5',
                      color: '#059669'
                    }}>
                      {item.similarity_score}% Match
                    </span>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '8px' }}>
                    {f.serving_size_desc} • ~₹{Math.round(f.estimated_cost_inr)}
                  </div>

                  {/* Delta stats */}
                  <div style={{ display: 'flex', gap: '12px', fontSize: '0.78rem' }}>
                    <span style={{ color: '#475569' }}>
                      <strong>{Math.round(f.calories)}</strong> kcal ({item.calorie_difference > 0 ? `+${item.calorie_difference}` : item.calorie_difference})
                    </span>
                    <span style={{ color: '#475569' }}>
                      <strong>{f.protein_g}g</strong> protein ({item.protein_difference > 0 ? `+${item.protein_difference}` : item.protein_difference}g)
                    </span>
                  </div>
                </div>

                <button
                  disabled={applying}
                  onClick={() => handleApply(f.id)}
                  className="btn btn-primary"
                  style={{
                    padding: '8px 18px',
                    fontSize: '0.85rem',
                    borderRadius: '12px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Check size={16} />
                  Choose
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
