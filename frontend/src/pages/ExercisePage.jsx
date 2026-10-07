import React, { useState, useEffect } from 'react';
import { trackingService } from '../api/services';
import DisclaimerBanner from '../components/DisclaimerBanner';
import { Activity, Flame, Clock, Plus, TrendingUp, CheckCircle2 } from 'lucide-react';

export default function ExercisePage() {
  const [exerciseData, setExerciseData] = useState({ today_burned_kcal: 0, logs: [] });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    activity_type: 'brisk_walking',
    duration_mins: 30,
    intensity: 'moderate',
    calories_burned_est: 140
  });

  useEffect(() => {
    loadExerciseLogs();
  }, []);

  const loadExerciseLogs = async () => {
    setLoading(true);
    try {
      const data = await trackingService.getExercise();
      setExerciseData(data);
    } catch (err) {
      console.error('Error loading exercise data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDurationChange = (mins) => {
    // Basic approximate calorie formula: ~4-8 kcal/min depending on activity
    const rate = formData.activity_type.includes('running') || formData.activity_type.includes('hiit')
      ? 8.5
      : formData.activity_type.includes('strength')
      ? 6.0
      : 4.5;
    setFormData({
      ...formData,
      duration_mins: mins,
      calories_burned_est: Math.round(mins * rate)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await trackingService.logExercise(formData);
      await loadExerciseLogs();
    } catch (err) {
      console.error('Failed to log exercise:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container app-container" style={{ maxWidth: '880px' }}>
      <DisclaimerBanner text="Physical activity guidelines are for general fitness and stamina. HealthFeast does not provide clinical rehabilitation or orthopedic treatment." />

      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a' }}>
          Exercise & Activity Tracker
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
          Track daily movement to maintain metabolic flexibility and cardiometabolic vitality
        </p>
      </div>

      {/* Burned Metric Banner */}
      <div className="glass-panel" style={{
        padding: '24px',
        marginBottom: '32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'linear-gradient(135deg, rgba(254, 243, 199, 0.7) 0%, rgba(255, 255, 255, 0.9) 100%)',
        border: '1px solid #fde68a'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', background: '#f59e0b', color: 'white', borderRadius: '16px' }}>
            <Flame size={28} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#b45309' }}>
              Today's Active Energy Output
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>
              {Math.round(exerciseData.today_burned_kcal)} kcal burned
            </div>
          </div>
        </div>
      </div>

      {/* Log Workout Form */}
      <div className="glass-panel" style={{ padding: '28px', marginBottom: '36px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '20px' }}>
          Log Workout Session
        </h3>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', alignItems: 'flex-end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
              Activity
            </label>
            <select
              value={formData.activity_type}
              onChange={(e) => setFormData({ ...formData, activity_type: e.target.value })}
              className="input-field"
            >
              <option value="brisk_walking">Brisk Walking</option>
              <option value="running">Jogging / Running</option>
              <option value="yoga">Yoga / Surya Namaskar</option>
              <option value="strength_training">Strength Training / Gym</option>
              <option value="cycling">Cycling</option>
              <option value="swimming">Swimming</option>
              <option value="hiit">HIIT Cardio</option>
              <option value="mobility">Mobility & Stretching</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
              Duration (Minutes)
            </label>
            <input
              type="number"
              min="5"
              max="240"
              value={formData.duration_mins}
              onChange={(e) => handleDurationChange(Number(e.target.value))}
              className="input-field"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
              Est. Energy Burn (kcal)
            </label>
            <input
              type="number"
              value={formData.calories_burned_est}
              onChange={(e) => setFormData({ ...formData, calories_burned_est: Number(e.target.value) })}
              className="input-field"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
            style={{ padding: '12px', borderRadius: '12px' }}
          >
            <Plus size={16} />
            <span>{submitting ? 'Logging...' : 'Save Workout'}</span>
          </button>
        </form>
      </div>

      {/* Workout History */}
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px' }}>
          Recent Workout History
        </h3>

        {exerciseData.logs.length === 0 ? (
          <div className="glass-panel" style={{ padding: '36px', textAlign: 'center', color: '#64748b' }}>
            No workouts logged yet. Start moving and log your first session above!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {exerciseData.logs.map((log) => (
              <div
                key={log.id}
                className="glass-panel"
                style={{
                  padding: '16px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                    {log.activity_type.replace('_', ' ').toUpperCase()}
                  </h4>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    {log.date} • {log.duration_mins} minutes
                  </div>
                </div>

                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f59e0b' }}>
                  {Math.round(log.calories_burned_est)} kcal
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
