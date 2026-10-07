import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AskAIAssistantDrawer from './components/AskAIAssistantDrawer';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OnboardingPage from './pages/OnboardingPage';
import HealthAnalysisPage from './pages/HealthAnalysisPage';
import DashboardPage from './pages/DashboardPage';
import PersonalizedDietPage from './pages/PersonalizedDietPage';
import WeeklyPlanPage from './pages/WeeklyPlanPage';
import GoalDietPage from './pages/GoalDietPage';
import SkinWellnessPage from './pages/SkinWellnessPage';
import FoodScannerPage from './pages/FoodScannerPage';
import FoodSearchPage from './pages/FoodSearchPage';
import WhatCanIEatPage from './pages/WhatCanIEatPage';
import GroceryListPage from './pages/GroceryListPage';
import ExercisePage from './pages/ExercisePage';
import HydrationPage from './pages/HydrationPage';
import ProgressPage from './pages/ProgressPage';
import SettingsPage from './pages/SettingsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#059669',
        fontWeight: 700
      }}>
        Loading HealthFeast Portal...
      </div>
    );
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AppContent() {
  const [isAIDrawerOpen, setIsAIDrawerOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar onOpenAI={() => setIsAIDrawerOpen(true)} />

      <main style={{ flex: 1 }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <OnboardingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/health-analysis"
            element={
              <ProtectedRoute>
                <HealthAnalysisPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage onOpenAI={() => setIsAIDrawerOpen(true)} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/diet"
            element={
              <ProtectedRoute>
                <PersonalizedDietPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/weekly-plan"
            element={
              <ProtectedRoute>
                <WeeklyPlanPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/goals"
            element={
              <ProtectedRoute>
                <GoalDietPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/skin-wellness"
            element={
              <ProtectedRoute>
                <SkinWellnessPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/scanner"
            element={
              <ProtectedRoute>
                <FoodScannerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/foods"
            element={
              <ProtectedRoute>
                <FoodSearchPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/what-can-i-eat"
            element={
              <ProtectedRoute>
                <WhatCanIEatPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/grocery"
            element={
              <ProtectedRoute>
                <GroceryListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exercise"
            element={
              <ProtectedRoute>
                <ExercisePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hydration"
            element={
              <ProtectedRoute>
                <HydrationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/progress"
            element={
              <ProtectedRoute>
                <ProgressPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />

      {/* Persistent Ask HealthFeast AI Drawer */}
      <AskAIAssistantDrawer
        isOpen={isAIDrawerOpen}
        onClose={() => setIsAIDrawerOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}
