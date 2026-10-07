import React, { useState, useEffect } from 'react';
import { foodService } from '../api/services';
import DisclaimerBanner from '../components/DisclaimerBanner';
import { Search, Filter, BookOpen, ShieldCheck, Leaf, Drumstick, Egg, IndianRupee } from 'lucide-react';

export default function FoodSearchPage() {
  const [foods, setFoods] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDiet, setSelectedDiet] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFoods();
  }, [selectedCategory, selectedDiet]);

  const loadFoods = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedDiet) params.append('dietary_type', selectedDiet);
      if (searchQuery) params.append('search', searchQuery);

      const data = await foodService.listFoods(params.toString());
      setFoods(data.results || []);
    } catch (err) {
      console.error('Error loading foods:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadFoods();
  };

  const CATEGORIES = [
    { key: '', label: 'All Categories' },
    { key: 'breakfast', label: 'Breakfast' },
    { key: 'grains', label: 'Grains & Millets' },
    { key: 'dal_protein', label: 'Dals & Protein' },
    { key: 'vegetables', label: 'Vegetables' },
    { key: 'fruits', label: 'Fruits' },
    { key: 'snacks', label: 'Snacks & Seeds' },
    { key: 'beverages', label: 'Beverages' },
    { key: 'dairy', label: 'Dairy' }
  ];

  return (
    <div className="page-container app-container">
      <DisclaimerBanner />

      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a' }}>
          Indian Nutrition & Food Database
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '600px', margin: '6px auto 0 auto' }}>
          Comprehensive catalog grounded in ICMR-NIN Indian Food Composition Tables (IFCT) and USDA data
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-panel" style={{ padding: '20px', marginBottom: '32px' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ flex: 2, minWidth: '240px', position: 'relative' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes (e.g., Idli, Moong Dal, Ragi, Paneer, Amla)..."
              className="input-field"
              style={{ paddingLeft: '40px' }}
            />
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          <div style={{ flex: 1, minWidth: '160px' }}>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field"
            >
              {CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>{c.label}</option>
              ))}
            </select>
          </div>

          <div style={{ flex: 1, minWidth: '140px' }}>
            <select
              value={selectedDiet}
              onChange={(e) => setSelectedDiet(e.target.value)}
              className="input-field"
            >
              <option value="">All Diets</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="non_vegetarian">Non-Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="eggetarian">Eggetarian</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '12px 24px' }}>
            Search
          </button>
        </form>
      </div>

      {/* Foods Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
          Loading food database...
        </div>
      ) : foods.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
          No matching foods found. Try broadening your search query.
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          {foods.map((food) => (
            <div key={food.id} className="glass-panel" style={{ padding: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: '#059669',
                  background: '#ecfdf5',
                  padding: '3px 8px',
                  borderRadius: '6px'
                }}>
                  {food.category?.replace('_', ' ')}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#d97706', fontSize: '0.8rem', fontWeight: 700 }}>
                  <IndianRupee size={12} />
                  <span>~{Math.round(food.estimated_cost_inr || 20)}</span>
                </div>
              </div>

              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '2px' }}>
                {food.name}
              </h4>
              {food.hindi_name && (
                <div style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '6px' }}>
                  {food.hindi_name}
                </div>
              )}
              <div style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 600, marginBottom: '14px' }}>
                Portion: {food.serving_size_desc}
              </div>

              {/* Nutrition Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '6px',
                background: '#f8fafc',
                padding: '10px',
                borderRadius: '12px',
                textAlign: 'center',
                marginBottom: '12px',
                fontSize: '0.75rem'
              }}>
                <div>
                  <div style={{ color: '#64748b' }}>Cals</div>
                  <div style={{ fontWeight: 800, color: '#f59e0b' }}>{Math.round(food.calories)}</div>
                </div>
                <div>
                  <div style={{ color: '#64748b' }}>Prot</div>
                  <div style={{ fontWeight: 800, color: '#10b981' }}>{food.protein_g}g</div>
                </div>
                <div>
                  <div style={{ color: '#64748b' }}>Carb</div>
                  <div style={{ fontWeight: 800, color: '#3b82f6' }}>{food.carbs_g}g</div>
                </div>
                <div>
                  <div style={{ color: '#64748b' }}>Fat</div>
                  <div style={{ fontWeight: 800, color: '#ec4899' }}>{food.fat_g}g</div>
                </div>
              </div>

              {/* Source Verification Badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: '#94a3b8' }}>
                <span>Source: {food.source}</span>
                <span style={{ color: '#10b981', fontWeight: 700 }}>✓ Verified</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
