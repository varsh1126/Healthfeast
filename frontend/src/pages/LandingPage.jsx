import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  UtensilsCrossed,
  ShieldCheck,
  Heart,
  Activity,
  Camera,
  Layers,
  ShoppingBag,
  Award,
  ArrowRight,
  CheckCircle2,
  Leaf
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Hero Section */}
      <section style={{
        padding: '120px 0 80px 0',
        background: 'radial-gradient(circle at 50% 20%, rgba(16, 185, 129, 0.15) 0%, rgba(248, 250, 252, 0) 70%)',
        textAlign: 'center'
      }}>
        <div className="app-container" style={{ maxWidth: '960px' }}>
          {/* Top Pill Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            padding: '8px 18px',
            borderRadius: '999px',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)',
            marginBottom: '24px'
          }}>
            <Sparkles size={16} color="#059669" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#065f46' }}>
              ICMR-NIN Grounded • AI-Powered Personalized Nutrition
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            marginBottom: '20px'
          }}>
            Your Health. Your Food.<br />
            <span className="text-gradient-emerald">Your Personalized Wellness.</span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: '1.2rem',
            color: '#475569',
            lineHeight: 1.6,
            maxWidth: '720px',
            margin: '0 auto 36px auto'
          }}>
            HealthFeast analyzes your age, fitness goal, dietary preferences, Indian culinary heritage,
            budget, and health constraints to craft scientifically balanced 7-day meal plans and skin-wellness guidance.
          </p>

          {/* Call to Actions */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '1rem' }}>
              <span>Start Free Assessment</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-warm" style={{ padding: '14px 28px', fontSize: '1rem' }}>
              <span>Try Demo Account</span>
            </Link>
          </div>

          {/* Key Value Badges */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '24px',
            flexWrap: 'wrap',
            marginTop: '48px',
            fontSize: '0.85rem',
            color: '#64748b',
            fontWeight: 600
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} color="#10b981" />
              <span>Mifflin-St Jeor BMR & TDEE</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} color="#10b981" />
              <span>Deterministic Allergen Filter</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} color="#10b981" />
              <span>Glow & Skin Wellness Module</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} color="#10b981" />
              <span>AI Vision Food Scanner</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section style={{ padding: '60px 0 100px 0' }}>
        <div className="app-container">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '12px' }}>
              Built for Real Indian Living & Clinical Science
            </h2>
            <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
              We combine strict mathematical nutrition calculation, authoritative national guidelines,
              and adaptive machine learning.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '28px'
          }}>
            {/* Card 1 */}
            <div className="glass-panel" style={{ padding: '32px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: '#ecfdf5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <UtensilsCrossed size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '10px' }}>
                7-Day Personalized Meal Plan
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Full breakfast, lunch, dinner and snacks generated around your caloric and macro targets.
                Swap individual dishes on the fly with macro-compatible Indian recipes.
              </p>
            </div>

            {/* Card 2 */}
            <div className="glass-panel" style={{ padding: '32px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: '#fdf2f8',
                color: '#db2777',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <Sparkles size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '10px' }}>
                Glow & Skin Wellness Module
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Targeted nutritional guidance highlighting Vitamin C, Vitamin A, Zinc, and Omega-3 fatty acids
                that support dermal barrier health, cellular hydration, and natural vitality.
              </p>
            </div>

            {/* Card 3 */}
            <div className="glass-panel" style={{ padding: '32px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <Camera size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '10px' }}>
                AI Food Scanner
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Snap or upload a photo of your meal. Our computer vision analyzes visible dishes, looks up
                approximate nutritional metrics, and lets you verify portions before logging.
              </p>
            </div>

            {/* Card 4 */}
            <div className="glass-panel" style={{ padding: '32px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: '#fef3c7',
                color: '#d97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '10px' }}>
                Deterministic Health Layer
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>
                No fabricated medical rules. Strict deterministic verification eliminates allergens and restricts
                foods contraindicated for Diabetes, Hypertension, PCOS, and Fatty Liver.
              </p>
            </div>

            {/* Card 5 */}
            <div className="glass-panel" style={{ padding: '32px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: '#f5f3ff',
                color: '#7c3aed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <Sparkles size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '10px' }}>
                Ask HealthFeast AI ✨
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>
                An intelligent conversational advisor grounded in your live health context. Ask for fridge ingredient
                recipes, quick high-protein snacks, or pre-workout guidance anytime.
              </p>
            </div>

            {/* Card 6 */}
            <div className="glass-panel" style={{ padding: '32px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: '#ecfeff',
                color: '#0891b2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}>
                <ShoppingBag size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '10px' }}>
                Smart Grocery Generator
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Automatically aggregates ingredients across your 7-day plan, consolidates quantities, removes
                duplicates, and organizes them by Indian market categories.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
