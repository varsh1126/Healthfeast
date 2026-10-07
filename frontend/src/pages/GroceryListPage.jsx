import React, { useState, useEffect } from 'react';
import { groceryService } from '../api/services';
import DisclaimerBanner from '../components/DisclaimerBanner';
import { ShoppingBag, CheckSquare, Square, Printer, IndianRupee, Layers, Check } from 'lucide-react';

export default function GroceryListPage() {
  const [groceryData, setGroceryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGroceryList();
  }, []);

  const loadGroceryList = async () => {
    setLoading(true);
    try {
      const data = await groceryService.getGroceryList();
      setGroceryData(data);
    } catch (err) {
      console.error('Error loading grocery list:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleItem = async (itemId) => {
    if (!groceryData?.all_items) return;
    const updatedAll = groceryData.all_items.map((item) =>
      item.id === itemId ? { ...item, checked: !item.checked } : item
    );

    // Re-group
    const updatedCategories = {};
    updatedAll.forEach((item) => {
      const cat = item.category;
      if (!updatedCategories[cat]) updatedCategories[cat] = [];
      updatedCategories[cat].push(item);
    });

    const updatedPayload = {
      ...groceryData,
      all_items: updatedAll,
      categorized_items: updatedCategories
    };

    setGroceryData(updatedPayload);
    try {
      await groceryService.updateGroceryList(updatedPayload);
    } catch (err) {
      console.error('Error updating grocery items:', err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="page-container app-container" style={{ textAlign: 'center', padding: '140px 0' }}>
        <div style={{
          width: '36px',
          height: '36px',
          border: '3px solid #10b981',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          margin: '0 auto 16px auto',
          animation: 'spin 1s linear infinite'
        }} />
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Aggregating 7-Day Plan Ingredients...</h3>
      </div>
    );
  }

  const categorized = groceryData?.categorized_items || {};
  const totalCost = groceryData?.estimated_weekly_cost_inr || 0;
  const totalItems = groceryData?.total_items || 0;

  return (
    <div className="page-container app-container" style={{ maxWidth: '880px' }}>
      <DisclaimerBanner />

      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '32px'
      }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a' }}>
            Smart Grocery List
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Consolidated ingredients and quantities extracted from your active 7-day meal plan
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="btn btn-outline"
          style={{ padding: '10px 20px', borderRadius: '12px' }}
        >
          <Printer size={16} />
          <span>Print / Save List</span>
        </button>
      </div>

      {/* Summary Banner */}
      <div className="glass-panel" style={{
        padding: '24px',
        marginBottom: '32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
            Weekly Shopping Basket
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
            {totalItems} Unique Items
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
            Estimated Weekly Food Expense
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '2px', justifyContent: 'flex-end' }}>
            <IndianRupee size={18} />
            <span>~{totalCost}</span>
          </div>
        </div>
      </div>

      {/* Categorized Checklist */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', marginBottom: '40px' }}>
        {Object.entries(categorized).map(([categoryName, items]) => (
          <div key={categoryName} className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{
              fontSize: '1.15rem',
              fontWeight: 800,
              color: '#0f172a',
              marginBottom: '16px',
              paddingBottom: '10px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <ShoppingBag size={18} color="#059669" />
              <span>{categoryName}</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>
                ({items.length} items)
              </span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleToggleItem(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: item.checked ? '#f8fafc' : '#ffffff',
                    border: '1px solid #e2e8f0',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    opacity: item.checked ? 0.6 : 1
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ color: item.checked ? '#10b981' : '#cbd5e1' }}>
                      {item.checked ? <CheckSquare size={20} /> : <Square size={20} />}
                    </div>
                    <div>
                      <div style={{
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        color: '#1e293b',
                        textDecoration: item.checked ? 'line-through' : 'none'
                      }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        Required: <strong>{item.quantity_display}</strong>
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#d97706' }}>
                    ~₹{item.total_cost_est}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
