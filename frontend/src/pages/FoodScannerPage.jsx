import React, { useState } from 'react';
import { scannerService, trackingService } from '../api/services';
import DisclaimerBanner from '../components/DisclaimerBanner';
import {
  Camera,
  Upload,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Info,
  Flame,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';

const SAMPLE_PRESETS = [
  { name: 'Masala Dosa with Sambar', filename: 'masala_dosa.jpg' },
  { name: 'Steamed Idli with Chutney', filename: 'idli_sambar.jpg' },
  { name: 'Dal Rice with Sabzi', filename: 'dal_rice.jpg' },
  { name: 'Whole Wheat Roti & Sabzi', filename: 'roti_sabzi.jpg' },
  { name: 'Sprouted Moong Salad', filename: 'sprouts_chaat.jpg' },
];

export default function FoodScannerPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  // Editable parameters
  const [editedFoodName, setEditedFoodName] = useState('');
  const [portionMultiplier, setPortionMultiplier] = useState(1.0);
  const [mealType, setMealType] = useState('lunch');

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
      setScanResult(null);
      setConfirmed(false);
      setError('');
    }
  };

  const handleScan = async (fileToScan) => {
    const file = fileToScan || selectedFile;
    if (!file) {
      setError('Please select or upload a food photo first.');
      return;
    }

    setScanning(true);
    setError('');
    setScanResult(null);

    try {
      const result = await scannerService.scanImage(file);
      setScanResult(result);
      setEditedFoodName(result.detected_food_name);
      setPortionMultiplier(result.portion_multiplier || 1.0);
      if (result.category) {
        setMealType(result.category.toLowerCase());
      }
    } catch (err) {
      setError('Vision recognition failed. Please try another image or preset.');
    } finally {
      setScanning(false);
    }
  };

  const handlePresetSelect = (preset) => {
    // Create mock image blob
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#10b981';
    ctx.fillRect(0, 0, 100, 100);
    canvas.toBlob((blob) => {
      const file = new File([blob], preset.filename, { type: 'image/jpeg' });
      setSelectedFile(file);
      setImagePreview(null);
      setConfirmed(false);
      handleScan(file);
    }, 'image/jpeg');
  };

  const handleConfirmAndLog = async () => {
    if (!scanResult) return;
    try {
      const payload = {
        food_name: editedFoodName,
        meal_type: mealType,
        portion_size: `${portionMultiplier}x (${scanResult.estimated_portion})`,
        calories: Math.round(scanResult.calories * portionMultiplier),
        protein_g: roundOne(scanResult.protein_g * portionMultiplier),
        carbs_g: roundOne(scanResult.carbs_g * portionMultiplier),
        fat_g: roundOne(scanResult.fat_g * portionMultiplier),
        fiber_g: roundOne(scanResult.fiber_g * portionMultiplier),
        source: 'scanner',
        notes: `Identified by ${scanResult.source}`
      };

      await trackingService.logMeal(payload);
      setConfirmed(true);
      try {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      } catch {}
    } catch (err) {
      setError('Failed to log meal. Please try again.');
    }
  };

  const roundOne = (val) => Math.round((val || 0) * 10) / 10;

  return (
    <div className="page-container app-container" style={{ maxWidth: '920px' }}>
      <DisclaimerBanner text="AI food recognition provides approximate estimates based on visual features. Portions and unseen cooking oils cannot be measured with absolute precision. Please review before confirming." />

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: '#eff6ff',
          color: '#2563eb',
          padding: '6px 16px',
          borderRadius: '999px',
          fontSize: '0.82rem',
          fontWeight: 700,
          marginBottom: '12px'
        }}>
          <Camera size={14} />
          <span>Multimodal Vision Nutrition Analyzer</span>
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0f172a' }}>
          AI Food Scanner
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '600px', margin: '8px auto 0 auto' }}>
          Photograph your plate or upload an image to identify dishes, estimate calories, and verify your log.
        </p>
      </div>

      {error && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#b91c1c',
          padding: '14px',
          borderRadius: '12px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Upload Zone & Presets Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '32px',
        marginBottom: '40px'
      }}>
        {/* Left: Upload Box */}
        <div className="glass-panel" style={{ padding: '32px', textAlign: 'center' }}>
          <div style={{
            border: '2px dashed #cbd5e1',
            borderRadius: '20px',
            padding: '36px 20px',
            background: '#f8fafc',
            marginBottom: '20px',
            position: 'relative'
          }}>
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Uploaded meal"
                style={{
                  maxHeight: '220px',
                  borderRadius: '12px',
                  objectFit: 'cover',
                  margin: '0 auto',
                  display: 'block'
                }}
              />
            ) : (
              <div>
                <Camera size={44} color="#94a3b8" style={{ margin: '0 auto 12px auto' }} />
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Select or Snap Food Image
                </h4>
                <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
                  Supports JPEG, PNG, WebP
                </p>
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0,
                cursor: 'pointer'
              }}
            />
          </div>

          <button
            onClick={() => handleScan()}
            disabled={scanning || !selectedFile}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', fontSize: '0.95rem' }}
          >
            <Sparkles size={16} />
            <span>{scanning ? 'Analyzing with Vision AI...' : 'Scan & Identify Food'}</span>
          </button>
        </div>

        {/* Right: Instant Test Presets */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '8px', color: '#0f172a' }}>
            Try Instant Indian Food Presets
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px' }}>
            Click any common Indian meal to test visual identification and nutritional calculations immediately:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {SAMPLE_PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => handlePresetSelect(preset)}
                className="btn btn-secondary"
                style={{
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  fontSize: '0.88rem'
                }}
              >
                <span>{preset.name}</span>
                <ArrowRight size={14} color="#64748b" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recognition Results & Confirmation Card */}
      {scanResult && (
        <div className="glass-panel" style={{
          padding: '32px',
          border: '1.5px solid #10b981',
          background: '#ffffff',
          marginBottom: '40px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <div>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#059669',
                background: '#ecfdf5',
                padding: '4px 10px',
                borderRadius: '6px'
              }}>
                Identified via {scanResult.source}
              </span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginTop: '6px' }}>
                Detected: {scanResult.detected_food_name}
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Confidence: {Math.round((scanResult.confidence_score || 0.9) * 100)}% • {scanResult.visual_observations}
              </p>
            </div>
          </div>

          {/* User Confirmation & Portion Adjustments */}
          <div style={{
            background: '#f8fafc',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Dish Title (Editable)
              </label>
              <input
                type="text"
                value={editedFoodName}
                onChange={(e) => setEditedFoodName(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Portion Multiplier
              </label>
              <select
                value={portionMultiplier}
                onChange={(e) => setPortionMultiplier(Number(e.target.value))}
                className="input-field"
              >
                <option value={0.5}>0.5x (Half Portion)</option>
                <option value={1.0}>1.0x (Standard Serving)</option>
                <option value={1.5}>1.5x (Large Serving)</option>
                <option value={2.0}>2.0x (Double Portion)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Meal Category
              </label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                className="input-field"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snacks">Snack</option>
              </select>
            </div>
          </div>

          {/* Recalculated Macros Display */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
            gap: '12px',
            padding: '16px',
            background: '#f1f5f9',
            borderRadius: '14px',
            textAlign: 'center',
            marginBottom: '24px'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Calories</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f59e0b' }}>
                {Math.round(scanResult.calories * portionMultiplier)} kcal
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Protein</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>
                {roundOne(scanResult.protein_g * portionMultiplier)}g
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Carbs</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#3b82f6' }}>
                {roundOne(scanResult.carbs_g * portionMultiplier)}g
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Fat</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ec4899' }}>
                {roundOne(scanResult.fat_g * portionMultiplier)}g
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Fiber</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#8b5cf6' }}>
                {roundOne(scanResult.fiber_g * portionMultiplier)}g
              </div>
            </div>
          </div>

          {/* Confirm Button */}
          {confirmed ? (
            <div style={{
              background: '#ecfdf5',
              color: '#065f46',
              padding: '14px',
              borderRadius: '12px',
              textAlign: 'center',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              <CheckCircle2 size={18} color="#059669" />
              <span>Confirmed & Logged to Your Today's Food Diary!</span>
            </div>
          ) : (
            <button
              onClick={handleConfirmAndLog}
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '1rem', borderRadius: '14px' }}
            >
              <CheckCircle2 size={18} />
              <span>Confirm & Log to Food Diary</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
