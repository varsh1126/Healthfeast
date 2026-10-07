import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  UtensilsCrossed,
  Compass,
  Activity,
  User,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  Droplet,
  Camera,
  Layers
} from 'lucide-react';

export default function Navbar({ onOpenAI }) {
  const { user, profile, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: Activity, auth: true },
    { name: 'Diet Plan', path: '/diet', icon: UtensilsCrossed, auth: true },
    { name: 'Weekly Plan', path: '/weekly-plan', icon: Layers, auth: true },
    { name: 'Skin & Glow', path: '/skin-wellness', icon: Sparkles, auth: true },
    { name: 'Food Scanner', path: '/scanner', icon: Camera, auth: true },
    { name: 'Track', path: '/progress', icon: Droplet, auth: true },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '76px',
      background: 'rgba(255, 255, 255, 0.92)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      transition: 'all 0.3s ease'
    }}>
      <div className="app-container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
      }}>
        {/* Brand Logo */}
        <Link to={isAuthenticated ? '/dashboard' : '/'} style={{
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #f59e0b 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
          }}>
            <UtensilsCrossed size={22} />
          </div>
          <div>
            <div style={{
              fontSize: '1.35rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              background: 'linear-gradient(135deg, #059669 0%, #0f172a 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1.1
            }}>
              HealthFeast
            </div>
            <div style={{
              fontSize: '0.68rem',
              fontWeight: 600,
              color: '#64748b',
              letterSpacing: '0.02em'
            }}>
              Your Health. Your Food.
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        {isAuthenticated && (
          <nav style={{
            display: 'none',
            alignItems: 'center',
            gap: '6px'
          }} className="desktop-nav">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    fontSize: '0.88rem',
                    fontWeight: active ? 700 : 500,
                    color: active ? '#059669' : '#475569',
                    background: active ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Icon size={16} color={active ? '#059669' : '#64748b'} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Actions Area: Ask AI Button & User Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Ask HealthFeast AI ✨ Glowing Button */}
          {isAuthenticated && (
            <button
              onClick={onOpenAI}
              className="btn btn-ai"
              style={{
                padding: '8px 16px',
                fontSize: '0.88rem',
                borderRadius: '12px',
                border: 'none',
              }}
              title="Open Ask HealthFeast AI Assistant"
            >
              <Sparkles size={16} />
              <span style={{ fontWeight: 700 }}>Ask HealthFeast ✨</span>
            </button>
          )}

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link
                to="/settings"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  textDecoration: 'none',
                  padding: '6px 12px',
                  borderRadius: '10px',
                  background: '#f1f5f9',
                  color: '#1e293b',
                  fontSize: '0.85rem',
                  fontWeight: 600
                }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: '#10b981',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 700
                }}>
                  {user?.first_name ? user.first_name[0].toUpperCase() : 'U'}
                </div>
                <span className="user-name-label">{user?.first_name || user?.username}</span>
              </Link>

              <button
                onClick={handleLogout}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  padding: '8px',
                  cursor: 'pointer',
                  borderRadius: '8px'
                }}
                title="Sign out"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link to="/login" className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.88rem' }}>
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '0.88rem' }}>
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Hamburger toggle */}
          {isAuthenticated && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'none',
                background: 'transparent',
                border: 'none',
                color: '#334155',
                cursor: 'pointer',
                padding: '6px'
              }}
              className="mobile-nav-toggle"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && isAuthenticated && (
        <div style={{
          position: 'absolute',
          top: '76px',
          left: 0,
          right: 0,
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid #e2e8f0',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
        }}>
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontWeight: 600,
                  color: isActive(item.path) ? '#059669' : '#334155',
                  background: isActive(item.path) ? '#ecfdf5' : 'transparent'
                }}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
          <div style={{ height: '1px', background: '#e2e8f0', margin: '6px 0' }} />
          <Link
            to="/admin"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              borderRadius: '10px',
              textDecoration: 'none',
              fontWeight: 600,
              color: '#6366f1'
            }}
          >
            <ShieldCheck size={18} />
            Admin Dashboard
          </Link>
        </div>
      )}

      {/* Responsive styles */}
      <style>{`
        @media (min-width: 900px) {
          .desktop-nav { display: flex !important; }
        }
        @media (max-width: 899px) {
          .mobile-nav-toggle { display: block !important; }
          .user-name-label { display: none; }
        }
      `}</style>
    </header>
  );
}
