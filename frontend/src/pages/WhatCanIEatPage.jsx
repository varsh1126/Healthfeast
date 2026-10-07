import React, { useState } from 'react';
import { dietService } from '../api/services';
import DisclaimerBanner from '../components/DisclaimerBanner';
import { UtensilsCrossed, Plus, X, Sparkles, ChefHat, Check, ArrowRight } from 'lucide-react';

export default function WhatCanIEatPage() {
  const [ingredients, setIngredients] = useState(['eggs', 'rice', 'tomatoes']);
  const [currentInput, setCurrentInput] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleAddIngredient = (e) => {
    e.preventDefault();
    if (currentInput.trim() && !ingredients.includes(currentInput.trim().toLowerCase())) {
      setIngredients([...ingredients, currentInput.trim().toLowerCase()]);
      setCurrentInput('');
    }
  };

  const handleRemove = (ing) => {
    setIngredients(ingredients.filter((i) => i !== ing));
  };

  const handleSearch = async () => {
    if (ingredients.length === 0) return;
    setLoading(true);
    setHasSearched(true);
    try {
      const budgetVal = maxBudget ? Number(maxBudget) : null;
      const data = await dietService.matchPantry(ingredients, budgetVal);
      setResults(data.results || []);
    } catch (err) {
      console.error('Pantry match error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container app-container" style={{ maxWidth: '920px' }}>
      <DisclaimerBanner />

      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: '#fef3c7',
          color: '#d97706',
          padding: '6px 16px',
          borderRadius: '999px',
          fontSize: '0.82rem',
          fontWeight: 700,
          marginBottom: '12px'
        }}>
          <ChefHat size={14} />
          <span>Smart Fridge & Pantry Matcher</span>
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0f172a' }}>
          What Can I Eat?
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '600px', margin: '8px auto 0 auto' }}>
          Input ingredients you have on hand. HealthFeast recommends healthy, profile-compliant Indian dishes you can make right now.
        </p>
      </div>

      {/* Input Box */}
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '36px' }}>
        <form onSubmit={handleAddIngredient} style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
          <input
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            placeholder="Type ingredient (e.g. paneer, palak, oats, curd, moong dal) and hit enter..."
            className="input-field"
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn btn-secondary" style={{ padding: '0 20px' }}>
            <Plus size={18} />
            <span>Add</span>
          </button>
        </form>

        {/* Selected Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
          {ingredients.map((ing) => (
            <span
              key={ing}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#ecfdf5',
                color: '#065f46',
                border: '1px solid #a7f3d0',
                padding: '6px 14px',
                borderRadius: '999px',
                fontSize: '0.85rem',
                fontWeight: 600
              }}
            >
              <span>{ing}</span>
              <button
                type="button"
                onClick={() => handleRemove(ing)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#059669', display: 'flex' }}
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>

        {/* Budget Optional Filter & Submit */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>Max Budget (₹):</label>
            <input
              type="number"
              placeholder="e.g. 50"
              value={maxBudget}
              onChange={(e) => setMaxBudget(e.target.value)}
              className="input-field"
              style={{ width: '120px', padding: '8px 12px' }}
            />
          </div>

          <button
            type="button"
            onClick={handleSearch}
            disabled={loading || ingredients.length === 0}
            className="btn btn-primary"
            style={{ marginLeft: 'auto', padding: '12px 28px' }}
          >
            <Sparkles size={16} />
            <span>{loading ? 'Matching Pantry...' : 'Find Compatible Dishes'}</span>
          </button>
        </div>
      </div>

      {/* Results */}
      {hasSearched && (
        <div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '20px' }}>
            Recommended Matches ({results.length})
          </h3>

          {results.length === 0 ? (
            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
              No exact recipe matches found with these ingredients. Try adding staples like dal, rice, or spices!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {results.map((item, idx) => {
                const f = item.food;
                return (
                  <div key={idx} className="glass-panel" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                            {f.name}
                          </h4>
                          <span style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '6px',
                            background: '#ecfdf5',
                            color: '#059669'
                          }}>
                            {item.match_percentage}% Ingredient Match
                          </span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 600, marginTop: '2px' }}>
                          {item.recipe_tip}
                        </p>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f59e0b' }}>
                          {Math.round(f.calories)} kcal
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                          {f.protein_g}g protein
                        </div>
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      flexWrap: 'wrap',
                      marginTop: '12px',
                      fontSize: '0.78rem',
                      color: '#475569'
                    }}>
                      <span>Matched ingredients: <strong>{item.matched_ingredients?.join(', ')}</strong></span>
                      <span>• Portion: {f.serving_size_desc}</span>
                      <span>• Prep time: ~{f.preparation_time_mins} mins</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
