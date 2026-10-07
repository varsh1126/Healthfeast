import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, BookOpen, Heart, ExternalLink, Leaf } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      background: '#ffffff',
      borderTop: '1px solid #e2e8f0',
      padding: '48px 0 24px 0',
      marginTop: 'auto'
    }}>
      <div className="app-container">
        {/* Top Disclaimer Card */}
        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '20px 24px',
          marginBottom: '36px',
          display: 'flex',
          gap: '16px',
          alignItems: 'flex-start'
        }}>
          <div style={{
            padding: '8px',
            borderRadius: '10px',
            background: '#fee2e2',
            color: '#dc2626'
          }}>
            <ShieldAlert size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>
              Educational Health & Nutrition Guidance Disclaimer
            </h4>
            <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.6 }}>
              HealthFeast provides personalized dietary estimates, macronutrient targets, and lifestyle wellness recommendations
              grounded in accepted scientific models (Mifflin-St Jeor, ICMR-NIN 2024 guidelines). <strong>HealthFeast does not diagnose medical conditions,
              prescribe pharmacological treatments, or replace direct clinical consultation with a qualified medical doctor or registered clinical dietitian.</strong>
              Always seek the advice of your physician before commencing drastic caloric changes or altering prescribed regimens.
            </p>
          </div>
        </div>

        {/* Links Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '32px',
          marginBottom: '40px'
        }}>
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                background: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <Leaf size={16} />
              </div>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>HealthFeast</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6, marginBottom: '16px' }}>
              “Your Health. Your Food. Your Personalized Wellness.”
              AI-powered personalized nutrition and skin wellness system rooted in authentic Indian culinary heritage.
            </p>
          </div>

          {/* Core Modules */}
          <div>
            <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
              Core Modules
            </h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
              <li><Link to="/diet" style={{ color: '#64748b', textDecoration: 'none' }}>Personalized Diet Plan</Link></li>
              <li><Link to="/weekly-plan" style={{ color: '#64748b', textDecoration: 'none' }}>7-Day Weekly Meal Planner</Link></li>
              <li><Link to="/skin-wellness" style={{ color: '#64748b', textDecoration: 'none' }}>Glow & Skin Wellness</Link></li>
              <li><Link to="/scanner" style={{ color: '#64748b', textDecoration: 'none' }}>AI Food Scanner</Link></li>
              <li><Link to="/grocery" style={{ color: '#64748b', textDecoration: 'none' }}>Smart Grocery Generator</Link></li>
            </ul>
          </div>

          {/* Authoritative Sources */}
          <div>
            <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
              Authoritative Grounding
            </h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
              <li>
                <a href="https://www.nin.res.in" target="_blank" rel="noopener noreferrer" style={{ color: '#64748b', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  ICMR - National Institute of Nutrition <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a href="https://www.who.int/news-room/fact-sheets/detail/healthy-diet" target="_blank" rel="noopener noreferrer" style={{ color: '#64748b', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  WHO Healthy Diet Factsheet <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a href="https://www.fssai.gov.in" target="_blank" rel="noopener noreferrer" style={{ color: '#64748b', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  FSSAI Food Safety Standards <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a href="https://fdc.nal.usda.gov" target="_blank" rel="noopener noreferrer" style={{ color: '#64748b', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  USDA FoodData Central <ExternalLink size={12} />
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Access */}
          <div>
            <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
              System & Governance
            </h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
              <li><Link to="/admin" style={{ color: '#64748b', textDecoration: 'none' }}>Admin Dashboard</Link></li>
              <li><Link to="/settings" style={{ color: '#64748b', textDecoration: 'none' }}>Account & Profile Settings</Link></li>
              <li><Link to="/progress" style={{ color: '#64748b', textDecoration: 'none' }}>Health Trends & Analytics</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div style={{
          borderTop: '1px solid #f1f5f9',
          paddingTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.8rem',
          color: '#94a3b8'
        }}>
          <div>
            © {new Date().getFullYear()} HealthFeast System. All rights reserved. Built for science-based wellness.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>Crafted with</span>
            <Heart size={14} color="#f43f5e" fill="#f43f5e" />
            <span>for personalized nutrition</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
