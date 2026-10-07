import React from 'react';
import {
  Clock,
  Flame,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Sparkles,
  IndianRupee,
  Leaf,
  Drumstick,
  Egg
} from 'lucide-react';

export default function MealCard({
  meal,
  onMarkEaten,
  onSkipMeal,
  onOpenReplace,
  onFeedback
}) {
  const food = meal.food || {};
  const isEaten = meal.is_eaten;
  const isSkipped = meal.is_skipped;

  const getDietIcon = (type) => {
    switch (type) {
      case 'non_vegetarian':
        return <span className="badge badge-nonveg"><Drumstick size={12} /> Non-Veg</span>;
      case 'eggetarian':
        return <span className="badge badge-warning"><Egg size={12} /> Eggetarian</span>;
      case 'vegan':
        return <span className="badge badge-veg"><Leaf size={12} /> Vegan</span>;
      default:
        return <span className="badge badge-veg"><Leaf size={12} /> Veg</span>;
    }
  };

  return (
    <div
      className="glass-panel"
      style={{
        padding: '20px',
        position: 'relative',
        opacity: isSkipped ? 0.6 : 1,
        border: isEaten ? '2px solid #10b981' : isSkipped ? '1px dashed #cbd5e1' : '1px solid var(--border-light)',
        background: isEaten ? 'rgba(236, 253, 245, 0.7)' : 'var(--surface-card)'
      }}
    >
      {/* Header: Title, Suggested Time & Diet Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
              {meal.meal_title || meal.meal_type}
            </h4>
            {getDietIcon(food.dietary_type)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
            <Clock size={13} />
            <span>Suggested: {meal.suggested_time || 'Meal Time'}</span>
          </div>
        </div>

        {/* Cost Tag */}
        {meal.cost_inr > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#d97706',
            background: '#fef3c7',
            padding: '3px 8px',
            borderRadius: '8px'
          }}>
            <IndianRupee size={12} />
            <span>~{Math.round(meal.cost_inr)}</span>
          </div>
        )}
      </div>

      {/* Food Dish Title & Serving Description */}
      <div style={{ marginBottom: '14px' }}>
        <h3 style={{
          fontSize: '1.15rem',
          fontWeight: 700,
          color: '#1e293b',
          lineHeight: 1.3,
          textDecoration: isSkipped ? 'line-through' : 'none'
        }}>
          {food.name || 'Personalized Dish'}
        </h3>
        {food.hindi_name && (
          <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 500, marginTop: '2px' }}>
            {food.hindi_name}
          </div>
        )}
        <div style={{ fontSize: '0.82rem', color: '#059669', fontWeight: 600, marginTop: '4px' }}>
          Portion: {meal.serving_desc || food.serving_size_desc || '1 Standard Serving'}
        </div>
      </div>

      {/* Macro Breakdown Pills */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '6px',
        padding: '10px 12px',
        background: '#f8fafc',
        borderRadius: '12px',
        marginBottom: '16px',
        textAlign: 'center'
      }}>
        <div>
          <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>Cals</div>
          <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#f59e0b' }}>{Math.round(meal.calories)}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>Protein</div>
          <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#10b981' }}>{meal.protein_g}g</div>
        </div>
        <div>
          <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>Carbs</div>
          <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#3b82f6' }}>{meal.carbs_g}g</div>
        </div>
        <div>
          <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>Fat</div>
          <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ec4899' }}>{meal.fat_g}g</div>
        </div>
        <div>
          <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>Fiber</div>
          <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#8b5cf6' }}>{meal.fiber_g}g</div>
        </div>
      </div>

      {/* Allergen alerts if applicable */}
      {food.allergens && food.allergens.length > 0 && (
        <div style={{ fontSize: '0.75rem', color: '#dc2626', marginBottom: '12px', fontWeight: 500 }}>
          ⚠️ Contains: {food.allergens.join(', ')}
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
        <button
          onClick={() => onMarkEaten(meal.id, isEaten ? 'reset' : 'mark_eaten')}
          className={`btn ${isEaten ? 'btn-secondary' : 'btn-primary'}`}
          style={{ flex: 1, padding: '8px 12px', fontSize: '0.82rem' }}
        >
          <CheckCircle2 size={16} />
          {isEaten ? 'Marked Eaten' : 'Mark Eaten'}
        </button>

        <button
          onClick={() => onSkipMeal(meal.id, isSkipped ? 'reset' : 'skip')}
          className="btn btn-secondary"
          style={{ padding: '8px 12px', fontSize: '0.82rem' }}
          title={isSkipped ? 'Unskip meal' : 'Skip meal'}
        >
          <XCircle size={15} />
          {isSkipped ? 'Unskip' : 'Skip'}
        </button>

        <button
          onClick={() => onOpenReplace(meal)}
          className="btn btn-outline"
          style={{ padding: '8px 12px', fontSize: '0.82rem' }}
          title="Replace with macro-compatible alternative"
        >
          <RefreshCw size={14} />
          Replace
        </button>
      </div>
    </div>
  );
}
